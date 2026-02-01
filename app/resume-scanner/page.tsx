'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import FileUpload from '@/components/FileUpload'
import { SafeComponent, SafeIcon, useSafeAsync } from '@/components/SafetyWrapper'
import { useBrandConfig } from '@/hooks/useBrandConfig'
import { useResume } from '@/hooks/useResume'
import { useResumeReport } from '@/lib/resume-report-generator'
import { 
  FileText, 
  Upload, 
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Eye,
  Zap,
  Sparkles,
  BarChart3,
  Award,
  Shield,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Brain
} from 'lucide-react'

export default function ResumeScannerPage() {
  const [scanResults, setScanResults] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [jdText, setJdText] = useState('')
  const [jdUrl, setJdUrl] = useState('')
  const [jdAnalysis, setJdAnalysis] = useState<any>(null)
  const [isExtractingJD, setIsExtractingJD] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<'resume' | 'combined'>('combined')
  const { config: brandConfig, isLoading: configLoading } = useBrandConfig()
  const { downloadReport } = useResumeReport()
  const { resumeData, isLoading: resumeLoading, hasResume, deleteResume, uploadResume } = useResume()

  const handleFileSelect = (file: File) => {
    setError(null)
    setSuccessMessage(null)
    console.log('File selected:', file.name)
  }

  const handleExtractJD = async () => {
    if (!jdUrl.trim() && !jdText.trim()) {
      setError('Please provide a job description URL or text')
      return
    }

    setIsExtractingJD(true)
    setError(null)
    
    try {
      const response = await fetch('/api/jd/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: jdUrl.trim(),
          analyze: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setJdAnalysis(data.data.analysis)
        if (data.data.jobDescription) {
          setJdText(data.data.jobDescription)
        }
        setSuccessMessage('Job description extracted and analyzed successfully!')
      } else {
        setError(data.error || 'Failed to extract job description')
      }
    } catch (error) {
      console.error('JD extraction error:', error)
      setError('Failed to extract job description. Please try again.')
    } finally {
      setIsExtractingJD(false)
    }
  }

  const handleCombinedAnalysis = async (file: File) => {
    setIsScanning(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (jdText.trim()) {
        formData.append('jdText', jdText)
      } else if (jdUrl.trim()) {
        formData.append('jdUrl', jdUrl)
      }

      const response = await fetch('/api/resume/analyze-combined', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setScanResults(data.data)
        setSuccessMessage('Combined resume-JD analysis completed!')
      } else {
        setError(data.error || 'Failed to analyze resume')
      }
    } catch (error) {
      console.error('Combined analysis error:', error)
      setError('Failed to analyze resume. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsScanning(false)
  }

  const handleDownloadReport = async () => {
    const dataToUse = scanResults || resumeData?.analysis
    if (dataToUse) {
      try {
        await downloadReport(dataToUse)
      } catch (error) {
        console.error('Failed to download report:', error)
        setError('Failed to generate report. Please try again.')
      }
    }
  }

  const handleDeleteResume = async () => {
    if (confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      try {
        await deleteResume()
        setScanResults(null)
        setSuccessMessage('Resume deleted successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (error) {
        setError('Failed to delete resume. Please try again.')
      }
    }
  }

  const handleRefreshAnalysis = () => {
    if (resumeData?.analysis) {
      setScanResults(resumeData.analysis)
      setSuccessMessage('Loaded your saved resume analysis!')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/10 border-green-500/30'
    if (score >= 6) return 'bg-yellow-500/10 border-yellow-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  // Use saved analysis if available
  const displayData = scanResults || resumeData?.analysis

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resume Scanner</h1>
          <p className="text-gray-400">AI-powered resume analysis with instant feedback</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={AlertCircle} className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={CheckCircle} className="w-5 h-5 text-green-400" />
              <span className="text-green-400">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Resume Status Section */}
        {hasResume && (
          <SafeComponent>
            <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FileText} className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Your Resume</h3>
                    <p className="text-sm text-gray-400">
                      {resumeData?.fileName} • Uploaded {new Date(resumeData?.uploadedAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRefreshAnalysis}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Load saved analysis"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDeleteResume}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {resumeData?.analysis && (
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">Overall Score:</span>
                  <span className={`font-bold ${getScoreColor(resumeData.analysis.overallScore)}`}>
                    {resumeData.analysis.overallScore}/10
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Interview Chance:</span>
                  <span className={`font-bold ${getScoreColor(resumeData.analysis.interviewLikelihood / 10)}`}>
                    {resumeData.analysis.interviewLikelihood}%
                  </span>
                </div>
              )}
            </div>
          </SafeComponent>
        )}

        {/* Job Description Section */}
        <SafeComponent>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Job Description
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAnalysisMode(analysisMode === 'resume' ? 'combined' : 'resume')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    analysisMode === 'combined' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  {analysisMode === 'combined' ? 'Combined Mode' : 'Resume Only'}
                </button>
              </div>
            </div>

            {analysisMode === 'combined' && (
              <div className="space-y-4">
                {/* JD URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Description URL (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={jdUrl}
                      onChange={(e) => setJdUrl(e.target.value)}
                      placeholder="https://linkedin.com/jobs/view/123456789"
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleExtractJD}
                      disabled={isExtractingJD || !jdUrl.trim()}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                    >
                      {isExtractingJD ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Extract JD
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* JD Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Description Text
                  </label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {/* JD Analysis Results */}
                {jdAnalysis && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">Job Description Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Experience Level:</span>
                        <span className="text-purple-400">{jdAnalysis.experienceLevel}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Key Skills:</span>
                        <span className="text-purple-400">{jdAnalysis.keySkills?.slice(0, 3).join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Match Score:</span>
                        <span className="text-purple-400">{jdAnalysis.matchScore || 'N/A'}/10</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </SafeComponent>

        {/* File Upload Section */}
        <SafeComponent>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <SafeIcon icon={Upload} className="w-5 h-5 mr-2 text-blue-400" />
              {hasResume ? 'Update Resume' : 'Upload Resume'}
            </h2>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              onAnalysisComplete={(file) => {
                if (analysisMode === 'combined' && (jdText.trim() || jdUrl.trim())) {
                  handleCombinedAnalysis(file)
                } else {
                  handleError('Please provide job description for combined analysis or switch to resume-only mode')
                }
              }}
              onError={handleError}
              isAnalyzing={isScanning}
              acceptedFormats={['pdf', 'docx', 'txt']}
              maxFileSize={10 * 1024 * 1024}
            />
          </div>
        </SafeComponent>

        {/* Analysis Results */}
        {displayData && (
          <SafeComponent>
            <div className="space-y-6">
              {/* Results Header with Download */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRefreshAnalysis}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => handleDownloadReport()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
              
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Overall Score"
                  value={`${displayData.overallScore}/10`}
                  trend={displayData.interviewLikelihood ? {
                    value: `${displayData.interviewLikelihood}% interview chance`,
                    isPositive: displayData.interviewLikelihood > 50
                  } : undefined}
                  icon={Award}
                  className={getScoreBg(displayData.overallScore)}
                />
                
                <StatCard
                  title="ATS Compatibility"
                  value={`${displayData.atsScore}/10`}
                  trend={{
                    value: "Applicant Tracking Systems",
                    isPositive: displayData.atsScore >= 7
                  }}
                  icon={Target}
                  className={getScoreBg(displayData.atsScore)}
                />
                
                <StatCard
                  title="JD Match Score"
                  value={`${displayData.jdMatchScore || displayData.resumeAnalysis?.jdMatchScore || 0}/10`}
                  trend={{
                    value: "Job description alignment",
                    isPositive: (displayData.jdMatchScore || displayData.resumeAnalysis?.jdMatchScore || 0) >= 7
                  }}
                  icon={Target}
                  className={getScoreBg(displayData.jdMatchScore || displayData.resumeAnalysis?.jdMatchScore || 0)}
                />
                
                <StatCard
                  title="Confidence Level"
                  value={`${displayData.jobCrackingStrategy?.confidenceLevel || displayData.resumeAnalysis?.jobCrackingStrategy?.confidenceLevel || 0}%`}
                  trend={{
                    value: "Job cracking potential",
                    isPositive: (displayData.jobCrackingStrategy?.confidenceLevel || displayData.resumeAnalysis?.jobCrackingStrategy?.confidenceLevel || 0) >= 70
                  }}
                  icon={Zap}
                  className={getScoreBg((displayData.jobCrackingStrategy?.confidenceLevel || displayData.resumeAnalysis?.jobCrackingStrategy?.confidenceLevel || 0) / 10)}
                />
              </div>

              {/* Job Cracking Strategy */}
              {displayData.jobCrackingStrategy && (
                <ChartCard
                  title="🎯 Job Cracking Strategy"
                  description="Personalized strategy to help you get this job"
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Primary Focus</span>
                        <span className="text-purple-400">{displayData.jobCrackingStrategy.primaryFocus}</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        <span className="text-gray-400">Key Differentiator:</span> {displayData.jobCrackingStrategy.keyDifferentiator}
                      </div>
                      <div className="text-sm text-gray-300">
                        <span className="text-gray-400">Timeline:</span> {displayData.jobCrackingStrategy.timeline}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Critical Success Factors</h4>
                        <div className="space-y-2">
                          {displayData.jobCrackingStrategy.criticalSuccessFactors?.map((factor: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">AI Insights</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Market Position:</span>
                            <span className="text-blue-400">{displayData.aiInsights?.marketPosition}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Growth Potential:</span>
                            <span className="text-green-400">{displayData.aiInsights?.growthPotential}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Competitive Edge:</span>
                            <span className="text-purple-400">{displayData.aiInsights?.competitiveAdvantage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ChartCard>
              )}

              {/* Personalized Recommendations */}
              {displayData.personalizedRecommendations && (
                <ChartCard
                  title="💡 Personalized Recommendations"
                  description="Actionable advice to help you crack this job"
                >
                  <div className="space-y-6">
                    {/* To Crack The Job */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-yellow-400" />
                        To Crack This Job
                      </h4>
                      <div className="space-y-2">
                        {displayData.personalizedRecommendations.toCrackTheJob?.map((action: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-yellow-400 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-300 text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resume Optimizations */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-400" />
                        Resume Optimizations
                      </h4>
                      <div className="space-y-2">
                        {displayData.personalizedRecommendations.resumeOptimizations?.map((opt: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-400 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-300 text-sm">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interview Preparation */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-400" />
                        Interview Preparation
                      </h4>
                      <div className="space-y-2">
                        {displayData.personalizedRecommendations.interviewPrep?.map((prep: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-300 text-sm">{prep}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Application Strategy */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                        Application Strategy
                      </h4>
                      <div className="space-y-2">
                        {displayData.personalizedRecommendations.applicationStrategy?.map((strategy: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-green-400 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-300 text-sm">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ChartCard>
              )}

              {/* Critical Issues */}
              {displayData.criticalIssues && displayData.criticalIssues.length > 0 && (
                <ChartCard
                  title="Critical Issues"
                  description="Items that need immediate attention"
                >
                  <div className="space-y-3">
                    {displayData.criticalIssues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <SafeIcon icon={AlertCircle} className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-400 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}

              {/* Improvements */}
              {displayData.improvements && displayData.improvements.length > 0 && (
                <ChartCard
                  title="Recommended Improvements"
                  description="Suggestions to enhance your resume"
                >
                  <div className="space-y-3">
                    {displayData.improvements.map((improvement: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <SafeIcon icon={TrendingUp} className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-400 text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}

              {/* Missing Keywords */}
              {displayData.missingKeywords && displayData.missingKeywords.length > 0 && (
                <ChartCard
                  title="Missing Keywords"
                  description="Important keywords for your target role"
                >
                  <div className="flex flex-wrap gap-2">
                    {displayData.missingKeywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </ChartCard>
              )}
            </div>
          </SafeComponent>
        )}

        {/* Features Section */}
        {!scanResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <ActionCard
              title="AI Analysis"
              description="Advanced AI analyzes your resume for ATS optimization"
              icon={Zap}
              action={() => {}}
              actionText="Learn More"
              className="from-purple-500 to-purple-600"
            />
            <ActionCard
              title="Keyword Matching"
              description="Industry-specific keyword analysis for your role"
              icon={Target}
              action={() => {}}
              actionText="Learn More"
              className="from-emerald-500 to-emerald-600"
            />
            <ActionCard
              title="Professional Reports"
              description="Download detailed PDF analysis reports"
              icon={FileText}
              action={() => {}}
              actionText="Learn More"
              className="from-blue-500 to-blue-600"
            />
          </div>
        )}
      </div>
    </div>
  )
}
