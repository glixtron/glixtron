import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface MatchRequest {
  resumeText: string
  jdText: string
}

interface MatchResult {
  overallMatch: number
  skillsMatch: {
    matched: string[]
    missing: string[]
    additional: string[]
    score: number
  }
  experienceMatch: {
    required: string
    current: string
    match: boolean
    gap: string
  }
  suggestions: string[]
  improvements: string[]
  marketValue: {
    current: string
    potential: string
    gap: string
  }
  actionItems: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: MatchRequest = await request.json()
    const { resumeText, jdText } = body

    if (!resumeText || !jdText) {
      return NextResponse.json(
        { success: false, error: 'Resume and JD text are required' },
        { status: 400 }
      )
    }

    // Initialize Gemini AI
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('No Gemini API key found, using fallback analysis')
      return NextResponse.json({
        success: true,
        data: generateFallbackAnalysis(resumeText, jdText)
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
You are an expert HR analyst and career coach. Analyze the match between this resume and job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Provide a detailed analysis in this JSON format:
{
  "overallMatch": 85,
  "skillsMatch": {
    "matched": ["JavaScript", "React", "Node.js"],
    "missing": ["AWS", "Docker"],
    "additional": ["Python", "Machine Learning"],
    "score": 75
  },
  "experienceMatch": {
    "required": "5+ years",
    "current": "3 years",
    "match": false,
    "gap": "2 years of experience needed"
  },
  "suggestions": [
    "Highlight your React projects more prominently",
    "Add AWS certification to your resume",
    "Emphasize your leadership experience"
  ],
  "improvements": [
    "Gain 2 more years of experience",
    "Learn AWS and Docker",
    "Get cloud computing certification"
  ],
  "marketValue": {
    "current": "$85,000",
    "potential": "$120,000",
    "gap": "$35,000"
  },
  "actionItems": [
    "Enroll in AWS certification course",
    "Work on 2 more React projects",
    "Apply for mid-level positions to gain experience"
  ]
}

Focus on:
1. Extract ALL technical and soft skills from both documents
2. Calculate accurate match percentages
3. Identify specific experience gaps
4. Provide actionable suggestions for improvement
5. Estimate market value based on skills and experience
6. Give concrete action items to close the gap

Be realistic but encouraging in your analysis.
`

    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0])
        
        // Validate and sanitize the result
        const sanitizedResult: MatchResult = {
          overallMatch: Math.min(100, Math.max(0, analysisResult.overallMatch || 0)),
          skillsMatch: {
            matched: Array.isArray(analysisResult.skillsMatch?.matched) ? analysisResult.skillsMatch.matched : [],
            missing: Array.isArray(analysisResult.skillsMatch?.missing) ? analysisResult.skillsMatch.missing : [],
            additional: Array.isArray(analysisResult.skillsMatch?.additional) ? analysisResult.skillsMatch.additional : [],
            score: Math.min(100, Math.max(0, analysisResult.skillsMatch?.score || 0))
          },
          experienceMatch: {
            required: analysisResult.experienceMatch?.required || 'Not specified',
            current: analysisResult.experienceMatch?.current || 'Not specified',
            match: Boolean(analysisResult.experienceMatch?.match),
            gap: analysisResult.experienceMatch?.gap || 'Not specified'
          },
          suggestions: Array.isArray(analysisResult.suggestions) ? analysisResult.suggestions : [],
          improvements: Array.isArray(analysisResult.improvements) ? analysisResult.improvements : [],
          marketValue: {
            current: analysisResult.marketValue?.current || '$0',
            potential: analysisResult.marketValue?.potential || '$0',
            gap: analysisResult.marketValue?.gap || '$0'
          },
          actionItems: Array.isArray(analysisResult.actionItems) ? analysisResult.actionItems : []
        }

        return NextResponse.json({
          success: true,
          data: sanitizedResult
        })
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
    }

    // Fallback to rule-based analysis
    return NextResponse.json({
      success: true,
      data: generateFallbackAnalysis(resumeText, jdText)
    })

  } catch (error) {
    console.error('JD-Resume match analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze match' },
      { status: 500 }
    )
  }
}

function generateFallbackAnalysis(resumeText: string, jdText: string): MatchResult {
  // Extract skills using simple keyword matching
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices'
  ]

  const resumeSkills = commonSkills.filter(skill => 
    resumeText.toLowerCase().includes(skill.toLowerCase())
  )
  const jdSkills = commonSkills.filter(skill => 
    jdText.toLowerCase().includes(skill.toLowerCase())
  )

  const matched = resumeSkills.filter(skill => jdSkills.includes(skill))
  const missing = jdSkills.filter(skill => !resumeSkills.includes(skill))
  const additional = resumeSkills.filter(skill => !jdSkills.includes(skill))

  const skillsScore = jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 0

  // Extract experience using regex patterns
  const experiencePatterns = [
    /(\d+)\+?\s*years?/gi,
    /(\d+)\s*-\s*(\d+)\s*years?/gi
  ]

  let resumeExp = 'Not specified'
  let jdExp = 'Not specified'

  experiencePatterns.forEach(pattern => {
    const resumeMatch = resumeText.match(pattern)
    const jdMatch = jdText.match(pattern)
    
    if (resumeMatch) resumeExp = resumeMatch[0]
    if (jdMatch) jdExp = jdMatch[0]
  })

  const expMatch = resumeExp === jdExp || (resumeExp !== 'Not specified' && jdExp !== 'Not specified')

  // Calculate overall match
  const overallMatch = Math.round((skillsScore * 0.7) + (expMatch ? 30 : 0))

  return {
    overallMatch,
    skillsMatch: {
      matched,
      missing,
      additional,
      score: skillsScore
    },
    experienceMatch: {
      required: jdExp,
      current: resumeExp,
      match: expMatch,
      gap: expMatch ? 'Good match' : 'Experience gap detected'
    },
    suggestions: [
      'Highlight your strongest technical skills',
      'Quantify your achievements with metrics',
      'Tailor your resume to the job description',
      'Include relevant keywords from the JD'
    ],
    improvements: missing.length > 0 ? [
      ...missing.map(skill => `Learn ${skill}`),
      'Gain more experience in required areas',
      'Get relevant certifications'
    ] : ['Focus on showcasing existing skills better'],
    marketValue: {
      current: '$75,000',
      potential: '$95,000',
      gap: '$20,000'
    },
    actionItems: [
      'Update your resume with missing skills',
      'Apply for positions that match your current level',
      'Consider upskilling in high-demand areas'
    ]
  }
}
