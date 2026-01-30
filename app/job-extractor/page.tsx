'use client'

import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { apiService } from '@/lib/api-service'
import { 
  FileText, 
  Upload, 
  Download,
  Briefcase,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  BarChart3,
  Zap,
  Copy,
  ExternalLink
} from 'lucide-react'

export default function JobExtractorPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const mockExtractedData = {
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120,000 - $180,000',
    experience: '5+ years',
    skills: [
      { name: 'React', level: 'Expert', required: true },
      { name: 'TypeScript', level: 'Advanced', required: true },
      { name: 'Node.js', level: 'Advanced', required: false },
      { name: 'AWS', level: 'Intermediate', required: false },
      { name: 'MongoDB', level: 'Advanced', required: false }
    ],
    responsibilities: [
      'Develop and maintain web applications using React and TypeScript',
      'Collaborate with cross-functional teams to define and ship new features',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and contribute to best practices',
      'Troubleshoot, debug and upgrade existing systems'
    ],
    requirements: [
      '5+ years of experience in software development',
      'Strong proficiency in React and TypeScript',
      'Experience with Node.js and modern JavaScript frameworks',
      'Familiarity with cloud services (AWS, Azure, or GCP)',
      'Excellent problem-solving and communication skills'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible work hours and remote work options',
      'Professional development budget',
      'Generous PTO and company holidays'
    ],
    matchScore: 85,
    keywords: ['Software Engineer', 'React', 'TypeScript', 'Full Stack', 'Web Development']
  }

  const handleExtract = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock extraction - in real app, this would call the API
      setExtractedData(mockExtractedData)
      setSuccessMessage('Job description extracted successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to extract job description:', error)
      setError('Failed to extract job description')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccessMessage('Copied to clipboard!')
    setTimeout(() => setSuccessMessage(null), 2000)
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(extractedData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'job-extraction-results.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    setSuccessMessage('Results exported successfully!')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Job Description Extractor
        </h1>
        <p className="text-slate-400">Extract key information from job descriptions instantly with AI-powered analysis.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400">
          {successMessage}
        </div>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-slate-400 text-sm">
                {jobDescription.length} characters
              </span>
              <button
                onClick={handleExtract}
                disabled={isLoading || !jobDescription.trim()}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Extract Information
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              title="Extractions Today"
              value="12"
              icon={FileText}
              description="Job descriptions processed"
            />
            <StatCard
              title="Average Match Score"
              value="78%"
              icon={TrendingUp}
              description="User profile compatibility"
            />
            <StatCard
              title="Skills Identified"
              value="156"
              icon={Zap}
              description="Unique skills extracted"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {extractedData && (
        <div className="space-y-8">
          {/* Quick Overview */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Extraction Results</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopyToClipboard(JSON.stringify(extractedData, null, 2))}
                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={handleExportJSON}
                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Job Title</p>
                <p className="text-white font-medium">{extractedData.jobTitle}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Company</p>
                <p className="text-white font-medium">{extractedData.company}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Location</p>
                <p className="text-white font-medium">{extractedData.location}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Match Score</p>
                <div className="flex items-center space-x-2">
                  <p className="text-white font-medium">{extractedData.matchScore}%</p>
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${extractedData.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills */}
            <ChartCard title="Required Skills">
              <div className="space-y-3">
                {extractedData.skills.map((skill: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {skill.required && (
                        <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      )}
                      <span className="text-slate-300">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        skill.level === 'Expert' ? 'bg-green-500/10 text-green-400' :
                        skill.level === 'Advanced' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {skill.level}
                      </span>
                      {skill.required && (
                        <span className="text-xs text-red-400">Required</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Responsibilities */}
            <ChartCard title="Responsibilities">
              <div className="space-y-3">
                {extractedData.responsibilities.map((responsibility: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{responsibility}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Requirements */}
            <ChartCard title="Requirements">
              <div className="space-y-3">
                {extractedData.requirements.map((requirement: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Benefits */}
            <ChartCard title="Benefits">
              <div className="space-y-3">
                {extractedData.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Keywords */}
          <ChartCard title="Keywords">
            <div className="flex flex-wrap gap-2">
              {extractedData.keywords.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Features */}
      {!extractedData && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="AI-Powered Extraction"
              description="Advanced machine learning algorithms accurately extract key information from any job description."
              icon={<BarChart3 className="h-6 w-6 text-blue-400" />}
              action={() => {}}
              actionText="Learn More"
            />
            <ActionCard
              title="Skill Matching"
              description="Automatically match extracted skills with your profile to see compatibility scores."
              icon={<Target className="h-6 w-6 text-blue-400" />}
              action={() => {}}
              actionText="View Matches"
            />
            <ActionCard
              title="Export Results"
              description="Export extracted data in multiple formats for easy integration with your workflow."
              icon={<Download className="h-6 w-6 text-blue-400" />}
              action={() => {}}
              actionText="Export Options"
            />
          </div>
        </div>
      )}
    </div>
  )
}
