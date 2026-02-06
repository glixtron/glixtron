'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  FileText, 
  Search, 
  Map, 
  Brain, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react'

// GlixAI Brand Configuration
const GlixAIConfig = {
  provider: 'GlixAI',
  tagline: 'Autonomous Career Intelligence',
  theme: {
    primary: '#00f2ff',
    secondary: '#7000ff',
    dark: '#0a0a0a',
    card: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#a0a0a0'
  },
  features: [
    'ai_chat',
    'resume_analysis', 
    'job_search',
    'roadmap_generation',
    'skill_gap_analysis',
    'full_form_nlp'
  ]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestions?: string[]
}

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  salary: string
  posted: string
  portal: string
  glixAI_insights?: {
    match_score: number
    automation_risk: { score: number; level: string }
    growth_potential: string
    skill_alignment: any
  }
}

interface RoadmapPhase {
  phase: number
  title: string
  duration: string
  skills: string[]
  objectives: string[]
  projects: string[]
}

export default function GlixAIPage() {
  const [activeTab, setActiveTab] = useState('chat')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [jobQuery, setJobQuery] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [jobResults, setJobResults] = useState<JobListing[]>([])
  const [roadmapResults, setRoadmapResults] = useState<any>(null)

  // Chat functionality
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/glixai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          session_id: Date.now().toString()
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setChatMessages(prev => [...prev, result.data])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Resume analysis
  const handleResumeAnalysis = async () => {
    if (!resumeText.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/glixai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      })

      const result = await response.json()
      
      if (result.success) {
        setAnalysisResults(result.data)
      }
    } catch (error) {
      console.error('Resume analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Job search
  const handleJobSearch = async () => {
    if (!jobQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/glixai/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: jobQuery,
          location: jobLocation,
          stream: 'general'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setJobResults(result.data.jobs)
      }
    } catch (error) {
      console.error('Job search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Roadmap generation
  const handleRoadmapGeneration = async () => {
    if (!targetRole.trim() || !currentSkills.trim()) return

    setLoading(true)
    try {
      const skills = currentSkills.split(',').map(s => s.trim())
      const response = await fetch('/api/glixai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: skills,
          targetRole,
          stream: 'general'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setRoadmapResults(result.data)
      }
    } catch (error) {
      console.error('Roadmap generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8" style={{ color: GlixAIConfig.theme.primary }} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  {GlixAIConfig.provider}
                </h1>
              </div>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                {GlixAIConfig.tagline}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-slate-400">Real-time AI Integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="chat" className="data-[state=active]:bg-slate-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Resume Analysis
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-slate-700">
              <Search className="h-4 w-4 mr-2" />
              Job Search
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-slate-700">
              <Map className="h-4 w-4 mr-2" />
              Career Roadmap
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-cyan-400" />
                      AI Career Assistant
                    </h3>
                    <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-900/50 rounded-lg">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-slate-400 py-8">
                          <Brain className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                          <p>Start a conversation with your AI career assistant</p>
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-cyan-500/20 border border-cyan-500/30 ml-8'
                                : 'bg-slate-800 border border-slate-700 mr-8'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.suggestions && (
                              <div className="mt-2 space-y-1">
                                {message.suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 text-left"
                                    onClick={() => setChatInput(suggestion)}
                                  >
                                    💡 {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about career guidance, resume analysis, job search..."
                        className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      >
                        {loading ? <Clock className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-700 hover:bg-slate-700"
                        onClick={() => setChatInput("Analyze my resume for career opportunities")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Resume Analysis
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-700 hover:bg-slate-700"
                        onClick={() => setChatInput("Find jobs matching my skills")}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Job Search
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-700 hover:bg-slate-700"
                        onClick={() => setChatInput("Generate a personalized career roadmap")}
                      >
                        <Map className="h-4 w-4 mr-2" />
                        Career Roadmap
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Resume Analysis Tab */}
          <TabsContent value="resume" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-cyan-400" />
                  Advanced Resume Analysis
                </h3>
                <div className="space-y-4">
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here for comprehensive analysis..."
                    className="min-h-[200px] bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                  />
                  <Button
                    onClick={handleResumeAnalysis}
                    disabled={loading || !resumeText.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  >
                    {loading ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                    Analyze Resume
                  </Button>
                </div>

                {analysisResults && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Match Score</span>
                            <Target className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-2xl font-bold text-green-500">{analysisResults.score}%</div>
                        </div>
                      </Card>
                      <Card className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Stream</span>
                            <Brain className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div className="text-lg font-semibold text-cyan-500">{analysisResults.streamData?.title}</div>
                        </div>
                      </Card>
                      <Card className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Gaps</span>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-2xl font-bold text-orange-500">{analysisResults.gaps?.length || 0}</div>
                        </div>
                      </Card>
                    </div>

                    {analysisResults.glixAI_insights && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-slate-900/50 border-slate-700">
                          <div className="p-4">
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-blue-500" />
                              Automation Risk
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Risk Level:</span>
                                <Badge className={analysisResults.glixAI_insights.automation_risk.level === 'Low' ? 'bg-green-500/20 text-green-400' : analysisResults.glixAI_insights.automation_risk.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}>
                                  {analysisResults.glixAI_insights.automation_risk.level}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Risk Score:</span>
                                <span className="text-sm font-semibold">{analysisResults.glixAI_insights.automation_risk.score}%</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-slate-900/50 border-slate-700">
                          <div className="p-4">
                            <h4 className="font-semibold mb-3 flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                              Salary Potential
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Current:</span>
                                <span className="text-sm font-semibold">${analysisResults.glixAI_insights.shadow_salary?.current?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Potential:</span>
                                <span className="text-sm font-semibold">${analysisResults.glixAI_insights.shadow_salary?.potential?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Job Search Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Search className="h-5 w-5 mr-2 text-cyan-400" />
                  Intelligent Job Search
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={jobQuery}
                      onChange={(e) => setJobQuery(e.target.value)}
                      placeholder="Job title, skills, or keywords..."
                      className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                    />
                    <Input
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder="Location (optional)"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                    />
                  </div>
                  <Button
                    onClick={handleJobSearch}
                    disabled={loading || !jobQuery.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  >
                    {loading ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                    Search Jobs
                  </Button>
                </div>

                {jobResults.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {jobResults.map((job) => (
                      <Card key={job.id} className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{job.title}</h4>
                              <p className="text-slate-400">{job.company} • {job.location}</p>
                            </div>
                            {job.glixAI_insights && (
                              <Badge className="bg-green-500/20 text-green-400">
                                {job.glixAI_insights.match_score}% Match
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="border-slate-600 text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-500 font-semibold">{job.salary}</span>
                            <span className="text-slate-400">{job.posted} • {job.portal}</span>
                          </div>
                          {job.glixAI_insights && (
                            <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-xs">
                              <span className="text-blue-400">Growth: {job.glixAI_insights.growth_potential}</span>
                              <span className={job.glixAI_insights.automation_risk.level === 'Low' ? 'text-green-400' : job.glixAI_insights.automation_risk.level === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>
                                Risk: {job.glixAI_insights.automation_risk.level}
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Map className="h-5 w-5 mr-2 text-cyan-400" />
                  Career Roadmap Generator
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="Target role (e.g., Data Scientist)"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                    />
                    <Input
                      value={currentSkills}
                      onChange={(e) => setCurrentSkills(e.target.value)}
                      placeholder="Current skills (comma-separated)"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                    />
                  </div>
                  <Button
                    onClick={handleRoadmapGeneration}
                    disabled={loading || !targetRole.trim() || !currentSkills.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  >
                    {loading ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <Map className="h-4 w-4 mr-2" />}
                    Generate Roadmap
                  </Button>
                </div>

                {roadmapResults && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Timeline</span>
                            <Clock className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="text-lg font-semibold text-blue-500">
                            {roadmapResults.glixAI_insights?.completion_time?.total_months || 0} months
                          </div>
                        </div>
                      </Card>
                      <Card className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Difficulty</span>
                            <Target className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-lg font-semibold text-orange-500">
                            {roadmapResults.glixAI_insights?.difficulty_level || 'Medium'}
                          </div>
                        </div>
                      </Card>
                      <Card className="bg-slate-900/50 border-slate-700">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Success Rate</span>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-lg font-semibold text-green-500">
                            {roadmapResults.glixAI_insights?.success_probability || 0}%
                          </div>
                        </div>
                      </Card>
                    </div>

                    {roadmapResults.phases && (
                      <div className="space-y-4">
                        {roadmapResults.phases.map((phase: RoadmapPhase) => (
                          <Card key={phase.phase} className="bg-slate-900/50 border-slate-700">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold">Phase {phase.phase}: {phase.title}</h4>
                                <Badge className="bg-cyan-500/20 text-cyan-400">{phase.duration}</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-sm font-semibold text-slate-400 mb-2">Skills to Learn</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {phase.skills.map((skill, index) => (
                                      <Badge key={index} variant="outline" className="border-slate-600 text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold text-slate-400 mb-2">Objectives</h5>
                                  <ul className="text-sm text-slate-300 space-y-1">
                                    {phase.objectives.map((obj, index) => (
                                      <li key={index}>• {obj}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
