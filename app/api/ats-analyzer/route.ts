/**
 * ATS Analyzer API - Advanced keyword extraction and AI-powered analysis
 * Integrates with Gemini/OpenAI for enhanced resume-JD matching
 */

import { NextRequest, NextResponse } from 'next/server'
import { atsAnalyzer } from '@/lib/ats-analyzer-fallback' // Using fallback version for stability

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, resumeText, jobDescription, industry } = body

    switch (action) {
      case 'extract-keywords':
        if (!jobDescription) {
          return NextResponse.json({
            success: false,
            error: 'Job description is required for keyword extraction'
          }, { status: 400 })
        }

        const keywords = await atsAnalyzer.extractKeywords(jobDescription, industry)
        
        return NextResponse.json({
          success: true,
          action: 'extract-keywords',
          data: keywords
        })

      case 'analyze-resume':
        if (!resumeText || !jobDescription) {
          return NextResponse.json({
            success: false,
            error: 'Both resume text and job description are required for analysis'
          }, { status: 400 })
        }

        const analysis = await atsAnalyzer.analyzeResume(resumeText, jobDescription, industry)
        
        return NextResponse.json({
          success: true,
          action: 'analyze-resume',
          data: analysis
        })

      case 'match-resume':
        if (!resumeText || !jobDescription) {
          return NextResponse.json({
            success: false,
            error: 'Both resume text and job description are required for matching'
          }, { status: 400 })
        }

        const matchResult = await atsAnalyzer.matchResumeToJob(resumeText, jobDescription, industry)
        
        return NextResponse.json({
          success: true,
          action: 'match-resume',
          data: matchResult
        })

      case 'optimize-resume':
        if (!resumeText || !jobDescription) {
          return NextResponse.json({
            success: false,
            error: 'Both resume text and job description are required for optimization'
          }, { status: 400 })
        }

        const analysisForOptimization = await atsAnalyzer.analyzeResume(resumeText, jobDescription, industry)
        
        return NextResponse.json({
          success: true,
          action: 'optimize-resume',
          data: {
            atsScore: analysisForOptimization.atsScore,
            keywordMatch: analysisForOptimization.keywordMatch,
            optimizationSuggestions: analysisForOptimization.optimizationSuggestions,
            recommendations: analysisForOptimization.recommendations,
            missingKeywords: analysisForOptimization.missingKeywords.slice(0, 10),
            highConversionKeywords: analysisForOptimization.highConversionKeywords
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['extract-keywords', 'analyze-resume', 'match-resume', 'optimize-resume']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('ATS Analyzer API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process ATS analysis',
      message: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'industries':
        return NextResponse.json({
          success: true,
          action: 'industries',
          data: {
            industries: [
              { value: 'technology', label: 'Technology' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'finance', label: 'Finance' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'general', label: 'General' }
            ]
          }
        })

      case 'action-verbs':
        const { ATS_ACTION_VERBS } = await import('@/lib/ats-analyzer-fallback')
        return NextResponse.json({
          success: true,
          action: 'action-verbs',
          data: {
            actionVerbs: ATS_ACTION_VERBS
          }
        })

      case 'high-conversion-keywords':
        const { HIGH_CONVERSION_KEYWORDS } = await import('@/lib/ats-analyzer-fallback')
        const industry = searchParams.get('industry')
        
        if (industry && HIGH_CONVERSION_KEYWORDS[industry as keyof typeof HIGH_CONVERSION_KEYWORDS]) {
          return NextResponse.json({
            success: true,
            action: 'high-conversion-keywords',
            data: {
              industry,
              keywords: HIGH_CONVERSION_KEYWORDS[industry as keyof typeof HIGH_CONVERSION_KEYWORDS]
            }
          })
        } else {
          return NextResponse.json({
            success: true,
            action: 'high-conversion-keywords',
            data: HIGH_CONVERSION_KEYWORDS
          })
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['industries', 'action-verbs', 'high-conversion-keywords']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('ATS Analyzer GET API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}
