import { NextRequest, NextResponse } from 'next/server'
import { sharingSystem, createResumeShareLink, createJobShareLink, createAssessmentShareLink } from '@/lib/sharing-system'
import { serverManager } from '@/lib/server-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, config } = body

    let shareLink

    switch (type) {
      case 'resume':
        const { resumeId, jobTitle: resumeJobTitle } = config
        shareLink = createResumeShareLink(resumeId, resumeJobTitle)
        break

      case 'job':
        const { jobUrl, jobTitle: jobJobTitle, company } = config
        shareLink = createJobShareLink(jobUrl, jobJobTitle, company)
        break

      case 'assessment':
        const { assessmentType } = config
        shareLink = createAssessmentShareLink(assessmentType)
        break

      case 'custom':
        shareLink = sharingSystem.createShareLink(config)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid share type' },
          { status: 400 }
        )
    }

    // Get social media links
    const socialLinks = sharingSystem.generateSocialLinks(shareLink)
    
    // Get server URLs
    const serverUrls = sharingSystem.getServerUrls()

    return NextResponse.json({
      success: true,
      data: {
        shareLink,
        socialLinks,
        serverUrls,
        qrCode: sharingSystem.generateQRCode(shareLink)
      }
    })

  } catch (error: any) {
    console.error('Share creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'servers':
        const serverUrls = sharingSystem.getServerUrls()
        return NextResponse.json({
          success: true,
          data: {
            servers: serverUrls,
            current: serverManager.getCurrentServer()
          }
        })

      case 'analytics':
        const shareId = searchParams.get('shareId')
        if (!shareId) {
          return NextResponse.json(
            { error: 'Share ID is required' },
            { status: 400 }
          )
        }

        const analytics = sharingSystem.getAnalytics(shareId)
        return NextResponse.json({
          success: true,
          data: { analytics }
        })

      case 'system-analytics':
        const systemAnalytics = sharingSystem.getSystemAnalytics()
        return NextResponse.json({
          success: true,
          data: systemAnalytics
        })

      case 'cleanup':
        const cleaned = sharingSystem.cleanupExpiredLinks()
        return NextResponse.json({
          success: true,
          data: { cleaned }
        })

      default:
        return NextResponse.json({
          success: true,
          message: 'Glixtron Career Platform - AI-Powered Career Development',
          version: '2.0.0',
          features: [
            'Resume Analysis',
            'Job Matching',
            'Career Assessment',
            'Skill Development',
            'Multi-Region Support',
            'Real-time Analytics'
          ]
        })
    }

  } catch (error: any) {
    console.error('Share API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
