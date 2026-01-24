import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/supabase-client'

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers()
    
    const userList = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      image: user.image,
      bio: user.bio,
      location: user.location,
      hasPassword: !!user.password
    }))

    return NextResponse.json({
      success: true,
      users: userList,
      count: userList.length
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
