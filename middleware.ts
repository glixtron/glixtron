import { NextRequest, NextResponse } from 'next/server'
import { securityLayer } from '@/lib/security-layer'

// Security configuration
const SECURITY_CONFIG = {
  enabled: true,
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  },
  blockedPaths: [
    '/admin',
    '/config',
    '/backup',
    '/test',
    '/debug'
  ],
  allowedOrigins: [
    'https://glixtron.vercel.app',
    'https://glixtron-git-main-glixtron.vercel.app',
    'https://glixtron.netlify.app',
    'https://glixtron.github.io',
    'https://glixtron-*.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ]
}

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number; lastRequest: number }>()

async function securityMiddleware(request: NextRequest) {
  // Get client IP
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  const origin = request.headers.get('origin')

  // Layer 1: Network Security - IP Filtering
  const networkCheck = await securityLayer.checkNetworkSecurity(request)
  if (!networkCheck.allowed) {
    return createSecurityResponse(429, 'Rate limit exceeded', {
      reason: networkCheck.reason,
      ip,
      code: 'SECURITY_BLOCKED'
    })
  }

  // Layer 2: Request Validation
  const validationCheck = await validateRequest(request, ip, userAgent)
  if (!validationCheck.allowed) {
    return createSecurityResponse(400, 'Invalid request', {
      reason: validationCheck.reason,
      ip,
      code: 'SECURITY_VIOLATION'
    })
  }

  // Layer 3: Rate Limiting
  if (SECURITY_CONFIG.rateLimit.enabled) {
    const rateLimitCheck = checkRateLimit(ip, request.url)
    if (!rateLimitCheck.allowed) {
      return createSecurityResponse(429, 'Too many requests', {
        reason: rateLimitCheck.reason,
        ip,
        code: 'RATE_LIMIT',
        retryAfter: '60'
      })
    }
  }

  // Layer 4: CORS Protection
  if (origin && !SECURITY_CONFIG.allowedOrigins.includes('*')) {
    if (!SECURITY_CONFIG.allowedOrigins.includes(origin)) {
      return createSecurityResponse(403, 'CORS policy violation', {
        reason: 'Origin not allowed',
        origin,
        ip,
        code: 'CORS_VIOLATION'
      })
    }
  }

  // Layer 5: Path Protection
  for (const blockedPath of SECURITY_CONFIG.blockedPaths) {
    if (request.nextUrl.pathname.startsWith(blockedPath)) {
      return createSecurityResponse(403, 'Access denied', {
        reason: 'Path not allowed',
        path: request.nextUrl.pathname,
        ip,
        code: 'PATH_BLOCKED'
      })
    }
  }

  return NextResponse.next()
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
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
  
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         request.headers.get('x-client-ip') ||
         'unknown'
}

/**
 * Validate request
 */
async function validateRequest(request: NextRequest, ip: string, userAgent: string): Promise<{ allowed: boolean; reason?: string }> {
  // Check request size
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return { allowed: false, reason: 'Request too large' }
  }

  // Check for suspicious user agents
  const suspiciousPatterns = [
    /sqlmap/i,
    /nmap/i,
    /nikto/i,
    /dirbuster/i,
    /masscan/i,
    /<script>alert/i,
    /eval\(/i,
    /union.*select/i,
    /\/etc\/passwd/i,
    /\/proc\/version/i
  ]

  const requestString = `${request.method} ${request.url} ${userAgent}`
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestString)) {
      return { allowed: false, reason: 'Suspicious activity detected' }
    }
  }

  return { allowed: true }
}

/**
 * Check rate limit
 */
function checkRateLimit(ip: string, url: string): { allowed: boolean; reason?: string } {
  const now = Date.now()
  const key = `${ip}:${url}`
  
  let requestData = rateLimitStore.get(key)
  
  if (!requestData || now > requestData.resetTime) {
    requestData = { count: 0, resetTime: now + SECURITY_CONFIG.rateLimit.windowMs, lastRequest: now }
    rateLimitStore.set(key, requestData)
  }

  if (requestData.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
    return { allowed: false, reason: 'Rate limit exceeded' }
  }

  requestData.count++
  requestData.lastRequest = now
  return { allowed: true }
}

/**
 * Create security response
 */
function createSecurityResponse(status: number, message: string, data: any): NextResponse {
  const response = NextResponse.json({
    error: message,
    code: data.code,
    timestamp: new Date().toISOString(),
    ...data
  }, { status })

  // Add security headers
  addSecurityHeaders(response)
  
  // Add retry header for rate limiting
  if (data.retryAfter) {
    response.headers.set('Retry-After', data.retryAfter)
  }

  return response
}

/**
 * Add security headers
 */
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'default-src *; script-src \'self\' \'unsafe-inline\' https: https://vercel.app')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https: https: https:; frame-ancestors 'self'")
  
  // Remove server information
  response.headers.set('Server', 'Glixtron-Secure')
  response.headers.set('X-Powered-By', 'Glixtron-Security')
}

// Combined middleware
export default async function middleware(request: NextRequest) {
  // Apply security middleware first
  if (SECURITY_CONFIG.enabled) {
    const securityResult = await securityMiddleware(request)
    if (securityResult.status !== 200) {
      return securityResult
    }
  }

  // For now, skip NextAuth middleware to avoid type conflicts
  // Authentication will be handled at the route level
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
