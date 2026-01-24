import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByEmail, validatePassword } from '@/lib/supabase-client'

// This will be replaced with Supabase functions when migrating
export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // Use Supabase for authentication
        const isValid = await validatePassword(credentials.email, credentials.password)
        if (!isValid) {
          return null
        }
        
        const user = await findUserByEmail(credentials.email)
        if (!user) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
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
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

// Supabase-ready configuration (for future migration)
export const supabaseAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // TODO: Replace with Supabase authentication
        // const { data: user, error } = await supabase
        //   .from('users')
        //   .select('*')
        //   .eq('email', credentials.email)
        //   .single()
        
        // if (error || !user) {
        //   return null
        // }
        
        // TODO: Replace with Supabase password verification
        // const isValid = await verifyPassword(credentials.password, user.password)
        
        // For now, use mock database
        const isValid = await validatePassword(credentials.email, credentials.password)
        if (!isValid) {
          return null
        }
        
        const user = await findUserByEmail(credentials.email)
        if (!user) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
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
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}
