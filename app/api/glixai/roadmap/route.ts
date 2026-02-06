import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-nextauth'

// GlixAI Roadmap Architect Integration
const GlixAIRoadmapArchitect = {
  async generateRoadmap(currentSkills: string[], targetRole: string, stream?: string) {
    // Integrate with our existing system and add GlixAI enhancements
    const roadmap = await this.createPersonalizedRoadmap(currentSkills, targetRole, stream)
    
    return {
      ...roadmap,
      glixAI_insights: {
        completion_time: this.calculateCompletionTime(roadmap),
        difficulty_level: this.calculateDifficultyLevel(roadmap),
        market_demand: this.calculateMarketDemand(targetRole, stream),
        success_probability: this.calculateSuccessProbability(currentSkills, roadmap)
      }
    }
  },
  
  async createPersonalizedRoadmap(currentSkills: string[], targetRole: string, stream?: string) {
    const skillGaps = this.identifySkillGaps(currentSkills, targetRole, stream)
    const phases = this.createLearningPhases(skillGaps, stream)
    
    return {
      target_role: targetRole,
      stream: stream || 'general',
      current_level: this.assessCurrentLevel(currentSkills),
      target_level: this.determineTargetLevel(targetRole),
      skill_gaps: skillGaps,
      phases: phases,
      milestones: this.createMilestones(phases),
      resources: this.getResources(phases),
      timeline: this.generateTimeline(phases)
    }
  },
  
  identifySkillGaps(currentSkills: string[], targetRole: string, stream?: string) {
    const roleRequirements = this.getRoleRequirements(targetRole, stream)
    
    return roleRequirements.filter(req => 
      !currentSkills.some(skill => 
        skill.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(skill.toLowerCase())
      )
    )
  },
  
  getRoleRequirements(targetRole: string, stream?: string) {
    const requirements = {
      'Data Scientist': ['Python', 'Machine Learning', 'Statistics', 'Data Visualization', 'SQL'],
      'Research Scientist': ['Research Methods', 'Data Analysis', 'Experimental Design', 'Technical Writing'],
      'Quantum Computing Engineer': ['Quantum Mechanics', 'Linear Algebra', 'Python', 'Quantum Algorithms'],
      'Biotech Researcher': ['Molecular Biology', 'CRISPR', 'Cell Culture', 'Data Analysis', 'Lab Techniques'],
      'Software Engineer': ['Programming', 'Data Structures', 'Algorithms', 'System Design', 'Testing']
    }
    
    return requirements[targetRole as keyof typeof requirements] || ['General Skills']
  },
  
  createLearningPhases(skillGaps: string[], stream?: string) {
    const phases = []
    
    // Phase 1: Foundation
    const foundationSkills = skillGaps.filter(skill => 
      ['Python', 'Statistics', 'Research Methods', 'Programming'].some(f => 
        skill.toLowerCase().includes(f.toLowerCase())
      )
    )
    
    if (foundationSkills.length > 0) {
      phases.push({
        phase: 1,
        title: 'Foundation Building',
        duration: '2-3 months',
        skills: foundationSkills,
        objectives: ['Build fundamental knowledge', 'Establish core competencies'],
        projects: this.getPhaseProjects(foundationSkills, 'foundation')
      })
    }
    
    // Phase 2: Advanced Skills
    const advancedSkills = skillGaps.filter(skill => 
      ['Machine Learning', 'Quantum', 'Molecular Biology', 'Data Structures'].some(a => 
        skill.toLowerCase().includes(a.toLowerCase())
      )
    )
    
    if (advancedSkills.length > 0) {
      phases.push({
        phase: 2,
        title: 'Advanced Specialization',
        duration: '3-4 months',
        skills: advancedSkills,
        objectives: ['Develop expertise', 'Apply advanced concepts'],
        projects: this.getPhaseProjects(advancedSkills, 'advanced')
      })
    }
    
    // Phase 3: Practical Application
    const practicalSkills = skillGaps.filter(skill => 
      ['Data Visualization', 'Experimental Design', 'System Design', 'Lab Techniques'].some(p => 
        skill.toLowerCase().includes(p.toLowerCase())
      )
    )
    
    if (practicalSkills.length > 0) {
      phases.push({
        phase: 3,
        title: 'Practical Application',
        duration: '2-3 months',
        skills: practicalSkills,
        objectives: ['Apply skills in real projects', 'Build portfolio'],
        projects: this.getPhaseProjects(practicalSkills, 'practical')
      })
    }
    
    return phases
  },
  
  getPhaseProjects(skills: string[], phaseType: string) {
    const projectTemplates = {
      foundation: [
        'Build a basic data analysis project',
        'Complete online courses and certifications',
        'Create a personal learning journal'
      ],
      advanced: [
        'Develop a machine learning model',
        'Conduct independent research',
        'Contribute to open source projects'
      ],
      practical: [
        'Complete a capstone project',
        'Internship or freelance work',
        'Industry case study analysis'
      ]
    }
    
    return projectTemplates[phaseType as keyof typeof projectTemplates] || []
  },
  
  assessCurrentLevel(currentSkills: string[]) {
    if (currentSkills.length < 3) return 'Beginner'
    if (currentSkills.length < 7) return 'Intermediate'
    return 'Advanced'
  },
  
  determineTargetLevel(targetRole: string) {
    const seniorRoles = ['Senior', 'Lead', 'Principal', 'Head']
    if (seniorRoles.some(senior => targetRole.includes(senior))) return 'Senior'
    if (targetRole.includes('Manager')) return 'Management'
    return 'Professional'
  },
  
  createMilestones(phases: any[]) {
    return phases.map((phase, index) => ({
      milestone: index + 1,
      title: `Complete ${phase.title}`,
      deadline: this.calculateMilestoneDeadline(phase, index),
      deliverables: phase.skills.map(skill => `${skill} certification`),
      success_criteria: [`Demonstrate proficiency in ${phase.skills.join(', ')}`]
    }))
  },
  
  calculateMilestoneDeadline(phase: any, index: number) {
    const months = parseInt(phase.duration.split('-')[1]) || 3
    const totalMonths = phases.slice(0, index + 1).reduce((sum, p) => {
      const pMonths = parseInt(p.duration.split('-')[1]) || 3
      return sum + pMonths
    }, 0)
    
    const date = new Date()
    date.setMonth(date.getMonth() + totalMonths)
    return date.toISOString().split('T')[0]
  },
  
  getResources(phases: any[]) {
    const resources = []
    
    phases.forEach(phase => {
      phase.skills.forEach(skill => {
        resources.push({
          skill: skill,
          resources: [
            {
              type: 'course',
              title: `${skill} Complete Course`,
              provider: 'Coursera',
              url: `https://coursera.org/search?query=${encodeURIComponent(skill)}`,
              duration: '4-6 weeks',
              difficulty: phase.phase === 1 ? 'Beginner' : phase.phase === 2 ? 'Intermediate' : 'Advanced'
            },
            {
              type: 'book',
              title: `${skill} - The Complete Guide`,
              provider: 'O\'Reilly',
              url: `https://oreilly.com/search?q=${encodeURIComponent(skill)}`,
              duration: 'Self-paced',
              difficulty: 'Intermediate'
            },
            {
              type: 'project',
              title: `${skill} Portfolio Project`,
              provider: 'GitHub',
              url: 'https://github.com',
              duration: '2-4 weeks',
              difficulty: 'Practical'
            }
          ]
        })
      })
    })
    
    return resources
  },
  
  generateTimeline(phases: any[]) {
    const timeline = []
    let currentDate = new Date()
    
    phases.forEach(phase => {
      const months = parseInt(phase.duration.split('-')[1]) || 3
      
      timeline.push({
        phase: phase.phase,
        title: phase.title,
        start_date: currentDate.toISOString().split('T')[0],
        end_date: new Date(currentDate.setMonth(currentDate.getMonth() + months)).toISOString().split('T')[0],
        key_activities: phase.skills.map(skill => `Master ${skill}`)
      })
    })
    
    return timeline
  },
  
  calculateCompletionTime(roadmap: any) {
    const totalMonths = roadmap.phases.reduce((sum: number, phase: any) => {
      const months = parseInt(phase.duration.split('-')[1]) || 3
      return sum + months
    }, 0)
    
    return {
      total_months: totalMonths,
      estimated_completion: new Date(Date.now() + totalMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      intensity: totalMonths < 6 ? 'Intensive' : totalMonths < 12 ? 'Moderate' : 'Extended'
    }
  },
  
  calculateDifficultyLevel(roadmap: any) {
    const totalSkills = roadmap.phases.reduce((sum: number, phase: any) => sum + phase.skills.length, 0)
    const advancedPhases = roadmap.phases.filter((phase: any) => phase.phase >= 2).length
    
    if (totalSkills > 10 && advancedPhases >= 2) return 'High'
    if (totalSkills > 5 || advancedPhases >= 1) return 'Medium'
    return 'Low'
  },
  
  calculateMarketDemand(targetRole: string, stream?: string) {
    const demandLevels = {
      'Data Scientist': 'Very High',
      'Research Scientist': 'High',
      'Quantum Computing Engineer': 'Very High',
      'Biotech Researcher': 'High',
      'Software Engineer': 'Very High'
    }
    
    return {
      level: demandLevels[targetRole as keyof typeof demandLevels] || 'Medium',
      growth_rate: this.getGrowthRate(targetRole),
      top_companies: this.getTopCompanies(targetRole, stream)
    }
  },
  
  getGrowthRate(targetRole: string) {
    const growthRates = {
      'Data Scientist': '35%',
      'Research Scientist': '25%',
      'Quantum Computing Engineer': '40%',
      'Biotech Researcher': '28%',
      'Software Engineer': '22%'
    }
    
    return growthRates[targetRole as keyof typeof growthRates] || '20%'
  },
  
  getTopCompanies(targetRole: string, stream?: string) {
    const companies = {
      'Data Scientist': ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
      'Research Scientist': ['MIT', 'Stanford', 'Harvard', 'NASA', 'IBM Research'],
      'Quantum Computing Engineer': ['IBM', 'Google', 'Microsoft', 'Intel', 'Rigetti'],
      'Biotech Researcher': ['Genentech', 'Moderna', 'Pfizer', 'Johnson & Johnson', 'Amgen'],
      'Software Engineer': ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple']
    }
    
    return companies[targetRole as keyof typeof companies] || ['Tech Companies']
  },
  
  calculateSuccessProbability(currentSkills: string[], roadmap: any) {
    const totalRequiredSkills = roadmap.phases.reduce((sum: number, phase: any) => sum + phase.skills.length, 0)
    const currentRelevantSkills = currentSkills.filter(skill => 
      roadmap.skill_gaps.some(gap => 
        skill.toLowerCase().includes(gap.toLowerCase()) || 
        gap.toLowerCase().includes(skill.toLowerCase())
      )
    ).length
    
    const baseProbability = (currentRelevantSkills / (totalRequiredSkills + currentRelevantSkills)) * 100
    const difficultyAdjustment = roadmap.difficulty_level === 'High' ? -10 : roadmap.difficulty_level === 'Low' ? 10 : 0
    
    return Math.max(20, Math.min(95, baseProbability + difficultyAdjustment))
  }
}

export async function POST(request: NextRequest) {
  try {
    // For testing, we'll allow requests without authentication
    // In production, uncomment the following lines:
    // const session = await auth()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Authentication required' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()
    const { currentSkills, targetRole, stream } = body

    if (!currentSkills || !targetRole) {
      return NextResponse.json(
        { success: false, error: 'Current skills and target role are required' },
        { status: 400 }
      )
    }

    // Generate roadmap with GlixAI engine
    const roadmap = await GlixAIRoadmapArchitect.generateRoadmap(currentSkills, targetRole, stream)

    return NextResponse.json({
      success: true,
      data: roadmap,
      message: 'Career roadmap generated successfully'
    })

  } catch (error) {
    console.error('GlixAI Roadmap Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // For testing, we'll allow requests without authentication
    // In production, uncomment the following lines:
    // const session = await auth()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Authentication required' },
    //     { status: 401 }
    //   )
    // }

    return NextResponse.json({
      success: true,
      data: {
        features: ['personalized_roadmap', 'skill_gap_analysis', 'timeline_generation', 'success_probability'],
        provider: 'GlixAI',
        engine: 'Autonomous Roadmap Architect'
      },
      message: 'GlixAI Roadmap Architect service is operational'
    })

  } catch (error) {
    console.error('GlixAI Roadmap Status Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
