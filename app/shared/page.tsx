'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Share2, 
  FileText, 
  Briefcase, 
  Target, 
  CheckCircle,
  Clock,
  Globe,
  Users,
  TrendingUp,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react'

interface SharedContent {
  id: string
  title: string
  description: string
  category: 'resume' | 'job' | 'assessment' | 'general'
  type?: string
  expiresAt?: string
  customParams?: Record<string, string>
}

export default function SharedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sharedContent, setSharedContent] = useState<SharedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = searchParams.get('id')
    const category = searchParams.get('category')
    const title = searchParams.get('title')
    const expires = searchParams.get('expires')

    if (!id || !category || !title) {
      router.push('/')
      return
    }

    // Check if link has expired
    if (expires) {
      const expiryDate = new Date(expires)
      if (expiryDate < new Date()) {
        router.push('/?expired=true')
        return
      }
    }

    const content: SharedContent = {
      id,
      title,
      description: searchParams.get('description') || '',
      category: category as SharedContent['category'],
      type: searchParams.get('type'),
      expiresAt: expires || undefined,
      customParams: Object.fromEntries(searchParams.entries())
    }

    setSharedContent(content)
    setLoading(false)

    // Track analytics
    trackAnalytics(id, 'view')
  }, [router, searchParams])

  const trackAnalytics = async (shareId: string, action: 'view' | 'use') => {
    try {
      await fetch('/api/share?action=analytics&shareId=' + shareId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const url = window.location.href
    const text = `Check out this ${sharedContent?.title} on Glixtron!`
    
    if (navigator.share) {
      navigator.share({
        title: sharedContent?.title,
        text: text,
        url: url
      })
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    }
  }

  const handleAction = () => {
    if (sharedContent) {
      trackAnalytics(sharedContent.id, 'use')
      
      // Redirect based on category
      switch (sharedContent.category) {
        case 'resume':
          router.push('/resume-scanner')
          break
        case 'job':
          router.push('/job-search')
          break
        case 'assessment':
          router.push('/assessment')
          break
        default:
          router.push('/dashboard')
      }
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resume':
        return <FileText className="h-6 w-6" />
      case 'job':
        return <Briefcase className="h-6 w-6" />
      case 'assessment':
        return <Target className="h-6 w-6" />
      default:
        return <Globe className="h-6 w-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resume':
        return 'from-blue-500 to-blue-600'
      case 'job':
        return 'from-green-500 to-green-600'
      case 'assessment':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-orange-500 to-orange-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-400">Loading shared content...</p>
        </div>
      </div>
    )
  }

  if (!sharedContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
          <p className="text-slate-400 mb-6">This shared content may have expired or been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="h-8 w-8 text-blue-400 mr-2" />
            <h1 className="text-3xl font-bold text-white">Shared Content</h1>
          </div>
          <p className="text-slate-300">
            You&apos;ve been invited to explore this career development resource
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(sharedContent.category)}`}>
                {getCategoryIcon(sharedContent.category)}
                <span className="ml-2 text-white font-medium capitalize">
                  {sharedContent.category}
                </span>
              </div>
              
              {sharedContent.expiresAt && (
                <div className="flex items-center text-slate-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Expires: {new Date(sharedContent.expiresAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Title and Description */}
            <h2 className="text-2xl font-bold text-white mb-4">
              {sharedContent.title}
            </h2>
            <p className="text-slate-300 mb-6">
              {sharedContent.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAction}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium transition-all transform hover:scale-105"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Get Started
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Why Choose Glixtron?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <FileText className="h-8 w-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">AI Resume Analysis</h4>
              <p className="text-slate-400 text-sm">
                Get instant feedback on your resume with AI-powered analysis and optimization suggestions.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <Briefcase className="h-8 w-8 text-green-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Smart Job Matching</h4>
              <p className="text-slate-400 text-sm">
                Find the perfect job opportunities with our intelligent matching algorithm.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <Target className="h-8 w-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Career DNA</h4>
              <p className="text-slate-400 text-sm">
                Discover your unique career profile with our comprehensive assessment tools.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-slate-300 mb-6">
              Join thousands of professionals who have advanced their careers with Glixtron
            </p>
            <div className="flex items-center justify-center space-x-4 text-slate-400 text-sm mb-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>95% Success Rate</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span>Global Reach</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/register')}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Share Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">Share this:</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            
            <button
              onClick={() => window.open('https://glixtron.app', '_blank')}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visit Glixtron</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
