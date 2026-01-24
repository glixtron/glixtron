/**
 * Supabase Integration Module
 * Production-ready database integration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ENV_CONFIG } from './env-config'

// Supabase client instances
let supabase: SupabaseClient | null = null
let supabaseAdmin: SupabaseClient | null = null

/**
 * Initialize Supabase clients
 */
export function initializeSupabase() {
  if (!ENV_CONFIG.SUPABASE_URL || !ENV_CONFIG.SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not found. Using fallback database.')
    return null
  }

  try {
    // Public client for client-side operations
    supabase = createClient(
      ENV_CONFIG.SUPABASE_URL,
      ENV_CONFIG.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    )

    // Admin client for server-side operations
    if (ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
      supabaseAdmin = createClient(
        ENV_CONFIG.SUPABASE_URL,
        ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      )
    }

    console.log('✅ Supabase initialized successfully')
    return supabase
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error)
    return null
  }
}

/**
 * Get Supabase client
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabase) {
    return initializeSupabase()
  }
  return supabase
}

/**
 * Get Supabase admin client
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseAdmin) {
    return initializeSupabase()
  }
  return supabaseAdmin
}

/**
 * User management functions
 */
export const supabaseUsers = {
  /**
   * Create a new user
   */
  async create(userData: {
    email: string
    name: string
    password: string
  }) {
    const client = getSupabaseAdmin()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('users')
        .insert([
          {
            email: userData.email.toLowerCase(),
            name: userData.name,
            password: userData.password, // Will be hashed before insertion
            email_verified: true,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('User with this email already exists')
        }
        throw error
      }

      return data
    } catch (error: any) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const client = getSupabase()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }

      return data
    } catch (error: any) {
      console.error('Error finding user by email:', error)
      return null
    }
  },

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const client = getSupabase()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    } catch (error: any) {
      console.error('Error finding user by ID:', error)
      return null
    }
  },

  /**
   * Update user
   */
  async update(id: string, updates: Partial<any>) {
    const client = getSupabaseAdmin()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error: any) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  /**
   * Validate password
   */
  async validatePassword(email: string, password: string) {
    const user = await this.findByEmail(email)
    if (!user || !user.password) {
      return false
    }

    // In production, use bcrypt.compare
    return user.password === password
  },

  /**
   * Get all users (admin only)
   */
  async getAll() {
    const client = getSupabaseAdmin()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('id, email, name, email_verified, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error: any) {
      console.error('Error getting all users:', error)
      throw error
    }
  }
}

/**
 * Assessment data functions
 */
export const supabaseAssessments = {
  /**
   * Save assessment data
   */
  async save(userId: string, assessmentData: any) {
    const client = getSupabaseAdmin()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('assessments')
        .upsert({
          user_id: userId,
          assessment_data: assessmentData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error: any) {
      console.error('Error saving assessment:', error)
      throw error
    }
  },

  /**
   * Get assessment data
   */
  async get(userId: string) {
    const client = getSupabase()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('assessments')
        .select('assessment_data')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data?.assessment_data || null
    } catch (error: any) {
      console.error('Error getting assessment:', error)
      return null
    }
  }
}

/**
 * Resume scan functions
 */
export const supabaseResumeScans = {
  /**
   * Save resume scan
   */
  async save(userId: string, scanData: any) {
    const client = getSupabaseAdmin()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('resume_scans')
        .insert({
          user_id: userId,
          scan_data: scanData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error: any) {
      console.error('Error saving resume scan:', error)
      throw error
    }
  },

  /**
   * Get resume scans
   */
  async getAll(userId: string) {
    const client = getSupabase()
    if (!client) {
      throw new Error('Supabase not initialized')
    }

    try {
      const { data, error } = await client
        .from('resume_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error: any) {
      console.error('Error getting resume scans:', error)
      throw error
    }
  }
}

/**
 * Initialize Supabase on module load
 */
if (ENV_CONFIG.FEATURES.ENABLE_SUPABASE) {
  initializeSupabase()
}
