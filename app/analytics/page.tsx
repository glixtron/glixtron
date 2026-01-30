'use client'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { apiService } from '@/lib/api-service'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase,
  Target,
  Eye,
  Download,
  Calendar,
  Clock,
  Award,
  Zap,
  Activity,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Mock analytics data - in real app, this would come from API
      setAnalytics({
        overview: {
          totalResumes: 12,
          totalScans: 45,
          totalJobs: 89,
          totalInterviews: 23,
          averageScore: 78,
          completionRate: 85
        },
        resumeAnalytics: {
          dailyUploads: [2, 3, 1, 4, 2, 5, 3],
          averageScores: [75, 78, 82, 79, 85, 88, 82],
          topImprovements: [
            { area: "Skills Section", count: 34, percentage: 75 },
            { area: "Experience Description", count: 28, percentage: 62 },
            { area: "Format & Layout", count: 22, percentage: 49 },
            { area: "Keywords", count: 18, percentage: 40 }
          ]
        },
        jobAnalytics: {
          applications: [5, 8, 12, 7, 15, 9, 11],
          interviews: [1, 2, 3, 1, 4, 2, 3],
          responseRates: [20, 25, 25, 14, 27, 22, 27],
          topCompanies: [
            { name: "Tech Corp", applications: 8, interviews: 3 },
            { name: "StartupXYZ", applications: 6, interviews: 2 },
            { name: "Digital Agency", applications: 5, interviews: 1 },
            { name: "Enterprise Inc", applications: 4, interviews: 2 }
          ]
        },
        assessmentAnalytics: {
          completed: [3, 2, 4, 1, 5, 3, 2],
          averageScores: [82, 78, 85, 80, 88, 84, 86],
          skillProgress: [
            { skill: "Technical Skills", current: 85, previous: 78, improvement: 7 },
            { skill: "Communication", current: 72, previous: 68, improvement: 4 },
            { skill: "Leadership", current: 68, previous: 62, improvement: 6 },
            { skill: "Problem Solving", current: 90, previous: 85, improvement: 5 }
          ]
        },
        timeline: [
          {
            date: "2024-01-28",
            type: "resume_upload",
            title: "Uploaded Resume v3",
            description: "Updated technical skills section",
            score: 88
          },
          {
            date: "2024-01-27",
            type: "job_application",
            title: "Applied to Senior Developer",
            description: "Tech Corp - San Francisco",
            status: "interview_scheduled"
          },
          {
            date: "2024-01-26",
            type: "assessment",
            title: "Completed Skills Assessment",
            description: "Score: 92% - Excellent performance",
            score: 92
          },
          {
            date: "2024-01-25",
            type: "interview",
            title: "Interview with StartupXYZ",
            description: "Technical round - Positive feedback",
            status: "completed"
          }
        ]
      })
    } catch (error) {
      console.error('Analytics error:', error)
      setError('Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'resume_upload': return FileText
      case 'job_application': return Briefcase
      case 'assessment': return Target
      case 'interview': return Users
      default: return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview_scheduled': return 'text-green-400'
      case 'completed': return 'text-blue-400'
      case 'pending': return 'text-yellow-400'
      case 'rejected': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400">Track your career progress and performance metrics.</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {range === '24h' ? 'Last 24 Hours' :
               range === '7d' ? 'Last 7 Days' :
               range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Resumes"
            value={analytics?.overview.totalResumes}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            description="Resumes uploaded"
          />
          <StatCard
            title="Total Scans"
            value={analytics?.overview.totalScans}
            icon={Eye}
            trend={{ value: 8, isPositive: true }}
            description="Resume analyses"
          />
          <StatCard
            title="Job Applications"
            value={analytics?.overview.totalJobs}
            icon={Briefcase}
            trend={{ value: 15, isPositive: true }}
            description="Applications sent"
          />
          <StatCard
            title="Interviews"
            value={analytics?.overview.totalInterviews}
            icon={Users}
            trend={{ value: 25, isPositive: true }}
            description="Interviews scheduled"
          />
        </div>
      </div>

      {/* Resume Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Resume Upload Trends">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Daily Uploads (Last 7 days)</span>
              <span className="text-green-400 text-sm">+15% vs last week</span>
            </div>
            <div className="flex items-end space-x-2 h-32">
              {analytics?.resumeAnalytics.dailyUploads.map((value: number, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                    style={{ height: `${(value / 5) * 100}%` }}
                  />
                  <span className="text-xs text-slate-400 mt-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top Improvement Areas">
          <div className="space-y-3">
            {analytics?.resumeAnalytics.topImprovements.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{item.area}</span>
                  <span className="text-blue-400 text-sm">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Job Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Application Activity">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Applications vs Interviews</span>
              <span className="text-green-400 text-sm">27% response rate</span>
            </div>
            <div className="space-y-3">
              {analytics?.jobAnalytics.applications.map((apps: number, index: number) => {
                const interviews = analytics?.jobAnalytics.interviews[index] || 0
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 w-8">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                    <div className="flex-1 flex space-x-1">
                      <div 
                        className="bg-blue-500 rounded"
                        style={{ width: `${(apps / 15) * 100}%`, height: '8px' }}
                        title={`Applications: ${apps}`}
                      />
                      <div 
                        className="bg-green-500 rounded"
                        style={{ width: `${(interviews / 4) * 100}%`, height: '8px' }}
                        title={`Interviews: ${interviews}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-slate-400">Applications</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-slate-400">Interviews</span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top Companies">
          <div className="space-y-3">
            {analytics?.jobAnalytics.topCompanies.map((company: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{company.name}</p>
                  <p className="text-slate-400 text-sm">{company.applications} applications</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">{company.interviews} interviews</p>
                  <p className="text-slate-400 text-sm">
                    {Math.round((company.interviews / company.applications) * 100)}% rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Assessment Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Assessment Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Skill Progress">
            <div className="space-y-4">
              {analytics?.assessmentAnalytics.skillProgress.map((skill: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-sm">{skill.previous}%</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span className="text-green-400 text-sm">{skill.current}%</span>
                      <span className="text-green-400 text-xs">+{skill.improvement}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${skill.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Recent Timeline">
            <div className="space-y-4">
              {analytics?.timeline.slice(0, 4).map((item: any, index: number) => {
                const Icon = getTimelineIcon(item.type)
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800/50">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium text-sm">{item.title}</p>
                        {item.score && (
                          <span className="text-green-400 text-sm">{item.score}%</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span className="text-slate-500 text-xs">{item.date}</span>
                        {item.status && (
                          <span className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Average Score"
            value={`${analytics?.overview.averageScore}%`}
            icon={Target}
            trend={{ value: 5, isPositive: true }}
            description="Overall performance"
          />
          <StatCard
            title="Completion Rate"
            value={`${analytics?.overview.completionRate}%`}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            description="Tasks completed"
          />
          <StatCard
            title="Active Days"
            value="24"
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
            description="Days this month"
          />
        </div>
      </div>
    </div>
  )
}
// FORCE_CACHE_CLEAR_1769781007
