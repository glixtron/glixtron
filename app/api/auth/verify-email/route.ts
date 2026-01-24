import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token } = body
    
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Missing email or token' },
        { status: 400 }
      )
    }
    
    const verified = await verifyUser(email, token)
    
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 400 }
    )
  }
}
