import { NextRequest, NextResponse } from 'next/server'

import { scienceMatcher } from '@/lib/engine/matcher'
import { expandAbbreviations } from '@/lib/engine/utils/dictionary'

type StreamType = 'pcm' | 'pcb' | 'pcmb' | 'general'

// Helper Functions
function generateRoadmap(score: number, gaps: any[], streamTitle: string) {
  const steps = []
  const milestones = []
  const totalTimeline = Math.max(6, Math.floor((100 - score) / 5))
  
  // Step 1: Foundation
  steps.push({
    step: 1,
    title: 'Foundation Building',
    description: `Establish core ${streamTitle} fundamentals`,
    duration_months: Math.floor(totalTimeline * 0.2),
    skills_to_acquire: gaps.slice(0, 2).map(g => g.skill || g),
    resources: ['Online courses', 'Industry certifications', 'Hands-on projects']
  })
  
  // Step 2: Skill Development
  steps.push({
    step: 2,
    title: 'Advanced Skill Development',
    description: 'Master specialized skills and technologies',
    duration_months: Math.floor(totalTimeline * 0.3),
    skills_to_acquire: gaps.slice(2, 4).map(g => g.skill || g),
    resources: ['Advanced workshops', 'Mentorship programs', 'Open source contributions']
  })
  
  // Step 3: Practical Application
  steps.push({
    step: 3,
    title: 'Practical Application',
    description: 'Apply skills in real-world scenarios',
    duration_months: Math.floor(totalTimeline * 0.3),
    skills_to_acquire: gaps.slice(4, 6).map(g => g.skill || g),
    resources: ['Internships', 'Freelance projects', 'Industry collaborations']
  })
  
  // Step 4: Career Launch
  steps.push({
    step: 4,
    title: 'Career Launch & Optimization',
    description: 'Launch career with optimized profile and strategy',
    duration_months: Math.floor(totalTimeline * 0.2),
    skills_to_acquire: [],
    resources: ['Resume optimization', 'Interview preparation', 'Networking strategies']
  })
  
  // Milestones
  milestones.push({
    month: Math.floor(totalTimeline * 0.25),
    title: 'Core Competency Achieved',
    description: 'Master fundamental concepts and skills'
  })
  
  milestones.push({
    month: Math.floor(totalTimeline * 0.5),
    title: 'Mid-Point Proficiency',
    description: 'Demonstrate intermediate to advanced skills'
  })
  
  milestones.push({
    month: Math.floor(totalTimeline * 0.75),
    title: 'Expert Level Attainment',
    description: 'Achieve expert-level competency in chosen field'
  })
  
  milestones.push({
    month: totalTimeline,
    title: 'Career Readiness',
    description: 'Fully prepared for target career opportunities'
  })
  
  return { steps, milestones, totalTimeline }
}

function generateJobRecommendations(streamType: string, score: number, gaps: any[]) {
  const jobs = []
  
  // Based on stream type and score
  if (streamType === 'pcm') {
    jobs.push(
      {
        title: 'Software Development Engineer',
        match_percentage: Math.min(95, score + 20),
        salary_range: '$70,000 - $120,000',
        required_skills: ['Programming', 'Mathematics', 'Problem Solving'],
        growth_potential: 'High'
      },
      {
        title: 'Data Scientist',
        match_percentage: Math.min(90, score + 15),
        salary_range: '$80,000 - $140,000',
        required_skills: ['Statistics', 'Machine Learning', 'Python/R'],
        growth_potential: 'Very High'
      }
    )
  } else if (streamType === 'pcb') {
    jobs.push(
      {
        title: 'Biomedical Engineer',
        match_percentage: Math.min(92, score + 18),
        salary_range: '$65,000 - $110,000',
        required_skills: ['Biology', 'Chemistry', 'Engineering'],
        growth_potential: 'High'
      },
      {
        title: 'Research Scientist',
        match_percentage: Math.min(88, score + 12),
        salary_range: '$60,000 - $100,000',
        required_skills: ['Research Methods', 'Laboratory Skills', 'Data Analysis'],
        growth_potential: 'Medium'
      }
    )
  }
  
  // Add general jobs for all streams
  jobs.push(
    {
      title: 'Technical Product Manager',
      match_percentage: Math.min(85, score + 10),
      salary_range: '$90,000 - $150,000',
      required_skills: ['Communication', 'Technical Knowledge', 'Leadership'],
      growth_potential: 'High'
    },
    {
      title: 'Solutions Architect',
      match_percentage: Math.min(87, score + 12),
      salary_range: '$100,000 - $160,000',
      required_skills: ['System Design', 'Technical Architecture', 'Project Management'],
      growth_potential: 'Very High'
    }
  )
  
  return jobs
}

function getGapDescription(skill: string): string {
  const descriptions: { [key: string]: string } = {
    'Programming': 'Essential for modern software development and automation',
    'Mathematics': 'Fundamental for analytical thinking and problem-solving',
    'Communication': 'Critical for team collaboration and career advancement',
    'Leadership': 'Important for management and senior positions',
    'Machine Learning': 'High-demand skill in current tech industry',
    'Data Analysis': 'Required for data-driven decision making'
  }
  return descriptions[skill] || `Important skill for career development in ${skill}`
}

function getEstimatedTimeToClose(priority: string): string {
  const timeMap: { [key: string]: string } = {
    'high': '1-2 months',
    'medium': '3-4 months',
    'low': '5-6 months'
  }
  return timeMap[priority] || '3-4 months'
}

function getResourcesForSkill(skill: string): string[] {
  const resourceMap: { [key: string]: string[] } = {
    'Programming': ['Coursera', 'LeetCode', 'GitHub Projects', 'Stack Overflow'],
    'Mathematics': ['Khan Academy', 'MIT OpenCourseWare', 'Wolfram Alpha'],
    'Communication': ['Toastmasters', 'Dale Carnegie Courses', 'Public Speaking Practice'],
    'Leadership': ['Harvard Business Review', 'Leadership Courses', 'Mentorship Programs'],
    'Machine Learning': ['Andrew Ng Courses', 'Kaggle Competitions', 'TensorFlow Tutorials'],
    'Data Analysis': ['Excel/SQL Courses', 'Tableau Training', 'Python Pandas']
  }
  return resourceMap[skill] || ['Online Courses', 'Industry Certifications', 'Practice Projects']
}

function getEstimatedDuration(skill: string): string {
  const durationMap: { [key: string]: string } = {
    'Programming': '3-6 months',
    'Mathematics': '2-4 months',
    'Communication': '1-3 months',
    'Leadership': '6-12 months',
    'Machine Learning': '6-9 months',
    'Data Analysis': '2-4 months'
  }
  return durationMap[skill] || '3-6 months'
}

function getCurrentLevel(score: number): string {
  if (score >= 80) return 'Expert'
  if (score >= 60) return 'Advanced'
  if (score >= 40) return 'Intermediate'
  if (score >= 20) return 'Beginner'
  return 'Foundation'
}

function getAutomationRiskExplanation(score: number): string {
  if (score >= 80) return 'Low risk due to advanced technical and creative skills'
  if (score >= 60) return 'Moderate risk with some automatable tasks'
  return 'High risk due to routine and repetitive tasks'
}

function getMarketDemand(streamType: string): string {
  const demandMap: { [key: string]: string } = {
    'pcm': 'Very High - Software and tech industries booming',
    'pcb': 'High - Healthcare and biotech sectors growing',
    'pcmb': 'Very High - Combined tech and health opportunities',
    'general': 'Moderate - Depends on specialization'
  }
  return demandMap[streamType] || 'Moderate'
}

function getCareerStability(score: number): string {
  if (score >= 80) return 'Very Stable - Multiple career options'
  if (score >= 60) return 'Stable - Good career prospects'
  if (score >= 40) return 'Moderately Stable - Some vulnerability'
  return 'Less Stable - Need skill diversification'
}

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

    // Generate step-by-step roadmap
    const roadmap = generateRoadmap(analysis.score, analysis.gaps, analysis.streamData.title)
    
    // Generate job recommendations
    const jobRecommendations = generateJobRecommendations(streamType, analysis.score, analysis.gaps)

    return NextResponse.json({
      success: true,
      data: {
        // Basic Analysis
        score: analysis.score,
        stream: analysis.streamData,
        
        // Formal Sections
        gap_analysis: {
          total_gaps: analysis.gaps.length,
          critical_gaps: analysis.gaps.filter((gap: any) => gap.priority === 'high'),
          moderate_gaps: analysis.gaps.filter((gap: any) => gap.priority === 'medium'),
          low_gaps: analysis.gaps.filter((gap: any) => gap.priority === 'low'),
          detailed_gaps: analysis.gaps.map((gap: any) => ({
            skill: gap.skill || gap,
            priority: gap.priority || 'medium',
            description: getGapDescription(gap.skill || gap),
            estimated_time_to_close: getEstimatedTimeToClose(gap.priority || 'medium')
          }))
        },
        
        recommendations: {
          immediate_actions: analysis.recommendations.slice(0, 3),
          long_term_goals: analysis.recommendations.slice(3, 6),
          skill_development: analysis.recommendations.slice(0, 5).map((rec: any) => ({
            title: rec.title || rec,
            description: rec.description || `Focus on developing ${rec.title || rec}`,
            resources: getResourcesForSkill(rec.title || rec),
            estimated_duration: getEstimatedDuration(rec.title || rec)
          }))
        },
        
        job_recommendations: jobRecommendations,
        
        // Career Roadmap
        career_roadmap: {
          current_level: getCurrentLevel(analysis.score),
          next_steps: roadmap.steps,
          timeline_months: roadmap.totalTimeline,
          milestones: roadmap.milestones,
          downloadable_pdf: {
            available: true,
            endpoint: '/api/glix/roadmap-pdf',
            parameters: { resumeText, streamType, analysisId: Date.now() }
          }
        },
        
        // GlixAI Insights
        glixAI_insights: {
          automation_risk: {
            level: analysis.score > 80 ? 'Low' : analysis.score > 60 ? 'Medium' : 'High',
            percentage: Math.max(5, 100 - analysis.score),
            explanation: getAutomationRiskExplanation(analysis.score)
          },
          shadow_salary: {
            current: 60000 + analysis.score * 500,
            potential: 80000 + analysis.score * 800,
            currency: 'USD',
            growth_percentage: Math.round(((80000 + analysis.score * 800) - (60000 + analysis.score * 500)) / (60000 + analysis.score * 500) * 100)
          },
          future_proofing: {
            score: analysis.score,
            skills_needed: analysis.gaps.slice(0, 3),
            timeline_months: Math.max(3, Math.floor((100 - analysis.score) / 10)),
            market_demand: getMarketDemand(streamType),
            career_stability: getCareerStability(analysis.score)
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
