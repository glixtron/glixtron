/**
 * Simple API Test Route
 * Used to verify API routing is working
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API routing is working!',
    timestamp: new Date().toISOString(),
    method: 'GET',
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      message: 'POST API routing is working!',
      timestamp: new Date().toISOString(),
      method: 'POST',
      body: body
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON',
      message: 'POST request requires valid JSON body'
    }, { status: 400 })
  }
}
