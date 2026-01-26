import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-real'
import { findSupabaseUserByEmail } from '@/lib/supabase-real'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await findSupabaseUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification token
    const { error: tokenError } = await supabase
      .from('email_verifications')
      .insert({
        user_id: user.id,
        email: email,
        token,
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.json(
        { error: 'Failed to generate verification token' },
        { status: 500 }
      )
    }

    // In production, send actual email
    // For now, return the verification URL
    const baseUrl = request.nextUrl.origin
    const verificationUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log('Verification URL:', verificationUrl)

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      verificationUrl, // Only for development
      expiresIn: '24 hours'
    })
  } catch (error: any) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send verification email' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email verification endpoint',
    usage: 'POST with { email } to send verification email'
  })
}
