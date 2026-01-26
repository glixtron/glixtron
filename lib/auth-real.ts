import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { ENV_CONFIG } from './env-config'
import { findSupabaseUserByEmail, validateSupabaseUser, createSupabaseUser, createOAuthUser } from './supabase-real'

export const realAuthConfig: NextAuthOptions = {
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }
        
        try {
          // Validate user with Supabase
          const user = await validateSupabaseUser(credentials.email, credentials.password)
          
          if (!user) {
            throw new Error('Invalid email or password')
          }
          
          if (!user.email_verified) {
            throw new Error('Please verify your email before signing in')
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar_url,
            provider: user.provider
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    }),
    
    // Google OAuth Provider
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
    
    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    })
  ],
  
  callbacks: {
    // Handle OAuth sign-in
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Create or update user from OAuth
          const oauthUser = await createOAuthUser(
            account.provider as 'google' | 'github',
            {
              email: user.email!,
              name: user.name || user.email!.split('@')[0],
              avatar_url: user.image
            }
          )
          
          // Add user ID to the session
          user.id = oauthUser.id
          return true
        } catch (error) {
          console.error('OAuth sign-in error:', error)
          return false
        }
      }
      
      // For credentials provider, user is already validated
      return true
    },
    
    // JWT callback
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.provider = (user as any).provider || account?.provider
      }
      return token
    },
    
    // Session callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).provider = token.provider as string
      }
      return session
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/api/auth/error',
    verifyRequest: '/verify-email',
    newUser: '/welcome'
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: ENV_CONFIG.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development'
}
