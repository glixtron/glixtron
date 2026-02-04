/**
 * Advanced AI Assessment Engine
 * Maximizes AI potential for comprehensive career assessment
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

interface AssessmentProfile {
  personalInfo: {
    fullName: string
    email: string
    age: number
    location: string
    education: string
  }
  skills: {
    technical: Array<{
      skill: string
      level: number
      experience: string
      certifications: string[]
    }>
    soft: Array<{
      skill: string
      level: number
      examples: string[]
    }>
  }
  experience: Array<{
    company: string
    position: string
    duration: string
    achievements: string[]
    technologies: string[]
  }>
  career: {
    goals: string[]
    interests: string[]
    workStyle: string
    salaryExpectation: string
    locationPreference: string
  }
  personality: {
    workStyle: string
    teamPreference: string
    learningStyle: string
    communicationStyle: string
    leadershipStyle: string
  }
}

interface AIAssessmentResult {
  careerPaths: Array<{
    title: string
    match: number
    confidence: number
    skills: string[]
    growthPotential: number
    marketDemand: number
    salaryRange: string
    timeline: string
    requiredSkills: string[]
    companies: string[]
    description: string
  }>
  skillsAnalysis: {
    technical: {
      total: number
      strengths: string[]
      improvements: string[]
      recommendations: string[]
    }
    soft: {
      total: number
      strengths: string[]
      improvements: string[]
      recommendations: string[]
    }
    overall: number
  }
  personalityInsights: {
    workStyle: string
    teamFit: string[]
    leadershipPotential: number
    communicationStyle: string
    stressHandling: string
    motivationType: string
  }
  marketAnalysis: {
    currentMarket: string
    growthAreas: string[]
    salaryInsights: string
    competition: string
    trends: string[]
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
    skills: string[]
    certifications: string[]
    networking: string[]
  }
  learningPath: Array<{
    phase: string
    duration: string
    skills: string[]
    resources: Array<{
      type: string
      title: string
      provider: string
      duration: string
      difficulty: string
      url?: string
      certification: boolean
    }>
    milestones: string[]
    projects: string[]
  }>
  successMetrics: {
    keyIndicators: string[]
    timeBoundGoals: string[]
    skillMilestones: string[]
    careerMilestones: string[]
  }
}

export class AIAssessmentEngine {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('AI Assessment Engine: No API key found, using mock data')
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    }
  }

  async generateComprehensiveAssessment(profile: AssessmentProfile): Promise<AIAssessmentResult> {
    try {
      if (!this.model) {
        return this.generateMockAssessment(profile)
      }

      const prompt = this.buildAdvancedAssessmentPrompt(profile)
      const result = await this.model.generateContent(prompt)
      const response = await result.response.text()
      
      // Parse AI response
      return this.parseAIResponse(response, profile)
    } catch (error) {
      console.error('AI Assessment Engine Error:', error)
      return this.generateMockAssessment(profile)
    }
  }

  private buildAdvancedAssessmentPrompt(profile: AssessmentProfile): string {
    return `
You are an advanced career assessment AI with deep expertise in talent analysis, market trends, and career development.

Analyze this comprehensive user profile and generate detailed career assessment:

USER PROFILE:
${JSON.stringify(profile, null, 2)}

Generate a comprehensive JSON response with the following structure:
{
  "careerPaths": [
    {
      "title": "Career Title",
      "match": 95,
      "confidence": 88,
      "skills": ["skill1", "skill2"],
      "growthPotential": 85,
      "marketDemand": 90,
      "salaryRange": "$80k-120k",
      "timeline": "2-3 years",
      "requiredSkills": ["skill1", "skill2"],
      "companies": ["Google", "Microsoft"],
      "description": "Detailed description"
    }
  ],
  "skillsAnalysis": {
    "technical": {
      "total": 85,
      "strengths": ["JavaScript"],
      "improvements": ["Python"],
      "recommendations": ["Learn advanced patterns"]
    },
    "soft": {
      "total": 78,
      "strengths": ["Communication"],
      "improvements": ["Leadership"],
      "recommendations": ["Take leadership course"]
    },
    "overall": 82
  },
  "personalityInsights": {
    "workStyle": "Collaborative",
    "teamFit": ["Agile", "Scrum"],
    "leadershipPotential": 75,
    "communicationStyle": "Direct",
    "stressHandling": "Resilient",
    "motivationType": "Achievement-oriented"
  },
  "marketAnalysis": {
    "currentMarket": "High demand for tech skills",
    "growthAreas": ["AI/ML", "Cloud"],
    "salaryInsights": "Above average",
    "competition": "Moderate",
    "trends": ["Remote work", "AI integration"]
  },
  "recommendations": {
    "immediate": ["Update portfolio"],
    "shortTerm": ["Learn cloud"],
    "longTerm": ["Leadership role"],
    "skills": ["TypeScript", "AWS"],
    "certifications": ["AWS Solutions Architect"],
    "networking": ["Tech meetups"]
  },
  "learningPath": [
    {
      "phase": "Foundation Building",
      "duration": "3 months",
      "skills": ["JavaScript", "React"],
      "resources": [
        {
          "type": "course",
          "title": "Advanced React",
          "provider": "Udemy",
          "duration": "20 hours",
          "difficulty": "Intermediate",
          "url": "https://udemy.com/react",
          "certification": true
        }
      ],
      "milestones": ["Complete course", "Build project"],
      "projects": ["E-commerce app"]
    }
  ],
  "successMetrics": {
    "keyIndicators": ["Skill mastery", "Project completion"],
    "timeBoundGoals": ["Certification in 6 months"],
    "skillMilestones": ["Advanced JavaScript"],
    "careerMilestones": ["Senior position"]
  }
}

Focus on:
1. Accurate skill assessment based on provided data
2. Realistic career path matching
3. Actionable recommendations
4. Market-relevant insights
5. Personalized learning paths
6. Measurable success metrics

Ensure all recommendations are practical and tailored to the user's profile.
`
  }

  private parseAIResponse(response: string, profile: AssessmentProfile): AIAssessmentResult {
    try {
      // Try to extract JSON from AI response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return this.validateAndEnhanceResult(parsed, profile)
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
    }
    
    return this.generateMockAssessment(profile)
  }

  private validateAndEnhanceResult(result: any, profile: AssessmentProfile): AIAssessmentResult {
    // Ensure all required fields exist and have valid data
    return {
      careerPaths: result.careerPaths || this.generateCareerPaths(profile),
      skillsAnalysis: result.skillsAnalysis || this.generateSkillsAnalysis(profile),
      personalityInsights: result.personalityInsights || this.generatePersonalityInsights(profile),
      marketAnalysis: result.marketAnalysis || this.generateMarketAnalysis(profile),
      recommendations: result.recommendations || this.generateRecommendations(profile),
      learningPath: result.learningPath || this.generateLearningPath(profile),
      successMetrics: result.successMetrics || this.generateSuccessMetrics(profile)
    }
  }

  private generateMockAssessment(profile: AssessmentProfile): AIAssessmentResult {
    return {
      careerPaths: this.generateCareerPaths(profile),
      skillsAnalysis: this.generateSkillsAnalysis(profile),
      personalityInsights: this.generatePersonalityInsights(profile),
      marketAnalysis: this.generateMarketAnalysis(profile),
      recommendations: this.generateRecommendations(profile),
      learningPath: this.generateLearningPath(profile),
      successMetrics: this.generateSuccessMetrics(profile)
    }
  }

  private generateCareerPaths(profile: AssessmentProfile): AIAssessmentResult['careerPaths'] {
    const paths = [
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
      },
      {
        title: 'Technical Lead',
        match: 75,
        confidence: 78,
        skills: ['Leadership', 'Architecture', 'Communication'],
        growthPotential: 90,
        marketDemand: 75,
        salaryRange: '$120k-180k',
        timeline: '3-4 years',
        requiredSkills: ['Team Leadership', 'System Architecture', 'Project Management'],
        companies: ['Enterprise Companies', 'Tech Giants'],
        description: 'Lead technical teams and make architectural decisions'
      }
    ]

    return paths.map(path => ({
      ...path,
      match: Math.min(95, path.match + Math.floor(Math.random() * 10)),
      confidence: Math.min(95, path.confidence + Math.floor(Math.random() * 10))
    }))
  }

  private generateSkillsAnalysis(profile: AssessmentProfile): AIAssessmentResult['skillsAnalysis'] {
    return {
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
    }
  }

  private generatePersonalityInsights(profile: AssessmentProfile): AIAssessmentResult['personalityInsights'] {
    return {
      workStyle: 'Collaborative and Detail-Oriented',
      teamFit: ['Agile Teams', 'Startup Environment', 'Innovation Labs'],
      leadershipPotential: 75,
      communicationStyle: 'Clear and Direct',
      stressHandling: 'Resilient under pressure',
      motivationType: 'Achievement-oriented and Growth-focused'
    }
  }

  private generateMarketAnalysis(profile: AssessmentProfile): AIAssessmentResult['marketAnalysis'] {
    return {
      currentMarket: 'High demand for skilled developers with modern tech stack',
      growthAreas: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'Data Science'],
      salaryInsights: 'Above average market rates with strong growth potential',
      competition: 'Moderate - specialized skills reduce competition',
      trends: ['Remote work', 'AI integration', 'Sustainable tech', 'Web3']
    }
  }

  private generateRecommendations(profile: AssessmentProfile): AIAssessmentResult['recommendations'] {
    return {
      immediate: [
        'Update portfolio with recent projects',
        'Get AWS certification',
        'Contribute to open source'
      ],
      shortTerm: [
        'Learn cloud architecture',
        'Master system design',
        'Build network in tech community'
      ],
      longTerm: [
        'Move to leadership role',
        'Specialize in emerging technologies',
        'Start technical blog or YouTube channel'
      ],
      skills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
      networking: ['Tech meetups', 'LinkedIn groups', 'Conferences']
    }
  }

  private generateLearningPath(profile: AssessmentProfile): AIAssessmentResult['learningPath'] {
    return [
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
          },
          {
            type: 'book',
            title: 'Clean Code',
            provider: 'O\'Reilly',
            duration: 'Self-paced',
            difficulty: 'Intermediate',
            certification: false
          }
        ],
        milestones: ['Master TypeScript', 'Build complex React app'],
        projects: ['E-commerce platform', 'Real-time chat app']
      },
      {
        phase: 'Cloud & DevOps',
        duration: '4 months',
        skills: ['AWS', 'Docker', 'CI/CD'],
        resources: [
          {
            type: 'certification',
            title: 'AWS Solutions Architect',
            provider: 'Amazon',
            duration: '3 months',
            difficulty: 'Advanced',
            url: 'https://aws.amazon.com/certification',
            certification: true
          }
        ],
        milestones: ['AWS certified', 'Deploy cloud application'],
        projects: ['Cloud-native application', 'DevOps pipeline']
      },
      {
        phase: 'Leadership & Architecture',
        duration: '6 months',
        skills: ['System Design', 'Team Leadership', 'Project Management'],
        resources: [
          {
            type: 'course',
            title: 'System Design Interview',
            provider: 'Educative',
            duration: '2 months',
            difficulty: 'Advanced',
            certification: false
          }
        ],
        milestones: ['Lead team project', 'Design scalable system'],
        projects: ['Microservices architecture', 'Team leadership project']
      }
    ]
  }

  private generateSuccessMetrics(profile: AssessmentProfile): AIAssessmentResult['successMetrics'] {
    return {
      keyIndicators: [
        'Technical skill mastery (85%+)',
        'Project completion rate',
        'Team collaboration score',
        'Innovation contributions'
      ],
      timeBoundGoals: [
        'Senior position within 2 years',
        'AWS certification in 6 months',
        'Lead team project in 12 months',
        'Salary increase of 30% in 18 months'
      ],
      skillMilestones: [
        'Master TypeScript and React',
        'Become AWS certified',
        'Lead technical design discussions',
        'Mentor junior developers'
      ],
      careerMilestones: [
        'Promotion to Senior Developer',
        'Technical Lead role',
        'Speaking at tech conference',
        'Open source contributor'
      ]
    }
  }

  async getSkillGapAnalysis(currentSkills: string[], targetRole: string): Promise<any> {
    try {
      if (!this.model) {
        return this.generateMockSkillGap(currentSkills, targetRole)
      }

      const prompt = `
Analyze skill gaps for transitioning to ${targetRole} role.

Current Skills: ${currentSkills.join(', ')}

Provide JSON response with:
{
  "missingSkills": ["skill1", "skill2"],
  "skillGapPercentage": 25,
  "prioritySkills": ["skill1", "skill2"],
  "learningResources": [
    {
      "skill": "skill1",
      "resources": [
        {
          "type": "course",
          "title": "Course Title",
          "provider": "Provider",
          "duration": "Duration",
          "difficulty": "Level",
          "url": "URL"
        }
      ]
    }
  ],
  "timeline": "3-6 months",
  "confidence": 85
}
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response.text()
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (error) {
        console.error('Failed to parse skill gap analysis:', error)
      }
      
      return this.generateMockSkillGap(currentSkills, targetRole)
    } catch (error) {
      console.error('Skill gap analysis error:', error)
      return this.generateMockSkillGap(currentSkills, targetRole)
    }
  }

  private generateMockSkillGap(currentSkills: string[], targetRole: string): any {
    return {
      missingSkills: ['Cloud Architecture', 'System Design', 'Team Leadership'],
      skillGapPercentage: 35,
      prioritySkills: ['AWS', 'Docker', 'Kubernetes'],
      learningResources: [
        {
          skill: 'AWS',
          resources: [
            {
              type: 'course',
              title: 'AWS Solutions Architect',
              provider: 'Amazon',
              duration: '3 months',
              difficulty: 'Advanced',
              url: 'https://aws.amazon.com/training'
            }
          ]
        }
      ],
      timeline: '4-6 months',
      confidence: 80
    }
  }
}

export const aiAssessmentEngine = new AIAssessmentEngine()
