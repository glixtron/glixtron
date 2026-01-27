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

    if (password.length < 6) {
      console.error('❌ Password too short:', password.length, 'characters')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    console.log('✅ Input validation passed')

    // Connect to database
    console.log('🔌 Connecting to MongoDB...')
    await clientPromise
    console.log('✅ MongoDB connection established')

    // Check if user already exists
    console.log('🔍 Checking for existing user:', email.toLowerCase().trim())
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    })

    if (existingUser) {
      console.error('❌ User already exists:', email.toLowerCase().trim())
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    console.log('✅ User does not exist, proceeding with registration')

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Password hashed successfully')

    // Create user
    console.log('👤 Creating user document...')
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=random`
    })

    console.log('💾 Saving user to database...')
    await user.save()
    console.log('✅ User saved successfully:', user._id)

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: user.role,
      createdAt: user.createdAt
    }

    console.log('🎉 Registration completed successfully for:', user.email)

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userResponse
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('💥 REGISTRATION ERROR DETAILS:')
    console.error('❌ Error Name:', error.name)
    console.error('❌ Error Message:', error.message)
    console.error('❌ Error Stack:', error.stack)
    console.error('❌ Environment Variables:', {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV
    })
    
    // Check for specific MongoDB connection errors
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 MongoDB Connection Issue - Check:')
      console.error('  - IP whitelist in MongoDB Atlas')
      console.error('  - Connection string format')
      console.error('  - Network connectivity')
    }
    
    if (error.name === 'OverwriteModelError') {
      console.error('🔍 Model Overwrite Issue - Check:')
      console.error('  - User model export pattern')
      console.error('  - Multiple model definitions')
    }
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        errorType: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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
