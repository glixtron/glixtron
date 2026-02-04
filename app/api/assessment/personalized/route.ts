import { NextRequest, NextResponse } from 'next/server'
import { personalizedAssessmentEngine } from '@/lib/personalized-assessment-engine'

// Enhanced assessment session storage
let assessmentSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, resumeText, careerGoals } = body

    // Create new personalized assessment session
    const sessionId = `personalized_assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session = {
      id: sessionId,
      type: type || 'personalized',
      currentStep: 'resume_analysis',
      steps: [
        { id: 'resume_analysis', title: 'Resume Analysis', status: 'pending' },
        { id: 'career_aim_analysis', title: 'Career Goal Analysis', status: 'pending' },
        { id: 'personalized_questions', title: 'Personalized Assessment', status: 'pending' },
        { id: 'assessment_completion', title: 'Assessment Results', status: 'pending' },
        { id: 'roadmap_generation', title: 'Personalized Roadmap', status: 'pending' }
      ],
      data: {},
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      personalized: true,
      version: '3.0'
    }

    assessmentSessions.set(sessionId, session)

    // Start with resume analysis if provided
    if (resumeText) {
      try {
        const resumeAnalysis = await personalizedAssessmentEngine.analyzeResume(resumeText)
        session.data.resumeAnalysis = resumeAnalysis
        session.currentStep = 'career_aim_analysis'
        session.steps[0].status = 'completed'
        session.steps[1].status = 'in_progress'
        
        assessmentSessions.set(sessionId, session)

        return NextResponse.json({
          success: true,
          data: {
            sessionId,
            currentStep: session.currentStep,
            steps: session.steps,
            resumeAnalysis,
            nextAction: 'Please provide your career goals'
          },
          message: 'Resume analysis completed. Please provide career goals.'
        })
      } catch (error) {
        console.error('Resume analysis error:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to analyze resume'
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        currentStep: session.currentStep,
        steps: session.steps,
        nextAction: 'Please upload your resume or provide resume text'
      },
      message: 'Personalized assessment session created'
    })
  } catch (error) {
    console.error('Personalized assessment start error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start personalized assessment' },
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

    // Update step data and move to next step
    session.data[step] = data
    
    // Find current step index
    const currentStepIndex = session.steps.findIndex(s => s.id === step)
    if (currentStepIndex !== -1) {
      session.steps[currentStepIndex].status = 'completed'
      
      // Move to next step
      if (currentStepIndex < session.steps.length - 1) {
        session.currentStep = session.steps[currentStepIndex + 1].id
        session.steps[currentStepIndex + 1].status = 'in_progress'
      } else {
        session.status = 'completed'
        session.completedAt = new Date().toISOString()
      }
    }

    // Process step-specific logic
    let responseData: any = {}

    switch (step) {
      case 'career_aim_analysis':
        // Analyze career goals and generate personalized questions
        try {
          const careerAimAnalysis = await personalizedAssessmentEngine.analyzeCareerAims(
            data.careerGoals,
            session.data.resumeAnalysis
          )
          session.data.careerAimAnalysis = careerAimAnalysis

          // Generate personalized questions
          const personalizedQuestions = await personalizedAssessmentEngine.generatePersonalizedQuestions(
            session.data.resumeAnalysis,
            careerAimAnalysis
          )
          session.data.personalizedQuestions = personalizedQuestions

          responseData = {
            careerAimAnalysis,
            personalizedQuestions,
            nextAction: 'Please answer the personalized assessment questions'
          }
        } catch (error) {
          console.error('Career aim analysis error:', error)
          return NextResponse.json({
            success: false,
            error: 'Failed to analyze career goals'
          }, { status: 500 })
        }
        break

      case 'personalized_questions':
        // Store assessment answers and generate roadmap
        try {
          session.data.assessmentAnswers = data.answers

          // Generate personalized roadmap
          const roadmap = await personalizedAssessmentEngine.generateDetailedRoadmap(
            session.data.resumeAnalysis,
            session.data.careerAimAnalysis,
            data.answers
          )
          session.data.roadmap = roadmap

          responseData = {
            roadmap,
            nextAction: 'Review your personalized career roadmap'
          }
        } catch (error) {
          console.error('Roadmap generation error:', error)
          return NextResponse.json({
            success: false,
            error: 'Failed to generate roadmap'
          }, { status: 500 })
        }
        break

      default:
        responseData = { nextAction: 'Continue to next step' }
    }

    assessmentSessions.set(sessionId, session)

    return NextResponse.json({
      success: true,
      data: {
        currentStep: session.currentStep,
        steps: session.steps,
        isComplete: session.status === 'completed',
        ...responseData
      },
      message: session.status === 'completed' ? 'Personalized assessment completed!' : 'Step processed successfully'
    })
  } catch (error) {
    console.error('Personalized assessment submit error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process assessment step' },
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
      // Get assessment information
      return NextResponse.json({
        success: true,
        data: {
          types: [
            { 
              id: 'personalized', 
              name: 'AI-Personalized Assessment', 
              duration: '20-30 min', 
              description: 'Comprehensive assessment based on your resume and career goals',
              features: [
                'Resume analysis',
                'Career goal evaluation',
                'Personalized questions',
                'Detailed roadmap generation',
                'Skill gap identification',
                'Personalized learning path'
              ]
            }
          ],
          process: [
            {
              step: 'Resume Analysis',
              description: 'AI analyzes your skills, experience, and potential',
              duration: '2-3 minutes'
            },
            {
              step: 'Career Goal Analysis',
              description: 'Evaluate your career aspirations and alignment',
              duration: '1-2 minutes'
            },
            {
              step: 'Personalized Assessment',
              description: 'Answer questions tailored to your profile',
              duration: '10-15 minutes'
            },
            {
              step: 'Roadmap Generation',
              description: 'Receive detailed career development plan',
              duration: '1-2 minutes'
            }
          ],
          benefits: [
            'Questions based on your actual experience',
            'Roadmap tailored to your skill gaps',
            'Personalized learning recommendations',
            'Realistic timeline based on assessment',
            'Specific resource recommendations',
            'Measurable success metrics'
          ]
        }
      })
    }
  } catch (error) {
    console.error('Personalized assessment GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assessment data' },
      { status: 500 }
    )
  }
}
