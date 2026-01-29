/**
 * ATS (Applicant Tracking System) Analyzer with NLP and AI Integration
 * Advanced keyword extraction, semantic analysis, and AI-powered optimization
 */

// Dynamic imports for AI providers to avoid build issues

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
  aiInsights?: AIInsights
  optimizationSuggestions: OptimizationSuggestion[]
}

export interface AIInsights {
  semanticAnalysis: string
  skillGapAnalysis: string
  experienceLevelMatch: string
  culturalFitIndicators: string
  improvementAreas: string[]
  strengths: string[]
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
  private aiProvider: 'gemini' | 'openai' = 'gemini'

  constructor() {
    // Check which AI providers are available
    const geminiApiKey = process.env.GEMINI_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (openaiApiKey) {
      this.aiProvider = 'openai'
    } else if (geminiApiKey) {
      this.aiProvider = 'gemini'
    }
  }

  /**
   * Extract and score keywords from job description using NLP
   */
  async extractKeywords(text: string, industry?: string): Promise<{
    primary: string[]
    secondary: string[]
    technical: string[]
    soft: string[]
    action: string[]
  }> {
    // Basic keyword extraction using patterns and NLP
    const keywords = {
      primary: [] as string[],
      secondary: [] as string[],
      technical: [] as string[],
      soft: [] as string[],
      action: [] as string[]
    }

    // Extract technical skills
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

    // Use AI for advanced keyword extraction
    try {
      const aiKeywords = await this.extractKeywordsWithAI(text, industry)
      keywords.primary.push(...aiKeywords.primary)
      keywords.secondary.push(...aiKeywords.secondary)
    } catch (error) {
      console.warn('AI keyword extraction failed, using basic patterns:', error)
    }

    // Remove duplicates and sort by frequency
    Object.keys(keywords).forEach(key => {
      keywords[key as keyof typeof keywords] = [...new Set(keywords[key as keyof typeof keywords])]
    })

    return keywords
  }

  /**
   * AI-powered keyword extraction using Gemini or OpenAI
   */
  private async extractKeywordsWithAI(text: string, industry?: string): Promise<{
    primary: string[]
    secondary: string[]
  }> {
    const prompt = `
    Analyze this job description and extract the most important keywords for ATS optimization:

    Job Description:
    ${text}

    Industry: ${industry || 'General'}

    Please provide:
    1. Primary keywords (most critical for ATS matching)
    2. Secondary keywords (important but less critical)

    Focus on:
    - Technical skills and technologies
    - Experience requirements
    - Qualifications and certifications
    - Industry-specific terminology
    - Action verbs and achievements

    Format your response as JSON:
    {
      "primary": ["keyword1", "keyword2", ...],
      "secondary": ["keyword1", "keyword2", ...]
    }
    `

    try {
      if (this.aiProvider === 'gemini') {
        // Dynamic import for Gemini
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const geminiApiKey = process.env.GEMINI_API_KEY
        if (!geminiApiKey) throw new Error('GEMINI_API_KEY not configured')
        
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        const response = await result.response.text()
        return JSON.parse(response)
      } else if (this.aiProvider === 'openai') {
        // Dynamic import for OpenAI
        const OpenAI = await import('openai').then(m => m.default)
        const openaiApiKey = process.env.OPENAI_API_KEY
        if (!openaiApiKey) throw new Error('OPENAI_API_KEY not configured')
        
        const openai = new OpenAI({ apiKey: openaiApiKey })
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
        return JSON.parse(response.choices[0].message.content || '{}')
      }
    } catch (error) {
      console.error('AI keyword extraction error:', error)
    }

    return { primary: [], secondary: [] }
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
    const categoryScores = {}
    let totalScore = 0

    Object.keys(ATS_CATEGORIES).forEach(category => {
      const categoryKeywords = this.getCategoryKeywords(category, jdKeywords)
      const foundInCategory = categoryKeywords.filter(keyword => 
        resumeText.toLowerCase().includes(keyword.toLowerCase())
      )
      const score = categoryKeywords.length > 0 ? (foundInCategory.length / categoryKeywords.length) * 100 : 0
      categoryScores[category] = score
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

    // Get AI insights
    let aiInsights: AIInsights | undefined
    try {
      aiInsights = await this.getAIInsights(resumeText, jobDescription, industry)
    } catch (error) {
      console.warn('AI insights generation failed:', error)
    }

    // Generate optimization suggestions
    const optimizationSuggestions = await this.generateOptimizationSuggestions(
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
      aiInsights,
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
   * Get AI-powered insights for resume optimization
   */
  private async getAIInsights(resumeText: string, jobDescription: string, industry?: string): Promise<AIInsights> {
    const prompt = `
    Analyze this resume and job description for ATS optimization and provide insights:

    Resume:
    ${resumeText.substring(0, 2000)}...

    Job Description:
    ${jobDescription}

    Industry: ${industry || 'General'}

    Provide insights on:
    1. Semantic analysis - how well the resume matches the job semantically
    2. Skill gap analysis - what skills are missing or need emphasis
    3. Experience level match - does the experience align with requirements
    4. Cultural fit indicators - language and tone alignment
    5. Improvement areas - specific areas to enhance
    6. Strengths - what the resume does well

    Format as JSON:
    {
      "semanticAnalysis": "...",
      "skillGapAnalysis": "...",
      "experienceLevelMatch": "...",
      "culturalFitIndicators": "...",
      "improvementAreas": ["...", "..."],
      "strengths": ["...", "..."]
    }
    `

    try {
      if (this.aiProvider === 'gemini' && this.geminiAI) {
        const model = this.geminiAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        const response = await result.response.text()
        return JSON.parse(response)
      } else if (this.aiProvider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
        return JSON.parse(response.choices[0].message.content || '{}')
      }
    } catch (error) {
      console.error('AI insights generation error:', error)
    }

    return {
      semanticAnalysis: 'Unable to generate semantic analysis',
      skillGapAnalysis: 'Unable to analyze skill gaps',
      experienceLevelMatch: 'Unable to match experience level',
      culturalFitIndicators: 'Unable to assess cultural fit',
      improvementAreas: [],
      strengths: []
    }
  }

  /**
   * Generate AI-powered optimization suggestions
   */
  private async generateOptimizationSuggestions(
    resumeText: string,
    jobDescription: string,
    foundKeywords: string[],
    missingKeywords: string[]
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = []

    // Keyword suggestions
    missingKeywords.slice(0, 10).forEach(keyword => {
      suggestions.push({
        type: 'keyword',
        original: '',
        suggested: `Add "${keyword}" to highlight this required skill`,
        impact: 'high',
        reason: `This keyword is mentioned in the job description but missing from your resume`
      })
    })

    // Use AI for advanced suggestions
    try {
      const prompt = `
      Analyze this resume and job description to provide specific optimization suggestions:

      Resume excerpt:
      ${resumeText.substring(0, 1500)}...

      Job Description:
      ${jobDescription.substring(0, 1500)}...

      Missing keywords: ${missingKeywords.slice(0, 5).join(', ')}

      Provide 5-7 specific suggestions to improve ATS compatibility and match rate.
      Focus on:
      - Specific phrases to add or modify
      - Metrics to include
      - Structure improvements
      - Keyword optimization

      Format as JSON array:
      [
        {
          "type": "keyword|phrase|structure|metric",
          "original": "current text or description",
          "suggested": "improved version",
          "impact": "high|medium|low",
          "reason": "why this improves ATS score"
        }
      ]
      `

      let aiSuggestions: OptimizationSuggestion[] = []
      if (this.aiProvider === 'gemini' && this.geminiAI) {
        const model = this.geminiAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        const response = await result.response.text()
        aiSuggestions = JSON.parse(response)
      } else if (this.aiProvider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
        aiSuggestions = JSON.parse(response.choices[0].message.content || '[]')
      }

      suggestions.push(...aiSuggestions)
    } catch (error) {
      console.warn('AI optimization suggestions failed:', error)
    }

    return suggestions
  }

  /**
   * Helper methods
   */
  private getCategoryKeywords(category: string, keywords: any): string[] {
    switch (category) {
      case 'TECHNICAL_SKILLS':
        return keywords.technical
      case 'SOFT_SKILLS':
        return keywords.soft
      case 'EXPERIENCE':
        return keywords.primary.filter(k => 
          /years|experience|senior|junior|lead|manager|director/.test(k)
        )
      case 'EDUCATION':
        return keywords.primary.filter(k => 
          /degree|bachelor|master|phd|certification|diploma/.test(k)
        )
      default:
        return []
    }
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
