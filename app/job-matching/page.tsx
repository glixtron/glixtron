'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Building, Clock, ExternalLink } from 'lucide-react'

interface JobMatch {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  experience: string
  description: string
  requirements: string[]
  matchScore: number
  postedDate: string
  applicationLink?: string
}

export default function JobMatchingPage() {
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({
    type: '',
    experience: '',
    location: ''
  })
  const searchParams = useSearchParams()

  useEffect(() => {
    // Parse URL parameters
    const skills = searchParams.get('skills')?.split(',') || []
    const experience = searchParams.get('experience') || ''
    const preferred = searchParams.get('preferred') || ''
    
    // Load job matches
    loadJobMatches(skills, experience, preferred)
  }, [searchParams])

  const loadJobMatches = async (skills: string[], experience: string, preferred: string) => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock job data based on skills
      const mockJobs: JobMatch[] = [
        {
          id: '1',
          title: 'Senior Full Stack Developer',
          company: 'TechCorp Solutions',
          location: 'San Francisco, CA (Remote)',
          salary: '$120,000 - $180,000',
          type: 'Full-time',
          experience: 'Senior',
          description: 'We are looking for an experienced Full Stack Developer to join our growing team and help build innovative solutions.',
          requirements: ['React', 'Node.js', 'TypeScript', 'MongoDB', '5+ years experience'],
          matchScore: 92,
          postedDate: '2 days ago',
          applicationLink: 'https://example.com/apply/1'
        },
        {
          id: '2',
          title: 'Frontend Developer',
          company: 'Digital Innovations',
          location: 'New York, NY (Hybrid)',
          salary: '$90,000 - $130,000',
          type: 'Full-time',
          experience: 'Mid-level',
          description: 'Join our frontend team to create amazing user experiences with modern web technologies.',
          requirements: ['React', 'TypeScript', 'CSS', '3+ years experience'],
          matchScore: 85,
          postedDate: '1 week ago',
          applicationLink: 'https://example.com/apply/2'
        },
        {
          id: '3',
          title: 'Full Stack Engineer',
          company: 'StartupHub',
          location: 'Austin, TX (Remote)',
          salary: '$100,000 - $150,000',
          type: 'Full-time',
          experience: 'Mid-level',
          description: 'Fast-growing startup looking for talented engineers to help build our platform.',
          requirements: ['JavaScript', 'React', 'Node.js', 'AWS', '3+ years experience'],
          matchScore: 78,
          postedDate: '3 days ago',
          applicationLink: 'https://example.com/apply/3'
        },
        {
          id: '4',
          title: 'React Developer',
          company: 'WebCraft Agency',
          location: 'Seattle, WA (Remote)',
          salary: '$85,000 - $120,000',
          type: 'Contract',
          experience: 'Mid-level',
          description: 'Creative agency seeking React developer for client projects.',
          requirements: ['React', 'JavaScript', 'CSS', '2+ years experience'],
          matchScore: 75,
          postedDate: '5 days ago'
        },
        {
          id: '5',
          title: 'Junior Developer',
          company: 'Learning Tech',
          location: 'Boston, MA (On-site)',
          salary: '$65,000 - $85,000',
          type: 'Full-time',
          experience: 'Entry-level',
          description: 'Great opportunity for junior developers to grow and learn.',
          requirements: ['JavaScript', 'React basics', 'Computer Science degree', 'Internship experience'],
          matchScore: 68,
          postedDate: '1 week ago'
        }
      ]
      
      // Filter jobs based on preferences
      let filteredJobs = mockJobs
      if (preferred === 'remote') {
        filteredJobs = filteredJobs.filter(job => 
          job.location.includes('Remote') || job.location.includes('Hybrid')
        )
      }
      
      setJobs(filteredJobs)
    } catch (error) {
      console.error('Failed to load job matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleApply = (job: JobMatch) => {
    if (job.applicationLink) {
      window.open(job.applicationLink, '_blank')
    } else {
      // Show application modal or redirect
      alert('Application process would be initiated here')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Matching</h1>
        <p className="text-gray-600">Find jobs that match your skills and preferences</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedFilters.type}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-time</option>
        </select>
        
        <select
          value={selectedFilters.experience}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, experience: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Levels</option>
          <option value="Entry-level">Entry-level</option>
          <option value="Mid-level">Mid-level</option>
          <option value="Senior">Senior</option>
        </select>
        
        <select
          value={selectedFilters.location}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">Found {jobs.length} matching jobs</p>
      </div>

      {/* Job listings */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-sm text-gray-500">{job.postedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}% Match
                    </div>
                  </div>
                  <Button onClick={() => handleApply(job)} className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{job.description}</p>
              <div>
                <h4 className="font-medium mb-2">Requirements:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters or skills.</p>
        </div>
      )}
    </div>
  )
}
