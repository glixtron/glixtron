import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const savedResumes = {
      success: true,
      data: [
        {
          id: '1',
          name: 'Software_Resume_2024.pdf',
          uploadDate: '2024-01-28',
          atsScore: 92,
          overallScore: 88,
          status: 'active',
          lastScanned: '2024-01-28',
          improvements: 5,
          applications: 12
        },
        {
          id: '2',
          name: 'Senior_Developer_Resume.pdf',
          uploadDate: '2024-01-15',
          atsScore: 85,
          overallScore: 82,
          status: 'active',
          lastScanned: '2024-01-20',
          improvements: 8,
          applications: 8
        },
        {
          id: '3',
          name: 'Tech_Lead_Resume.pdf',
          uploadDate: '2024-01-05',
          atsScore: 78,
          overallScore: 75,
          status: 'archived',
          lastScanned: '2024-01-10',
          improvements: 12,
          applications: 5
        }
      ]
    }

    return NextResponse.json(savedResumes)
  } catch (error) {
    console.error('Saved resumes error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load saved resumes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const resumeData = await request.json()

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: 'Resume data is required' },
        { status: 400 }
      )
    }

    // Simulate saving resume
    await new Promise(resolve => setTimeout(resolve, 1500))

    const savedResume = {
      success: true,
      data: {
        id: Date.now().toString(),
        ...resumeData,
        uploadDate: new Date().toISOString().split('T')[0],
        atsScore: resumeData.atsScore || 0,
        overallScore: resumeData.overallScore || 0,
        status: 'active',
        lastScanned: new Date().toISOString().split('T')[0],
        improvements: resumeData.improvements || 0,
        applications: 0
      }
    }

    return NextResponse.json(savedResume)
  } catch (error) {
    console.error('Save resume error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save resume' },
      { status: 500 }
    )
  }
}
