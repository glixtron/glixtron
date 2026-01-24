export interface UserInputs {
  coreSkills: string[]
  softSkills: string[]
  remotePreference: number // 0-100
  startupPreference: number // 0-100
}

export interface CareerDNA {
  tags: string[]
  description: string
}

export interface SkillRadar {
  technical: number
  creative: number
  analytical: number
  leadership: number
  communication: number
  strategic: number
}

export interface JobMatch {
  title: string
  company: string
  matchScore: number
  missingSkills: string[]
}

export interface LearningPath {
  title: string
  provider: string
  duration: string
  skills: string[]
}

export interface AIAnalysis {
  careerDNA: CareerDNA
  skillRadar: SkillRadar
  jobMatches: JobMatch[]
  learningPaths: LearningPath[]
  genomeDimensions: number
}

export function getAiAnalysis(userInputs: UserInputs): AIAnalysis {
  // Generate career DNA tags based on inputs
  const tags: string[] = []
  if (userInputs.coreSkills.some(s => s.toLowerCase().includes('python') || s.toLowerCase().includes('javascript'))) {
    tags.push('Tech Innovator')
  }
  if (userInputs.coreSkills.some(s => s.toLowerCase().includes('design'))) {
    tags.push('Creative Strategist')
  }
  if (userInputs.coreSkills.some(s => s.toLowerCase().includes('sales'))) {
    tags.push('Growth Catalyst')
  }
  if (userInputs.softSkills.includes('Leadership')) {
    tags.push('Visionary Leader')
  }
  if (userInputs.softSkills.includes('Analytics')) {
    tags.push('Data Storyteller')
  }
  if (tags.length === 0) {
    tags.push('Rising Professional', 'Adaptive Learner')
  }

  // Calculate skill radar based on inputs
  const skillRadar: SkillRadar = {
    technical: userInputs.coreSkills.length > 0 ? Math.min(90, 60 + userInputs.coreSkills.length * 10) : 50,
    creative: userInputs.coreSkills.some(s => s.toLowerCase().includes('design')) ? 85 : 60,
    analytical: userInputs.softSkills.includes('Analytics') ? 90 : 65,
    leadership: userInputs.softSkills.includes('Leadership') ? 88 : 55,
    communication: userInputs.softSkills.includes('Empathy') ? 82 : 70,
    strategic: userInputs.softSkills.includes('Analytics') && userInputs.softSkills.includes('Leadership') ? 87 : 65,
  }

  // Generate job matches
  const jobMatches: JobMatch[] = []
  
  if (userInputs.coreSkills.some(s => s.toLowerCase().includes('python'))) {
    jobMatches.push({
      title: 'Senior Python Developer',
      company: 'TechCorp AI',
      matchScore: 94,
      missingSkills: ['SQL', 'Docker']
    })
  }
  
  if (userInputs.coreSkills.some(s => s.toLowerCase().includes('design'))) {
    jobMatches.push({
      title: 'Product Designer',
      company: 'DesignStudio',
      matchScore: 91,
      missingSkills: ['Figma Advanced', 'User Research']
    })
  }
  
  if (userInputs.coreSkills.some(s => s.toLowerCase().includes('sales'))) {
    jobMatches.push({
      title: 'Sales Engineering Lead',
      company: 'GrowthLabs',
      matchScore: 89,
      missingSkills: ['CRM Systems', 'Technical Writing']
    })
  }

  // Default matches if none generated
  if (jobMatches.length === 0) {
    jobMatches.push(
      {
        title: 'Full Stack Developer',
        company: 'InnovateTech',
        matchScore: 87,
        missingSkills: ['React', 'Node.js']
      },
      {
        title: 'Product Manager',
        company: 'StartupHub',
        matchScore: 83,
        missingSkills: ['Agile Methodology', 'Stakeholder Management']
      },
      {
        title: 'Data Analyst',
        company: 'DataCorp',
        matchScore: 81,
        missingSkills: ['SQL', 'Tableau']
      }
    )
  }

  // Generate learning paths
  const learningPaths: LearningPath[] = []
  
  if (jobMatches[0]?.missingSkills.includes('SQL')) {
    learningPaths.push({
      title: 'SQL for Data Analysis',
      provider: 'DataCamp',
      duration: '4 weeks',
      skills: ['SQL', 'Database Design', 'Query Optimization']
    })
  }
  
  if (jobMatches[0]?.missingSkills.some(s => s.toLowerCase().includes('react'))) {
    learningPaths.push({
      title: 'React Mastery Course',
      provider: 'Frontend Masters',
      duration: '6 weeks',
      skills: ['React', 'Hooks', 'State Management']
    })
  }

  // Default learning paths
  if (learningPaths.length === 0) {
    learningPaths.push(
      {
        title: 'Advanced JavaScript',
        provider: 'Pluralsight',
        duration: '5 weeks',
        skills: ['ES6+', 'Async Programming', 'Design Patterns']
      },
      {
        title: 'Product Management Fundamentals',
        provider: 'Coursera',
        duration: '8 weeks',
        skills: ['Agile', 'User Stories', 'Roadmapping']
      }
    )
  }

  return {
    careerDNA: {
      tags,
      description: `Your career genome reveals a ${tags[0]?.toLowerCase() || 'dynamic professional'} with strong potential across ${skillRadar.technical > 70 ? 'technical' : 'creative'} domains. Your unique combination of skills positions you for roles that require both analytical thinking and creative problem-solving.`
    },
    skillRadar,
    jobMatches: jobMatches.slice(0, 3),
    learningPaths: learningPaths.slice(0, 2),
    genomeDimensions: 127
  }
}
