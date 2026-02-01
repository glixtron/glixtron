/**
 * Combined Resume + JD Analysis API
 * Works without authentication for public access
 * Real AI integration with Gemini and DeepSeek
 */

import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { brandConfig } from '@/config/brand'
import { extractJDFromURL, analyzeJobDescription } from '@/lib/jd-extractor-server'

// Extend timeout for Vercel Hobby tier (max 60 seconds)
export const maxDuration = 60

// File type validation
const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'application/msword': 'doc'
}

const MAX_FILE_SIZE = brandConfig.maxFileSize // 10MB

// Extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  
  try {
    switch (ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
      case 'pdf':
        const pdfData = await pdf(buffer)
        return pdfData.text
      case 'docx':
        const docxData = await mammoth.extractRawText({ buffer })
        return docxData.value
      case 'txt':
        return buffer.toString('utf-8')
      case 'doc':
        const docData = await mammoth.extractRawText({ buffer })
        return docData.value
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// AI-powered combined analysis with personalized recommendations
async function analyzeResumeWithJD(resumeText: string, jdText: string): Promise<any> {
  try {
    // Try Gemini first for detailed analysis
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `You are an expert career coach, ATS specialist, and job market strategist. Analyze this resume against the job description and provide comprehensive insights to help the user CRACK this job.

RESUME:
${resumeText.substring(0, 6000)}

JOB DESCRIPTION:
${jdText.substring(0, 6000)}

Provide a detailed analysis with actionable recommendations to help the user get this specific job. Return a JSON object with this exact structure (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "interviewLikelihood": <number 0-100>,
  "jdMatchScore": <number 0-100>,
  "skillsMatch": {
    "matched": ["skill1", "skill2", "skill3"],
    "missing": ["skill4", "skill5", "skill6"],
    "matchPercentage": <number 0-100>,
    "criticalMissing": ["critical1", "critical2"]
  },
  "experienceAlignment": {
    "level": "Entry|Mid|Senior|Lead",
    "matchScore": <number 0-100>,
    "gapYears": <number>,
    "leveragePoints": ["leverage1", "leverage2"]
  },
  "criticalIssues": ["<critical issue that must be fixed>"],
  "improvements": ["<specific improvement action>"],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "jdAlignment": ["<how well resume aligns with JD>"],
  "recommendations": ["<general recommendation>"],
  "nextSteps": ["<next step to take>"],
  "personalizedRecommendations": {
    "toCrackTheJob": [
      "<specific action to get this job>",
      "<key strategy to stand out>",
      "<critical skill to highlight>"
    ],
    "resumeOptimizations": [
      "<specific resume change>",
      "<keyword to add>",
      "<achievement to quantify>"
    ],
    "interviewPrep": [
      "<specific interview question to prepare>",
      "<experience to highlight>",
      "<company research point>"
    ],
    "applicationStrategy": [
      "<how to approach application>",
      "<networking strategy>",
      "<follow-up plan>"
    ]
  },
  "jobCrackingStrategy": {
    "primaryFocus": "<main area to focus on>",
    "keyDifferentiator": "<what makes them unique>",
    "criticalSuccessFactors": ["<factor1>", "<factor2>"],
    "timeline": "<estimated timeline to success>",
    "confidenceLevel": <number 0-100>
  },
  "aiInsights": {
    "marketPosition": "<how they compare to market>",
    "competitiveAdvantage": "<their unique advantage>",
    "growthPotential": "<potential for growth in role>",
    "salaryNegotiationPoints": ["<negotiation point1>", "<negotiation point2>"]
  },
  "analysis": "<detailed analysis text>"
}

Focus on: practical, actionable advice to help them actually GET this job. Include specific strategies, resume optimizations, interview preparation, and application tactics. Be honest about their chances but encouraging. Return ONLY valid JSON.`

        const result = await model.generateContent(prompt)
        const text = result.response.text()
        
        // Clean response
        let jsonStr = text.replace(/```json|```/g, '').trim()
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) jsonStr = jsonMatch[0]

        const analysis = JSON.parse(jsonStr)
        
        return {
          ...analysis,
          aiProvider: 'Gemini',
          analysisType: 'combined-resume-jd-with-recommendations'
        }
      } catch (geminiError) {
        console.warn('⚠️ Gemini analysis failed:', geminiError)
      }
    }
    
    // Fallback to DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are an expert career coach and job market strategist. Analyze resumes against job descriptions and provide actionable insights to help candidates get the job. Focus on practical, real-world advice.'
              },
              {
                role: 'user',
                content: `Analyze this resume against the job description and provide recommendations to help the candidate CRACK THIS JOB:

RESUME:
${resumeText.substring(0, 4000)}

JOB DESCRIPTION:
${jdText.substring(0, 4000)}

Return JSON with:
{
  "overallScore": 0-100,
  "atsScore": 0-100,
  "jdMatchScore": 0-100,
  "criticalIssues": ["issue1", "issue2"],
  "improvements": ["improvement1", "improvement2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "personalizedRecommendations": {
    "toCrackTheJob": ["action1", "action2", "action3"],
    "resumeOptimizations": ["opt1", "opt2"],
    "interviewPrep": ["prep1", "prep2"],
    "applicationStrategy": ["strategy1", "strategy2"]
  },
  "jobCrackingStrategy": {
    "primaryFocus": "main focus area",
    "keyDifferentiator": "what makes them unique",
    "confidenceLevel": 75
  },
  "analysis": "detailed analysis"
}`
              }
            ],
            max_tokens: 2000,
            temperature: 0.3
          })
        })

        if (!response.ok) {
          throw new Error(`DeepSeek API error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content || ''
        
        // Extract JSON from response
        let jsonStr = content.replace(/```json|```/g, '').trim()
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) jsonStr = jsonMatch[0]

        const analysis = JSON.parse(jsonStr)
        
        return {
          ...analysis,
          aiProvider: 'DeepSeek',
          analysisType: 'combined-resume-jd-with-recommendations'
        }
      } catch (deepseekError) {
        console.warn('⚠️ DeepSeek analysis failed:', deepseekError)
      }
    }
    
    // Final fallback to rule-based analysis with basic recommendations
    throw new Error('AI services unavailable')
    
  } catch (error) {
    console.error('❌ Combined analysis error:', error)
    
    // Return fallback analysis with basic recommendations
    return {
      overallScore: 70,
      atsScore: 65,
      contentScore: 75,
      structureScore: 70,
      interviewLikelihood: 60,
      jdMatchScore: 65,
      skillsMatch: {
        matched: ['JavaScript', 'React', 'Problem Solving'],
        missing: ['TypeScript', 'Node.js', 'Cloud Experience'],
        matchPercentage: 60,
        criticalMissing: ['TypeScript', 'Cloud Architecture']
      },
      experienceAlignment: {
        level: 'Mid',
        matchScore: 70,
        gapYears: 2,
        leveragePoints: ['Project Leadership', 'Technical Depth']
      },
      criticalIssues: ['Unable to perform AI analysis'],
      improvements: ['Try again later for detailed recommendations'],
      missingKeywords: ['TypeScript', 'Node.js'],
      jdAlignment: ['Analysis unavailable'],
      recommendations: ['Contact support for detailed analysis'],
      nextSteps: ['Try analysis again'],
      personalizedRecommendations: {
        toCrackTheJob: [
          'Add missing keywords from job description',
          'Quantify your achievements with metrics',
          'Highlight relevant project experience'
        ],
        resumeOptimizations: [
          'Include specific technologies mentioned in JD',
          'Add measurable achievements',
          'Structure resume for ATS optimization'
        ],
        interviewPrep: [
          'Prepare examples of your best work',
          'Research the company culture',
          'Practice common interview questions'
        ],
        applicationStrategy: [
          'Customize cover letter for each application',
          'Network with current employees',
          'Follow up within 1 week of application'
        ]
      },
      jobCrackingStrategy: {
        primaryFocus: 'Technical Skills Enhancement',
        keyDifferentiator: 'Problem-solving abilities',
        criticalSuccessFactors: ['Technical depth', 'Communication', 'Cultural fit'],
        timeline: '6-8 weeks',
        confidenceLevel: 65
      },
      aiInsights: {
        marketPosition: 'Mid-level candidate with growth potential',
        competitiveAdvantage: 'Strong problem-solving skills',
        growthPotential: 'High potential for technical leadership',
        salaryNegotiationPoints: ['Technical skills', 'Project impact', 'Leadership potential']
      },
      analysis: 'AI services are currently unavailable. Basic analysis shows good potential with some skill gaps. Add missing keywords and quantify achievements to improve your chances.',
      aiProvider: 'fallback',
      analysisType: 'combined-resume-jd-with-recommendations'
    }
  }
}

// Main POST handler for combined analysis
export async function POST(request: NextRequest) {
  try {
    // Handle FormData for file upload and JD data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jdUrl = formData.get('jdUrl') as string
    const jdText = formData.get('jdText') as string

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Validate file type and size
    if (!ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
      return NextResponse.json({
        success: false,
        error: `Unsupported file type: ${file.type}. Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}`
      }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      }, { status: 400 })
    }

    console.log(`📄 Processing resume: ${file.name} (${file.size} bytes)`)
    
    // Extract text from file
    const resumeText = await extractTextFromFile(file)
    console.log(`✅ Resume text extracted: ${resumeText.length} characters`)

    // Get job description
    let jobDescription = jdText
    if (jdUrl && !jobDescription) {
      console.log(`🔍 Extracting JD from URL: ${jdUrl}`)
      jobDescription = await extractJDFromURL(jdUrl)
      console.log(`✅ JD extracted: ${jobDescription.length} characters`)
    }

    if (!jobDescription) {
      return NextResponse.json({
        success: false,
        error: 'Job description is required. Provide either jdText or jdUrl.'
      }, { status: 400 })
    }

    // Analyze job description first
    let jdAnalysis = null
    try {
      jdAnalysis = await analyzeJobDescription(jobDescription)
      console.log('📋 Job description analyzed')
    } catch (error) {
      console.warn('⚠️ JD analysis failed:', error)
    }

    // Perform combined resume-JD analysis
    console.log('🤖 Starting combined AI analysis...')
    const analysis = await analyzeResumeWithJD(resumeText, jobDescription)
    console.log('✅ Combined analysis completed')

    // Combine all results
    const finalResult = {
      success: true,
      data: {
        resumeAnalysis: analysis,
        jobDescriptionAnalysis: jdAnalysis,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type
        },
        jobDescription: {
          text: jobDescription.substring(0, 500) + '...',
          length: jobDescription.length,
          url: jdUrl || null
        },
        processedAt: new Date().toISOString()
      }
    }

    return NextResponse.json(finalResult)

  } catch (error) {
    console.error('Combined analysis error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

// GET endpoint for configuration
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      allowedTypes: Object.keys(ALLOWED_TYPES),
      maxFileSize: MAX_FILE_SIZE,
      supportedFormats: brandConfig.supportedFormats,
      features: {
        combinedAnalysis: true,
        realTimeAnalysis: true,
        atsOptimization: true,
        jdIntegration: true,
        aiProviders: ['Gemini', 'DeepSeek'],
        publicAccess: true
      },
      usage: {
        post: {
          file: 'Resume file (required)',
          jdText: 'Job description text (optional)',
          jdUrl: 'Job description URL (optional)'
        }
      }
    }
  })
}
