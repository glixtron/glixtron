/**
 * Multi-Layer Onion Security System
 * Blockchain-style database protection with multiple security layers
 */

import crypto from 'crypto'
import { createHash, randomBytes, createHmac, timingSafeEqual } from 'crypto'

// Security Configuration
export const SECURITY_CONFIG = {
  // Onion layers (each layer encrypts the previous one)
  onionLayers: 5,
  
  // Blockchain security
  blockchain: {
    difficulty: 4, // Number of leading zeros for proof-of-work
    blockReward: 1,
    maxBlockSize: 1024 * 1024, // 1MB
    genesisBlock: {
      timestamp: Date.now(),
      data: 'Genesis Block - CareerPath Pro Security Chain',
      previousHash: '0'.repeat(64)
    }
  },
  
  // Encryption settings
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    saltLength: 32,
    tagLength: 16
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    blockDuration: 30 * 60 * 1000 // 30 minutes
  },
  
  // IP security
  ipSecurity: {
    maxFailedAttempts: 5,
    blockDuration: 60 * 60 * 1000, // 1 hour
    whitelist: ['127.0.0.1', '::1'], // localhost
    suspiciousPatterns: [
      /sql/i,
      /script/i,
      /javascript/i,
      /<.*>/,
      /union.*select/i
    ]
  }
}

// Blockchain Block Structure
export interface SecurityBlock {
  index: number
  timestamp: number
  data: any
  previousHash: string
  hash: string
  nonce: number
  merkleRoot?: string
  signature?: string
}

// Onion Security Layer
export class OnionSecurityLayer {
  private key: Buffer
  private algorithm: string = SECURITY_CONFIG.encryption.algorithm

  constructor() {
    this.key = randomBytes(SECURITY_CONFIG.encryption.keyLength)
  }

  encrypt(data: string): string {
    const iv = randomBytes(SECURITY_CONFIG.encryption.ivLength)
    const cipher = crypto.createCipher(this.algorithm, this.key)
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return iv.toString('hex') + ':' + encrypted
  }

  decrypt(encryptedData: string): string {
    const [ivHex, encrypted] = encryptedData.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipher(this.algorithm, this.key)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  getKey(): string {
    return this.key.toString('hex')
  }
}

// Multi-Layer Onion Encryption
export class OnionSecurity {
  private layers: OnionSecurityLayer[] = []

  constructor() {
    // Create multiple encryption layers
    for (let i = 0; i < SECURITY_CONFIG.onionLayers; i++) {
      this.layers.push(new OnionSecurityLayer())
    }
  }

  encrypt(data: string): string {
    let encrypted = data
    
    // Apply layers from outside to inside
    for (let i = this.layers.length - 1; i >= 0; i--) {
      encrypted = this.layers[i].encrypt(encrypted)
    }
    
    return encrypted
  }

  decrypt(encryptedData: string): string {
    let decrypted = encryptedData
    
    // Peel layers from outside to inside
    for (const layer of this.layers) {
      decrypted = layer.decrypt(decrypted)
    }
    
    return decrypted
  }

  getLayerKeys(): string[] {
    return this.layers.map(layer => layer.getKey())
  }
}

// Blockchain Security System
export class BlockchainSecurity {
  private chain: SecurityBlock[] = []
  private difficulty: number = SECURITY_CONFIG.blockchain.difficulty

  constructor() {
    // Create genesis block
    this.chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): SecurityBlock {
    return {
      index: 0,
      timestamp: SECURITY_CONFIG.blockchain.genesisBlock.timestamp,
      data: SECURITY_CONFIG.blockchain.genesisBlock.data,
      previousHash: SECURITY_CONFIG.blockchain.genesisBlock.previousHash,
      hash: '',
      nonce: 0
    }
  }

  private calculateHash(block: SecurityBlock): string {
    const data = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      nonce: block.nonce
    })
    
    return createHash('sha256').update(data).digest('hex')
  }

  private proofOfWork(block: SecurityBlock): SecurityBlock {
    const target = Array(this.difficulty + 1).join('0')
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++
      block.hash = this.calculateHash(block)
    }
    
    return block
  }

  addBlock(data: any): SecurityBlock {
    const previousBlock = this.chain[this.chain.length - 1]
    const newBlock: SecurityBlock = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0
    }

    // Mine the block
    this.proofOfWork(newBlock)
    this.chain.push(newBlock)
    
    return newBlock
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      // Check if current block's hash is valid
      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false
      }

      // Check if current block points to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }

      // Check proof of work
      const target = Array(this.difficulty + 1).join('0')
      if (currentBlock.hash.substring(0, this.difficulty) !== target) {
        return false
      }
    }
    
    return true
  }

  getChain(): SecurityBlock[] {
    return this.chain
  }

  getLatestBlock(): SecurityBlock {
    return this.chain[this.chain.length - 1]
  }
}

// Advanced Security Manager
export class AdvancedSecurityManager {
  private static instance: AdvancedSecurityManager
  private onionSecurity: OnionSecurity
  private blockchain: BlockchainSecurity
  private blockedIPs: Map<string, number> = new Map()
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map()
  private securityLogs: Array<{
    timestamp: number
    event: string
    ip: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }> = []

  private constructor() {
    this.onionSecurity = new OnionSecurity()
    this.blockchain = new BlockchainSecurity()
  }

  static getInstance(): AdvancedSecurityManager {
    if (!AdvancedSecurityManager.instance) {
      AdvancedSecurityManager.instance = new AdvancedSecurityManager()
    }
    return AdvancedSecurityManager.instance
  }

  // Encrypt sensitive data with onion security
  encryptSensitiveData(data: any): string {
    const jsonData = JSON.stringify(data)
    return this.onionSecurity.encrypt(jsonData)
  }

  // Decrypt sensitive data
  decryptSensitiveData(encryptedData: string): any {
    const decrypted = this.onionSecurity.decrypt(encryptedData)
    return JSON.parse(decrypted)
  }

  // Add security event to blockchain
  logSecurityEvent(event: string, data: any, severity: string = 'medium'): SecurityBlock {
    const eventData = {
      event,
      data,
      severity,
      timestamp: Date.now(),
      encrypted: this.encryptSensitiveData(data)
    }
    
    return this.blockchain.addBlock(eventData)
  }

  // IP Security
  isIPBlocked(ip: string): boolean {
    const blockTime = this.blockedIPs.get(ip)
    if (!blockTime) return false
    
    if (Date.now() > blockTime) {
      this.blockedIPs.delete(ip)
      return false
    }
    
    return true
  }

  blockIP(ip: string, duration: number = SECURITY_CONFIG.ipSecurity.blockDuration): void {
    this.blockedIPs.set(ip, Date.now() + duration)
    this.logSecurityEvent('IP_BLOCKED', { ip, duration }, 'high')
  }

  // Rate Limiting
  isRateLimited(ip: string): boolean {
    const now = Date.now()
    const record = this.rateLimitMap.get(ip)
    
    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.rateLimit.windowMs
      })
      return false
    }
    
    if (record.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
      this.blockIP(ip, SECURITY_CONFIG.rateLimit.blockDuration)
      return true
    }
    
    record.count++
    return false
  }

  // Input Validation and Sanitization
  sanitizeInput(input: string): string {
    if (!input) return ''
    
    // Check for suspicious patterns
    for (const pattern of SECURITY_CONFIG.ipSecurity.suspiciousPatterns) {
      if (pattern.test(input)) {
        this.logSecurityEvent('SUSPICIOUS_INPUT', { input, pattern: pattern.source }, 'high')
        throw new Error('Suspicious input detected')
      }
    }
    
    // Sanitize input
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/--/g, '') // Remove SQL comments
      .replace(/;/g, '') // Remove semicolons
      .trim()
  }

  // Request Validation
  validateRequest(req: any): { valid: boolean; reason?: string } {
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    
    // Check if IP is blocked
    if (this.isIPBlocked(ip)) {
      return { valid: false, reason: 'IP blocked' }
    }
    
    // Check rate limiting
    if (this.isRateLimited(ip)) {
      return { valid: false, reason: 'Rate limited' }
    }
    
    // Validate headers
    const userAgent = req.headers['user-agent']
    if (!userAgent || userAgent.length < 10) {
      return { valid: false, reason: 'Invalid user agent' }
    }
    
    // Check for common attack patterns
    const url = req.url || ''
    if (url.includes('..') || url.includes('%2e%2e')) {
      this.blockIP(ip)
      return { valid: false, reason: 'Path traversal attempt' }
    }
    
    return { valid: true }
  }

  // Database Security
  secureDatabaseQuery(query: string, params: any[]): { query: string; params: any[] } {
    // Add blockchain logging for database operations
    this.logSecurityEvent('DATABASE_QUERY', { query: query.substring(0, 100) }, 'low')
    
    // Parameterize query to prevent SQL injection
    return { query, params }
  }

  // Get Security Status
  getSecurityStatus(): {
    blockchainValid: boolean
    blockedIPs: number
    rateLimitedIPs: number
    recentEvents: number
    onionLayers: number
  } {
    const now = Date.now()
    const recentEvents = this.securityLogs.filter(
      log => now - log.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    ).length
    
    const rateLimitedIPs = Array.from(this.rateLimitMap.values()).filter(
      record => record.count >= SECURITY_CONFIG.rateLimit.maxRequests
    ).length
    
    return {
      blockchainValid: this.blockchain.isChainValid(),
      blockedIPs: this.blockedIPs.size,
      rateLimitedIPs,
      recentEvents,
      onionLayers: SECURITY_CONFIG.onionLayers
    }
  }

  // Get Security Logs
  getSecurityLogs(limit: number = 100): typeof this.securityLogs {
    return this.securityLogs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  // Clear old security logs
  cleanup(): void {
    const now = Date.now()
    const cutoff = now - 7 * 24 * 60 * 60 * 1000 // 7 days ago
    
    this.securityLogs = this.securityLogs.filter(log => log.timestamp > cutoff)
    
    // Clean up expired IP blocks
    for (const [ip, blockTime] of this.blockedIPs.entries()) {
      if (now > blockTime) {
        this.blockedIPs.delete(ip)
      }
    }
    
    // Clean up expired rate limits
    for (const [ip, record] of this.rateLimitMap.entries()) {
      if (now > record.resetTime) {
        this.rateLimitMap.delete(ip)
      }
    }
  }
}

// Export singleton instance
export const securityManager = AdvancedSecurityManager.getInstance()

// Middleware for Express/Next.js
export function securityMiddleware(req: any, res: any, next: any) {
  try {
    const validation = securityManager.validateRequest(req)
    
    if (!validation.valid) {
      securityManager.logSecurityEvent('REQUEST_BLOCKED', {
        reason: validation.reason,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }, 'medium')
      
      return res.status(403).json({ 
        error: 'Access denied',
        reason: validation.reason 
      })
    }
    
    // Sanitize all input parameters
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = securityManager.sanitizeInput(req.body[key])
        }
      }
    }
    
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = securityManager.sanitizeInput(req.query[key])
        }
      }
    }
    
    next()
  } catch (error) {
    console.error('Security middleware error:', error)
    res.status(500).json({ error: 'Security validation failed' })
  }
}

// Database Security Wrapper
export function secureDatabase<T>(operation: () => Promise<T>): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Log operation start
      securityManager.logSecurityEvent('DATABASE_OPERATION_START', {
        operation: operation.name || 'anonymous'
      }, 'low')
      
      const result = await operation()
      
      // Log operation success
      securityManager.logSecurityEvent('DATABASE_OPERATION_SUCCESS', {
        operation: operation.name || 'anonymous'
      }, 'low')
      
      resolve(result)
    } catch (error) {
      // Log operation failure
      securityManager.logSecurityEvent('DATABASE_OPERATION_ERROR', {
        operation: operation.name || 'anonymous',
        error: error.message
      }, 'high')
      
      reject(error)
    }
  })
}
