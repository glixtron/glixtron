import { NextRequest, NextResponse } from 'next/server'
import { clientPromise } from '@/lib/mongodb-adapter'
import bcrypt from 'bcryptjs'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    // Strict environment variable check
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables')
      return NextResponse.json(
        { 
          error: 'Database configuration error',
          details: 'MONGODB_URI environment variable is missing'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, password } = body

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, and password are required'
        },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address'
        },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Password too short',
          message: 'Password must be at least 8 characters long'
        },
        { status: 400 }
      )
    }

    console.log('🔐 Starting registration process...')
    console.log('📧 Email:', email.toLowerCase().trim())

    // Connect to database
    await clientPromise
    console.log('✅ Database connected')

    // Check if user already exists
    console.log('👤 Checking for existing user...')
    const existingUser = await User.findByEmail(email.toLowerCase().trim())
    
    if (existingUser) {
      console.log('❌ User already exists:', { email: existingUser.email })
      return NextResponse.json(
        { 
          success: false,
          error: 'User already exists',
          message: 'An account with this email already exists'
        },
        { status: 409 }
      )
    }

    console.log('✅ User email is available')

    // Hash password
    console.log('🔒 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Password hashed successfully')

    // Create user
    console.log('👤 Creating user in MongoDB...')
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      emailVerified: false
    })
    console.log('✅ User created successfully:', { id: user._id, email: user.email })

    // Prepare response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    }

    console.log('🎉 Registration completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    })

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    
    // Return detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: error.message || 'An error occurred during registration',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint has been disabled',
    status: 'Please use the direct registration form at /register'
  })
}
