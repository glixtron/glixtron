'use client'

import { useState, useEffect, useCallback } from 'react'

interface RoadmapMilestone {
  id: string
  milestone: string
  targetDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'pending' | 'in-progress' | 'completed'
  progressScore: number
  createdAt: string
  updatedAt: string
}

interface UseRealTimeRoadmapReturn {
  milestones: RoadmapMilestone[]
  isLoading: boolean
  error: string | null
  refreshRoadmap: () => Promise<void>
  addMilestone: (milestone: Omit<RoadmapMilestone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RoadmapMilestone>
  updateMilestone: (id: string, updates: Partial<RoadmapMilestone>) => Promise<void>
}

export function useRealTimeRoadmap(): UseRealTimeRoadmapReturn {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch roadmap data
  const refreshRoadmap = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/user/roadmap')
      if (!response.ok) {
        throw new Error('Failed to fetch roadmap data')
      }
      
      const data = await response.json()
      if (data.success && data.data) {
        setMilestones(data.data.milestones || [])
      }
    } catch (err) {
      console.error('Roadmap fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Add new milestone from AI response
  const addMilestone = useCallback(async (milestoneData: Omit<RoadmapMilestone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newMilestone: RoadmapMilestone = {
        ...milestoneData,
        id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Call API to save milestone
      const response = await fetch('/api/user/roadmap', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addMilestone',
          milestone: newMilestone
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save milestone')
      }

      // Update local state immediately for real-time feel
      setMilestones(prev => [...prev, newMilestone])
      
      return newMilestone
    } catch (err) {
      console.error('Add milestone error:', err)
      throw err
    }
  }, [])

  // Update existing milestone
  const updateMilestone = useCallback(async (id: string, updates: Partial<RoadmapMilestone>) => {
    try {
      const response = await fetch('/api/user/roadmap', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateMilestone',
          milestoneId: id,
          updates
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update milestone')
      }

      // Update local state immediately
      setMilestones(prev => 
        prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m)
      )
    } catch (err) {
      console.error('Update milestone error:', err)
      throw err
    }
  }, [])

  // Auto-refresh roadmap data
  useEffect(() => {
    refreshRoadmap()
    
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(refreshRoadmap, 30000)
    
    return () => clearInterval(interval)
  }, [refreshRoadmap])

  return {
    milestones,
    isLoading,
    error,
    refreshRoadmap,
    addMilestone,
    updateMilestone
  }
}

// Auto-update function for AI Chat integration
export function useAutoRoadmapUpdate() {
  const { addMilestone } = useRealTimeRoadmap()

  // Parse AI response and auto-update roadmap
  const processAIResponse = useCallback(async (aiResponse: string) => {
    try {
      // Look for ROADMAP_UPDATE JSON block in AI response
      const roadmapMatch = aiResponse.match(/ROADMAP_UPDATE:\s*({.*?})/m)
      if (roadmapMatch) {
        const roadmapData = JSON.parse(roadmapMatch[1])
        
        // Validate required fields
        if (roadmapData.milestone && roadmapData.targetDate) {
          const newMilestone = {
            milestone: roadmapData.milestone,
            targetDate: roadmapData.targetDate,
            priority: (roadmapData.priority || 'Medium') as 'High' | 'Medium' | 'Low',
            status: 'pending' as const,
            progressScore: roadmapData.progressScore || 0
          }
          
          // Add to roadmap in real-time
          await addMilestone(newMilestone)
          
          console.log('✅ Auto-updated roadmap with new milestone:', newMilestone)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Auto roadmap update error:', error)
      return false
    }
  }, [addMilestone])

  return { processAIResponse }
}

export default useRealTimeRoadmap
