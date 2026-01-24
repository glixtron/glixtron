import { NextRequest, NextResponse } from 'next/server'
import { getAllUserData } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const userId = 'test-user-id'
    
    // Test database functions
    const userData = await getAllUserData(userId)
    
    return NextResponse.json({
      success: true,
      message: 'Database API test',
      userId,
      userData: userData,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
