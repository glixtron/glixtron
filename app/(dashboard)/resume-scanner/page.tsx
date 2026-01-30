'use client'

import { useState } from 'react'
import StatCard from '@/components/StatCard'
import ActionCard from '@/components/ActionCard'
import ChartCard from '@/components/ChartCard'
import { 
  FileText, 
  Upload, 
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Eye,
  Zap
} from 'lucide-react'

export default function ResumeScannerPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [scanResults, setScanResults] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    // Simulate file processing
    setTimeout(() => {
      setScanResults({
        score: 87,
        atsScore: 92,
        sections: {
          contact: 95,
          experience: 88,
          education: 90,
          skills: 82
        },
        suggestions: [
          "Add more quantifiable achievements",
          "Include keywords for your target role",
          "Improve formatting for better ATS readability"
        ],
        keywords: ["Project Management", "Team Leadership", "Data Analysis"]
      })
    }, 2000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const startScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resume Scanner</h1>
        <p className="text-slate-400">Optimize your resume for ATS and maximize your interview chances.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="ATS Score"
          value={scanResults ? `${scanResults.atsScore}%` : '--'}
          icon={Target}
          trend={{ value: "Industry avg: 75%", isPositive: true }}
          description="Applicant Tracking System compatibility"
        />
        <StatCard
          title="Overall Score"
          value={scanResults ? `${scanResults.score}%` : '--'}
          icon={TrendingUp}
          description="Complete resume analysis"
        />
        <StatCard
          title="Resumes Scanned"
          value="1,247"
          icon={FileText}
          trend={{ value: "12% this week", isPositive: true }}
          description="Total scans performed"
        />
        <StatCard
          title="Success Rate"
          value="89%"
          icon={CheckCircle}
          description="Users who got interviews"
        />
      </div>

      {!scanResults ? (
        /* Upload Section */
        <div className="space-y-8">
          {/* Upload Area */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Upload Your Resume</h2>
            <div
              className={`
                border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
                ${isDragging 
                  ? 'border-brand-accent bg-brand-accent/10' 
                  : 'border-slate-700 bg-brand-glass hover:border-slate-600'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-brand-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {uploadedFile ? uploadedFile.name : 'Drop your resume here'}
              </h3>
              <p className="text-slate-400 mb-4">
                {uploadedFile 
                  ? 'File uploaded successfully' 
                  : 'Supports PDF, DOCX, DOC (Max 10MB)'
                }
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-brand-accent text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">What We Analyze</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard
                title="ATS Compatibility"
                description="Check if your resume passes Applicant Tracking Systems used by 90% of companies."
                icon={<Target className="h-6 w-6 text-brand-accent" />}
                action={() => console.log('Learn more')}
                actionText="Learn More"
              />
              <ActionCard
                title="Keyword Optimization"
                description="Ensure your resume contains the right keywords for your target roles."
                icon={<Zap className="h-6 w-6 text-brand-accent" />}
                action={() => console.log('Learn more')}
                actionText="Learn More"
              />
              <ActionCard
                title="Format & Structure"
                description="Analyze formatting, length, and structure for maximum impact."
                icon={<Eye className="h-6 w-6 text-brand-accent" />}
                action={() => console.log('Learn more')}
                actionText="Learn More"
              />
            </div>
          </div>

          {/* Process */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Upload', description: 'Upload your resume file' },
                { step: 2, title: 'Scan', description: 'AI analyzes your resume' },
                { step: 3, title: 'Results', description: 'Get detailed feedback' },
                { step: 4, title: 'Optimize', description: 'Improve your resume' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="h-12 w-12 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-brand-accent font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Overall Score">
              <div className="text-center py-8">
                <div className="relative inline-flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full border-8 border-brand-surface"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-brand-accent border-t-transparent transform rotate-45"
                    style={{ 
                      background: `conic-gradient(from 0deg, #3b82f6 0deg, #3b82f6 ${scanResults.score * 3.6}deg, transparent ${scanResults.score * 3.6}deg)` 
                    }}
                  ></div>
                  <div className="absolute inset-4 bg-brand-surface rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{scanResults.score}%</span>
                  </div>
                </div>
                <p className="text-slate-400 mt-4">Resume Quality Score</p>
              </div>
            </ChartCard>

            <ChartCard title="Section Analysis">
              <div className="space-y-4">
                {Object.entries(scanResults.sections).map(([section, score]) => (
                  <div key={section} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 capitalize">{section}</span>
                      <span className="text-white">{score}%</span>
                    </div>
                    <div className="w-full bg-brand-surface rounded-full h-2">
                      <div 
                        className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Suggestions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Improvement Suggestions</h2>
            <div className="bg-card-gradient border border-slate-700/50 rounded-xl p-6">
              <div className="space-y-4">
                {scanResults.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-brand-warning mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Recommended Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {scanResults.keywords.map((keyword: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-brand-accent/20 text-brand-accent rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-brand-accent text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </button>
            <button 
              onClick={() => {
                setScanResults(null)
                setUploadedFile(null)
              }}
              className="px-6 py-3 bg-brand-surface text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Scan Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
