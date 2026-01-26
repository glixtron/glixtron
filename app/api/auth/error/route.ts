import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/login'
  
  // Get the base URL
  const baseUrl = request.nextUrl.origin
  
  // Create error parameter
  const errorParam = error ? `?error=${encodeURIComponent(error)}` : ''
  
  // Create absolute URL for redirect
  const loginUrl = `${baseUrl}/login${errorParam}`
  
  return NextResponse.redirect(loginUrl)
}

export async function POST(request: NextRequest) {
  return GET(request)
}
