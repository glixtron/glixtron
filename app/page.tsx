'use client'

import Link from 'next/link'
import { Sparkles, Brain, Network, TrendingUp, FileText, CheckCircle2, ArrowRight, Zap, Shield, Target, Users, Star, BarChart3, Lightbulb, Rocket, Award, Globe, Code2, Cpu, Database, Cloud, Lock, Heart, MessageSquare, TrendingDown, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, BookOpen, GraduationCap, Briefcase, UserCheck, Building2, Linkedin, Twitter, Github, Instagram, ChevronRight, Play, Video, FileCheck, Search, PieChart, Activity, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { brandConfig } from '@/lib/brand-config'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    setIsVisible(true)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-40 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.15),transparent_50%)]"
          style={{ transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)` }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.15),transparent_50%)]"
          style={{ transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)` }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(${45 + scrollY * 0.05}deg, rgba(96,165,250,0.1) 0%, rgba(167,139,250,0.1) 50%, rgba(236,72,153,0.1) 100%)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Enhanced Badge */}
          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full glass mb-8 backdrop-blur-xl border border-blue-500/30 shadow-lg shadow-blue-500/20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <img src="/logo-updated.svg" alt="CareerPath Pro" className="h-5 w-5 animate-spin-slow" />
            <span className="text-sm font-semibold text-blue-300">AI-Powered Career Intelligence</span>
            <div className="flex items-center space-x-1 ml-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
          
          {/* Enhanced Main Headline */}
          <h1 className={`text-6xl md:text-8xl font-extrabold mb-8 leading-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="block text-white">Discover Your</span>
            <span className="block gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 animate-gradient hover:from-violet-400 hover:via-blue-400 hover:to-violet-400 transition-all duration-500">
              Career Genome
            </span>
          </h1>
          
          {/* Enhanced Subheadline */}
          <p className={`text-2xl md:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            AI-powered intelligence to assess, develop, and connect you to your future.
            <span className="block mt-3 text-xl text-slate-400">
              Your personal career architect, powered by 127-dimensional analysis.
            </span>
          </p>
          
          {/* Enhanced Description */}
          <div className={`max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-lg text-slate-400 leading-relaxed">
              {brandConfig.appName} revolutionizes career development through advanced AI technology that analyzes your unique professional DNA. 
              Our platform combines machine learning, behavioral psychology, and industry expertise to provide personalized career pathways 
              that align with your skills, aspirations, and market opportunities.
            </p>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/assessment"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all text-white font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transform hover:scale-105 flex items-center space-x-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Start Free Assessment
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateX(-100%)' }} />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateX(100%)' }} />
            </Link>
            
            <Link
              href="/resume-scanner"
              className="group px-10 py-5 bg-slate-800/80 backdrop-blur-xl border-2 border-slate-700 hover:border-blue-500/50 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-3 relative overflow-hidden"
            >
              <FileText className="mr-2 h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span>Scan Resume</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className={`flex flex-wrap justify-center items-center gap-8 text-slate-400 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {[
              { icon: Users, label: '10,000+ Users', color: 'blue' },
              { icon: Target, label: '95% Match Accuracy', color: 'violet' },
              { icon: Zap, label: 'AI-Powered', color: 'yellow' },
              { icon: Shield, label: 'Secure Platform', color: 'green' }
            ].map((item, i) => (
              <div key={i} className="group flex items-center space-x-2 hover-lift px-4 py-2 rounded-full glass border border-slate-700/50">
                <item.icon className={`h-5 w-5 text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
              <Building2 className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-semibold">About {brandConfig.appName}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pioneering the Future of <span className="gradient-text">Career Intelligence</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Founded in 2024, {brandConfig.appName} emerged from a simple mission: to democratize career guidance through cutting-edge AI technology. 
              Our team of data scientists, career coaches, and industry experts has helped thousands of professionals navigate their career journeys with confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="glass rounded-2xl p-8 border border-slate-700/50 hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                    <p className="text-slate-400 leading-relaxed">
                      To empower every professional with AI-driven insights that unlock their full career potential and 
                      create meaningful connections between talent and opportunity.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-slate-700/50 hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                    <p className="text-slate-400 leading-relaxed">
                      A world where every career decision is informed by data, personalized by AI, and aligned with 
                      individual passions and market realities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-slate-700/50 hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Our Values</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Innovation, integrity, and inclusion drive everything we do. We believe in creating 
                      equitable access to career opportunities for all professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="glass rounded-3xl p-12 border border-slate-700/50">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold gradient-text mb-2">10,000+</div>
                    <div className="text-slate-400">Professionals Helped</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-blue-500/10 rounded-xl border border-blue-500/30">
                      <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                      <div className="text-slate-400 text-sm">Industries Covered</div>
                    </div>
                    <div className="text-center p-6 bg-violet-500/10 rounded-xl border border-violet-500/30">
                      <div className="text-3xl font-bold text-violet-400 mb-2">127</div>
                      <div className="text-slate-400 text-sm">Data Points Analyzed</div>
                    </div>
                    <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-500/30">
                      <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                      <div className="text-slate-400 text-sm">Success Rate</div>
                    </div>
                    <div className="text-center p-6 bg-amber-500/10 rounded-xl border border-amber-500/30">
                      <div className="text-3xl font-bold text-amber-400 mb-2">24/7</div>
                      <div className="text-slate-400 text-sm">AI Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-semibold">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">{brandConfig.appName}</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Unlock your career potential with cutting-edge AI technology and personalized insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Enhanced Feature 1 */}
            <div className="group glass rounded-2xl p-10 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/30 animate-pulse-glow">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">Career Genome AI</h3>
                <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  127-dimension analysis of your potential. We map your unique career DNA across skills, interests, values, and aspirations with precision.
                </p>
                <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Enhanced Feature 2 */}
            <div className="group glass rounded-2xl p-10 hover:border-violet-500/50 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-violet-500/30 animate-pulse-glow">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-violet-300 transition-colors">Smart Matching</h3>
                <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  Connect with roles that fit your DNA, not just keywords. Our AI understands context, culture, and career trajectory for perfect matches.
                </p>
                <div className="flex items-center text-violet-400 font-semibold group-hover:translate-x-2 transition-transform cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Enhanced Feature 3 */}
            <div className="group glass rounded-2xl p-10 hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-green-500/30 animate-pulse-glow">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-300 transition-colors">Growth Pathways</h3>
                <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  Personalized roadmaps to close skill gaps. Get actionable learning paths tailored to your career goals with measurable outcomes.
                </p>
                <div className="flex items-center text-green-400 font-semibold group-hover:translate-x-2 transition-transform cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Scanner Feature */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12 md:p-16 border border-slate-700/50 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/50 mb-6">
                  <FileText className="h-4 w-4 text-violet-400" />
                  <span className="text-sm text-violet-300 font-semibold">New Feature</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  AI Resume <span className="gradient-text">Scanner</span>
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Paste a job description link or text, and our AI will analyze your resume, extract key requirements, and provide actionable suggestions to increase your hiring chances.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    'Automatic JD extraction from job posting URLs',
                    'Skills matching and gap analysis',
                    'Keyword optimization suggestions',
                    'Hiring probability scoring with improvement tips'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/resume-scanner"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl hover:from-violet-600 hover:to-blue-600 transition-all text-white font-semibold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transform hover:scale-105"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Try Resume Scanner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="relative">
                <div className="glass rounded-2xl p-10 border border-violet-500/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Match Score</span>
                      <span className="text-4xl font-bold gradient-text">87%</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: '87%' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="text-sm text-green-400 mb-1 font-medium">Matched Skills</div>
                        <div className="text-3xl font-bold text-white">12</div>
                      </div>
                      <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <div className="text-sm text-amber-400 mb-1 font-medium">Missing Skills</div>
                        <div className="text-3xl font-bold text-white">3</div>
                      </div>
                    </div>
                    <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl mt-4">
                      <div className="text-sm text-blue-400 mb-1 font-medium">Potential Improvement</div>
                      <div className="text-2xl font-bold text-white">+15%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
              <Briefcase className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300 font-semibold">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive <span className="gradient-text">Career Solutions</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              From assessment to placement, we provide end-to-end career development services powered by advanced AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Career Assessment",
                description: "Comprehensive 127-dimensional analysis of your skills, personality, and career preferences",
                features: ["Skills Evaluation", "Personality Analysis", "Career Interest Mapping", "Strength Assessment"],
                color: "blue"
              },
              {
                icon: FileText,
                title: "Resume Optimization",
                description: "AI-powered resume analysis and optimization to maximize your hiring chances",
                features: ["ATS Compatibility", "Keyword Optimization", "Format Enhancement", "Content Improvement"],
                color: "violet"
              },
              {
                icon: Search,
                title: "Job Matching",
                description: "Smart matching with opportunities that align with your career DNA and aspirations",
                features: ["AI Matching", "Culture Fit Analysis", "Salary Optimization", "Growth Potential"],
                color: "green"
              },
              {
                icon: GraduationCap,
                title: "Skill Development",
                description: "Personalized learning paths to bridge skill gaps and advance your career",
                features: ["Custom Learning Plans", "Course Recommendations", "Progress Tracking", "Certification Prep"],
                color: "amber"
              },
              {
                icon: UserCheck,
                title: "Interview Coaching",
                description: "AI-driven interview preparation with personalized feedback and practice sessions",
                features: ["Mock Interviews", "Question Prediction", "Performance Analysis", "Confidence Building"],
                color: "red"
              },
              {
                icon: TrendingUp,
                title: "Career Planning",
                description: "Long-term career strategy development with milestone tracking and adjustments",
                features: ["5-Year Planning", "Goal Setting", "Progress Monitoring", "Strategy Updates"],
                color: "indigo"
              }
            ].map((service, i) => (
              <div key={i} className="group glass rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden hover-lift">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-slate-500/30">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-slate-200 transition-colors">{service.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform cursor-pointer">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-semibold">Customer Support</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Always Here to <span className="gradient-text">Help You Succeed</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our dedicated support team is available 24/7 to ensure you get the most out of your {brandConfig.appName} experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Mail,
                title: "Email Support",
                description: "Get detailed responses to your questions",
                contact: brandConfig.supportEmail,
                responseTime: "Within 24 hours",
                color: "blue"
              },
              {
                icon: Phone,
                title: "Phone Support",
                description: "Speak directly with our career experts",
                contact: "+1 (555) 123-4567",
                responseTime: "Mon-Fri, 9AM-6PM EST",
                color: "green"
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                description: "Instant help when you need it most",
                contact: "Available on website",
                responseTime: "24/7 Availability",
                color: "violet"
              }
            ].map((support, i) => (
              <div key={i} className="glass rounded-2xl p-8 border border-slate-700/50 hover-lift">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-${support.color}-500 to-${support.color}-600 flex items-center justify-center mb-6">
                  <support.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{support.title}</h3>
                <p className="text-slate-400 mb-4">{support.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-slate-300">
                    <span className="font-medium mr-2">Contact:</span>
                    <span className="text-blue-400">{support.contact}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Clock className="h-4 w-4 mr-2 text-green-400" />
                    <span className="text-sm">{support.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass rounded-3xl p-12 border border-slate-700/50">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "How accurate is the career assessment?",
                      a: "Our 127-dimensional analysis has been validated with over 10,000 professionals and maintains a 95% accuracy rate."
                    },
                    {
                      q: "Can I change my career path after assessment?",
                      a: "Absolutely! Our platform provides dynamic recommendations that adapt as your skills and goals evolve."
                    },
                    {
                      q: "Is my data secure and private?",
                      a: "Yes, we use enterprise-grade encryption and never share your personal data with third parties without consent."
                    }
                  ].map((faq, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-6">
                      <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                      <p className="text-slate-400">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Mail className="h-16 w-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-white">Still Have Questions?</h4>
                <p className="text-slate-400 mb-6">
                  Our support team is ready to help you navigate your career journey
                </p>
                <a 
                  href={`mailto:${brandConfig.supportEmail}`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Email Support Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}> 
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">10,000+</span> Professionals
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join thousands who&apos;ve transformed their careers with our AI-powered platform
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: '10K+', icon: Users, color: 'blue', description: 'Career professionals' },
              { label: 'Job Matches', value: '50K+', icon: Target, color: 'violet', description: 'Successful connections' },
              { label: 'Success Rate', value: '95%', icon: Shield, color: 'green', description: 'Placement accuracy' },
              { label: 'AI Analysis', value: '127D', icon: Zap, color: 'yellow', description: 'Dimension analysis' }
            ].map((stat, i) => (
              <div key={i} className="group text-center hover-lift">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <div className={`absolute inset-0 bg-${stat.color}-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <stat.icon className={`h-10 w-10 text-${stat.color}-400 relative z-10`} />
                </div>
                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">{stat.value}</div>
                <div className="text-slate-300 font-semibold mb-1">{stat.label}</div>
                <div className="text-slate-500 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className={`glass rounded-3xl p-12 md:p-20 border border-slate-700/50 shadow-2xl relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-blue-500/5" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 mb-8 shadow-lg shadow-blue-500/30 animate-pulse-glow">
                <Rocket className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Unlock Your <span className="gradient-text">Career Potential</span>?
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals discovering their perfect career match through AI-powered intelligence. Start your journey today and transform your career trajectory.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link
                  href="/assessment"
                  className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all text-white font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transform hover:scale-105 flex items-center justify-center overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    Start Your Assessment Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateX(-100%)' }} />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateX(100%)' }} />
                </Link>
                <Link
                  href="/resume-scanner"
                  className="group px-12 py-6 bg-slate-800/80 backdrop-blur-xl border-2 border-slate-700 hover:border-blue-500/50 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <FileText className="mr-3 h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span>Scan Your Resume</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">Secure &amp; private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm">Proven results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 relative border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src="/logo-updated.svg" alt="{brandConfig.appName}" className="h-10 w-10" />
                <span className="text-2xl font-bold gradient-text">{brandConfig.appName}</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Your personal career architect, powered by AI. We&apos;re revolutionizing how professionals navigate their career journeys.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                  <Twitter className="h-5 w-5 text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                  <Linkedin className="h-5 w-5 text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                  <Github className="h-5 w-5 text-slate-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                  <Instagram className="h-5 w-5 text-pink-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/assessment" className="text-slate-400 hover:text-white transition-colors">Career Assessment</Link></li>
                <li><Link href="/resume-scanner" className="text-slate-400 hover:text-white transition-colors">Resume Scanner</Link></li>
                <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/profile" className="text-slate-400 hover:text-white transition-colors">Profile</Link></li>
                <li><Link href="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                <li><span className="text-slate-400">Career Assessment</span></li>
                <li><span className="text-slate-400">Resume Optimization</span></li>
                <li><span className="text-slate-400">Job Matching</span></li>
                <li><span className="text-slate-400">Skill Development</span></li>
                <li><span className="text-slate-400">Interview Coaching</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <a href={`mailto:${brandConfig.supportEmail}`} className="text-slate-400 hover:text-white transition-colors">
                    {brandConfig.supportEmail}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-slate-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  <span className="text-slate-400">San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span className="text-slate-400">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                © 2024 {brandConfig.companyName}. All rights reserved. Your career, our mission.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
