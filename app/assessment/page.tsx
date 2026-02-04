'use client'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { apiService } from '@/lib/api-service'
import { 
  FileText, 
  Brain, 
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Award,
  Sparkles,
  ArrowRight,
  Save,
  AlertCircle
} from 'lucide-react'

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [stepData, setStepData] = useState<any>({})
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const assessmentSteps = [
    { id: 1, title: 'Personal Information', description: 'Tell us about yourself', completed: true },
    { id: 2, title: 'Skills & Experience', description: 'Your professional background', completed: true },
    { id: 3, title: 'Career Preferences', description: 'What you&apos;re looking for', completed: false },
    { id: 4, title: 'Personality Assessment', description: 'Your work style', completed: false },
    { id: 5, title: 'Results & Recommendations', description: 'Your personalized report', completed: false }
  ]

  useEffect(() => {
    loadAssessmentData()
  }, [])

  const loadAssessmentData = async () => {
    try {
      const response = await apiService.getAssessmentResults('')
      if (response.success) {
        setAssessmentData(response.data)
      }
    } catch (error) {
      console.error('Failed to load assessment data:', error)
    }
  }

  const handleStartAssessment = async (type: 'full' | 'quick') => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiService.startAssessment(type)
      if (response.success) {
        setSessionId(response.data.sessionId)
        setCurrentStep(response.data.currentStep)
        setIsAssessmentStarted(true)
        setSuccessMessage('Assessment started successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError('Failed to start assessment')
      }
    } catch (error) {
      console.error('Failed to start assessment:', error)
      setError('Failed to start assessment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueAssessment = async () => {
    if (!sessionId) return

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiService.submitAssessmentStep(sessionId, currentStep, stepData)
      if (response.success) {
        if (response.data.isComplete) {
          // Assessment completed
          setSuccessMessage('Assessment completed successfully!')
          setTimeout(() => setSuccessMessage(null), 5000)
        } else {
          setCurrentStep(response.data.currentStep)
        }
      } else {
        setError('Failed to submit assessment step')
      }
    } catch (error) {
      console.error('Failed to submit assessment step:', error)
      setError('Failed to submit assessment step')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepDataChange = (field: string, value: any) => {
    setStepData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                value={stepData.fullName || ''}
                onChange={(e) => handleStepDataChange('fullName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={stepData.email || ''}
                onChange={(e) => handleStepDataChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Age</label>
              <input
                type="number"
                value={stepData.age || ''}
                onChange={(e) => handleStepDataChange('age', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Current Job Title</label>
              <input
                type="text"
                value={stepData.jobTitle || ''}
                onChange={(e) => handleStepDataChange('jobTitle', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your current job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Years of Experience</label>
              <select
                value={stepData.experience || ''}
                onChange={(e) => handleStepDataChange('experience', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Key Skills</label>
              <textarea
                value={stepData.skills || ''}
                onChange={(e) => handleStepDataChange('skills', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="List your key skills (comma separated)"
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Preferred Work Environment</label>
              <select
                value={stepData.workEnvironment || ''}
                onChange={(e) => handleStepDataChange('workEnvironment', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select work environment</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Career Goals</label>
              <textarea
                value={stepData.careerGoals || ''}
                onChange={(e) => handleStepDataChange('careerGoals', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your career goals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Industry Preference</label>
              <select
                value={stepData.industry || ''}
                onChange={(e) => handleStepDataChange('industry', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Work Style</label>
              <div className="space-y-3">
                {['Independent', 'Collaborative', 'Leadership', 'Supportive'].map((style) => (
                  <label key={style} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="workStyle"
                      value={style}
                      checked={stepData.workStyle === style}
                      onChange={(e) => handleStepDataChange('workStyle', e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">{style}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Communication Preference</label>
              <div className="space-y-3">
                {['Written', 'Verbal', 'Visual', 'Mixed'].map((pref) => (
                  <label key={pref} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="communication"
                      value={pref}
                      checked={stepData.communication === pref}
                      onChange={(e) => handleStepDataChange('communication', e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">{pref}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="text-center py-8">
            <Sparkles className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-white mb-2">Assessment Complete!</h3>
            <p className="text-slate-400 mb-6">Your personalized career recommendations are being generated.</p>
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )
      default:
        return null
    }
  }

  if (isLoading && !isAssessmentStarted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Loading assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Career Assessment
        </h1>
        <p className="text-slate-400">Discover your perfect career path with our comprehensive assessment tools.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400">
          {successMessage}
        </div>
      )}

      {!isAssessmentStarted ? (
        /* Assessment Overview */
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Assessment Duration"
              value="15-20 min"
              icon={Clock}
              description="Complete at your own pace"
            />
            <StatCard
              title="Questions"
              value="45"
              icon={FileText}
              description="Comprehensive evaluation"
            />
            <StatCard
              title="Success Rate"
              value="94%"
              icon={TrendingUp}
              description="Users find their ideal career"
            />
          </div>

          {/* Assessment Types */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Choose Your Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard
                title="Comprehensive Career Assessment"
                description="Complete evaluation including skills, personality, and preferences for personalized career recommendations."
                icon={Brain}
                action={() => handleStartAssessment('full')}
                actionText={isLoading ? 'Starting...' : 'Start Full Assessment'}
              />
              <ActionCard
                title="Quick Skills Assessment"
                description="Fast evaluation of your current skills and experience to identify immediate opportunities."
                icon={Target}
                action={() => handleStartAssessment('quick')}
                actionText={isLoading ? 'Starting...' : 'Quick Assessment'}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">What You&apos;ll Get</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Personalized Career Paths">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Top 5 matching careers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Skill gap analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Salary expectations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Learning recommendations</span>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Industry Insights">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Market demand analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Growth projections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Required certifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Company recommendations</span>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>
        </div>
      ) : (
        /* Assessment Results */
        <div className="space-y-8">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/50">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">AI Assessment Results</h2>
                <p className="text-gray-300">Comprehensive career analysis powered by advanced AI</p>
              </div>
            </div>
          </div>

          {/* Top Career Paths */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {assessmentData?.results?.careerPaths?.slice(0, 3).map((path: any, index: number) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-400">{path.match}%</span>
                    <span className="text-xs text-gray-400">match</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Confidence</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                          style={{ width: `${path.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-white">{path.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Market Demand</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                          style={{ width: `${path.marketDemand}%` }}
                        />
                      </div>
                      <span className="text-xs text-white">{path.marketDemand}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Growth Potential</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" 
                          style={{ width: `${path.growthPotential}%` }}
                        />
                      </div>
                      <span className="text-xs text-white">{path.growthPotential}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Salary Range</span>
                    <span className="text-sm font-medium text-green-400">{path.salaryRange}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Timeline</span>
                    <span className="text-sm font-medium text-blue-400">{path.timeline}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 4).map((skill: string, skillIndex: number) => (
                      <span key={skillIndex} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Skills Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Overall Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" 
                        style={{ width: `${assessmentData?.results?.skillsAnalysis?.technical?.total || 0}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{assessmentData?.results?.skillsAnalysis?.technical?.total || 0}%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                  <div className="space-y-1">
                    {assessmentData?.results?.skillsAnalysis?.technical?.strengths?.slice(0, 3).map((strength: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-sm text-gray-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">Areas for Improvement</h4>
                  <div className="space-y-1">
                    {assessmentData?.results?.skillsAnalysis?.technical?.improvements?.slice(0, 3).map((improvement: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3 text-yellow-400" />
                        <span className="text-sm text-gray-300">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Soft Skills Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Overall Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" 
                        style={{ width: `${assessmentData?.results?.skillsAnalysis?.soft?.total || 0}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{assessmentData?.results?.skillsAnalysis?.soft?.total || 0}%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                  <div className="space-y-1">
                    {assessmentData?.results?.skillsAnalysis?.soft?.strengths?.slice(0, 3).map((strength: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-sm text-gray-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">Areas for Improvement</h4>
                  <div className="space-y-1">
                    {assessmentData?.results?.skillsAnalysis?.soft?.improvements?.slice(0, 3).map((improvement: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3 text-yellow-400" />
                        <span className="text-sm text-gray-300">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personality Insights */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Personality Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Work Style</h4>
                <p className="text-white">{assessmentData?.results?.personalityInsights?.workStyle || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Leadership Potential</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                      style={{ width: `${assessmentData?.results?.personalityInsights?.leadershipPotential || 0}%` }}
                    />
                  </div>
                  <span className="text-white font-medium">{assessmentData?.results?.personalityInsights?.leadershipPotential || 0}%</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Communication Style</h4>
                <p className="text-white">{assessmentData?.results?.personalityInsights?.communicationStyle || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Stress Handling</h4>
                <p className="text-white">{assessmentData?.results?.personalityInsights?.stressHandling || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Motivation Type</h4>
                <p className="text-white">{assessmentData?.results?.personalityInsights?.motivationType || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Team Fit</h4>
                <div className="flex flex-wrap gap-1">
                  {assessmentData?.results?.personalityInsights?.teamFit?.slice(0, 3).map((fit: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full">
                      {fit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Current Market</h4>
                <p className="text-white">{assessmentData?.results?.marketAnalysis?.currentMarket || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Salary Insights</h4>
                <p className="text-green-400">{assessmentData?.results?.marketAnalysis?.salaryInsights || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Competition Level</h4>
                <p className="text-yellow-400">{assessmentData?.results?.marketAnalysis?.competition || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Growth Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {assessmentData?.results?.marketAnalysis?.growthAreas?.slice(0, 4).map((area: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-green-400 mb-3">Immediate Actions</h4>
                <ul className="space-y-2">
                  {assessmentData?.results?.recommendations?.immediate?.slice(0, 3).map((action: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-3">Short-term Goals</h4>
                <ul className="space-y-2">
                  {assessmentData?.results?.recommendations?.shortTerm?.slice(0, 3).map((goal: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-400 mb-3">Long-term Vision</h4>
                <ul className="space-y-2">
                  {assessmentData?.results?.recommendations?.longTerm?.slice(0, 3).map((vision: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{vision}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-3">Priority Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {assessmentData?.results?.recommendations?.skills?.slice(0, 6).map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Path Preview */}
          {assessmentData?.results?.learningPath?.[0] && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Learning Path - Phase 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Phase</h4>
                  <p className="text-white font-medium">{assessmentData.results.learningPath[0].phase}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Duration</h4>
                  <p className="text-blue-400">{assessmentData.results.learningPath[0].duration}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Skills to Learn</h4>
                  <div className="flex flex-wrap gap-1">
                    {assessmentData.results.learningPath[0].skills.map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Key Milestones</h4>
                  <ul className="space-y-1">
                    {assessmentData.results.learningPath[0].milestones.slice(0, 3).map((milestone: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-sm text-gray-300">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Additional Insights */}
          {assessmentData?.results?.additionalInsights && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Advanced AI Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {assessmentData.results.additionalInsights.marketReadiness}%
                  </div>
                  <div className="text-sm text-gray-400">Market Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {assessmentData.results.additionalInsights.skillVelocity}%
                  </div>
                  <div className="text-sm text-gray-400">Skill Velocity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400 mb-1">
                    {assessmentData.results.additionalInsights.careerTrajectory}
                  </div>
                  <div className="text-sm text-gray-400">Career Trajectory</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {assessmentData.results.additionalInsights.competitiveAdvantage}%
                  </div>
                  <div className="text-sm text-gray-400">Competitive Edge</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.href = '/career-guidance'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>View Career Guidance</span>
            </button>
            <button
              onClick={() => window.location.href = '/resume-scanner'}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Scan Resume</span>
            </button>
            <button
              onClick={() => window.location.href = '/job-matching'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Find Jobs</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
