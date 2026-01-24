import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test if NextAuth is working
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    return NextResponse.json({
      success: true,
      message: 'NextAuth debug info',
      baseUrl,
      nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      endpoints: {
        signIn: `${baseUrl}/api/auth/signin`,
        signOut: `${baseUrl}/api/auth/signout`,
        session: `${baseUrl}/api/auth/session`,
        csrf: `${baseUrl}/api/auth/csrf`
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
