/**
 * Supabase Client Configuration
 * Production-ready database connection
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

// Database types
export interface DatabaseUser {
  id: string
  email: string
  name: string
  password: string
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

export interface AssessmentData {
  id: string
  user_id: string
  core_skills: string[]
  soft_skills: string[]
  remote_preference: number
  startup_preference: number
  created_at: string
  updated_at: string
}

export interface ResumeScan {
  id: string
  user_id: string
  resume_text: string
  jd_text: string
  jd_link?: string
  analysis: any
  match_score: number
  created_at: string
  updated_at: string
}

export interface UserData {
  id: string
  user_id: string
  saved_resume_text?: string
  created_at: string
  updated_at: string
}

// Supabase database operations
export class SupabaseDatabase {
  // User operations
  static async createUser(userData: {
    email: string
    name: string
    password: string
  }): Promise<DatabaseUser | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{
          email: userData.email.toLowerCase(),
          name: userData.name.trim(),
          password: userData.password, // TODO: Hash this with bcrypt
          email_verified: true
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

  static async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
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

  static async findUserById(id: string): Promise<DatabaseUser | null> {
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

  static async updateUser(id: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
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

  static async getAllUsers(): Promise<DatabaseUser[]> {
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

  static async validatePassword(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.findUserByEmail(email)
      if (!user || !user.password) {
        return false
      }

      // TODO: Implement bcrypt comparison
      // For now, use simple comparison (replace with bcrypt)
      return user.password === password
    } catch (error) {
      console.error('Validate password error:', error)
      return false
    }
  }

  // Assessment operations
  static async saveAssessment(userId: string, assessment: {
    coreSkills: string[]
    softSkills: string[]
    remotePreference: number
    startupPreference: number
  }): Promise<AssessmentData | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('assessment_data')
        .upsert([{
          user_id: userId,
          core_skills: assessment.coreSkills,
          soft_skills: assessment.softSkills,
          remote_preference: assessment.remotePreference,
          startup_preference: assessment.startupPreference
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase save assessment error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Save assessment error:', error)
      return null
    }
  }

  static async getAssessment(userId: string): Promise<AssessmentData | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('assessment_data')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Supabase get assessment error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Get assessment error:', error)
      return null
    }
  }

  // Resume scan operations
  static async saveResumeScan(userId: string, scan: {
    resumeText: string
    jdText: string
    jdLink?: string
    analysis: any
    matchScore: number
  }): Promise<ResumeScan | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('resume_scans')
        .insert([{
          user_id: userId,
          resume_text: scan.resumeText,
          jd_text: scan.jdText,
          jd_link: scan.jdLink,
          analysis: scan.analysis,
          match_score: scan.matchScore
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase save resume scan error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Save resume scan error:', error)
      return null
    }
  }

  static async getResumeScans(userId: string, limit: number = 50): Promise<ResumeScan[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('resume_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Supabase get resume scans error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Get resume scans error:', error)
      return []
    }
  }

  static async deleteResumeScan(scanId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('resume_scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', userId)

      if (error) {
        console.error('Supabase delete resume scan error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete resume scan error:', error)
      return false
    }
  }

  // User data operations
  static async saveResumeText(userId: string, text: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('user_data')
        .upsert([{
          user_id: userId,
          saved_resume_text: text
        }])

      if (error) {
        console.error('Supabase save resume text error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Save resume text error:', error)
      return false
    }
  }

  static async getResumeText(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_data')
        .select('saved_resume_text')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Supabase get resume text error:', error)
        return null
      }

      return data?.saved_resume_text || null
    } catch (error) {
      console.error('Get resume text error:', error)
      return null
    }
  }

  static async getAllUserData(userId: string): Promise<{
    user: DatabaseUser | null
    assessment: AssessmentData | null
    resumeScans: ResumeScan[]
    savedResumeText: string | null
  }> {
    try {
      const [user, assessment, resumeScans, savedResumeText] = await Promise.all([
        this.findUserById(userId),
        this.getAssessment(userId),
        this.getResumeScans(userId),
        this.getResumeText(userId)
      ])

      return {
        user,
        assessment,
        resumeScans,
        savedResumeText
      }
    } catch (error) {
      console.error('Get all user data error:', error)
      return {
        user: null,
        assessment: null,
        resumeScans: [],
        savedResumeText: null
      }
    }
  }
}

// Export for easy use
export const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getAllUsers,
  validatePassword,
  saveAssessment,
  getAssessment,
  saveResumeScan,
  getResumeScans,
  deleteResumeScan,
  saveResumeText,
  getResumeText,
  getAllUserData
} = SupabaseDatabase
