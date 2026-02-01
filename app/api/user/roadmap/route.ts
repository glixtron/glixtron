import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MongoClient } from 'mongodb'

// Extend timeout for Vercel Hobby tier
export const maxDuration = 60

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const { milestone, targetDate, priority, progressScore } = await request.json()

    // Validate required fields
    if (!milestone || !targetDate || !priority) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: milestone, targetDate, priority'
      }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Add the new milestone to the user's roadmap array
      const result = await db.collection('users').updateOne(
        { email: session.user.email },
        { 
          $push: { 
            roadmap: {
              id: new Date().getTime().toString(), // Simple ID generation
              milestone,
              targetDate,
              priority,
              status: 'pending',
              progressScore: progressScore || 25,
              createdAt: new Date(),
              updatedAt: new Date()
            } 
          } as any,
          // Update current roadmap state
          $set: {
            'roadmapState.currentMilestone': milestone,
            'roadmapState.targetDate': targetDate,
            'roadmapState.progressScore': progressScore || 25,
            'roadmapState.updatedAt': new Date()
          }
        },
        { upsert: true }
      )
      
      // Also save to roadmap history for analytics
      await db.collection('roadmap_history').insertOne({
        email: session.user.email,
        milestone,
        targetDate,
        priority,
        progressScore: progressScore || 25,
        source: 'ai_generated',
        createdAt: new Date()
      })
      
      console.log('✅ Roadmap milestone saved for user:', session.user.email)
      
      return NextResponse.json({
        success: true,
        data: {
          id: new Date().getTime().toString(),
          milestone,
          targetDate,
          priority,
          status: 'pending',
          progressScore: progressScore || 25
        }
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Roadmap Update Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Get user's roadmap
      const user = await db.collection('users').findOne(
        { email: session.user.email },
        { 
          projection: {
            'roadmap': 1
          }
        }
      )
      
      // Return roadmap data in the expected format
      const roadmapData = user?.roadmap || []
      
      return NextResponse.json({
        success: true,
        data: {
          milestones: Array.isArray(roadmapData) ? roadmapData : [],
          currentMilestone: 'Getting Started',
          targetDate: '6 months',
          progressScore: 25
        }
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Roadmap fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
