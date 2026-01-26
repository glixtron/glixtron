import { NextRequest, NextResponse } from 'next/server'
import { ENV_CONFIG } from '@/lib/env-config'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.origin
    const isProduction = process.env.NODE_ENV === 'production'
    const isVercel = !!process.env.VERCEL
    const isVercelPreview = !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'

    // Check environment variables
    const envCheck = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    // Check database connectivity
    let databaseStatus = 'unknown'
    let databaseType = 'unknown'
    
    try {
      // Try to import and test database
      const { findUserByEmail } = await import('@/lib/database-persistent')
      const testUser = await findUserByEmail('test@deployment-check.com')
      databaseStatus = 'connected'
      databaseType = 'mock-persistent'
    } catch (error) {
      databaseStatus = 'error'
      databaseType = 'none'
    }

    // Check NextAuth configuration
    let nextAuthStatus = 'unknown'
    try {
      const { authConfig } = await import('@/lib/auth-config')
      nextAuthStatus = 'configured'
    } catch (error) {
      nextAuthStatus = 'error'
    }

    // Determine deployment configuration
    const deploymentConfig = {
      environment: isProduction ? 'production' : isVercelPreview ? 'preview' : 'development',
      platform: isVercel ? 'vercel' : 'local',
      url: url,
      database: {
        type: databaseType,
        status: databaseStatus,
        recommended: envCheck.SUPABASE_URL && envCheck.SUPABASE_ANON_KEY ? 'supabase' : 'mock'
      },
      authentication: {
        nextAuth: nextAuthStatus,
        secretConfigured: envCheck.NEXTAUTH_SECRET,
        urlConfigured: envCheck.NEXTAUTH_URL
      }
    }

    // Generate recommendations
    const recommendations = []
    
    if (!envCheck.NEXTAUTH_SECRET) {
      recommendations.push('❌ NEXTAUTH_SECRET is missing - Add it in Vercel Environment Variables')
    }
    
    if (!envCheck.NEXTAUTH_URL && isProduction) {
      recommendations.push('❌ NEXTAUTH_URL is missing - Set it to your production URL')
    }
    
    if (isProduction && !envCheck.SUPABASE_URL) {
      recommendations.push('⚠️ SUPABASE_URL is missing - App will use mock database in production')
    }
    
    if (isProduction && !envCheck.SUPABASE_ANON_KEY) {
      recommendations.push('⚠️ SUPABASE_ANON_KEY is missing - App will use mock database in production')
    }
    
    if (databaseStatus === 'error') {
      recommendations.push('❌ Database connection failed - Check database configuration')
    }
    
    if (nextAuthStatus === 'error') {
      recommendations.push('❌ NextAuth configuration error - Check auth-config.ts')
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All configurations look good!')
    }

    return NextResponse.json({
      success: true,
      deployment: deploymentConfig,
      environment: envCheck,
      recommendations,
      timestamp: new Date().toISOString(),
      debug: {
        isProduction,
        isVercel,
        isVercelPreview,
        hasSupabase: !!(envCheck.SUPABASE_URL && envCheck.SUPABASE_ANON_KEY)
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
