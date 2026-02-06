'use client'

import { useState } from 'react'
import { Brain, Target, TrendingUp, Loader2, BarChart3 } from 'lucide-react'

type ApiOk = { success: true; data: unknown }
type ApiErr = { success?: false; error?: string; details?: unknown }

export default function CareerGuidance() {
  const [resumeText, setResumeText] = useState('')
  const [careerGoals, setCareerGoals] = useState('')
  const [streamType, setStreamType] = useState<'pcm' | 'pcb' | 'pcmb' | 'general'>('pcm')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<unknown>(null)
  const [activeTab, setActiveTab] = useState('input')

  const analyze = async () => {
    if (!resumeText.trim() || !careerGoals.trim()) {
      setError('Please provide both resume text and career goals')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      console.log('🔍 Starting analysis with:', { resumeText: resumeText.substring(0, 100) + '...', streamType })
      
      const res = await fetch('/api/glix/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, streamType })
      })

      console.log('📡 Response status:', res.status, res.statusText)

      const text = await res.text()
      console.log('📄 Raw response:', text.substring(0, 500) + '...')
      
      let parsed: ApiOk | ApiErr
      try {
        parsed = text ? JSON.parse(text) : { success: false, error: 'Empty response from server' }
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError)
        throw new Error('Server returned invalid response format')
      }

      console.log('📊 Parsed response:', parsed)

      if (!res.ok) {
        const errorMessage = parsed && typeof parsed === 'object' && 'error' in parsed && parsed.error 
          ? String(parsed.error) 
          : `HTTP ${res.status}: ${res.statusText}`
        console.error('❌ API Error:', errorMessage)
        throw new Error(errorMessage)
      }

      if (parsed && typeof parsed === 'object' && 'success' in parsed && parsed.success) {
        console.log('✅ Analysis successful!')
        setResponse((parsed as ApiOk).data)
        setActiveTab('roadmap')
        return
      }

      const fallbackError = (parsed as ApiErr).error || 'Analysis failed - unknown error'
      console.error('❌ Analysis failed:', fallbackError)
      throw new Error(fallbackError)
    } catch (e) {
      console.error('💥 Complete error:', e)
      const errorMessage = e instanceof Error ? e.message : 'Analysis failed due to unknown error'
      setError(errorMessage)
      
      // Show user-friendly error message
      if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        setError('Server error occurred. This might be due to missing environment variables. Please try again later.')
      } else if (errorMessage.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadRoadmapPDF = async () => {
    try {
      console.log('📄 Starting PDF download...')
      
      const res = await fetch('/api/glix/roadmap-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeText, 
          streamType, 
          analysisId: Date.now() 
        })
      })

      console.log('📄 PDF Response status:', res.status, res.statusText)

      const data = await res.json()
      console.log('📄 PDF Response data:', data)
      
      if (data.success) {
        // Create download link
        const link = document.createElement('a')
        link.href = data.data.download_url
        link.download = data.data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log('✅ PDF download successful!')
      } else {
        console.error('❌ PDF generation failed:', data.error)
        setError('Failed to generate PDF: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      console.error('💥 PDF download error:', e)
      setError('PDF download failed: ' + (e instanceof Error ? e.message : 'Unknown error'))
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
        {response && typeof response === 'object' && (
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
                onClick={() => setActiveTab('gaps')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'gaps' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Skills Gap
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'recommendations' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Recommendations
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'jobs' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Jobs
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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                    Step-by-Step Career Roadmap
                  </h3>
                  {data?.career_roadmap?.downloadable_pdf?.available && (
                    <button
                      onClick={downloadRoadmapPDF}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Current Level</h4>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{data?.career_roadmap?.current_level || 'Foundation'}</div>
                      <div className="text-sm text-gray-400">Timeline: {data?.career_roadmap?.timeline_months || 6} months</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Milestones</h4>
                    <div className="space-y-3">
                      {data?.career_roadmap?.milestones?.slice(0, 4).map((milestone: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                          <div>
                            <div className="font-medium text-white">{milestone.title}</div>
                            <div className="text-sm text-gray-400">{milestone.description}</div>
                          </div>
                          <div className="text-sm font-medium text-green-400">Month {milestone.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-4">Step-by-Step Guidance</h4>
                  <div className="space-y-4">
                    {data?.career_roadmap?.next_steps?.map((step: any, index: number) => (
                      <div key={index} className="bg-slate-900 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                            {step.step}
                          </div>
                          <h5 className="text-lg font-medium text-white">{step.title}</h5>
                        </div>
                        <p className="text-gray-300 mb-3">{step.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Duration</div>
                            <div className="font-medium text-white">{step.duration_months} months</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Skills to Acquire</div>
                            <div className="flex flex-wrap gap-1">
                              {step.skills_to_acquire?.map((skill: string, skillIndex: number) => (
                                <span key={skillIndex} className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-gray-400 mb-2">Resources</div>
                          <div className="flex flex-wrap gap-2">
                            {step.resources?.map((resource: string, resourceIndex: number) => (
                              <span key={resourceIndex} className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills Gap Tab */}
            {activeTab === 'gaps' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
                  Detailed Skills Gap Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">Critical Gaps</h4>
                    <div className="text-2xl font-bold text-red-400 mb-2">{data?.gap_analysis?.critical_gaps?.length || 0}</div>
                    <div className="space-y-2">
                      {data?.gap_analysis?.critical_gaps?.slice(0, 3).map((gap: any, index: number) => (
                        <div key={index} className="p-2 bg-red-900/20 rounded border border-red-700">
                          <div className="font-medium text-white">{gap.skill}</div>
                          <div className="text-sm text-gray-400">{gap.description}</div>
                          <div className="text-xs text-red-400 mt-1">Time: {gap.estimated_time_to_close}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">Moderate Gaps</h4>
                    <div className="text-2xl font-bold text-yellow-400 mb-2">{data?.gap_analysis?.moderate_gaps?.length || 0}</div>
                    <div className="space-y-2">
                      {data?.gap_analysis?.moderate_gaps?.slice(0, 3).map((gap: any, index: number) => (
                        <div key={index} className="p-2 bg-yellow-900/20 rounded border border-yellow-700">
                          <div className="font-medium text-white">{gap.skill}</div>
                          <div className="text-sm text-gray-400">{gap.description}</div>
                          <div className="text-xs text-yellow-400 mt-1">Time: {gap.estimated_time_to_close}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-2">Low Priority Gaps</h4>
                    <div className="text-2xl font-bold text-green-400 mb-2">{data?.gap_analysis?.low_gaps?.length || 0}</div>
                    <div className="space-y-2">
                      {data?.gap_analysis?.low_gaps?.slice(0, 3).map((gap: any, index: number) => (
                        <div key={index} className="p-2 bg-green-900/20 rounded border border-green-700">
                          <div className="font-medium text-white">{gap.skill}</div>
                          <div className="text-sm text-gray-400">{gap.description}</div>
                          <div className="text-xs text-green-400 mt-1">Time: {gap.estimated_time_to_close}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-4">All Gaps Detailed</h4>
                  <div className="space-y-2">
                    {data?.gap_analysis?.detailed_gaps?.map((gap: any, index: number) => (
                      <div key={index} className="bg-slate-900 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-white mb-1">{gap.skill}</div>
                            <div className="text-sm text-gray-400 mb-2">{gap.description}</div>
                          </div>
                          <div className="ml-4 text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              gap.priority === 'high' ? 'bg-red-900 text-red-400' :
                              gap.priority === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                              'bg-green-900 text-green-400'
                            }`}>
                              {gap.priority.toUpperCase()}
                            </span>
                            <div className="text-xs text-gray-400 mt-1">{gap.estimated_time_to_close}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Personalized Recommendations</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Immediate Actions</h4>
                    <div className="space-y-3">
                      {data?.recommendations?.immediate_actions?.map((action: any, index: number) => (
                        <div key={index} className="p-3 bg-blue-900/20 rounded border border-blue-700">
                          <div className="font-medium text-white">{action.title || action}</div>
                          <div className="text-sm text-gray-400">{action.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white mb-4">Long-term Goals</h4>
                    <div className="space-y-3">
                      {data?.recommendations?.long_term_goals?.map((goal: any, index: number) => (
                        <div key={index} className="p-3 bg-purple-900/20 rounded border border-purple-700">
                          <div className="font-medium text-white">{goal.title || goal}</div>
                          <div className="text-sm text-gray-400">{goal.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-4">Skill Development Plan</h4>
                  <div className="space-y-4">
                    {data?.recommendations?.skill_development?.map((skill: any, index: number) => (
                      <div key={index} className="bg-slate-900 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-white mb-1">{skill.title}</h5>
                            <p className="text-sm text-gray-400 mb-2">{skill.description}</p>
                          </div>
                          <div className="text-sm font-medium text-blue-400">{skill.estimated_duration}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Recommended Resources</div>
                          <div className="flex flex-wrap gap-2">
                            {skill.resources?.map((resource: string, resourceIndex: number) => (
                              <span key={resourceIndex} className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Job Recommendations</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data?.job_recommendations?.map((job: any, index: number) => (
                    <div key={index} className="bg-slate-900 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-medium text-white">{job.title}</h4>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.match_percentage >= 90 ? 'bg-green-900 text-green-400' :
                          job.match_percentage >= 80 ? 'bg-blue-900 text-blue-400' :
                          'bg-yellow-900 text-yellow-400'
                        }`}>
                          {job.match_percentage}% Match
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Salary Range</span>
                          <span className="font-medium text-green-400">{job.salary_range}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Growth Potential</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            job.growth_potential === 'Very High' ? 'bg-green-900 text-green-400' :
                            job.growth_potential === 'High' ? 'bg-blue-900 text-blue-400' :
                            'bg-yellow-900 text-yellow-400'
                          }`}>
                            {job.growth_potential}
                          </span>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Required Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills?.map((skill: string, skillIndex: number) => (
                              <span key={skillIndex} className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
