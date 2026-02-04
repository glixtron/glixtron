import { NextRequest, NextResponse } from 'next/server'
import { aiAssessmentEngine } from '@/lib/ai-assessment-engine'

// Enhanced assessment data storage
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
      status: 'in_progress',
      aiEnhanced: true,
      version: '2.0'
    }

    assessmentSessions.set(sessionId, session)

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        currentStep: session.currentStep,
        totalSteps: session.steps.length,
        step: session.steps[0],
        aiEnhanced: true,
        features: [
          'AI-powered career path analysis',
          'Comprehensive skill assessment',
          'Market trend insights',
          'Personalized learning recommendations',
          'Real-time job market data'
        ]
      },
      message: 'Advanced AI Assessment started successfully'
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
      
      // Generate AI-powered results
      const results = await generateAIResults(session.data)
      
      session.results = results
      session.aiProcessed = true
    }

    assessmentSessions.set(sessionId, session)

    return NextResponse.json({
      success: true,
      data: {
        currentStep: session.currentStep,
        totalSteps: session.steps.length,
        isComplete: session.status === 'completed',
        nextStep: session.currentStep <= session.steps.length ? session.steps[session.currentStep - 1] : null,
        results: session.results || null,
        aiProcessed: session.aiProcessed || false
      },
      message: session.status === 'completed' ? 'AI Assessment completed!' : 'Step submitted successfully'
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
            { 
              id: 'full', 
              name: 'AI Comprehensive Assessment', 
              duration: '15-20 min', 
              questions: 45,
              features: [
                'AI-powered career analysis',
                'Skill gap identification',
                'Market insights',
                'Personalized learning path'
              ]
            },
            { 
              id: 'quick', 
              name: 'Quick AI Assessment', 
              duration: '5-10 min', 
              questions: 15,
              features: [
                'Rapid skill assessment',
                'Basic career matching',
                'Quick recommendations'
              ]
            }
          ],
          aiFeatures: [
            'Advanced AI analysis',
            'Real-time market data',
            'Personalized recommendations',
            'Skill gap analysis',
            'Career path optimization'
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

async function generateAIResults(assessmentData: any) {
  try {
    // Build comprehensive profile from assessment data
    const profile = {
      personalInfo: assessmentData[1] || {},
      skills: assessmentData[2] || {},
      career: assessmentData[3] || {},
      personality: assessmentData[4] || {}
    }

    // Use AI assessment engine for comprehensive analysis
    const aiResults = await aiAssessmentEngine.generateComprehensiveAssessment(profile)
    
    // Enhance with additional metrics
    return {
      ...aiResults,
      assessmentMetadata: {
        completedAt: new Date().toISOString(),
        assessmentType: 'AI Comprehensive',
        version: '2.0',
        dataPoints: Object.keys(assessmentData).length,
        aiProcessed: true,
        confidence: calculateOverallConfidence(aiResults)
      },
      additionalInsights: {
        marketReadiness: calculateMarketReadiness(aiResults),
        skillVelocity: calculateSkillVelocity(profile),
        careerTrajectory: calculateCareerTrajectory(aiResults),
        competitiveAdvantage: calculateCompetitiveAdvantage(aiResults)
      }
    }
  } catch (error) {
    console.error('AI Results generation error:', error)
    // Fallback to enhanced mock results
    return generateEnhancedMockResults(assessmentData)
  }
}

function calculateOverallConfidence(results: any): number {
  const careerPathConfidence = results.careerPaths.reduce((acc: number, path: any) => acc + path.confidence, 0) / results.careerPaths.length
  const skillsConfidence = (results.skillsAnalysis.technical.total + results.skillsAnalysis.soft.total) / 2
  return Math.round((careerPathConfidence + skillsConfidence) / 2)
}

function calculateMarketReadiness(results: any): number {
  const marketDemand = results.careerPaths[0]?.marketDemand || 0
  const skillsScore = results.skillsAnalysis.overall
  return Math.round((marketDemand + skillsScore) / 2)
}

function calculateSkillVelocity(profile: any): number {
  // Calculate how quickly user can acquire new skills based on their profile
  const baseVelocity = 75
  const learningBonus = profile.personality?.learningStyle ? 10 : 0
  const experienceBonus = profile.skills?.technical?.length > 5 ? 15 : 0
  return Math.min(95, baseVelocity + learningBonus + experienceBonus)
}

function calculateCareerTrajectory(results: any): string {
  const topPath = results.careerPaths[0]
  if (topPath?.match > 85) return 'Fast-track'
  if (topPath?.match > 70) return 'Steady Growth'
  return 'Development Needed'
}

function calculateCompetitiveAdvantage(results: any): number {
  const uniqueSkills = results.skillsAnalysis.technical.strengths.length
  const marketDemand = results.marketAnalysis.currentMarket.includes('High') ? 20 : 10
  const growthPotential = results.careerPaths[0]?.growthPotential || 0
  return Math.min(95, uniqueSkills * 5 + marketDemand + growthPotential / 5)
}

function generateEnhancedMockResults(assessmentData: any) {
  return {
    careerPaths: [
      {
        title: 'Senior Software Engineer',
        match: 92,
        confidence: 88,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        growthPotential: 85,
        marketDemand: 90,
        salaryRange: '$90k-140k',
        timeline: '2-3 years',
        requiredSkills: ['Advanced JavaScript', 'System Design', 'Cloud Architecture'],
        companies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
        description: 'Lead development of complex software systems and mentor junior developers'
      },
      {
        title: 'Full Stack Developer',
        match: 88,
        confidence: 82,
        skills: ['React', 'Node.js', 'Python', 'Database'],
        growthPotential: 80,
        marketDemand: 85,
        salaryRange: '$80k-120k',
        timeline: '1-2 years',
        requiredSkills: ['Frontend', 'Backend', 'DevOps'],
        companies: ['Startups', 'Tech Companies', 'Digital Agencies'],
        description: 'Develop both frontend and backend applications with modern technologies'
      }
    ],
    skillsAnalysis: {
      technical: {
        total: 85,
        strengths: ['JavaScript', 'React', 'Problem Solving'],
        improvements: ['Cloud Computing', 'System Design'],
        recommendations: ['Learn AWS', 'Study algorithms', 'Build complex projects']
      },
      soft: {
        total: 78,
        strengths: ['Communication', 'Teamwork', 'Adaptability'],
        improvements: ['Leadership', 'Public Speaking'],
        recommendations: ['Take leadership course', 'Join tech meetups', 'Mentor others']
      },
      overall: 82
    },
    personalityInsights: {
      workStyle: 'Collaborative and Detail-Oriented',
      teamFit: ['Agile Teams', 'Startup Environment', 'Innovation Labs'],
      leadershipPotential: 75,
      communicationStyle: 'Clear and Direct',
      stressHandling: 'Resilient under pressure',
      motivationType: 'Achievement-oriented and Growth-focused'
    },
    marketAnalysis: {
      currentMarket: 'High demand for skilled developers with modern tech stack',
      growthAreas: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'Data Science'],
      salaryInsights: 'Above average market rates with strong growth potential',
      competition: 'Moderate - specialized skills reduce competition',
      trends: ['Remote work', 'AI integration', 'Sustainable tech', 'Web3']
    },
    recommendations: {
      immediate: ['Update portfolio with recent projects', 'Get AWS certification', 'Contribute to open source'],
      shortTerm: ['Learn cloud architecture', 'Master system design', 'Build network in tech community'],
      longTerm: ['Move to leadership role', 'Specialize in emerging technologies', 'Start technical blog'],
      skills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
      networking: ['Tech meetups', 'LinkedIn groups', 'Conferences']
    },
    learningPath: [
      {
        phase: 'Foundation Enhancement',
        duration: '3 months',
        skills: ['Advanced JavaScript', 'TypeScript', 'React Patterns'],
        resources: [
          {
            type: 'course',
            title: 'Advanced TypeScript',
            provider: 'Udemy',
            duration: '20 hours',
            difficulty: 'Intermediate',
            url: 'https://udemy.com/typescript',
            certification: true
          }
        ],
        milestones: ['Master TypeScript', 'Build complex React app'],
        projects: ['E-commerce platform', 'Real-time chat app']
      }
    ],
    successMetrics: {
      keyIndicators: ['Technical skill mastery (85%+)', 'Project completion rate', 'Team collaboration score'],
      timeBoundGoals: ['Senior position within 2 years', 'AWS certification in 6 months'],
      skillMilestones: ['Master TypeScript and React', 'Become AWS certified'],
      careerMilestones: ['Promotion to Senior Developer', 'Technical Lead role']
    },
    assessmentMetadata: {
      completedAt: new Date().toISOString(),
      assessmentType: 'AI Comprehensive',
      version: '2.0',
      dataPoints: Object.keys(assessmentData).length,
      aiProcessed: false,
      confidence: 82
    },
    additionalInsights: {
      marketReadiness: 85,
      skillVelocity: 80,
      careerTrajectory: 'Steady Growth',
      competitiveAdvantage: 75
    }
  }
}
