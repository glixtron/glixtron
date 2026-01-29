/**
 * Global Security Middleware
 * Applies onion security and blockchain protection to all requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityManager } from './onion-security'

export function withSecurity(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Apply security validation
      const validation = securityManager.validateRequest(req)
      if (!validation.valid) {
        // Log security violation
        securityManager.logSecurityEvent('SECURITY_VIOLATION', {
          reason: validation.reason,
          ip: req.ip,
          userAgent: req.headers.get('user-agent'),
          url: req.url
        }, 'high')

        return NextResponse.json(
          {
            error: 'Access denied',
            reason: validation.reason,
            code: 'SECURITY_VIOLATION'
          },
          { status: 403 }
        )
      }

      // Sanitize request data
      const sanitizedReq = await sanitizeRequest(req)

      // Add security headers
      const response = await handler(sanitizedReq)
      
      // Add security headers to response
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';")
      
      return response

    } catch (error: any) {
      // Log security error
      securityManager.logSecurityEvent('MIDDLEWARE_ERROR', {
        error: error.message,
        stack: error.stack,
        url: req.url
      }, 'critical')

      return NextResponse.json(
        {
          error: 'Internal security error',
          code: 'SECURITY_ERROR'
        },
        { status: 500 }
      )
    }
  }
}

async function sanitizeRequest(req: NextRequest): Promise<NextRequest> {
  // Create a new request with sanitized data
  const url = new URL(req.url)
  
  // Sanitize query parameters
  const searchParams = new URLSearchParams()
  for (const [key, value] of url.searchParams) {
    if (typeof value === 'string') {
      searchParams.set(key, securityManager.sanitizeInput(value))
    }
  }
  
  // Update URL with sanitized query params
  url.search = searchParams.toString()
  
  // Handle request body if it exists
  let body = null
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const clonedReq = req.clone()
      const contentType = req.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        const jsonBody = await clonedReq.json()
        const sanitizedBody = sanitizeObject(jsonBody)
        body = JSON.stringify(sanitizedBody)
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await clonedReq.formData()
        const sanitizedFormData = new FormData()
        
        for (const [key, value] of formData.entries()) {
          if (typeof value === 'string') {
            sanitizedFormData.set(key, securityManager.sanitizeInput(value))
          } else {
            sanitizedFormData.set(key, value)
          }
        }
        
        body = sanitizedFormData
      }
    } catch (error) {
      // If body parsing fails, continue with original request
      console.warn('Failed to sanitize request body:', error)
    }
  }
  
  // Create new request with sanitized data
  const newReq = new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: body || req.body
  })
  
  // Add IP and other metadata
  ;(newReq as any).ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
  
  return newReq as NextRequest
}

function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'string') {
    return securityManager.sanitizeInput(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize object keys as well
      const sanitizedKey = securityManager.sanitizeInput(key)
      sanitized[sanitizedKey] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

// Rate limiting middleware
export function withRateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      
      if (!ip) {
        return NextResponse.json(
          { error: 'Unable to identify client IP' },
          { status: 400 }
        )
      }
      
      // Check rate limit
      if (securityManager.isRateLimited(ip)) {
        securityManager.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
          ip,
          url: req.url,
          userAgent: req.headers.get('user-agent')
        }, 'medium')
        
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(windowMs / 1000)
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(windowMs / 1000).toString()
            }
          }
        )
      }
      
      return handler(req)
    }
  }
}

// Database security wrapper
export function withDatabaseSecurity<T>(
  operation: () => Promise<T>,
  operationName: string = 'database_operation'
): Promise<T> {
  return securityManager.secureDatabase(operation)
}

// API route wrapper with full security
export function secureApiRoute(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: { maxRequests: number; windowMs: number }
    requireAuth?: boolean
    logOperations?: boolean
  } = {}
) {
  let wrappedHandler = withSecurity(handler)
  
  // Add rate limiting if specified
  if (options.rateLimit) {
    wrappedHandler = withRateLimit(options.rateLimit.maxRequests, options.rateLimit.windowMs)(wrappedHandler)
  }
  
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Log operation start if enabled
      if (options.logOperations) {
        securityManager.logSecurityEvent('API_OPERATION_START', {
          operation: handler.name || 'anonymous',
          method: req.method,
          url: req.url,
          ip: req.ip
        }, 'low')
      }
      
      const response = await wrappedHandler(req)
      
      // Log operation success if enabled
      if (options.logOperations) {
        securityManager.logSecurityEvent('API_OPERATION_SUCCESS', {
          operation: handler.name || 'anonymous',
          method: req.method,
          url: req.url,
          status: response.status
        }, 'low')
      }
      
      return response
      
    } catch (error: any) {
      // Log operation error
      securityManager.logSecurityEvent('API_OPERATION_ERROR', {
        operation: handler.name || 'anonymous',
        method: req.method,
        url: req.url,
        error: error.message,
        stack: error.stack
      }, 'high')
      
      return NextResponse.json(
        {
          error: 'Operation failed',
          code: 'API_ERROR'
        },
        { status: 500 }
      )
    }
  }
}

// Export default security wrapper
export default withSecurity
