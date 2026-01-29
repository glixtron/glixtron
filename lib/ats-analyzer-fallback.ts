/**
 * ATS Analyzer with Fallback Implementation
 * Works without external AI dependencies for basic functionality
 */

// ATS Keyword Categories and Weights
export const ATS_CATEGORIES = {
  TECHNICAL_SKILLS: { weight: 0.25, keywords: [] },
  SOFT_SKILLS: { weight: 0.15, keywords: [] },
  EXPERIENCE: { weight: 0.20, keywords: [] },
  EDUCATION: { weight: 0.10, keywords: [] },
  CERTIFICATIONS: { weight: 0.10, keywords: [] },
  TOOLS_TECHNOLOGIES: { weight: 0.15, keywords: [] },
  INDUSTRY_TERMS: { weight: 0.05, keywords: [] }
}

// High-Conversion Keywords by Industry
export const HIGH_CONVERSION_KEYWORDS = {
  technology: [
    'full-stack', 'react', 'node.js', 'python', 'aws', 'docker', 'kubernetes',
    'microservices', 'api', 'cloud', 'devops', 'ci/cd', 'agile', 'scrum',
    'typescript', 'javascript', 'mongodb', 'postgresql', 'redis', 'graphql'
  ],
  healthcare: [
    'patient care', 'medical records', 'hipaa', 'clinical', 'diagnosis',
    'treatment', 'healthcare', 'medical', 'nursing', 'pharmacy', 'therapy'
  ],
  finance: [
    'financial analysis', 'risk management', 'compliance', 'audit', 'investment',
    'banking', 'accounting', 'fintech', 'trading', 'portfolio', 'regulatory'
  ],
  marketing: [
    'digital marketing', 'seo', 'sem', 'content strategy', 'social media',
    'analytics', 'brand management', 'campaign', 'conversion', 'roi'
  ],
  sales: [
    'business development', 'sales strategy', 'crm', 'lead generation',
    'revenue', 'negotiation', 'account management', 'b2b', 'b2c', 'quota'
  ]
}

// ATS-Friendly Action Verbs
export const ATS_ACTION_VERBS = [
  'achieved', 'implemented', 'developed', 'managed', 'led', 'created',
  'optimized', 'improved', 'increased', 'decreased', 'launched', 'designed',
  'engineered', 'architected', 'coordinated', 'executed', 'delivered',
  'transformed', 'streamlined', 'automated', 'integrated', 'migrated'
]

export interface ATSAnalysisResult {
  atsScore: number
  keywordMatch: number
  categoryScores: Record<string, number>
  foundKeywords: string[]
  missingKeywords: string[]
  highConversionKeywords: string[]
  actionVerbs: string[]
  recommendations: string[]
  optimizationSuggestions: OptimizationSuggestion[]
}

export interface OptimizationSuggestion {
  type: 'keyword' | 'phrase' | 'structure' | 'metric'
  original: string
  suggested: string
  impact: 'high' | 'medium' | 'low'
  reason: string
}

export interface ResumeMatchResult {
  overallMatch: number
  atsCompatibility: number
  skillMatch: number
  experienceMatch: number
  educationMatch: number
  detailedAnalysis: {
    matchingSkills: string[]
    missingSkills: string[]
    experienceAlignment: string
    keywordDensity: number
    readabilityScore: number
    structureScore: number
  }
  enhancementSuggestions: OptimizationSuggestion[]
}

class ATSAnalyzer {
  /**
   * Extract and score keywords from job description using NLP patterns
   */
  async extractKeywords(text: string, industry?: string): Promise<{
    primary: string[]
    secondary: string[]
    technical: string[]
    soft: string[]
    action: string[]
  }> {
    const keywords = {
      primary: [] as string[],
      secondary: [] as string[],
      technical: [] as string[],
      soft: [] as string[],
      action: [] as string[]
    }

    // Extract technical skills using regex patterns
    const technicalPatterns = [
      /\b(javascript|typescript|python|java|react|vue|angular|node\.js|express|mongodb|postgresql|mysql|redis|docker|kubernetes|aws|azure|gcp|git|ci\/cd|agile|scrum|rest|graphql|microservices)\b/gi,
      /\b(html|css|sass|less|webpack|vite|next\.js|nuxt\.js|gatsby|tailwind|bootstrap|jquery)\b/gi,
      /\b(machine learning|artificial intelligence|data science|analytics|blockchain|devops|backend|frontend|full[-\s]?stack)\b/gi
    ]

    technicalPatterns.forEach(pattern => {
      const matches = text.match(pattern) || []
      keywords.technical.push(...matches.map(m => m.toLowerCase()))
    })

    // Extract soft skills
    const softSkillPatterns = [
      /\b(communication|leadership|teamwork|problem[-\s]?solving|analytical|collaboration|adaptability|creativity|time management|project management|critical thinking)\b/gi,
      /\b(interpersonal|organizational|detail[-\s]?oriented|multitasking|decision[-\s]?making|strategic|negotiation|presentation)\b/gi
    ]

    softSkillPatterns.forEach(pattern => {
      const matches = text.match(pattern) || []
      keywords.soft.push(...matches.map(m => m.toLowerCase()))
    })

    // Extract action verbs
    ATS_ACTION_VERBS.forEach(verb => {
      if (text.toLowerCase().includes(verb)) {
        keywords.action.push(verb)
      }
    })

    // Extract high-conversion keywords for industry
    if (industry && HIGH_CONVERSION_KEYWORDS[industry as keyof typeof HIGH_CONVERSION_KEYWORDS]) {
      const industryKeywords = HIGH_CONVERSION_KEYWORDS[industry as keyof typeof HIGH_CONVERSION_KEYWORDS]
      industryKeywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          keywords.primary.push(keyword)
        }
      })
    }

    // Extract primary keywords (most important terms)
    const primaryPatterns = [
      /\b(senior|junior|lead|principal|staff|manager|director|vp|chief|c[-\s]?level|expert|specialist)\b/gi,
      /\b(bachelor|master|phd|degree|certification|licensed|qualified)\b/gi,
      /\b(\d+\+?\s*years?|\d+\s*-\s*\d+\s*years?)\b/gi
    ]

    primaryPatterns.forEach(pattern => {
      const matches = text.match(pattern) || []
      keywords.primary.push(...matches.map(m => m.toLowerCase()))
    })

    // Remove duplicates and sort by frequency
    Object.keys(keywords).forEach(key => {
      keywords[key as keyof typeof keywords] = Array.from(new Set(keywords[key as keyof typeof keywords]))
    })

    return keywords
  }

  /**
   * Analyze resume for ATS compatibility
   */
  async analyzeResume(resumeText: string, jobDescription: string, industry?: string): Promise<ATSAnalysisResult> {
    // Extract keywords from both documents
    const jdKeywords = await this.extractKeywords(jobDescription, industry)
    const resumeKeywords = await this.extractKeywords(resumeText, industry)

    // Calculate keyword match scores
    const allJDKeywords = [
      ...jdKeywords.primary,
      ...jdKeywords.secondary,
      ...jdKeywords.technical,
      ...jdKeywords.soft
    ]

    const foundKeywords = allJDKeywords.filter(keyword => 
      resumeText.toLowerCase().includes(keyword.toLowerCase())
    )

    const missingKeywords = allJDKeywords.filter(keyword => 
      !resumeText.toLowerCase().includes(keyword.toLowerCase())
    )

    // Calculate category scores
    const categoryScores = this.calculateCategoryScores(resumeText, jdKeywords)
    let totalScore = 0

    Object.keys(ATS_CATEGORIES).forEach(category => {
      const score = categoryScores[category] || 0
      totalScore += score * ATS_CATEGORIES[category as keyof typeof ATS_CATEGORIES].weight
    })

    // Check for high-conversion keywords
    const highConversionKeywords = this.findHighConversionKeywords(resumeText, industry)

    // Check for action verbs
    const actionVerbs = ATS_ACTION_VERBS.filter(verb => 
      resumeText.toLowerCase().includes(verb)
    )

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      foundKeywords,
      missingKeywords,
      categoryScores,
      actionVerbs
    )

    // Generate optimization suggestions
    const optimizationSuggestions = this.generateOptimizationSuggestions(
      resumeText,
      jobDescription,
      foundKeywords,
      missingKeywords
    )

    return {
      atsScore: Math.round(totalScore),
      keywordMatch: Math.round((foundKeywords.length / allJDKeywords.length) * 100),
      categoryScores,
      foundKeywords,
      missingKeywords,
      highConversionKeywords,
      actionVerbs,
      recommendations,
      optimizationSuggestions
    }
  }

  /**
   * Match resume against job description with detailed analysis
   */
  async matchResumeToJob(resumeText: string, jobDescription: string, industry?: string): Promise<ResumeMatchResult> {
    const atsAnalysis = await this.analyzeResume(resumeText, jobDescription, industry)

    // Calculate detailed match scores
    const skillMatch = atsAnalysis.categoryScores['TECHNICAL_SKILLS'] || 0
    const experienceMatch = atsAnalysis.categoryScores['EXPERIENCE'] || 0
    const educationMatch = atsAnalysis.categoryScores['EDUCATION'] || 0

    const overallMatch = (
      atsAnalysis.atsScore * 0.4 +
      skillMatch * 0.3 +
      experienceMatch * 0.2 +
      educationMatch * 0.1
    )

    // Calculate readability and structure scores
    const readabilityScore = this.calculateReadabilityScore(resumeText)
    const structureScore = this.calculateStructureScore(resumeText)

    return {
      overallMatch: Math.round(overallMatch),
      atsCompatibility: atsAnalysis.atsScore,
      skillMatch: Math.round(skillMatch),
      experienceMatch: Math.round(experienceMatch),
      educationMatch: Math.round(educationMatch),
      detailedAnalysis: {
        matchingSkills: atsAnalysis.foundKeywords,
        missingSkills: atsAnalysis.missingKeywords,
        experienceAlignment: this.analyzeExperienceAlignment(resumeText, jobDescription),
        keywordDensity: this.calculateKeywordDensity(resumeText, atsAnalysis.foundKeywords),
        readabilityScore,
        structureScore
      },
      enhancementSuggestions: atsAnalysis.optimizationSuggestions
    }
  }

  /**
   * Helper methods
   */
  private calculateCategoryScores(resumeText: string, jdKeywords: any): Record<string, number> {
    const scores: Record<string, number> = {}

    scores['TECHNICAL_SKILLS'] = this.calculateCategoryScore(resumeText, jdKeywords.technical)
    scores['SOFT_SKILLS'] = this.calculateCategoryScore(resumeText, jdKeywords.soft)
    scores['EXPERIENCE'] = this.calculateCategoryScore(resumeText, jdKeywords.primary.filter((k: string) => 
      /years|experience|senior|junior|lead|manager|director/.test(k)
    ))
    scores['EDUCATION'] = this.calculateCategoryScore(resumeText, jdKeywords.primary.filter((k: string) => 
      /degree|bachelor|master|phd|certification|diploma/.test(k)
    ))
    scores['CERTIFICATIONS'] = this.calculateCategoryScore(resumeText, jdKeywords.primary.filter((k: string) => 
      /certified|license|credential/.test(k)
    ))
    scores['TOOLS_TECHNOLOGIES'] = this.calculateCategoryScore(resumeText, jdKeywords.technical)
    scores['INDUSTRY_TERMS'] = this.calculateCategoryScore(resumeText, jdKeywords.secondary)

    return scores
  }

  private calculateCategoryScore(resumeText: string, keywords: string[]): number {
    if (keywords.length === 0) return 0
    
    const foundKeywords = keywords.filter(keyword => 
      resumeText.toLowerCase().includes(keyword.toLowerCase())
    )
    
    return Math.round((foundKeywords.length / keywords.length) * 100)
  }

  private findHighConversionKeywords(text: string, industry?: string): string[] {
    const found: string[] = []
    
    if (industry && HIGH_CONVERSION_KEYWORDS[industry as keyof typeof HIGH_CONVERSION_KEYWORDS]) {
      const industryKeywords = HIGH_CONVERSION_KEYWORDS[industry as keyof typeof HIGH_CONVERSION_KEYWORDS]
      industryKeywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          found.push(keyword)
        }
      })
    }

    // Check general high-conversion keywords
    const generalKeywords = ['leadership', 'management', 'development', 'strategy', 'optimization']
    generalKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        found.push(keyword)
      }
    })

    return found
  }

  private generateRecommendations(
    foundKeywords: string[],
    missingKeywords: string[],
    categoryScores: Record<string, number>,
    actionVerbs: string[]
  ): string[] {
    const recommendations: string[] = []

    if (missingKeywords.length > 10) {
      recommendations.push('Add more relevant keywords from the job description to improve ATS matching')
    }

    if (actionVerbs.length < 5) {
      recommendations.push('Use more action verbs to describe achievements and responsibilities')
    }

    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score < 50) {
        recommendations.push(`Improve ${category.replace('_', ' ').toLowerCase()} section to better match job requirements`)
      }
    })

    if (foundKeywords.length / (foundKeywords.length + missingKeywords.length) < 0.6) {
      recommendations.push('Increase keyword density by naturally incorporating more job-specific terms')
    }

    return recommendations
  }

  private generateOptimizationSuggestions(
    resumeText: string,
    jobDescription: string,
    foundKeywords: string[],
    missingKeywords: string[]
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // Keyword suggestions
    missingKeywords.slice(0, 5).forEach(keyword => {
      suggestions.push({
        type: 'keyword',
        original: '',
        suggested: `Add "${keyword}" to highlight this required skill`,
        impact: 'high',
        reason: `This keyword is mentioned in the job description but missing from your resume`
      })
    })

    // Structure suggestions
    if (!resumeText.toLowerCase().includes('summary')) {
      suggestions.push({
        type: 'structure',
        original: 'Missing summary section',
        suggested: 'Add a professional summary at the top of your resume',
        impact: 'high',
        reason: 'ATS systems look for summaries to quickly understand candidate profile'
      })
    }

    // Metric suggestions
    if (!/\d+%|\$\d+|\d+\s*(years?|months?)/.test(resumeText)) {
      suggestions.push({
        type: 'metric',
        original: 'Lacks quantifiable achievements',
        suggested: 'Add specific metrics and numbers to demonstrate impact',
        impact: 'high',
        reason: 'Quantifiable achievements significantly improve ATS scoring'
      })
    }

    return suggestions
  }

  private analyzeExperienceAlignment(resumeText: string, jobDescription: string): string {
    const experiencePatterns = [
      /(\d+)\+?\s*years?/gi,
      /(senior|junior|lead|principal|staff|manager|director)/gi,
      /(entry[-\s]?level|mid[-\s]?level|senior[-\s]?level)/gi
    ]

    const resumeExperience = experiencePatterns.map(pattern => 
      (resumeText.match(pattern) || []).length
    ).reduce((a, b) => a + b, 0)

    const jdExperience = experiencePatterns.map(pattern => 
      (jobDescription.match(pattern) || []).length
    ).reduce((a, b) => a + b, 0)

    if (resumeExperience >= jdExperience) {
      return 'Strong experience alignment'
    } else if (resumeExperience >= jdExperience * 0.7) {
      return 'Good experience alignment'
    } else {
      return 'Experience level may not fully match requirements'
    }
  }

  private calculateKeywordDensity(text: string, keywords: string[]): number {
    const words = text.split(/\s+/).length
    const keywordCount = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = text.match(regex)
      return count + (matches ? matches.length : 0)
    }, 0)

    return Math.round((keywordCount / words) * 100)
  }

  private calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).length
    const words = text.split(/\s+/).length
    const avgWordsPerSentence = words / sentences

    // Simple readability scoring
    if (avgWordsPerSentence < 15) return 85
    if (avgWordsPerSentence < 20) return 75
    if (avgWordsPerSentence < 25) return 65
    return 55
  }

  private calculateStructureScore(text: string): number {
    let score = 0

    // Check for common resume sections
    const sections = ['experience', 'education', 'skills', 'summary', 'projects']
    sections.forEach(section => {
      if (text.toLowerCase().includes(section)) score += 20
    })

    // Check for bullet points
    const bulletPoints = (text.match(/[•·-]\s/g) || []).length
    if (bulletPoints > 10) score += 10

    return Math.min(score, 100)
  }
}

export const atsAnalyzer = new ATSAnalyzer()
