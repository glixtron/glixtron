'use client'

// Force Redeploy 2026-v1 - Fix Career Guidance Routing and Layout
export const dynamic = 'force-dynamic'
// REBUILD_v2 - Flattened structure fix

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { apiService } from '@/lib/api-service'
import { 
  TrendingUp, 
  Brain, 
  Target,
  BarChart3,
  Sparkles,
  Users,
  Award,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  FileText,
  Briefcase,
  Upload,
  Download,
  Eye,
  Search,
  Map,
  Play,
  Clock
} from 'lucide-react'

export default function CareerGuidancePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [guidance, setGuidance] = useState<any>(null)
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [jobAnalysis, setJobAnalysis] = useState<any>(null)
  const [assessmentRoadmap, setAssessmentRoadmap] = useState<any>(null)
  const [aiRoadmap, setAiRoadmap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState<any>(null)
  const [isQuerying, setIsQuerying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false)

  useEffect(() => {
    loadCareerData()
  }, [])

  const loadCareerData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load all career data in parallel
      const [guidanceResponse, resumesResponse] = await Promise.all([
        apiService.getCareerGuidance(),
        apiService.getSavedResumes()
      ])

      if (guidanceResponse.success) {
        setGuidance(guidanceResponse.data)
      }

      if (resumesResponse.success) {
        setSavedResumes(resumesResponse.data)
      }

      // Load mock data for other features
      setAssessmentRoadmap({
        currentStep: 2,
        totalSteps: 5,
        steps: [
          { id: 1, name: 'Skills Assessment', status: 'completed', score: 85 },
          { id: 2, name: 'Personality Test', status: 'completed', score: 78 },
          { id: 3, name: 'Career Interests', status: 'current', score: null },
          { id: 4, name: 'Work Values', status: 'pending', score: null },
          { id: 5, name: 'Final Recommendations', status: 'pending', score: null }
        ],
        recommendations: [
          "Focus on technical roles in software development",
          "Consider leadership positions in tech companies",
          "Explore opportunities in emerging technologies"
        ]
      })

      setAiRoadmap({
        careerPath: "Senior Software Engineer → Tech Lead → Engineering Manager",
        timeline: "2-3 years",
        keyMilestones: [
          { title: "Master Advanced React", timeline: "3 months", priority: "High" },
          { title: "Learn Cloud Architecture", timeline: "6 months", priority: "High" },
          { title: "Develop Leadership Skills", timeline: "12 months", priority: "Medium" },
          { title: "Build Team Management Experience", timeline: "18 months", priority: "High" },
          { title: "Network with Industry Leaders", timeline: "24 months", priority: "Medium" }
        ],
        skillsToDevelop: [
          { skill: "System Design", currentLevel: "Intermediate", targetLevel: "Expert" },
          { skill: "Team Leadership", currentLevel: "Beginner", targetLevel: "Advanced" },
          { skill: "Cloud Architecture", currentLevel: "Beginner", targetLevel: "Advanced" },
          { skill: "Product Management", currentLevel: "Beginner", targetLevel: "Intermediate" }
        ]
      })

    } catch (error) {
      console.error('Career data error:', error)
      setError('Failed to load career data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCareerQuery = async () => {
    if (!query.trim()) return

    try {
      setIsQuerying(true)
      setError(null)
      const response = await apiService.submitCareerQuery(query)
      if (response.success) {
        setQueryResult(response.data)
      } else {
        throw new Error('Failed to get career advice')
      }
    } catch (error) {
      console.error('Career query error:', error)
      setError('Failed to get career advice')
    } finally {
      setIsQuerying(false)
    }
  }

  const handleJobAnalysis = async () => {
    if (!jobDescription.trim()) return

    try {
      setIsAnalyzingJob(true)
      setError(null)
      
      // Simulate job analysis API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setJobAnalysis({
        jobTitle: "Senior Full Stack Developer",
        matchScore: 88,
        requiredSkills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
        experienceLevel: "5+ years",
        salaryRange: "$120,000 - $180,000",
        responsibilities: [
          "Develop and maintain web applications",
          "Lead technical projects",
          "Mentor junior developers"
        ],
        qualifications: [
          "Bachelor's degree in Computer Science",
          "5+ years of experience",
          "Strong problem-solving skills"
        ],
        skillGaps: [
          { skill: "AWS", current: "Intermediate", required: "Advanced", gap: "Medium" },
          { skill: "System Design", current: "Beginner", required: "Advanced", gap: "High" }
        ],
        recommendations: [
          "Focus on AWS certification",
          "Build system design projects",
          "Highlight leadership experience"
        ]
      })
    } catch (error) {
      console.error('Job analysis error:', error)
      setError('Failed to analyze job description')
    } finally {
      setIsAnalyzingJob(false)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Target },
    { id: 'job-analysis', name: 'Job Analysis', icon: Search },
    { id: 'resume-analysis', name: 'Resume Analysis', icon: FileText },
    { id: 'assessment-roadmap', name: 'Assessment Roadmap', icon: Map },
    { id: 'ai-roadmap', name: 'AI Roadmap', icon: Brain }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Loading career guidance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Career Guidance
        </h1>
        <p className="text-slate-400">Comprehensive career analysis, job matching, and AI-powered roadmaps.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700/50">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Career Recommendations */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Recommended Career Paths</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidance?.recommendations?.map((rec: any, index: number) => (
                  <ChartCard key={index} title={rec.title}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Match Score</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{rec.matchScore}%</span>
                          <div className="w-16 bg-slate-700/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${rec.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm">{rec.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Salary Range</span>
                          <span className="text-green-400">{rec.salaryRange}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Growth Potential</span>
                          <span className="text-blue-400">{rec.growthPotential}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {rec.skills.map((skill: string, skillIndex: number) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ChartCard>
                ))}
              </div>
            </div>

            {/* AI Career Assistant */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">AI Career Assistant</h2>
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">
                      Ask anything about your career path
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCareerQuery()}
                        placeholder="e.g., What skills should I learn for a senior developer role?"
                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleCareerQuery}
                        disabled={isQuerying || !query.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center"
                      >
                        {isQuerying ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Ask AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {queryResult && (
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-blue-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-white text-sm mb-2">{queryResult.response}</p>
                          {queryResult.relatedTopics && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {queryResult.relatedTopics.map((topic: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs cursor-pointer hover:bg-blue-500/30"
                                  onClick={() => setQuery(topic)}
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'job-analysis' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Job Description Analysis</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">
                        Paste Job Description
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here to analyze..."
                        rows={12}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <button
                      onClick={handleJobAnalysis}
                      disabled={isAnalyzingJob || !jobDescription.trim()}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isAnalyzingJob ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Analyze Job
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {jobAnalysis && (
                  <div className="space-y-6">
                    <ChartCard title="Analysis Results">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Match Score</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{jobAnalysis.matchScore}%</span>
                            <div className="w-20 bg-slate-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${jobAnalysis.matchScore}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-slate-400 text-sm mb-1">Job Title</p>
                            <p className="text-white font-medium">{jobAnalysis.jobTitle}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm mb-1">Experience Level</p>
                            <p className="text-white font-medium">{jobAnalysis.experienceLevel}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm mb-1">Salary Range</p>
                            <p className="text-green-400 font-medium">{jobAnalysis.salaryRange}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm mb-1">Required Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {jobAnalysis.requiredSkills.slice(0, 3).map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ChartCard>

                    {jobAnalysis.skillGaps && (
                      <ChartCard title="Skill Gaps">
                        <div className="space-y-3">
                          {jobAnalysis.skillGaps.map((gap: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                              <div>
                                <p className="text-white font-medium">{gap.skill}</p>
                                <p className="text-slate-400 text-sm">
                                  Current: {gap.current} → Required: {gap.required}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                gap.gap === 'High' ? 'bg-red-500/10 text-red-400' :
                                gap.gap === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-green-500/10 text-green-400'
                              }`}>
                                {gap.gap} Gap
                              </span>
                            </div>
                          ))}
                        </div>
                      </ChartCard>
                    )}

                    {jobAnalysis.recommendations && (
                      <ChartCard title="Recommendations">
                        <div className="space-y-3">
                          {jobAnalysis.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                              <span className="text-slate-300 text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </ChartCard>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume-analysis' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Saved Resumes</h2>
              {savedResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedResumes.map((resume: any, index: number) => (
                    <ChartCard key={index} title={resume.name}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">ATS Score</span>
                          <span className="text-green-400 font-medium">{resume.atsScore}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Overall Score</span>
                          <span className="text-blue-400 font-medium">{resume.overallScore}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Uploaded</span>
                          <span className="text-slate-300 text-sm">{resume.uploadDate}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm">
                            <Eye className="h-3 w-3 inline mr-1" />
                            View
                          </button>
                          <button className="flex-1 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm">
                            <Download className="h-3 w-3 inline mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    </ChartCard>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-12 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No resumes uploaded yet</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Upload your resume to get detailed analysis and improvement suggestions
                  </p>
                  <button
                    onClick={() => window.location.href = '/resume-scanner'}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assessment-roadmap' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Assessment-Based Roadmap</h2>
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm">Progress</span>
                    <span className="text-white font-medium">
                      Step 2 of 5
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 mb-6">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: '40%' }}
                    />
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: 1, name: 'Skills Assessment', status: 'completed', score: 85 },
                      { id: 2, name: 'Personality Test', status: 'completed', score: 78 },
                      { id: 3, name: 'Career Interests', status: 'current', score: null },
                      { id: 4, name: 'Work Values', status: 'pending', score: null },
                      { id: 5, name: 'Final Recommendations', status: 'pending', score: null }
                    ].map((step: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          step.status === 'current' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : step.status === 'current' ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{step.name}</p>
                          {step.score && (
                            <p className="text-slate-400 text-sm">Score: {step.score}%</p>
                          )}
                        </div>
                        {step.status === 'current' && (
                          <button className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm">
                            Continue
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-roadmap' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">AI-Powered Career Roadmap</h2>
              <div className="space-y-6">
                <ChartCard title="Career Path">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Map className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-white font-medium text-lg">Senior Software Engineer → Tech Lead → Engineering Manager</p>
                        <p className="text-slate-400 text-sm">Timeline: 2-3 years</p>
                      </div>
                    </div>
                  </div>
                </ChartCard>

                <ChartCard title="Key Milestones">
                  <div className="space-y-3">
                    {[
                      { title: "Master Advanced React", timeline: "3 months", priority: "High" },
                      { title: "Learn Cloud Architecture", timeline: "6 months", priority: "High" },
                      { title: "Develop Leadership Skills", timeline: "12 months", priority: "Medium" },
                      { title: "Build Team Management Experience", timeline: "18 months", priority: "High" }
                    ].map((milestone: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          <Target className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{milestone.title}</p>
                          <p className="text-slate-400 text-sm">{milestone.timeline}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          milestone.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {milestone.priority} Priority
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                <ChartCard title="Skills to Develop">
                  <div className="space-y-3">
                    {[
                      { skill: "System Design", currentLevel: "Intermediate", targetLevel: "Expert" },
                      { skill: "Team Leadership", currentLevel: "Beginner", targetLevel: "Advanced" },
                      { skill: "Cloud Architecture", currentLevel: "Beginner", targetLevel: "Advanced" },
                      { skill: "Product Management", currentLevel: "Beginner", targetLevel: "Intermediate" }
                    ].map((skill: any, index: number) => (
                      <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">{skill.skill}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 text-sm">{skill.currentLevel}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                            <span className="text-blue-400 text-sm">{skill.targetLevel}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ 
                              width: skill.targetLevel === 'Expert' ? '100%' :
                                     skill.targetLevel === 'Advanced' ? '75%' :
                                     skill.targetLevel === 'Intermediate' ? '50%' : '25%'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// Cache bust: Fri Jan 30 18:48:06 IST 2026
// Cache cleared: Fri Jan 30 18:53:40 IST 2026
// Cache bust: 1769780465
