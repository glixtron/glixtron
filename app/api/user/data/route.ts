import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllUserData } from '@/lib/database'

/**
 * GET /api/user/data
 * Get all user data (assessment, resume scans, saved resume text)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userData = await getAllUserData(session.user.id)
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: userData
    })
  } catch (error: any) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}
