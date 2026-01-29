/**
 * Resume Analyzer API Endpoint
 * AI-powered resume analysis and job matching
 */

import { NextRequest, NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/resume-analyzer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resume, jobDescription } = body

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Both resume and job description are required',
          message: 'Please provide both resume text and job description'
        },
        { status: 400 }
      )
    }

    // Validate input length
    if (resume.length < 50) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Resume too short',
          message: 'Please provide a more detailed resume (at least 50 characters)'
        },
        { status: 400 }
      )
    }

    if (jobDescription.length < 50) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Job description too short',
          message: 'Please provide a more detailed job description (at least 50 characters)'
        },
        { status: 400 }
      )
    }

    console.log('📄 Starting resume analysis...')
    console.log('📊 Input sizes:', {
      resumeLength: resume.length,
      jobDescriptionLength: jobDescription.length
    })
    
    // Analyze resume against job description
    const analysis = await analyzeResume(resume, jobDescription)
    
    // Log the analysis (no data storage)
    console.log('✅ Resume analysis completed:', {
      matchScore: analysis.matchScore,
      skillMatches: analysis.skillsMatch?.matched?.length || 0,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        analyzedAt: new Date().toISOString(),
        resumeLength: resume.length,
        jobDescriptionLength: jobDescription.length
      },
      message: 'Resume analysis completed successfully'
    })

  } catch (error: any) {
    console.error('Resume Analysis Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze resume',
        message: error.message || 'An error occurred while analyzing the resume',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resume = searchParams.get('resume')
    const jobDescription = searchParams.get('jobDescription')

    if (!resume || !jobDescription) {
      return NextResponse.json({
        success: true,
        message: 'Resume Analyzer API',
        usage: {
          post: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              resume: 'Your resume text (required)',
              jobDescription: 'Job description text (required)'
            }
          }
        },
        examples: {
          resume: 'Experienced software developer with 5+ years in React, Node.js, and TypeScript...',
          jobDescription: 'Looking for a senior React developer with experience in Node.js and TypeScript...'
        },
        features: [
          'Skills matching and analysis',
          'Experience level comparison',
          'Keyword extraction and matching',
          'Match score calculation',
          'Detailed feedback and recommendations'
        ]
      })
    }

    // If both parameters are provided, analyze
    if (resume && jobDescription) {
      try {
        const analysis = await analyzeResume(resume, jobDescription)
        
        return NextResponse.json({
          success: true,
          data: {
            analysis,
            analyzedAt: new Date().toISOString(),
            resumeLength: resume.length,
            jobDescriptionLength: jobDescription.length
          },
          message: 'Resume analysis completed successfully'
        })
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: 'Failed to analyze resume',
          message: error.message || 'An error occurred while analyzing the resume'
        }, { status: 500 })
      }
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 })
  }
}
