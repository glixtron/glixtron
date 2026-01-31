'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import ErrorBoundary from '@/components/ErrorBoundary'
import { apiService } from '@/lib/api-service'
import { 
  TrendingUp, 
  Brain, 
  Target,
  Award,
  FileText,
  Users,
  Globe,
  Calendar,
  Circle,
  CheckCircle,
  MessageSquare,
  Code,
  Palette,
  Lightbulb,
  Compass,
  Building,
  Rocket,
  ArrowRight,
  BarChart3,
  Briefcase,
  BookOpen
} from 'lucide-react'

interface ExtractedJD {
  jobTitle: string
  companyName: string
  keySkills: string[]
  experienceLevel: string
  salaryRange: string
  location: string
  remote: string
  employmentType: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  applicationDeadline: string
  rawContent: string
  extractedAt: string
  aiEnhanced: boolean
}

interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  skills: string[]
  resources: { title: string; type: 'course' | 'project' | 'article'; url: string }[]
}

interface RoadmapState {
  steps: RoadmapStep[]
  currentMilestone: string
  targetDate: string
  progressScore: number
}

interface SkillGap {
  skill: string
  current: number
  target: number
  category: 'technical' | 'soft' | 'domain'
}

interface MarketInsight {
  metric: string
  value: string
  trend: 'up' | 'down' | 'stable'
  change: string
}

export default function CareerGuidancePage() {
  const [roadmap, setRoadmap] = useState<RoadmapState>({
    steps: [],
    currentMilestone: 'Getting Started',
    targetDate: '6 months',
    progressScore: 25
  })
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([])
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'skills' | 'insights' | 'job-analysis'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [extractedJD, setExtractedJD] = useState<ExtractedJD | null>(null)
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  const [careerQuery, setCareerQuery] = useState('')
  const [savedResumes, setSavedResumes] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)

  // Initialize searchParams safely
  useEffect(() => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
      setSearchParams(params)
    } catch (error) {
      console.error('Failed to initialize searchParams:', error)
      setSearchParams(new URLSearchParams())
    }
  }, [])

  useEffect(() => {
    // Only proceed when searchParams is available
    if (!searchParams) {
      console.warn('searchParams not available, skipping JD data loading')
      loadCareerGuidance()
      loadDashboardData()
      loadSavedResumes()
      return
    }

    // Check for JD data in URL parameters
    const jdParam = searchParams.get('jd')
    if (jdParam) {
      try {
        const jdData = JSON.parse(decodeURIComponent(jdParam))
        setExtractedJD(jdData)
        console.log('Loaded JD data from URL:', jdData)
      } catch (error) {
        console.error('Failed to parse JD data:', error)
        // Don't crash the page, just continue without JD data
      }
    }
    
    loadCareerGuidance()
    loadDashboardData()
    loadSavedResumes()
  }, [searchParams])

  const loadCareerGuidance = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getCareerGuidance()
      
      if (response.success) {
        setRoadmap({
          steps: response.data.roadmap || [],
          currentMilestone: response.data.currentMilestone || 'Getting Started',
          targetDate: response.data.targetDate || '6 months',
          progressScore: response.data.progressScore || 25
        })
        setSkillGaps(response.data.skillGaps || [])
        setMarketInsights(response.data.marketInsights || [])
      } else {
        // Use mock data if API fails
        console.warn('API failed, using mock data:', response.error)
        loadMockData()
      }
    } catch (error) {
      console.error('Failed to load career guidance:', error)
      setError('Failed to load career guidance. Using demo data.')
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      const response = await apiService.getDashboardStats()
      if (response.success) {
        setDashboardStats(response.data)
      } else {
        console.warn('Dashboard stats failed, using defaults')
        setDashboardStats({
          careerProgress: "65%",
          careerTrend: "5% from last month",
          projectsCompleted: "7",
          projectTrend: "2 this week",
          marketReadiness: "78%",
          readinessTrend: "3% improvement"
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
      // Set default values to prevent crashes
      setDashboardStats({
        careerProgress: "65%",
        careerTrend: "5% from last month",
        projectsCompleted: "7",
        projectTrend: "2 this week",
        marketReadiness: "78%",
        readinessTrend: "3% improvement"
      })
    }
  }

  const loadSavedResumes = async () => {
    try {
      const response = await apiService.getSavedResumes()
      if (response.success) {
        setSavedResumes(response.data || [])
      } else {
        console.warn('Saved resumes failed, using empty array')
        setSavedResumes([])
      }
    } catch (error) {
      console.error('Failed to load saved resumes:', error)
      // Set empty array to prevent crashes
      setSavedResumes([])
    }
  }

  const loadMockData = () => {
    setRoadmap({
      steps: [
        {
          id: '1',
          title: 'Foundation Building',
        description: 'Master core technical skills and build fundamental knowledge',
        duration: '3-4 months',
        completed: false,
        skills: ['JavaScript', 'React', 'Node.js', 'Git'],
        resources: [
          { title: 'Complete React Developer Course', type: 'course', url: '#' },
          { title: 'Build a Portfolio Website', type: 'project', url: '#' },
          { title: 'Understanding Modern Web Development', type: 'article', url: '#' }
        ]
      },
      {
        id: '2',
        title: 'Specialization',
        description: 'Focus on advanced topics and specialize in your chosen domain',
        duration: '4-6 months',
        completed: false,
        skills: ['Advanced React', 'TypeScript', 'Cloud Services', 'Database Design'],
        resources: [
          { title: 'Advanced TypeScript Patterns', type: 'course', url: '#' },
          { title: 'Full-Stack Application', type: 'project', url: '#' },
          { title: 'Cloud Architecture Best Practices', type: 'article', url: '#' }
        ]
      },
      {
        id: '3',
        title: 'Portfolio Development',
        description: 'Create impressive projects that showcase your expertise',
        duration: '2-3 months',
        completed: false,
        skills: ['Project Management', 'UI/UX Design', 'Testing', 'Documentation'],
        resources: [
          { title: 'Design Systems Course', type: 'course', url: '#' },
          { title: 'Open Source Contribution', type: 'project', url: '#' },
          { title: 'Building Developer Portfolios', type: 'article', url: '#' }
        ]
      },
      {
        id: '4',
        title: 'Interview Preparation',
        description: 'Sharpen your technical and soft skills for job interviews',
        duration: '1-2 months',
        completed: false,
        skills: ['Problem Solving', 'Communication', 'System Design', 'Behavioral Skills'],
        resources: [
          { title: 'System Design Interview', type: 'course', url: '#' },
          { title: 'Mock Interview Practice', type: 'project', url: '#' },
          { title: 'Technical Interview Guide', type: 'article', url: '#' }
        ]
      }
    ],
    currentMilestone: 'Foundation Building',
    targetDate: '6 months',
    progressScore: 25
    })

    setSkillGaps([
      { skill: 'React/Next.js', current: 75, target: 90, category: 'technical' },
      { skill: 'TypeScript', current: 60, target: 85, category: 'technical' },
      { skill: 'System Design', current: 40, target: 80, category: 'technical' },
      { skill: 'Communication', current: 70, target: 90, category: 'soft' },
      { skill: 'Leadership', current: 50, target: 75, category: 'soft' },
      { skill: 'Cloud Architecture', current: 55, target: 80, category: 'domain' }
    ])

    setMarketInsights([
      { metric: 'Job Openings', value: '12,450', trend: 'up', change: '+15%' },
      { metric: 'Average Salary', value: '$125,000', trend: 'up', change: '+8%' },
      { metric: 'Remote Jobs', value: '68%', trend: 'up', change: '+12%' },
      { metric: 'Market Demand', value: 'Very High', trend: 'stable', change: '0%' }
    ])
  }

  const generateRoadmap = async () => {
    setIsGeneratingRoadmap(true)
    try {
      // Simulate API call for roadmap generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Enhanced roadmap based on user's current skills and goals
      const enhancedRoadmap = [
        {
          id: '1',
          title: 'Skill Enhancement Phase',
          description: 'Focus on closing critical skill gaps identified in your assessment',
          duration: '2-3 months',
          completed: false,
          skills: ['React/Next.js', 'TypeScript', 'Cloud Architecture'],
          resources: [
            { title: 'Advanced React Patterns', type: 'course' as const, url: '#' },
            { title: 'TypeScript Mastery', type: 'course' as const, url: '#' },
            { title: 'AWS Cloud Practitioner', type: 'course' as const, url: '#' }
          ]
        },
        {
          id: '2',
          title: 'Project Portfolio Building',
          description: 'Master technical and behavioral interviews for top companies',
          duration: '1-2 months',
          completed: false,
          skills: ['Problem Solving', 'Communication', 'System Design'],
          resources: [
            { title: 'LeetCode Premium', type: 'course' as const, url: '#' },
            { title: 'Mock Interview Sessions', type: 'project' as const, url: '#' },
            { title: 'Salary Negotiation Guide', type: 'article' as const, url: '#' }
          ]
        }
      ]
      
      setRoadmap({
        steps: enhancedRoadmap,
        currentMilestone: 'Skill Enhancement',
        targetDate: '4 months',
        progressScore: 35
      })
    } catch (error) {
      console.error('Failed to generate roadmap:', error)
    } finally {
      setIsGeneratingRoadmap(false)
    }
  }

  const handleCareerQuery = async () => {
    if (!careerQuery.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🚀 Submitting career query:', careerQuery)
      
      const response = await apiService.submitCareerQuery(careerQuery)
      console.log('📊 API response:', response)
      
      if (response.success) {
        // Update UI with AI response
        console.log('✅ Career guidance response:', response.data)
        
        // Extract roadmap update from AI response
        const aiResponse = response.data.response || response.data.message || ''
        console.log('🤖 AI Response:', aiResponse)
        
        // Look for ROADMAP_UPDATE JSON block in AI response
        const roadmapMatch = aiResponse.match(/ROADMAP_UPDATE:\s*({.*?})/m)
        if (roadmapMatch) {
          try {
            const roadmapData = JSON.parse(roadmapMatch[1])
            console.log('🗺️ Roadmap Update Found:', roadmapData)
            
            // Update roadmap state
            setRoadmap(prev => ({
              ...prev,
              currentMilestone: roadmapData.milestone || prev.currentMilestone,
              targetDate: roadmapData.targetDate || prev.targetDate,
              progressScore: roadmapData.progressScore || prev.progressScore
            }))
            
            // Save to MongoDB
            await updateRoadmapInDB(roadmapData)
            
            // Show success message
            setSuccess('Career advice received and roadmap updated!')
          } catch (parseError) {
            console.warn('⚠️ Failed to parse roadmap update:', parseError)
            setSuccess('Career advice received!')
          }
        } else {
          setSuccess('Career advice received!')
        }
        
        // You could show the response in a modal or notification
      } else {
        console.error('❌ Career query failed:', response.error)
        setError(response.error || 'Failed to get career advice. Please try again.')
      }
    } catch (error) {
      console.error('❌ Failed to submit career query:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Update roadmap in MongoDB
  const updateRoadmapInDB = async (roadmapData: any) => {
    try {
      const response = await fetch('/api/user/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapData)
      })
      
      if (response.ok) {
        console.log('✅ Roadmap updated in database')
      } else {
        console.warn('⚠️ Failed to update roadmap in database')
      }
    } catch (error) {
      console.warn('⚠️ Error updating roadmap in database:', error)
    }
  }

  const handleJobMatching = async () => {
    try {
      // Navigate to job matching with user's skills
      const userSkills = skillGaps.map(skill => skill.skill)
      const queryParams = new URLSearchParams({
        skills: userSkills.join(','),
        experience: 'intermediate',
        preferred: 'remote'
      })
      
      window.location.href = `/job-matching?${queryParams.toString()}`
    } catch (error) {
      console.error('Failed to navigate to job matching:', error)
      // Show user-friendly error
    }
  }

  const handleSkillAssessment = async () => {
    try {
      const response = await apiService.startAssessment('full')
      if (response.success) {
        window.location.href = `/assessment?id=${response.data.assessmentId}`
      } else {
        window.location.href = '/assessment'
      }
    } catch (error) {
      console.error('Failed to start assessment:', error)
      // Fallback to direct navigation
      window.location.href = '/assessment'
    }
  }

  const handleResumeAnalysis = () => {
    try {
      if (savedResumes.length > 0) {
        window.location.href = '/resume-scanner'
      } else {
        window.location.href = '/resume-scanner?upload=true'
      }
    } catch (error) {
      console.error('Failed to navigate to resume scanner:', error)
      // Show user-friendly error
    }
  }

  const getSkillIcon = (skill: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'React/Next.js': Code,
      'TypeScript': Code,
      'System Design': Target,
      'Communication': Users,
      'Leadership': Award,
      'Cloud Architecture': Globe
    }
    return iconMap[skill] || Brain
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400 rotate-90" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Career Guidance</h1>
            <p className="text-gray-400">Your personalized path to career success with AI-powered insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Overview
            </button>
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
            {extractedJD && (
              <button
                onClick={() => setActiveTab('job-analysis')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'job-analysis' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                Job Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Career Progress"
            value={dashboardStats?.careerProgress || "65%"}
            icon={TrendingUp}
            trend={{ value: dashboardStats?.careerTrend || "12% from last month", isPositive: true }}
          />
          <StatCard
            title="Skills Mastered"
            value={`${skillGaps.filter(s => s.current >= s.target).length}/${skillGaps.length}`}
            icon={Brain}
            trend={{ value: `${skillGaps.filter(s => s.current < s.target).length} skills to improve`, isPositive: false }}
          />
          <StatCard
            title="Projects Completed"
            value={dashboardStats?.projectsCompleted || "7"}
            icon={Target}
            trend={{ value: dashboardStats?.projectTrend || "2 this month", isPositive: true }}
          />
          <StatCard
            title="Market Readiness"
            value={dashboardStats?.marketReadiness || "78%"}
            icon={Award}
            trend={{ value: dashboardStats?.readinessTrend || "5% improvement", isPositive: true }}
          />
        </div>
      )}

      {/* Roadmap Tab */}
      {activeTab === 'roadmap' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">AI-Generated Career Roadmap</h2>
            <button
              onClick={generateRoadmap}
              disabled={isGeneratingRoadmap}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {isGeneratingRoadmap ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Generate My Roadmap</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {roadmap.steps.map((step: RoadmapStep, index: number) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < roadmap.steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-700"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Step Circle */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-600 border-2 border-green-400' 
                      : 'bg-slate-800 border-2 border-slate-600'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-lg shadow-blue-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{step.duration}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Skills to Master</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="flex items-center space-x-1 px-3 py-1 bg-slate-800 rounded-full text-sm text-gray-300"
                          >
                            {getSkillIcon(skill)}
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Resources</h4>
                      <div className="space-y-2">
                        {step.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                resource.type === 'course' ? 'bg-blue-400' :
                                resource.type === 'project' ? 'bg-green-400' : 'bg-purple-400'
                              }`}></div>
                              <span className="text-sm text-gray-300">{resource.title}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Skill Gap Analysis</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillGaps.map((skill, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-lg shadow-blue-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      skill.category === 'technical' ? 'bg-blue-600/20 text-blue-400' :
                      skill.category === 'soft' ? 'bg-green-600/20 text-green-400' : 'bg-purple-600/20 text-purple-400'
                    }`}>
                      {getSkillIcon(skill.skill)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{skill.skill}</h3>
                      <span className="text-xs text-gray-400 capitalize">{skill.category} Skills</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{skill.current}%</div>
                    <div className="text-sm text-gray-400">Target: {skill.target}%</div>
                  </div>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Current Level</span>
                      <span>{skill.current}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.current}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Target Level</span>
                      <span>{skill.target}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.target}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Gap Indicator */}
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Gap to Close</span>
                    <span className={`text-sm font-medium ${
                      skill.target - skill.current > 20 ? 'text-red-400' :
                      skill.target - skill.current > 10 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {skill.target - skill.current}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Market Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-lg shadow-blue-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-400">{insight.metric}</span>
                  </div>
                  {getTrendIcon(insight.trend)}
                </div>
                
                <div className="text-2xl font-bold text-white mb-2">{insight.value}</div>
                <div className={`text-sm ${
                  insight.trend === 'up' ? 'text-green-400' :
                  insight.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {insight.change} from last month
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Smart Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard
                title="Focus on High-Demand Skills"
                description="Based on market analysis, React, TypeScript, and Cloud Architecture have the highest demand."
                icon={Target}
                actionText="View Courses"
                action={() => {}}
              />
              <ActionCard
                title="Update Your Portfolio"
                description="Add 2-3 more projects to reach the optimal portfolio size for job applications."
                icon={Briefcase}
                actionText="Build Projects"
                action={() => {}}
              />
              <ActionCard
                title="Network Actively"
                description="Connect with professionals in your target field to increase opportunities by 40%."
                icon={Users}
                actionText="Join Community"
                action={() => {}}
              />
              <ActionCard
                title="Prepare for Interviews"
                description="Practice technical interviews to improve your success rate by 60%."
                icon={BookOpen}
                actionText="Start Practice"
                action={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Analysis Tab */}
      {activeTab === 'job-analysis' && extractedJD && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/50 mb-6">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Job Analysis</h2>
                <p className="text-gray-300">AI-powered analysis of extracted job description</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Job Details */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white font-medium">{extractedJD.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white font-medium">{extractedJD.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white font-medium">{extractedJD.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white font-medium">{extractedJD.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Salary:</span>
                  <span className="text-white font-medium">{extractedJD.salaryRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Remote:</span>
                  <span className="text-white font-medium">{extractedJD.remote}</span>
                </div>
              </div>
            </div>

            {/* Skills Match */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {extractedJD.keySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-300">
                <p className="mb-2">📊 <strong>Skills Analysis:</strong></p>
                <p>• {extractedJD.keySkills.length} key skills identified</p>
                <p>• Focus on mastering these technologies to qualify</p>
                <p>• Consider building projects with these skills</p>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Key Responsibilities</h3>
            <ul className="space-y-2">
              {extractedJD.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          {extractedJD.requirements.length > 0 && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Requirements</h3>
              <ul className="space-y-2">
                {extractedJD.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Target className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {extractedJD.benefits.length > 0 && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Benefits & Perks</h3>
              <ul className="space-y-2">
                {extractedJD.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Award className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/50">
                <h4 className="text-lg font-medium text-white mb-2">🎯 Skill Development</h4>
                <p className="text-gray-300 text-sm mb-3">Focus on these key skills:</p>
                <div className="flex flex-wrap gap-2">
                  {extractedJD.keySkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/50">
                <h4 className="text-lg font-medium text-white mb-2">📝 Application Prep</h4>
                <p className="text-gray-300 text-sm mb-3">Tailor your resume to highlight these skills</p>
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                  Update Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Resume Analysis"
            description={`Get AI-powered feedback on your resume${savedResumes.length > 0 ? ` (${savedResumes.length} resumes available)` : ' and upload your first resume'}.`}
            icon={FileText}
            actionText={savedResumes.length > 0 ? "Analyze Resume" : "Upload Resume"}
            action={handleResumeAnalysis}
          />
          <ActionCard
            title="Job Matching"
            description={`Find jobs that match your ${skillGaps.length} key skills and career goals.`}
            icon={Target}
            actionText="Find Jobs"
            action={handleJobMatching}
          />
          <ActionCard
            title="Skill Assessment"
            description="Take a comprehensive assessment to identify your strengths and skill gaps."
            icon={Brain}
            actionText="Start Assessment"
            action={handleSkillAssessment}
          />
        </div>
      </div>

      {/* AI Career Assistant */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/50 mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-xl font-bold text-white">AI Career Assistant</h3>
              <p className="text-gray-300">Get personalized career advice powered by AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Ask Career Questions</h4>
            <div className="space-y-4">
              <textarea
                value={careerQuery}
                onChange={(e) => setCareerQuery(e.target.value)}
                placeholder="Ask me anything about your career path, skill development, or job search..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              <button
                onClick={handleCareerQuery}
                disabled={!careerQuery.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get AI Advice</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Career Insights</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-gray-300">Career Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-white text-sm">65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-gray-300">Skills Mastered</span>
                <span className="text-white font-medium">{skillGaps.filter(s => s.current >= s.target).length}/{skillGaps.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-gray-300">Market Readiness</span>
                <span className="text-green-400 font-medium">High</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-gray-300">Next Milestone</span>
                <span className="text-blue-400 font-medium">2-3 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
