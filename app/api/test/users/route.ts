import { NextRequest, NextResponse } from 'next/server'
import { createUser, getAllUsers, findUserByEmail } from '@/lib/database-persistent'

/**
 * GET /api/test/users
 * List all users in the mock database
 */
export async function GET() {
  try {
    const users = await getAllUsers()
    
    const userList = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      image: user.image
    }))

    return NextResponse.json({
      success: true,
      users: userList,
      count: userList.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to list users' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/test/users
 * Create a test user and ensure it persists
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    // Create the user
    const testUser = await createUser({
      email: email || 'test@example.com',
      name: name || 'Test User',
      password: password || 'password123'
    })

    // Verify the user was created by trying to find them
    const verification = await findUserByEmail(testUser!.email)

    return NextResponse.json({
      success: true,
      user: {
        id: testUser!.id,
        email: testUser!.email,
        name: testUser!.name,
        emailVerified: testUser!.emailVerified,
        hasPassword: !!testUser!.password
      },
      verification: {
        found: !!verification,
        email: verification?.email,
        hasPassword: !!verification?.password
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create test user' },
      { status: 500 }
    )
  }
}
