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

    console.log('🔍 Environment check - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing')
    console.log('🔍 Starting registration process...')

    const { name, email, password } = await request.json()
    console.log('📝 Registration data received:', { name, email: 'password: [REDACTED]' })

    // Validation
    if (!name || !email || !password) {
      console.error('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { error: 'Please provide name, email, and password' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email)
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      console.error('❌ Password too short:', password.length)
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    console.log('✅ Input validation passed')

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Password hashed successfully')

    // Create user
    console.log('👤 Creating user in MongoDB...')
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
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

    console.log('🎉 Registration completed successfully for:', email)

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userResponse
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('💥 REGISTRATION ERROR - RAW ERROR DETAILS:')
    console.error('❌ Error Name:', error.name)
    console.error('❌ Error Message:', error.message)
    console.error('❌ Error Code:', error.code)
    console.error('❌ Full Error Stack:', error.stack)
    console.error('❌ Environment Variables:', {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV
    })
    
    // Log the full error object for debugging
    console.error('🔍 Full Error Object:', JSON.stringify(error, null, 2))
    
    // Return detailed error for debugging - EXPOSE RAW ERROR
    return NextResponse.json(
      { 
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        timestamp: new Date().toISOString()
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
