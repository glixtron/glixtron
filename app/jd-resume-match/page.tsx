'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import JDResumeMatchAnalysis from '@/components/JDResumeMatchAnalysis'
import { ArrowLeft, FileText, Briefcase, Target, Eye } from 'lucide-react'

export default function JDResumeMatchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) return null

  if (showAnalysis) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setShowAnalysis(false)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <JDResumeMatchAnalysis />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <FileText className="w-12 h-12 text-blue-400" />
            <Briefcase className="w-12 h-12 text-purple-400" />
            <Target className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            JD-Resume Match Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced AI-powered analysis to match your resume with job descriptions
          </p>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Analyze Your Job Match?
            </h2>
            <button
              onClick={() => setShowAnalysis(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg font-semibold flex items-center space-x-2 mx-auto"
            >
              <Eye className="w-5 h-5" />
              <span>Start Analysis</span>
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Free analysis • Instant results • Downloadable reports
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
