'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase, 
  Target,
  ArrowRight,
  BarChart3,
  Activity,
  Award
} from 'lucide-react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickAction = (action: string) => {
    setIsLoading(true)
    // Simulate navigation or action
    setTimeout(() => {
      setIsLoading(false)
      console.log(`Action: ${action}`)
    }, 1000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
        <p className="text-slate-400">Here&apos;s what&apos;s happening with your career journey today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Career Score"
          value="87%"
          icon={TrendingUp}
          trend={{ value: "5% from last month", isPositive: true }}
          description="Based on your profile and assessments"
        />
        <StatCard
          title="Completed Assessments"
          value="12"
          icon={FileText}
          trend={{ value: "2 this week", isPositive: true }}
          description="Career and skill assessments"
        />
        <StatCard
          title="Job Matches"
          value="48"
          icon={Briefcase}
          trend={{ value: "12 new matches", isPositive: true }}
          description="Based on your profile"
        />
        <StatCard
          title="Skill Points"
          value="1,234"
          icon={Award}
          trend={{ value: "150 earned", isPositive: true }}
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
            icon={<Target className="h-6 w-6 text-brand-accent" />}
            action={() => handleQuickAction('assessment')}
            actionText="Start Assessment"
          />
          <ActionCard
            title="Scan Resume"
            description="Upload and analyze your resume to improve its effectiveness and ATS compatibility."
            icon={<FileText className="h-6 w-6 text-brand-accent" />}
            action={() => handleQuickAction('resume-scan')}
            actionText="Scan Resume"
          />
          <ActionCard
            title="Career Guidance"
            description="Get AI-powered career advice and personalized development recommendations."
            icon={<TrendingUp className="h-6 w-6 text-brand-accent" />}
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
          <div className="flex items-center justify-center h-48 bg-brand-glass rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-brand-accent mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Career Progress Chart</p>
              <p className="text-xs text-slate-500 mt-1">Visualization coming soon</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Skill Analysis"
          description="Your skill strengths and areas for improvement"
        >
          <div className="flex items-center justify-center h-48 bg-brand-glass rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-brand-accent mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Skill Radar Chart</p>
              <p className="text-xs text-slate-500 mt-1">Visualization coming soon</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 hover:bg-brand-glass rounded-lg transition-colors">
              <div className="h-10 w-10 rounded-full bg-brand-success/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-brand-success" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Completed Technical Skills Assessment</p>
                <p className="text-slate-400 text-xs">2 hours ago</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
            
            <div className="flex items-center space-x-4 p-3 hover:bg-brand-glass rounded-lg transition-colors">
              <div className="h-10 w-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-brand-accent" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Resume scan completed - 92% ATS score</p>
                <p className="text-slate-400 text-xs">1 day ago</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
            
            <div className="flex items-center space-x-4 p-3 hover:bg-brand-glass rounded-lg transition-colors">
              <div className="h-10 w-10 rounded-full bg-brand-warning/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-brand-warning" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Career path updated - Software Engineering</p>
                <p className="text-slate-400 text-xs">3 days ago</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
