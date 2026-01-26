import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-real'
import { verifySupabaseEmail, findSupabaseUserByEmail } from '@/lib/supabase-real'

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
    
    // Find verification token
    const { data: verification, error: verificationError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .eq('verified_at', null)
      .single()

    if (verificationError || !verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Mark email as verified
    const verified = await verifySupabaseEmail(email)
    
    if (!verified) {
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      )
    }

    // Mark verification token as used
    await supabase
      .from('email_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verification.id)

    // Get updated user data
    const user = await findSupabaseUserByEmail(email)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified
      } : null
    })
  } catch (error: any) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Email verification failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  if (!token || !email) {
    return NextResponse.json(
      { error: 'Missing token or email parameter' },
      { status: 400 }
    )
  }

  // For GET requests, verify the token and return result
  try {
    const { data: verification, error: verificationError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .eq('verified_at', null)
      .single()

    if (verificationError || !verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification link has expired' },
        { status: 400 }
      )
    }

    // Verify the email
    const verified = await verifySupabaseEmail(email)
    
    if (!verified) {
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      )
    }

    // Mark verification token as used
    await supabase
      .from('email_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verification.id)

    // Get updated user data
    const user = await findSupabaseUserByEmail(email)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified
      } : null
    })
  } catch (error: any) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Email verification failed' },
      { status: 500 }
    )
  }
}
