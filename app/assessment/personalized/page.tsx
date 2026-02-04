'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PersonalizedAssessment from '@/components/PersonalizedAssessment'
import { 
  Brain, 
  ArrowLeft,
  Sparkles,
  Target,
  BookOpen,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react'

export default function PersonalizedAssessmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAssessment, setShowAssessment] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (showAssessment) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <button
              onClick={() => setShowAssessment(false)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
          </div>
          <PersonalizedAssessment />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Brain className="w-12 h-12 text-blue-400" />
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI-Personalized Assessment
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get a completely personalized assessment based on your resume and career goals. 
            Our AI analyzes your background and creates customized questions and a detailed roadmap just for you.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Resume Analysis</h3>
            </div>
            <p className="text-gray-300 text-sm">
              AI analyzes your skills, experience, projects, and achievements to understand your current profile
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Career Goal Evaluation</h3>
            </div>
            <p className="text-gray-300 text-sm">
              We evaluate your career aspirations and align them with your current skills and market opportunities
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Personalized Questions</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Questions are generated specifically for you based on your background and target role
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Detailed Roadmap</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Get a step-by-step development plan with specific resources, projects, and timelines
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Skill Gap Analysis</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Identify specific skill gaps and get personalized learning recommendations
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Market Alignment</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your roadmap is aligned with current market demands and salary expectations
            </p>
          </div>
        </div>

        {/* Process Overview */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/50 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Resume Analysis</h3>
              <p className="text-gray-300 text-sm">AI analyzes your skills, experience, and achievements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Career Goals</h3>
              <p className="text-gray-300 text-sm">Share your aspirations and target role</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Personalized Assessment</h3>
              <p className="text-gray-300 text-sm">Answer questions tailored to your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-400">4</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Custom Roadmap</h3>
              <p className="text-gray-300 text-sm">Receive your personalized development plan</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Why Personalized Assessment?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Questions Based on Your Experience</h3>
                  <p className="text-gray-300 text-sm">No generic questions - every question is relevant to your background</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Roadmap Tailored to Your Goals</h3>
                  <p className="text-gray-300 text-sm">Development plan that matches your career aspirations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Specific Resource Recommendations</h3>
                  <p className="text-gray-300 text-sm">Get exact courses, books, and projects for your skill gaps</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Realistic Timeline</h3>
                  <p className="text-gray-300 text-sm">Timeline based on your current skills and learning pace</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">What You&apos;ll Get</h2>
            <div className="space-y-4">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-400" />
                  Skill Gap Analysis
                </h3>
                <p className="text-gray-300 text-sm">Identify exactly what you need to learn for your target role</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-green-400" />
                  Learning Resources
                </h3>
                <p className="text-gray-300 text-sm">Curated courses, books, and tutorials for your specific needs</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Portfolio Projects
                </h3>
                <p className="text-gray-300 text-sm">Hands-on projects that demonstrate your skills to employers</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                  Career Milestones
                </h3>
                <p className="text-gray-300 text-sm">Clear milestones and success metrics to track your progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-8 border border-green-500/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready for Your Personalized Career Roadmap?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with our AI-powered personalized assessments
            </p>
            <button
              onClick={() => setShowAssessment(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-lg font-semibold flex items-center space-x-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Personalized Assessment</span>
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Takes 20-30 minutes • Completely personalized • Detailed roadmap included
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
