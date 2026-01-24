/**
 * Database Schema Definitions
 * Production-ready structure for user data persistence
 */

export interface User {
  id: string
  email: string
  name: string
  passwordHash?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  provider: 'credentials'
  image?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  socialLinks?: {
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
    emailUpdates?: boolean
  }
}

export interface AssessmentData {
  userId: string
  coreSkills: string[]
  softSkills: string[]
  remotePreference: number // 0-100
  startupPreference: number // 0-100
  createdAt: Date
  updatedAt: Date
}

export interface ResumeScan {
  id: string
  userId: string
  resumeText: string
  jdText: string
  jdLink?: string
  analysis: any // ResumeAnalysis type
  matchScore: number
  createdAt: Date
  updatedAt: Date
}

export interface UserData {
  userId: string
  assessmentData?: AssessmentData
  resumeScans: ResumeScan[]
  savedResumeText?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Database operations interface
 * Implement this with your actual database (PostgreSQL, MongoDB, etc.)
 */
export interface Database {
  // User operations
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
  
  // Assessment operations
  saveAssessment(userId: string, assessment: Omit<AssessmentData, 'userId' | 'createdAt' | 'updatedAt'>): Promise<AssessmentData>
  getAssessment(userId: string): Promise<AssessmentData | null>
  
  // Resume scan operations
  createResumeScan(scan: Omit<ResumeScan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResumeScan>
  getResumeScans(userId: string, limit?: number): Promise<ResumeScan[]>
  getResumeScanById(id: string): Promise<ResumeScan | null>
  deleteResumeScan(id: string, userId: string): Promise<boolean>
  
  // User data operations
  saveResumeText(userId: string, text: string): Promise<void>
  getResumeText(userId: string): Promise<string | null>
}
