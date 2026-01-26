import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ENV_CONFIG } from './env-config'

// Real Supabase client for production use
const supabaseUrl = ENV_CONFIG.SUPABASE_URL
const supabaseAnonKey = ENV_CONFIG.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // Ignore SSL certificate issues in development
        // @ts-ignore
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      })
    }
  }
})

// Database types
export interface DatabaseUser {
  id: string
  email: string
  name: string
  email_verified: boolean
  created_at: string
  updated_at: string
  provider?: 'email' | 'google' | 'github'
  avatar_url?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  social_links?: {
    linkedin?: string
    github?: string
    twitter?: string
    portfolio?: string
    behance?: string
    dribbble?: string
  }
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: boolean
    email_updates?: boolean
  }
}

// User profile functions
export async function createSupabaseUser(userData: {
  email: string
  name: string
  password?: string
  provider?: 'email' | 'google' | 'github'
  avatar_url?: string
}) {
  try {
    // First create auth user if password is provided
    if (userData.password && userData.provider === 'email') {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            provider: 'email'
          }
        }
      })

      if (authError) {
        throw new Error(`Auth error: ${authError.message}`)
      }

      // Wait a moment for auth to be created
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(), // Generate UUID for profile
        email: userData.email,
        name: userData.name,
        email_verified: false, // Will be verified via email
        provider: userData.provider || 'email',
        avatar_url: userData.avatar_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      throw new Error(`Profile error: ${profileError.message}`)
    }

    return profileData
  } catch (error) {
    console.error('Error creating Supabase user:', error)
    throw error
  }
}

export async function findSupabaseUserByEmail(email: string): Promise<DatabaseUser | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error finding user:', error)
    return null
  }
}

export async function validateSupabaseUser(email: string, password: string): Promise<DatabaseUser | null> {
  try {
    // First authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return null
    }

    // Then get user profile from database
    const userProfile = await findSupabaseUserByEmail(email)
    
    if (!userProfile) {
      // Create profile if it doesn't exist (for existing auth users)
      const newProfile = await createSupabaseUser({
        email,
        name: authData.user.user_metadata?.name || email.split('@')[0],
        provider: 'email'
      })
      return newProfile
    }

    // Update email verification status
    if (authData.user.email_confirmed_at && !userProfile.email_verified) {
      await supabase
        .from('users')
        .update({ 
          email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
      
      userProfile.email_verified = true
    }

    return userProfile
  } catch (error) {
    console.error('Error validating user:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<DatabaseUser>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Update error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export async function verifySupabaseEmail(email: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)

    return !error
  } catch (error) {
    console.error('Error verifying email:', error)
    return false
  }
}

export async function createOAuthUser(provider: 'google' | 'github', authData: any) {
  try {
    const existingUser = await findSupabaseUserByEmail(authData.email)
    
    if (existingUser) {
      // Update existing user with OAuth info
      return await updateUserProfile(existingUser.id, {
        provider,
        avatar_url: authData.avatar_url,
        email_verified: true // OAuth users are pre-verified
      })
    }

    // Create new user from OAuth
    return await createSupabaseUser({
      email: authData.email,
      name: authData.name || authData.email.split('@')[0],
      provider,
      avatar_url: authData.avatar_url
    })
  } catch (error) {
    console.error('Error creating OAuth user:', error)
    throw error
  }
}

// Initialize database tables
export async function initializeSupabaseTables() {
  try {
    // Check if users table exists
    const { data: tables, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (error && error.code === 'PGRST116') {
      console.log('Users table not found. Please create it manually in Supabase dashboard.')
      console.log(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          email_verified BOOLEAN DEFAULT FALSE,
          provider TEXT DEFAULT 'email',
          avatar_url TEXT,
          bio TEXT,
          location TEXT,
          phone TEXT,
          website TEXT,
          social_links JSONB,
          preferences JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_provider ON users(provider);
      `)
    }
  } catch (error) {
    console.error('Error initializing tables:', error)
  }
}

// Export the real Supabase client
export { supabase as realSupabase }
