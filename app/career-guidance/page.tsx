'use client'

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
  Zap
} from 'lucide-react'

export default function CareerGuidancePage() {
  const [guidance, setGuidance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState<any>(null)
  const [isQuerying, setIsQuerying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCareerGuidance()
  }, [])

  const loadCareerGuidance = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getCareerGuidance()
      if (response.success) {
        setGuidance(response.data)
      } else {
        throw new Error('Failed to load career guidance')
      }
    } catch (error) {
      console.error('Career guidance error:', error)
      setError('Failed to load career guidance')
      // Fallback to mock data
      setGuidance({
        recommendations: [
          {
            title: "Full Stack Developer",
            matchScore: 92,
            description: "Based on your skills in React, Node.js, and TypeScript",
            skills: ["React", "Node.js", "TypeScript", "MongoDB"],
            salaryRange: "$80,000 - $150,000",
            growthPotential: "High"
          },
          {
            title: "DevOps Engineer",
            matchScore: 78,
            description: "Leverage your system administration and cloud knowledge",
            skills: ["AWS", "Docker", "CI/CD", "Linux"],
            salaryRange: "$90,000 - $160,000",
            growthPotential: "Very High"
          },
          {
            title: "Technical Lead",
            matchScore: 85,
            description: "Combine your technical skills with leadership experience",
            skills: ["Team Management", "Architecture", "Agile", "Mentoring"],
            salaryRange: "$120,000 - $200,000",
            growthPotential: "High"
          }
        ],
        skillGaps: [
          {
            skill: "Cloud Architecture",
            importance: "High",
            currentLevel: "Beginner",
            targetLevel: "Advanced",
            resources: [
              "AWS Solutions Architect Certification",
              "Google Cloud Professional Architect",
              "Azure Administrator Associate"
            ]
          },
          {
            skill: "Machine Learning",
            importance: "Medium",
            currentLevel: "None",
            targetLevel: "Intermediate",
            resources: [
              "Machine Learning Specialization",
              "Deep Learning Course",
              "TensorFlow Developer Certificate"
            ]
          }
        ],
        marketTrends: {
          inDemandSkills: [
            "Cloud Computing",
            "AI/ML",
            "Cybersecurity",
            "DevOps",
            "Data Science"
          ],
          growingIndustries: [
            "FinTech",
            "Healthcare Tech",
            "E-commerce",
            "EdTech",
            "Clean Energy"
          ],
          salaryTrends: {
            overall: "Up 8% year-over-year",
            techSector: "Up 12% year-over-year",
            remoteWork: "Premium of 15-20% for fully remote roles"
          }
        },
        nextSteps: [
          {
            action: "Complete Advanced React Course",
            priority: "High",
            timeline: "2-3 months",
            impact: "Increase job opportunities by 40%"
          },
          {
            action: "Get AWS Certification",
            priority: "Medium",
            timeline: "3-6 months",
            impact: "Open doors to DevOps roles"
          },
          {
            action: "Build Portfolio Project",
            priority: "High",
            timeline: "1-2 months",
            impact: "Demonstrate practical skills"
          }
        ]
      })
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
        <p className="text-slate-400">Get personalized career recommendations and AI-powered advice.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

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

      {/* Skill Gaps */}
      {guidance?.skillGaps?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Skill Development Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidance.skillGaps.map((gap: any, index: number) => (
              <ChartCard key={index} title={gap.skill}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Current Level</p>
                      <p className="text-white font-medium">{gap.currentLevel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">Target Level</p>
                      <p className="text-blue-400 font-medium">{gap.targetLevel}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      gap.importance === 'High' 
                        ? 'bg-red-500/10 text-red-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {gap.importance} Priority
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Recommended Resources</p>
                    <div className="space-y-1">
                      {gap.resources.map((resource: string, resourceIndex: number) => (
                        <div key={resourceIndex} className="flex items-center space-x-2">
                          <BookOpen className="h-3 w-3 text-blue-400" />
                          <span className="text-slate-300 text-sm">{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ChartCard>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {guidance?.nextSteps?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recommended Next Steps</h2>
          <div className="space-y-4">
            {guidance.nextSteps.map((step: any, index: number) => (
              <div key={index} className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{step.action}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          step.priority === 'High' 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {step.priority} Priority
                        </span>
                        <span className="text-slate-400 text-sm">{step.timeline}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{step.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Market Trends */}
      {guidance?.marketTrends && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Market Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartCard title="In-Demand Skills">
              <div className="space-y-2">
                {guidance.marketTrends.inDemandSkills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Growing Industries">
              <div className="space-y-2">
                {guidance.marketTrends.growingIndustries.map((industry: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-slate-300 text-sm">{industry}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Salary Trends">
              <div className="space-y-3">
                {Object.entries(guidance.marketTrends.salaryTrends).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-green-400 text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  )
}
