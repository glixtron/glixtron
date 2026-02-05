import { NextRequest, NextResponse } from 'next/server'
import { scienceMatcher, StreamAnalysis, MatchResult } from '@/lib/engine/matcher'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, careerGoals, streamId, detailed = false } = body

    // Input validation
    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Resume text is required and must be a string',
          code: 'INVALID_INPUT'
        }, 
        { status: 400 }
      )
    }

    if (resumeText.length < 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Resume text is too short (minimum 100 characters)',
          code: 'INPUT_TOO_SHORT'
        }, 
        { status: 400 }
      )
    }

    if (resumeText.length > 50000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Resume text is too long (maximum 50,000 characters)',
          code: 'INPUT_TOO_LONG'
        }, 
        { status: 400 }
      )
    }

    // Perform analysis
    let result: MatchResult | StreamAnalysis
    
    if (streamId) {
      // Analyze for specific stream
      result = scienceMatcher.analyzeResume(resumeText, streamId)
    } else {
      // Auto-detect best stream
      result = scienceMatcher.detectBestStream(resumeText)
    }

    // Add career goals analysis if provided
    if (careerGoals && typeof careerGoals === 'string') {
      const goalsAnalysis = analyzeCareerGoals(careerGoals, result)
      return NextResponse.json({
        success: true,
        data: {
          ...result,
          goalsAnalysis
        },
        message: 'Career analysis completed successfully',
        timestamp: new Date().toISOString()
      })
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Career analysis completed successfully',
      timestamp: new Date().toISOString()
    })    }

  } catch (error) {
    console.error('Career analysis error:', error)
    
    // Handle different error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON format in request body',
          code: 'JSON_PARSE_ERROR'
        }, 
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Request timeout. Please try again.',
          code: 'TIMEOUT_ERROR'
        }, 
        { status: 408 }
      )
    }

    // Generic server error
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR'
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'streams':
        // Return available streams
        return NextResponse.json({
          success: true,
          data: {
            streams: [
              { id: 'pcm', title: 'Engineering & Physical Sciences', description: 'Physics, Chemistry, Mathematics focus' },
              { id: 'pcb', title: 'Medical & Life Sciences', description: 'Biology, Chemistry, Medical focus' },
              { id: 'pcmb', title: 'Integrated Sciences', description: 'Combined sciences and advanced technologies' }
            ]
          },
          message: 'Available streams retrieved successfully'
        })

      case 'health':
        // Health check endpoint
        return NextResponse.json({
          success: true,
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            features: ['advanced-matching', 'stream-detection', 'gap-analysis', 'career-recommendations']
          },
          message: 'Service is operational'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter',
          availableActions: ['streams', 'health']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('GET request error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }, 
      { status: 500 }
    )
  }
}

/**
 * Analyze career goals and align with analysis results
 */
function analyzeCareerGoals(goals: string, analysis: MatchResult | StreamAnalysis): any {
  const goalsLower = goals.toLowerCase()
  const goalsWords = goalsLower.split(/\s+/).filter(word => word.length > 2)
  
  // Extract key themes from goals
  const themes = {
    research: goalsWords.some(word => word.includes('research') || word.includes('investigat')),
    industry: goalsWords.some(word => word.includes('industry') || word.includes('corporate') || word.includes('company')),
    academic: goalsWords.some(word => word.includes('academic') || word.includes('university') || word.includes('professor')),
    leadership: goalsWords.some(word => word.includes('lead') || word.includes('manage') || word.includes('director')),
    entrepreneurship: goalsWords.some(word => word.includes('entrepreneur') || word.includes('startup') || word.includes('found')),
    innovation: goalsWords.some(word => word.includes('innovat') || word.includes('develop') || word.includes('create'))
  }

  // Calculate goal alignment score
  const themeCount = Object.values(themes).filter(Boolean).length
  const alignmentScore = Math.min((themeCount / 3) * 100, 100)

  return {
    themes,
    alignmentScore: Math.round(alignmentScore),
    recommendations: generateGoalRecommendations(themes, analysis),
    summary: generateGoalSummary(themes, goals)
  }
}

/**
 * Generate recommendations based on career goals themes
 */
function generateGoalRecommendations(themes: any, analysis: MatchResult | StreamAnalysis): string[] {
  const recommendations: string[] = []

  if (themes.research) {
    recommendations.push('Consider pursuing advanced research positions or graduate programs')
  }

  if (themes.industry) {
    recommendations.push('Focus on developing industry-relevant skills and certifications')
  }

  if (themes.academic) {
    recommendations.push('Build strong publication record and teaching experience')
  }

  if (themes.leadership) {
    recommendations.push('Develop management and communication skills')
  }

  if (themes.entrepreneurship) {
    recommendations.push('Consider startup incubators and entrepreneurship programs')
  }

  if (themes.innovation) {
    recommendations.push('Focus on cutting-edge technologies and innovation methodologies')
  }

  return recommendations
}

/**
 * Generate a summary of career goals
 */
function generateGoalSummary(themes: any, goals: string): string {
  const activeThemes = Object.entries(themes)
    .filter(([_, active]) => active)
    .map(([theme, _]) => theme)

  if (activeThemes.length === 0) {
    return 'Career goals appear to be general or unclear. Consider specifying more focused objectives.'
  }

  const themeDescriptions = {
    research: 'research-oriented',
    industry: 'industry-focused',
    academic: 'academically-inclined',
    leadership: 'leadership-driven',
    entrepreneurship: 'entrepreneurial',
    innovation: 'innovation-focused'
  }

  const descriptions = activeThemes.map(theme => (themeDescriptions as any)[theme] || theme)
  
  return `Career goals show ${descriptions.join(' and ')} preferences with ${activeThemes.length} key focus areas.`
}
