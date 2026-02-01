import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MongoClient } from 'mongodb'

// Extend timeout for Vercel Hobby tier
export const maxDuration = 60

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    
    const db = client.db('glixtron')
    const users = db.collection('users')
    
    // Get user's resume data
    const user = await users.findOne({ email: session.user.email })
    const resumeData = user?.resume || null
    
    await client.close()
    
    if (!resumeData) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No resume found. Please upload your resume first.'
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        fileName: resumeData.fileName,
        fileType: resumeData.fileType,
        fileSize: resumeData.fileSize,
        analysis: resumeData.analysis,
        uploadedAt: resumeData.uploadedAt,
        lastAnalyzed: resumeData.lastAnalyzed,
        hasResume: true
      }
    })
    
  } catch (error) {
    console.error('Get resume error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch resume data'
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    
    const db = client.db('glixtron')
    const users = db.collection('users')
    
    // Remove user's resume data
    await users.updateOne(
      { email: session.user.email },
      { 
        $unset: { resume: 1 },
        $set: { updatedAt: new Date().toISOString() }
      }
    )
    
    await client.close()
    
    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete resume error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete resume'
    }, { status: 500 })
  }
}
