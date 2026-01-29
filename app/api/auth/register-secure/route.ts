/**
 * Secure Registration API with Advanced Security
 * Multi-layer protection with onion architecture and blockchain security
 */

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { User } from '@/models/User'
import { secureApiRoute } from '@/lib/security/middleware'
import { securityManager } from '@/lib/security/onion-security'

const secureHandler = secureApiRoute(
  async (request: NextRequest) => {
    try {
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

      console.log('🔐 Starting secure registration process...')
      console.log('📧 Email:', email.toLowerCase().trim())

      // Check if user already exists
      console.log('👤 Checking for existing user...')
      const existingUser = await User.findByEmail(email.toLowerCase().trim())
      
      if (existingUser) {
        console.log('❌ User already exists:', { email: existingUser.email })
        
        // Log security event
        securityManager.logSecurityEvent('DUPLICATE_REGISTRATION_ATTEMPT', {
          email: email.toLowerCase().trim(),
          ip: request.ip,
          userAgent: request.headers.get('user-agent')
        }, 'medium')
        
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

      // Hash password with increased salt rounds for security
      console.log('🔒 Hashing password with enhanced security...')
      const hashedPassword = await bcrypt.hash(password, 14) // Increased from 12 to 14
      console.log('✅ Password hashed successfully')

      // Encrypt sensitive user data before storage
      console.log('🔐 Encrypting sensitive user data...')
      const encryptedUserData = {
        name: securityManager.encryptSensitiveData(name),
        email: securityManager.encryptSensitiveData(email.toLowerCase().trim()),
        password: hashedPassword,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        emailVerified: false
      }

      // Create user with encrypted data
      console.log('👤 Creating user in MongoDB...')
      const user = await User.create(encryptedUserData)
      console.log('✅ User created successfully:', { id: user._id })

      // Log successful registration to blockchain
      const securityBlock = securityManager.logSecurityEvent('USER_REGISTRATION_SUCCESS', {
        userId: user._id?.toString(),
        email: email.toLowerCase().trim(),
        timestamp: new Date().toISOString(),
        ip: request.ip
      }, 'low')

      // Prepare response with decrypted data (only safe fields)
      const userResponse = {
        id: user._id,
        name: name, // Send back original name, not encrypted
        email: email.toLowerCase().trim(), // Send back original email
        avatar_url: encryptedUserData.avatar_url,
        emailVerified: encryptedUserData.emailVerified,
        createdAt: user.createdAt,
        security: {
          encryption: 'Onion encryption applied',
          blockchain: 'Event logged to blockchain',
          blockIndex: securityBlock.index,
          blockHash: securityBlock.hash.substring(0, 16) + '...'
        }
      }

      console.log('🎉 Secure registration completed successfully!')

      return NextResponse.json({
        success: true,
        message: 'User registered successfully with advanced security',
        user: userResponse
      })

    } catch (error: any) {
      console.error('❌ Registration error:', error)
      
      // Log security error to blockchain
      securityManager.logSecurityEvent('REGISTRATION_ERROR', {
        error: error.message,
        stack: error.stack,
        email: body?.email,
        ip: request.ip
      }, 'critical')

      // Return detailed error for debugging (remove in production)
      return NextResponse.json(
        {
          success: false,
          error: 'Registration failed',
          message: error.message || 'An error occurred during registration',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          security: 'Error logged to blockchain'
        },
        { status: 500 }
      )
    }
  },
  {
    rateLimit: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 registrations per 15 minutes
    logOperations: true
  }
)

export const POST = secureHandler
