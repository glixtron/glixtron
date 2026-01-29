'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  User, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  BookOpen, 
  Settings, 
  BarChart3,
  Target,
  Zap,
  Award,
  Download,
  Upload,
  Search,
  Globe,
  Shield,
  Clock
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    resumeScans: 0,
    jobApplications: 0,
    interviews: 0,
    offers: 0
  })

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
  }, [router, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'Resume Scanner',
      description: 'Analyze and optimize your resume',
      icon: FileText,
      href: '/resume-scanner',
      color: 'from-blue-500 to-blue-600',
      badge: 'AI Powered'
    },
    {
      title: 'Job Search',
      description: 'Find and analyze job opportunities',
      icon: Search,
      href: '/job-search',
      color: 'from-green-500 to-green-600',
      badge: 'Smart Matching'
    },
    {
      title: 'Career Assessment',
      description: 'Discover your career DNA',
      icon: Target,
      href: '/assessment',
      color: 'from-purple-500 to-purple-600',
      badge: 'Personalized'
    },
    {
      title: 'Skill Development',
      description: 'Track and improve your skills',
      icon: BookOpen,
      href: '/skills',
      color: 'from-orange-500 to-orange-600',
      badge: 'Growth Focused'
    },
    {
      title: 'Analytics',
      description: 'Track your job search progress',
      icon: BarChart3,
      href: '/analytics',
      color: 'from-pink-500 to-pink-600',
      badge: 'Data Driven'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account and preferences',
      icon: Settings,
      href: '/profile',
      color: 'from-gray-500 to-gray-600',
      badge: 'Customizable'
    }
  ]

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Quick resume analysis',
      icon: Upload,
      href: '/resume-scanner',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Extract Job',
      description: 'Analyze job from URL',
      icon: Globe,
      href: '/job-extractor',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Match Resume',
      description: 'Compare resume to job',
      icon: Target,
      href: '/resume-matcher',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  const recentActivity = [
    {
      title: 'Resume analyzed for Senior Developer role',
      time: '2 hours ago',
      type: 'resume',
      score: 85
    },
    {
      title: 'Job extracted from LinkedIn',
      time: '5 hours ago',
      type: 'job',
      company: 'Tech Corp'
    },
    {
      title: 'Profile updated with new skills',
      time: '1 day ago',
      type: 'profile'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {session?.user?.name || 'User'}! 👋
              </h1>
              <p className="text-slate-300">
                Your career development dashboard - Track progress and discover opportunities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.resumeScans}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Resume Scans</h3>
            <p className="text-slate-400 text-sm">Total analyses performed</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{stats.jobApplications}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Applications</h3>
            <p className="text-slate-400 text-sm">Jobs applied to</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{stats.interviews}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Interviews</h3>
            <p className="text-slate-400 text-sm">Interviews scheduled</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">{stats.offers}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Offers</h3>
            <p className="text-slate-400 text-sm">Job offers received</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} rounded-xl p-6 text-white transition-all transform hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <action.icon className="h-8 w-8" />
                  <span className="text-sm opacity-75">Quick Start</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Menu */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-400" />
            Career Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-green-400" />
              Recent Activity
            </h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-slate-700 last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'resume' ? 'bg-blue-500/20' :
                      activity.type === 'job' ? 'bg-green-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      {
                        activity.type === 'resume' ? <FileText className="h-4 w-4 text-blue-400" /> :
                        activity.type === 'job' ? <Briefcase className="h-4 w-4 text-green-400" /> :
                        <User className="h-4 w-4 text-purple-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{activity.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-slate-400 text-sm">{activity.time}</span>
                        {activity.score && (
                          <span className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-400">
                            {activity.score}% match
                          </span>
                        )}
                        {activity.company && (
                          <span className="text-slate-400 text-sm">{activity.company}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-400" />
              Quick Tips
            </h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Target className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Complete Your Profile</h4>
                    <p className="text-slate-400 text-sm">Add skills and experience for better matches</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <FileText className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Update Resume Regularly</h4>
                    <p className="text-slate-400 text-sm">Keep your resume current with latest skills</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Track Applications</h4>
                    <p className="text-slate-400 text-sm">Monitor your job search progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
