import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database connection
    let dbStatus = 'unknown'
    try {
      // This will be updated to use Supabase
      const { findUserByEmail } = await import('@/lib/auth')
      await findUserByEmail('health-check@test.com')
      dbStatus = 'connected'
    } catch (error) {
      dbStatus = 'error'
    }

    // Check environment
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'set' : 'missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
      SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'missing',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'set' : 'missing'
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
        type: 'supabase'
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
  // This will be updated to use Supabase
  const { findUserByEmail } = await import('@/lib/auth')
  await findUserByEmail('health-check@test.com')
  return true
}

async function checkAuthSystem() {
  // Check NextAuth configuration
  const { authConfig } = await import('@/lib/auth-config')
  return !!authConfig
}

async function checkExternalServices() {
  // Check Supabase connection
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )
    const { error } = await supabase.from('users').select('count').limit(1)
    return !error
  }
  return false
}
