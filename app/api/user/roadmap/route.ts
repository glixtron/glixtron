import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MongoClient } from 'mongodb'

// Extend timeout for Vercel Hobby tier
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const body = await request.json()
    const { milestone, targetDate, progressScore } = body

    // Validate input
    if (!milestone || !targetDate || typeof progressScore !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'Invalid roadmap data'
      }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Update user's roadmap
      const result = await db.collection('users').updateOne(
        { email: session.user.email },
        { 
          $set: {
            'roadmap.currentMilestone': milestone,
            'roadmap.targetDate': targetDate,
            'roadmap.progressScore': progressScore,
            'roadmap.updatedAt': new Date()
          }
        },
        { upsert: true }
      )
      
      // Also save to roadmap history for analytics
      await db.collection('roadmap_updates').insertOne({
        email: session.user.email,
        milestone,
        targetDate,
        progressScore,
        updatedAt: new Date(),
        source: 'ai_advice'
      })
      
      console.log('✅ Roadmap updated for user:', session.user.email)
      
      return NextResponse.json({
        success: true,
        data: {
          milestone,
          targetDate,
          progressScore,
          updatedAt: new Date()
        }
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Roadmap update error:', error)
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
      
      return NextResponse.json({
        success: true,
        data: {
          roadmap: user?.roadmap || {
            currentMilestone: 'Getting Started',
            targetDate: '6 months',
            progressScore: 25
          }
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
