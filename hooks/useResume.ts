'use client'

import { useState, useEffect } from 'react'

interface ResumeData {
  fileName: string
  fileType: string
  fileSize: number
  analysis: {
    overallScore: number
    atsScore: number
    contentScore: number
    structureScore: number
    interviewLikelihood: number
    criticalIssues: string[]
    improvements: string[]
    missingKeywords: string[]
    recommendations: string[]
  }
  uploadedAt: string
  lastAnalyzed: string
  hasResume: boolean
}

interface UseResumeReturn {
  resumeData: ResumeData | null
  isLoading: boolean
  error: string | null
  hasResume: boolean
  refetch: () => Promise<void>
  deleteResume: () => Promise<void>
  uploadResume: (file: File) => Promise<any>
}

export function useResume(): UseResumeReturn {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResume = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/resume')
      const result = await response.json()
      
      if (result.success) {
        setResumeData(result.data)
      } else {
        setError(result.error || 'Failed to fetch resume')
      }
    } catch (err) {
      console.error('Resume fetch error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteResume = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/resume', {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setResumeData(null)
      } else {
        setError(result.error || 'Failed to delete resume')
      }
    } catch (err) {
      console.error('Resume delete error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadResume = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('resume', file)
      
      const response = await fetch('/api/resume/analyze-enhanced', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh resume data after successful upload
        await fetchResume()
        return result.data
      } else {
        setError(result.error || 'Failed to upload resume')
        throw new Error(result.error || 'Failed to upload resume')
      }
    } catch (err) {
      console.error('Resume upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [])

  return {
    resumeData,
    isLoading,
    error,
    hasResume: !!resumeData?.hasResume,
    refetch: fetchResume,
    deleteResume,
    uploadResume
  }
}

export default useResume
