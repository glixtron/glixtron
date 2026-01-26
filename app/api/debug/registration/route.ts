import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/database-persistent'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Debug Registration - Request body:', body)
    
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Missing required fields')
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required',
        debug: {
          received: { name, email, password: password ? '***' : null }
        }
      }, { status: 400 })
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email)
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email)
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists',
        debug: {
          existingUser: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            createdAt: existingUser.createdAt
          }
        }
      }, { status: 409 })
    }

    // Create user
    console.log('✅ Creating new user:', email)
    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    })

    console.log('✅ User created successfully:', user.id)
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      debug: {
        created: true,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('❌ Debug Registration Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to register user',
      debug: {
        errorStack: error.stack,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Registration debug endpoint',
    usage: 'POST with {name, email, password}',
    timestamp: new Date().toISOString()
  })
}
