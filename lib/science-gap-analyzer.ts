import { DetectedStream } from './science-stream-detector'
import { StreamData, CareerPath, Skill } from './streams/physics-mathematics'
import { physicsMathematicsStream } from './streams/physics-mathematics'
import { biologyChemistryStream } from './streams/biology-chemistry'

export interface UserProfile {
  skills: string[]
  experience: string[]
  education: string[]
  publications: string[]
  research: string[]
  certifications: string[]
}

export interface GapAnalysis {
  overallMatchScore: number
  identifiedGaps: string[]
  pathwayAnalysis: PathwayAnalysis[]
  marketStatus: string
  skillAssessment: SkillAssessment
  recommendations: string[]
  timeline: string
}

export interface PathwayAnalysis {
  role: string
  matchPercentage: number
  missingSkills: string[]
  existingSkills: string[]
  skillGaps: SkillGap[]
  readinessLevel: 'Low' | 'Medium' | 'High'
  estimatedTimeline: string
  salaryPotential: {
    entry: number
    mid: number
    senior: number
  }
}

export interface SkillAssessment {
  technicalSkills: SkillScore[]
  softSkills: SkillScore[]
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  marketReadiness: 'Low' | 'Medium' | 'High'
}

export interface SkillScore {
  skill: string
  level: number
  importance: number
  category: string
}

export interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  priority: 'High' | 'Medium' | 'Low'
  learningResources: string[]
  estimatedTime: string
}

export class ScienceGapAnalyzer {
  private streamData: Map<string, StreamData>

  constructor() {
    this.streamData = new Map()
    this.streamData.set('Physics', physicsMathematicsStream)
    this.streamData.set('Mathematics', physicsMathematicsStream)
    this.streamData.set('Biology', biologyChemistryStream)
    this.streamData.set('Chemistry', biologyChemistryStream)
  }

  async performGapAnalysis(userProfile: UserProfile, detectedStream: DetectedStream): Promise<GapAnalysis> {
    try {
      // Get stream data
      const streamData = this.getStreamData(detectedStream.primaryStream)
      
      // Calculate skill matches
      const skillMatches = this.calculateSkillMatches(userProfile, streamData)
      
      // Analyze career pathways
      const pathwayAnalysis = this.analyzeCareerPathways(userProfile, streamData)
      
      // Generate skill assessment
      const skillAssessment = this.generateSkillAssessment(userProfile, streamData)
      
      // Calculate overall match score
      const overallMatchScore = this.calculateOverallScore(skillMatches, pathwayAnalysis)
      
      // Identify gaps
      const identifiedGaps = this.identifyGaps(userProfile, streamData)
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(identifiedGaps, skillAssessment)
      
      // Calculate timeline
      const timeline = this.calculateTimeline(pathwayAnalysis, overallMatchScore)

      return {
        overallMatchScore,
        identifiedGaps,
        pathwayAnalysis,
        marketStatus: 'Analysis Complete',
        skillAssessment,
        recommendations,
        timeline
      }
    } catch (error) {
      console.error('Gap analysis error:', error)
      throw new Error('Failed to perform gap analysis')
    }
  }

  private getStreamData(stream: string): StreamData {
    console.log(`🔍 Getting stream data for: "${stream}"`);
    console.log(`🗺️  Available streams:`, Array.from(this.streamData.keys()));
    
    const data = this.streamData.get(stream)
    if (!data) {
      console.log(`⚠️  Stream "${stream}" not found, falling back to Physics/Mathematics`);
      // Fallback to physics/mathematics for unknown streams
      return physicsMathematicsStream
    }
    
    console.log(`✅ Found stream data for: "${stream}"`);
    return data
  }

  private calculateSkillMatches(userProfile: UserProfile, streamData: StreamData): Map<string, number> {
    const matches = new Map<string, number>()
    const userSkills = userProfile.skills.map(s => s.toLowerCase())
    
    streamData.skills.forEach(category => {
      category.skills.forEach(skill => {
        const userHasSkill = userSkills.some(userSkill => 
          userSkill.includes(skill.name.toLowerCase()) || 
          skill.name.toLowerCase().includes(userSkill)
        )
        
        if (userHasSkill) {
          matches.set(skill.name, skill.importance)
        }
      })
    })
    
    return matches
  }

  private analyzeCareerPathways(userProfile: UserProfile, streamData: StreamData): PathwayAnalysis[] {
    return streamData.careerPaths.map(path => {
      const userSkills = userProfile.skills.map(s => s.toLowerCase())
      const requiredSkills = path.requiredSkills.map(s => s.toLowerCase())
      
      const existingSkills = requiredSkills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.includes(skill) || skill.includes(userSkill)
        )
      )
      
      const missingSkills = requiredSkills.filter(skill => !existingSkills.includes(skill))
      
      const matchPercentage = Math.round((existingSkills.length / requiredSkills.length) * 100)
      
      const skillGaps = missingSkills.map(skill => ({
        skill,
        currentLevel: 0,
        requiredLevel: 5,
        priority: this.calculateSkillPriority(skill, path),
        learningResources: this.getLearningResources(skill),
        estimatedTime: this.estimateLearningTime(skill)
      }))
      
      const readinessLevel = this.calculateReadinessLevel(matchPercentage)
      const estimatedTimeline = this.estimateCareerTimeline(matchPercentage, skillGaps)

      return {
        role: path.title,
        matchPercentage,
        missingSkills,
        existingSkills,
        skillGaps,
        readinessLevel,
        estimatedTimeline,
        salaryPotential: path.averageSalary
      }
    }).sort((a, b) => b.matchPercentage - a.matchPercentage)
  }

  private generateSkillAssessment(userProfile: UserProfile, streamData: StreamData): SkillAssessment {
    const technicalSkills: SkillScore[] = []
    const softSkills: SkillScore[] = []
    
    // Assess technical skills
    streamData.skills.forEach(category => {
      category.skills.forEach(skill => {
        const userHasSkill = userProfile.skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.name.toLowerCase())
        )
        
        technicalSkills.push({
          skill: skill.name,
          level: userHasSkill ? skill.importance * 10 : 0,
          importance: skill.importance,
          category: category.category
        })
      })
    })
    
    // Assess soft skills (based on experience and education)
    const softSkillKeywords = ['communication', 'leadership', 'teamwork', 'problem-solving', 'research', 'analysis']
    softSkillKeywords.forEach(skill => {
      const userHasSkill = [...userProfile.experience, ...userProfile.education].some(text =>
        text.toLowerCase().includes(skill)
      )
      
      softSkills.push({
        skill,
        level: userHasSkill ? 70 : 30,
        importance: 8,
        category: 'Soft Skills'
      })
    })
    
    const experienceLevel = this.calculateExperienceLevel(userProfile)
    const marketReadiness = this.calculateMarketReadiness(technicalSkills, experienceLevel)

    return {
      technicalSkills,
      softSkills,
      experienceLevel,
      marketReadiness
    }
  }

  private calculateOverallScore(skillMatches: Map<string, number>, pathwayAnalysis: PathwayAnalysis[]): number {
    if (skillMatches.size === 0) return 0
    
    const skillScore = Array.from(skillMatches.values()).reduce((sum, score) => sum + score, 0) / skillMatches.size
    const pathwayScore = pathwayAnalysis[0]?.matchPercentage || 0
    
    return Math.round((skillScore * 0.6 + pathwayScore * 0.4))
  }

  private identifyGaps(userProfile: UserProfile, streamData: StreamData): string[] {
    const gaps: string[] = []
    const userSkills = userProfile.skills.map(s => s.toLowerCase())
    
    streamData.atsKeywords.forEach(keyword => {
      const userHasKeyword = userSkills.some(skill => 
        skill.includes(keyword.toLowerCase()) || 
        skill === keyword.toLowerCase()
      )
      
      if (!userHasKeyword) {
        gaps.push(keyword)
      }
    })
    
    return gaps.slice(0, 10) // Return top 10 gaps
  }

  private generateRecommendations(gaps: string[], skillAssessment: SkillAssessment): string[] {
    const recommendations: string[] = []
    
    // Skill-based recommendations
    if (gaps.length > 5) {
      recommendations.push('Focus on developing core technical skills through online courses and certifications')
    }
    
    // Experience-based recommendations
    if (skillAssessment.experienceLevel === 'Beginner') {
      recommendations.push('Gain practical experience through internships or research projects')
    }
    
    // Market readiness recommendations
    if (skillAssessment.marketReadiness === 'Low') {
      recommendations.push('Build a strong portfolio of projects and research work')
    }
    
    // Specific skill recommendations
    const topGaps = gaps.slice(0, 3)
    if (topGaps.length > 0) {
      recommendations.push(`Priority learning areas: ${topGaps.join(', ')}`)
    }
    
    return recommendations
  }

  private calculateTimeline(pathwayAnalysis: PathwayAnalysis[], overallScore: number): string {
    const bestPath = pathwayAnalysis[0]
    if (!bestPath) return '12+ months'
    
    if (overallScore >= 80) return '3-6 months'
    if (overallScore >= 60) return '6-9 months'
    if (overallScore >= 40) return '9-12 months'
    return '12+ months'
  }

  private calculateSkillPriority(skill: string, path: CareerPath): 'High' | 'Medium' | 'Low' {
    if (path.requiredSkills.includes(skill)) return 'High'
    if (path.gapRequirements.includes(skill)) return 'Medium'
    return 'Low'
  }

  private getLearningResources(skill: string): string[] {
    const resources: string[] = []
    
    // Generic resource mapping
    if (skill.includes('python') || skill.includes('programming')) {
      resources.push('Coursera: Python for Data Science', 'edX: Introduction to Computer Science')
    }
    if (skill.includes('machine learning') || skill.includes('ml')) {
      resources.push('Coursera: Machine Learning by Andrew Ng', 'Fast.ai: Practical Deep Learning')
    }
    if (skill.includes('biology') || skill.includes('chemistry')) {
      resources.push('Khan Academy: Biology/Chemistry', 'Coursera: Bioinformatics')
    }
    
    return resources.length > 0 ? resources : ['Online courses', 'Textbooks', 'Workshops']
  }

  private estimateLearningTime(skill: string): string {
    // Basic estimation based on skill complexity
    if (skill.includes('machine learning') || skill.includes('deep learning')) return '3-6 months'
    if (skill.includes('programming') || skill.includes('python')) return '2-4 months'
    if (skill.includes('statistics') || skill.includes('mathematics')) return '4-6 months'
    return '1-3 months'
  }

  private calculateReadinessLevel(matchPercentage: number): 'Low' | 'Medium' | 'High' {
    if (matchPercentage >= 70) return 'High'
    if (matchPercentage >= 40) return 'Medium'
    return 'Low'
  }

  private estimateCareerTimeline(matchPercentage: number, skillGaps: SkillGap[]): string {
    const highPriorityGaps = skillGaps.filter(gap => gap.priority === 'High').length
    
    if (matchPercentage >= 80) return 'Immediate'
    if (matchPercentage >= 60) return '3-6 months'
    if (highPriorityGaps > 3) return '9-12 months'
    return '6-9 months'
  }

  private calculateExperienceLevel(userProfile: UserProfile): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const experienceCount = userProfile.experience.length
    const educationCount = userProfile.education.length
    const publicationCount = userProfile.publications.length
    
    if (experienceCount >= 3 || publicationCount >= 5) return 'Expert'
    if (experienceCount >= 2 || publicationCount >= 2) return 'Advanced'
    if (experienceCount >= 1 || educationCount >= 2) return 'Intermediate'
    return 'Beginner'
  }

  private calculateMarketReadiness(technicalSkills: SkillScore[], experienceLevel: string): 'Low' | 'Medium' | 'High' {
    const avgSkillLevel = technicalSkills.reduce((sum, skill) => sum + skill.level, 0) / technicalSkills.length
    
    if (experienceLevel === 'Expert' && avgSkillLevel >= 70) return 'High'
    if (experienceLevel === 'Advanced' && avgSkillLevel >= 50) return 'Medium'
    return 'Low'
  }
}
