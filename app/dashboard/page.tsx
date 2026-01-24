'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, TrendingUp, BookOpen, AlertCircle, User } from 'lucide-react'
import { getAiAnalysis, type UserInputs, type AIAnalysis } from '@/lib/mock-data'

export default function DashboardPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)

  useEffect(() => {
    // Get assessment data from localStorage
    const assessmentData = localStorage.getItem('assessmentData')
    if (!assessmentData) {
      router.push('/assessment')
      return
    }

    try {
      const userInputs: UserInputs = JSON.parse(assessmentData)
      const aiAnalysis = getAiAnalysis(userInputs)
      setAnalysis(aiAnalysis)
    } catch (error) {
      console.error('Error parsing assessment data:', error)
      router.push('/assessment')
    }
  }, [router])

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-400">Loading your Career Genome...</p>
        </div>
      </div>
    )
  }

  const { careerDNA, skillRadar, jobMatches, learningPaths, genomeDimensions } = analysis

  // Skill Radar Chart Component
  const SkillRadar = () => {
    const skills = [
      { label: 'Technical', value: skillRadar.technical },
      { label: 'Creative', value: skillRadar.creative },
      { label: 'Analytical', value: skillRadar.analytical },
      { label: 'Leadership', value: skillRadar.leadership },
      { label: 'Communication', value: skillRadar.communication },
      { label: 'Strategic', value: skillRadar.strategic },
    ]

    const size = 200
    const center = size / 2
    const maxRadius = 80

    const getPoint = (index: number, value: number) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2
      const radius = (value / 100) * maxRadius
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return { x, y }
    }

    const points = skills.map((skill, index) => getPoint(index, skill.value))
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

    return (
      <div className="relative">
        <svg width={size} height={size} className="mx-auto">
          {/* Grid circles */}
          {[1, 2, 3, 4].map((level) => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(maxRadius / 4) * level}
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {skills.map((_, index) => {
            const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2
            const x = center + maxRadius * Math.cos(angle)
            const y = center + maxRadius * Math.sin(angle)
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(148, 163, 184, 0.1)"
                strokeWidth="1"
              />
            )
          })}
          
          {/* Skill area */}
          <path
            d={pathData}
            fill="rgba(96, 165, 250, 0.2)"
            stroke="rgba(96, 165, 250, 0.8)"
            strokeWidth="2"
          />
          
          {/* Skill points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#60a5fa"
            />
          ))}
          
          {/* Labels */}
          {skills.map((skill, index) => {
            const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2
            const labelRadius = maxRadius + 25
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-slate-300"
              >
                {skill.label}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Hello, Candidate. Here is your <span className="gradient-text">Career Genome</span>.
                </h1>
              </div>
              <p className="text-slate-400">
                {genomeDimensions}-dimension analysis complete
              </p>
            </div>
            <Link
              href="/profile"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-medium transition-colors flex items-center"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: The Genome */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-blue-400" />
                Skill Radar
              </h2>
              <SkillRadar />
            </div>

            <div className="glass rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-violet-400" />
                Career DNA
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {careerDNA.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {careerDNA.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/50 rounded-lg text-blue-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: The Matches */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">High Match Opportunities</h2>
              <div className="space-y-4">
                {jobMatches.map((job, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                        <p className="text-slate-400">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">{job.matchScore}%</div>
                        <div className="text-xs text-slate-500">Match</div>
                      </div>
                    </div>
                    
                    {job.missingSkills.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="flex items-center text-sm text-amber-400 mb-2">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">Gap Analysis</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.missingSkills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-amber-300 text-sm"
                            >
                              Missing: {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Development */}
        <div className="glass rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-violet-400" />
            Recommended Learning Path
          </h2>
          <p className="text-slate-400 mb-6">
            Personalized courses to close skill gaps and accelerate your career growth
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {learningPaths.map((path, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-violet-500/50 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                <div className="flex items-center text-slate-400 text-sm mb-4">
                  <span>{path.provider}</span>
                  <span className="mx-2">•</span>
                  <span>{path.duration}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded text-violet-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
