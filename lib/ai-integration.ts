/**
 * AI Integration Service - Gemini and OpenAI API Management
 * Handles AI model initialization, rate limiting, and fallback strategies
 */

// Type definitions for AI providers
export interface AIProvider {
  name: 'gemini' | 'openai'
  isAvailable: boolean
  model: string
  maxTokens: number
}

export interface AIResponse {
  content: string
  model: string
  provider: string
  tokensUsed?: number
  processingTime?: number
}

export interface AIAnalysisRequest {
  text: string
  context?: string
  industry?: string
  analysisType: 'keywords' | 'semantic' | 'optimization' | 'matching'
  maxTokens?: number
}

class AIIntegrationService {
  private providers: Map<string, AIProvider> = new Map()
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map()

  constructor() {
    this.initializeProviders()
  }

  /**
   * Initialize AI providers based on available API keys
   */
  private initializeProviders() {
    // Gemini AI
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (geminiApiKey) {
      this.providers.set('gemini', {
        name: 'gemini',
        isAvailable: true,
        model: 'gemini-pro',
        maxTokens: 2048
      })
    }

    // OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (openaiApiKey) {
      this.providers.set('openai', {
        name: 'openai',
        isAvailable: true,
        model: 'gpt-4',
        maxTokens: 4096
      })
    }

    console.log(`AI Providers initialized: ${Array.from(this.providers.keys()).join(', ')}`)
  }

  /**
   * Get available AI providers
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isAvailable)
  }

  /**
   * Check rate limit for provider
   */
  private checkRateLimit(provider: string): boolean {
    const limit = this.rateLimits.get(provider)
    if (!limit) return true

    const now = Date.now()
    if (now > limit.resetTime) {
      this.rateLimits.delete(provider)
      return true
    }

    return limit.count < 10 // 10 requests per minute
  }

  /**
   * Update rate limit for provider
   */
  private updateRateLimit(provider: string) {
    const limit = this.rateLimits.get(provider)
    const now = Date.now()

    if (!limit) {
      this.rateLimits.set(provider, {
        count: 1,
        resetTime: now + 60000 // 1 minute
      })
    } else {
      limit.count++
    }
  }

  /**
   * Generate content using available AI provider
   */
  async generateContent(request: AIAnalysisRequest): Promise<AIResponse> {
    const availableProviders = this.getAvailableProviders()
    
    if (availableProviders.length === 0) {
      throw new Error('No AI providers available. Please configure GEMINI_API_KEY or OPENAI_API_KEY')
    }

    // Try providers in order of preference
    for (const provider of availableProviders) {
      if (!this.checkRateLimit(provider.name)) {
        console.warn(`Rate limit exceeded for ${provider.name}`)
        continue
      }

      try {
        const response = await this.callProvider(provider, request)
        this.updateRateLimit(provider.name)
        return response
      } catch (error) {
        console.error(`Error calling ${provider.name}:`, error)
        continue
      }
    }

    throw new Error('All AI providers failed or are rate limited')
  }

  /**
   * Call specific AI provider
   */
  private async callProvider(provider: AIProvider, request: AIAnalysisRequest): Promise<AIResponse> {
    const startTime = Date.now()

    switch (provider.name) {
      case 'gemini':
        return await this.callGemini(provider, request, startTime)
      case 'openai':
        return await this.callOpenAI(provider, request, startTime)
      default:
        throw new Error(`Unknown provider: ${provider.name}`)
    }
  }

  /**
   * Call Gemini AI
   */
  private async callGemini(provider: AIProvider, request: AIAnalysisRequest, startTime: number): Promise<AIResponse> {
    try {
      // Dynamic import to avoid build issues
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      
      const geminiApiKey = process.env.GEMINI_API_KEY
      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured')
      }

      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({ model: provider.model })

      const prompt = this.buildPrompt(request)
      const result = await model.generateContent(prompt)
      const response = await result.response.text()

      return {
        content: response,
        model: provider.model,
        provider: provider.name,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error(`Gemini API failed: ${error}`)
    }
  }

  /**
   * Call OpenAI
   */
  private async callOpenAI(provider: AIProvider, request: AIAnalysisRequest, startTime: number): Promise<AIResponse> {
    try {
      // Dynamic import to avoid build issues
      const OpenAI = await import('openai').then(m => m.default)
      
      const openaiApiKey = process.env.OPENAI_API_KEY
      if (!openaiApiKey) {
        throw new Error('OPENAI_API_KEY not configured')
      }

      const openai = new OpenAI({ apiKey: openaiApiKey })
      
      const prompt = this.buildPrompt(request)
      const response = await openai.chat.completions.create({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: request.maxTokens || provider.maxTokens,
        temperature: 0.3
      })

      const content = response.choices[0]?.message?.content || ''
      
      return {
        content,
        model: provider.model,
        provider: provider.name,
        tokensUsed: response.usage?.total_tokens,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API failed: ${error}`)
    }
  }

  /**
   * Build prompt based on analysis type
   */
  private buildPrompt(request: AIAnalysisRequest): string {
    const { text, context, industry, analysisType } = request

    switch (analysisType) {
      case 'keywords':
        return `
        Extract and categorize keywords from this text for ATS optimization:

        Text: ${text}
        Context: ${context || 'Resume/Job Description'}
        Industry: ${industry || 'General'}

        Provide a JSON response with:
        {
          "primary": ["most important keywords"],
          "secondary": ["supporting keywords"],
          "technical": ["technical skills"],
          "soft": ["soft skills"],
          "action": ["action verbs"]
        }

        Focus on ATS-friendly terms and high-conversion keywords.
        `

      case 'semantic':
        return `
        Perform semantic analysis comparing these texts:

        Text 1: ${text}
        Text 2: ${context || ''}

        Industry: ${industry || 'General'}

        Provide JSON analysis:
        {
          "semanticSimilarity": 0-100,
          "skillAlignment": ["aligned skills"],
          "skillGaps": ["missing skills"],
          "toneMatch": "formal/casual/technical",
          "readabilityScore": 0-100,
          "recommendations": ["specific improvements"]
        }
        `

      case 'optimization':
        return `
        Provide optimization suggestions for this resume:

        Resume: ${text}
        Target Job Description: ${context || ''}
        Industry: ${industry || 'General'}

        Provide JSON with 5-7 specific suggestions:
        [
          {
            "type": "keyword|phrase|structure|metric",
            "original": "current text",
            "suggested": "improved version",
            "impact": "high|medium|low",
            "reason": "why this helps"
          }
        ]

        Focus on ATS optimization, keyword density, and impact.
        `

      case 'matching':
        return `
        Calculate match score between resume and job description:

        Resume: ${text}
        Job Description: ${context || ''}
        Industry: ${industry || 'General'}

        Provide JSON analysis:
        {
          "overallMatch": 0-100,
          "skillMatch": 0-100,
          "experienceMatch": 0-100,
          "educationMatch": 0-100,
          "keywordMatch": 0-100,
          "atsCompatibility": 0-100,
          "strengths": ["key strengths"],
          "weaknesses": ["areas to improve"],
          "recommendations": ["specific actions"]
        }
        `

      default:
        return `Analyze this text for ATS optimization: ${text}`
    }
  }

  /**
   * Batch processing for multiple requests
   */
  async batchGenerate(requests: AIAnalysisRequest[]): Promise<AIResponse[]> {
    const results: AIResponse[] = []
    const batchSize = 3 // Process 3 requests concurrently

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchPromises = batch.map(request => 
        this.generateContent(request).catch(error => ({
          content: `Error: ${error.message}`,
          model: 'error',
          provider: 'error',
          processingTime: 0
        }))
      )

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  /**
   * Health check for AI providers
   */
  async healthCheck(): Promise<{ provider: string; status: 'healthy' | 'error'; latency?: number }> {
    const results = []

    for (const provider of this.getAvailableProviders()) {
      try {
        const startTime = Date.now()
        await this.generateContent({
          text: 'Test message',
          analysisType: 'keywords',
          maxTokens: 10
        })
        const latency = Date.now() - startTime

        results.push({
          provider: provider.name,
          status: 'healthy' as const,
          latency
        })
      } catch (error) {
        results.push({
          provider: provider.name,
          status: 'error' as const
        })
      }
    }

    return results
  }
}

export const aiIntegration = new AIIntegrationService()
