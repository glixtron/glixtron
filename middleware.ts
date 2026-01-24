export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/resume-scanner/:path*', '/profile/:path*']
}
