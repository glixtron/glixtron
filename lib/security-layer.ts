/**
 * Multi-Layer Security System
 * Onion Architecture with Advanced Protection
 */

import { NextRequest, NextResponse } from 'next/server'

export interface SecurityConfig {
  waf: {
    enabled: boolean
    maxRequestsPerMinute: number
    maxRequestsPerHour: number
    blockSuspiciousPatterns: boolean
    whitelistIPs: string[]
    blacklistIPs: string[]
  }
  ddos: {
    enabled: boolean
    maxConcurrentConnections: number
    connectionTimeout: number
    enableChallenge: boolean
  }
  api: {
    enableRateLimiting: boolean
    maxRequestsPerEndpoint: number
    enableJWTValidation: boolean
    enableInputSanitization: boolean
    enableCSRFProtection: boolean
  }
  monitoring: {
    enableLogging: boolean
    enableAlerts: boolean
    logLevel: 'debug' | 'info' | 'warn' | 'error'
    alertThresholds: {
      suspiciousActivity: number
      failedLogins: number
      sqlAttempts: number
    }
  }
}

interface RateLimitData {
  count: number
  resetTime: number
  lastRequest: number
}

export class SecurityLayer {
  private static instance: SecurityLayer
  private config: SecurityConfig
  private rateLimitStore: Map<string, RateLimitData>
  private blockedIPs: Set<string>
  private suspiciousIPs: Map<string, { count: number; lastActivity: number }>
  private securityLogs: Array<{
    timestamp: string
    level: string
    event: string
    ip: string
    userAgent: string
    details: any
  }>

  private constructor() {
    this.config = {
      waf: {
        enabled: true,
        maxRequestsPerMinute: 100,
        maxRequestsPerHour: 1000,
        blockSuspiciousPatterns: true,
        whitelistIPs: ['127.0.0.1', '::1'], // Localhost
        blacklistIPs: []
      },
      ddos: {
        enabled: true,
        maxConcurrentConnections: 100,
        connectionTimeout: 30000,
        enableChallenge: true
      },
      api: {
        enableRateLimiting: true,
        maxRequestsPerEndpoint: 60,
        enableJWTValidation: true,
        enableInputSanitization: true,
        enableCSRFProtection: true
      },
      monitoring: {
        enableLogging: true,
        enableAlerts: true,
        logLevel: 'info',
        alertThresholds: {
          suspiciousActivity: 10,
          failedLogins: 5,
          sqlAttempts: 3
        }
      }
    }
    
    this.rateLimitStore = new Map()
    this.blockedIPs = new Set()
    this.suspiciousIPs = new Map()
    this.securityLogs = []
  }

  static getInstance(): SecurityLayer {
    if (!SecurityLayer.instance) {
      SecurityLayer.instance = new SecurityLayer()
    }
    return SecurityLayer.instance
  }

  /**
   * Layer 1: Network Security - IP Filtering and Rate Limiting
   */
  async checkNetworkSecurity(request: NextRequest): Promise<{ allowed: boolean; reason?: string }> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    
    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      await this.logSecurityEvent('BLOCKED_IP', 'IP address is blocked', ip, userAgent)
      return { allowed: false, reason: 'IP blocked' }
    }

    // Check whitelist
    if (this.config.waf.whitelistIPs.includes(ip)) {
      return { allowed: true }
    }

    // Check blacklist
    if (this.config.waf.blacklistIPs.includes(ip)) {
      this.blockedIPs.add(ip)
      await this.logSecurityEvent('BLACKLISTED_IP', 'IP is blacklisted', ip, userAgent)
      return { allowed: false, reason: 'IP blacklisted' }
    }

    // Rate limiting
    const rateLimitResult = this.checkRateLimit(ip)
    if (!rateLimitResult.allowed) {
      await this.logSecurityEvent('RATE_LIMIT', 'Rate limit exceeded', ip, userAgent, rateLimitResult)
      return { allowed: false, reason: rateLimitResult.reason }
    }

    // Suspicious activity detection
    if (this.config.waf.blockSuspiciousPatterns) {
      const suspiciousResult = this.detectSuspiciousActivity(request, ip, userAgent)
      if (suspiciousResult.isSuspicious) {
        await this.logSecurityEvent('SUSPICIOUS_ACTIVITY', suspiciousResult.reason, ip, userAgent, suspiciousResult)
        
        // Block if too many suspicious activities
        const suspiciousCount = this.suspiciousIPs.get(ip)?.count || 0
        if (suspiciousCount >= this.config.monitoring.alertThresholds.suspiciousActivity) {
          this.blockedIPs.add(ip)
          return { allowed: false, reason: 'Too many suspicious activities' }
        }
      }
    }

    return { allowed: true }
  }

  /**
   * Layer 2: Application Security - Input Validation and Sanitization
   */
  async checkApplicationSecurity(request: NextRequest): Promise<{ allowed: boolean; sanitizedData?: any; reason?: string }> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    
    // Validate request size
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
      await this.logSecurityEvent('LARGE_REQUEST', 'Request too large', ip, userAgent, { size: contentLength })
      return { allowed: false, reason: 'Request too large' }
    }

    // Check for suspicious headers
    const suspiciousHeaders = this.checkSuspiciousHeaders(request)
    if (suspiciousHeaders.length > 0) {
      await this.logSecurityEvent('SUSPICIOUS_HEADERS', 'Suspicious headers detected', ip, userAgent, { headers: suspiciousHeaders })
    }

    // Validate Content-Type for POST requests
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type')
      if (!this.isValidContentType(contentType)) {
        await this.logSecurityEvent('INVALID_CONTENT_TYPE', 'Invalid content type', ip, userAgent, { contentType })
        return { allowed: false, reason: 'Invalid content type' }
      }
    }

    // Sanitize input data
    if (this.config.api.enableInputSanitization && request.method === 'POST') {
      try {
        const body = await request.json()
        const sanitizedData = this.sanitizeInput(body)
        return { allowed: true, sanitizedData }
      } catch (error) {
        await this.logSecurityEvent('INVALID_JSON', 'Invalid JSON data', ip, userAgent, { error: (error as Error).message })
        return { allowed: false, reason: 'Invalid JSON data' }
      }
    }

    return { allowed: true }
  }

  /**
   * Layer 3: Authentication Security - JWT and Session Validation
   */
  async checkAuthenticationSecurity(request: NextRequest): Promise<{ allowed: boolean; user?: any; reason?: string }> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    
    // Check for authentication bypass attempts
    const authBypassResult = this.detectAuthBypass(request, ip, userAgent)
    if (authBypassResult.isBypass) {
      await this.logSecurityEvent('AUTH_BYPASS', 'Authentication bypass attempt', ip, userAgent, authBypassResult)
      
      const bypassCount = this.suspiciousIPs.get(ip)?.count || 0
      if (bypassCount >= this.config.monitoring.alertThresholds.failedLogins) {
        this.blockedIPs.add(ip)
        return { allowed: false, reason: 'Too many auth bypass attempts' }
      }
      
      return { allowed: false, reason: 'Suspicious authentication attempt' }
    }

    // Validate JWT tokens
    if (this.config.api.enableJWTValidation) {
      const authHeader = request.headers.get('authorization')
      if (authHeader) {
        const tokenValidation = this.validateJWTToken(authHeader)
        if (!tokenValidation.valid) {
          await this.logSecurityEvent('INVALID_JWT', 'Invalid JWT token', ip, userAgent, tokenValidation)
          return { allowed: false, reason: 'Invalid JWT token' }
        }
        return { allowed: true, user: tokenValidation.user }
      }
    }

    return { allowed: true }
  }

  /**
   * Layer 4: Data Security - SQL Injection and XSS Prevention
   */
  async checkDataSecurity(data: any, endpoint: string): Promise<{ allowed: boolean; sanitizedData?: any; reason?: string }> {
    if (!this.config.api.enableInputSanitization) {
      return { allowed: true, sanitizedData: data }
    }

    // SQL Injection detection
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
      /(\b(OR|AND)\s+\w+\s*=\s*['"]?[^'"]*['"]?)/gi,
      /(\bUNION\s+SELECT\b)/gi,
      /(\b--|\/\*|\*\/)/gi
    ]

    const dataString = JSON.stringify(data)
    for (const pattern of sqlPatterns) {
      if (pattern.test(dataString)) {
        await this.logSecurityEvent('SQL_INJECTION_ATTEMPT', 'SQL injection pattern detected', 'unknown', 'unknown', { pattern: pattern.source, data: dataString })
        return { allowed: false, reason: 'SQL injection attempt' }
      }
    }

    // XSS detection
    const xssPatterns = [
      /<script[^>]*>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<link[^>]*>/gi,
      /<meta[^>]*>/gi
    ]

    for (const pattern of xssPatterns) {
      if (pattern.test(dataString)) {
        await this.logSecurityEvent('XSS_ATTEMPT', 'XSS pattern detected', 'unknown', 'unknown', { pattern: pattern.source, data: dataString })
        return { allowed: false, reason: 'XSS attempt' }
      }
    }

    // Sanitize the data
    const sanitizedData = this.deepSanitize(data)
    return { allowed: true, sanitizedData }
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const clientIP = request.headers.get('x-client-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    if (realIP) {
      return realIP
    }
    if (clientIP) {
      return clientIP
    }
    
    return 'unknown'
  }

  /**
   * Rate limiting implementation
   */
  private checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
    const now = Date.now()
    const minuteKey = `${ip}:minute`
    const hourKey = `${ip}:hour`

    // Check minute rate limit
    let minuteData = this.rateLimitStore.get(minuteKey)
    if (!minuteData || now > minuteData.resetTime) {
      minuteData = { count: 0, resetTime: now + 60000, lastRequest: now }
      this.rateLimitStore.set(minuteKey, minuteData)
    }

    if (minuteData.count >= this.config.waf.maxRequestsPerMinute) {
      return { allowed: false, reason: 'Rate limit exceeded (per minute)' }
    }

    // Check hour rate limit
    let hourData = this.rateLimitStore.get(hourKey)
    if (!hourData || now > hourData.resetTime) {
      hourData = { count: 0, resetTime: now + 3600000, lastRequest: now }
      this.rateLimitStore.set(hourKey, hourData)
    }

    if (hourData.count >= this.config.waf.maxRequestsPerHour) {
      return { allowed: false, reason: 'Rate limit exceeded (per hour)' }
    }

    minuteData.count++
    hourData.count++
    minuteData.lastRequest = now
    hourData.lastRequest = now

    return { allowed: true }
  }

  /**
   * Detect suspicious activity patterns
   */
  private detectSuspiciousActivity(request: NextRequest, ip: string, userAgent: string): { isSuspicious: boolean; reason: string } {
    const suspiciousPatterns = [
      {
        pattern: /sqlmap/i,
        reason: 'SQLMap scanner detected'
      },
      {
        pattern: /nmap/i,
        reason: 'Nmap scanner detected'
      },
      {
        pattern: /nikto/i,
        reason: 'Nikto scanner detected'
      },
      {
        pattern: /dirbuster/i,
        reason: 'DirBuster scanner detected'
      },
      {
        pattern: /masscan/i,
        reason: 'Masscan scanner detected'
      },
      {
        pattern: /<script>alert/i,
        reason: 'XSS attempt in user agent'
      },
      {
        pattern: /eval\(/i,
        reason: 'Code execution attempt'
      },
      {
        pattern: /union.*select/i,
        reason: 'SQL injection attempt'
      },
      {
        pattern: /\/etc\/passwd/i,
        reason: 'File system access attempt'
      },
      {
        pattern: /\/proc\/version/i,
        reason: 'System information access attempt'
      }
    ]

    const requestString = `${request.method} ${request.url} ${userAgent}`
    
    for (const { pattern, reason } of suspiciousPatterns) {
      if (pattern.test(requestString)) {
        return { isSuspicious: true, reason }
      }
    }

    return { isSuspicious: false, reason: '' }
  }

  /**
   * Check for suspicious headers
   */
  private checkSuspiciousHeaders(request: NextRequest): string[] {
    const suspiciousHeaders = []
    const headers = request.headers
    
    for (const [key, value] of headers.entries()) {
      if (key.toLowerCase().includes('x-') && value) {
        // Check for suspicious header values
        if (typeof value === 'string' && (
          value.includes('<script>') ||
          value.includes('javascript:') ||
          value.includes('eval(') ||
          value.includes('document.cookie')
        )) {
          suspiciousHeaders.push(`${key}: ${value}`)
        }
      }
    }

    return suspiciousHeaders
  }

  /**
   * Detect authentication bypass attempts
   */
  private detectAuthBypass(request: NextRequest, ip: string, userAgent: string): { isBypass: boolean; reason: string } {
    const bypassPatterns = [
      {
        pattern: /admin/i,
        reason: 'Admin path access attempt'
      },
      {
        pattern: /test/i,
        reason: 'Test path access attempt'
      },
      {
        pattern: /debug/i,
        reason: 'Debug path access attempt'
      },
      {
        pattern: /backup/i,
        reason: 'Backup path access attempt'
      },
      {
        pattern: /config/i,
        reason: 'Config file access attempt'
      }
    ]

    const requestString = `${request.method} ${request.url}`
    
    for (const { pattern, reason } of bypassPatterns) {
      if (pattern.test(requestString)) {
        return { isBypass: true, reason }
      }
    }

    return { isBypass: false, reason: '' }
  }

  /**
   * Validate JWT token
   */
  private validateJWTToken(authHeader: string): { valid: boolean; user?: any; error?: string } {
    try {
      const token = authHeader.replace('Bearer ', '')
      const parts = token.split('.')
      
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' }
      }

      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      
      // Check token expiration
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return { valid: false, error: 'Token expired' }
      }

      // Check token issuer
      if (payload.iss !== 'glixtron-auth') {
        return { valid: false, error: 'Invalid token issuer' }
      }

      return { valid: true, user: payload }
    } catch (error) {
      return { valid: false, error: 'Invalid token' }
    }
  }

  /**
   * Basic input sanitization
   */
  private sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/<script[^>]*>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/eval\(/gi, '')
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item))
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }
    
    return data
  }

  /**
   * Deep sanitization for nested objects
   */
  private deepSanitize(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/eval\(/gi, '')
        .replace(/document\./gi, '')
        .replace(/window\./gi, '')
        .replace(/localStorage\./gi, '')
        .replace(/sessionStorage\./gi, '')
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.deepSanitize(item))
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        if (typeof key === 'string') {
          // Sanitize object keys
          const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '')
          sanitized[sanitizedKey] = this.deepSanitize(value)
        } else {
          sanitized[key] = this.deepSanitize(value)
        }
      }
      return sanitized
    }
    
    return data
  }

  /**
   * Validate content type
   */
  private isValidContentType(contentType: string | null): boolean {
    const validTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ]
    
    if (!contentType) return false
    
    return validTypes.some(type => contentType.includes(type))
  }

  /**
   * Log security events
   */
  private async logSecurityEvent(event: string, message: string, ip: string, userAgent: string, details?: any): Promise<void> {
    if (!this.config.monitoring.enableLogging) return

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: this.config.monitoring.logLevel,
      event,
      message,
      ip,
      userAgent,
      details
    }

    this.securityLogs.push(logEntry)

    // Keep only last 1000 logs
    if (this.securityLogs.length > 1000) {
      this.securityLogs = this.securityLogs.slice(-1000)
    }

    // Trigger alerts if needed
    if (this.config.monitoring.enableAlerts) {
      await this.triggerAlert(logEntry)
    }
  }

  /**
   * Trigger security alerts
   */
  private async triggerAlert(logEntry: any): Promise<void> {
    // In production, this would send alerts to security team
    console.error('🚨 SECURITY ALERT:', logEntry)
    
    // Could integrate with external security services
    // await sendSecurityAlert(logEntry)
  }

  /**
   * Get security status
   */
  getSecurityStatus() {
    return {
      config: this.config,
      blockedIPs: Array.from(this.blockedIPs),
      suspiciousIPs: Array.from(this.suspiciousIPs.entries()).map(([ip, data]) => ({ ip, ...data })),
      recentLogs: this.securityLogs.slice(-10),
      rateLimitStore: Object.fromEntries(this.rateLimitStore)
    }
  }

  /**
   * Block an IP address
   */
  blockIP(ip: string): void {
    this.blockedIPs.add(ip)
    this.logSecurityEvent('MANUAL_IP_BLOCK', 'IP manually blocked', ip, 'system')
  }

  /**
   * Unblock an IP address
   */
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip)
    this.logSecurityEvent('MANUAL_IP_UNBLOCK', 'IP manually unblocked', ip, 'system')
  }

  /**
   * Add to whitelist
   */
  addToWhitelist(ip: string): void {
    this.config.waf.whitelistIPs.push(ip)
  }

  /**
   * Add to blacklist
   */
  addToBlacklist(ip: string): void {
    this.config.waf.blacklistIPs.push(ip)
    this.blockIP(ip)
  }
}

export const securityLayer = SecurityLayer.getInstance()
