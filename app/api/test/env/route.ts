import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const envVars = {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }

    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      environment: envVars,
      timestamp: new Date().toISOString(),
      recommendation: envVars.SUPABASE_URL === 'Missing' ? 'Add Supabase environment variables to Vercel' : 'Environment variables look good'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
