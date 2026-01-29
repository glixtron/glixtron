import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export interface SecureApiOptions {
  rateLimit?: {
    maxRequests: number
    windowMs: number
  }
  logOperations?: boolean
}

export function secureApiRoute(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: SecureApiOptions = {}
) {
  return async (request: NextRequest) => {
    try {
      // Check authentication
      const session = await getServerSession()
      
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized - Please sign in' },
          { status: 401 }
        )
      }

      // Log operation if enabled
      if (options.logOperations) {
        console.log(`🔒 API Call: ${request.method} ${request.url} by ${session.user?.email}`)
      }

      // Execute the handler
      return await handler(request)

    } catch (error: any) {
      console.error('Secure API Error:', error)
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }
  }
}
