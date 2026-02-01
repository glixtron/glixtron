/**
 * AI Providers - Gemini, DeepSeek, Firecrawl
 * Centralized AI integration for Glixtron
 */

// Firecrawl API for JD extraction
export async function firecrawlExtractJD(url: string): Promise<{ content: string; markdown?: string; metadata?: any }> {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured')
  }

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'raw'],
      onlyMainContent: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Firecrawl API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const content = data.data?.markdown || data.data?.rawHtml || data.data?.content || ''
  
  return {
    content: content,
    markdown: data.data?.markdown,
    metadata: data.data?.metadata
  }
}

// Gemini AI for resume vs JD analysis and suggestions
export async function geminiAnalyzeResumeJD(resumeText: string, jdText: string): Promise<{
  matchScore: number
  suggestions: Array<{ type: string; title: string; description: string; action: string; priority: number; expectedImpact: number }>
  hiringProbability: { current: number; optimized: number; improvement: number }
  keyFindings: string[]
}> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are an expert career coach and ATS specialist. Analyze the following resume against the job description.

RESUME:
${resumeText.substring(0, 6000)}

JOB DESCRIPTION:
${jdText.substring(0, 6000)}

Return a JSON object with this exact structure (no markdown, no code blocks):
{
  "matchScore": <number 0-100>,
  "hiringProbability": {
    "current": <number 0-100>,
    "optimized": <number 0-100>,
    "improvement": <number>
  },
  "keyFindings": [<array of 3-5 key observations>],
  "suggestions": [
    {
      "type": "critical" | "enhancement" | "optimization",
      "title": "<string>",
      "description": "<string>",
      "action": "<specific actionable step>",
      "priority": <1-5>,
      "expectedImpact": <number 0-20>
    }
  ]
}

Focus on: missing keywords, skill gaps, experience alignment, ATS optimization, and concrete improvement actions. Return ONLY valid JSON.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  
  // Clean response
  let jsonStr = text.replace(/```json|```/g, '').trim()
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (jsonMatch) jsonStr = jsonMatch[0]

  return JSON.parse(jsonStr)
}

// DeepSeek for career guidance and real-time analysis with secure bundle integration
import DeepSeekSecureBundle from '@/lib/deepseek-secure-bundle';

export async function deepseekCareerAnalysis(
  resumeText: string,
  assessmentData?: { coreSkills: string[]; softSkills: string[]; remotePreference: number; startupPreference: number }
): Promise<{
  careerMap: { shortTerm: string[]; midTerm: string[]; longTerm: string[] }
  recommendedRoles: Array<{ title: string; matchScore: number; description: string; skills: string[] }>
  skillGaps: string[]
  nextSteps: string[]
}> {
  try {
    // Create secure bundle with anonymized data
    const bundle = DeepSeekSecureBundle.createBundle(resumeText, assessmentData);
    
    // Send to DeepSeek and extract response
    const response = await DeepSeekSecureBundle.sendToDeepSeek(bundle);
    
    return {
      careerMap: response.extractedData.careerMap || { shortTerm: [], midTerm: [], longTerm: [] },
      recommendedRoles: (response.extractedData.recommendedRoles || []).map(role => ({
        title: role.title || 'Unknown Role',
        matchScore: role.matchScore || 0,
        description: role.description || 'No description available',
        skills: (role.skills || []).filter(Boolean)
      })),
      skillGaps: (response.extractedData.skillGaps || []).filter(Boolean),
      nextSteps: (response.extractedData.nextSteps || []).filter(Boolean)
    };
    
  } catch (error) {
    console.error('DeepSeek secure analysis error:', error);
    
    // Fallback response for debugging
    return {
      careerMap: {
        shortTerm: ['Update your resume with quantifiable achievements', 'Network with professionals in your field', 'Complete relevant certifications'],
        midTerm: ['Seek senior-level positions', 'Lead a project team', 'Mentor junior developers'],
        longTerm: ['Become a technical lead', 'Start your own consultancy', 'Join a C-suite role']
      },
      recommendedRoles: [
        {
          title: 'Senior Software Engineer',
          matchScore: 75,
          description: 'Your experience aligns well with senior roles',
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript']
        }
      ],
      skillGaps: ['Cloud architecture', 'System design', 'Team leadership'],
      nextSteps: ['Focus on system design patterns', 'Get AWS/Azure certification', 'Lead a small project']
    };
  }
}
