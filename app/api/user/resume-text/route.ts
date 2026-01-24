import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { saveResumeText, getResumeText } from '@/lib/database'

/**
 * GET /api/user/resume-text
 * Get saved resume text for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const text = await getResumeText(session.user.id)
    
    return NextResponse.json({
      success: true,
      text: text || ''
    })
  } catch (error: any) {
    console.error('Error fetching resume text:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resume text' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/resume-text
 * Save resume text for the user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { text } = body
    
    if (typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid text format' },
        { status: 400 }
      )
    }
    
    await saveResumeText(session.user.id, text)
    
    return NextResponse.json({
      success: true,
      message: 'Resume text saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving resume text:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save resume text' },
      { status: 500 }
    )
  }
}
