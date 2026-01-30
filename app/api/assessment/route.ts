import { NextRequest, NextResponse } from 'next/server'

// Mock assessment data
let assessmentSessions = new Map()

const assessmentSteps = [
  { id: 1, title: 'Personal Information', description: 'Tell us about yourself', completed: true },
  { id: 2, title: 'Skills & Experience', description: 'Your professional background', completed: true },
  { id: 3, title: 'Career Preferences', description: 'What you&apos;re looking for', completed: false },
  { id: 4, title: 'Personality Assessment', description: 'Your work style', completed: false },
  { id: 5, title: 'Results & Recommendations', description: 'Your personalized report', completed: false }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    // Create new assessment session
    const sessionId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session = {
      id: sessionId,
      type: type || 'full',
      currentStep: 1,
      steps: assessmentSteps,
      data: {},
      startedAt: new Date().toISOString(),
      status: 'in_progress'
    }

    assessmentSessions.set(sessionId, session)

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        currentStep: session.currentStep,
        totalSteps: session.steps.length,
        step: session.steps[0]
      },
      message: 'Assessment started successfully'
    })
  } catch (error) {
    console.error('Assessment start error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start assessment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, step, data } = body

    const session = assessmentSessions.get(sessionId)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Assessment session not found' },
        { status: 404 }
      )
    }

    // Update step data
    session.data[step] = data
    session.currentStep = step + 1
    
    // Mark step as completed
    if (session.steps[step - 1]) {
      session.steps[step - 1].completed = true
    }

    // Check if assessment is complete
    if (session.currentStep > session.steps.length) {
      session.status = 'completed'
      session.completedAt = new Date().toISOString()
      
      // Generate mock results
      const results = {
        careerPaths: [
          { title: 'Software Engineering', match: 92, skills: ['JavaScript', 'React', 'Node.js'] },
          { title: 'Data Science', match: 78, skills: ['Python', 'Machine Learning', 'Statistics'] },
          { title: 'Product Management', match: 65, skills: ['Communication', 'Strategy', 'Analytics'] }
        ],
        skills: {
          technical: 85,
          communication: 78,
          leadership: 72,
          creativity: 68
        },
        recommendations: [
          'Focus on advanced JavaScript frameworks',
          'Consider learning cloud technologies',
          'Develop soft skills for leadership roles'
        ]
      }
      
      session.results = results
    }

    assessmentSessions.set(sessionId, session)

    return NextResponse.json({
      success: true,
      data: {
        currentStep: session.currentStep,
        totalSteps: session.steps.length,
        isComplete: session.status === 'completed',
        nextStep: session.currentStep <= session.steps.length ? session.steps[session.currentStep - 1] : null,
        results: session.results || null
      },
      message: session.status === 'completed' ? 'Assessment completed!' : 'Step submitted successfully'
    })
  } catch (error) {
    console.error('Assessment submit error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit assessment step' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // Get specific assessment session
      const session = assessmentSessions.get(sessionId)
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Assessment session not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: session
      })
    } else {
      // Get all assessment templates/steps
      return NextResponse.json({
        success: true,
        data: {
          steps: assessmentSteps,
          types: [
            { id: 'full', name: 'Comprehensive Assessment', duration: '15-20 min', questions: 45 },
            { id: 'quick', name: 'Quick Assessment', duration: '5-10 min', questions: 15 }
          ]
        }
      })
    }
  } catch (error) {
    console.error('Assessment GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assessment data' },
      { status: 500 }
    )
  }
}
