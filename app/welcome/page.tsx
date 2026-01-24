'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Sparkles, TrendingUp, BookOpen, AlertCircle, User, ArrowRight } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    // Wait for session to load
    if (status === 'loading') {
      return
    }

    setLoading(false)
  }, [status, router])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold gradient-text">Glixtron</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {session.user?.name}! 👋
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Ready to discover your career path? Let's get started with your personalized assessment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Assessment</h3>
            <p className="text-slate-400 text-sm">
              Discover your strengths and find the perfect career match
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Skill Analysis</h3>
            <p className="text-slate-400 text-sm">
              Get AI-powered insights on your skills and opportunities
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personal Growth</h3>
            <p className="text-slate-400 text-sm">
              Track your progress and achieve your career goals
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/assessment"
            className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <span>Start Career Assessment</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <div className="mt-6">
            <Link href="/profile" className="text-slate-400 hover:text-slate-300 transition-colors">
              Or update your profile first
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            The assessment takes about 5-10 minutes and will help us personalize your experience.
          </p>
        </div>
      </div>
    </div>
  )
}
