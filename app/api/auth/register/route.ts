import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/database-persistent'

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

    // Check if user already exists
    const existingUser = await findUserByEmail(email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }
    
    const user = await createUser({ 
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: password 
    })
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Thank you for choosing Glixtron.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
