'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import FileUpload from '@/components/FileUpload'
import { brandConfig } from '@/config/brand'
import { apiService } from '@/lib/api-service'
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
  Shield
} from 'lucide-react'

export default function ResumeScannerPage() {
  const [scanResults, setScanResults] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { downloadReport } = useResumeReport()

  const handleFileSelect = (file: File) => {
    setError(null)
    setSuccessMessage(null)
    setIsScanning(true)
  }

  const handleAnalysisComplete = (result: any) => {
    setIsScanning(false)
    setScanResults(result.analysis)
    setSuccessMessage(`Resume analysis complete! Overall score: ${result.analysis.overallScore}/10`)
  }

  const handleError = (errorMessage: string) => {
    setIsScanning(false)
    setError(errorMessage)
  }

  const handleDownloadReport = () => {
    if (scanResults) {
      const reportData = {
        ...scanResults,
        fileName: 'resume.pdf',
        processedAt: new Date().toISOString()
      }
      downloadReport(reportData)
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI Resume Scanner
        </h1>
        <p className="text-slate-400">
          Upload your resume for instant AI-powered analysis and ATS optimization
        </p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {/* File Upload Section */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-400" />
          Upload Resume
        </h2>
        
        <FileUpload
          onFileSelect={handleFileSelect}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
          isAnalyzing={isScanning}
          acceptedFormats={brandConfig.features.supportedFormats}
          maxFileSize={brandConfig.features.maxFileSize}
        />
      </div>

      {/* Analysis Results */}
      {scanResults && (
        <div className="space-y-6">
          {/* Results Header with Download */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Overall Score"
              value={`${scanResults.overallScore}/10`}
              trend={scanResults.interviewLikelihood ? {
                value: `${scanResults.interviewLikelihood}% interview chance`,
                isPositive: scanResults.interviewLikelihood > 50
              } : undefined}
              icon={Award}
              className={getScoreBg(scanResults.overallScore)}
            />
            
            <StatCard
              title="ATS Compatibility"
              value={`${scanResults.atsScore}/10`}
              trend={{
                value: "Applicant Tracking Systems",
                isPositive: scanResults.atsScore >= 7
              }}
              icon={Target}
              className={getScoreBg(scanResults.atsScore)}
            />
            
            <StatCard
              title="Content Quality"
              value={`${scanResults.contentScore}/10`}
              trend={{
                value: "Achievement statements",
                isPositive: scanResults.contentScore >= 7
              }}
              icon={FileText}
              className={getScoreBg(scanResults.contentScore)}
            />
            
            <StatCard
              title="Structure Score"
              value={`${scanResults.structureScore}/10`}
              trend={{
                value: "Formatting & organization",
                isPositive: scanResults.structureScore >= 7
              }}
              icon={Shield}
              className={getScoreBg(scanResults.structureScore)}
            />
          </div>

          {/* Critical Issues */}
          {scanResults.criticalIssues && scanResults.criticalIssues.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Critical Issues to Fix
              </h3>
              <ul className="space-y-2">
                {scanResults.criticalIssues.map((issue: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Improvements */}
          {scanResults.improvements && scanResults.improvements.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Top 3 Improvements
              </h3>
              <ol className="space-y-3">
                {scanResults.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-slate-300">{improvement}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Missing Keywords */}
          {scanResults.missingKeywords && scanResults.missingKeywords.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Missing Keywords for ATS
              </h3>
              <div className="flex flex-wrap gap-2">
                {scanResults.missingKeywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Recommendations */}
          {scanResults.recommendations && scanResults.recommendations.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Additional Recommendations
              </h3>
              <ul className="space-y-2">
                {scanResults.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      {!scanResults && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What We Analyze</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="ATS Compatibility"
              description="Check if your resume passes Applicant Tracking Systems used by 90% of companies."
              icon={Target}
              action={() => console.log('Learn more')}
              actionText="Learn More"
            />
            <ActionCard
              title="Keyword Optimization"
              description="Ensure your resume contains the right keywords for your target roles."
              icon={Zap}
              action={() => console.log('Learn more')}
              actionText="Learn More"
            />
            <ActionCard
              title="Format & Structure"
              description="Analyze formatting, length, and structure for maximum impact."
              icon={Eye}
              action={() => console.log('Learn more')}
              actionText="Learn More"
            />
          </div>
        </div>
      )}
    </div>
  )
}
