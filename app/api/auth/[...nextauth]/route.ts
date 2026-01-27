import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-config'

// Force dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

// Debug environment variables (relaxed for build)
console.log('🔍 NextAuth Environment Check:')
console.log('  - NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '⚠️ Missing (will check at runtime)')
console.log('  - NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '⚠️ Missing (will check at runtime)')

// Validate secret only in runtime production, not during build
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  console.error('❌ CRITICAL: NEXTAUTH_SECRET is required in production mode')
  throw new Error('NEXTAUTH_SECRET environment variable is required in production')
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
