import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-nextauth'

// GlixAI Resume Analyzer Integration
const GlixAIResumeAnalyzer = {
  async analyzeResume(resumeText: string, careerGoals?: string) {
    // Integrate with our existing science streams engine
    const { scienceMatcher } = await import('@/lib/engine/matcher')
    
    // Analyze resume with advanced matching
    const analysis = scienceMatcher.analyzeResume(resumeText)
    
    // Add GlixAI-specific enhancements
    const enhancedAnalysis = {
      ...analysis,
      glixAI_insights: {
        automation_risk: this.calculateAutomationRisk(analysis.skillsFound),
        shadow_salary: this.calculateShadowSalary(analysis.score, analysis.streamData.title),
        future_proofing: this.calculateFutureProofingScore(analysis.skillsFound),
        skill_gaps: analysis.gaps.map(gap => ({
          skill: gap,
          priority: this.getGapPriority(gap, analysis.streamData),
          learning_resources: this.getLearningResources(gap, analysis.streamData)
        }))
      }
    }
    
    return enhancedAnalysis
  },
  
  calculateAutomationRisk(skills: string[]) {
    const highRiskSkills = ['data entry', 'manual testing', 'basic analysis']
    const riskScore = skills.filter(skill => 
      highRiskSkills.some(risk => skill.toLowerCase().includes(risk))
    ).length / skills.length * 100
    
    return {
      score: Math.round(riskScore),
      level: riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low',
      recommendations: riskScore > 30 ? [
        'Focus on AI and machine learning skills',
        'Develop strategic thinking capabilities',
        'Learn automation tools and frameworks'
      ] : []
    }
  },
  
  calculateShadowSalary(score: number, streamTitle: string) {
    const baseSalaries = {
      'Engineering & Physical Sciences': 120000,
      'Medical & Life Sciences': 95000,
      'Integrated Sciences & Advanced Technologies': 140000
    }
    
    const base = baseSalaries[streamTitle as keyof typeof baseSalaries] || 100000
    const multiplier = score / 100
    
    return {
      current: Math.round(base * multiplier),
      potential: Math.round(base * 1.5),
      growth: Math.round((base * 1.5 - base * multiplier) / 1000) + 'k'
    }
  },
  
  calculateFutureProofingScore(skills: string[]) {
    const futureProofSkills = [
      'artificial intelligence', 'machine learning', 'data science',
      'quantum computing', 'biotechnology', 'renewable energy',
      'blockchain', 'cybersecurity', 'cloud computing'
    ]
    
    const matchingSkills = skills.filter(skill =>
      futureProofSkills.some(fp => skill.toLowerCase().includes(fp))
    ).length
    
    const score = (matchingSkills / futureProofSkills.length) * 100
    
    return {
      score: Math.round(score),
      level: score > 70 ? 'Excellent' : score > 40 ? 'Good' : 'Needs Improvement',
      trending_skills: futureProofSkills.filter(fp => 
        !skills.some(skill => skill.toLowerCase().includes(fp))
      ).slice(0, 3)
    }
  },
  
  getGapPriority(gap: string, streamData: any) {
    const criticalGaps = streamData.advancedRoles.flatMap((role: any) => role.gapSkills)
    return criticalGaps.includes(gap) ? 'High' : 'Medium'
  },
  
  getLearningResources(gap: string, streamData: any) {
    return [
      `https://coursera.org/search?query=${encodeURIComponent(gap)}`,
      `https://edx.org/search?query=${encodeURIComponent(gap)}`,
      `https://udemy.com/courses/search/?q=${encodeURIComponent(gap)}`
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { resumeText, careerGoals } = body

    if (!resumeText) {
      return NextResponse.json(
        { success: false, error: 'Resume text is required' },
        { status: 400 }
      )
    }

    // Analyze resume with GlixAI engine
    const analysis = await GlixAIResumeAnalyzer.analyzeResume(resumeText, careerGoals)

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Resume analysis completed successfully'
    })

  } catch (error) {
    console.error('GlixAI Resume Analysis Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        features: ['skill_analysis', 'automation_risk', 'salary_projection', 'future_proofing'],
        provider: 'GlixAI',
        engine: 'Advanced Resume Analyzer'
      },
      message: 'GlixAI Resume Analyzer service is operational'
    })

  } catch (error) {
    console.error('GlixAI Resume Status Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
