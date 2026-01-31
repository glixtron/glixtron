'use client'

import { useState, useEffect } from 'react'
import { Target, Calendar, Clock, TrendingUp, CheckCircle, AlertCircle, Plus, RefreshCw, Circle } from 'lucide-react'
import { SafeIcon, SafeComponent } from '@/components/SafetyWrapper'
import { useRealTimeRoadmap } from '@/hooks/useRealTimeRoadmap'

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

interface RoadmapWidgetProps {
  className?: string
}

export default function RoadmapWidget({ className = '' }: RoadmapWidgetProps) {
  const { milestones, isLoading, error, refreshRoadmap } = useRealTimeRoadmap()

  // Calculate progress
  const completed = milestones.filter(m => m.status === 'completed').length
  const progress = milestones.length > 0 ? (completed / milestones.length) * 100 : 0

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />
      default: return <Circle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <SafeComponent>
      <div className={`p-6 bg-slate-900/50 border border-slate-800 rounded-2xl ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Career Roadmap</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-blue-400">{Math.round(progress)}% Complete</span>
            <button
              onClick={refreshRoadmap}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mb-8">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading State */}
        {isLoading && milestones.length === 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your career roadmap...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Milestones */}
        {!isLoading && milestones.length > 0 && (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start gap-4 group hover:bg-slate-800/30 p-3 rounded-lg transition-colors">
                <div className="mt-1">
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-medium ${
                      milestone.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}>
                      {milestone.milestone}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(milestone.priority)}`}>
                      {milestone.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={12} />
                    <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                    {milestone.progressScore > 0 && (
                      <>
                        <span>•</span>
                        <span>Progress: {milestone.progressScore}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && milestones.length === 0 && !error && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-2">No milestones yet</p>
            <p className="text-gray-500 text-xs">Chat with the AI Assistant to generate your personalized career roadmap!</p>
          </div>
        )}

        {/* Summary */}
        {milestones.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{milestones.length}</p>
                <p className="text-xs text-gray-400">Total Milestones</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{completed}</p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">{milestones.length - completed}</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SafeComponent>
  )
}
