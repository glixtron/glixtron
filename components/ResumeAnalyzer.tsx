'use client'

import { Sparkles } from 'lucide-react'
import { analyzeResume, extractJDFromURL, type ResumeAnalysis } from '@/lib/resume-analyzer'

interface ResumeAnalyzerProps {
  resumeText: string
  jdText: string
  onAnalysisComplete: (analysis: ResumeAnalysis) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export default function ResumeAnalyzer({ 
  resumeText, 
  jdText, 
  onAnalysisComplete, 
  isAnalyzing, 
  setIsAnalyzing 
}: ResumeAnalyzerProps) {
  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      alert('Please provide both resume and job description content.')
      return
    }
    
    setIsAnalyzing(true)
    try {
      const analysis = await analyzeResume(resumeText, jdText)
      onAnalysisComplete(analysis)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze resume. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <button
      onClick={handleAnalyze}
      disabled={!resumeText.trim() || !jdText.trim() || isAnalyzing}
      className="w-full px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      {isAnalyzing ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Analyzing Resume...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          Analyze Resume Match
        </>
      )}
    </button>
  )
}

export { extractJDFromURL }
