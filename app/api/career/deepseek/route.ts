/**
 * DeepSeek Career Guidance API
 * Real-time career analysis and roadmap based on resume and assessment
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { deepseekCareerAnalysis } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { resumeText, assessmentData } = body

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Resume text is required (min 50 characters)' },
        { status: 400 }
      )
    }

    const result = await deepseekCareerAnalysis(resumeText, assessmentData)

    return NextResponse.json({
      success: true,
      data: result,
      analyzedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('DeepSeek career analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate career guidance',
      },
      { status: 500 }
    )
  }
}
