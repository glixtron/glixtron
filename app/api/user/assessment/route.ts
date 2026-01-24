import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config' 
import { saveAssessmentData, getAssessmentData } from '@/lib/database'

/**
 * GET /api/user/assessment
 * Get assessment data for the user
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
    
    const assessment = await getAssessmentData(session.user.id)
    
    return NextResponse.json({
      success: true,
      assessment: assessment || null
    })
  } catch (error: any) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/assessment
 * Save assessment data for the user
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
    const { coreSkills, softSkills, remotePreference, startupPreference } = body
    
    if (!coreSkills || !softSkills || remotePreference === undefined || startupPreference === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const assessment = await saveAssessmentData(session.user.id, {
      coreSkills,
      softSkills,
      remotePreference,
      startupPreference
    })
    
    return NextResponse.json({
      success: true,
      assessment
    })
  } catch (error: any) {
    console.error('Error saving assessment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save assessment' },
      { status: 500 }
    )
  }
}
