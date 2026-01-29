import { NextRequest, NextResponse } from 'next/server'
import { clientPromise } from '@/lib/mongodb-adapter'
import bcrypt from 'bcryptjs'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    // Strict environment variable check
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables')
      return NextResponse.json(
        { 
          error: 'Database configuration error',
          details: 'MONGODB_URI environment variable is missing'
        },
        { status: 500 }
      )
    }
  },
  {
    rateLimit: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 registrations per 15 minutes
    logOperations: true
    // Return detailed error for debugging - EXPOSE RAW ERROR
    return NextResponse.json(
      { 
        error: error.message,  // Show actual error message
        message: error.message, // Also include in message field
        stack: error.stack,
        name: error.name,
        code: error.code,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint has been disabled',
    status: 'Please use the direct registration form at /register'
  })
}
