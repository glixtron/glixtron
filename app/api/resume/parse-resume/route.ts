import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { MongoClient } from 'mongodb'

// Extend timeout for Vercel Hobby tier (max 60 seconds)
export const maxDuration = 60

// File type validation
const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'application/msword': 'doc'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Extract text from different file types - Server-side only
async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  
  try {
    switch (file.type as keyof typeof ALLOWED_TYPES) {
      case 'application/pdf':
        const pdfData = await pdf(buffer)
        return pdfData.text
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer })
        return docxResult.value
        
      case 'text/plain':
        return buffer.toString('utf-8')
        
      case 'application/msword':
        throw new Error('Legacy .doc files are not yet supported. Please convert to .docx or PDF.')
        
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('resume') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No resume file provided'
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      }, { status: 400 })
    }

    // Validate file type
    if (!Object.keys(ALLOWED_TYPES).includes(file.type as string)) {
      return NextResponse.json({
        success: false,
        error: `Unsupported file type: ${file.type}. Supported types: ${Object.keys(ALLOWED_TYPES).join(', ')}`
      }, { status: 400 })
    }

    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file)
      
      // In a real implementation, you would:
      // 1. Parse the resume text using advanced NLP
      // 2. Extract skills, experience, education
      // 3. Generate analysis scores
      // 4. Save to database
      
      const analysisResult = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        extractedText: resumeText,
        analysis: {
          overallScore: 0,
          atsScore: 0,
          contentScore: 0,
          structureScore: 0,
          interviewLikelihood: 0,
          criticalIssues: [],
          improvements: [],
          missingKeywords: [],
          recommendations: []
        },
        uploadedAt: new Date().toISOString(),
        lastAnalyzed: new Date().toISOString(),
        hasResume: true
      }

      return NextResponse.json({
        success: true,
        data: analysisResult
      })

    } catch (error) {
      console.error('Resume parsing error:', error)
      return NextResponse.json({
        success: false,
        error: `Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 })
  }
}
