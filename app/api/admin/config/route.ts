import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MongoClient } from 'mongodb'

// Extend timeout for Vercel Hobby tier
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admins can update brand settings
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // In production, you'd check if user is admin
    // For now, we'll allow any authenticated user for demo
    
    const config = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'primaryColor', 'aiName', 'aiInstruction']
    const missingFields = requiredFields.filter(field => !config[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Save brand configuration to settings collection
      const brandConfig = {
        ...config,
        colors: {
          primary: config.primaryColor,
          secondary: config.secondaryColor || '#8b5cf6',
          accent: config.accentColor || '#10b981',
          danger: config.dangerColor || '#ef4444',
          warning: config.warningColor || '#f59e0b',
          success: config.successColor || '#22c55e'
        },
        aiPersona: {
          name: config.aiName,
          style: config.aiStyle || 'Professional',
          instruction: config.aiInstruction,
          tone: config.aiTone || 'formal',
          communication: {
            greeting: config.aiGreeting || `Hello! I'm ${config.aiName}, your AI career advisor.`,
            signoff: config.aiSignoff || 'Best regards on your career journey!',
            encouragement: config.aiEncouragement || 'You\'re making great progress toward your goals.'
          }
        },
        updatedAt: new Date(),
        updatedBy: session.user.email
      }
      
      // Upsert to settings collection
      await db.collection('settings').updateOne(
        { type: 'brandConfig' },
        { 
          $set: brandConfig,
          $setOnInsert: { type: 'brandConfig', createdAt: new Date() }
        },
        { upsert: true }
      )
      
      console.log('✅ Brand configuration updated by:', session.user.email)
      
      return NextResponse.json({
        success: true,
        message: 'Brand configuration updated successfully',
        data: brandConfig
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Brand config update error:', error)
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
      
      // Get brand configuration from settings collection
      const brandConfig = await db.collection('settings').findOne({ type: 'brandConfig' })
      
      // Return saved config or default
      const config = brandConfig || {
        name: "Glixtron Pilot",
        primaryColor: "#3b82f6",
        aiName: "Aria",
        aiStyle: "Professional",
        aiInstruction: "You are an elite Silicon Valley recruiter. Be blunt about skill gaps but provide high-ROI solutions. Focus heavily on ATS optimization and salary negotiation.",
        aiTone: "formal"
      }
      
      return NextResponse.json({
        success: true,
        data: config
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Brand config fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
