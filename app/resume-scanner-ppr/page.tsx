'use client'

import { Suspense } from 'react'
import FileUpload from '@/components/FileUpload'
import SkeletonLoader from '@/components/SkeletonLoader'
import { brandConfig } from '@/config/brand'
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  Target,
  Award,
  Shield,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react'

// Static components that load instantly
function StaticHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Resume Scanner</h1>
      <p className="text-gray-400">AI-powered resume analysis with instant feedback</p>
    </div>
  )
}

function StaticFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold">AI Analysis</h3>
        </div>
        <p className="text-gray-400 text-sm">Advanced AI analyzes your resume for ATS optimization and content quality</p>
      </div>
      
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-white font-semibold">Keyword Matching</h3>
        </div>
        <p className="text-gray-400 text-sm">Industry-specific keyword analysis for your target role</p>
      </div>
      
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-white font-semibold">Professional Reports</h3>
        </div>
        <p className="text-gray-400 text-sm">Download branded PDF certificates of your analysis</p>
      </div>
    </div>
  )
}

// Dynamic components that stream in with PPR
function DynamicFileUpload() {
  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-8">
      <FileUpload 
        onFileSelect={(file) => {
          // File upload logic will be handled by the component
          console.log('File selected:', file.name)
        }}
        onAnalysisComplete={(results) => {
          // Analysis results will be handled by the component
          console.log('Analysis complete:', results)
        }}
        onError={(error) => {
          // Error handling will be handled by the component
          console.error('Upload error:', error)
        }}
      />
    </div>
  )
}

// Main resume scanner with PPR
export default function ResumeScannerPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Static Shell - Loads instantly */}
        <StaticHeader />
        <StaticFeatures />
        
        {/* Dynamic Hole - Streams in when ready */}
        <Suspense fallback={<FileUploadSkeleton />}>
          <DynamicFileUpload />
        </Suspense>
      </div>
    </div>
  )
}

// Skeleton component for PPR loading state
function FileUploadSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-8">
      <div className="animate-pulse">
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
            <div className="h-6 bg-slate-700 rounded w-48"></div>
            <div className="h-4 bg-slate-700 rounded w-64"></div>
            <div className="h-10 bg-slate-700 rounded w-32"></div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}
