import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Extend timeout for Vercel Hobby tier (max 60 seconds)
export const maxDuration = 60

interface CareerRequest {
  userAim: string
  resumeText?: string
  currentProfile?: {
    education?: string
    skills?: string[]
    experience?: string
    interests?: string[]
  }
}

interface CareerResponse {
  success: boolean
  roadmap?: {
    shortTerm: Array<{
      title: string
      duration: string
      objectives: string[]
      skills: string[]
      resources: Array<{
        type: string
        title: string
        provider: string
        difficulty: string
        estimatedTime: string
      }>
      deliverables: string[]
    }>
    midTerm: Array<{
      title: string
      duration: string
      objectives: string[]
      skills: string[]
      resources: Array<{
        type: string
        title: string
        provider: string
        difficulty: string
        estimatedTime: string
      }>
      deliverables: string[]
    }>
    longTerm: Array<{
      title: string
      duration: string
      objectives: string[]
      skills: string[]
      resources: Array<{
        type: string
        title: string
        provider: string
        difficulty: string
        estimatedTime: string
      }>
      deliverables: string[]
    }>
    timeline: string
    milestones: Array<{
      title: string
      targetDate: string
      description: string
      skillsRequired: string[]
    }>
  }
  recommendations?: Array<{
    jobTitle: string
    field: string
    matchScore: number
    description: string
    salaryRange: string
    growthPotential: string
    requiredSkills: string[]
    educationPath: string[]
    companies: string[]
    marketDemand: 'high' | 'medium' | 'low'
  }>
  skillGap?: {
    currentSkills: string[]
    requiredSkills: string[]
    missingSkills: string[]
    improvementPlan: Array<{
      skill: string
      currentLevel: number
      targetLevel: number
      resources: Array<{
        type: string
        title: string
        provider: string
        difficulty: string
        estimatedTime: string
      }>
      estimatedTime: string
    }>
    timeline: string
  }
  nextSteps?: Array<{
    action: string
    priority: 'High' | 'Medium' | 'Low'
    timeline: string
    impact: string
  }>
  roadmapUpdate?: {
    milestone: string
    targetDate: string
    priority: 'High' | 'Medium' | 'Low'
  }
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const body: CareerRequest = await request.json()
    const { userAim, resumeText, currentProfile } = body

    // Validate required parameters
    if (!userAim || typeof userAim !== 'string' || userAim.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User aim is required and must be a non-empty string'
      }, { status: 400 })
    }

    // Initialize Gemini AI
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'AI service not configured'
      }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Detect if user wants Molecular Biology career
    const isMolecularBiology = userAim.toLowerCase().includes('molecular biology') || 
                                  userAim.toLowerCase().includes('scientist') ||
                                  userAim.toLowerCase().includes('biology') ||
                                  userAim.toLowerCase().includes('biotechnology') ||
                                  userAim.toLowerCase().includes('genetics') ||
                                  userAim.toLowerCase().includes('research')

    // Build universal system prompt
    const systemPrompt = `
You are an Expert Career Architect with deep knowledge across ALL professional fields including:
- Science & Research (Molecular Biology, Chemistry, Physics, Biology, Biotechnology)
- Technology & Engineering (Software Development, AI/ML, Data Science, Cybersecurity)
- Business & Finance (Management, Marketing, Sales, Investment Banking, Consulting)
- Healthcare & Medicine (Nursing, Medical Research, Pharmacy, Healthcare Administration)
- Creative Arts & Design (Graphic Design, UX/UI, Writing, Music, Film Production)
- Education & Academia (Teaching, Research, Academic Administration)
- Legal & Compliance (Law, Patent Law, Regulatory Affairs)
- Trades & Skilled Labor (Construction, Manufacturing, Automotive, HVAC)
- Government & Public Service (Policy, Administration, Public Relations)

UNIVERSAL CAREER GUIDANCE METHODOLOGY:
1. FIELD DETECTION: Automatically identify the user's target field from their aim
2. GAP ANALYSIS: Analyze the gap between current background and target role
3. MARKET READINESS: Calculate a score (0-100) based on industry standards
4. PERSONALIZED ROADMAP: Generate field-specific milestones and action items
5. INDUSTRY INSIGHTS: Provide current market trends and salary expectations

SCORING ALGORITHM:
- Technical Skills Match: 40% (field-specific competencies)
- Experience Alignment: 25% (relevant background experience)
- Education Requirements: 20% (required degrees/certifications)
- Market Demand: 15% (current job market conditions)

${isMolecularBiology ? `
SPECIALIZED MOLECULAR BIOLOGY EXPERTISE:
You are Dr. Sarah Chen, PhD, a distinguished Molecular Biology Scientist with 15+ years of experience in:
- Academic research in molecular genetics and cellular biology
- Biotechnology industry leadership roles at leading pharmaceutical companies
- Academic advising for PhD programs and postdoctoral fellowships
- Career development for research scientists

MOLECULAR BIOLOGY FOCUS:
- Molecular Biology Research Techniques (PCR, CRISPR, Gene Cloning, Protein Engineering)
- Biotechnology Industry Trends and Career Paths
- Academic vs Industry Career Decision Making
- Grant Writing and Research Funding
- Laboratory Management and Team Leadership
- High demand for CRISPR and gene editing expertise
- Increasing focus on personalized medicine and genomics
- Strong job market in pharmaceutical R&D
- Growing opportunities in synthetic biology
- Competitive academic positions but expanding industry roles
` : ''}

USER INPUT ANALYSIS:
USER AIM: ${userAim}
USER BACKGROUND: ${currentProfile ? JSON.stringify(currentProfile, null, 2) : 'Not provided'}
RESUME TEXT: ${resumeText ? resumeText.substring(0, 2000) + '...' : 'Not provided'}

UNIVERSAL TASK: 
1. Analyze the gap between their background and their aim
2. Calculate Market Readiness score (0-100) using the scoring algorithm
3. Generate 3 immediate actionable steps
4. Create a comprehensive career roadmap with short-term, mid-term, and long-term phases
5. Identify skill gaps and provide improvement plans
6. Recommend specific job opportunities and companies
7. Output a mandatory JSON block for the roadmap widget:
   ROADMAP_UPDATE: {"milestone": "Next Logic Step", "targetDate": "2-3 Months", "priority": "High"}

FIELD-SPECIFIC GUIDELINES:
${isMolecularBiology ? `
- Focus on laboratory techniques and research methodologies
- Emphasize academic vs industry career paths
- Include specific biotechnology companies and research institutions
- Address regulatory compliance and safety protocols
- Provide realistic timelines for PhD and postdoc paths
` : `
- Focus on field-specific technical skills and industry knowledge
- Emphasize practical experience and portfolio development
- Include relevant companies and organizations
- Address industry standards and best practices
- Provide realistic timelines for career progression
`}

Please provide a comprehensive career guidance response in JSON format with the following structure:
{
  "success": true,
  "marketReadiness": {
    "score": 78,
    "factors": {
      "technicalSkills": 85,
      "experienceAlignment": 70,
      "educationRequirements": 80,
      "marketDemand": 75
    },
    "assessment": "Strong foundation with room for growth in practical experience"
  },
  "roadmap": {
    "shortTerm": [
      {
        "title": "Phase 1: Foundation Building",
        "duration": "6-12 months",
        "objectives": ["Objective 1", "Objective 2"],
        "skills": ["Skill 1", "Skill 2"],
        "resources": [
          {
            "type": "course",
            "title": "Course Title",
            "provider": "Provider Name",
            "difficulty": "intermediate",
            "estimatedTime": "3 months"
          }
        ],
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      }
    ],
    "timeline": "3-4 years",
    "milestones": [
      {
        "title": "Complete Professional Certification",
        "targetDate": "2026",
        "description": "Complete your professional development",
        "skillsRequired": ["Technical Skills", "Soft Skills", "Industry Knowledge"]
      }
    ]
  },
  "recommendations": [
    {
      "jobTitle": "Professional Role",
      "field": "Industry Field",
      "matchScore": 92,
      "description": "Perfect match for your background and career goals",
      "salaryRange": "$85,000 - $150,000",
      "growthPotential": "High",
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
      "educationPath": ["Degree", "Certification", "Experience"],
      "companies": ["Company 1", "Company 2", "Company 3"],
      "marketDemand": "high"
    }
  ],
  "skillGap": {
    "currentSkills": ["Skill 1", "Skill 2"],
    "requiredSkills": ["Skill 3", "Skill 4"],
    "missingSkills": ["Skill 5", "Skill 6"],
    "improvementPlan": [
      {
        "skill": "Critical Skill",
        "currentLevel": 60,
        "targetLevel": 85,
        "resources": [
          {
            "type": "course",
            "title": "Skill Development Course",
            "provider": "Online Platform",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks"
          }
        ],
        "estimatedTime": "3-4 months"
      }
    ],
    "timeline": "6-12 months"
  },
  "nextSteps": [
    {
      "action": "Enroll in Advanced Training",
      "priority": "High",
      "timeline": "2-3 months",
      "impact": "Improve opportunities by 40%"
    },
    {
      "action": "Join Professional Organizations",
      "priority": "Medium",
      "timeline": "1-2 months",
      "impact": "Expand professional network"
    }
  ],
  "roadmapUpdate": {
    "milestone": "Complete Advanced Training",
    "targetDate": "3 Months",
    "priority": "High"
  }
}

Focus on providing specific, actionable advice tailored to the user's aim and current background.
Ensure the Market Readiness score accurately reflects their preparation level for the target field.
`

    try {
      const result = await model.generateContent(systemPrompt)
      const response = await result.response.text()
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const careerData = JSON.parse(jsonMatch[0])
        
        // Validate and sanitize the response
        const sanitizedResponse: CareerResponse = {
          success: true,
          roadmap: careerData.roadmap || {
            shortTerm: [],
            midTerm: [],
            longTerm: [],
            timeline: "3-4 years",
            milestones: []
          },
          recommendations: careerData.recommendations || [],
          skillGap: careerData.skillGap || {
            currentSkills: [],
            requiredSkills: [],
            missingSkills: [],
            improvementPlan: [],
            timeline: "6-12 months"
          },
          nextSteps: careerData.nextSteps || [],
          roadmapUpdate: careerData.roadmapUpdate || {
            milestone: "Start Career Development",
            targetDate: "3 Months",
            priority: "High"
          }
        }

        return NextResponse.json({
          success: true,
          data: sanitizedResponse
        })
      }
    } catch (error) {
      console.error('AI generation error:', error)
      
      // Return fallback response
      const fallbackResponse: CareerResponse = {
        success: true,
        roadmap: {
          shortTerm: [
            {
              title: "Foundation Building",
              duration: "6-12 months",
              objectives: ["Assess current skills", "Identify learning gaps"],
              skills: ["Core competencies"],
              resources: [
                {
                  type: "course",
                  title: "Foundation Course",
                  provider: "Online Platform",
                  difficulty: "beginner",
                  estimatedTime: "3 months"
                }
              ],
              deliverables: ["Skill assessment", "Learning plan"]
            }
          ],
          midTerm: [],
          longTerm: [],
          timeline: "2-3 years",
          milestones: []
        },
        recommendations: [],
        skillGap: {
          currentSkills: [],
          requiredSkills: [],
          missingSkills: [],
          improvementPlan: [],
          timeline: "6-12 months"
        },
        nextSteps: [
          {
            action: "Start skill assessment",
            priority: "High",
            timeline: "1 month",
            impact: "Identify development areas"
          }
        ],
        roadmapUpdate: {
          milestone: "Complete Skill Assessment",
          targetDate: "1 Month",
          priority: "High"
        }
      }

      return NextResponse.json({
        success: true,
        data: fallbackResponse
      })
    }

  } catch (error) {
    console.error('Career guidance error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate career guidance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
