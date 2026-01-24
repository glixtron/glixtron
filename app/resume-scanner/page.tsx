'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FileText, Link as LinkIcon, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Copy, ExternalLink, Upload, ArrowRight, Save } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ResumeAnalysis } from '@/lib/resume-analyzer'

// Dynamically import the resume analyzer to avoid SSR issues
const ResumeAnalyzer = dynamic(() => import('@/components/ResumeAnalyzer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div></div>
})

// Dynamically import JD extractor to avoid SSR issues
const JDExtractor = dynamic(() => import('@/components/JDExtractor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div></div>
})

import ResumeUpload from '@/components/ResumeUpload'

type InputMode = 'link' | 'text'
type ResumeInputMode = 'upload' | 'paste'

export default function ResumeScannerPage() {
  const { data: session } = useSession()
  const [resumeInputMode, setResumeInputMode] = useState<ResumeInputMode>('paste')
  const [resumeText, setResumeText] = useState('')
  const [jdMode, setJdMode] = useState<InputMode>('link')
  const [jdLink, setJdLink] = useState('')
  const [jdText, setJdText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [extractedJD, setExtractedJD] = useState('')
  const [copied, setCopied] = useState(false)

  // Load saved data if user is logged in
  useEffect(() => {
    if (session?.user?.id) {
      // Load from API
      fetch('/api/user/resume-text')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.text) {
            setResumeText(data.text)
          }
        })
        .catch(err => console.error('Error loading resume text:', err))
    }
  }, [session])

  const handleResumeParsed = async (text: string, fileName: string) => {
    setResumeText(text)
    if (session?.user?.id) {
      // Save to server via API
      try {
        await fetch('/api/user/resume-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
      } catch (err) {
        console.error('Error saving resume text:', err)
      }
    }
  }

  const handleExtractJD = async (content: string) => {
    setExtractedJD(content)
    setJdText(content)
    setJdMode('text')
  }

  const handleAnalyze = async (analysisResult: ResumeAnalysis) => {
    setAnalysis(analysisResult)
  }

  const handleSaveScan = async () => {
    if (!session?.user?.id || !analysis) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/user/resume-scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jdText,
          jdLink: jdLink || undefined,
          analysis,
          matchScore: analysis.matchScore
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save scan')
      }
      
      setIsSaving(false)
      alert('Scan saved successfully!')
    } catch (error: any) {
      setIsSaving(false)
      alert(error.message || 'Failed to save scan')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Resume <span className="gradient-text">Scanner</span>
                </h1>
              </div>
              <p className="text-slate-400">
                Optimize your resume against any job description. Get AI-powered suggestions to increase your hiring chances.
              </p>
            </div>
            {session?.user && (
              <div className="text-right">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="text-white font-medium">{session.user.name || session.user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Input */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-xl font-bold">Your Resume</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setResumeInputMode('upload')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    resumeInputMode === 'upload'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Upload className="h-4 w-4 inline mr-1" />
                  Upload
                </button>
                <button
                  onClick={() => setResumeInputMode('paste')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    resumeInputMode === 'paste'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Paste
                </button>
              </div>
            </div>

            {resumeInputMode === 'upload' ? (
              <ResumeUpload
                onResumeParsed={handleResumeParsed}
                currentText={resumeText}
              />
            ) : (
              <textarea
                value={resumeText}
                onChange={async (e) => {
                  const text = e.target.value
                  setResumeText(text)
                  if (session?.user?.id) {
                    // Auto-save to server via API
                    try {
                      await fetch('/api/user/resume-text', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                      })
                    } catch (err) {
                      console.error('Error auto-saving resume text:', err)
                    }
                  }
                }}
                placeholder="Paste your resume content here...&#10;&#10;Include:&#10;- Skills&#10;- Experience&#10;- Education&#10;- Achievements"
                className="w-full h-96 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            )}
            {resumeInputMode === 'paste' && (
              <p className="text-sm text-slate-500 mt-2">
                {resumeText.length} characters
              </p>
            )}
          </div>

          {/* JD Input */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-violet-400 mr-2" />
                <h2 className="text-xl font-bold">Job Description</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setJdMode('link')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    jdMode === 'link'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Link
                </button>
                <button
                  onClick={() => setJdMode('text')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    jdMode === 'text'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Text
                </button>
              </div>
            </div>

            {jdMode === 'link' ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={jdLink}
                    onChange={(e) => setJdLink(e.target.value)}
                    placeholder="Paste job posting URL (LinkedIn, Indeed, etc.)"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <JDExtractor
                    jdLink={jdLink}
                    onExtract={handleExtractJD}
                    isExtracting={isExtracting}
                    setIsExtracting={setIsExtracting}
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Our AI will visit the link and extract the job description automatically.
                </p>
                {extractedJD && (
                  <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-green-400 mb-2 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      JD Extracted Successfully
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-3">
                      {extractedJD.substring(0, 200)}...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here...&#10;&#10;Include:&#10;- Required skills&#10;- Experience requirements&#10;- Responsibilities&#10;- Qualifications"
                  className="w-full h-96 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                />
                <p className="text-sm text-slate-500 mt-2">
                  {jdText.length} characters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || !jdText.trim() || isAnalyzing}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 rounded-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center mx-auto"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing with Advanced NLP...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze Resume vs JD
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Match Score Card */}
            <div className="glass rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-400 mr-2" />
                  Match Analysis
                </h2>
                <div className="flex items-center gap-4">
                  {session?.user && (
                    <button
                      onClick={handleSaveScan}
                      disabled={isSaving}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Scan'}
                    </button>
                  )}
                  <div className="text-right">
                    <div className="text-4xl font-bold gradient-text">{analysis.matchScore}%</div>
                    <div className="text-sm text-slate-400">Overall Match</div>
                  </div>
                </div>
              </div>

              {/* Hiring Probability */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Current Probability</div>
                  <div className="text-2xl font-bold text-slate-300">{analysis.hiringProbability.current}%</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Optimized Probability</div>
                  <div className="text-2xl font-bold text-green-400">{analysis.hiringProbability.optimized}%</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Potential Improvement</div>
                  <div className="text-2xl font-bold text-blue-400">+{analysis.hiringProbability.improvement}%</div>
                </div>
              </div>

              {/* Skills Match with Similar Skills */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-sm font-medium text-green-400">Matched Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.skillsMatch.matched.length > 0 ? (
                      analysis.skillsMatch.matched.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None found</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-400 mr-2" />
                    <span className="text-sm font-medium text-amber-400">Missing Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.skillsMatch.missing.length > 0 ? (
                      analysis.skillsMatch.missing.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </div>
                  {analysis.skillsMatch.similar.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20">
                      <p className="text-xs text-amber-300 mb-1">Similar skills found:</p>
                      {analysis.skillsMatch.similar.slice(0, 3).map((similar, i) => (
                        <span key={i} className="text-xs text-amber-400">
                          {similar.skill} ({Math.round(similar.similarity * 100)}%){' '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-sm font-medium text-slate-400 mb-2">Keyword Density</div>
                  <div className="text-2xl font-bold text-slate-300">{analysis.keywords.density}%</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {analysis.keywords.exactMatches.length} exact matches
                  </div>
                  {analysis.keywords.similarMatches.length > 0 && (
                    <div className="text-xs text-blue-400 mt-1">
                      {analysis.keywords.similarMatches.length} similar terms found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            {analysis.nextSteps && analysis.nextSteps.length > 0 && (
              <div className="glass rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <ArrowRight className="h-6 w-6 text-violet-400 mr-2" />
                  Next Steps
                </h2>
                <div className="space-y-3">
                  {analysis.nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg flex items-start"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-violet-400 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-slate-300 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced NLP Results */}
            {(analysis.keywords.similarMatches.length > 0 || analysis.keywords.relatedTerms.length > 0) && (
              <div className="glass rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 text-blue-400 mr-2" />
                  Advanced NLP Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.keywords.similarMatches.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-blue-400">Similar Keywords Found</h3>
                      <div className="space-y-2">
                        {analysis.keywords.similarMatches.slice(0, 5).map((match, i) => (
                          <div key={i} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <div className="text-sm font-medium text-white mb-1">
                              Looking for: <span className="text-blue-300">{match.keyword}</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              Found similar: <span className="text-blue-400">{match.matches[0]}</span> ({Math.round(match.similarity * 100)}% match)
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Consider using the exact JD term for better ATS matching
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.keywords.relatedTerms.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-violet-400">Related Terms</h3>
                      <div className="space-y-2">
                        {analysis.keywords.relatedTerms.slice(0, 5).map((term, i) => (
                          <div key={i} className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                            <div className="text-sm font-medium text-white mb-1">
                              Related to: <span className="text-violet-300">{term.keyword}</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              You have: <span className="text-violet-400">{term.matches[0]}</span> ({Math.round(term.similarity * 100)}% related)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="glass rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="h-6 w-6 text-violet-400 mr-2" />
                AI-Powered Suggestions
              </h2>

              <div className="space-y-4">
                {analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      suggestion.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/50'
                        : suggestion.type === 'enhancement'
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-blue-500/10 border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {suggestion.type === 'critical' ? (
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2" />
                          )}
                          <h3 className="text-lg font-bold text-white">{suggestion.title}</h3>
                          <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                            suggestion.type === 'critical'
                              ? 'bg-red-500/20 text-red-300'
                              : suggestion.type === 'enhancement'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {suggestion.type === 'critical' ? 'Critical' : suggestion.type === 'enhancement' ? 'Enhancement' : 'Optimization'}
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">{suggestion.description}</p>
                        <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                          <p className="text-sm text-slate-400 mb-1">Action:</p>
                          <p className="text-white">{suggestion.action}</p>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-green-400">+{suggestion.expectedImpact}%</div>
                        <div className="text-xs text-slate-500">Impact</div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(suggestion.action)}
                      className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy Action'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Experience Alignment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Alignment Score</span>
                      <span className="text-sm font-medium text-white">{analysis.experience.alignment}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                        style={{ width: `${analysis.experience.alignment}%` }}
                      />
                    </div>
                  </div>
                  {analysis.experience.strengths.length > 0 && (
                    <div>
                      <p className="text-sm text-green-400 mb-2">Strengths:</p>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {analysis.experience.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.experience.gaps.length > 0 && (
                    <div>
                      <p className="text-sm text-amber-400 mb-2">Gaps:</p>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {analysis.experience.gaps.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Education & Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    {analysis.education.meetsRequirements ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
                    )}
                    <span className="text-sm text-slate-300">
                      {analysis.education.meetsRequirements ? 'Meets requirements' : 'Review needed'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{analysis.education.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
