import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { findUserById, updateUser } from '@/lib/database-persistent'

/**
 * GET /api/user/profile
 * Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' },
        { status: 401 }
      )
    }
    
    const user = await findUserById(session.user.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', userId: session.user.id },
        { status: 404 }
      )
    }
    
    // Return user profile (exclude password)
    const { password, ...profile } = user
    
    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error: any) {
    console.error('Profile API: Error fetching profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/profile
 * Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { name, bio, location, phone, website, socialLinks, preferences } = body
    
    // Update user in database
    const updatedUser = await updateUser(session.user.id, {
      name: name || session.user.name,
      bio,
      location,
      phone,
      website,
      socialLinks,
      preferences
    })
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Return updated profile (exclude password)
    const { password, ...profile } = updatedUser
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
