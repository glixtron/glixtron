'use client'

import { useState } from 'react'
import { 
  FileText, 
  Briefcase, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  Eye,
  Zap,
  Brain,
  Award,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Loader2
} from 'lucide-react'

interface MatchResult {
  overallMatch: number
  skillsMatch: {
    matched: string[]
    missing: string[]
    additional: string[]
    score: number
  }
  experienceMatch: {
    required: string
    current: string
    match: boolean
    gap: string
  }
  suggestions: string[]
  improvements: string[]
  marketValue: {
    current: string
    potential: string
    gap: string
  }
  actionItems: string[]
}

export default function JDResumeMatchAnalysis() {
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const analyzeMatch = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError('Please provide both resume and job description text')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/jd-resume-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jdText
        })
      })

      const data = await response.json()

      if (data.success) {
        setMatchResult(data.data)
        setShowResults(true)
      } else {
        setError(data.error || 'Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback
      const button = document.activeElement as HTMLElement
      if (button) {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        setTimeout(() => {
          button.textContent = originalText
        }, 2000)
      }
    })
  }

  const downloadReport = () => {
    if (!matchResult) return

    const report = `
JD-Resume Match Analysis Report
=====================================

Overall Match Score: ${matchResult.overallMatch}%

SKILLS MATCH (${matchResult.skillsMatch.score}%)
Matched Skills: ${matchResult.skillsMatch.matched.join(', ')}
Missing Skills: ${matchResult.skillsMatch.missing.join(', ')}
Additional Skills: ${matchResult.skillsMatch.additional.join(', ')}

EXPERIENCE MATCH
Required: ${matchResult.experienceMatch.required}
Current: ${matchResult.experienceMatch.current}
Match: ${matchResult.experienceMatch.match ? '✅ Yes' : '❌ No'}
Gap: ${matchResult.experienceMatch.gap}

KEY SUGGESTIONS
${matchResult.suggestions.map(s => `• ${s}`).join('\n')}

IMPROVEMENTS NEEDED
${matchResult.improvements.map(i => `• ${i}`).join('\n')}

MARKET VALUE
Current: ${matchResult.marketValue.current}
Potential: ${matchResult.marketValue.potential}
Gap: ${matchResult.marketValue.gap}

ACTION ITEMS
${matchResult.actionItems.map(a => `• ${a}`).join('\n')}
=====================================
Generated on: ${new Date().toLocaleDateString()}
`

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jd-resume-match-analysis.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getMatchBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600/20 border-green-500/50'
    if (score >= 60) return 'bg-yellow-600/20 border-yellow-500/50'
    return 'bg-red-600/20 border-red-500/50'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-blue-400" />
          <Briefcase className="w-8 h-8 text-purple-400" />
          <Target className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          JD-Resume Match Analysis
        </h1>
        <p className="text-gray-300">
          Advanced AI-powered analysis to match your resume with job descriptions
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Resume Input */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Your Resume
            </h3>
            <button
              onClick={() => copyToClipboard(resumeText)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full h-64 p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 text-sm text-gray-400">
            {resumeText.length} characters
          </div>
        </div>

        {/* JD Input */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-400" />
              Job Description
            </h3>
            <button
              onClick={() => copyToClipboard(jdText)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-64 p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 text-sm text-gray-400">
            {jdText.length} characters
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center mb-8">
        <button
          onClick={analyzeMatch}
          disabled={isAnalyzing || !resumeText.trim() || !jdText.trim()}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center space-x-2 mx-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Match...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Analyze Match</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Results Section */}
      {showResults && matchResult && (
        <div className="space-y-6">
          {/* Overall Match Score */}
          <div className={`bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border ${getMatchBgColor(matchResult.overallMatch)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Overall Match Score
              </h3>
              <div className="flex items-center space-x-4">
                <span className={`text-3xl font-bold ${getMatchColor(matchResult.overallMatch)}`}>
                  {matchResult.overallMatch}%
                </span>
                <button
                  onClick={downloadReport}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Download report"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  matchResult.overallMatch >= 80 ? 'bg-green-500' :
                  matchResult.overallMatch >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${matchResult.overallMatch}%` }}
              ></div>
            </div>
          </div>

          {/* Skills Match */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Matched Skills ({matchResult.skillsMatch.matched.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.skillsMatch.matched.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                Missing Skills ({matchResult.skillsMatch.missing.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.skillsMatch.missing.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Match */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              Experience Match
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Required</span>
                <p className="text-white font-medium">{matchResult.experienceMatch.required}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Current</span>
                <p className="text-white font-medium">{matchResult.experienceMatch.current}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Match</span>
                <p className={`font-medium ${matchResult.experienceMatch.match ? 'text-green-400' : 'text-red-400'}`}>
                  {matchResult.experienceMatch.match ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            </div>
            {matchResult.experienceMatch.gap && (
              <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>Gap:</strong> {matchResult.experienceMatch.gap}
                </p>
              </div>
            )}
          </div>

          {/* Market Value */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Market Value Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Current Value</span>
                <p className="text-white font-medium">{matchResult.marketValue.current}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Potential Value</span>
                <p className="text-white font-medium">{matchResult.marketValue.potential}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Gap</span>
                <p className="text-white font-medium">{matchResult.marketValue.gap}</p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                Key Suggestions
              </h3>
              <ul className="space-y-2">
                {matchResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Action Items
              </h3>
              <ul className="space-y-2">
                {matchResult.actionItems.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improvements Needed */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-400" />
              Improvements Needed
            </h3>
            <ul className="space-y-2">
              {matchResult.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
