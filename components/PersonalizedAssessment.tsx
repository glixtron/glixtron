'use client'

import { useState, useEffect } from 'react'
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
  Upload,
  AlertCircle,
  Loader2,
  BookOpen,
  Users,
  Zap
} from 'lucide-react'

interface PersonalizedAssessmentSession {
  id: string
  type: string
  currentStep: string
  steps: Array<{
    id: string
    title: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
  data: any
  startedAt: string
  status: string
  personalized: boolean
  version: string
}

interface PersonalizedQuestion {
  id: string
  category: 'technical' | 'behavioral' | 'situational' | 'career' | 'personality'
  type: 'multiple-choice' | 'text' | 'rating' | 'scenario'
  question: string
  context: string
  options?: string[]
  rationale: string
  weight: number
  adaptive: boolean
  followUpQuestions?: string[]
}

interface AssessmentRoadmap {
  phases: Array<{
    phase: string
    duration: string
    objectives: string[]
    skills: Array<{
      skill: string
      currentLevel: number
      targetLevel: number
      resources: Array<{
        type: string
        title: string
        provider: string
        duration: string
        difficulty: string
        url?: string
        certification: boolean
        priority: 'high' | 'medium' | 'low'
      }>
    }>
    milestones: string[]
    projects: Array<{
      name: string
      description: string
      technologies: string[]
      duration: string
      complexity: 'beginner' | 'intermediate' | 'advanced'
      portfolio: boolean
    }>
    assessments: Array<{
      type: string
      purpose: string
      timeline: string
      successCriteria: string[]
    }>
  }>
  successMetrics: {
    technical: Array<{
      metric: string
      target: string
      measurement: string
      timeline: string
    }>
    behavioral: Array<{
      metric: string
      target: string
      measurement: string
      timeline: string
    }>
    career: Array<{
      metric: string
      target: string
      measurement: string
      timeline: string
    }>
  }
  checkpoints: Array<{
    timeline: string
    objectives: string[]
    assessments: string[]
    adjustments: string[]
  }>
}

export default function PersonalizedAssessment() {
  const [session, setSession] = useState<PersonalizedAssessmentSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentStepData, setCurrentStepData] = useState<any>({})
  
  // Form states
  const [resumeText, setResumeText] = useState('')
  const [careerGoals, setCareerGoals] = useState('')
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({})

  const startPersonalizedAssessment = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/assessment/personalized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'personalized',
          resumeText: resumeText || undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSession(data.data)
        if (data.data.resumeAnalysis) {
          setSuccess('Resume analyzed successfully!')
        }
      } else {
        setError(data.error || 'Failed to start assessment')
      }
    } catch (error) {
      console.error('Start assessment error:', error)
      setError('Failed to start assessment')
    } finally {
      setIsLoading(false)
    }
  }

  const submitCareerGoals = async () => {
    if (!session || !careerGoals.trim()) return

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/assessment/personalized', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          step: 'career_aim_analysis',
          data: { careerGoals }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSession(prev => prev ? { ...prev, ...data.data } : null)
        if (data.data.personalizedQuestions) {
          setCurrentQuestionIndex(0)
          setSuccess('Personalized questions generated!')
        }
      } else {
        setError(data.error || 'Failed to analyze career goals')
      }
    } catch (error) {
      console.error('Career goals error:', error)
      setError('Failed to analyze career goals')
    } finally {
      setIsLoading(false)
    }
  }

  const submitQuestionAnswers = async () => {
    if (!session) return

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/assessment/personalized', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          step: 'personalized_questions',
          data: { answers: { ...questionAnswers, ...followUpAnswers } }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSession(prev => prev ? { ...prev, ...data.data } : null)
        if (data.data.roadmap) {
          setSuccess('Personalized roadmap generated!')
        }
      } else {
        setError(data.error || 'Failed to generate roadmap')
      }
    } catch (error) {
      console.error('Question answers error:', error)
      setError('Failed to generate roadmap')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionAnswer = (questionId: string, answer: any) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleFollowUpAnswer = (questionId: string, answer: string) => {
    setFollowUpAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (session?.data.personalizedQuestions && currentQuestionIndex < session.data.personalizedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const currentQuestion = session?.data.personalizedQuestions?.[currentQuestionIndex]
  const progress = session?.data.personalizedQuestions ? 
    ((currentQuestionIndex + 1) / session.data.personalizedQuestions.length) * 100 : 0

  const renderStepContent = () => {
    if (!session) return null

    switch (session.currentStep) {
      case 'resume_analysis':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Resume Analysis</h3>
              <p className="text-gray-300 mb-6">
                Upload your resume or paste the text to get personalized assessment questions
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here, or upload a file below..."
                  className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Or upload your resume file</p>
                <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                <button className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                  Choose File
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={startPersonalizedAssessment}
                disabled={!resumeText.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case 'career_aim_analysis':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Career Goals</h3>
              <p className="text-gray-300 mb-6">
                Tell us about your career aspirations to personalize your assessment
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What are your career goals and aspirations?
              </label>
              <textarea
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g., I want to become a senior software engineer at a tech company, specializing in full-stack development with expertise in cloud architecture. I'm looking for a role that offers growth opportunities and work-life balance..."
                className="w-full h-48 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2-3 years"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={submitCareerGoals}
                disabled={!careerGoals.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>Analyze Goals</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case 'personalized_questions':
        if (!currentQuestion) return null

        return (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {session.data.personalizedQuestions.length}</span>
                <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  currentQuestion.category === 'technical' ? 'bg-blue-600/20 text-blue-400' :
                  currentQuestion.category === 'behavioral' ? 'bg-green-600/20 text-green-400' :
                  currentQuestion.category === 'situational' ? 'bg-purple-600/20 text-purple-400' :
                  currentQuestion.category === 'career' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-pink-600/20 text-pink-400'
                }`}>
                  {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                </span>
                <span className="text-xs text-gray-400">Weight: {currentQuestion.weight}/10</span>
              </div>

              <h4 className="text-lg font-semibold text-white mb-3">{currentQuestion.question}</h4>
              <p className="text-gray-300 text-sm mb-6">{currentQuestion.context}</p>

              {/* Question Type Rendering */}
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: string, index: number) => (
                    <label key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option}
                        checked={questionAnswers[currentQuestion.id] === option}
                        onChange={(e) => handleQuestionAnswer(currentQuestion.id, e.target.value)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <textarea
                  value={questionAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleQuestionAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              )}

              {currentQuestion.type === 'rating' && (
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleQuestionAnswer(currentQuestion.id, rating)}
                      className={`w-12 h-12 rounded-lg font-medium transition-colors ${
                        questionAnswers[currentQuestion.id] === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}

              {/* Follow-up Questions */}
              {currentQuestion.adaptive && currentQuestion.followUpQuestions && questionAnswers[currentQuestion.id] && (
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <h5 className="text-sm font-medium text-gray-400 mb-3">Follow-up Questions</h5>
                  {currentQuestion.followUpQuestions.map((followUp: string, index: number) => (
                    <div key={index} className="mb-4">
                      <p className="text-white text-sm mb-2">{followUp}</p>
                      <textarea
                        value={followUpAnswers[`${currentQuestion.id}_followup_${index}`] || ''}
                        onChange={(e) => handleFollowUpAnswer(`${currentQuestion.id}_followup_${index}`, e.target.value)}
                        placeholder="Provide additional details..."
                        className="w-full h-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentQuestionIndex < session.data.personalizedQuestions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  disabled={!questionAnswers[currentQuestion.id]}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              ) : (
                <button
                  onClick={submitQuestionAnswers}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Roadmap</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )

      case 'roadmap_generation':
        const roadmap = session.data.roadmap as AssessmentRoadmap
        return (
          <div className="space-y-8">
            {/* Roadmap Header */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/50">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Personalized Career Roadmap</h2>
                  <p className="text-gray-300">AI-generated development plan based on your assessment</p>
                </div>
              </div>
            </div>

            {/* Phases */}
            {roadmap.phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Phase {phaseIndex + 1}: {phase.phase}</h3>
                  <span className="text-blue-400 font-medium">{phase.duration}</span>
                </div>

                {/* Objectives */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Objectives</h4>
                  <ul className="space-y-1">
                    {phase.objectives.map((objective, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-sm text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Skills to Develop</h4>
                  <div className="space-y-3">
                    {phase.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white font-medium">{skill.skill}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            skill.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                            skill.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {skill.priority} priority
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-sm text-gray-400">Current: {skill.currentLevel}%</span>
                          <span className="text-sm text-green-400">→</span>
                          <span className="text-sm text-green-400">Target: {skill.targetLevel}%</span>
                        </div>
                        <div className="space-y-2">
                          <h6 className="text-xs font-medium text-gray-400">Recommended Resources:</h6>
                          {skill.resources.slice(0, 2).map((resource, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{resource.title} - {resource.provider}</span>
                              <span className="text-blue-400">{resource.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Portfolio Projects</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.projects.map((project, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                        <h5 className="text-white font-medium mb-2">{project.name}</h5>
                        <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{project.duration}</span>
                          {project.portfolio && (
                            <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                              Portfolio
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Key Milestones</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.milestones.map((milestone, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        {milestone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Success Metrics */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Success Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-3">Technical</h4>
                  <ul className="space-y-2">
                    {roadmap.successMetrics.technical.map((metric, index) => (
                      <li key={index} className="text-sm">
                        <span className="text-white">{metric.target}</span>
                        <span className="text-gray-400 text-xs block">{metric.timeline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3">Behavioral</h4>
                  <ul className="space-y-2">
                    {roadmap.successMetrics.behavioral.map((metric, index) => (
                      <li key={index} className="text-sm">
                        <span className="text-white">{metric.target}</span>
                        <span className="text-gray-400 text-xs block">{metric.timeline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-400 mb-3">Career</h4>
                  <ul className="space-y-2">
                    {roadmap.successMetrics.career.map((metric, index) => (
                      <li key={index} className="text-sm">
                        <span className="text-white">{metric.target}</span>
                        <span className="text-gray-400 text-xs block">{metric.timeline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

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
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-300">Loading...</p>
          </div>
        )
    }
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Personalized Assessment</h2>
          <p className="text-gray-300 mb-8">
            Get a customized assessment based on your resume and career goals
          </p>
          <button
            onClick={() => setSession({ id: 'temp', type: 'personalized', currentStep: 'resume_analysis', steps: [], data: {}, startedAt: new Date().toISOString(), status: 'in_progress', personalized: true, version: '3.0' })}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Personalized Assessment</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
          {success}
        </div>
      )}

      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {session.steps.find(s => s.id === session.currentStep)?.title || 'Assessment'}
          </h2>
          <span className="text-sm text-gray-400">
            Step {session.steps.findIndex(s => s.status === 'in_progress') + 1} of {session.steps.length}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {session.steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                step.status === 'completed' 
                  ? 'bg-green-500/10 border-green-500/50' 
                  : step.status === 'in_progress'
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-2 ${
                step.status === 'completed' 
                  ? 'bg-green-500 text-white'
                  : step.status === 'in_progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
              <p className="text-xs text-white font-medium">{step.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  )
}
