import NextAuth from 'next-auth'
import { realAuthConfig } from '@/lib/auth-real'

const handler = NextAuth(realAuthConfig)

export { handler as GET, handler as POST }
