/**
 * Database utilities for user data persistence
 * Production-ready implementation with API endpoints
 * Currently uses mock storage - replace with real database in production
 */

import type { UserData, ResumeScan, AssessmentData, Database } from './db-schema'

// Mock database storage (replace with real database)
const userDataStore: Map<string, UserData> = new Map()
const resumeScansStore: Map<string, ResumeScan> = new Map()
const assessmentStore: Map<string, AssessmentData> = new Map()
const resumeTextStore: Map<string, string> = new Map()

/**
 * Get user data from database
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  const data = userDataStore.get(userId)
  if (!data) {
    // Initialize user data if doesn't exist
    const newData: UserData = {
      userId,
      resumeScans: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    userDataStore.set(userId, newData)
    return newData
  }
  return data
}

/**
 * Save user data to database
 */
export async function saveUserData(userId: string, data: Partial<UserData>): Promise<UserData> {
  const existing = await getUserData(userId)
  
  const userData: UserData = {
    userId,
    ...existing,
    ...data,
    updatedAt: new Date(),
    createdAt: existing?.createdAt || new Date()
  }
  
  userDataStore.set(userId, userData)
  return userData
}

/**
 * Save resume scan to database
 */
export async function saveResumeScan(
  userId: string,
  scan: Omit<ResumeScan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<ResumeScan> {
  const resumeScan: ResumeScan = {
    ...scan,
    id: `scan_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  resumeScansStore.set(resumeScan.id, resumeScan)
  
  // Update user data
  const userData = await getUserData(userId)
  userData.resumeScans = [resumeScan, ...(userData.resumeScans || [])]
  userDataStore.set(userId, userData)
  
  return resumeScan
}

/**
 * Get resume scans for a user
 */
export async function getResumeScans(userId: string, limit: number = 50): Promise<ResumeScan[]> {
  const userData = await getUserData(userId)
  return (userData?.resumeScans || []).slice(0, limit)
}

/**
 * Get a specific resume scan by ID
 */
export async function getResumeScanById(id: string, userId: string): Promise<ResumeScan | null> {
  const scan = resumeScansStore.get(id)
  if (scan && scan.userId === userId) {
    return scan
  }
  return null
}

/**
 * Delete a resume scan
 */
export async function deleteResumeScan(id: string, userId: string): Promise<boolean> {
  const scan = resumeScansStore.get(id)
  if (scan && scan.userId === userId) {
    resumeScansStore.delete(id)
    
    // Update user data
    const userData = await getUserData(userId)
    userData.resumeScans = userData.resumeScans.filter(s => s.id !== id)
    userDataStore.set(userId, userData)
    
    return true
  }
  return false
}

/**
 * Save assessment data
 */
export async function saveAssessmentData(
  userId: string,
  assessment: Omit<AssessmentData, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<AssessmentData> {
  const assessmentData: AssessmentData = {
    ...assessment,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  assessmentStore.set(userId, assessmentData)
  
  // Update user data
  const userData = await getUserData(userId)
  userData.assessmentData = assessmentData
  userDataStore.set(userId, userData)
  
  return assessmentData
}

/**
 * Get assessment data for a user
 */
export async function getAssessmentData(userId: string): Promise<AssessmentData | null> {
  return assessmentStore.get(userId) || null
}

/**
 * Save resume text for a user
 */
export async function saveResumeText(userId: string, text: string): Promise<void> {
  resumeTextStore.set(userId, text)
  
  // Update user data
  const userData = await getUserData(userId)
  userData.savedResumeText = text
  userDataStore.set(userId, userData)
}

/**
 * Get saved resume text for a user
 */
export async function getResumeText(userId: string): Promise<string | null> {
  return resumeTextStore.get(userId) || null
}

/**
 * Get all user data (for API responses)
 */
export async function getAllUserData(userId: string): Promise<UserData | null> {
  const userData = await getUserData(userId)
  if (!userData) return null
  
  // Populate with all related data
  userData.assessmentData = await getAssessmentData(userId)
  userData.resumeScans = await getResumeScans(userId)
  userData.savedResumeText = await getResumeText(userId)
  
  return userData
}
