/**
 * Firecrawl JD Extraction API
 * Extracts job descriptions from URLs using Firecrawl
 */

import { NextRequest, NextResponse } from 'next/server'
import { firecrawlExtractJD } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!url.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const result = await firecrawlExtractJD(url)

    return NextResponse.json({
      success: true,
      content: result.content,
      markdown: result.markdown,
      metadata: result.metadata,
      extractedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Firecrawl JD extraction error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to extract job description',
      },
      { status: 500 }
    )
  }
}
