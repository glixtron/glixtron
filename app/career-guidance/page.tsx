'use client'

export const dynamic = 'force-dynamic'

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
  Briefcase,
  Award,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  Circle,
  ArrowRight,
  Zap,
  Calendar,
  Lightbulb,
  Rocket,
  Compass,
  Code,
  Palette,
  MessageSquare,
  FileText,
  Globe,
  Building
} from 'lucide-react'

interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  skills: string[]
  resources: { title: string; type: 'course' | 'project' | 'article'; url: string }[]
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
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([])
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([])
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'skills' | 'insights'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCareerGuidance()
  }, [])

  const loadCareerGuidance = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getCareerGuidance()
      
      if (response.success) {
        setRoadmap(response.data.roadmap || [])
        setSkillGaps(response.data.skillGaps || [])
        setMarketInsights(response.data.marketInsights || [])
      } else {
        // Use mock data if API fails
        loadMockData()
      }
    } catch (error) {
      console.error('Failed to load career guidance:', error)
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    setRoadmap([
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
    ])

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update roadmap with personalized data
      setRoadmap(prev => prev.map(step => ({
        ...step,
        completed: Math.random() > 0.7
      })))
    } catch (error) {
      console.error('Failed to generate roadmap:', error)
    } finally {
      setIsGeneratingRoadmap(false)
    }
  }

  const getSkillIcon = (skill: string) => {
    if (skill.toLowerCase().includes('react') || skill.toLowerCase().includes('next')) return <Code className="w-4 h-4" />
    if (skill.toLowerCase().includes('design') || skill.toLowerCase().includes('ui')) return <Palette className="w-4 h-4" />
    if (skill.toLowerCase().includes('communication') || skill.toLowerCase().includes('soft')) return <MessageSquare className="w-4 h-4" />
    return <Lightbulb className="w-4 h-4" />
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />
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
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Career Progress"
            value="65%"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
            trendValue="12% from last month"
          />
          <StatCard
            title="Skills Mastered"
            value="18/25"
            icon={<Brain className="w-6 h-6" />}
            trend="up"
            trendValue="3 new skills"
          />
          <StatCard
            title="Projects Completed"
            value="7"
            icon={<Target className="w-6 h-6" />}
            trend="up"
            trendValue="2 this month"
          />
          <StatCard
            title="Market Readiness"
            value="78%"
            icon={<Award className="w-6 h-6" />}
            trend="up"
            trendValue="5% improvement"
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
            {roadmap.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < roadmap.length - 1 && (
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
                icon={<Target className="w-6 h-6" />}
                actionText="View Courses"
                onAction={() => {}}
              />
              <ActionCard
                title="Update Your Portfolio"
                description="Add 2-3 more projects to reach the optimal portfolio size for job applications."
                icon={<Briefcase className="w-6 h-6" />}
                actionText="Build Projects"
                onAction={() => {}}
              />
              <ActionCard
                title="Network Actively"
                description="Connect with professionals in your target field to increase opportunities by 40%."
                icon={<Users className="w-6 h-6" />}
                actionText="Join Community"
                onAction={() => {}}
              />
              <ActionCard
                title="Prepare for Interviews"
                description="Practice technical interviews to improve your success rate by 60%."
                icon={<BookOpen className="w-6 h-6" />}
                actionText="Start Practice"
                onAction={() => {}}
              />
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
            description="Get AI-powered feedback on your resume and improve your chances."
            icon={<FileText className="w-6 h-6" />}
            actionText="Analyze Resume"
            onAction={() => window.location.href = '/resume-scanner'}
          />
          <ActionCard
            title="Job Matching"
            description="Find jobs that match your skills and career goals."
            icon={<Target className="w-6 h-6" />}
            actionText="Find Jobs"
            onAction={() => {}}
          />
          <ActionCard
            title="Skill Assessment"
            description="Take a comprehensive assessment to identify your strengths."
            icon={<Brain className="w-6 h-6" />}
            actionText="Start Assessment"
            onAction={() => window.location.href = '/assessment'}
          />
        </div>
      </div>
    </div>
  )
}
