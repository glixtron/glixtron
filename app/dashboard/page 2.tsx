'use client'

import { Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import SkeletonLoader from '@/components/SkeletonLoader'
import RoadmapWidget from '@/components/RoadmapWidget'
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

// Static components that load instantly
function StaticHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Career Dashboard</h1>
      <p className="text-gray-400">Track your professional growth and AI-powered insights</p>
    </div>
  )
}

function StaticActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <ActionCard
        title="Resume Scanner"
        description="AI-powered resume analysis"
        icon={FileText}
        action={() => {
          window.location.href = '/resume-scanner'
        }}
        actionText="Scan Resume"
        className="from-blue-500 to-blue-600"
      />
      <ActionCard
        title="Career Guidance"
        description="Personalized AI career advice"
        icon={Brain}
        action={() => {
          window.location.href = '/career-guidance'
        }}
        actionText="Get Advice"
        className="from-purple-500 to-purple-600"
      />
      <ActionCard
        title="Job Matching"
        description="Find your perfect role"
        icon={Target}
        action={() => {
          window.location.href = '/job-matching'
        }}
        actionText="Find Jobs"
        className="from-emerald-500 to-emerald-600"
      />
    </div>
  )
}

// Dynamic components that stream in with PPR
async function DynamicStats() {
  // This component will be server-rendered and stream in
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/dashboard/stats`, {
    cache: 'no-store' // Ensure fresh data
  })
  
  if (!response.ok) {
    throw new Error('Failed to load stats')
  }
  
  const data = await response.json()
  const stats = data.success ? data.data : {
    marketReadiness: { value: 75, trend: { value: '+5%', isPositive: true } },
    careerProgress: { value: 68, trend: { value: '+12%', isPositive: true } },
    skillGaps: { value: 3, trend: { value: '-2', isPositive: true } },
    aiInteractions: { value: 24, trend: { value: '+8', isPositive: true } }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Market Readiness"
        value={stats.marketReadiness.value}
        trend={stats.marketReadiness.trend}
        icon={TrendingUp}
        className="bg-blue-500/10 border-blue-500/30"
      />
      <StatCard
        title="Career Progress"
        value={stats.careerProgress.value}
        trend={stats.careerProgress.trend}
        icon={BarChart3}
        className="bg-emerald-500/10 border-emerald-500/30"
      />
      <StatCard
        title="Skill Gaps"
        value={stats.skillGaps.value}
        trend={stats.skillGaps.trend}
        icon={Target}
        className="bg-yellow-500/10 border-yellow-500/30"
      />
      <StatCard
        title="AI Interactions"
        value={stats.aiInteractions.value}
        trend={stats.aiInteractions.trend}
        icon={Brain}
        className="bg-purple-500/10 border-purple-500/30"
      />
    </div>
  )
}

async function DynamicActivity() {
  // This component will be server-rendered and stream in
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/dashboard/activity`, {
    cache: 'no-store' // Ensure fresh data
  })
  
  if (!response.ok) {
    throw new Error('Failed to load activity')
  }
  
  const data = await response.json()
  const activities = data.success ? data.data.activities : [
    { id: 1, type: 'resume', title: 'Resume analyzed', time: '2 hours ago' },
    { id: 2, type: 'career', title: 'Career guidance received', time: '1 day ago' },
    { id: 3, type: 'job', title: 'Job match found', time: '2 days ago' }
  ]

  return (
    <ChartCard
      title="Recent Activity"
      description="Your latest career development activities"
    >
      <div className="space-y-4">
        {activities.map((activity: any) => (
          <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex-shrink-0 text-blue-400">
              {activity.type === 'resume' && <FileText className="w-4 h-4" />}
              {activity.type === 'career' && <Brain className="w-4 h-4" />}
              {activity.type === 'job' && <Target className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{activity.title}</p>
              <p className="text-gray-400 text-sm">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}

async function DynamicProgressChart() {
  // Simulate chart data generation
  return (
    <ChartCard
      title="Progress Overview"
      description="Your career development metrics over time"
    >
      <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <p className="text-white font-medium">Progress Chart</p>
          <p className="text-gray-400 text-sm">Interactive chart visualization</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Market Readiness:</span>
              <span className="text-green-400">+15%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Skill Development:</span>
              <span className="text-blue-400">+23%</span>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  )
}

// Main dashboard with PPR
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Static Shell - Loads instantly */}
        <StaticHeader />
        <StaticActionCards />
        
        {/* Dynamic Content - Stream in when ready */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid - Dynamic */}
            <Suspense fallback={<DashboardStatsSkeleton />}>
              <DynamicStats />
            </Suspense>
            
            {/* Progress Chart - Dynamic */}
            <Suspense fallback={<ChartSkeleton />}>
              <DynamicProgressChart />
            </Suspense>
          </div>
          
          <div className="space-y-8">
            {/* Roadmap Widget - Simplified loading */}
            <Suspense fallback={<SkeletonLoader type="card" />}>
              <RoadmapWidget />
            </Suspense>
            
            {/* Recent Activity - Simplified loading */}
            <Suspense fallback={<ActivitySkeleton />}>
              <DynamicActivity />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton components for PPR loading states
function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
            <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
      <div className="animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-48 mb-6"></div>
        <div className="h-64 bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
      <div className="animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="h-4 w-4 bg-slate-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
