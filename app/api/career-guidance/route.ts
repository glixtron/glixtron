/**
 * Career Guidance API for Science Students
 * Real AI integration with Gemini, ChatGPT, and DeepSeek
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiCareerGuidance, CareerGuidanceRequest } from '@/lib/ai-career-guidance'
import { getServerSession } from 'next-auth'
import { brandConfig } from '@/config/brand'

// Extend timeout for Vercel Hobby tier (max 60 seconds)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'generate-guidance':
        return await handleGenerateGuidance(data)

      case 'get-science-streams':
        return await handleGetScienceStreams()

      case 'get-job-types':
        return await handleGetJobTypes(data.stream)

      case 'analyze-skills':
        return await handleAnalyzeSkills(data)

      case 'query':
        return await handleCareerQuery(data)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['generate-guidance', 'get-science-streams', 'get-job-types', 'analyze-skills', 'query']
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Career guidance API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'health':
        return NextResponse.json({
          success: true,
          message: 'Career Guidance API is running',
          features: [
            'Gemini AI integration',
            'ChatGPT integration',
            'DeepSeek AI integration',
            'Science streams support',
            'Career roadmap generation',
            'Skill gap analysis',
            'Job matching',
            'Personalized recommendations'
          ],
          aiProviders: {
            gemini: !!process.env.GEMINI_API_KEY,
            openai: !!process.env.OPENAI_API_KEY,
            deepseek: !!process.env.DEEPSEEK_API_KEY
          }
        })

      default:
        // Return basic career guidance for dashboard quick action
        return NextResponse.json({
          success: true,
          data: {
            recommendations: [
              {
                title: "Full Stack Developer",
                matchScore: 92,
                description: "Based on your skills in React, Node.js, and TypeScript",
                skills: ["React", "Node.js", "TypeScript", "MongoDB"],
                salaryRange: "$80,000 - $150,000",
                growthPotential: "High"
              },
              {
                title: "DevOps Engineer",
                matchScore: 78,
                description: "Leverage your system administration and cloud knowledge",
                skills: ["AWS", "Docker", "CI/CD", "Linux"],
                salaryRange: "$90,000 - $160,000",
                growthPotential: "Very High"
              }
            ],
            nextSteps: [
              {
                action: "Complete Advanced React Course",
                priority: "High",
                timeline: "2-3 months",
                impact: "Increase job opportunities by 40%"
              },
              {
                action: "Get AWS Certification",
                priority: "Medium",
                timeline: "3-6 months",
                impact: "Open doors to DevOps roles"
              }
            ]
          }
        })
    }

  } catch (error: any) {
    console.error('Career guidance GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle career guidance generation
 */
async function handleGenerateGuidance(data: any) {
  try {
    const guidanceRequest: CareerGuidanceRequest = {
      studentProfile: {
        name: data.name || 'Student',
        education: data.education || '',
        scienceStream: data.scienceStream || '',
        interests: data.interests || [],
        skills: data.skills || [],
        experience: data.experience || '',
        careerGoals: data.careerGoals || ''
      },
      assessmentResults: data.assessmentResults
    }

    const result = await aiCareerGuidance.generateCareerGuidance(guidanceRequest)
    
    return NextResponse.json({
      success: true,
      action: 'generate-guidance',
      data: result
    })

  } catch (error: any) {
    console.error('Guidance generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate career guidance',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle getting science streams
 */
async function handleGetScienceStreams() {
  const scienceStreams = [
    {
      id: 'physics',
      name: 'Physics',
      description: 'Study of matter, energy, and their interactions',
      careers: ['Research Scientist', 'Data Scientist', 'Physics Teacher', 'Engineer'],
      skills: ['Mathematics', 'Problem Solving', 'Analytical Thinking', 'Programming'],
      averageSalary: '$70,000 - $130,000'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      description: 'Study of matter, its properties, and reactions',
      careers: ['Analytical Chemist', 'Quality Control', 'Research Chemist', 'Pharmaceutical Scientist'],
      skills: ['Lab Techniques', 'Chemical Analysis', 'Safety Protocols', 'Research Methods'],
      averageSalary: '$60,000 - $110,000'
    },
    {
      id: 'biology',
      name: 'Biology',
      description: 'Study of living organisms and life processes',
      careers: ['Biomedical Researcher', 'Biotechnologist', 'Environmental Scientist', 'Medical Professional'],
      skills: ['Lab Techniques', 'Research Methods', 'Data Analysis', 'Field Work'],
      averageSalary: '$65,000 - $120,000'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      description: 'Study of numbers, quantities, and shapes',
      careers: ['Data Scientist', 'Actuary', 'Mathematician', 'Quantitative Analyst'],
      skills: ['Advanced Mathematics', 'Statistics', 'Problem Solving', 'Programming'],
      averageSalary: '$75,000 - $140,000'
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      description: 'Study of computation and information processing',
      careers: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Analyst'],
      skills: ['Programming', 'Algorithms', 'Data Structures', 'System Design'],
      averageSalary: '$80,000 - $150,000'
    },
    {
      id: 'environmental-science',
      name: 'Environmental Science',
      description: 'Study of the environment and environmental problems',
      careers: ['Environmental Scientist', 'Conservationist', 'Climate Analyst', 'Sustainability Consultant'],
      skills: ['Environmental Analysis', 'Data Collection', 'Research Methods', 'Policy Understanding'],
      averageSalary: '$55,000 - $100,000'
    }
  ]

  return NextResponse.json({
    success: true,
    action: 'get-science-streams',
    data: scienceStreams
  })
}

/**
 * Handle getting job types for a specific stream
 */
async function handleGetJobTypes(data: { stream: string }) {
  const { stream } = data

  const jobTypes: Record<string, any[]> = {
    'physics': [
      {
        title: 'Research Scientist',
        category: 'Academia/Research',
        description: 'Conduct research in physics and related fields',
        requiredEducation: 'PhD in Physics or related field',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$60,000 - $120,000',
        growthRate: '8%',
        demandLevel: 'Medium'
      },
      {
        title: 'Data Scientist',
        category: 'Technology',
        description: 'Apply physics and mathematical principles to data analysis',
        requiredEducation: 'BS/MS in Physics, Mathematics, or Computer Science',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$80,000 - $150,000',
        growthRate: '35%',
        demandLevel: 'High'
      },
      {
        title: 'Physics Teacher',
        category: 'Education',
        description: 'Teach physics at high school or college level',
        requiredEducation: 'BS in Physics + Teaching Certification',
        experienceLevel: 'Entry-level',
        salaryRange: '$40,000 - $70,000',
        growthRate: '5%',
        demandLevel: 'Medium'
      },
      {
        title: 'Optical Engineer',
        category: 'Engineering',
        description: 'Design and develop optical systems and devices',
        requiredEducation: 'BS/MS in Physics or Optical Engineering',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$70,000 - $130,000',
        growthRate: '10%',
        demandLevel: 'Medium'
      },
      {
        title: 'Quantum Computing Researcher',
        category: 'Technology/Research',
        description: 'Research and develop quantum computing systems',
        requiredEducation: 'PhD in Physics, Computer Science, or related field',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$100,000 - $200,000',
        growthRate: '25%',
        demandLevel: 'High'
      }
    ],
    'chemistry': [
      {
        title: 'Analytical Chemist',
        category: 'Laboratory/Quality Control',
        description: 'Analyze chemical compounds and ensure quality control',
        requiredEducation: 'BS/MS in Chemistry',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$50,000 - $90,000',
        growthRate: '6%',
        demandLevel: 'Medium'
      },
      {
        title: 'Pharmaceutical Scientist',
        category: 'Pharmaceutical',
        description: 'Develop and test new drugs and medications',
        requiredEducation: 'PhD in Chemistry or related field',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$80,000 - $140,000',
        growthRate: '12%',
        demandLevel: 'High'
      },
      {
        title: 'Quality Control Chemist',
        category: 'Manufacturing',
        description: 'Ensure product quality through chemical testing',
        requiredEducation: 'BS in Chemistry',
        experienceLevel: 'Entry-level to Mid-level',
        salaryRange: '$45,000 - $80,000',
        growthRate: '5%',
        demandLevel: 'Medium'
      },
      {
        title: 'Materials Scientist',
        category: 'Research/Development',
        description: 'Research and develop new materials',
        requiredEducation: 'MS/PhD in Chemistry or Materials Science',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$70,000 - $130,000',
        growthRate: '8%',
        demandLevel: 'Medium'
      },
      {
        title: 'Forensic Chemist',
        category: 'Forensics/Law Enforcement',
        description: 'Analyze evidence for criminal investigations',
        requiredEducation: 'BS/MS in Chemistry',
        experienceLevel: 'Entry-level to Mid-level',
        salaryRange: '$55,000 - $95,000',
        growthRate: '14%',
        demandLevel: 'Medium'
      }
    ],
    'biology': [
      {
        title: 'Biomedical Researcher',
        category: 'Healthcare/Research',
        description: 'Conduct research in biomedical sciences',
        requiredEducation: 'PhD in Biology or related field',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$60,000 - $110,000',
        growthRate: '13%',
        demandLevel: 'High'
      },
      {
        title: 'Biotechnologist',
        category: 'Biotechnology',
        description: 'Develop biological products and processes',
        requiredEducation: 'BS/MS/PhD in Biology or Biotechnology',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$65,000 - $120,000',
        growthRate: '15%',
        demandLevel: 'High'
      },
      {
        title: 'Environmental Scientist',
        category: 'Environmental',
        description: 'Study environmental issues and develop solutions',
        requiredEducation: 'BS/MS in Biology or Environmental Science',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$55,000 - $100,000',
        growthRate: '11%',
        demandLevel: 'Medium'
      },
      {
        title: 'Medical Laboratory Scientist',
        category: 'Healthcare',
        description: 'Perform laboratory tests for medical diagnosis',
        requiredEducation: 'BS in Biology + Clinical Laboratory Certification',
        experienceLevel: 'Entry-level to Mid-level',
        salaryRange: '$50,000 - $85,000',
        growthRate: '7%',
        demandLevel: 'Medium'
      },
      {
        title: 'Genetic Counselor',
        category: 'Healthcare/Genetics',
        description: 'Provide guidance on genetic conditions and testing',
        requiredEducation: 'MS in Genetic Counseling',
        experienceLevel: 'Entry-level to Mid-level',
        salaryRange: '$70,000 - $95,000',
        growthRate: '21%',
        demandLevel: 'High'
      }
    ],
    'mathematics': [
      {
        title: 'Data Scientist',
        category: 'Technology',
        description: 'Apply mathematical principles to data analysis',
        requiredEducation: 'BS/MS in Mathematics, Statistics, or Computer Science',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$80,000 - $150,000',
        growthRate: '35%',
        demandLevel: 'High'
      },
      {
        title: 'Actuary',
        category: 'Insurance/Finance',
        description: 'Assess financial risks using mathematical methods',
        requiredEducation: 'BS in Mathematics + Actuarial Exams',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$70,000 - $130,000',
        growthRate: '18%',
        demandLevel: 'High'
      },
      {
        title: 'Mathematician',
        category: 'Research/Academia',
        description: 'Conduct research in mathematical theory and applications',
        requiredEducation: 'PhD in Mathematics',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$60,000 - $120,000',
        growthRate: '6%',
        demandLevel: 'Low'
      },
      {
        title: 'Quantitative Analyst',
        category: 'Finance',
        description: 'Develop mathematical models for financial analysis',
        requiredEducation: 'MS/PhD in Mathematics, Physics, or Finance',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$90,000 - $180,000',
        growthRate: '22%',
        demandLevel: 'High'
      },
      {
        title: 'Operations Research Analyst',
        category: 'Business/Consulting',
        description: 'Use mathematical methods to solve business problems',
        requiredEducation: 'BS/MS in Mathematics, Statistics, or Operations Research',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$65,000 - $115,000',
        growthRate: '23%',
        demandLevel: 'High'
      }
    ],
    'computer-science': [
      {
        title: 'Software Developer',
        category: 'Technology',
        description: 'Design and develop software applications',
        requiredEducation: 'BS in Computer Science or related field',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$70,000 - $140,000',
        growthRate: '22%',
        demandLevel: 'High'
      },
      {
        title: 'AI/Machine Learning Engineer',
        category: 'Technology',
        description: 'Develop artificial intelligence and machine learning systems',
        requiredEducation: 'BS/MS/PhD in Computer Science or related field',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$100,000 - $180,000',
        growthRate: '31%',
        demandLevel: 'High'
      },
      {
        title: 'Cybersecurity Analyst',
        category: 'Security',
        description: 'Protect computer systems and networks from threats',
        requiredEducation: 'BS in Computer Science or Cybersecurity',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$75,000 - $130,000',
        growthRate: '33%',
        demandLevel: 'High'
      },
      {
        title: 'Data Scientist',
        category: 'Technology',
        description: 'Analyze complex data to help organizations make decisions',
        requiredEducation: 'BS/MS/PhD in Computer Science, Statistics, or Mathematics',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$80,000 - $150,000',
        growthRate: '35%',
        demandLevel: 'High'
      },
      {
        title: 'Cloud Engineer',
        category: 'Technology',
        description: 'Design and manage cloud computing systems',
        requiredEducation: 'BS in Computer Science or Information Technology',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$85,000 - $145,000',
        growthRate: '27%',
        demandLevel: 'High'
      }
    ],
    'environmental-science': [
      {
        title: 'Environmental Scientist',
        category: 'Environmental',
        description: 'Study environmental issues and develop solutions',
        requiredEducation: 'BS/MS in Environmental Science or related field',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$55,000 - $100,000',
        growthRate: '11%',
        demandLevel: 'Medium'
      },
      {
        title: 'Climate Analyst',
        category: 'Environmental/Research',
        description: 'Analyze climate data and study climate change',
        requiredEducation: 'MS/PhD in Environmental Science, Climatology, or related field',
        experienceLevel: 'Mid-level to Senior',
        salaryRange: '$65,000 - $110,000',
        growthRate: '15%',
        demandLevel: 'High'
      },
      {
        title: 'Sustainability Consultant',
        category: 'Consulting',
        description: 'Advise organizations on sustainable practices',
        requiredEducation: 'BS/MS in Environmental Science or related field',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$60,000 - $105,000',
        growthRate: '18%',
        demandLevel: 'Medium'
      },
      {
        title: 'Conservation Scientist',
        category: 'Conservation',
        description: 'Manage and protect natural resources',
        requiredEducation: 'BS/MS in Environmental Science or Conservation',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$50,000 - $90,000',
        growthRate: '7%',
        demandLevel: 'Medium'
      },
      {
        title: 'Environmental Engineer',
        category: 'Engineering',
        description: 'Develop solutions to environmental problems',
        requiredEducation: 'BS/MS in Environmental Engineering',
        experienceLevel: 'Entry-level to Senior',
        salaryRange: '$65,000 - $115,000',
        growthRate: '12%',
        demandLevel: 'Medium'
      }
    ]
  }

  const jobs = jobTypes[stream] || jobTypes['physics']

  return NextResponse.json({
    success: true,
    action: 'get-job-types',
    data: jobs
  })
}

/**
 * Handle career query with personalized data from MongoDB
 */
async function handleCareerQuery(data: { query: string; userEmail?: string }) {
  try {
    const { query, userEmail } = data
    
    // Get user's personalized data from MongoDB
    let userContext = {
      marketReadiness: 65,
      skillGaps: [],
      careerProgress: 50,
      recentActivity: [] as any[]
    }
    
    if (userEmail) {
      try {
        // Fetch user's dashboard stats
        const dashboardResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': userEmail
          }
        })
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json()
          if (dashboardData.success) {
            userContext = {
              marketReadiness: parseInt(dashboardData.data.marketReadiness?.replace('%', '') || 65),
              skillGaps: dashboardData.data.skillGaps || [],
              careerProgress: parseInt(dashboardData.data.careerProgress?.replace('%', '') || 50),
              recentActivity: dashboardData.data.recentActivity || []
            }
          }
        }
        
        // Fetch user's saved resumes for additional context
        const resumeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/resume/saved`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': userEmail
          }
        })
        
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json()
          if (resumeData.success && resumeData.data.length > 0) {
            userContext.recentActivity.push({
              type: 'resume_analysis',
              count: resumeData.data.length,
              lastActivity: resumeData.data[0]?.uploadDate || new Date().toISOString()
            })
          }
        }
      } catch (fetchError) {
        console.warn('Failed to fetch user context, using defaults:', fetchError)
      }
    }
    
    // Create personalized prompt with user context
    const personalizedPrompt = `${brandConfig.ai.systemPrompt}

USER QUERY: ${query}

USER CONTEXT:
- Market Readiness Score: ${userContext.marketReadiness}%
- Career Progress: ${userContext.careerProgress}%
- Skill Gaps: ${userContext.skillGaps.length} identified gaps
- Recent Activity: ${userContext.recentActivity.length} recent actions

Provide a personalized response that:
1. References their current readiness level (${userContext.marketReadiness}%)
2. Addresses their specific skill gaps if any
3. Considers their career progress (${userContext.careerProgress}%)
4. Gives actionable next steps based on their context
5. Maintains the elite career coach persona - data-driven, blunt but supportive, ROI-focused

Format your response as JSON:
{
  "response": "Your personalized career advice here",
  "actionItems": ["specific action 1", "specific action 2", "specific action 3"],
  "timeline": "estimated timeline for results",
  "resources": [{"title": "resource name", "type": "course|project|article", "url": "link"}],
  "followUpQuestions": ["question 1", "question 2", "question 3"]
}`

    // Call AI service with personalized prompt
    let aiResponse
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const apiKey = process.env.GEMINI_API_KEY
      
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        
        const result = await model.generateContent(personalizedPrompt)
        aiResponse = await result.response.text()
      } else {
        throw new Error('Gemini API key not available')
      }
    } catch (aiError) {
      console.warn('AI service failed, using enhanced fallback:', aiError)
      
      // Enhanced fallback with user context
      const baseResponses = {
        default: `Based on your ${userContext.marketReadiness}% market readiness, focus on bridging your ${userContext.skillGaps.length} skill gaps. Your ${userContext.careerProgress}% career progress shows you're on the right track.`,
        skills: `With your current readiness level of ${userContext.marketReadiness}%, prioritize skills that will move you to the 80%+ range. Focus on your identified skill gaps first.`,
        jobs: `Your ${userContext.marketReadiness}% market readiness puts you in a good position. Target roles that match your ${userContext.careerProgress}% experience level.`,
        career: `Your career progress of ${userContext.careerProgress}% suggests you're ready for the next level. Consider roles that leverage your current skills while addressing your ${userContext.skillGaps.length} skill gaps.`
      }
      
      let response = baseResponses.default
      if (query.toLowerCase().includes('skill')) {
        response = baseResponses.skills
      } else if (query.toLowerCase().includes('job')) {
        response = baseResponses.jobs
      } else if (query.toLowerCase().includes('career')) {
        response = baseResponses.career
      }
      
      aiResponse = JSON.stringify({
        response,
        actionItems: [
          "Complete a skills assessment to identify specific gaps",
          "Update your resume with recent achievements",
          "Network with professionals in your target field"
        ],
        timeline: "2-3 months for noticeable improvement",
        resources: [
          { title: "Skills Assessment", type: "course", url: "/assessment" },
          { title: "Resume Scanner", type: "project", url: "/resume-scanner" }
        ],
        followUpQuestions: [
          "Which specific skill area would you like to focus on first?",
          "Are you looking to transition to a new role or advance in your current field?",
          "Would you like a personalized learning roadmap?"
        ]
      })
    }
    
    // Parse AI response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      parsedResponse = {
        response: aiResponse,
        actionItems: ["Review your career goals", "Update your skills", "Seek mentorship"],
        timeline: "3-6 months",
        resources: [],
        followUpQuestions: ["What specific area would you like to focus on?"]
      }
    }
    
    return NextResponse.json({
      success: true,
      action: 'query',
      data: {
        query,
        userContext,
        ...parsedResponse,
        timestamp: new Date().toISOString(),
        personalized: true
      }
    })
    
  } catch (error: any) {
    console.error('Career query error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process career query',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Handle skill analysis
 */
async function handleAnalyzeSkills(data: { skills: string[], stream: string }) {
  const { skills, stream } = data

  const streamRequirements: Record<string, string[]> = {
    'physics': ['Mathematics', 'Programming', 'Research Methods', 'Data Analysis', 'Problem Solving'],
    'chemistry': ['Lab Techniques', 'Safety Protocols', 'Quality Control', 'Research Methods', 'Chemical Analysis'],
    'biology': ['Lab Techniques', 'Research Methods', 'Statistics', 'Field Work', 'Data Analysis'],
    'mathematics': ['Advanced Mathematics', 'Statistics', 'Programming', 'Problem Solving', 'Analytical Thinking'],
    'computer-science': ['Programming', 'Algorithms', 'Data Structures', 'System Design', 'Problem Solving'],
    'environmental-science': ['Environmental Analysis', 'Data Collection', 'Research Methods', 'Policy Understanding', 'Field Work']
  }

  const required = streamRequirements[stream] || streamRequirements['physics']
  const current = skills.map(skill => skill.toLowerCase())
  const requiredLower = required.map(skill => skill.toLowerCase())

  const missing = required.filter((skill, index) => !current.includes(requiredLower[index]))
  const present = required.filter((skill, index) => current.includes(requiredLower[index]))

  const analysis = {
    currentSkills: skills,
    requiredSkills: required,
    presentSkills: present,
    missingSkills: missing,
    skillGapPercentage: Math.round((missing.length / required.length) * 100),
    recommendations: missing.map(skill => ({
      skill,
      priority: 'high' as const,
      resources: [
        `Online courses for ${skill}`,
        `Books on ${skill}`,
        `Workshops and seminars`
      ],
      estimatedTime: '3-6 months'
    })),
    overallScore: Math.round(((present.length) / required.length) * 100)
  }

  return NextResponse.json({
    success: true,
    action: 'analyze-skills',
    data: analysis
  })
}
