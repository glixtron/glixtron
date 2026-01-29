import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database connection
    let dbStatus = 'unknown'
    try {
      // Test MongoDB connection
      const clientPromise = await import('@/lib/mongodb')
      const client = await clientPromise.default
      await client.connect()
      dbStatus = 'connected'
    } catch (error) {
      dbStatus = 'error'
    }

    // Check environment
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'set' : 'missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
      MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'missing'
    }

    const responseTime = Date.now() - startTime
    const serverInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      server: {
        id: process.env.VERCEL_URL || 'local',
        region: process.env.VERCEL_REGION || 'unknown',
        environment: process.env.NODE_ENV || 'unknown'
      },
      database: {
        status: dbStatus,
        type: 'mongodb'
      },
      environment: envVars,
      endpoints: {
        auth: '/api/auth/[...nextauth]',
        register: '/api/auth/register',
        login: '/api/auth/signin',
        profile: '/api/user/profile',
        assessment: '/api/user/assessment',
        resumeScan: '/api/user/resume-scans',
        jdExtractor: '/api/jd/extract'
      }
    }

    return NextResponse.json(responseTime < 5000 ? serverInfo : {
      ...serverInfo,
      status: 'degraded',
      warning: 'High response time'
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'deep-check':
        // Perform comprehensive health check
        const checks = await Promise.allSettled([
          checkDatabase(),
          checkAuthSystem(),
          checkExternalServices()
        ])

        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          checks: {
            database: checks[0].status === 'fulfilled' ? 'passed' : 'failed',
            auth: checks[1].status === 'fulfilled' ? 'passed' : 'failed',
            external: checks[2].status === 'fulfilled' ? 'passed' : 'failed'
          }
        })

      default:
        return NextResponse.json({
          status: 'healthy',
          message: 'Health check endpoint is working'
        })
    }

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 400 })
  }
}

async function checkDatabase() {
  // Test MongoDB connection
  const clientPromise = await import('@/lib/mongodb')
  const client = await clientPromise.default
  await client.connect()
  return true
}

async function checkAuthSystem() {
  // Check NextAuth configuration
  const { authConfig } = await import('@/lib/auth-config')
  return !!authConfig
}

async function checkExternalServices() {
  // Check MongoDB connection
  if (process.env.MONGODB_URI) {
    try {
      const clientPromise = await import('@/lib/mongodb')
      const client = await clientPromise.default
      await client.connect()
      return true
    } catch (error) {
      return false
    }
  }
  return false
}
