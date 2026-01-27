import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: '✅ App is working! (Using mock database)',
      status: 'Vercel deployment successful',
      timestamp: new Date().toISOString(),
      note: 'Set up MongoDB environment variables to enable database features'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
