'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Brain, 
  Target,
  TrendingUp,
  FileText,
  Users,
  Briefcase,
  ArrowRight,
  BarChart3,
  BookOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Award,
  Calendar,
  Globe
} from 'lucide-react'

export default function IntegratedCareerGuidancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [resumeText, setResumeText] = useState('')
  const [careerGoals, setCareerGoals] = useState('')
  const [jdUrl, setJdUrl] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'input' | 'roadmap' | 'skills' | 'insights'>('input')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) return null

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !careerGoals.trim()) {
      setError('Please provide both resume text and career goals')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/career-guidance/integrated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          careerGoals,
          jobDescriptionUrl: jdUrl,
          jobDescriptionText: jdText
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data)
        setActiveTab('roadmap')
      } else {
        setError(data.error || 'Failed to generate career guidance')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to generate career guidance. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

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
          Integrated Career Guidance
        </h1>
        <p className="text-gray-300">
          AI-powered comprehensive career planning with personalized roadmaps
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('input')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'input' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          Input
        </button>
        {results && (
          <>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'roadmap' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'skills' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'insights' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Insights
            </button>
          </>
        )}
      </div>

      {/* Input Tab */}
      {activeTab === 'input' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Input */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Your Resume
              </h3>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-48 p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="mt-2 text-sm text-gray-400">
                {resumeText.length} characters
              </div>
            </div>

            {/* Career Goals Input */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Career Goals
              </h3>
              <textarea
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="Describe your career goals and target role..."
                className="w-full h-48 p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="mt-2 text-sm text-gray-400">
                {careerGoals.length} characters
              </div>
            </div>
          </div>

          {/* Optional JD Input */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-green-400" />
              Job Description (Optional)
            </h3>
            <div className="space-y-4">
              <input
                type="url"
                value={jdUrl}
                onChange={(e) => setJdUrl(e.target.value)}
                placeholder="Job URL (optional)"
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="text-center text-gray-400">or</div>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste job description text (optional)"
                className="w-full h-32 p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate Career Guidance</span>
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-600/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Results Tabs */}
      {results && (
        <>
          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && results.personalizedRoadmap && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Personalized Roadmap</h2>
              {results.personalizedRoadmap.phases?.map((phase: any, index: number) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{phase.phase}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{phase.duration}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Objectives</h4>
                    <ul className="space-y-1">
                      {phase.objectives?.map((objective: string, objIndex: number) => (
                        <li key={objIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 text-sm">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Skills to Develop</h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills?.map((skill: any, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                        >
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Projects</h4>
                    <div className="space-y-2">
                      {phase.projects?.map((project: any, projIndex: number) => (
                        <div key={projIndex} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{project.name}</span>
                            <span className="text-gray-400 text-sm">{project.duration}</span>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && results.skillGapAnalysis && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Skill Gap Analysis</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Gaps:</span>
                      <span className="text-white font-medium">{results.skillGapAnalysis.summary.totalGaps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Critical Gaps:</span>
                      <span className="text-white font-medium">{results.skillGapAnalysis.summary.criticalGaps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Readiness:</span>
                      <span className="text-white font-medium">{results.skillGapAnalysis.summary.overallReadiness}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time to Ready:</span>
                      <span className="text-white font-medium">{results.skillGapAnalysis.summary.estimatedTimeToReadiness}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.skillGapAnalysis.summary.recommendedFocus?.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {results.skillGapAnalysis.gaps?.map((gap: any, index: number) => (
                  <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">{gap.skill}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{gap.currentLevel}%</div>
                        <div className="text-sm text-gray-400">Target: {gap.targetLevel}%</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${gap.currentLevel}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Learning Path</h4>
                        <div className="space-y-1">
                          {gap.learningPath?.slice(0, 3).map((step: any, stepIndex: number) => (
                            <div key={stepIndex} className="text-sm text-gray-300">
                              • {step.title}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Impact</h4>
                        <p className="text-sm text-gray-300">{gap.careerImpact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && results.marketInsights && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Market Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    <span className="text-sm text-gray-400">Demand</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {results.marketInsights.demandLevel}
                  </div>
                  <p className="text-gray-300 text-sm">Market demand level</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <span className="text-sm text-gray-400">Salary</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    ${results.marketInsights.salaryRange?.average?.toLocaleString() || 'N/A'}
                  </div>
                  <p className="text-gray-300 text-sm">Average salary</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <Globe className="w-8 h-8 text-purple-400" />
                    <span className="text-sm text-gray-400">Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {results.marketInsights.growthRate}%
                  </div>
                  <p className="text-gray-300 text-sm">Annual growth</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-yellow-400" />
                    <span className="text-sm text-gray-400">Competition</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {results.marketInsights.competition}
                  </div>
                  <p className="text-gray-300 text-sm">Competition level</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      Immediate
                    </h4>
                    <ul className="space-y-2">
                      {results.recommendations.immediate?.map((action: any, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{action.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                      Short Term
                    </h4>
                    <ul className="space-y-2">
                      {results.recommendations.shortTerm?.map((action: any, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{action.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-400" />
                      Long Term
                    </h4>
                    <ul className="space-y-2">
                      {results.recommendations.longTerm?.map((action: any, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{action.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
