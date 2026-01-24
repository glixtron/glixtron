/**
 * JD Extractor API Endpoint
 * Server-safe version using mock data
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractJDFromURL } from '@/lib/jd-extractor-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { 
          success: false,
          error: 'URL is required',
          message: 'Please provide a valid URL to extract job description from'
        },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid URL format',
          message: 'Please provide a valid URL (e.g., https://example.com/job-posting)'
        },
        { status: 400 }
      )
    }

    // Extract job description
    const jobDescription = await extractJDFromURL(url)

    return NextResponse.json({
      success: true,
      data: {
        url,
        jobDescription,
        extractedAt: new Date().toISOString(),
        length: jobDescription.length,
        mode: 'server-safe'
      },
      message: 'Job description extracted successfully (server-safe mode)'
    })

  } catch (error: any) {
    console.error('JD Extraction Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to extract job description',
        message: error.message || 'An error occurred while extracting the job description',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({
        success: true,
        message: 'JD Extractor API (Server-Safe Mode)',
        mode: 'server-safe',
        usage: {
          post: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              url: 'https://example.com/job-posting (required)'
            }
          }
        },
        examples: [
          {
            url: 'https://www.linkedin.com/jobs/view/123456789',
            description: 'LinkedIn job posting (mock data)'
          },
          {
            url: 'https://www.indeed.com/jobs?q=software+engineer',
            description: 'Indeed job search (mock data)'
          },
          {
            url: 'https://www.glassdoor.com/Job/software-engineer-123456.htm',
            description: 'Glassdoor job posting (mock data)'
          }
        ]
      })
    }

    // If URL is provided, extract JD from it
    if (url) {
      try {
        new URL(url)
        const jobDescription = await extractJDFromURL(url)
        
        return NextResponse.json({
          success: true,
          data: {
            url,
            jobDescription,
            extractedAt: new Date().toISOString(),
            length: jobDescription.length,
            mode: 'server-safe'
          },
          message: 'Job description extracted successfully (server-safe mode)'
        })
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: 'Failed to extract job description',
          message: error.message || 'An error occurred while extracting the job description'
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
