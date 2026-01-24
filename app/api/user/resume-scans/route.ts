import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { saveResumeScan, getResumeScans, deleteResumeScan } from '@/lib/database'

/**
 * GET /api/user/resume-scans
 * Get all resume scans for the user
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
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const scans = await getResumeScans(session.user.id, limit)
    
    return NextResponse.json({
      success: true,
      scans
    })
  } catch (error: any) {
    console.error('Error fetching resume scans:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resume scans' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/resume-scans
 * Save a new resume scan
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { resumeText, jdText, jdLink, analysis, matchScore } = body
    
    if (!resumeText || !jdText || !analysis) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const scan = await saveResumeScan(session.user.id, {
      resumeText,
      jdText,
      jdLink,
      analysis,
      matchScore: matchScore || 0
    })
    
    return NextResponse.json({
      success: true,
      scan
    })
  } catch (error: any) {
    console.error('Error saving resume scan:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save resume scan' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/resume-scans
 * Delete a resume scan
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const scanId = searchParams.get('id')
    
    if (!scanId) {
      return NextResponse.json(
        { error: 'Scan ID required' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteResumeScan(scanId, session.user.id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Scan not found or unauthorized' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Scan deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting resume scan:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete resume scan' },
      { status: 500 }
    )
  }
}
