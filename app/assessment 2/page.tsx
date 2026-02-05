'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

type Step = 1 | 2 | 3 | 4

interface FormData {
  coreSkills: string[]
  softSkills: string[]
  remotePreference: number
  startupPreference: number
}

export default function AssessmentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    coreSkills: [],
    softSkills: [],
    remotePreference: 50,
    startupPreference: 50,
  })

  const [skillInput, setSkillInput] = useState('')
  const softSkillOptions = ['Leadership', 'Empathy', 'Analytics', 'Communication', 'Creativity', 'Problem Solving']

  const handleAddSkill = () => {
    if (skillInput.trim() && formData.coreSkills.length < 3) {
      setFormData({
        ...formData,
        coreSkills: [...formData.coreSkills, skillInput.trim()],
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      coreSkills: formData.coreSkills.filter(s => s !== skill),
    })
  }

  const toggleSoftSkill = (skill: string) => {
    setFormData({
      ...formData,
      softSkills: formData.softSkills.includes(skill)
        ? formData.softSkills.filter(s => s !== skill)
        : [...formData.softSkills, skill],
    })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    setIsAnalyzing(true)
    
    // Save to server if user is logged in
    try {
      const response = await fetch('/api/user/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        console.error('Failed to save assessment')
      }
    } catch (error) {
      console.error('Error saving assessment:', error)
    }
    
    // Also store in localStorage for immediate dashboard access
    localStorage.setItem('assessmentData', JSON.stringify(formData))
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {currentStep} of 3</span>
            <span className="text-sm text-slate-400">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass rounded-2xl p-12 text-center"
            >
              <div className="inline-block mb-6">
                <motion.div
                  className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Analyzing Your Career Genome...</h2>
              <p className="text-slate-400">
                Processing 127 dimensions of your professional profile
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass rounded-2xl p-8 md:p-12"
            >
              {/* Step 1: Core Skills */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold mb-2">Core Skills</h2>
                  <p className="text-slate-400 mb-8">Tell us your top 3 technical or professional skills</p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="e.g., Python, Design, Sales"
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        disabled={formData.coreSkills.length >= 3}
                      />
                      <button
                        onClick={handleAddSkill}
                        disabled={formData.coreSkills.length >= 3 || !skillInput.trim()}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.coreSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.coreSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-blue-400 hover:text-blue-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {formData.coreSkills.length === 0 && (
                      <p className="text-sm text-slate-500">Add up to 3 skills</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Soft Skills */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-3xl font-bold mb-2">Soft Skills</h2>
                  <p className="text-slate-400 mb-8">Select the traits that best describe you</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {softSkillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSoftSkill(skill)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.softSkills.includes(skill)
                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill}</span>
                          {formData.softSkills.includes(skill) && (
                            <Check className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Work Preferences */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-bold mb-2">Work Preferences</h2>
                  <p className="text-slate-400 mb-8">Adjust the sliders to match your preferences</p>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-lg font-medium">Remote vs Office</label>
                        <span className="text-blue-400 font-semibold">
                          {formData.remotePreference}% Remote
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.remotePreference}
                        onChange={(e) => setFormData({ ...formData, remotePreference: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-1">
                        <span>Office</span>
                        <span>Remote</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-lg font-medium">Startup vs Corporate</label>
                        <span className="text-violet-400 font-semibold">
                          {formData.startupPreference}% Startup
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.startupPreference}
                        onChange={(e) => setFormData({ ...formData, startupPreference: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-1">
                        <span>Corporate</span>
                        <span>Startup</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && formData.coreSkills.length === 0) ||
                      (currentStep === 2 && formData.softSkills.length === 0)
                    }
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-medium transition-all"
                  >
                    Complete Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
