/**
 * Gemini-powered Resume vs JD Analysis API
 * AI analysis and improvement suggestions
 */

import { NextRequest, NextResponse } from 'next/server'
import { geminiAnalyzeResumeJD } from '@/lib/ai-providers'
import { analyzeResume } from '@/lib/resume-analyzer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resume, jobDescription } = body

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { success: false, error: 'Both resume and job description are required' },
        { status: 400 }
      )
    }

    if (resume.length < 50 || jobDescription.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Resume and job description must be at least 50 characters' },
        { status: 400 }
      )
    }

    let geminiAnalysis
    try {
      geminiAnalysis = await geminiAnalyzeResumeJD(resume, jobDescription)
    } catch (aiError: any) {
      console.warn('Gemini analysis failed, using fallback:', aiError?.message)
    }

    // Always run local NLP analysis for additional data
    const localAnalysis = await analyzeResume(resume, jobDescription)

    if (geminiAnalysis) {
      return NextResponse.json({
        success: true,
        aiEnhanced: true,
        data: {
          matchScore: geminiAnalysis.matchScore,
          hiringProbability: geminiAnalysis.hiringProbability,
          suggestions: geminiAnalysis.suggestions,
          keyFindings: geminiAnalysis.keyFindings,
          skillsMatch: localAnalysis.skillsMatch,
          keywords: localAnalysis.keywords,
          nextSteps: geminiAnalysis.suggestions?.map((s: any) => s.action) || localAnalysis.nextSteps,
          analyzedAt: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      aiEnhanced: false,
      data: {
        ...localAnalysis,
        analyzedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Resume analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze resume',
      },
      { status: 500 }
    )
  }
}
