import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-config'

// Force dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

// Only validate secret at runtime, not during build
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.argv.includes('build')

if (!isBuildTime && process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  console.error('❌ CRITICAL: NEXTAUTH_SECRET is required in production mode')
  throw new Error('NEXTAUTH_SECRET environment variable is required in production')
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
