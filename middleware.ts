import { NextRequest, NextResponse } from 'next/server'

// Simple middleware - NO SECURITY CHECKS
export default async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match everything except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
