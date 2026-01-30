'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { 
  FileText, 
  Brain, 
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Award
} from 'lucide-react'

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false)

  const assessmentSteps = [
    { id: 1, title: 'Personal Information', description: 'Tell us about yourself', completed: true },
    { id: 2, title: 'Skills & Experience', description: 'Your professional background', completed: true },
    { id: 3, title: 'Career Preferences', description: 'What you\'re looking for', completed: false },
    { id: 4, title: 'Personality Assessment', description: 'Your work style', completed: false },
    { id: 5, title: 'Results & Recommendations', description: 'Your personalized report', completed: false }
  ]

  const handleStartAssessment = () => {
    setIsAssessmentStarted(true)
    setCurrentStep(1)
  }

  const handleContinueAssessment = () => {
    if (currentStep < assessmentSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Career Assessment</h1>
        <p className="text-slate-400">Discover your perfect career path with our comprehensive assessment tools.</p>
      </div>

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
                icon={<Brain className="h-6 w-6 text-brand-accent" />}
                action={handleStartAssessment}
                actionText="Start Full Assessment"
              />
              <ActionCard
                title="Quick Skills Assessment"
                description="Fast evaluation of your current skills and experience to identify immediate opportunities."
                icon={<Target className="h-6 w-6 text-brand-accent" />}
                action={() => console.log('Quick assessment')}
                actionText="Quick Assessment"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">What You'll Get</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Personalized Career Paths">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Top 5 matching careers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Skill gap analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Salary expectations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Learning recommendations</span>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Industry Insights">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Market demand analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Growth projections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
                    <span className="text-slate-300">Required certifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-success" />
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
            
            <div className="w-full bg-brand-surface rounded-full h-2">
              <div 
                className="bg-brand-accent h-2 rounded-full transition-all duration-300"
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
                    ? 'bg-brand-success/10 border-brand-success/50' 
                    : currentStep === step.id
                    ? 'bg-brand-accent/10 border-brand-accent/50'
                    : 'bg-brand-glass border-slate-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-brand-success text-white'
                      : currentStep === step.id
                      ? 'bg-brand-accent text-white'
                      : 'bg-brand-surface text-slate-400'
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
          <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              {assessmentSteps[currentStep - 1].title}
            </h3>
            <p className="text-slate-400 mb-6">
              {assessmentSteps[currentStep - 1].description}
            </p>
            
            <div className="bg-brand-glass rounded-lg p-6 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-brand-accent mx-auto mb-4" />
                <p className="text-slate-300">Assessment content for step {currentStep}</p>
                <p className="text-slate-500 text-sm mt-2">Interactive form would go here</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-brand-surface text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={handleContinueAssessment}
              className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {currentStep === assessmentSteps.length ? 'View Results' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
