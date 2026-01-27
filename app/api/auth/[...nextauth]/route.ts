import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-config'

// Debug environment variables
console.log('🔍 NextAuth Environment Check:')
console.log('  - NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing')
console.log('  - NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ Missing')

// Validate secret in production
if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  console.error('❌ CRITICAL: NEXTAUTH_SECRET is required in production mode')
  throw new Error('NEXTAUTH_SECRET environment variable is required in production')
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
