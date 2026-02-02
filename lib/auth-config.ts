import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { ENV_CONFIG } from './env-config'
import { findUserByEmail, validatePassword } from './auth-helpers'
import { clientPromise } from '@/lib/mongodb-adapter'

// MongoDB-powered authentication configuration
export const authConfig: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 AUTHORIZATION STARTED')
        console.log('📧 Email provided:', credentials?.email)
        console.log('🔑 Password provided length:', credentials?.password?.length)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }
        
        // First find the user
        console.log('👤 Looking up user...')
        const user = await findUserByEmail(credentials.email)
        console.log('👤 User found:', !!user)
        
        if (!user) {
          console.log('❌ User not found in database')
          return null
        }
        
        console.log('🔍 User data:', {
          id: user._id,
          email: user.email,
          name: user.name,
          hasPassword: !!user.password,
          passwordLength: user.password?.length
        })
        
        // Then validate password
        console.log('🔐 Validating password...')
        const isValid = await validatePassword(credentials.email, credentials.password)
        console.log('🔐 Password validation result:', isValid)
        
        if (!isValid) {
          console.log('❌ Password validation failed')
          return null
        }
        
        console.log('✅ Authentication successful!')
        return {
          id: user._id?.toString() || '',
          email: user.email,
          name: user.name,
          image: user.avatar_url || undefined,
          role: 'user',
          avatar_url: user.avatar_url || undefined
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    verifyRequest: '/verify-email'
  },
  session: {
    strategy: 'jwt',
    maxAge: ENV_CONFIG.TIMEOUTS.AUTH_SESSION,
    updateAge: 60 * 60 * 24 // Update session every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Cross-device access: secure cookies only in production
  useSecureCookies: process.env.NODE_ENV === 'production'
}

// Alias for backward compatibility
export const authOptions = authConfig
