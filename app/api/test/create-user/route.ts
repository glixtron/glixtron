import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

/**
 * POST /api/test/create-user
 * Create a test user for development
 */
export async function POST(request: NextRequest) {
  try {
    const testUser = await createUser({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        emailVerified: testUser.emailVerified
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create test user' },
      { status: 500 }
    )
  }
}
