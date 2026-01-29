'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  FileText,
  Search,
  Zap,
  Award,
  BarChart3
} from 'lucide-react'

interface ATSAnalysisResult {
  atsScore: number
  keywordMatch: number
  categoryScores: Record<string, number>
  foundKeywords: string[]
  missingKeywords: string[]
  highConversionKeywords: string[]
  actionVerbs: string[]
  recommendations: string[]
  optimizationSuggestions: Array<{
    type: string
    original: string
    suggested: string
    impact: string
    reason: string
  }>
}

interface ResumeMatchResult {
  overallMatch: number
  atsCompatibility: number
  skillMatch: number
  experienceMatch: number
  educationMatch: number
  detailedAnalysis: {
    matchingSkills: string[]
    missingSkills: string[]
    experienceAlignment: string
    keywordDensity: number
    readabilityScore: number
    structureScore: number
  }
  enhancementSuggestions: Array<{
    type: string
    original: string
    suggested: string
    impact: string
    reason: string
  }>
}

interface ATSAnalyzerProps {
  resumeText?: string
  jobDescription?: string
  industry?: string
  onAnalysisComplete?: (result: any) => void
}

export default function ATSAnalyzer({ 
  resumeText, 
  jobDescription, 
  industry = 'general',
  onAnalysisComplete 
}: ATSAnalyzerProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null)
  const [matchResult, setMatchResult] = useState<ResumeMatchResult | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ats-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-resume',
          resumeText,
          jobDescription,
          industry
        })
      })

      const data = await response.json()
      if (data.success) {
        setAnalysis(data.data)
        onAnalysisComplete?.(data.data)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const matchResume = async () => {
    if (!resumeText || !jobDescription) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ats-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'match-resume',
          resumeText,
          jobDescription,
          industry
        })
      })

      const data = await response.json()
      if (data.success) {
        setMatchResult(data.data)
        setActiveTab('matching')
      }
    } catch (error) {
      console.error('Matching failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!resumeText || !jobDescription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            ATS Analyzer
          </CardTitle>
          <CardDescription>
            Upload your resume and provide a job description to analyze ATS compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please provide both resume text and job description to run ATS analysis.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={analyzeResume} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Analyze ATS Score'}
        </Button>
        <Button 
          onClick={matchResume} 
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          {loading ? 'Matching...' : 'Match to Job'}
        </Button>
      </div>

      {analysis && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            {matchResult && <TabsTrigger value="matching">Matching</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* ATS Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  ATS Compatibility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                    {analysis.atsScore}%
                  </div>
                  <Progress value={analysis.atsScore} className="mt-4" />
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.atsScore >= 80 ? 'Excellent ATS compatibility' :
                     analysis.atsScore >= 60 ? 'Good ATS compatibility' :
                     'Needs improvement for better ATS performance'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analysis.categoryScores).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="capitalize">{category.replace('_', ' ')}</span>
                        <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
                      </div>
                      <Progress value={score} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysis.keywordMatch}%</div>
                    <p className="text-sm text-gray-600">Keyword Match</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analysis.foundKeywords.length}</div>
                    <p className="text-sm text-gray-600">Keywords Found</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analysis.actionVerbs.length}</div>
                    <p className="text-sm text-gray-600">Action Verbs</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-6">
            {/* Found Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Found Keywords ({analysis.foundKeywords.length})
                </CardTitle>
                <CardDescription>
                  Keywords from your resume that match the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.foundKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Missing Keywords ({analysis.missingKeywords.length})
                </CardTitle>
                <CardDescription>
                  Important keywords from the job description not found in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-red-100 text-red-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* High-Conversion Keywords */}
            {analysis.highConversionKeywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    High-Conversion Keywords ({analysis.highConversionKeywords.length})
                  </CardTitle>
                  <CardDescription>
                    Industry-specific keywords that improve conversion rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.highConversionKeywords.map((keyword, index) => (
                      <Badge key={index} className="bg-yellow-100 text-yellow-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            {/* Optimization Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Optimization Suggestions
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations to improve your ATS score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.optimizationSuggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getImpactColor(suggestion.impact)}>
                          {suggestion.impact} impact
                        </Badge>
                        <Badge variant="outline">{suggestion.type}</Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">{suggestion.suggested}</p>
                      <p className="text-xs text-gray-600">{suggestion.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  General Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matching Tab */}
          {matchResult && (
            <TabsContent value="matching" className="space-y-6">
              {/* Overall Match Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Resume-Job Match Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(matchResult.overallMatch)}`}>
                      {matchResult.overallMatch}%
                    </div>
                    <Progress value={matchResult.overallMatch} className="mt-4" />
                    <p className="text-sm text-gray-600 mt-2">
                      Overall compatibility with the job requirements
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Match Scores */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Match Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>ATS Compatibility</span>
                        <span className={`font-medium ${getScoreColor(matchResult.atsCompatibility)}`}>
                          {matchResult.atsCompatibility}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Skills Match</span>
                        <span className={`font-medium ${getScoreColor(matchResult.skillMatch)}`}>
                          {matchResult.skillMatch}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience Match</span>
                        <span className={`font-medium ${getScoreColor(matchResult.experienceMatch)}`}>
                          {matchResult.experienceMatch}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Education Match</span>
                        <span className={`font-medium ${getScoreColor(matchResult.educationMatch)}`}>
                          {matchResult.educationMatch}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Keyword Density</span>
                        <span className={`font-medium ${getScoreColor(matchResult.detailedAnalysis.keywordDensity)}`}>
                          {matchResult.detailedAnalysis.keywordDensity}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Readability Score</span>
                        <span className={`font-medium ${getScoreColor(matchResult.detailedAnalysis.readabilityScore)}`}>
                          {matchResult.detailedAnalysis.readabilityScore}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Structure Score</span>
                        <span className={`font-medium ${getScoreColor(matchResult.detailedAnalysis.structureScore)}`}>
                          {matchResult.detailedAnalysis.structureScore}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience Alignment</span>
                        <span className="text-sm font-medium">
                          {matchResult.detailedAnalysis.experienceAlignment}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}
