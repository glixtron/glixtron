import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config' 
import { saveAssessment, getAssessment } from '@/lib/supabase-client'

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
    
    const assessment = await getAssessment(session.user.id)
    
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
    
    const result = await saveAssessment(session.user.id, {
      coreSkills: coreSkills || [],
      softSkills: softSkills || [],
      remotePreference: remotePreference || 50,
      startupPreference: startupPreference || 50
    })
    
    return NextResponse.json({
      success: true,
      assessment: result
    })
  } catch (error: any) {
    console.error('Error saving assessment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save assessment' },
      { status: 500 }
    )
  }
}
