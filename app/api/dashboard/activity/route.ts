import { NextRequest, NextResponse } from 'next/server'

// Mock activity data
const mockActivity = [
  {
    id: 1,
    type: 'assessment',
    title: 'Completed Technical Skills Assessment',
    description: 'Achieved 92% score in full-stack development',
    timestamp: '2 hours ago',
    icon: 'Award',
    color: 'success',
    link: '/assessment'
  },
  {
    id: 2,
    type: 'resume',
    title: 'Resume scan completed',
    description: '92% ATS compatibility score - great improvement!',
    timestamp: '1 day ago',
    icon: 'Briefcase',
    color: 'primary',
    link: '/resume-scanner'
  },
  {
    id: 3,
    type: 'career',
    title: 'Career path updated',
    description: 'Software Engineering track selected based on your skills',
    timestamp: '3 days ago',
    icon: 'TrendingUp',
    color: 'warning',
    link: '/career-guidance'
  },
  {
    id: 4,
    type: 'achievement',
    title: 'New achievement unlocked',
    description: 'Assessment Master - Completed 10+ career assessments',
    timestamp: '1 week ago',
    icon: 'Award',
    color: 'success',
    link: '/profile'
  },
  {
    id: 5,
    type: 'profile',
    title: 'Profile updated',
    description: 'Added new skills and experience to your profile',
    timestamp: '2 weeks ago',
    icon: 'User',
    color: 'info',
    link: '/profile'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Return paginated results
    const paginatedActivity = mockActivity.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: {
        activities: paginatedActivity,
        total: mockActivity.length,
        hasMore: offset + limit < mockActivity.length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Activity API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Add new activity
    if (body.action === 'add') {
      const newActivity = {
        id: mockActivity.length + 1,
        ...body.activity,
        timestamp: 'Just now'
      }
      
      mockActivity.unshift(newActivity)
      
      return NextResponse.json({
        success: true,
        data: newActivity,
        message: 'Activity added successfully'
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Activity POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
