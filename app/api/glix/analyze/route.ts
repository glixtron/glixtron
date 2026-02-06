import { NextRequest, NextResponse } from 'next/server'

import { scienceMatcher } from '@/lib/engine/matcher'
import { expandAbbreviations } from '@/lib/engine/utils/dictionary'

type StreamType = 'pcm' | 'pcb' | 'pcmb' | 'general'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      provider: 'GlixAI',
      status: 'operational',
      streams: ['pcm', 'pcb', 'pcmb', 'general'],
      features: ['advanced_matching', 'full_form_expansion', 'gap_analysis', 'salary_projection']
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const resumeText = typeof body?.resumeText === 'string' ? body.resumeText : ''
    const streamType = (body?.streamType as StreamType | undefined) || 'general'

    if (!resumeText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Resume text is required' },
        { status: 400 }
      )
    }

    const expandedText = expandAbbreviations(resumeText)
    const analysis = scienceMatcher.analyzeResume(expandedText, streamType)

    return NextResponse.json({
      success: true,
      data: {
        score: analysis.score,
        stream: analysis.streamData,
        gaps: analysis.gaps,
        recommendations: analysis.recommendations,
        glixAI_insights: {
          automation_risk: {
            level: analysis.score > 80 ? 'Low' : analysis.score > 60 ? 'Medium' : 'High',
            percentage: Math.max(5, 100 - analysis.score)
          },
          shadow_salary: {
            current: 60000 + analysis.score * 500,
            potential: 80000 + analysis.score * 800,
            currency: 'USD'
          },
          future_proofing: {
            score: analysis.score,
            skills_needed: analysis.gaps.slice(0, 3),
            timeline_months: Math.max(3, Math.floor((100 - analysis.score) / 10))
          }
        }
      }
    })
  } catch (error) {
    console.error('GlixAI Analysis Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
