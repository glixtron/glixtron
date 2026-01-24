/**
 * Supabase Client Configuration
 * This file will be used when migrating to Supabase
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public Supabase client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin Supabase client (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// User types for Supabase
export interface SupabaseUser {
  id: string
  email: string
  name: string
  password?: string
  email_verified: boolean
  created_at: string
  updated_at: string
  image?: string
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

// Supabase user functions (ready for migration)
export class SupabaseUserManager {
  /**
   * Create a new user in Supabase
   */
  static async createUser(userData: {
    email: string
    name: string
    password: string
  }): Promise<SupabaseUser | null> {
    try {
      // TODO: Implement password hashing with bcrypt
      // const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{
          email: userData.email.toLowerCase(),
          name: userData.name.trim(),
          password: userData.password, // TODO: Use hashedPassword
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase create user error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Create user error:', error)
      return null
    }
  }

  /**
   * Find user by email in Supabase
   */
  static async findUserByEmail(email: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Supabase find user error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Find user error:', error)
      return null
    }
  }

  /**
   * Find user by ID in Supabase
   */
  static async findUserById(id: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Supabase find user by ID error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Find user by ID error:', error)
      return null
    }
  }

  /**
   * Update user in Supabase
   */
  static async updateUser(id: string, updates: Partial<SupabaseUser>): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update user error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Update user error:', error)
      return null
    }
  }

  /**
   * Get all users from Supabase (admin only)
   */
  static async getAllUsers(): Promise<SupabaseUser[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase get all users error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Get all users error:', error)
      return []
    }
  }

  /**
   * Validate password against Supabase user
   */
  static async validatePassword(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.findUserByEmail(email)
      if (!user || !user.password) {
        return false
      }

      // TODO: Implement bcrypt comparison
      // const isValid = await bcrypt.compare(password, user.password)
      // return isValid

      // For now, use simple comparison (replace with bcrypt)
      return user.password === password
    } catch (error) {
      console.error('Validate password error:', error)
      return false
    }
  }
}

// Export for easy migration
export const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getAllUsers,
  validatePassword
} = SupabaseUserManager
