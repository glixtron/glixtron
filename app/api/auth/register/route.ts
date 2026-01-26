import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseUser, findSupabaseUserByEmail } from '@/lib/supabase-real'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password } = body
    
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if user already exists in Supabase
    const existingUser = await findSupabaseUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create new user using Supabase
    const user = await createSupabaseUser({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password,
      provider: 'email'
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user in database' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified,
        createdAt: user.created_at
      },
      requiresEmailVerification: !user.email_verified
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle specific Supabase errors
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    if (error.message?.includes('User already registered')) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
