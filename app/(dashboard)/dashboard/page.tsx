'use client'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { apiService, mockData } from '@/lib/api-service'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase, 
  Target,
  ArrowRight,
  BarChart3,
  Activity,
  Award,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(mockData.dashboardStats)
  const [activity, setActivity] = useState(mockData.recentActivity)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load dashboard stats
      const statsResponse = await apiService.getDashboardStats()
      if (statsResponse.success) {
        setStats(statsResponse.data)
      } else {
        // Fallback to mock data
        setStats(mockData.dashboardStats)
      }

      // Load recent activity
      const activityResponse = await apiService.getRecentActivity()
      if (activityResponse.success) {
        setActivity(activityResponse.data.activities)
      } else {
        // Fallback to mock data
        setActivity(mockData.recentActivity)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data')
      // Fallback to mock data
      setStats(mockData.dashboardStats)
      setActivity(mockData.recentActivity)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'assessment':
          await apiService.startAssessment('full')
          window.location.href = '/assessment'
          break
        case 'resume-scan':
          window.location.href = '/resume-scanner'
          break
        case 'career-guidance':
          window.location.href = '/career-guidance'
          break
        default:
          console.log(`Action: ${action}`)
      }
    } catch (error) {
      console.error('Action failed:', error)
    }
  }

  const getActivityIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Award,
      Briefcase,
      TrendingUp,
      Target,
      FileText,
      User: Award
    }
    return icons[iconName] || Activity
  }

  const getActivityColor = (color: string) => {
    const colors: Record<string, string> = {
      success: 'text-green-400',
      primary: 'text-blue-400',
      warning: 'text-yellow-400',
      info: 'text-purple-400'
    }
    return colors[color] || 'text-slate-400'
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <p className="text-white text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome back, John!
        </h1>
        <p className="text-slate-400">Here&apos;s what&apos;s happening with your career journey today.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Career Score"
          value={`${stats.careerScore}%`}
          icon={TrendingUp}
          trend={stats.trends.careerScore}
          description="Based on your profile and assessments"
        />
        <StatCard
          title="Completed Assessments"
          value={stats.completedAssessments}
          icon={FileText}
          trend={stats.trends.completedAssessments}
          description="Career and skill assessments"
        />
        <StatCard
          title="Job Matches"
          value={stats.jobMatches}
          icon={Briefcase}
          trend={stats.trends.jobMatches}
          description="Based on your profile"
        />
        <StatCard
          title="Skill Points"
          value={stats.skillPoints.toLocaleString()}
          icon={Award}
          trend={stats.trends.skillPoints}
          description="From completed activities"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Take Assessment"
            description="Complete a comprehensive career assessment to get personalized recommendations."
            icon={<Brain className="h-6 w-6 text-blue-400" />}
            action={() => handleQuickAction('assessment')}
            actionText="Start Assessment"
          />
          <ActionCard
            title="Scan Resume"
            description="Upload and analyze your resume to improve its effectiveness and ATS compatibility."
            icon={<FileText className="h-6 w-6 text-blue-400" />}
            action={() => handleQuickAction('resume-scan')}
            actionText="Scan Resume"
          />
          <ActionCard
            title="Career Guidance"
            description="Get AI-powered career advice and personalized development recommendations."
            icon={<TrendingUp className="h-6 w-6 text-blue-400" />}
            action={() => handleQuickAction('career-guidance')}
            actionText="Get Guidance"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Career Progress"
          description="Your overall career development over time"
        >
          <div className="flex items-center justify-center h-48 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2 animate-float" />
              <p className="text-slate-400 text-sm">Career Progress Chart</p>
              <p className="text-slate-500 text-xs mt-1">Visualization coming soon</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Skill Analysis"
          description="Your skill strengths and areas for improvement"
        >
          <div className="flex items-center justify-center h-48 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-center">
              <Activity className="h-12 w-12 text-purple-400 mx-auto mb-2 animate-glow" />
              <p className="text-slate-400 text-sm">Skill Radar Chart</p>
              <p className="text-slate-500 text-xs mt-1">Visualization coming soon</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <div className="space-y-4">
            {activity.map((item) => {
              const Icon = getActivityIcon(item.icon)
              return (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-4 p-3 hover:bg-slate-800/50 rounded-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-700/50 transition-colors">
                    <Icon className={`h-5 w-5 ${getActivityColor(item.color)}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm group-hover:text-blue-100 transition-colors">{item.title}</p>
                    <p className="text-slate-400 text-xs">{item.description}</p>
                    <p className="text-slate-500 text-xs mt-1">{item.timestamp}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
