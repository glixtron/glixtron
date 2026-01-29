/**
 * MongoDB Diagnostic API
 * Helps diagnose and fix MongoDB connection issues
 */

import { NextRequest, NextResponse } from 'next/server'
import { runMongoDiagnostic, diagnoseMongoURI, generateCorrectURI, testMongoConnection } from '@/lib/mongodb-diagnostic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'diagnose'
    
    switch (action) {
      case 'diagnose':
        const diagnosticResult = await runMongoDiagnostic()
        return NextResponse.json({
          success: true,
          action: 'diagnose',
          data: diagnosticResult
        })
        
      case 'test':
        const uri = searchParams.get('uri')
        if (!uri) {
          return NextResponse.json({
            success: false,
            error: 'URI parameter is required for testing'
          }, { status: 400 })
        }
        
        const testResult = await testMongoConnection(uri)
        return NextResponse.json({
          success: true,
          action: 'test',
          data: testResult
        })
        
      case 'generate':
        const cluster = searchParams.get('cluster')
        const username = searchParams.get('username')
        const password = searchParams.get('password')
        const database = searchParams.get('database') || 'glixtron'
        
        if (!cluster || !username || !password) {
          return NextResponse.json({
            success: false,
            error: 'cluster, username, and password parameters are required'
          }, { status: 400 })
        }
        
        const correctURI = generateCorrectURI(cluster, username, password, database)
        return NextResponse.json({
          success: true,
          action: 'generate',
          data: {
            uri: correctURI,
            maskedURI: correctURI.replace(/:([^:@]+)@/, ':***@')
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['diagnose', 'test', 'generate']
        }, { status: 400 })
    }
    
  } catch (error: any) {
    console.error('MongoDB diagnostic error:', error)
    return NextResponse.json({
      success: false,
      error: 'Diagnostic failed',
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, uri } = body
    
    if (action === 'test' && uri) {
      const testResult = await testMongoConnection(uri)
      return NextResponse.json({
        success: true,
        action: 'test',
        data: testResult
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid request'
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('MongoDB diagnostic POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Diagnostic failed',
      message: error.message
    }, { status: 500 })
  }
}
