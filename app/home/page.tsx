'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Shield, 
  Users, 
  BarChart3,
  FileText,
  Briefcase,
  Award,
  Globe,
  Code,
  Zap,
  CheckCircle,
  Loader2,
  Menu,
  X,
  ArrowRight as Right
} from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function HomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Simulate loading time for the logo animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogoClick = () => {
    router.push('/')
  }

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          {/* Logo Animation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white animate-spin" />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="text-white font-bold text-xl animate-pulse">GLIXTRON</div>
              </div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              <p className="text-xl text-white font-medium">Loading your career platform...</p>
            </div>
            <p className="text-gray-400 text-sm">AI-Powered Career Guidance System</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Glixtron
                </span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/assessment"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Assessment
              </Link>
              <Link
                href="/career-guidance"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Career Guidance
              </Link>
              <Link
                href="/resume-scanner"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Resume Scanner
              </Link>
              <Link
                href="/jd-resume-match"
                className="text-gray-300 hover:text-white transition-colors"
              >
                JD Match
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Welcome, {session.user?.name}</span>
                  <Link
                    href="/profile"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 text-gray-300 hover:text-white"
              >
                {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/assessment"
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Assessment
              </Link>
              <Link
                href="/career-guidance"
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Career Guidance
              </Link>
              <Link
                href="/resume-scanner"
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Resume Scanner
              </Link>
              <Link
                href="/jd-resume-match"
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowMenu(false)}
              >
                JD Match
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Brain className="w-16 h-16 text-blue-400" />
              <Target className="w-16 h-16 text-purple-400" />
              <TrendingUp className="w-16 h-16 text-green-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Career Guidance
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your career with intelligent resume analysis, personalized roadmaps, and AI-powered job matching
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 text-lg font-semibold shadow-lg shadow-blue-500/20"
              >
                <Play className="w-5 h-5" />
                <span>Get Started</span>
              </button>
              
              <Link
                href="/assessment/personalized"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 text-lg font-semibold shadow-lg shadow-green-500/20"
              >
                <Brain className="w-5 h-5" />
                <span>Try Assessment</span>
              </Link>
              
              <Link
                href="/jd-resume-match"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                <Target className="w-5 h-5" />
                <span>Match Analysis</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Powerful Features for Your Career Growth
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to land your dream job, all in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI Resume Analysis</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Advanced AI analyzes your resume, identifies strengths and areas for improvement, and provides actionable recommendations
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>95%+ accuracy rate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Skills extraction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Experience analysis</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Personalized Roadmaps</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Get customized career roadmaps based on your skills, experience, and career goals with AI-powered recommendations
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Skill gap analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Timeline planning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Resource recommendations</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Job Matching</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Advanced AI matches your resume with job descriptions and provides detailed compatibility analysis
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Skills matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Experience analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Market insights</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Interview Preparation</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Practice with AI-generated questions and get personalized feedback to ace your interviews
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Technical questions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Behavioral prep</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Mock interviews</span>
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Job Cracking Tips</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Get expert advice on resume optimization, networking strategies, and salary negotiation
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Resume optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Networking tips</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Salary negotiation</span>
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Referral Program</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Earn rewards by sharing the platform with friends and colleagues
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Tier-based rewards</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Social sharing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Analytics tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of users who have transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
              <p className="text-gray-300">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">4.8/5</div>
              <p className="text-gray-300">User Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1000+</div>
              <p className="text-gray-300">Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-12 border border-blue-500/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who have landed their dream jobs with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 text-lg font-semibold"
              >
                <Zap className="w-5 h-5" />
                <span>Start Free Trial</span>
              </button>
              <Link
                href="/demo"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 text-lg font-semibold"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link href="/features" className="hover:text-blue-400">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-blue-400">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-blue-400">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link href="/help" className="hover:text-blue-400">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-blue-400">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-gray-400">
              © 2024 Glixtron. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
