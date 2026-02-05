import { NextRequest, NextResponse } from 'next/server'

// Simple middleware - NO SECURITY CHECKS
export default async function middleware(request: NextRequest) {
  // Allow access to static files, API routes, and specific pages without auth
  const { pathname } = request.nextUrl
  
  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/register', '/terms', '/privacy', '/landing', '/home']
  
  // API routes (handled separately)
  const isApiRoute = pathname.startsWith('/api/')
  
  // Static assets
  const isStaticAsset = pathname.startsWith('/_next/') || 
                        pathname.includes('/favicon.ico') ||
                        pathname.includes('.')
  
  // Skip middleware for public routes, API routes, and static assets
  if (publicRoutes.includes(pathname) || isApiRoute || isStaticAsset) {
    return NextResponse.next()
  }
  
  // For all other routes, continue to app (no authentication required)
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match everything except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
