import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

let client: MongoClient
let db: Db
let resumeScansCollection: Collection

// Initialize MongoDB connection
const connectDB = async () => {
  try {
    const clientPromise = await import('@/lib/mongodb')
    client = await clientPromise.default
    db = client.db('glixtronglobal_db_user')
    resumeScansCollection = db.collection('resume_scans')
    console.log('✅ MongoDB connected for Resume Scans')
    return { client, db, resumeScansCollection }
  } catch (error) {
    console.error('❌ MongoDB connection failed for Resume Scans:', error)
    throw error
  }
}

// Resume Scan interface
export interface ResumeScan {
  _id?: string | ObjectId
  userId: string
  resumeText: string
  jdText: string
  jdLink?: string
  analysis: any
  matchScore: number
  createdAt?: Date
  updatedAt?: Date
}

// Resume Scan operations class
export class ResumeScanOperations {
  static async create(scanData: Omit<ResumeScan, '_id' | 'createdAt' | 'updatedAt'>): Promise<ResumeScan> {
    const { resumeScansCollection } = await connectDB()
    const now = new Date()
    const scanToInsert = {
      ...scanData,
      createdAt: now,
      updatedAt: now
    }
    
    const result = await resumeScansCollection.insertOne(scanToInsert)
    return {
      _id: result.insertedId,
      ...scanToInsert
    }
  }

  static async findByUserId(userId: string, limit: number = 50): Promise<ResumeScan[]> {
    const { resumeScansCollection } = await connectDB()
    const scans = await resumeScansCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    return scans as ResumeScan[]
  }

  static async deleteById(scanId: string, userId: string): Promise<boolean> {
    const { resumeScansCollection } = await connectDB()
    const result = await resumeScansCollection.deleteOne({
      _id: new ObjectId(scanId),
      userId: userId
    })
    return result.deletedCount > 0
  }
}

/**
 * GET /api/user/resume-scans
 * Get all resume scans for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const scans = await ResumeScanOperations.findByUserId(session.user.id, limit)
    
    return NextResponse.json({
      success: true,
      scans
    })
  } catch (error: any) {
    console.error('Error fetching resume scans:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resume scans' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/resume-scans
 * Save a new resume scan
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { resumeText, jdText, jdLink, analysis, matchScore } = body
    
    if (!resumeText || !jdText || !analysis) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const scan = await ResumeScanOperations.create({
      userId: session.user.id,
      resumeText,
      jdText,
      jdLink,
      analysis,
      matchScore: matchScore || 0
    })
    
    return NextResponse.json({
      success: true,
      scan
    })
  } catch (error: any) {
    console.error('Error saving resume scan:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save resume scan' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/resume-scans
 * Delete a resume scan
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const scanId = searchParams.get('id')
    
    if (!scanId) {
      return NextResponse.json(
        { error: 'Scan ID required' },
        { status: 400 }
      )
    }
    
    const deleted = await ResumeScanOperations.deleteById(scanId, session.user.id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Scan not found or unauthorized' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Scan deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting resume scan:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete resume scan' },
      { status: 500 }
    )
  }
}
