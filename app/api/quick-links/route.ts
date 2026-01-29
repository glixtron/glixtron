/**
 * Quick Links API for Dashboard
 * Provides fast access to common dashboard actions and resources
 */

import { NextRequest, NextResponse } from 'next/server'
import { secureApiRoute } from '@/lib/security/middleware'

const quickLinks = [
  {
    id: 'resume-scanner',
    title: 'Resume Scanner',
    description: 'Analyze and optimize your resume with AI',
    icon: '📄',
    url: '/resume-scanner',
    category: 'career-tools',
    priority: 1,
    featured: true
  },
  {
    id: 'job-search',
    title: 'Job Search',
    description: 'Find and analyze job opportunities',
    icon: '💼',
    url: '/job-search',
    category: 'career-tools',
    priority: 2,
    featured: true
  },
  {
    id: 'assessment',
    title: 'Career Assessment',
    description: 'Discover your career DNA and potential',
    icon: '🎯',
    url: '/assessment',
    category: 'career-tools',
    priority: 3,
    featured: true
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Practice and prepare for interviews',
    icon: '🎤',
    url: '/interview-prep',
    category: 'career-tools',
    priority: 4,
    featured: false
  },
  {
    id: 'skill-builder',
    title: 'Skill Builder',
    description: 'Develop new skills and track progress',
    icon: '📚',
    url: '/skill-builder',
    category: 'learning',
    priority: 5,
    featured: false
  },
  {
    id: 'networking',
    title: 'Professional Network',
    description: 'Connect with industry professionals',
    icon: '🤝',
    url: '/networking',
    category: 'networking',
    priority: 6,
    featured: false
  },
  {
    id: 'salary-calculator',
    title: 'Salary Calculator',
    description: 'Estimate your earning potential',
    icon: '💰',
    url: '/salary-calculator',
    category: 'tools',
    priority: 7,
    featured: false
  },
  {
    id: 'career-paths',
    title: 'Career Paths',
    description: 'Explore different career trajectories',
    icon: '🛤️',
    url: '/career-paths',
    category: 'exploration',
    priority: 8,
    featured: false
  }
]

const categories = [
  {
    id: 'career-tools',
    name: 'Career Tools',
    description: 'Essential tools for career development',
    icon: '🛠️',
    color: 'blue'
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Enhance your skills and knowledge',
    icon: '📖',
    color: 'green'
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Build professional connections',
    icon: '🌐',
    color: 'purple'
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Helpful utilities and calculators',
    icon: '🔧',
    color: 'orange'
  },
  {
    id: 'exploration',
    name: 'Exploration',
    description: 'Discover new opportunities',
    icon: '🔍',
    color: 'teal'
  }
]

const secureHandler = secureApiRoute(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'all'
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    try {
      switch (action) {
        case 'all':
          let filteredLinks = quickLinks

          // Filter by category if specified
          if (category) {
            filteredLinks = filteredLinks.filter(link => link.category === category)
          }

          // Filter by featured if specified
          if (featured === 'true') {
            filteredLinks = filteredLinks.filter(link => link.featured)
          }

          return NextResponse.json({
            success: true,
            data: {
              links: filteredLinks,
              categories,
              total: filteredLinks.length
            }
          })

        case 'featured':
          const featuredLinks = quickLinks.filter(link => link.featured)
          return NextResponse.json({
            success: true,
            data: {
              links: featuredLinks,
              total: featuredLinks.length
            }
          })

        case 'categories':
          return NextResponse.json({
            success: true,
            data: categories
          })

        case 'search':
          const query = searchParams.get('q')?.toLowerCase()
          if (!query) {
            return NextResponse.json({
              success: false,
              error: 'Search query is required'
            }, { status: 400 })
          }

          const searchResults = quickLinks.filter(link =>
            link.title.toLowerCase().includes(query) ||
            link.description.toLowerCase().includes(query) ||
            link.category.toLowerCase().includes(query)
          )

          return NextResponse.json({
            success: true,
            data: {
              links: searchResults,
              query,
              total: searchResults.length
            }
          })

        case 'click':
          const linkId = searchParams.get('id')
          if (!linkId) {
            return NextResponse.json({
              success: false,
              error: 'Link ID is required'
            }, { status: 400 })
          }

          const link = quickLinks.find(l => l.id === linkId)
          if (!link) {
            return NextResponse.json({
              success: false,
              error: 'Link not found'
            }, { status: 404 })
          }

          // Log the click (you could store this in analytics)
          console.log(`🔗 Quick link clicked: ${link.title} (${link.id})`)

          return NextResponse.json({
            success: true,
            data: {
              link,
              redirectUrl: link.url
            }
          })

        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid action',
            availableActions: ['all', 'featured', 'categories', 'search', 'click']
          }, { status: 400 })
      }

    } catch (error: any) {
      console.error('Quick links API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to process request',
        message: error.message
      }, { status: 500 })
    }
  },
  {
    rateLimit: { maxRequests: 100, windowMs: 15 * 60 * 1000 },
    logOperations: true
  }
)

export const GET = secureHandler

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'track-click':
        const { linkId, userId } = data
        if (!linkId) {
          return NextResponse.json({
            success: false,
            error: 'Link ID is required'
          }, { status: 400 })
        }

        // Track the click (you could store this in a database)
        console.log(`📊 Quick link click tracked: ${linkId} by user ${userId || 'anonymous'}`)

        return NextResponse.json({
          success: true,
          message: 'Click tracked successfully'
        })

      case 'feedback':
        const { linkId: feedbackLinkId, rating, comment } = data
        if (!feedbackLinkId || !rating) {
          return NextResponse.json({
            success: false,
            error: 'Link ID and rating are required'
          }, { status: 400 })
        }

        // Store feedback (you could store this in a database)
        console.log(`⭐ Feedback received: ${feedbackLinkId} - ${rating} stars - ${comment || 'no comment'}`)

        return NextResponse.json({
          success: true,
          message: 'Feedback submitted successfully'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['track-click', 'feedback']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Quick links POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}
