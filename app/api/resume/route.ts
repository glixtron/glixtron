import { NextRequest, NextResponse } from 'next/server'

// Mock resume scan data
let resumeScans = new Map()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File
    const action = formData.get('action') || 'upload'

    if (action === 'upload') {
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        )
      }

      // Validate file
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type' },
          { status: 400 }
        )
      }

      // Create resume record
      const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const resume = {
        id: resumeId,
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
        scans: []
      }

      resumeScans.set(resumeId, resume)

      return NextResponse.json({
        success: true,
        data: {
          resumeId,
          fileName: file.name,
          size: file.size,
          status: 'uploaded'
        },
        message: 'Resume uploaded successfully'
      })
    }

    if (action === 'scan') {
      const resumeId = formData.get('resumeId') as string
      
      if (!resumeId) {
        return NextResponse.json(
          { success: false, error: 'Resume ID required' },
          { status: 400 }
        )
      }

      const resume = resumeScans.get(resumeId)
      if (!resume) {
        return NextResponse.json(
          { success: false, error: 'Resume not found' },
          { status: 404 }
        )
      }

      // Create scan record
      const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const scan = {
        id: scanId,
        resumeId,
        status: 'scanning',
        startedAt: new Date().toISOString(),
        progress: 0
      }

      resume.scans.push(scan)
      resumeScans.set(resumeId, resume)

      // Simulate scanning process (in real app, this would be async)
      setTimeout(() => {
        const completedScan = {
          ...scan,
          status: 'completed',
          completedAt: new Date().toISOString(),
          progress: 100,
          results: {
            score: 87,
            atsScore: 92,
            sections: {
              contact: 95,
              experience: 88,
              education: 90,
              skills: 82
            },
            suggestions: [
              "Add more quantifiable achievements",
              "Include keywords for your target role",
              "Improve formatting for better ATS readability"
            ],
            keywords: ["Project Management", "Team Leadership", "Data Analysis"],
            issues: [
              { type: 'warning', message: 'Consider adding a professional summary' },
              { type: 'info', message: 'Good use of action verbs' }
            ]
          }
        }

        const updatedResume = resumeScans.get(resumeId)
        const scanIndex = updatedResume.scans.findIndex(s => s.id === scanId)
        updatedResume.scans[scanIndex] = completedScan
        updatedResume.status = 'scanned'
        resumeScans.set(resumeId, updatedResume)
      }, 3000)

      return NextResponse.json({
        success: true,
        data: {
          scanId,
          status: 'scanning',
          estimatedTime: '30 seconds'
        },
        message: 'Resume scan started'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Resume API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process resume' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('resumeId')
    const scanId = searchParams.get('scanId')

    if (scanId && resumeId) {
      // Get specific scan results
      const resume = resumeScans.get(resumeId)
      if (!resume) {
        return NextResponse.json(
          { success: false, error: 'Resume not found' },
          { status: 404 }
        )
      }

      const scan = resume.scans.find(s => s.id === scanId)
      if (!scan) {
        return NextResponse.json(
          { success: false, error: 'Scan not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: scan
      })
    }

    if (resumeId) {
      // Get resume with all scans
      const resume = resumeScans.get(resumeId)
      if (!resume) {
        return NextResponse.json(
          { success: false, error: 'Resume not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: resume
      })
    }

    // Get all resumes
    const allResumes = Array.from(resumeScans.values())
    
    return NextResponse.json({
      success: true,
      data: {
        resumes: allResumes,
        total: allResumes.length
      }
    })
  } catch (error) {
    console.error('Resume GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resume data' },
      { status: 500 }
    )
  }
}
