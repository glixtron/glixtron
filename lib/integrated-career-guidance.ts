/**
 * Integrated Career Guidance System - Science Optimized
 * Combines science-specific ATS, NLP, and AI for comprehensive career planning
 */

import { ScienceATSParser, ScienceResumeParse } from './science-ats-parser'
import { ScienceNLPProcessor, ScienceNLPAnalysis } from './science-nlp-processor'
import { ScienceStream, detectScienceStream } from './science-streams-config'
import { DetectedStream } from './science-stream-detector'
import { ScienceGapAnalyzer, UserProfile, GapAnalysis } from './science-gap-analyzer'

interface CareerGuidanceProfile {
  resume: any
  assessment: any
  careerGoals: string
  targetRoles: string[]
  skillGapAnalysis: SkillGapAnalysis
  personalizedRoadmap: PersonalizedRoadmap
  marketInsights: MarketInsights
  recommendations: CareerRecommendations
}

interface SkillGapAnalysis {
  currentSkills: Array<{
    skill: string
    level: number
    category: 'technical' | 'soft' | 'tool'
  }>
  requiredSkills: Array<{
    skill: string
    level: number
    category: 'technical' | 'soft' | 'tool'
    priority: 'high' | 'medium' | 'low'
  }>
  gaps: Array<{
    skill: string
    currentLevel: number
    targetLevel: number
    gap: number
    category: 'technical' | 'soft' | 'tool'
    priority: 'high' | 'medium' | 'low'
    learningPath: LearningStep[]
  }>
  overallReadiness: number
  timeToReadiness: string
  criticalGaps: string[]
}

interface LearningStep {
  step: number
  title: string
  description: string
  resources: Array<{
    type: 'course' | 'book' | 'tutorial' | 'project' | 'certification'
    title: string
    provider: string
    duration: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    url?: string
    cost: string
    rating: number
  }>
  milestones: string[]
  estimatedTime: string
  prerequisites: string[]
}

interface PersonalizedRoadmap {
  phases: Array<{
    phase: string
    duration: string
    objectives: string[]
    skills: Array<{
      skill: string
      currentLevel: number
      targetLevel: number
      resources: any[]
    }>
    projects: Array<{
      name: string
      description: string
      technologies: string[]
      duration: string
      complexity: string
      portfolio: boolean
    }>
    milestones: string[]
    assessments: any[]
  }>
  successMetrics: {
    technical: any[]
    behavioral: any[]
    career: any[]
  }
  checkpoints: any[]
}

interface MarketInsights {
  demandLevel: 'high' | 'medium' | 'low'
  salaryRange: {
    min: number
    max: number
    average: number
  }
  growthRate: number
  topCompanies: string[]
  trendingSkills: string[]
  marketTrends: string[]
  competition: 'low' | 'medium' | 'high'
  locationDemand: Array<{
    location: string
    demand: number
    salary: number
  }>
}

interface CareerRecommendations {
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
  skillFocus: string[]
  roleTransitions: Array<{
    from: string
    to: string
    timeline: string
    requirements: string[]
  }>
}

export class IntegratedCareerGuidance {
  private deepseekAPI: string

  constructor() {
    this.deepseekAPI = process.env.DEEPSEEK_API_KEY || ''
  }

  async generateComprehensiveCareerGuidance(
    resumeText: string,
    careerGoals: string,
    targetJD?: any,
    detectedStream?: DetectedStream
  ): Promise<CareerGuidanceProfile> {
    try {
      // Initialize science-optimized components
      const scienceATSParser = new ScienceATSParser()
      const scienceNLPProcessor = new ScienceNLPProcessor()
      const gapAnalyzer = new ScienceGapAnalyzer()
      
      // Step 1: Parse resume with science-optimized ATS
      const resume = await scienceATSParser.parseScienceResume(resumeText)
      
      // Step 2: Process career goals with science NLP
      const goalAnalysis = await scienceNLPProcessor.processScienceText(careerGoals)
      
      // Step 3: Create user profile for gap analysis
      const userProfile: UserProfile = {
        skills: resume.skills.technical?.map(s => s.skill) || [],
        experience: resume.experience?.map(e => e.description) || [],
        education: resume.education?.map(e => e.field) || [],
        publications: resume.publications?.map(p => p.title) || [],
        research: resume.research?.map(r => r.title) || [],
        certifications: resume.certifications?.map(c => c.name) || []
      }
      
      // Step 4: Perform comprehensive gap analysis
      const gapAnalysis = await gapAnalyzer.performGapAnalysis(userProfile, detectedStream || {
        primaryStream: 'General Science',
        secondaryStreams: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
        confidence: 0.5,
        keyIndicators: ['default']
      })
      
      // Step 5: Generate personalized roadmap
      const personalizedRoadmap = await this.generateScienceRoadmap(resume, goalAnalysis, gapAnalysis, detectedStream)
      
      // Step 6: Generate market insights
      const marketInsights = await this.generateScienceMarketInsights(detectedStream, gapAnalysis)
      
      // Step 7: Generate comprehensive recommendations
      const recommendations = await this.generateScienceRecommendations(gapAnalysis, marketInsights, detectedStream)

      return {
        resume: this.convertScienceResumeToParsedResume(resume),
        assessment: {
          careerAimAnalysis: goalAnalysis,
          personalizedQuestions: this.generatePersonalizedQuestions(resume, goalAnalysis),
          detectedStream
        },
        careerGoals,
        targetRoles: gapAnalysis.pathwayAnalysis.map(p => p.role),
        skillGapAnalysis: this.convertGapAnalysisToSkillGap(gapAnalysis),
        personalizedRoadmap,
        marketInsights,
        recommendations
      }
    } catch (error) {
      console.error('Career guidance generation error:', error)
      throw new Error('Failed to generate comprehensive career guidance')
    }
  }

  private generateRealResumeAnalysis(resume: ParsedResume) {
    // Calculate real scores based on actual resume data
    const technicalSkillsCount = resume.skills.technical.length
    const softSkillsCount = resume.skills.soft.length
    const experienceYears = resume.experience.reduce((total, exp) => {
      // Extract years from duration string (e.g., "2 years" -> 2)
      const durationMatch = exp.duration.match(/(\d+)/)
      const years = durationMatch ? parseInt(durationMatch[1]) : 0
      return total + years
    }, 0)
    
    const educationLevel = resume.education.length > 0 ? 
      resume.education.reduce((highest, edu) => {
        const levels = { 'High School': 1, 'Bachelor': 2, 'Master': 3, 'PhD': 4 }
        return Math.max(highest, levels[edu.degree as keyof typeof levels] || 0)
      }, 0) : 0

    // Calculate real overall score
    const technicalScore = Math.min(technicalSkillsCount * 10, 40) // Max 40 points
    const experienceScore = Math.min(experienceYears * 5, 30) // Max 30 points
    const educationScore = educationLevel * 10 // Max 40 points
    const overallScore = technicalScore + experienceScore + educationScore

    // Determine market readiness based on real factors
    let marketReadiness: 'Low' | 'Medium' | 'High' = 'Low'
    if (overallScore >= 80) marketReadiness = 'High'
    else if (overallScore >= 60) marketReadiness = 'Medium'

    return {
      strengths: resume.skills.technical.map(s => s.skill).concat(resume.skills.soft.map(s => s.skill)),
      improvements: this.identifyRealImprovements(resume),
      overallScore,
      marketReadiness,
      experienceYears,
      educationLevel,
      technicalSkillsCount,
      softSkillsCount,
      skills: {
        technical: resume.skills.technical.map(s => ({
          ...s,
          level: this.convertSkillLevelToNumber(s.level)
        })),
        soft: resume.skills.soft.map(s => ({
          ...s,
          level: this.convertSkillLevelToNumber(s.level)
        }))
      },
      experience: resume.experience,
      education: resume.education.map(edu => ({
        degree: edu.degree,
        field: edu.field,
        institution: edu.institution,
        year: edu.graduationYear,
        gpa: edu.gpa
      })),
      projects: resume.projects
    }
  }

  private identifyRealImprovements(resume: ParsedResume): string[] {
    const improvements: string[] = []
    
    // Check for missing key sections
    if (resume.skills.technical.length < 5) {
      improvements.push("Expand technical skills portfolio")
    }
    if (resume.skills.soft.length < 3) {
      improvements.push("Develop more soft skills")
    }
    if (resume.experience.length === 0) {
      improvements.push("Gain practical work experience")
    }
    if (resume.projects.length < 2) {
      improvements.push("Build more portfolio projects")
    }
    if (resume.certifications.length === 0) {
      improvements.push("Obtain relevant certifications")
    }
    
    return improvements
  }

  private async analyzeCareerAimsWithAI(careerGoals: string, resumeAnalysis: any): Promise<any> {
    // Use AI to analyze career goals based on real resume data
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Analyze the following career goals and user profile to determine target roles and requirements:

CAREER GOALS: ${careerGoals}

USER PROFILE:
- Technical Skills: ${resumeAnalysis.strengths.filter((s: string) => !['Communication', 'Leadership', 'Teamwork'].includes(s)).join(', ')}
- Soft Skills: ${resumeAnalysis.strengths.filter((s: string) => ['Communication', 'Leadership', 'Teamwork'].includes(s)).join(', ')}
- Experience: ${resumeAnalysis.experienceYears} years
- Education Level: ${resumeAnalysis.educationLevel}/4
- Overall Score: ${resumeAnalysis.overallScore}/100

Please provide a JSON response with:
{
  "targetRoles": ["Role 1", "Role 2", "Role 3"],
  "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "experienceRequirements": "X+ years",
  "educationRequirements": "Degree level",
  "marketDemand": "High|Medium|Low",
  "salaryRange": "$X-$Y",
  "growthPotential": "High|Medium|Low"
}
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response.text()
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
    }

    // Fallback to rule-based analysis
    return this.fallbackCareerAnalysis(careerGoals, resumeAnalysis)
  }

  private fallbackCareerAnalysis(careerGoals: string, resumeAnalysis: any) {
    const goals = careerGoals.toLowerCase()
    let targetRoles: string[] = []
    let requiredSkills: string[] = []
    
    if (goals.includes('software') || goals.includes('developer') || goals.includes('engineer')) {
      targetRoles = ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer']
      requiredSkills = ['JavaScript', 'React', 'Node.js', 'Git', 'SQL']
    } else if (goals.includes('data') || goals.includes('analytics') || goals.includes('scientist')) {
      targetRoles = ['Data Scientist', 'Data Analyst', 'ML Engineer']
      requiredSkills = ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization']
    } else if (goals.includes('molecular') || goals.includes('biology') || goals.includes('research')) {
      targetRoles = ['Research Scientist', 'Molecular Biologist', 'Lab Technician']
      requiredSkills = ['Molecular Biology', 'PCR', 'CRISPR', 'Data Analysis', 'Research Methods']
    } else {
      targetRoles = ['Professional', 'Specialist', 'Consultant']
      requiredSkills = resumeAnalysis.strengths.slice(0, 5)
    }

    return {
      targetRoles,
      requiredSkills,
      experienceRequirements: Math.max(0, 5 - resumeAnalysis.experienceYears) + '+ years',
      educationRequirements: resumeAnalysis.educationLevel >= 3 ? 'Master\'s or higher' : 'Bachelor\'s degree',
      marketDemand: 'High',
      salaryRange: resumeAnalysis.overallScore >= 80 ? '$80,000-$120,000' : '$50,000-$80,000',
      growthPotential: resumeAnalysis.overallScore >= 70 ? 'High' : 'Medium'
    }
  }

  private async analyzeSkillGaps(
    resume: ParsedResume,
    careerAimAnalysis: any,
    targetJD?: ExtractedJD
  ): Promise<SkillGapAnalysis> {
    // Extract current skills from resume
    const currentSkills = this.extractCurrentSkills(resume)
    
    // Determine required skills based on career goals and target JD
    const requiredSkills = await this.determineRequiredSkills(careerAimAnalysis, targetJD)
    
    // Calculate gaps
    const gaps = this.calculateSkillGaps(currentSkills, requiredSkills)
    
    // Generate learning paths for each gap
    const gapsWithPaths = await Promise.all(
      gaps.map(async (gap) => ({
        ...gap,
        learningPath: await this.generateLearningPath(gap)
      }))
    )
    
    // Calculate overall readiness
    const overallReadiness = this.calculateOverallReadiness(currentSkills, requiredSkills)
    const timeToReadiness = this.calculateTimeToReadiness(gapsWithPaths)
    const criticalGaps = gapsWithPaths
      .filter(gap => gap.priority === 'high' && gap.gap > 50)
      .map(gap => gap.skill)

    return {
      currentSkills,
      requiredSkills,
      gaps: gapsWithPaths,
      overallReadiness,
      timeToReadiness,
      criticalGaps
    }
  }

  private extractCurrentSkills(resume: ParsedResume): SkillGapAnalysis['currentSkills'] {
    const skills: SkillGapAnalysis['currentSkills'] = []
    
    // Technical skills
    resume.skills.technical.forEach(tech => {
      const level = this.convertSkillLevelToNumber(tech.level)
      skills.push({
        skill: tech.skill,
        level,
        category: 'technical'
      })
    })
    
    // Soft skills
    resume.skills.soft.forEach(soft => {
      const level = this.convertSkillLevelToNumber(soft.level)
      skills.push({
        skill: soft.skill,
        level,
        category: 'soft'
      })
    })
    
    // Tools
    resume.skills.tools.forEach(tool => {
      skills.push({
        skill: tool.tool,
        level: tool.proficiency,
        category: 'tool'
      })
    })
    
    return skills
  }

  private async determineRequiredSkills(careerAimAnalysis: any, targetJD?: ExtractedJD): Promise<SkillGapAnalysis['requiredSkills']> {
    const requiredSkills: SkillGapAnalysis['requiredSkills'] = []
    
    // Extract skills from target JD if provided
    if (targetJD) {
      targetJD.skills.technical.forEach(tech => {
        const level = this.convertRequirementLevelToNumber(tech.level)
        requiredSkills.push({
          skill: tech.skill,
          level,
          category: 'technical',
          priority: tech.level === 'required' ? 'high' : tech.level === 'preferred' ? 'medium' : 'low'
        })
      })
      
      targetJD.skills.soft.forEach(soft => {
        const level = this.convertRequirementLevelToNumber(soft.level)
        requiredSkills.push({
          skill: soft.skill,
          level,
          category: 'soft',
          priority: soft.level === 'required' ? 'high' : soft.level === 'preferred' ? 'medium' : 'low'
        })
      })
    }
    
    // Add skills based on career goals
    const targetRole = careerAimAnalysis.targetRole
    const roleBasedSkills = await this.getRoleBasedSkills(targetRole)
    
    roleBasedSkills.forEach(skill => {
      const existing = requiredSkills.find(s => s.skill === skill.skill)
      if (!existing) {
        requiredSkills.push(skill)
      }
    })
    
    return requiredSkills
  }

  private calculateSkillGaps(
    currentSkills: SkillGapAnalysis['currentSkills'],
    requiredSkills: SkillGapAnalysis['requiredSkills']
  ): SkillGapAnalysis['gaps'] {
    const gaps: SkillGapAnalysis['gaps'] = []
    
    requiredSkills.forEach(required => {
      const current = currentSkills.find(s => s.skill.toLowerCase() === required.skill.toLowerCase())
      
      if (!current || current.level < required.level) {
        const currentLevel = current?.level || 0
        const gap = required.level - currentLevel
        
        gaps.push({
          skill: required.skill,
          currentLevel,
          targetLevel: required.level,
          gap,
          category: required.category,
          priority: required.priority,
          learningPath: [] // Will be populated later
        })
      }
    })
    
    return gaps.sort((a, b) => b.gap - a.gap)
  }

  private async generateLearningPath(gap: SkillGapAnalysis['gaps'][0]): Promise<LearningStep[]> {
    const steps: LearningStep[] = []
    
    // Generate learning steps based on skill and gap
    if (gap.category === 'technical') {
      steps.push(...this.generateTechnicalLearningPath(gap))
    } else if (gap.category === 'soft') {
      steps.push(...this.generateSoftSkillLearningPath(gap))
    } else if (gap.category === 'tool') {
      steps.push(...this.generateToolLearningPath(gap))
    }
    
    return steps
  }

  private generateTechnicalLearningPath(gap: SkillGapAnalysis['gaps'][0]): LearningStep[] {
    const steps: LearningStep[] = []
    
    // Foundation step
    steps.push({
      step: 1,
      title: `Learn ${gap.skill} Fundamentals`,
      description: `Master the basics of ${gap.skill}`,
      resources: [
        {
          type: 'course',
          title: `${gap.skill} Complete Guide`,
          provider: 'Udemy',
          duration: '20 hours',
          difficulty: 'beginner',
          cost: '$19.99',
          rating: 4.5
        },
        {
          type: 'book',
          title: `${gap.skill} in Action`,
          provider: 'Manning',
          duration: 'Self-paced',
          difficulty: 'beginner',
          cost: '$49.99',
          rating: 4.3
        }
      ],
      milestones: ['Complete basic course', 'Build first project'],
      estimatedTime: '2-3 weeks',
      prerequisites: []
    })
    
    // Intermediate step
    if (gap.targetLevel > 60) {
      steps.push({
        step: 2,
        title: `Advanced ${gap.skill} Development`,
        description: `Master advanced concepts and best practices`,
        resources: [
          {
            type: 'course',
            title: `Advanced ${gap.skill}`,
            provider: 'Coursera',
            duration: '30 hours',
            difficulty: 'intermediate',
            cost: '$79.99',
            rating: 4.7
          },
          {
            type: 'project',
            title: `Build a ${gap.skill} Application`,
            provider: 'Self-project',
            duration: '4 weeks',
            difficulty: 'intermediate',
            cost: 'Free',
            rating: 0
          }
        ],
        milestones: ['Complete advanced course', 'Build portfolio project'],
        estimatedTime: '4-6 weeks',
        prerequisites: [`Learn ${gap.skill} Fundamentals`]
      })
    }
    
    return steps
  }

  private generateSoftSkillLearningPath(gap: SkillGapAnalysis['gaps'][0]): LearningStep[] {
    return [
      {
        step: 1,
        title: `Develop ${gap.skill} Skills`,
        description: `Improve your ${gap.skill} through practice and learning`,
        resources: [
          {
            type: 'course',
            title: `${gap.skill} Mastery`,
            provider: 'LinkedIn Learning',
            duration: '5 hours',
            difficulty: 'intermediate',
            cost: '$29.99',
            rating: 4.2
          },
          {
            type: 'tutorial',
            title: `${gap.skill} Practice Exercises`,
            provider: 'Toastmasters',
            duration: 'Ongoing',
            difficulty: 'beginner',
            cost: 'Free',
            rating: 4.0
          }
        ],
        milestones: ['Complete course', 'Practice in real scenarios'],
        estimatedTime: '4-8 weeks',
        prerequisites: []
      }
    ]
  }

  private generateToolLearningPath(gap: SkillGapAnalysis['gaps'][0]): LearningStep[] {
    return [
      {
        step: 1,
        title: `Master ${gap.skill}`,
        description: `Learn to use ${gap.skill} effectively`,
        resources: [
          {
            type: 'tutorial',
            title: `${gap.skill} Official Documentation`,
            provider: 'Official',
            duration: '10 hours',
            difficulty: 'beginner',
            cost: 'Free',
            rating: 4.5
          },
          {
            type: 'project',
            title: `${gap.skill} Practice Project`,
            provider: 'Self-project',
            duration: '2 weeks',
            difficulty: 'intermediate',
            cost: 'Free',
            rating: 0
          }
        ],
        milestones: ['Complete tutorial', 'Build practice project'],
        estimatedTime: '2-3 weeks',
        prerequisites: []
      }
    ]
  }

  private async generateDeepSeekRoadmap(
    resume: ParsedResume,
    careerAimAnalysis: any,
    skillGapAnalysis: SkillGapAnalysis
  ): Promise<PersonalizedRoadmap> {
    if (!this.deepseekAPI) {
      return this.generateMockRoadmap(resume, careerAimAnalysis, skillGapAnalysis)
    }

    try {
      const prompt = `
You are an expert career counselor and technical mentor. Create a detailed personalized career roadmap based on:

RESUME ANALYSIS:
${JSON.stringify(resume, null, 2)}

CAREER GOALS:
${JSON.stringify(careerAimAnalysis, null, 2)}

SKILL GAP ANALYSIS:
${JSON.stringify(skillGapAnalysis, null, 2)}

Generate a comprehensive JSON roadmap in this format:
{
  "phases": [
    {
      "phase": "Foundation Building",
      "duration": "3-4 months",
      "objectives": ["Master core skills", "Build portfolio"],
      "skills": [
        {
          "skill": "JavaScript",
          "currentLevel": 60,
          "targetLevel": 85,
          "resources": [
            {
              "type": "course",
              "title": "Advanced JavaScript",
              "provider": "Udemy",
              "duration": "20 hours",
              "difficulty": "intermediate",
              "url": "https://udemy.com/js",
              "certification": true,
              "priority": "high"
            }
          ]
        }
      ],
      "projects": [
        {
          "name": "E-commerce Platform",
          "description": "Full-stack e-commerce application",
          "technologies": ["React", "Node.js", "MongoDB"],
          "duration": "2 months",
          "complexity": "intermediate",
          "portfolio": true
        }
      ],
      "milestones": ["Complete JavaScript course", "Launch e-commerce project"],
      "assessments": [
        {
          "type": "Technical Assessment",
          "purpose": "Evaluate JavaScript proficiency",
          "timeline": "After phase completion",
          "successCriteria": ["85% score", "Project completion"]
        }
      ]
    }
  ],
  "successMetrics": {
    "technical": [
      {
        "metric": "JavaScript Proficiency",
        "target": "85%",
        "measurement": "Code review + assessment",
        "timeline": "3 months"
      }
    ],
    "behavioral": [
      {
        "metric": "Communication Skills",
        "target": "Lead team meetings",
        "measurement": "360-degree feedback",
        "timeline": "6 months"
      }
    ],
    "career": [
      {
        "metric": "Job Readiness",
        "target": "Senior Developer role",
        "measurement": "Interview success rate",
        "timeline": "9 months"
      }
    ]
  },
  "checkpoints": [
    {
      "timeline": "Month 3",
      "objectives": ["Complete foundation skills"],
      "assessments": ["Technical evaluation"],
      "adjustments": ["Update learning pace"]
    }
  ]
}

Focus on:
1. Address critical skill gaps first
2. Create realistic timelines based on current skill level
3. Include practical portfolio projects
4. Define measurable success metrics
5. Set regular checkpoints for adjustments
6. Align with target role requirements
7. Consider learning pace and availability
8. Include both technical and soft skill development
9. Plan for career progression milestones
10. Provide specific resource recommendations
`

      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.deepseekAPI}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]?.message?.content) {
        const content = data.choices[0].message.content
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      }
    } catch (error) {
      console.error('DeepSeek API error:', error)
    }
    
    return this.generateMockRoadmap(resume, careerAimAnalysis, skillGapAnalysis)
  }

  private generateMockRoadmap(
    resume: ParsedResume,
    careerAimAnalysis: any,
    skillGapAnalysis: SkillGapAnalysis
  ): PersonalizedRoadmap {
    return {
      phases: [
        {
          phase: 'Foundation Enhancement',
          duration: '3-4 months',
          objectives: ['Address critical skill gaps', 'Build foundational knowledge'],
          skills: skillGapAnalysis.criticalGaps.slice(0, 3).map(skill => ({
            skill,
            currentLevel: 50,
            targetLevel: 80,
            resources: [
              {
                type: 'course',
                title: `${skill} Mastery`,
                provider: 'Udemy',
                duration: '20 hours',
                difficulty: 'intermediate',
                url: 'https://udemy.com',
                certification: true,
                priority: 'high'
              }
            ]
          })),
          projects: [
            {
              name: 'Skill Development Project',
              description: 'Apply new skills in a practical project',
              technologies: skillGapAnalysis.criticalGaps.slice(0, 3),
              duration: '2 months',
              complexity: 'intermediate',
              portfolio: true
            }
          ],
          milestones: ['Complete critical skill courses', 'Launch portfolio project'],
          assessments: [
            {
              type: 'Technical Assessment',
              purpose: 'Evaluate skill improvement',
              timeline: 'After phase completion',
              successCriteria: ['80% score', 'Project completion']
            }
          ]
        },
        {
          phase: 'Advanced Development',
          duration: '4-5 months',
          objectives: ['Master advanced concepts', 'Build complex applications'],
          skills: skillGapAnalysis.gaps.slice(3, 6).map(gap => ({
            skill: gap.skill,
            currentLevel: gap.currentLevel,
            targetLevel: gap.targetLevel,
            resources: gap.learningPath.flatMap(step => step.resources)
          })),
          projects: [
            {
              name: 'Advanced Portfolio Project',
              description: 'Complex application showcasing advanced skills',
              technologies: resume.skills.technical.slice(0, 5).map(t => t.skill),
              duration: '3 months',
              complexity: 'advanced',
              portfolio: true
            }
          ],
          milestones: ['Complete advanced courses', 'Deploy production-ready app'],
          assessments: [
            {
              type: 'Code Review',
              purpose: 'Evaluate code quality and architecture',
              timeline: 'Month 6',
              successCriteria: ['Senior developer approval', 'Performance benchmarks']
            }
          ]
        },
        {
          phase: 'Career Transition',
          duration: '2-3 months',
          objectives: ['Prepare for target role', 'Job application strategy'],
          skills: [
            {
              skill: 'Interview Preparation',
              currentLevel: 60,
              targetLevel: 90,
              resources: [
                {
                  type: 'course',
                  title: 'Technical Interview Mastery',
                  provider: 'LinkedIn Learning',
                  duration: '10 hours',
                  difficulty: 'intermediate',
                  url: 'https://linkedin.com/learning',
                  certification: true,
                  priority: 'high'
                }
              ]
            }
          ],
          projects: [
            {
              name: 'Interview Portfolio',
              description: 'Curated portfolio for job applications',
              technologies: ['Portfolio', 'Documentation'],
              duration: '1 month',
              complexity: 'beginner',
              portfolio: false
            }
          ],
          milestones: ['Complete interview prep', 'Submit 10+ applications'],
          assessments: [
            {
              type: 'Mock Interviews',
              purpose: 'Evaluate interview readiness',
              timeline: 'Month 8',
              successCriteria: ['80% mock interview score', 'Positive feedback']
            }
          ]
        }
      ],
      successMetrics: {
        technical: [
          {
            metric: 'Skill Proficiency',
            target: '85% average',
            measurement: 'Technical assessments',
            timeline: '6 months'
          },
          {
            metric: 'Project Quality',
            target: '3 portfolio projects',
            measurement: 'Code reviews + deployments',
            timeline: '8 months'
          }
        ],
        behavioral: [
          {
            metric: 'Communication Skills',
            target: 'Lead team discussions',
            measurement: '360-degree feedback',
            timeline: '6 months'
          }
        ],
        career: [
          {
            metric: 'Job Readiness',
            target: careerAimAnalysis.targetRole,
            measurement: 'Interview success rate',
            timeline: `${9} months`
          },
          {
            metric: 'Salary Achievement',
            target: careerAimAnalysis.salaryExpectation,
            measurement: 'Job offers',
            timeline: '10 months'
          }
        ]
      },
      checkpoints: [
        {
          timeline: 'Month 3',
          objectives: ['Complete foundation skills'],
          assessments: ['Technical evaluation', 'Portfolio review'],
          adjustments: ['Update learning pace', 'Refine project scope']
        },
        {
          timeline: 'Month 6',
          objectives: ['Complete advanced development'],
          assessments: ['Code quality review', 'Performance testing'],
          adjustments: ['Optimize learning strategy', 'Update target timeline']
        },
        {
          timeline: 'Month 9',
          objectives: ['Career transition ready'],
          assessments: ['Interview simulation', 'Market readiness'],
          adjustments: ['Finalize job search strategy', 'Negotiation preparation']
        }
      ]
    }
  }

  private async generateMarketInsights(targetRoles: string[], resume: ParsedResume): Promise<MarketInsights> {
    // Mock market insights - in real implementation, this would call job market APIs
    return {
      demandLevel: 'high',
      salaryRange: {
        min: 80000,
        max: 180000,
        average: 120000
      },
      growthRate: 15,
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
      trendingSkills: ['AI/ML', 'Cloud Computing', 'DevOps', 'Cybersecurity'],
      marketTrends: ['Remote work', 'AI integration', 'Sustainable tech', 'Web3'],
      competition: 'medium',
      locationDemand: [
        { location: 'San Francisco', demand: 95, salary: 150000 },
        { location: 'New York', demand: 90, salary: 140000 },
        { location: 'Austin', demand: 85, salary: 120000 },
        { location: 'Seattle', demand: 88, salary: 135000 }
      ]
    }
  }

  private async generateRecommendations(
    resume: ParsedResume,
    skillGapAnalysis: SkillGapAnalysis,
    marketInsights: MarketInsights
  ): Promise<CareerRecommendations> {
    return {
      immediate: [
        {
          action: `Focus on critical skills: ${skillGapAnalysis.criticalGaps.slice(0, 2).join(', ')}`,
          priority: 'high',
          timeline: '1-2 months',
          impact: 'High - Addresses major skill gaps'
        },
        {
          action: 'Update portfolio with recent projects',
          priority: 'medium',
          timeline: '2-3 weeks',
          impact: 'Medium - Improves job prospects'
        }
      ],
      shortTerm: [
        {
          action: 'Complete skill development courses',
          priority: 'high',
          timeline: '3-4 months',
          impact: 'High - Enables career progression'
        },
        {
          action: 'Network with industry professionals',
          priority: 'medium',
          timeline: '2-3 months',
          impact: 'Medium - Increases opportunities'
        }
      ],
      longTerm: [
        {
          action: 'Pursue advanced certifications',
          priority: 'medium',
          timeline: '6-12 months',
          impact: 'High - Increases earning potential'
        },
        {
          action: 'Consider specialization in trending areas',
          priority: 'low',
          timeline: '12-18 months',
          impact: 'Medium - Future-proofs career'
        }
      ],
      skillFocus: skillGapAnalysis.criticalGaps,
      roleTransitions: [
        {
          from: resume.metadata.careerLevel,
          to: 'Senior',
          timeline: skillGapAnalysis.timeToReadiness,
          requirements: skillGapAnalysis.criticalGaps
        }
      ]
    }
  }

  // Helper methods
  private convertSkillLevelToNumber(level: string): number {
    const levelMap: Record<string, number> = {
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 95
    }
    return levelMap[level.toLowerCase()] || 50
  }

  private convertRequirementLevelToNumber(level: string): number {
    const levelMap: Record<string, number> = {
      'required': 80,
      'preferred': 60,
      'bonus': 40
    }
    return levelMap.toLowerCase() === 'required' ? 80 : 
           level.toLowerCase() === 'preferred' ? 60 : 40
  }

  private calculateOverallReadiness(
    currentSkills: SkillGapAnalysis['currentSkills'],
    requiredSkills: SkillGapAnalysis['requiredSkills']
  ): number {
    let totalReadiness = 0
    let skillCount = 0

    requiredSkills.forEach(required => {
      const current = currentSkills.find(s => s.skill.toLowerCase() === required.skill.toLowerCase())
      if (current) {
        const readiness = (current.level / required.level) * 100
        totalReadiness += Math.min(readiness, 100)
      }
      skillCount++
    })

    return skillCount > 0 ? Math.round(totalReadiness / skillCount) : 0
  }

  private calculateTimeToReadiness(gaps: SkillGapAnalysis['gaps']): string {
    const totalWeeks = gaps.reduce((total, gap) => {
      const avgTimePerGap = gap.learningPath.reduce((pathTotal, step) => {
        const weeks = parseInt(step.estimatedTime) || 4
        return pathTotal + weeks
      }, 0)
      return total + avgTimePerGap
    }, 0)

    const months = Math.ceil(totalWeeks / 4)
    return `${months} months`
  }

  private async getRoleBasedSkills(targetRole: string): Promise<SkillGapAnalysis['requiredSkills']> {
    const roleSkills: Record<string, SkillGapAnalysis['requiredSkills']> = {
      'Software Engineer': [
        { skill: 'JavaScript', level: 75, category: 'technical', priority: 'high' },
        { skill: 'React', level: 70, category: 'technical', priority: 'high' },
        { skill: 'Node.js', level: 65, category: 'technical', priority: 'medium' },
        { skill: 'Communication', level: 70, category: 'soft', priority: 'high' },
        { skill: 'Git', level: 80, category: 'tool', priority: 'high' }
      ],
      'Data Scientist': [
        { skill: 'Python', level: 80, category: 'technical', priority: 'high' },
        { skill: 'Machine Learning', level: 75, category: 'technical', priority: 'high' },
        { skill: 'Statistics', level: 70, category: 'technical', priority: 'high' },
        { skill: 'Problem Solving', level: 80, category: 'soft', priority: 'high' },
        { skill: 'Jupyter', level: 75, category: 'tool', priority: 'medium' }
      ]
    }

    return roleSkills[targetRole] || roleSkills['Software Engineer']
  }

  // New science-optimized methods
  private async generateScienceRoadmap(
    resume: ScienceResumeParse, 
    goalAnalysis: ScienceNLPAnalysis, 
    gapAnalysis: GapAnalysis, 
    detectedStream?: DetectedStream
  ): Promise<PersonalizedRoadmap> {
    const bestPath = gapAnalysis.pathwayAnalysis[0]
    return {
      phases: [
        {
          phase: 'Skill Development',
          duration: '3 months',
          objectives: [`Focus on: ${gapAnalysis.identifiedGaps.slice(0, 3).join(', ')}`],
          skills: gapAnalysis.skillAssessment.technicalSkills.slice(0, 3).map(skill => ({
            skill: skill.skill,
            currentLevel: skill.level,
            targetLevel: 80,
            resources: gapAnalysis.recommendations
          })),
          projects: [
            {
              name: 'Science Research Project',
              description: 'Apply learned skills in practical research',
              technologies: gapAnalysis.identifiedGaps.slice(0, 2),
              duration: '8 weeks',
              complexity: 'Intermediate',
              portfolio: true
            }
          ],
          milestones: ['Complete skill gap training', 'Submit research project'],
          assessments: [
            { type: 'Skill Evaluation', weight: 0.4, passingScore: 80 },
            { type: 'Project Review', weight: 0.6, passingScore: 75 }
          ]
        },
        {
          phase: 'Practical Experience',
          duration: '6 months',
          objectives: ['Apply skills through projects and internships'],
          skills: [],
          projects: [
            {
              name: 'Industry Collaboration',
              description: 'Work with industry partners',
              technologies: ['Professional Tools'],
              duration: '12 weeks',
              complexity: 'Advanced',
              portfolio: true
            }
          ],
          milestones: ['Gain practical experience', 'Build professional network'],
          assessments: [
            { type: 'Performance Review', weight: 0.5, passingScore: 85 },
            { type: 'Network Assessment', weight: 0.5, passingScore: 70 }
          ]
        },
        {
          phase: 'Career Advancement',
          duration: '9 months',
          objectives: [`Target role: ${bestPath?.role || 'Senior Scientist'}`],
          skills: [],
          projects: [
            {
              name: 'Job Application Campaign',
              description: 'Strategic job search and applications',
              technologies: ['Resume Building', 'Interview Skills'],
              duration: '8 weeks',
              complexity: 'Intermediate',
              portfolio: false
            }
          ],
          milestones: ['Achieve target role', 'Secure position'],
          assessments: [
            { type: 'Job Success Metrics', weight: 0.6, passingScore: 90 },
            { type: 'Career Satisfaction', weight: 0.4, passingScore: 80 }
          ]
        }
      ],
      successMetrics: {
        technical: [
          { metric: 'Complete skill gap training', target: '100%', timeline: '3 months' }
        ],
        behavioral: [
          { metric: 'Gain practical experience', target: '2 projects', timeline: '6 months' }
        ],
        career: [
          { metric: 'Achieve target role', target: 'Job offer', timeline: '9 months' }
        ]
      },
      checkpoints: [
        { phase: 'Skill Development', completed: false, date: '3 months' },
        { phase: 'Practical Experience', completed: false, date: '6 months' },
        { phase: 'Career Advancement', completed: false, date: '9 months' }
      ]
    }
  }

  private async generateScienceMarketInsights(
    detectedStream?: DetectedStream, 
    gapAnalysis?: GapAnalysis
  ): Promise<MarketInsights> {
    const stream = detectedStream?.primaryStream || 'General Science'
    const bestPath = gapAnalysis?.pathwayAnalysis[0]
    
    return {
      demandLevel: 'high' as const,
      salaryRange: {
        min: bestPath?.salaryPotential?.entry || 70000,
        max: bestPath?.salaryPotential?.senior || 140000,
        average: bestPath?.salaryPotential?.mid || 100000
      },
      growthRate: 0.15,
      topCompanies: this.getTopCompaniesByStream(stream),
      trendingSkills: gapAnalysis?.identifiedGaps.slice(0, 5) || [],
      marketTrends: [
        'Increased demand for data science skills',
        'Growth in biotechnology sector',
        'AI integration in scientific research'
      ],
      competition: 'medium' as const,
      locationDemand: [
        { location: 'Boston', demand: 95, salary: 110000 },
        { location: 'San Francisco', demand: 92, salary: 125000 },
        { location: 'San Diego', demand: 88, salary: 105000 },
        { location: 'New York', demand: 85, salary: 115000 },
        { location: 'Seattle', demand: 82, salary: 108000 }
      ]
    }
  }

  private async generateScienceRecommendations(
    gapAnalysis: GapAnalysis, 
    marketInsights: MarketInsights, 
    detectedStream?: DetectedStream
  ): Promise<CareerRecommendations> {
    return {
      immediate: [
        {
          action: 'Complete skill gap assessment',
          priority: 'high' as const,
          timeline: '1 week',
          impact: 'High - Identifies critical development areas'
        },
        {
          action: 'Update resume with science-specific keywords',
          priority: 'high' as const,
          timeline: '2 days',
          impact: 'Medium - Improves ATS matching'
        },
        {
          action: 'Join professional science organizations',
          priority: 'medium' as const,
          timeline: '1 month',
          impact: 'High - Expands professional network'
        }
      ],
      shortTerm: [
        {
          action: 'Complete priority skill development courses',
          priority: 'high' as const,
          timeline: '3 months',
          impact: 'High - Addresses critical skill gaps'
        },
        {
          action: 'Apply for internships or research positions',
          priority: 'medium' as const,
          timeline: '2 months',
          impact: 'High - Gains practical experience'
        }
      ],
      longTerm: [
        {
          action: 'Develop expertise in emerging technologies',
          priority: 'medium' as const,
          timeline: '1 year',
          impact: 'High - Future-proofs career'
        },
        {
          action: 'Consider advanced degrees if needed',
          priority: 'low' as const,
          timeline: '2 years',
          impact: 'High - Opens senior opportunities'
        },
        {
          action: 'Build research publication portfolio',
          priority: 'medium' as const,
          timeline: '18 months',
          impact: 'High - Establishes expertise'
        }
      ],
      skillFocus: gapAnalysis.recommendations.slice(0, 5),
      roleTransitions: [
        {
          from: 'Junior Scientist',
          to: 'Senior Scientist',
          timeline: '2-3 years',
          requirements: ['Advanced skills', 'Leadership experience', 'Publications']
        }
      ]
    }
  }

  private convertScienceResumeToParsedResume(resume: ScienceResumeParse): any {
    return {
      personalInfo: resume.personalInfo,
      education: resume.education,
      experience: resume.experience,
      skills: {
        technical: resume.skills.technical,
        soft: resume.skills.soft || [],
        tools: []
      },
      publications: resume.publications,
      research: resume.research,
      overallScore: resume.overallScore,
      marketReadiness: resume.marketReadiness
    }
  }

  private generatePersonalizedQuestions(resume: ScienceResumeParse, goalAnalysis: ScienceNLPAnalysis): string[] {
    return [
      `What specific area of ${goalAnalysis.detectedStream || 'science'} interests you most?`,
      'What laboratory or research experience do you have?',
      'Are you interested in academic research or industry roles?',
      'What specific technical skills would you like to develop?',
      'What are your long-term career aspirations in science?'
    ]
  }

  private convertGapAnalysisToSkillGap(gapAnalysis: GapAnalysis): SkillGapAnalysis {
    return {
      currentSkills: gapAnalysis.skillAssessment.technicalSkills.map(skill => ({
        skill: skill.skill,
        level: skill.level,
        category: 'technical' as const
      })),
      requiredSkills: gapAnalysis.pathwayAnalysis[0]?.skillGaps.map(gap => ({
        skill: gap.skill,
        level: gap.requiredLevel,
        category: 'technical' as const,
        priority: gap.priority as 'high' | 'medium' | 'low'
      })) || [],
      gaps: gapAnalysis.pathwayAnalysis[0]?.skillGaps.map(gap => ({
        skill: gap.skill,
        currentLevel: gap.currentLevel,
        targetLevel: gap.requiredLevel,
        gap: gap.requiredLevel - gap.currentLevel,
        category: 'technical' as const,
        priority: gap.priority as 'high' | 'medium' | 'low',
        learningPath: [{
          step: 1,
          title: `Learn ${gap.skill}`,
          description: `Master ${gap.skill} through recommended resources`,
          estimatedTime: gap.estimatedTime,
          resources: gap.learningResources.map(resource => ({
          type: 'course' as const,
          title: resource,
          provider: 'Online Platform',
          duration: '4 weeks',
          difficulty: 'intermediate' as const,
          cost: 'Free',
          rating: 4.5
        })),
          completionCriteria: `Demonstrate proficiency in ${gap.skill}`,
          milestones: [`Complete ${gap.skill} course`, `Apply ${gap.skill} in project`],
          prerequisites: [`Basic understanding of ${gap.skill}`]
        }]
      })) || [],
      overallReadiness: gapAnalysis.overallMatchScore,
      timeToReadiness: gapAnalysis.timeline,
      criticalGaps: gapAnalysis.identifiedGaps.slice(0, 3)
    }
  }

  private getTopCompaniesByStream(stream: string): string[] {
    const companies: Record<string, string[]> = {
      'Physics': ['NASA', 'SpaceX', 'Tesla', 'Google', 'Apple', 'Intel'],
      'Mathematics': ['Google', 'Goldman Sachs', 'Amazon', 'Microsoft', 'Meta'],
      'Biology': ['Genentech', 'Moderna', 'Pfizer', 'Johnson & Johnson', 'Thermo Fisher'],
      'Chemistry': ['DuPont', '3M', 'BASF', 'Procter & Gamble', 'ExxonMobil']
    }
    return companies[stream] || ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta']
  }

  private getCertificationsByStream(stream?: string): string[] {
    const certifications: Record<string, string[]> = {
      'Physics': ['Certified Physics Professional', 'Data Science Certificate'],
      'Mathematics': ['Actuarial Certification', 'Quantitative Finance Certificate'],
      'Biology': ['Certified Biotechnology Professional', 'Clinical Research Certification'],
      'Chemistry': ['Certified Chemistry Professional', 'Laboratory Safety Certification']
    }
    return certifications[stream || 'General Science'] || ['Data Science Certificate', 'Project Management Certification']
  }
}

export const integratedCareerGuidance = new IntegratedCareerGuidance()
