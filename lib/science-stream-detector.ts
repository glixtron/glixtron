import { ScienceATSParser } from './science-ats-parser'
import { ScienceNLPProcessor } from './science-nlp-processor'

export interface DetectedStream {
  primaryStream: string
  secondaryStreams: string[]
  confidence: number
  keyIndicators: string[]
}

export class ScienceStreamDetector {
  private atsParser: ScienceATSParser
  private nlpProcessor: ScienceNLPProcessor

  constructor() {
    this.atsParser = new ScienceATSParser()
    this.nlpProcessor = new ScienceNLPProcessor()
  }

  async detectScienceStream(resumeText: string, careerGoals: string): Promise<DetectedStream> {
    try {
      // Parse resume for science indicators
      const resume = await this.atsParser.parseScienceResume(resumeText)
      
      // Analyze career goals for stream preferences
      const goalAnalysis = await this.nlpProcessor.processScienceText(careerGoals)
      
      // Combine indicators from resume and goals
      const indicators = this.extractStreamIndicators(resume, goalAnalysis)
      
      // Determine primary and secondary streams
      const streamAnalysis = this.analyzeStreamDistribution(indicators)
      
      return streamAnalysis
    } catch (error) {
      console.error('Stream detection error:', error)
      // Fallback to general science
      return {
        primaryStream: 'General Science',
        secondaryStreams: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
        confidence: 0.3,
        keyIndicators: ['fallback_detection']
      }
    }
  }

  private extractStreamIndicators(resume: any, goalAnalysis: any): Map<string, number> {
    const indicators = new Map<string, number>()
    
    // Extract from resume skills
    resume.skills.technical?.forEach((skill: any) => {
      const stream = this.categorizeSkill(skill.skill)
      if (stream) {
        indicators.set(stream, (indicators.get(stream) || 0) + skill.level * 0.3)
      }
    })
    
    // Extract from education
    resume.education?.forEach((edu: any) => {
      const stream = this.categorizeField(edu.field)
      if (stream) {
        indicators.set(stream, (indicators.get(stream) || 0) + 0.4)
      }
    })
    
    // Extract from experience
    resume.experience?.forEach((exp: any) => {
      const stream = this.categorizeExperience(exp.description)
      if (stream) {
        indicators.set(stream, (indicators.get(stream) || 0) + 0.3)
      }
    })
    
    return indicators
  }

  private categorizeSkill(skill: string): string | null {
    const physicsKeywords = ['quantum', 'mechanics', 'thermodynamics', 'optics', 'electromagnetism', 'astrophysics', 'calculus', 'matlab', 'physics']
    const chemistryKeywords = ['organic', 'inorganic', 'analytical', 'biochemistry', 'polymer', 'catalysis', 'chemistry', 'hplc', 'spectroscopy']
    const biologyKeywords = ['molecular', 'genetics', 'biotechnology', 'microbiology', 'ecology', 'physiology', 'biology', 'crispr', 'pcr', 'cell']
    const mathKeywords = ['calculus', 'algebra', 'statistics', 'probability', 'geometry', 'discrete', 'mathematics', 'quantitative', 'modeling']
    
    const skillLower = skill.toLowerCase()
    
    if (physicsKeywords.some(kw => skillLower.includes(kw))) return 'Physics'
    if (chemistryKeywords.some(kw => skillLower.includes(kw))) return 'Chemistry'
    if (biologyKeywords.some(kw => skillLower.includes(kw))) return 'Biology'
    if (mathKeywords.some(kw => skillLower.includes(kw))) return 'Mathematics'
    
    return null
  }

  private categorizeField(field: string): string | null {
    const fieldLower = field.toLowerCase()
    
    if (fieldLower.includes('physics')) return 'Physics'
    if (fieldLower.includes('chemistry') || fieldLower.includes('chemical')) return 'Chemistry'
    if (fieldLower.includes('biology') || fieldLower.includes('biological')) return 'Biology'
    if (fieldLower.includes('math') || fieldLower.includes('statistics')) return 'Mathematics'
    
    return null
  }

  private categorizeExperience(description: string): string | null {
    const descLower = description.toLowerCase()
    
    // Look for research/lab experience indicators
    if (descLower.includes('research') || descLower.includes('laboratory') || descLower.includes('experiment')) {
      return this.categorizeSkill(description)
    }
    
    return null
  }

  private analyzeStreamDistribution(indicators: Map<string, number>): DetectedStream {
    if (indicators.size === 0) {
      return {
        primaryStream: 'General Science',
        secondaryStreams: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
        confidence: 0.3,
        keyIndicators: ['no_clear_indicators']
      }
    }

    // Sort by score
    const sortedStreams = Array.from(indicators.entries())
      .sort((a, b) => b[1] - a[1])
    
    const primaryStream = sortedStreams[0][0]
    const primaryScore = sortedStreams[0][1]
    const totalScore = Array.from(indicators.values()).reduce((sum, score) => sum + score, 0)
    
    const confidence = primaryScore / totalScore
    const secondaryStreams = sortedStreams.slice(1, 3).map(([stream]) => stream)
    
    return {
      primaryStream,
      secondaryStreams,
      confidence,
      keyIndicators: Array.from(indicators.keys())
    }
  }
}
