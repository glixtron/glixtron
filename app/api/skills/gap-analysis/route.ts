import { NextRequest, NextResponse } from 'next/server'

interface SkillGapRequest {
  currentSkills: Array<{
    skill: string
    level: number
    category: 'technical' | 'soft' | 'tool'
    experience?: string
  }>
  targetSkills: Array<{
    skill: string
    level: number
    category: 'technical' | 'soft' | 'tool'
    priority: 'high' | 'medium' | 'low'
  }>
  targetRole?: string
  careerGoals?: string
  timeline?: string
  learningPreference?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  timeCommitment?: '1-2 hours/week' | '3-5 hours/week' | '6-10 hours/week' | '10+ hours/week'
  budget?: 'free' | 'low' | 'medium' | 'high'
}

interface DetailedSkillGap {
  skill: string
  category: 'technical' | 'soft' | 'tool'
  currentLevel: number
  targetLevel: number
  gap: number
  priority: 'high' | 'medium' | 'low'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  cost: string
  learningPath: LearningStep[]
  resources: Resource[]
  milestones: string[]
  prerequisites: string[]
  nextSteps: string[]
  careerImpact: string
  marketDemand: 'high' | 'medium' | 'low'
  salaryImpact: string
}

interface LearningStep {
  step: number
  title: string
  description: string
  objectives: string[]
  activities: string[]
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: Resource[]
  assessments: Assessment[]
  deliverables: string[]
  tips: string[]
}

interface Resource {
  id: string
  type: 'course' | 'book' | 'tutorial' | 'video' | 'article' | 'project' | 'certification' | 'tool' | 'practice'
  title: string
  provider: string
  description: string
  url: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cost: string
  rating: number
  reviews: number
  prerequisites: string[]
  topics: string[]
  format: 'online' | 'offline' | 'hybrid'
  language: string
  certification: boolean
  updatedDate: string
  tags: string[]
}

interface Assessment {
  type: 'quiz' | 'project' | 'code-review' | 'interview' | 'practical' | 'peer-review'
  title: string
  description: string
  duration: string
  passingScore: number
  questions?: number
  format: string
  tools: string[]
}

interface SkillGapAnalysis {
  summary: {
    totalGaps: number
    criticalGaps: number
    overallReadiness: number
    estimatedTimeToReadiness: string
    totalCost: string
    recommendedFocus: string[]
  }
  gaps: DetailedSkillGap[]
  learningPlan: {
    phases: Array<{
      phase: string
      duration: string
      skills: string[]
      objectives: string[]
      milestones: string[]
      resources: Resource[]
      assessments: Assessment[]
    }>
    schedule: Array<{
      week: number
      activities: string[]
      goals: string[]
      timeCommitment: string
    }>
  }
  careerInsights: {
    marketDemand: string
    salaryRange: string
    growthPotential: string
    competition: string
    topCompanies: string[]
    trendingSkills: string[]
  }
  recommendations: {
    immediate: Array<{
      action: string
      priority: 'high' | 'medium' | 'low'
      timeline: string
      impact: string
    }>
    shortTerm: Array<{
      action: string
      priority: 'high' | 'medium' | 'low'
      timeline: string
      impact: string
    }>
    longTerm: Array<{
      action: string
      priority: 'high' | 'medium' | 'low'
      timeline: string
      impact: string
    }>
  }
  tracking: {
    metrics: Array<{
      metric: string
      target: string
      measurement: string
      frequency: string
    }>
    checkpoints: Array<{
      timeline: string
      objectives: string[]
      assessments: string[]
      adjustments: string[]
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SkillGapRequest = await request.json()
    const { 
      currentSkills, 
      targetSkills, 
      targetRole, 
      careerGoals, 
      timeline,
      learningPreference,
      timeCommitment,
      budget
    } = body

    if (!currentSkills || !targetSkills) {
      return NextResponse.json(
        { success: false, error: 'Current skills and target skills are required' },
        { status: 400 }
      )
    }

    // Generate comprehensive skill gap analysis
    const analysis = await generateDetailedSkillGapAnalysis(body)

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Detailed skill gap analysis generated successfully'
    })
  } catch (error) {
    console.error('Skill gap analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze skill gaps' },
      { status: 500 }
    )
  }
}

async function generateDetailedSkillGapAnalysis(request: SkillGapRequest): Promise<SkillGapAnalysis> {
  const { currentSkills, targetSkills, targetRole, learningPreference, timeCommitment, budget } = request

  // Calculate skill gaps
  const gaps = calculateSkillGaps(currentSkills, targetSkills)
  
  // Generate detailed learning paths for each gap
  const detailedGaps = await Promise.all(
    gaps.map(gap => generateDetailedSkillGap(gap, learningPreference, timeCommitment, budget))
  )

  // Generate summary
  const summary = generateSummary(detailedGaps)

  // Generate learning plan
  const learningPlan = generateLearningPlan(detailedGaps, timeCommitment)

  // Generate career insights
  const careerInsights = await generateCareerInsights(targetRole, detailedGaps)

  // Generate recommendations
  const recommendations = generateRecommendations(detailedGaps, summary)

  // Generate tracking metrics
  const tracking = generateTracking(detailedGaps)

  return {
    summary,
    gaps: detailedGaps,
    learningPlan,
    careerInsights,
    recommendations,
    tracking
  }
}

function calculateSkillGaps(currentSkills: SkillGapRequest['currentSkills'], targetSkills: SkillGapRequest['targetSkills']) {
  const gaps = targetSkills.map(target => {
    const current = currentSkills.find(s => s.skill.toLowerCase() === target.skill.toLowerCase())
    const currentLevel = current?.level || 0
    const gap = target.level - currentLevel

    return {
      skill: target.skill,
      category: target.category,
      currentLevel,
      targetLevel: target.level,
      gap: Math.max(0, gap),
      priority: target.priority
    }
  }).filter(gap => gap.gap > 0)

  return gaps.sort((a, b) => {
    // Sort by priority first, then by gap size
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.gap - a.gap
  })
}

async function generateDetailedSkillGap(
  gap: any,
  learningPreference?: string,
  timeCommitment?: string,
  budget?: string
): Promise<DetailedSkillGap> {
  const learningPath = await generateLearningPath(gap, learningPreference, timeCommitment)
  const resources = await generateResources(gap, learningPreference, budget)
  const milestones = generateMilestones(gap)
  const prerequisites = generatePrerequisites(gap)
  const nextSteps = generateNextSteps(gap)

  return {
    ...gap,
    difficulty: determineDifficulty(gap),
    estimatedTime: estimateTime(gap, timeCommitment),
    cost: estimateCost(gap, budget),
    learningPath,
    resources,
    milestones,
    prerequisites,
    nextSteps,
    careerImpact: generateCareerImpact(gap),
    marketDemand: getMarketDemand(gap.skill),
    salaryImpact: generateSalaryImpact(gap)
  }
}

async function generateLearningPath(
  gap: any,
  learningPreference?: string,
  timeCommitment?: string
): Promise<LearningStep[]> {
  const steps: LearningStep[] = []
  const gapSize = gap.gap

  // Foundation step
  steps.push({
    step: 1,
    title: `Build ${gap.skill} Foundation`,
    description: `Learn the fundamental concepts of ${gap.skill}`,
    objectives: [
      `Understand ${gap.skill} basics`,
      `Learn core terminology`,
      `Set up development environment`
    ],
    activities: getActivitiesForStep(1, gap, learningPreference),
    duration: '2-3 weeks',
    difficulty: 'beginner',
    resources: await getResourcesForStep(1, gap, learningPreference, 'free'),
    assessments: [
      {
        type: 'quiz',
        title: `${gap.skill} Fundamentals Quiz`,
        description: 'Test your understanding of basic concepts',
        duration: '30 minutes',
        passingScore: 80,
        format: 'Multiple choice',
        tools: []
      }
    ],
    deliverables: [
      'Complete foundation course',
      'Set up development environment',
      'Pass fundamentals quiz'
    ],
    tips: getTipsForStep(1, gap)
  })

  // Intermediate step (if gap is significant)
  if (gapSize > 30) {
    steps.push({
      step: 2,
      title: `Develop ${gap.skill} Proficiency`,
      description: `Build practical skills and intermediate knowledge`,
      objectives: [
        `Apply ${gap.skill} concepts`,
        `Build practical projects`,
        `Learn best practices`
      ],
      activities: getActivitiesForStep(2, gap, learningPreference),
      duration: '4-6 weeks',
      difficulty: 'intermediate',
      resources: await getResourcesForStep(2, gap, learningPreference, 'low'),
      assessments: [
        {
          type: 'project',
          title: `${gap.skill} Project`,
          description: 'Build a practical application',
          duration: '2 weeks',
          passingScore: 85,
          format: 'Project submission',
          tools: getToolsForSkill(gap.skill)
        }
      ],
      deliverables: [
        'Complete intermediate course',
        'Build portfolio project',
        'Pass project assessment'
      ],
      tips: getTipsForStep(2, gap)
    })
  }

  // Advanced step (if target level is high)
  if (gap.targetLevel > 70) {
    steps.push({
      step: 3,
      title: `Master ${gap.skill} Advanced Concepts`,
      description: `Learn advanced techniques and professional practices`,
      objectives: [
        `Master advanced ${gap.skill} concepts`,
        `Learn industry best practices`,
        `Build complex applications`
      ],
      activities: getActivitiesForStep(3, gap, learningPreference),
      duration: '6-8 weeks',
      difficulty: 'advanced',
      resources: await getResourcesForStep(3, gap, learningPreference, 'medium'),
      assessments: [
        {
          type: 'code-review',
          title: `${gap.skill} Code Review`,
          description: 'Review and improve code quality',
          duration: '1 week',
          passingScore: 90,
          format: 'Peer review',
          tools: getToolsForSkill(gap.skill)
        }
      ],
      deliverables: [
        'Complete advanced course',
        'Build complex project',
        'Pass code review assessment'
      ],
      tips: getTipsForStep(3, gap)
    })
  }

  return steps
}

async function generateResources(
  gap: any,
  learningPreference?: string,
  budget?: string
): Promise<Resource[]> {
  const resources: Resource[] = []
  
  // Free resources
  resources.push(
    {
      id: `${gap.skill}-docs`,
      type: 'tutorial',
      title: `${gap.skill} Official Documentation`,
      provider: 'Official',
      description: `Comprehensive official documentation for ${gap.skill}`,
      url: `https://docs.${gap.skill.toLowerCase()}.com`,
      duration: 'Self-paced',
      difficulty: 'beginner',
      cost: 'Free',
      rating: 4.5,
      reviews: 1000,
      prerequisites: [],
      topics: ['basics', 'setup', 'configuration'],
      format: 'online',
      language: 'English',
      certification: false,
      updatedDate: new Date().toISOString(),
      tags: [gap.skill, 'documentation', 'free']
    },
    {
      id: `${gap.skill}-youtube`,
      type: 'video',
      title: `${gap.skill} Tutorial Series`,
      provider: 'YouTube',
      description: `Free video tutorials covering ${gap.skill} fundamentals`,
      url: `https://youtube.com/results?search_query=${gap.skill}+tutorial`,
      duration: '10+ hours',
      difficulty: 'beginner',
      cost: 'Free',
      rating: 4.2,
      reviews: 500,
      prerequisites: [],
      topics: ['tutorial', 'basics', 'examples'],
      format: 'online',
      language: 'English',
      certification: false,
      updatedDate: new Date().toISOString(),
      tags: [gap.skill, 'tutorial', 'video', 'free']
    }
  )

  // Paid resources (based on budget)
  if (budget !== 'free') {
    resources.push(
      {
        id: `${gap.skill}-udemy`,
        type: 'course',
        title: `Complete ${gap.skill} Course`,
        provider: 'Udemy',
        description: `Comprehensive course covering ${gap.skill} from basics to advanced`,
        url: `https://udemy.com/course/${gap.skill.toLowerCase()}`,
        duration: '20-40 hours',
        difficulty: 'intermediate',
        cost: budget === 'low' ? '$19.99' : budget === 'medium' ? '$49.99' : '$89.99',
        rating: 4.5,
        reviews: 2000,
        prerequisites: [],
        topics: ['complete', 'comprehensive', 'projects'],
        format: 'online',
        language: 'English',
        certification: true,
        updatedDate: new Date().toISOString(),
        tags: [gap.skill, 'course', 'comprehensive']
      }
    )
  }

  return resources
}

function generateMilestones(gap: any): string[] {
  const milestones = [
    `Complete ${gap.skill} foundation course`,
    `Build first ${gap.skill} project`,
    `Achieve ${gap.targetLevel}% proficiency`
  ]

  if (gap.gap > 30) {
    milestones.push(`Complete intermediate ${gap.skill} course`)
  }

  if (gap.targetLevel > 70) {
    milestones.push(`Master advanced ${gap.skill} concepts`)
  }

  return milestones
}

function generatePrerequisites(gap: any): string[] {
  const prerequisites: string[] = []

  if (gap.category === 'technical') {
    prerequisites.push('Basic computer literacy')
    if (gap.skill.includes('JavaScript') || gap.skill.includes('React')) {
      prerequisites.push('HTML/CSS knowledge')
    }
    if (gap.skill.includes('Python') || gap.skill.includes('Java')) {
      prerequisites.push('Programming fundamentals')
    }
  }

  return prerequisites
}

function generateNextSteps(gap: any): string[] {
  return [
    `Start with ${gap.skill} fundamentals`,
    `Practice with small projects`,
    `Join ${gap.skill} community`,
    `Build portfolio projects`,
    `Seek mentorship opportunities`
  ]
}

function determineDifficulty(gap: any): 'beginner' | 'intermediate' | 'advanced' {
  if (gap.currentLevel < 30) return 'beginner'
  if (gap.currentLevel < 60) return 'intermediate'
  return 'advanced'
}

function estimateTime(gap: any, timeCommitment?: string): string {
  const baseWeeks = Math.ceil(gap.gap / 10) * 2 // Base estimation
  
  const multiplier = getTimeMultiplier(timeCommitment)
  const adjustedWeeks = Math.ceil(baseWeeks * multiplier)
  
  if (adjustedWeeks < 4) return '1-3 weeks'
  if (adjustedWeeks < 12) return `${adjustedWeeks} weeks`
  return `${Math.ceil(adjustedWeeks / 4)} months`
}

function estimateCost(gap: any, budget?: string): string {
  if (budget === 'free') return 'Free'
  if (budget === 'low') return '$50-100'
  if (budget === 'medium') return '$200-500'
  return '$500-1000+'
}

function getTimeMultiplier(timeCommitment?: string): number {
  const multipliers: Record<string, number> = {
    '1-2 hours/week': 2.0,
    '3-5 hours/week': 1.5,
    '6-10 hours/week': 1.0,
    '10+ hours/week': 0.7
  }
  return multipliers[timeCommitment || '3-5 hours/week'] || 1.0
}

function getActivitiesForStep(step: number, gap: any, learningPreference?: string): string[] {
  const baseActivities = {
    1: ['Reading documentation', 'Watching tutorials', 'Basic exercises'],
    2: ['Building projects', 'Code practice', 'Problem solving'],
    3: ['Advanced projects', 'Code reviews', 'Best practices']
  }

  const preferenceActivities = {
    visual: ['Video tutorials', 'Diagrams', 'Visual demonstrations'],
    auditory: ['Podcasts', 'Audio tutorials', 'Discussions'],
    kinesthetic: ['Hands-on projects', 'Coding exercises', 'Interactive labs'],
    reading: ['Documentation', 'Books', 'Articles']
  }

  const activities = baseActivities[step as keyof typeof baseActivities] || []
  if (learningPreference && preferenceActivities[learningPreference as keyof typeof preferenceActivities]) {
    activities.push(...preferenceActivities[learningPreference as keyof typeof preferenceActivities])
  }

  return activities
}

async function getResourcesForStep(
  step: number,
  gap: any,
  learningPreference?: string,
  budget?: string
): Promise<Resource[]> {
  // This would integrate with real APIs in production
  return [
    {
      id: `${gap.skill}-step-${step}`,
      type: 'course',
      title: `${gap.skill} - Step ${step}`,
      provider: 'Learning Platform',
      description: `Resource for step ${step} of ${gap.skill} learning`,
      url: 'https://example.com',
      duration: '10 hours',
      difficulty: step === 1 ? 'beginner' : step === 2 ? 'intermediate' : 'advanced',
      cost: budget === 'free' ? 'Free' : '$29.99',
      rating: 4.0,
      reviews: 100,
      prerequisites: [],
      topics: [gap.skill],
      format: 'online',
      language: 'English',
      certification: false,
      updatedDate: new Date().toISOString(),
      tags: [gap.skill, `step-${step}`]
    }
  ]
}

function getTipsForStep(step: number, gap: any): string[] {
  const tips = {
    1: [
      'Focus on understanding concepts before memorizing',
      'Practice regularly with small exercises',
      'Join online communities for support'
    ],
    2: [
      'Build real projects to apply knowledge',
      'Read code from experienced developers',
      'Participate in code reviews'
    ],
    3: [
      'Study industry best practices',
      'Contribute to open source projects',
      'Mentor others to solidify knowledge'
    ]
  }

  return tips[step as keyof typeof tips] || []
}

function getToolsForSkill(skill: string): string[] {
  const toolMap: Record<string, string[]> = {
    'JavaScript': ['VS Code', 'Chrome DevTools', 'Node.js'],
    'Python': ['PyCharm', 'Jupyter Notebook', 'Pip'],
    'React': ['Create React App', 'React DevTools', 'Webpack'],
    'Node.js': ['VS Code', 'Postman', 'MongoDB Compass']
  }

  return toolMap[skill] || ['VS Code', 'Git']
}

function generateCareerImpact(gap: any): string {
  const impacts = {
    high: 'Critical for career advancement and salary growth',
    medium: 'Important for professional development',
    low: 'Nice to have for specialization'
  }

  return impacts[gap.priority] || impacts.medium
}

function getMarketDemand(skill: string): 'high' | 'medium' | 'low' {
  const highDemandSkills = ['JavaScript', 'Python', 'React', 'AWS', 'Docker', 'Machine Learning']
  const mediumDemandSkills = ['Java', 'C#', 'PHP', 'Ruby', 'Angular']

  if (highDemandSkills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
    return 'high'
  }
  if (mediumDemandSkills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
    return 'medium'
  }
  return 'low'
}

function generateSalaryImpact(gap: any): string {
  const impacts = {
    high: '$10,000-20,000 increase',
    medium: '$5,000-10,000 increase',
    low: '$2,000-5,000 increase'
  }

  return impacts[gap.priority] || impacts.medium
}

function generateSummary(gaps: DetailedSkillGap[]) {
  const totalGaps = gaps.length
  const criticalGaps = gaps.filter(g => g.priority === 'high').length
  const overallReadiness = Math.round(100 - (gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length))
  const estimatedTimeToReadiness = `${Math.ceil(gaps.reduce((sum, g) => {
    const weeks = parseInt(g.estimatedTime) || 4
    return sum + weeks
  }, 0) / 4)} months`
  const totalCost = '$500-2000'
  const recommendedFocus = gaps.filter(g => g.priority === 'high').map(g => g.skill)

  return {
    totalGaps,
    criticalGaps,
    overallReadiness,
    estimatedTimeToReadiness,
    totalCost,
    recommendedFocus
  }
}

function generateLearningPlan(gaps: DetailedSkillGap[], timeCommitment?: string) {
  const phases = [
    {
      phase: 'Foundation Building',
      duration: '1-2 months',
      skills: gaps.filter(g => g.difficulty === 'beginner').map(g => g.skill),
      objectives: ['Build fundamental knowledge', 'Complete basic courses'],
      milestones: ['Complete foundation courses', 'Build basic projects'],
      resources: gaps.flatMap(g => g.resources.slice(0, 2)),
      assessments: gaps.flatMap(g => g.learningPath[0]?.assessments || [])
    }
  ]

  const schedule = Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    activities: ['Study theory', 'Practice coding', 'Build projects'],
    goals: ['Complete weekly modules', 'Submit assignments'],
    timeCommitment: timeCommitment || '3-5 hours/week'
  }))

  return { phases, schedule }
}

async function generateCareerInsights(targetRole?: string, gaps?: DetailedSkillGap[]) {
  return {
    marketDemand: 'High demand for skilled professionals',
    salaryRange: '$80,000-150,000',
    growthPotential: '15-20% annually',
    competition: 'Moderate',
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
    trendingSkills: gaps?.map(g => g.skill) || []
  }
}

function generateRecommendations(gaps: DetailedSkillGap[], summary: any) {
  return {
    immediate: [
      {
        action: `Focus on critical skills: ${summary.recommendedFocus.slice(0, 2).join(', ')}`,
        priority: 'high' as const,
        timeline: '1-2 months',
        impact: 'High - Addresses major skill gaps'
      }
    ],
    shortTerm: [
      {
        action: 'Complete foundation courses',
        priority: 'high' as const,
        timeline: '2-3 months',
        impact: 'Medium - Builds core competencies'
      }
    ],
    longTerm: [
      {
        action: 'Pursue advanced certifications',
        priority: 'medium' as const,
        timeline: '6-12 months',
        impact: 'High - Increases earning potential'
      }
    ]
  }
}

function generateTracking(gaps: DetailedSkillGap[]) {
  return {
    metrics: [
      {
        metric: 'Skill proficiency',
        target: '85% average',
        measurement: 'Weekly assessments',
        frequency: 'Weekly'
      },
      {
        metric: 'Project completion',
        target: '3 portfolio projects',
        measurement: 'Project reviews',
        frequency: 'Monthly'
      }
    ],
    checkpoints: [
      {
        timeline: 'Month 1',
        objectives: ['Complete foundation skills'],
        assessments: ['Technical evaluation'],
        adjustments: ['Update learning pace']
      }
    ]
  }
}
