'use client'

import { useState, useEffect } from 'react'
import { Target, Calendar, Clock, TrendingUp, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { SafeIcon, SafeComponent } from '@/components/SafetyWrapper'

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

interface RoadmapState {
  currentMilestone: string
  targetDate: string
  progressScore: number
  updatedAt: string
}

interface RoadmapWidgetProps {
  className?: string
}

export default function RoadmapWidget({ className = '' }: RoadmapWidgetProps) {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([])
  const [currentState, setCurrentState] = useState<RoadmapState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRoadmapData()
  }, [])

  const loadRoadmapData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/roadmap')
      
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.data.milestones || [])
        setCurrentState(data.data.currentState)
      } else {
        setError('Failed to load roadmap data')
      }
    } catch (error) {
      console.error('Error loading roadmap:', error)
      setError('Network error loading roadmap')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-400" />
      default: return <AlertCircle className="w-4 h-4 text-yellow-400" />
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <SafeComponent>
        <div className={`bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 ${className}`}>
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </SafeComponent>
    )
  }

  if (error) {
    return (
      <SafeComponent>
        <div className={`bg-red-500/10 border border-red-500/30 rounded-xl p-6 ${className}`}>
          <div className="flex items-center space-x-3">
            <SafeIcon icon={AlertCircle} className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      </SafeComponent>
    )
  }

  return (
    <SafeComponent>
      <div className={`bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={Target} className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Career Roadmap</h3>
          </div>
          <button
            onClick={loadRoadmapData}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={AlertCircle} className="w-4 h-4" />
          </button>
        </div>

        {/* Current Progress */}
        {currentState && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-medium">Current Progress</span>
              <span className="text-white font-bold">{currentState.progressScore}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div 
                className={`${getProgressColor(currentState.progressScore)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${currentState.progressScore}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{currentState.currentMilestone}</span>
              <span className="text-gray-400">Target: {formatDate(currentState.targetDate)}</span>
            </div>
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-3">
          <h4 className="text-white font-medium mb-3">AI-Generated Milestones</h4>
          
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <SafeIcon icon={Target} className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No milestones yet. Get AI career advice to generate your roadmap!</p>
            </div>
          ) : (
            milestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/30 rounded-lg hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <p className="text-white font-medium">{milestone.milestone}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <SafeIcon icon={Calendar} className="w-3 h-3" />
                      <span>{formatDate(milestone.targetDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(milestone.priority)}`}>
                    {milestone.priority}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{milestone.progressScore}%</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-700/30">
          <button
            onClick={() => window.location.href = '/career-guidance'}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <SafeIcon icon={Plus} className="w-4 h-4" />
            <span>Get AI Career Advice</span>
          </button>
        </div>
      </div>
    </SafeComponent>
  )
}
