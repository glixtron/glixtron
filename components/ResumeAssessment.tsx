'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Brain,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Star,
  Zap,
  BarChart3,
  Award,
  BookOpen,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Play
} from 'lucide-react'

interface ResumeExtractionResult {
  success: boolean
  content: string
  metadata?: {
    extractedAt: string
    wordCount: number
    readingTime: number
    sections: any[]
  }
  analysis?: any
  error?: string
}

interface FieldQuestion {
  id: string
  question: string
  type: 'single' | 'multiple' | 'text' | 'rating'
  options?: string[]
  category: string
  required?: boolean
}

interface AssessmentState {
  step: 'upload' | 'analysis' | 'questions' | 'results'
  resumeData: ResumeExtractionResult | null
  identifiedField: string
  questions: FieldQuestion[]
  answers: Record<string, any>
  results: any
}

export default function ResumeAssessment() {
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    step: 'upload',
    resumeData: null,
    identifiedField: '',
    questions: [],
    answers: {},
    results: null
  })

  const [loading, setLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleFileUpload = async () => {
    if (!resumeFile) {
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('action', 'upload-resume')
      formData.append('resumeFile', resumeFile)

      const response = await fetch('/api/resume-assessment', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setAssessmentState(prev => ({
          ...prev,
          step: 'analysis',
          resumeData: data.data.extraction,
          identifiedField: data.data.analysis.likelyField
        }))
      } else {
        alert('Failed to process resume: ' + data.error)
      }
    } catch (error) {
      console.error('Resume upload error:', error)
      alert('Failed to upload resume')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeResume = async () => {
    if (!assessmentState.resumeData) {
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('action', 'generate-questions')
      formData.append('resumeContent', assessmentState.resumeData.content)
      formData.append('identifiedField', assessmentState.identifiedField)
      formData.append('resumeAnalysis', JSON.stringify(assessmentState.resumeData.analysis))

      const response = await fetch('/api/resume-assessment', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setAssessmentState(prev => ({
          ...prev,
          step: 'questions',
          questions: data.data.questions
        }))
      } else {
        alert('Failed to generate questions: ' + data.error)
      }
    } catch (error) {
      console.error('Question generation error:', error)
      alert('Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAssessmentState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessmentState.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmitAnswers()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitAnswers = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('action', 'submit-answers')
      formData.append('answers', JSON.stringify(assessmentState.answers))
      formData.append('resumeContent', assessmentState.resumeData?.content || '')
      formData.append('identifiedField', assessmentState.identifiedField)
      formData.append('resumeAnalysis', JSON.stringify(assessmentState.resumeData?.analysis || {}))

      const response = await fetch('/api/resume-assessment', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setAssessmentState(prev => ({
          ...prev,
          step: 'results',
          results: data.data
        }))
      } else {
        alert('Failed to submit answers: ' + data.error)
      }
    } catch (error) {
      console.error('Answer submission error:', error)
      alert('Failed to submit answers')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/html',
        'application/msword'
      ]

      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = ['pdf', 'docx', 'doc', 'txt', 'html', 'htm']

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
        alert('Please upload a valid resume file (PDF, DOCX, DOC, TXT, or HTML)')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      setResumeFile(file)
    }
  }

  const currentQuestion = assessmentState.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessmentState.questions.length) * 100

  const getFieldDisplayName = (field: string) => {
    return field.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Resume-Based Career Assessment</h1>
        <p className="text-gray-600">Upload your resume for personalized career guidance based on your actual experience</p>
      </div>

      {/* Step 1: Resume Upload */}
      {assessmentState.step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Step 1: Upload Your Resume
            </CardTitle>
            <CardDescription>
              Upload your resume to extract your skills, experience, and generate personalized career guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-gray-600 mb-4">
                  Supported formats: PDF, DOCX, DOC, TXT, HTML (Max 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.html,.htm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-file-input"
                />
                <label 
                  htmlFor="resume-file-input"
                  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                >
                  Choose Resume File
                </label>
                {resumeFile && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Selected: {resumeFile.name}
                  </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleFileUpload} 
                disabled={loading || !resumeFile}
                className="w-full"
                size="lg"
              >
                {loading ? 'Processing Resume...' : 'Upload and Analyze Resume'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Resume Analysis */}
      {assessmentState.step === 'analysis' && assessmentState.resumeData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Step 2: Resume Analysis Complete
            </CardTitle>
            <CardDescription>
              We&apos;ve analyzed your resume and identified your field: {getFieldDisplayName(assessmentState.identifiedField)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Extracted Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Field:</strong> {getFieldDisplayName(assessmentState.identifiedField)}</div>
                    <div><strong>Word Count:</strong> {assessmentState.resumeData.metadata?.wordCount || 0}</div>
                    <div><strong>Reading Time:</strong> {assessmentState.resumeData.metadata?.readingTime || 0} min</div>
                    <div><strong>Sections Found:</strong> {assessmentState.resumeData.metadata?.sections?.length || 0}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis Results</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Experience Level:</strong> {assessmentState.resumeData.analysis?.experienceLevel || 'Not determined'}</div>
                    <div><strong>Total Skills:</strong> {assessmentState.resumeData.analysis?.skills?.totalSkills || 0}</div>
                    <div><strong>Has Projects:</strong> {assessmentState.resumeData.analysis?.projects?.hasProjects ? 'Yes' : 'No'}</div>
                    <div><strong>Has Certifications:</strong> {assessmentState.resumeData.analysis?.certifications?.hasCertifications ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                <h3 className="font-semibold mb-2">Resume Preview</h3>
                <p className="text-sm text-gray-600 line-clamp-6">
                  {assessmentState.resumeData.content.substring(0, 500)}...
                </p>
              </div>

              <Button 
                onClick={handleAnalyzeResume} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Generating Questions...' : 'Generate Personalized Questions'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Personalized Questions */}
      {assessmentState.step === 'questions' && currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Step 3: Personalized Assessment Questions
            </CardTitle>
            <CardDescription>
              Answer these field-specific questions for {getFieldDisplayName(assessmentState.identifiedField)} to get personalized career guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Question {currentQuestionIndex + 1} of {assessmentState.questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              {/* Question */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start gap-2 mb-4">
                  <Badge variant="outline" className="mt-1">
                    {currentQuestion.category}
                  </Badge>
                  {currentQuestion.required && (
                    <Badge variant="destructive" className="mt-1">
                      Required
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                
                {/* Answer Options */}
                {currentQuestion.type === 'single' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={assessmentState.answers[currentQuestion.id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'multiple' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={option}
                          checked={assessmentState.answers[currentQuestion.id]?.includes(option) || false}
                          onChange={(e) => {
                            const currentAnswers = assessmentState.answers[currentQuestion.id] || []
                            if (e.target.checked) {
                              handleAnswerChange(currentQuestion.id, [...currentAnswers, option])
                            } else {
                              handleAnswerChange(currentQuestion.id, currentAnswers.filter((a: string) => a !== option))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <textarea
                    value={assessmentState.answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full p-3 border rounded-md"
                    rows={4}
                    placeholder="Enter your answer..."
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={!assessmentState.answers[currentQuestion.id] && currentQuestion.required}
                >
                  {currentQuestionIndex === assessmentState.questions.length - 1 ? 'Submit Answers' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {assessmentState.step === 'results' && assessmentState.results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Assessment Complete - Your Personalized Career Roadmap
              </CardTitle>
              <CardDescription>
                Based on your resume and answers, here&apos;s your personalized career guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="roadmap" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                  <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
                </TabsList>

                <TabsContent value="roadmap" className="space-y-4">
                  {assessmentState.results.personalizedRoadmap && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Immediate Actions (1-3 months)
                        </h3>
                        <div className="space-y-2">
                          {assessmentState.results.personalizedRoadmap.immediate.map((item: any, index: number) => (
                            <div key={index} className="border-l-4 border-red-500 pl-4">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{item.timeline}</span>
                                <Badge className={
                                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {item.priority} priority
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Short-term Goals (3-6 months)
                        </h3>
                        <div className="space-y-2">
                          {assessmentState.results.personalizedRoadmap.shortTerm.map((item: any, index: number) => (
                            <div key={index} className="border-l-4 border-yellow-500 pl-4">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{item.timeline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Long-term Vision (1-2 years)
                        </h3>
                        <div className="space-y-2">
                          {assessmentState.results.personalizedRoadmap.longTerm.map((item: any, index: number) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{item.timeline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  {assessmentState.results.guidance?.recommendations && (
                    <div className="space-y-4">
                      {assessmentState.results.guidance.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{rec.jobTitle}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{rec.field}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                {rec.matchScore}% match
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{rec.description}</p>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Salary Range:</span> {rec.salaryRange}
                            </div>
                            <div>
                              <span className="font-medium">Growth Potential:</span> {rec.growthPotential}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  {assessmentState.results.guidance?.skillGap && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Current Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {assessmentState.results.guidance.skillGap.currentSkills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Skills to Develop</h3>
                        <div className="flex flex-wrap gap-2">
                          {assessmentState.results.guidance.skillGap.missingSkills.map((skill: string, index: number) => (
                            <Badge key={index} variant="destructive">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="next-steps" className="space-y-4">
                  {assessmentState.results.guidance?.nextSteps && (
                    <div className="space-y-4">
                      {assessmentState.results.guidance.nextSteps.map((step: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{step.action}</h3>
                            <Badge className={
                              step.priority === 'high' ? 'bg-red-100 text-red-800' :
                              step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {step.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.timeline}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
