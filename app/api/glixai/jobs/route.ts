import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-nextauth'

// GlixAI Job Hunter Integration
const GlixAIJobHunter = {
  async searchJobs(query: string, location?: string, stream?: string) {
    // Integrate with our existing system and add GlixAI enhancements
    const jobs = await this.fetchJobsFromAPIs(query, location, stream)
    
    // Enhance with GlixAI intelligence
    const enhancedJobs = jobs.map(job => ({
      ...job,
      glixAI_insights: {
        match_score: this.calculateJobMatch(job, query, stream),
        automation_risk: this.calculateJobAutomationRisk(job),
        growth_potential: this.calculateGrowthPotential(job),
        skill_alignment: this.calculateSkillAlignment(job, stream)
      }
    }))
    
    // Sort by match score
    return enhancedJobs.sort((a, b) => b.glixAI_insights.match_score - a.glixAI_insights.match_score)
  },
  
  async fetchJobsFromAPIs(query: string, location?: string, stream?: string) {
    // Mock job data - in production, integrate with real job APIs
    const mockJobs = [
      {
        id: '1',
        title: 'Data Scientist',
        company: 'TechCorp',
        location: location || 'San Francisco, CA',
        description: 'Looking for experienced data scientist with ML expertise',
        requirements: ['Python', 'Machine Learning', 'Statistics', 'Data Visualization'],
        salary: '$120,000 - $180,000',
        posted: '2 days ago',
        portal: 'LinkedIn'
      },
      {
        id: '2',
        title: 'Research Scientist',
        company: 'BioTech Labs',
        location: location || 'Boston, MA',
        description: 'Research position in molecular biology and genetics',
        requirements: ['Molecular Biology', 'CRISPR', 'Cell Culture', 'Data Analysis'],
        salary: '$95,000 - $140,000',
        posted: '1 week ago',
        portal: 'NatureCareers'
      },
      {
        id: '3',
        title: 'Quantum Computing Engineer',
        company: 'QuantumTech',
        location: location || 'Seattle, WA',
        description: 'Join our quantum computing research team',
        requirements: ['Quantum Mechanics', 'Python', 'Linear Algebra', 'Research'],
        salary: '$140,000 - $200,000',
        posted: '3 days ago',
        portal: 'PhysicsToday'
      }
    ]
    
    // Filter by stream if specified
    if (stream) {
      return mockJobs.filter(job => 
        this.isJobRelevantToStream(job, stream)
      )
    }
    
    return mockJobs
  },
  
  isJobRelevantToStream(job: any, stream: string) {
    const streamKeywords = {
      'pcm': ['data', 'quantum', 'computing', 'engineer', 'software'],
      'pcb': ['biology', 'research', 'molecular', 'genetics', 'lab'],
      'pcmb': ['quantum', 'biology', 'computational', 'biophysics', 'research']
    }
    
    const keywords = streamKeywords[stream as keyof typeof streamKeywords] || []
    const jobText = `${job.title} ${job.description} ${job.requirements.join(' ')}`.toLowerCase()
    
    return keywords.some(keyword => jobText.includes(keyword))
  },
  
  calculateJobMatch(job: any, query: string, stream?: string) {
    const queryTerms = query.toLowerCase().split(' ')
    const jobText = `${job.title} ${job.description} ${job.requirements.join(' ')}`.toLowerCase()
    
    let matchScore = 0
    queryTerms.forEach(term => {
      if (jobText.includes(term)) {
        matchScore += 25
      }
    })
    
    // Bonus for stream relevance
    if (stream && this.isJobRelevantToStream(job, stream)) {
      matchScore += 20
    }
    
    return Math.min(matchScore, 100)
  },
  
  calculateJobAutomationRisk(job: any) {
    const highRiskKeywords = ['data entry', 'manual', 'routine', 'repetitive']
    const lowRiskKeywords = ['strategy', 'research', 'innovation', 'creative', 'leadership']
    
    const jobText = `${job.title} ${job.description}`.toLowerCase()
    
    const highRiskCount = highRiskKeywords.filter(keyword => jobText.includes(keyword)).length
    const lowRiskCount = lowRiskKeywords.filter(keyword => jobText.includes(keyword)).length
    
    const riskScore = Math.max(0, (highRiskCount - lowRiskCount) * 20)
    
    return {
      score: riskScore,
      level: riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low'
    }
  },
  
  calculateGrowthPotential(job: any) {
    const growthKeywords = ['senior', 'lead', 'manager', 'director', 'head']
    const techKeywords = ['ai', 'machine learning', 'quantum', 'biotech', 'data science']
    
    const jobText = `${job.title} ${job.description}`.toLowerCase()
    
    const hasGrowthKeywords = growthKeywords.some(keyword => jobText.includes(keyword))
    const hasTechKeywords = techKeywords.some(keyword => jobText.includes(keyword))
    
    if (hasGrowthKeywords) return 'High'
    if (hasTechKeywords) return 'Medium-High'
    return 'Medium'
  },
  
  calculateSkillAlignment(job: any, stream?: string) {
    // This would integrate with user's skill profile in production
    const mockAlignment = {
      matched_skills: ['Python', 'Data Analysis'],
      missing_skills: ['Cloud Computing', 'DevOps'],
      alignment_score: 75
    }
    
    return mockAlignment
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
    const { query, location, stream } = body

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Search jobs with GlixAI engine
    const jobs = await GlixAIJobHunter.searchJobs(query, location, stream)

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        total: jobs.length,
        query,
        location: location || 'Remote',
        stream
      },
      message: 'Job search completed successfully'
    })

  } catch (error) {
    console.error('GlixAI Job Search Error:', error)
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
        features: ['intelligent_search', 'match_scoring', 'automation_risk', 'growth_potential'],
        provider: 'GlixAI',
        engine: 'Autonomous Job Hunter'
      },
      message: 'GlixAI Job Hunter service is operational'
    })

  } catch (error) {
    console.error('GlixAI Job Status Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
