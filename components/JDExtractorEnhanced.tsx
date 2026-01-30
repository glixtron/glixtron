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
  Building
} from 'lucide-react'

interface ExtractedJD {
  url: string
  content: string
  extractedAt: string
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

    // Basic URL validation
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
        setExtractedJD({
          url: data.url,
          content: data.data,
          extractedAt: data.extractedAt
        })
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
    if (extractedJD?.content) {
      try {
        await navigator.clipboard.writeText(extractedJD.content)
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const analyzeWithAI = () => {
    if (extractedJD?.content) {
      // Navigate to career guidance with the extracted content
      const encodedContent = encodeURIComponent(extractedJD.content)
      window.location.href = `/career-guidance?jd=${encodedContent}`
    }
  }

  const downloadAsText = () => {
    if (extractedJD?.content) {
      const blob = new Blob([extractedJD.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `job-description-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const sampleUrls = [
    'https://www.linkedin.com/jobs/view/senior-software-engineer-at-microsoft-123456789/',
    'https://www.indeed.com/viewjob?jk=123456789',
    'https://jobs.github.com/positions/123456789'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Job Description Extractor</h1>
            <p className="text-gray-400">Extract job descriptions from any job posting URL</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* URL Input */}
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
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Extract Job Description</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
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

          {/* Sample URLs */}
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

          {/* Features */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Bypasses anti-bot protection</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Extracts from LinkedIn, Indeed, and more</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Clean, readable text output</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">AI-ready for analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {extractedJD && (
            <>
              {/* Success Header */}
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">Successfully Extracted!</p>
                    <p className="text-green-300 text-sm">
                      Extracted at {new Date(extractedJD.extractedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <span className="text-gray-300">Copy Text</span>
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
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 sm:col-span-2"
                  >
                    <Target className="w-4 h-4" />
                    <span>Analyze with AI</span>
                  </button>
                </div>
              </div>

              {/* Extracted Content */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Extracted Content</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{extractedJD.content.length} characters</span>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                    {extractedJD.content}
                  </pre>
                </div>
              </div>

              {/* Source URL */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                  <span>Source:</span>
                  <a 
                    href={extractedJD.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 truncate"
                  >
                    {extractedJD.url}
                  </a>
                </div>
              </div>
            </>
          )}

          {!extractedJD && !isExtracting && (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-12 border border-slate-700/50 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Content Yet</h3>
              <p className="text-gray-400">
                Enter a job URL and click &quot;Extract Job Description&quot; to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
