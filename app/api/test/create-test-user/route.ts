import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/database-persistent'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 })
    }

    // Create user using the same function as real registration
    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    })

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      credentials: {
        email: email,
        password: password
      },
      note: 'This test user was created using the same pipeline as real users'
    })
  } catch (error: any) {
    console.error('Test user creation error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create test user'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to create test user.'
  }, { status: 405 })
}
