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
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <p className="text-white text-lg">Loading assessment...</p>
          </div>
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
                icon={<Brain className="h-6 w-6 text-blue-400" />}
                action={() => handleStartAssessment('full')}
                actionText={isLoading ? 'Starting...' : 'Start Full Assessment'}
              />
              <ActionCard
                title="Quick Skills Assessment"
                description="Fast evaluation of your current skills and experience to identify immediate opportunities."
                icon={<Target className="h-6 w-6 text-blue-400" />}
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
        /* Assessment in Progress */
        <div className="space-y-8">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Assessment Progress</h2>
              <span className="text-slate-400">
                Step {currentStep} of {assessmentSteps.length}
              </span>
            </div>
            
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / assessmentSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {assessmentSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  step.completed 
                    ? 'bg-green-500/10 border-green-500/50' 
                    : currentStep === step.id
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{step.title}</p>
                    <p className="text-slate-400 text-xs">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              {assessmentSteps[currentStep - 1].title}
            </h3>
            <p className="text-slate-400 mb-6">
              {assessmentSteps[currentStep - 1].description}
            </p>
            
            <div className="bg-slate-800/50 rounded-lg p-6 min-h-[200px]">
              {renderStepContent()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || isLoading}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={handleContinueAssessment}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === assessmentSteps.length ? 'View Results' : 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
