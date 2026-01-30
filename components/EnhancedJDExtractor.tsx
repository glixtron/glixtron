'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Upload, 
  Link, 
  Search,
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Globe,
  FileCode,
  Zap,
  TrendingUp,
  Target,
  Brain,
  BarChart3,
  Clock,
  DollarSign,
  Users,
  MapPin
} from 'lucide-react'

interface JDExtractionResult {
  success: boolean
  content: string
  title?: string
  company?: string
  location?: string
  metadata?: {
    extractedAt: string
    source: string
    wordCount: number
    readingTime: number
  }
  analysis?: {
    keywords: any
    summary: string
    requirements: string[]
    skills: string[]
    experience: string
    estimatedSalary: string
    difficulty: string
    recommendations: string[]
  }
  error?: string
}

export default function EnhancedJDExtractor() {
  const [activeTab, setActiveTab] = useState('url')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JDExtractionResult | null>(null)
  const [url, setUrl] = useState('')
  const [htmlFile, setHtmlFile] = useState<File | null>(null)
  const [jobText, setJobText] = useState('')

  const handleUrlExtraction = async () => {
    if (!url.trim()) {
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('action', 'extract-url')
      formData.append('url', url)

      const response = await fetch('/api/jd-extractor-enhanced', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('URL extraction failed:', error)
      setResult({
        success: false,
        content: '',
        error: 'Failed to extract job description from URL'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleHtmlUpload = async () => {
    if (!htmlFile) {
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('action', 'extract-html')
      formData.append('htmlFile', htmlFile)

      const response = await fetch('/api/jd-extractor-enhanced', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('HTML upload failed:', error)
      setResult({
        success: false,
        content: '',
        error: 'Failed to extract job description from HTML file'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTextAnalysis = async () => {
    if (!jobText.trim()) {
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('action', 'analyze-text')
      formData.append('jobText', jobText)

      const response = await fetch('/api/jd-extractor-enhanced', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Text analysis failed:', error)
      setResult({
        success: false,
        content: '',
        error: 'Failed to analyze job description text'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.includes('html') && !file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
        alert('Please upload an HTML file (.html or .htm)')
        return
      }
      setHtmlFile(file)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Enhanced Job Description Extractor</h1>
        <p className="text-gray-600">Extract and analyze job descriptions from URLs, HTML files, or text</p>
      </div>

      {/* Extraction Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Choose Extraction Method
          </CardTitle>
          <CardDescription>
            Select how you want to extract the job description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                HTML File
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Posting URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  placeholder="https://example.com/job-posting"
                />
              </div>
              <Button 
                onClick={handleUrlExtraction} 
                disabled={loading || !url.trim()}
                className="w-full"
              >
                {loading ? 'Extracting...' : 'Extract from URL'}
              </Button>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload HTML File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload an HTML file containing the job description
                  </p>
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileChange}
                    className="hidden"
                    id="html-file-input"
                  />
                  <label 
                    htmlFor="html-file-input"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                  >
                    Choose HTML File
                  </label>
                  {htmlFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {htmlFile.name}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                onClick={handleHtmlUpload} 
                disabled={loading || !htmlFile}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Extract from HTML File'}
              </Button>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Description Text</label>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  rows={8}
                  placeholder="Paste the job description text here..."
                />
              </div>
              <Button 
                onClick={handleTextAnalysis} 
                disabled={loading || !jobText.trim()}
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              Extraction Results
            </CardTitle>
            <CardDescription>
              {result.success ? 'Job description extracted and analyzed successfully' : 'Extraction failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {result.title && (
                      <div>
                        <span className="font-medium">Job Title:</span> {result.title}
                      </div>
                    )}
                    {result.company && (
                      <div>
                        <span className="font-medium">Company:</span> {result.company}
                      </div>
                    )}
                    {result.location && (
                      <div>
                        <span className="font-medium">Location:</span> {result.location}
                      </div>
                    )}
                    {result.metadata && (
                      <div>
                        <span className="font-medium">Source:</span> {result.metadata.source}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Job Description</h3>
                    <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{result.content}</pre>
                    </div>
                  </div>

                  {result.metadata && (
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{result.metadata.wordCount} words</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{result.metadata.readingTime} min read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Extracted {new Date(result.metadata.extractedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  {result.analysis && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Summary</h3>
                          <p className="text-sm text-gray-600">{result.analysis.summary}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Difficulty</h3>
                          <Badge className={getDifficultyColor(result.analysis.difficulty)}>
                            {result.analysis.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Experience Required</h3>
                          <p className="text-sm">{result.analysis.experience}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Estimated Salary</h3>
                          <p className="text-sm">{result.analysis.estimatedSalary}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Recommendations</h3>
                        <ul className="space-y-1">
                          {result.analysis.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="requirements" className="space-y-4">
                  {result.analysis && (
                    <div>
                      <h3 className="font-semibold mb-2">Job Requirements</h3>
                      <div className="space-y-2">
                        {result.analysis.requirements.map((req: string, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm">{req}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  {result.analysis && (
                    <div>
                      <h3 className="font-semibold mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {result.error || 'Failed to extract job description. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
