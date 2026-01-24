'use client'

import { ExternalLink } from 'lucide-react'
import { extractJDFromURL } from '@/lib/resume-analyzer'

interface JDExtractorProps {
  jdLink: string
  onExtract: (content: string) => void
  isExtracting: boolean
  setIsExtracting: (extracting: boolean) => void
}

export default function JDExtractor({ 
  jdLink, 
  onExtract, 
  isExtracting, 
  setIsExtracting 
}: JDExtractorProps) {
  const handleExtractJD = async () => {
    if (!jdLink.trim()) return
    
    setIsExtracting(true)
    try {
      const extracted = await extractJDFromURL(jdLink)
      onExtract(extracted)
    } catch (error) {
      console.error('Error extracting JD:', error)
      alert('Failed to extract job description. Please try pasting it directly.')
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <button
      onClick={handleExtractJD}
      disabled={!jdLink.trim() || isExtracting}
      className="px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
    >
      {isExtracting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Extracting...
        </>
      ) : (
        <>
          <ExternalLink className="h-4 w-4 mr-2" />
          Extract JD
        </>
      )}
    </button>
  )
}
