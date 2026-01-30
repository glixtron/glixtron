'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  FileText,
  Search,
  Zap,
  Award,
  BarChart3,
  BookOpen,
  Users,
  Map,
  Clock,
  DollarSign,
  GraduationCap,
  Briefcase,
  Star
} from 'lucide-react'

interface ScienceStream {
  id: string
  name: string
  description: string
  careers: string[]
  skills: string[]
  averageSalary: string
}

interface JobType {
  title: string
  category: string
  description: string
  requiredEducation: string
  experienceLevel: string
  salaryRange: string
  growthRate: string
  demandLevel: string
}

interface CareerGuidanceResponse {
  success: boolean
  roadmap?: any
  recommendations?: any[]
  skillGap?: any
  jobMatches?: any[]
  nextSteps?: any[]
}

export default function ScienceCareerAssessment() {
  const [selectedStream, setSelectedStream] = useState<string>('')
  const [streams, setStreams] = useState<ScienceStream[]>([])
  const [jobTypes, setJobTypes] = useState<JobType[]>([])
  const [loading, setLoading] = useState(false)
  const [guidance, setGuidance] = useState<CareerGuidanceResponse | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    interests: [] as string[],
    skills: [] as string[],
    experience: '',
    careerGoals: ''
  })

  const [newInterest, setNewInterest] = useState('')
  const [newSkill, setNewSkill] = useState('')

  React.useEffect(() => {
    loadScienceStreams()
  }, [])

  const loadScienceStreams = async () => {
    try {
      const response = await fetch('/api/career-guidance?action=get-science-streams')
      const data = await response.json()
      if (data.success) {
        setStreams(data.data)
      }
    } catch (error) {
      console.error('Failed to load science streams:', error)
    }
  }

  const loadJobTypes = async (stream: string) => {
    try {
      const response = await fetch('/api/career-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get-job-types',
          stream
        })
      })
      const data = await response.json()
      if (data.success) {
        setJobTypes(data.data)
      }
    } catch (error) {
      console.error('Failed to load job types:', error)
    }
  }

  const handleStreamSelect = (stream: ScienceStream) => {
    setSelectedStream(stream.id)
    loadJobTypes(stream.id)
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const generateGuidance = async () => {
    if (!selectedStream || !formData.name) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/career-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-guidance',
          name: formData.name,
          education: formData.education,
          scienceStream: selectedStream,
          interests: formData.interests,
          skills: formData.skills,
          experience: formData.experience,
          careerGoals: formData.careerGoals
        })
      })

      const data = await response.json()
      if (data.success) {
        setGuidance(data.data)
      }
    } catch (error) {
      console.error('Failed to generate guidance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGrowthColor = (growth: string) => {
    const growthNum = parseInt(growth)
    if (growthNum >= 20) return 'text-green-600'
    if (growthNum >= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Science Career Assessment</h1>
        <p className="text-gray-600">Get personalized career guidance for science streams with AI-powered analysis</p>
      </div>

      {/* Science Streams Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Choose Your Science Stream
          </CardTitle>
          <CardDescription>
            Select your science stream to get personalized career guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map((stream) => (
              <div
                key={stream.id}
                onClick={() => handleStreamSelect(stream)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedStream === stream.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-2">{stream.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{stream.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {stream.careers.slice(0, 3).map((career, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {career}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Avg Salary: {stream.averageSalary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Profile Form */}
      {selectedStream && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Profile
            </CardTitle>
            <CardDescription>
              Tell us about yourself to get personalized career guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Education</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., High School, Bachelor's in Physics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Interests</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Add your interests (e.g., Astronomy, Research)"
                  />
                  <Button onClick={addInterest}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                      {interest} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Add your skills (e.g., Programming, Lab Techniques)"
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Describe any relevant experience, projects, or internships"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Career Goals</label>
                <textarea
                  value={formData.careerGoals}
                  onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="What are your career aspirations and goals?"
                />
              </div>

              <Button 
                onClick={generateGuidance} 
                disabled={loading || !formData.name}
                className="w-full"
              >
                {loading ? 'Generating Guidance...' : 'Generate Career Guidance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Types for Selected Stream */}
      {selectedStream && jobTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Career Opportunities in {streams.find(s => s.id === selectedStream)?.name}
            </CardTitle>
            <CardDescription>
              Explore different career paths and job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobTypes.map((job, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex gap-2">
                      <Badge className={getDemandColor(job.demandLevel)}>
                        {job.demandLevel} demand
                      </Badge>
                      <Badge variant="outline">
                        {job.growthRate} growth
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Education:</span> {job.requiredEducation}
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {job.experienceLevel}
                    </div>
                    <div>
                      <span className="font-medium">Salary:</span> {job.salaryRange}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {job.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Guidance Results */}
      {guidance && guidance.success && (
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-6">
            {guidance.roadmap && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5" />
                      Your Career Roadmap
                    </CardTitle>
                    <CardDescription>
                      Personalized career development timeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Short Term (3-6 months)
                        </h3>
                        <div className="space-y-3">
                          {guidance.roadmap.shortTerm?.map((phase: any, index: number) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-medium">{phase.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                              <ul className="text-sm space-y-1">
                                {phase.objectives?.map((obj: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Mid Term (6-12 months)
                        </h3>
                        <div className="space-y-3">
                          {guidance.roadmap.midTerm?.map((phase: any, index: number) => (
                            <div key={index} className="border-l-4 border-yellow-500 pl-4">
                              <h4 className="font-medium">{phase.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                              <ul className="text-sm space-y-1">
                                {phase.objectives?.map((obj: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Long Term (1-2 years)
                        </h3>
                        <div className="space-y-3">
                          {guidance.roadmap.longTerm?.map((phase: any, index: number) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-medium">{phase.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                              <ul className="text-sm space-y-1">
                                {phase.objectives?.map((obj: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {guidance.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Career Recommendations
                  </CardTitle>
                  <CardDescription>
                    Personalized job recommendations based on your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guidance.recommendations.map((rec: any, index: number) => (
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
                          <div>
                            <span className="font-medium">Market Demand:</span> 
                            <Badge className={`ml-2 ${getDemandColor(rec.marketDemand)}`}>
                              {rec.marketDemand}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Companies:</span> {rec.companies?.join(', ')}
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="font-medium text-sm">Required Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.requiredSkills?.map((skill: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {guidance.skillGap && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Skills Gap Analysis
                  </CardTitle>
                  <CardDescription>
                    Analyze your current skills and identify areas for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Current Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {guidance.skillGap.currentSkills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Missing Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {guidance.skillGap.missingSkills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="destructive">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Improvement Timeline</h3>
                      <p className="text-sm text-gray-600">{guidance.skillGap.timeline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="next-steps" className="space-y-6">
            {guidance.nextSteps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Next Steps
                  </CardTitle>
                  <CardDescription>
                    Actionable steps to advance your career
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guidance.nextSteps.map((step: any, index: number) => (
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
                          <div className="flex flex-wrap gap-1">
                            {step.resources?.map((resource: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
