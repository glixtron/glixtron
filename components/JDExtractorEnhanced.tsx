'use client'

import { useState } from 'react'
import { 
  FileText, 
  Link, 
  Download, 
  Upload, 
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  TrendingUp,
  Target,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Award,
  Sparkles
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

export default function JDExtractor() {
  const [url, setUrl] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedJD, setExtractedJD] = useState<ExtractedJD | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState(false)

  const extractJD = async () => {
    if (!url.trim()) {
      setError('Please enter a valid job URL')
      return
    }

    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL (e.g., https://linkedin.com/jobs/view/123)')
      return
    }

    setIsExtracting(true)
    setError(null)
    setExtractedJD(null)

    try {
      const response = await fetch('/api/extract-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setExtractedJD(data.data)
      } else {
        setError(data.error || 'Failed to extract job description')
      }
    } catch (error) {
      console.error('Extraction error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsExtracting(false)
    }
  }

  const copyToClipboard = async () => {
    if (extractedJD) {
      const formattedText = `
Job Title: ${extractedJD.jobTitle}
Company: ${extractedJD.companyName}
Location: ${extractedJD.location}
Experience Level: ${extractedJD.experienceLevel}
Salary: ${extractedJD.salaryRange}
Remote: ${extractedJD.remote}
Employment Type: ${extractedJD.employmentType}

Key Skills:
${extractedJD.keySkills.join(', ')}

Responsibilities:
${extractedJD.responsibilities.map((r: string) => `• ${r}`).join('\n')}
${extractedJD.requirements.length > 0 ? `\nRequirements:\n${extractedJD.requirements.map((r: string) => `• ${r}`).join('\n')}` : ''}

${extractedJD.benefits.length > 0 ? `\nBenefits:\n${extractedJD.benefits.map((b: string) => `• ${b}`).join('\n')}` : ''}

${extractedJD.applicationDeadline ? `\nApplication Deadline: ${extractedJD.applicationDeadline}` : ''}
      `.trim()
      
      try {
        await navigator.clipboard.writeText(formattedText)
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const analyzeWithAI = () => {
    if (extractedJD) {
      const encodedContent = encodeURIComponent(JSON.stringify(extractedJD))
      window.location.href = `/career-guidance?jd=${encodedContent}`
    }
  }

  const downloadAsText = () => {
    if (extractedJD) {
      const formattedText = `
Job Description Analysis
========================

Job Title: ${extractedJD.jobTitle}
Company: ${extractedJD.companyName}
Location: ${extractedJD.location}
Experience Level: ${extractedJD.experienceLevel}
Salary Range: ${extractedJD.salaryRange}
Remote: ${extractedJD.remote}
Employment Type: ${extractedJD.employmentType}
AI Enhanced: ${extractedJD.aiEnhanced ? 'Yes' : 'No'}
Extracted: ${new Date(extractedJD.extractedAt).toLocaleString()}

Key Skills:
${extractedJD.keySkills.join(', ')}

Responsibilities:
${extractedJD.responsibilities.map((r: string) => `• ${r}`).join('\n')}
${extractedJD.requirements.length > 0 ? `\nRequirements:\n${extractedJD.requirements.map((r: string) => `• ${r}`).join('\n')}` : ''}

${extractedJD.benefits.length > 0 ? `\nBenefits:\n${extractedJD.benefits.map((b: string) => `• ${b}`).join('\n')}` : ''}

${extractedJD.applicationDeadline ? `\nApplication Deadline: ${extractedJD.applicationDeadline}` : ''}

Raw Content:
${extractedJD.rawContent}
      `.trim()
      
      const blob = new Blob([formattedText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `job-analysis-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const calculateMatchScore = () => {
    if (!extractedJD) return 0
    
    let score = 50
    const highDemandSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker']
    const foundHighDemandSkills = extractedJD.keySkills.filter(skill => 
      highDemandSkills.includes(skill)
    )
    score += foundHighDemandSkills.length * 8
    
    if (extractedJD.remote === 'Yes') score += 15
    if (extractedJD.salaryRange !== 'Not Specified') score += 10
    if (extractedJD.responsibilities.length > 3) score += 10
    if (extractedJD.aiEnhanced) score += 20
    if (extractedJD.requirements.length > 0) score += 5
    if (extractedJD.benefits.length > 0) score += 5
    
    return Math.min(score, 100)
  }

  const sampleUrls = [
    'https://www.linkedin.com/jobs/view/senior-software-engineer-at-microsoft-123456789/',
    'https://www.indeed.com/viewjob?jk=123456789',
    'https://jobs.github.com/positions/123456789'
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI-Powered Job Description Extractor</h1>
            <p className="text-gray-400">Extract and analyze job descriptions from any URL with AI intelligence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <Link className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Job URL</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isExtracting}
                />
              </div>
              
              <button
                onClick={extractJD}
                disabled={isExtracting || !url.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI is analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract & Analyze</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">Extraction Failed</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Try These Sample URLs</h3>
            <div className="space-y-2">
              {sampleUrls.map((sampleUrl, index) => (
                <button
                  key={index}
                  onClick={() => setUrl(sampleUrl)}
                  className="w-full text-left p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300 group-hover:text-white truncate">
                        {sampleUrl}
                      </span>
                    </div>
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Intelligent skill extraction</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Structured data parsing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Match score calculation</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">AI-ready for analysis</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {extractedJD && (
            <>
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-green-400 font-medium text-lg">Successfully Extracted!</p>
                      <p className="text-green-300 text-sm">
                        {extractedJD.aiEnhanced ? 'AI-enhanced' : 'Structured parsing'} analysis at {new Date(extractedJD.extractedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {calculateMatchScore()}%
                    </div>
                    <p className="text-green-300 text-sm">Match Score</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-6">Job Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Job Title</p>
                        <p className="text-white font-medium">{extractedJD.jobTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <Building className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Company</p>
                        <p className="text-white font-medium">{extractedJD.companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">{extractedJD.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Experience</p>
                        <p className="text-white font-medium">{extractedJD.experienceLevel}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Salary</p>
                        <p className="text-white font-medium">{extractedJD.salaryRange}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Employment</p>
                        <p className="text-white font-medium">{extractedJD.employmentType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-3">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedJD.keySkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
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

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {copiedText ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">Copy</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={downloadAsText}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Download</span>
                    </button>
                    
                    <button
                      onClick={analyzeWithAI}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 lg:col-span-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Analyze with AI</span>
                    </button>
                  </div>
                </div>

                {extractedJD.aiEnhanced && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/50">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-300" />
                      <span className="text-purple-300 font-medium">AI-Enhanced Analysis</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!extractedJD && !isExtracting && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-16 border border-slate-700/50 text-center">
              <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Job Data Yet</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Enter a job URL and click &quot;Extract & Analyze&quot; to get AI-powered insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
