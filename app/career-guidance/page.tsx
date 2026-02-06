'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Brain, Target, TrendingUp, Search, FileText, MessageCircle, MapPin, Shield, Users, BookOpen, Lightbulb, BarChart3, Loader2 } from 'lucide-react'

export default function IntegratedCareerGuidancePage() {
  const [session] = useSession()
  const router = useRouter()
  const [resumeText, setResumeText] = useState('')
  const [careerGoals, setCareerGoals] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('input')

  // GlixAI State
  const [glixaiAnalysis, setGlixaiAnalysis] = useState(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
  }, [session, status, router])

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !careerGoals.trim()) {
      setError('Please provide both resume text and career goals')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setStatus('loading')

    try {
      // Safe-JSON parsing with response validation
      const response = await fetch('/api/glix/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText,
          streamType: 'general'
        })
      })

      // Safe-JSON parsing to prevent "Unexpected end of input" errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      if (!text) {
        throw new Error('Empty response from server')
      }

      const result = JSON.parse(text)
      
      if (result.success) {
        // Map GlixAI results to existing result structure
        setResults({
          score: result.data.score,
          stream: result.data.stream,
          gaps: result.data.gaps,
          recommendations: result.data.recommendations,
          glixAI_insights: result.data.glixAI_insights,
          analysis: {
            skills_match: result.data.score,
            experience_level: 'Intermediate',
            education_match: 'Good',
            overall_fit: result.data.score > 70 ? 'Strong' : 'Moderate'
          }
        })
        setActiveTab('roadmap')
        setStatus('success')
      } else {
        setError(result.error || 'Analysis failed')
        setStatus('error')
      }
    } catch (error) {
      console.error('GlixAI Analysis Error:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
      setStatus('error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Brain className="w-8 h-8 text-blue-400" />
          <Target className="w-8 h-8 text-purple-400" />
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Advanced Science Career Guidance
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          AI-powered career analysis with personalized roadmap generation
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full h-32 bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your resume here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Career Goals
            </label>
            <textarea
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="w-full h-24 bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your career goals..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-24 bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Paste job description for better matching..."
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim() || !careerGoals.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with GlixAI...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Analyze with GlixAI
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setActiveTab('input')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'input' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Input
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'roadmap' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'skills' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'insights' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Insights
              </button>
            </div>

            {/* Input Tab */}
            {activeTab === 'input' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Input Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">Resume Text</h4>
                    <p className="text-gray-300 text-sm">{resumeText.substring(0, 200)}...</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">Career Goals</h4>
                    <p className="text-gray-300 text-sm">{careerGoals.substring(0, 200)}...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Roadmap Tab */}
            {activeTab === 'roadmap' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                  Personalized Career Roadmap
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">Analysis Results</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Match Score</span>
                        <span className="text-2xl font-bold text-green-400">{results.score}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Detected Stream</span>
                        <span className="text-lg font-medium text-blue-400">{results.stream?.title || 'General'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">GlixAI Insights</h4>
                    {results.glixAI_insights && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                          <span className="text-gray-300">Automation Risk</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            results.glixAI_insights.automation_risk?.level === 'Low' ? 'bg-green-900 text-green-400' :
                            results.glixAI_insights.automation_risk?.level === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                            'bg-red-900 text-red-400'
                          }`}>
                          {results.glixAI_insights.automation_risk?.level || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                        <span className="text-gray-300">Salary Potential</span>
                        <span className="text-lg font-medium text-green-400">
                          ${results.glixAI_insights.shadow_salary?.potential?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                        <span className="text-gray-300">Future-Proof Score</span>
                        <span className="text-lg font-medium text-blue-400">
                          {results.glixAI_insights.future_proofing?.score || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
