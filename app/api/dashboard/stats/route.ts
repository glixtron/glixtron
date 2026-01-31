import { NextRequest, NextResponse } from 'next/server'

// Mock data - in a real app, this would come from a database
const mockStats = {
  careerProgress: "87%",
  careerTrend: "5% from last month",
  projectsCompleted: "12",
  projectTrend: "2 this week",
  marketReadiness: "78%",
  readinessTrend: "3% improvement",
  skillsMastered: "15/20",
  skillTrend: "3 new skills",
  jobMatches: "48",
  jobTrend: "12 new matches",
  skillPoints: 1234,
  trends: {
    careerProgress: { value: '5% from last month', isPositive: true },
    projectsCompleted: { value: '2 this week', isPositive: true },
    marketReadiness: { value: '3% improvement', isPositive: true },
    skillsMastered: { value: '3 new skills', isPositive: true },
    jobMatches: { value: '12 new matches', isPositive: true },
    skillPoints: { value: '150 earned', isPositive: true },
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: mockStats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different POST actions
    switch (body.action) {
      case 'refresh':
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1000))
        return NextResponse.json({
          success: true,
          data: mockStats,
          message: 'Stats refreshed successfully'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Dashboard stats POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
