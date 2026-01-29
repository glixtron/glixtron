import { NextRequest, NextResponse } from 'next/server'
import { User, connectDB } from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get all users (for debugging only - remove in production)
    const users = await User.findByEmail('test@example.com').catch(() => null)
    
    // If no test user, try to get first user
    let allUsers = []
    if (!users) {
      try {
        const clientPromise = await import('@/lib/mongodb')
        const client = await clientPromise.default
        const db = client.db('glixtronglobal_db_user')
        const collection = db.collection('users')
        allUsers = await collection.find({}).limit(5).toArray()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    
    return NextResponse.json({
      message: 'Debug endpoint - check user data',
      testUser: users,
      allUsersCount: allUsers.length,
      allUsers: allUsers.map(u => ({
        _id: u._id,
        email: u.email,
        name: u.name,
        hasPassword: !!u.password,
        passwordLength: u.password?.length,
        passwordStart: u.password?.substring(0, 10) + '...',
        createdAt: u.createdAt
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
