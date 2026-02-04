import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

interface UserActivity {
  userId: string
  sessionId: string
  activities: Array<{
    id: string
    type: 'page_view' | 'feature_used' | 'assessment_completed' | 'resume_uploaded' | 'job_applied'
    timestamp: string
    page: string
    duration: number
    metadata: {
      device: string
      browser: string
      os: string
      location?: string
      referrer?: string
    }
  }>
  sessionData: {
    loginCount: number
    lastLogin: string
    sessionDuration: number
    deviceUsage: Record<string, number>
    featureUsage: Record<string, number>
    timeSpent: Record<string, number>
  }
  recommendations: {
    suggestedFeatures: string[]
    skillGaps: Array<{
      skill: string
      priority: 'high' | 'medium' | 'low'
      description: string
      resources: string[]
    }>
    careerInsights: {
      marketTrends: string[]
      skillDemand: Record<string, 'high' | 'medium' | 'low'>
      salaryInsights: {
        current: number
        potential: number
        growth: number
      }
    }
  }
}

interface ActivitySummary {
  totalSessions: number
  totalUsers: number
  activeUsers: number
  averageSessionDuration: number
  mostActiveHour: string
  mostUsedFeature: string
  topPages: Array<{
    page: string
    views: number
    avgDuration: number
  }>
  popularFeatures: Array<{
    feature: string
    usage: number
    trend: 'up' | 'down' | 'stable'
  }>
}

// GET user activity data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = session.user.id
    const timeframe = searchParams.get('timeframe') || '30d'
    const from = searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const to = searchParams.get('to') || new Date().toISOString()

    // In a real implementation, fetch from database
    const mockUserActivity: UserActivity = {
      userId,
      sessionId: 'session_' + Date.now(),
      activities: [
        {
          id: '1',
          type: 'page_view',
          timestamp: new Date().toISOString(),
          page: '/dashboard',
          duration: 120,
          metadata: {
            device: 'desktop',
            browser: 'Chrome',
            os: 'macOS',
            location: 'San Francisco'
          }
        },
        {
          id: '2',
          type: 'feature_used',
          timestamp: new Date().toISOString(),
          page: '/assessment',
          duration: 300,
          metadata: {
            device: 'desktop',
            browser: 'Chrome',
            os: 'macOS',
            location: 'San Francisco'
          }
        },
        {
          id: '3',
          type: 'resume_uploaded',
          timestamp: new Date().toISOString(),
          page: '/resume-scanner',
          duration: 180,
          metadata: {
            device: 'desktop',
            browser: 'Chrome',
            os: 'macOS',
            location: 'San Francisco'
          }
        }
      ],
      sessionData: {
        loginCount: 5,
        lastLogin: new Date().toISOString(),
        sessionDuration: 1800,
        deviceUsage: {
          desktop: 1200,
          mobile: 300,
          tablet: 150
        },
        featureUsage: {
          dashboard: 45,
          assessment: 30,
          'resume-scanner': 25
        },
        timeSpent: {
          dashboard: 450,
          assessment: 300,
          'resume-scanner': 180
        }
      },
      recommendations: {
        suggestedFeatures: ['career-guidance', 'jd-resume-match', 'interview-prep'],
        skillGaps: [
          {
            skill: 'System Design',
            priority: 'high',
            description: 'System design is crucial for senior positions',
            resources: ['System Design Interview Course', 'Design Patterns Book', 'Practice Projects']
          },
          {
            skill: 'DevOps',
            priority: 'medium',
            description: 'DevOps skills are essential for modern development workflows',
            resources: ['Docker Course', 'Kubernetes Tutorial', 'CI/CD Pipeline Setup']
          }
        ],
        careerInsights: {
          marketTrends: [
            'AI/ML skills are the fastest-growing area in tech',
            'Cloud computing continues to dominate enterprise infrastructure',
            'Remote work opportunities increasing by 40%'
          ],
          skillDemand: {
            'JavaScript': 'high',
            'React': 'high',
            'Python': 'high',
            'AWS': 'high',
            'Docker': 'high'
          },
          salaryInsights: {
            current: 120000,
            potential: 180000,
            growth: 15
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: mockUserActivity
    })
  } catch (error) {
    console.error('Failed to fetch user activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user activity' },
      { status: 500 }
    )
  }
}

// POST to track user activity
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    // Track user activity
    const activity: UserActivity = {
      userId: session.user.id,
      sessionId: 'session_' + Date.now(),
      activities: [
        {
          id: Date.now().toString(),
          type: type,
          timestamp: new Date().toISOString(),
          page: data.page || 'unknown',
          duration: data.duration || 0,
          metadata: {
            device: data.metadata?.device || 'desktop',
            browser: data.metadata?.browser || 'unknown',
            os: data.metadata?.os || 'unknown',
            location: data.metadata?.location || 'unknown'
          }
        }
      ],
      sessionData: {
        loginCount: 0,
        lastLogin: new Date().toISOString(),
        sessionDuration: 0,
        deviceUsage: {
          desktop: 0,
          mobile: 0,
          tablet: 0
        },
        featureUsage: {
          dashboard: 0,
          assessment: 0,
          'resume-scanner': 0
        },
        timeSpent: {
          dashboard: 0,
          assessment: 0,
          'resume-scanner': 0
        }
      },
      recommendations: {
        suggestedFeatures: [],
        skillGaps: [],
        careerInsights: {
          marketTrends: [],
          skillDemand: {},
          salaryInsights: {
            current: 0,
            potential: 0,
            growth: 0
          }
        }
      }
    }

    // In a real implementation, save to database
    console.log('Tracking activity:', activity)

    return NextResponse.json({
      success: true,
      data: activity
    })
  } catch (error) {
    console.error('Failed to track activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}
