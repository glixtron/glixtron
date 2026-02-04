import { NextRequest, NextResponse } from 'next/server'
import { integratedCareerGuidance } from '@/lib/integrated-career-guidance'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, careerGoals, jobDescriptionUrl, jobDescriptionText } = body

    if (!resumeText || !careerGoals) {
      return NextResponse.json(
        { success: false, error: 'Resume text and career goals are required' },
        { status: 400 }
      )
    }

    // Extract job description if URL or text is provided
    let targetJD = null
    if (jobDescriptionUrl || jobDescriptionText) {
      try {
        // Import here to avoid circular dependencies
        const { advancedJDExtractor } = await import('@/lib/advanced-jd-extractor')
        targetJD = await advancedJDExtractor.extractJD(jobDescriptionUrl, jobDescriptionText)
      } catch (error) {
        console.error('JD extraction failed:', error)
        // Continue without JD - not critical
      }
    }

    // Generate comprehensive career guidance
    const careerGuidance = await integratedCareerGuidance.generateComprehensiveCareerGuidance(
      resumeText,
      careerGoals,
      targetJD || undefined
    )

    return NextResponse.json({
      success: true,
      data: careerGuidance,
      message: 'Comprehensive career guidance generated successfully'
    })
  } catch (error) {
    console.error('Career guidance generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate career guidance' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // In a real implementation, you would retrieve saved career guidance from database
      return NextResponse.json({
        success: false,
        error: 'Session not found - please generate new career guidance'
      }, { status: 404 })
    } else {
      // Return information about the integrated career guidance service
      return NextResponse.json({
        success: true,
        data: {
          service: 'Integrated Career Guidance',
          features: [
            'Advanced resume parsing with AI',
            'Personalized assessment questions',
            'Skill gap analysis with learning paths',
            'DeepSeek AI-powered roadmap generation',
            'Market insights and salary analysis',
            'Comprehensive career recommendations',
            'One-time resume upload for all features',
            'Maximum matching accuracy'
          ],
          process: [
            {
              step: 1,
              title: 'Resume Analysis',
              description: 'Advanced AI parsing of your resume with comprehensive skill extraction',
              duration: '1-2 minutes'
            },
            {
              step: 2,
              title: 'Career Goal Analysis',
              description: 'Analysis of your career aspirations and target roles',
              duration: '30 seconds'
            },
            {
              step: 3,
              title: 'Skill Gap Analysis',
              description: 'Detailed analysis of current skills vs required skills',
              duration: '1 minute'
            },
            {
              step: 4,
              title: 'Personalized Roadmap',
              description: 'DeepSeek AI generates detailed career development roadmap',
              duration: '2-3 minutes'
            },
            {
              step: 5,
              title: 'Market Insights',
              description: 'Current market analysis and salary expectations',
              duration: '30 seconds'
            }
          ],
          benefits: [
            'Truly personalized questions based on your resume',
            'No generic or repeated questions',
            'Maximum skill matching accuracy',
            'Detailed step-by-step learning paths',
            'Real-time market data integration',
            'Comprehensive career recommendations',
            'Skill gap analysis with specific resources',
            'Timeline-based achievement tracking'
          ]
        }
      })
    }
  } catch (error) {
    console.error('Career guidance GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch career guidance information' },
      { status: 500 }
    )
  }
}
