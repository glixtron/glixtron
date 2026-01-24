import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, validatePassword } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body

    if (action === 'register') {
      // Test user creation
      const existingUser = await findUserByEmail(email)
      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: 'User already exists'
        })
      }

      const user = await createUser({
        email,
        name: name || 'Test User',
        password
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Failed to create user'
        })
      }

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })
    }

    if (action === 'login') {
      // Test password validation
      const isValid = await validatePassword(email, password)
      const user = await findUserByEmail(email)

      return NextResponse.json({
        success: isValid,
        message: isValid ? 'Login successful' : 'Invalid credentials',
        user: isValid && user ? {
          id: user.id,
          email: user.email,
          name: user.name
        } : null
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    })

  } catch (error: any) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
