'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import FileUpload from '@/components/FileUpload'
import { SafeComponent, SafeIcon, useSafeAsync } from '@/components/SafetyWrapper'
import { useBrandConfig } from '@/hooks/useBrandConfig'
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
  Shield,
  AlertTriangle
} from 'lucide-react'

export default function ResumeScannerPage() {
  const [scanResults, setScanResults] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { config: brandConfig, isLoading: configLoading } = useBrandConfig()
  const { downloadReport } = useResumeReport()

  const handleFileSelect = (file: File) => {
    setError(null)
    setSuccessMessage(null)
    console.log('File selected:', file.name)
  }

  const handleAnalysisComplete = (results: any) => {
    setScanResults(results)
    setIsScanning(false)
    setSuccessMessage('Analysis completed successfully!')
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsScanning(false)
  }

  const handleDownloadReport = () => {
    if (scanResults) {
      downloadReport(scanResults)
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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {configLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading Resume Scanner...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!configLoading && (
          <>
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

        {/* File Upload Section */}
        <SafeComponent>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <SafeIcon icon={Upload} className="w-5 h-5 mr-2 text-blue-400" />
              Upload Resume
            </h2>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
              isAnalyzing={isScanning}
              acceptedFormats={['pdf', 'docx', 'txt']}
              maxFileSize={10 * 1024 * 1024}
            />
          </div>
        </SafeComponent>

        {/* Analysis Results */}
        {scanResults && (
          <SafeComponent>
            <div className="space-y-6">
              {/* Results Header with Download */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <SafeIcon icon={Download} size={16} />
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
                  icon={Sparkles}
                  className={getScoreBg(scanResults.contentScore)}
                />
                
                <StatCard
                  title="Structure"
                  value={`${scanResults.structureScore}/10`}
                  trend={{
                    value: "Resume formatting",
                    isPositive: scanResults.structureScore >= 7
                  }}
                  icon={Shield}
                  className={getScoreBg(scanResults.structureScore)}
                />
              </div>

              {/* Critical Issues */}
              {scanResults.criticalIssues && scanResults.criticalIssues.length > 0 && (
                <ChartCard
                  title="Critical Issues"
                  description="Items that need immediate attention"
                >
                  <div className="space-y-3">
                    {scanResults.criticalIssues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <SafeIcon icon={AlertCircle} className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-400 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}

              {/* Improvements */}
              {scanResults.improvements && scanResults.improvements.length > 0 && (
                <ChartCard
                  title="Recommended Improvements"
                  description="Suggestions to enhance your resume"
                >
                  <div className="space-y-3">
                    {scanResults.improvements.map((improvement: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <SafeIcon icon={TrendingUp} className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-400 text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}

              {/* Missing Keywords */}
              {scanResults.missingKeywords && scanResults.missingKeywords.length > 0 && (
                <ChartCard
                  title="Missing Keywords"
                  description="Important keywords for your target role"
                >
                  <div className="flex flex-wrap gap-2">
                    {scanResults.missingKeywords.map((keyword: string, index: number) => (
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
          </>
        )}
      </div>
    </div>
  )
}
