/**
 * Resume Analyzer API Endpoint
 * AI-powered resume analysis with real document processing and personalized context
 */

import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { brandConfig } from '@/config/brand'
import { getServerSession } from 'next-auth'
import { MongoClient } from 'mongodb'

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

// Industry-specific keyword databases
const INDUSTRY_KEYWORDS = {
  'Software Engineer': [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'aws', 'docker', 
    'kubernetes', 'git', 'agile', 'rest api', 'mongodb', 'postgresql', 'microservices'
  ],
  'Data Scientist': [
    'python', 'r', 'machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 
    'pandas', 'numpy', 'sql', 'tableau', 'power bi', 'statistics', 'deep learning'
  ],
  'Product Manager': [
    'product strategy', 'user research', 'agile', 'scrum', 'roadmap', 'kpi', 
    'analytics', 'stakeholder management', 'a/b testing', 'user stories', 'sprint'
  ],
  'Marketing Manager': [
    'digital marketing', 'seo', 'sem', 'content strategy', 'social media', 
    'analytics', 'campaign management', 'brand strategy', 'lead generation'
  ]
}

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
        // Legacy .doc support (limited)
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

// Context Aggregator - Fetch real user data
async function getUserContext(email: string) {
  const client = new MongoClient(process.env.MONGODB_URI!)
  try {
    await client.connect()
    const db = client.db()
    
    // Fetch user profile with career goals and skills
    const user = await db.collection('users').findOne(
      { email }, 
      { 
        projection: {
          targetRole: 1,
          skills: 1,
          experienceYears: 1,
          education: 1,
          careerGoals: 1,
          industry: 1,
          marketReadiness: 1,
          recentActivity: 1
        }
      }
    )
    
    // Fetch recent resume scans for context
    const recentScans = await db.collection('resume_scans')
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()
    
    return {
      user: user || {
        targetRole: 'Software Engineer',
        skills: [],
        experienceYears: 0,
        education: '',
        careerGoals: '',
        industry: 'Technology',
        marketReadiness: 50
      },
      recentScans,
      industryKeywords: INDUSTRY_KEYWORDS[user?.targetRole as keyof typeof INDUSTRY_KEYWORDS] || INDUSTRY_KEYWORDS['Software Engineer']
    }
  } finally {
    await client.close()
  }
}

// Keyword Analysis Engine
function analyzeKeywords(resumeText: string, targetKeywords: string[]) {
  const normalizedText = resumeText.toLowerCase()
  const foundKeywords: string[] = []
  const missingKeywords: string[] = []
  
  targetKeywords.forEach(keyword => {
    if (normalizedText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword)
    } else {
      missingKeywords.push(keyword)
    }
  })
  
  const keywordScore = Math.round((foundKeywords.length / targetKeywords.length) * 100)
  
  return {
    found: foundKeywords,
    missing: missingKeywords,
    score: keywordScore,
    total: targetKeywords.length
  }
}

// Enhanced AI analysis prompt with real user context
function createPersonalizedPrompt(resumeText: string, userContext: any) {
  const keywordAnalysis = analyzeKeywords(resumeText, userContext.industryKeywords)
  
  return `${brandConfig.ai.systemPrompt}

USER PROFILE:
- Target Role: ${userContext.user.targetRole}
- Experience Level: ${userContext.user.experienceYears} years
- Current Skills: ${userContext.user.skills.join(', ') || 'Not specified'}
- Career Goals: ${userContext.user.careerGoals || 'Not specified'}
- Market Readiness: ${userContext.user.marketReadiness}%
- Industry: ${userContext.user.industry}

KEYWORD ANALYSIS:
- Found Keywords (${keywordAnalysis.found.length}): ${keywordAnalysis.found.join(', ')}
- Missing Keywords (${keywordAnalysis.missing.length}): ${keywordAnalysis.missing.join(', ')}
- Keyword Match Score: ${keywordAnalysis.score}%

RESUME TEXT TO ANALYZE:
${resumeText}

TASK: Provide a comprehensive, personalized analysis that:
1. Addresses their specific target role (${userContext.user.targetRole})
2. Highlights how well their current skills match the industry requirements (${keywordAnalysis.score}% keyword match)
3. Identifies critical missing keywords and skills they should add
4. Provides specific, actionable advice for their experience level
5. References their career goals and market readiness
6. Suggests concrete next steps to reach their target role

Focus on ROI-driven advice that will actually help them land a ${userContext.user.targetRole} position.

Please respond in JSON format:
{
  "overallScore": 0-100,
  "atsScore": 0-100,
  "contentScore": 0-100,
  "structureScore": 0-100,
  "interviewLikelihood": 0-100,
  "criticalIssues": ["issue1", "issue2"],
  "improvements": ["improvement1", "improvement2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "analysis": "Detailed analysis text"
}`
}

// Enhanced AI service call with context and JD integration
async function callAIService(prompt: string, resumeText?: string, jdText?: string) {
  try {
    // If both resume and JD are provided, use Gemini for combined analysis
    if (resumeText && jdText && process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const combinedPrompt = `You are an expert career coach and ATS specialist. Analyze this resume against the job description.

RESUME:
${resumeText.substring(0, 6000)}

JOB DESCRIPTION:
${jdText.substring(0, 6000)}

${prompt}

Return a JSON object with this exact structure (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "interviewLikelihood": <number 0-100>,
  "jdMatchScore": <number 0-100>,
  "criticalIssues": ["<issue1>", "<issue2>"],
  "improvements": ["<improvement1>", "<improvement2>"],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "jdAlignment": ["<alignment1>", "<alignment2>"],
  "recommendations": ["<recommendation1>", "<recommendation2>"],
  "analysis": "<detailed analysis text>"
}

Focus on: resume-JD alignment, missing keywords from JD, experience match, ATS optimization, and concrete improvement actions. Return ONLY valid JSON.`

      const result = await model.generateContent(combinedPrompt)
      const response = await result.response.text()
      
      // Clean response
      let jsonStr = response.replace(/```json|```/g, '').trim()
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (jsonMatch) jsonStr = jsonMatch[0]

      return JSON.parse(jsonStr)
    }
    
    // Fallback to regular analysis
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    return response
  } catch (error) {
    console.error('AI service error:', error)
    throw new Error('AI service temporarily unavailable')
  }
}

// Parse AI response into structured data
function parseAIResponse(response: string) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback: Create structured response from text
    return {
      overallScore: 75,
      atsScore: 70,
      contentScore: 80,
      structureScore: 75,
      interviewLikelihood: 65,
      criticalIssues: ['Unable to parse AI response'],
      improvements: ['Please try again'],
      missingKeywords: [],
      recommendations: ['Contact support if issue persists'],
      analysis: response
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    return {
      overallScore: 50,
      atsScore: 50,
      contentScore: 50,
      structureScore: 50,
      interviewLikelihood: 50,
      criticalIssues: ['AI response parsing failed'],
      improvements: ['Please try again'],
      missingKeywords: [],
      recommendations: ['Contact support if issue persists'],
      analysis: response
    }
  }
}

// Main POST handler for file upload and analysis
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Handle FormData for file upload
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jobDescription = formData.get('jobDescription') as string

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
    console.log(`✅ Text extracted: ${resumeText.length} characters`)

    // Get user context for personalization
    const userContext = await getUserContext(session.user.email)
    console.log(`👤 User context loaded for: ${userContext.user.targetRole}`)

    // Perform keyword analysis
    const keywordAnalysis = analyzeKeywords(resumeText, userContext.industryKeywords)
    console.log(`🔍 Keyword analysis: ${keywordAnalysis.score}% match`)

    // Create personalized AI prompt
    const personalizedPrompt = createPersonalizedPrompt(resumeText, userContext)
    
    // Get AI analysis
    let aiAnalysis
    try {
      const aiResponse = await callAIService(personalizedPrompt, resumeText, jobDescription)
      aiAnalysis = parseAIResponse(aiResponse)
      console.log('🤖 AI analysis completed')
      
      // If JD was provided, add JD-specific analysis
      if (jobDescription && aiAnalysis.jdMatchScore !== undefined) {
        console.log(`📋 JD Match Score: ${aiAnalysis.jdMatchScore}%`)
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      aiAnalysis = {
        overallScore: 70,
        atsScore: keywordAnalysis.score,
        contentScore: 75,
        structureScore: 80,
        interviewLikelihood: 65,
        jdMatchScore: jobDescription ? 60 : undefined,
        criticalIssues: ['AI service temporarily unavailable'],
        improvements: ['Review keyword matches below'],
        missingKeywords: keywordAnalysis.missing,
        jdAlignment: jobDescription ? ['Unable to analyze JD alignment due to AI service issue'] : [],
        recommendations: ['Add missing keywords to improve ATS score'],
        analysis: 'AI service temporarily unavailable. Showing keyword-based analysis.'
      }
    }

    // Combine AI analysis with keyword analysis
    const finalAnalysis = {
      ...aiAnalysis,
      keywordAnalysis,
      userContext: {
        targetRole: userContext.user.targetRole,
        experienceYears: userContext.user.experienceYears,
        marketReadiness: userContext.user.marketReadiness
      },
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      processedAt: new Date().toISOString()
    }

    // Save analysis to database
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      await db.collection('resume_scans').insertOne({
        email: session.user.email,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        analysis: finalAnalysis,
        createdAt: new Date(),
        keywordScore: keywordAnalysis.score
      })
      
      console.log('💾 Analysis saved to database')
    } finally {
      await client.close()
    }

    return NextResponse.json({
      success: true,
      data: finalAnalysis
    })

  } catch (error) {
    console.error('Resume analysis error:', error)
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
        realTimeAnalysis: true,
        atsOptimization: true,
        keywordAnalysis: true,
        personalizedAnalysis: true,
        whiteLabelReports: true
      },
      brand: {
        name: brandConfig.name,
        tagline: brandConfig.tagline,
        primaryColor: brandConfig.colors.primary
      }
    }
  })
}
