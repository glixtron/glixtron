'use client'

import { useState } from 'react'
import { Brain, Target, TrendingUp, Loader2 } from 'lucide-react'

type ApiOk = { success: true; data: unknown }
type ApiErr = { success?: false; error?: string; details?: unknown }

export default function CareerGuidance() {
  const [resumeText, setResumeText] = useState('')
  const [careerGoals, setCareerGoals] = useState('')
  const [streamType, setStreamType] = useState<'pcm' | 'pcb' | 'pcmb' | 'general'>('pcm')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<unknown>(null)

  const analyze = async () => {
    if (!resumeText.trim() || !careerGoals.trim()) {
      setError('Please provide both resume text and career goals')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/glix/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, streamType })
      })

      const text = await res.text()
      const parsed: ApiOk | ApiErr = text ? JSON.parse(text) : { success: false, error: 'Empty response' }

      if (!res.ok) {
        throw new Error(parsed && typeof parsed === 'object' && 'error' in parsed && parsed.error ? String(parsed.error) : `HTTP ${res.status}`)
      }

      if (parsed && typeof parsed === 'object' && 'success' in parsed && parsed.success) {
        setResponse((parsed as ApiOk).data)
        return
      }

      throw new Error((parsed as ApiErr).error || 'Analysis failed')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const data = response as any

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <Target className="w-8 h-8 text-purple-400" />
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
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
                Stream Type
              </label>
              <select
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={streamType}
                onChange={(e) => setStreamType(e.target.value as any)}
              >
                <option value="pcm">PCM (Physics, Chemistry, Math)</option>
                <option value="pcb">PCB (Physics, Chemistry, Biology)</option>
                <option value="pcmb">PCMB (Physics, Chemistry, Math, Biology)</option>
                <option value="general">General Science</option>
              </select>
            </div>
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
                className="w-full h-32 bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your career goals..."
              />
            </div>
          </div>

          {/* Analyze Button */}
          <div className="text-center mt-6">
            <button
              onClick={analyze}
              disabled={loading || !resumeText.trim() || !careerGoals.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {loading ? (
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
        </div>

        {/* Results Section */}
        {response && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">GlixAI Analysis Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">Analysis Results</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Match Score</span>
                      <span className="text-2xl font-bold text-green-400">{data?.score || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Detected Stream</span>
                      <span className="text-lg font-medium text-blue-400">{data?.stream?.title || 'General'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">GlixAI Insights</h4>
                  {data?.glixAI_insights && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                        <span className="text-gray-300">Automation Risk</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-400">
                          {data.glixAI_insights.automation_risk?.level || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                        <span className="text-gray-300">Salary Potential</span>
                        <span className="text-lg font-medium text-green-400">
                          ${data?.glixAI_insights?.shadow_salary?.potential?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                        <span className="text-gray-300">Future-Proof Score</span>
                        <span className="text-lg font-medium text-blue-400">
                          {data?.glixAI_insights?.future_proofing?.score || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raw Data */}
        {response && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Raw API Response</h3>
            <pre className="text-xs p-4 rounded bg-gray-900 border border-white/10 overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
