'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Briefcase, 
  Target, 
  TrendingUp, 
  Users, 
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  BarChart3,
  Play,
  ChevronRight
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const features = [
    {
      icon: FileText,
      title: 'AI Resume Analysis',
      description: 'Get instant feedback on your resume with our advanced AI analysis and optimization suggestions.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Briefcase,
      title: 'Smart Job Matching',
      description: 'Find the perfect job opportunities with our intelligent matching algorithm.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Target,
      title: 'Career DNA Assessment',
      description: 'Discover your unique career profile with our comprehensive assessment tools.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track your job search progress with detailed analytics and insights.',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
    { label: 'Global Reach', value: '50+', icon: Globe },
    { label: 'AI Analyses', value: '100K+', icon: Zap }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Tech Corp',
      content: 'Glixtron helped me optimize my resume and I landed my dream job within 2 weeks!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      company: 'StartupXYZ',
      content: 'The career assessment gave me clarity on my strengths and helped me pivot to the right role.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'UX Designer',
      company: 'Design Studio',
      content: 'The job matching feature is incredible. I found opportunities I never would have discovered.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Glixtron</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
              <Link href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Career Development Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transform Your Career with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have advanced their careers with our AI-powered resume analysis, job matching, and career assessment tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all transform hover:scale-105">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            
            <button className="inline-flex items-center px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful AI tools designed to accelerate your career development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            See what our users have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="text-white font-medium">{testimonial.name}</p>
                <p className="text-slate-400 text-sm">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have advanced their careers with Glixtron
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white/40"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              {isSubscribed ? 'Subscribed!' : 'Get Started'}
            </button>
          </form>
          
          <p className="text-blue-100 text-sm">
            No credit card required • Free forever for basic features
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Glixtron</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-powered career development platform for professionals worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/api/docs" className="text-slate-400 hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/support" className="text-slate-400 hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/status" className="text-slate-400 hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 Glixtron. All rights reserved. Built with ❤️ for career professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
