import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface JobCrackingRequest {
  resumeText: string
  targetRole?: string
  experienceLevel?: string
  industry?: string
  jobDescription?: string
}

interface JobCrackingSuggestions {
  resumeOptimization: {
    summaryImprovement: string[]
    skillsHighlight: string[]
    achievementsQuantification: string[]
    keywordsOptimization: string[]
    formattingTips: string[]
  }
  interviewPreparation: {
    technicalQuestions: Array<{
      question: string
      suggestedAnswer: string
      category: string
      difficulty: 'easy' | 'medium' | 'hard'
    }>
    behavioralQuestions: Array<{
      question: string
      suggestedAnswer: string
      starMethod: {
        situation: string
        task: string
        action: string
        result: string
      }
    }>
    systemDesignQuestions: Array<{
      question: string
      approach: string[]
      considerations: string[]
    }>
  }
  skillEnhancement: {
    criticalSkills: Array<{
      skill: string
      currentLevel: string
      targetLevel: string
      learningResources: Array<{
        type: 'course' | 'book' | 'project' | 'tutorial'
        title: string
        provider: string
        duration: string
        difficulty: string
        url: string
        priority: 'high' | 'medium' | 'low'
      }>
      practiceProjects: Array<{
        name: string
        description: string
        technologies: string[]
        complexity: string
        githubTemplate?: string
      }>
    }>
    softSkills: Array<{
      skill: string
      importance: string
      improvementTips: string[]
      realWorldExamples: string[]
    }>
  }
  jobSearchStrategy: {
    targetCompanies: Array<{
      name: string
      whyFit: string
      applicationTips: string
      referralOpportunities: string
    }>
    networkingStrategy: {
      platforms: string[]
      outreachTemplates: Array<{
        type: 'linkedin' | 'email' | 'twitter'
        template: string
        bestPractices: string[]
      }>
    }
    applicationOptimization: {
      resumeTailoring: string[]
      coverLetterTips: string[]
      followUpStrategy: string[]
    }
  }
  salaryNegotiation: {
    marketRates: {
      role: string
      experience: string
      location: string
      min: number
      max: number
      average: number
    }
    negotiationTactics: string[]
    benefitsNegotiation: string[]
    counterOfferHandling: string[]
  }
  careerGrowth: {
    shortTermGoals: string[]
    longTermGoals: string[]
    industryTrends: string[]
    certificationPaths: Array<{
      certification: string
      provider: string
      cost: string
      duration: string
      roi: string
      prerequisites: string[]
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: JobCrackingRequest = await request.json()
    const { resumeText, targetRole, experienceLevel, industry, jobDescription } = body

    if (!resumeText) {
      return NextResponse.json(
        { success: false, error: 'Resume text is required' },
        { status: 400 }
      )
    }

    // Initialize Gemini AI
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        data: generateFallbackSuggestions(resumeText, targetRole, experienceLevel, industry)
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
You are an expert career coach and former tech recruiter. Analyze this resume and provide comprehensive job-cracking suggestions:

RESUME:
${resumeText}

TARGET ROLE: ${targetRole || 'Not specified'}
EXPERIENCE LEVEL: ${experienceLevel || 'Not specified'}
INDUSTRY: ${industry || 'Not specified'}
JOB DESCRIPTION: ${jobDescription || 'Not provided'}

Provide detailed suggestions in this JSON format:
{
  "resumeOptimization": {
    "summaryImprovement": [
      "Replace generic summary with specific achievements",
      "Add quantifiable metrics for each accomplishment"
    ],
    "skillsHighlight": [
      "Move technical skills to the top",
      "Group skills by category and proficiency level"
    ],
    "achievementsQuantification": [
      "Converted 'improved performance' to 'improved performance by 40%'",
      "Added specific numbers to project descriptions"
    ],
    "keywordsOptimization": [
      "Add industry-specific keywords from job descriptions",
      "Include action verbs: Led, Developed, Implemented, Optimized"
    ],
    "formattingTips": [
      "Use bullet points for achievements",
      "Keep resume to 1-2 pages maximum",
      "Use consistent formatting and professional fonts"
    ]
  },
  "interviewPreparation": {
    "technicalQuestions": [
      {
        "question": "What's the most challenging technical problem you've solved?",
        "suggestedAnswer": "Describe a complex problem, your approach, and the measurable impact",
        "category": "Problem Solving",
        "difficulty": "medium"
      }
    ],
    "behavioralQuestions": [
      {
        "question": "Tell me about a time you failed",
        "suggestedAnswer": "Use STAR method to show learning and growth",
        "starMethod": {
          "situation": "Brief context",
          "task": "Your responsibility",
          "action": "What you did",
          "result": "Outcome and learning"
        }
      }
    ],
    "systemDesignQuestions": [
      {
        "question": "Design a URL shortener",
        "approach": ["Requirements", "API design", "Database schema", "Scaling considerations"],
        "considerations": ["Rate limiting", "Analytics", "Cache strategy"]
      }
    ]
  },
  "skillEnhancement": {
    "criticalSkills": [
      {
        "skill": "React/Next.js",
        "currentLevel": "Intermediate",
        "targetLevel": "Advanced",
        "learningResources": [
          {
            "type": "course",
            "title": "Advanced React Patterns",
            "provider": "Udemy",
            "duration": "20 hours",
            "difficulty": "intermediate",
            "url": "https://udemy.com/advanced-react",
            "priority": "high"
          }
        ],
        "practiceProjects": [
          {
            "name": "E-commerce Platform",
            "description": "Full-stack e-commerce with payment integration",
            "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
            "complexity": "intermediate",
            "githubTemplate": "https://github.com/ecommerce-template"
          }
        ]
      }
    ],
    "softSkills": [
      {
        "skill": "Communication",
        "importance": "Critical for team collaboration and client interactions",
        "improvementTips": [
          "Practice explaining technical concepts to non-technical people",
          "Join Toastmasters or public speaking groups"
        ],
        "realWorldExamples": [
          "Presented project progress to stakeholders",
          "Mentored junior developers"
        ]
      }
    ]
  },
  "jobSearchStrategy": {
    "targetCompanies": [
      {
        "name": "Google",
        "whyFit": "Strong in React and Node.js, matches their tech stack",
        "applicationTips": "Highlight scalability projects and system design experience",
        "referralOpportunities": "Connect with Google engineers on LinkedIn and GitHub"
      }
    ],
    "networkingStrategy": {
      "platforms": ["LinkedIn", "GitHub", "Twitter", "Tech meetups"],
      "outreachTemplates": [
        {
          "type": "linkedin",
          "template": "Hi [Name], I noticed you work at [Company] and I'm impressed by [specific achievement]. I'm currently [your background] and would love to learn more about your experience with [specific technology].",
          "bestPractices": ["Personalize each message", "Keep it concise", "Show genuine interest"]
        }
      ]
    },
    "applicationOptimization": {
      "resumeTailoring": [
        "Customize resume for each job application",
        "Mirror language from job description",
        "Highlight relevant experience for the specific role"
      ],
      "coverLetterTips": [
        "Address specific company needs",
        "Show your understanding of their products/challenges",
        "Include 2-3 relevant achievements"
      ],
      "followUpStrategy": [
        "Send follow-up email 1 week after application",
        "Connect with recruiter on LinkedIn",
        "Attend company events or webinars"
      ]
    }
  },
  "salaryNegotiation": {
    "marketRates": {
      "role": "Software Engineer",
      "experience": "3-5 years",
      "location": "San Francisco",
      "min": 120000,
      "max": 180000,
      "average": 150000
    },
    "negotiationTactics": [
      "Research market rates before negotiation",
      "Have multiple offers for leverage",
      "Focus on total compensation, not just base salary"
    ],
    "benefitsNegotiation": [
      "Negotiate signing bonus",
      "Request additional vacation days",
      "Ask for remote work flexibility"
    ],
    "counterOfferHandling": [
      "Get counter offer in writing",
      "Evaluate total compensation package",
      "Consider long-term career growth over short-term gains"
    ]
  },
  "careerGrowth": {
    "shortTermGoals": [
      "Master current tech stack",
      "Lead a small project team",
      "Contribute to open source"
    ],
    "longTermGoals": [
      "Move to senior/lead position",
      "Specialize in cloud architecture",
      "Consider management track"
    ],
    "industryTrends": [
      "AI/ML integration in web development",
      "Cloud-native applications",
      "Low-code/no-code platforms"
    ],
    "certificationPaths": [
      {
        "certification": "AWS Solutions Architect",
        "provider": "Amazon",
        "cost": "$150",
        "duration": "3 months",
        "roi": "15-20% salary increase",
        "prerequisites": ["1 year cloud experience", "Basic networking knowledge"]
      }
    ]
  }
}

Focus on:
1. Actionable, specific advice rather than generic suggestions
2. Real-world examples and templates
3. Current market trends and salary data
4. Practical interview preparation with sample answers
5. Specific learning resources with priorities
6. Networking strategies with outreach templates
7. Salary negotiation tactics based on current market
8. Career growth paths with certification recommendations

Be encouraging but realistic about the job market.
`

    const result = await model.generateContent(prompt)
    const response = await result.response.text()
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0])
        
        // Validate and sanitize the result
        const sanitizedSuggestions: JobCrackingSuggestions = {
          resumeOptimization: {
            summaryImprovement: Array.isArray(suggestions.resumeOptimization?.summaryImprovement) ? suggestions.resumeOptimization.summaryImprovement : [],
            skillsHighlight: Array.isArray(suggestions.resumeOptimization?.skillsHighlight) ? suggestions.resumeOptimization.skillsHighlight : [],
            achievementsQuantification: Array.isArray(suggestions.resumeOptimization?.achievementsQuantification) ? suggestions.resumeOptimization.achievementsQuantification : [],
            keywordsOptimization: Array.isArray(suggestions.resumeOptimization?.keywordsOptimization) ? suggestions.resumeOptimization.keywordsOptimization : [],
            formattingTips: Array.isArray(suggestions.resumeOptimization?.formattingTips) ? suggestions.resumeOptimization.formattingTips : []
          },
          interviewPreparation: {
            technicalQuestions: Array.isArray(suggestions.interviewPreparation?.technicalQuestions) ? suggestions.interviewPreparation.technicalQuestions : [],
            behavioralQuestions: Array.isArray(suggestions.interviewPreparation?.behavioralQuestions) ? suggestions.interviewPreparation.behavioralQuestions : [],
            systemDesignQuestions: Array.isArray(suggestions.interviewPreparation?.systemDesignQuestions) ? suggestions.interviewPreparation.systemDesignQuestions : []
          },
          skillEnhancement: {
            criticalSkills: Array.isArray(suggestions.skillEnhancement?.criticalSkills) ? suggestions.skillEnhancement.criticalSkills : [],
            softSkills: Array.isArray(suggestions.skillEnhancement?.softSkills) ? suggestions.skillEnhancement.softSkills : []
          },
          jobSearchStrategy: {
            targetCompanies: Array.isArray(suggestions.jobSearchStrategy?.targetCompanies) ? suggestions.jobSearchStrategy.targetCompanies : [],
            networkingStrategy: suggestions.jobSearchStrategy?.networkingStrategy || {
              platforms: [],
              outreachTemplates: []
            },
            applicationOptimization: suggestions.jobSearchStrategy?.applicationOptimization || {
              resumeTailoring: [],
              coverLetterTips: [],
              followUpStrategy: []
            }
          },
          salaryNegotiation: suggestions.salaryNegotiation || {
            marketRates: {
              role: "Software Engineer",
              experience: "3-5 years",
              location: "San Francisco",
              min: 120000,
              max: 180000,
              average: 150000
            },
            negotiationTactics: [],
            benefitsNegotiation: [],
            counterOfferHandling: []
          },
          careerGrowth: suggestions.careerGrowth || {
            shortTermGoals: [],
            longTermGoals: [],
            industryTrends: [],
            certificationPaths: []
          }
        }

        return NextResponse.json({
          success: true,
          data: sanitizedSuggestions
        })
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
    }

    // Fallback to rule-based suggestions
    return NextResponse.json({
      success: true,
      data: generateFallbackSuggestions(resumeText, targetRole, experienceLevel, industry)
    })

  } catch (error) {
    console.error('Job cracking suggestions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

function generateFallbackSuggestions(
  resumeText: string, 
  targetRole?: string, 
  experienceLevel?: string, 
  industry?: string
): JobCrackingSuggestions {
  return {
    resumeOptimization: {
      summaryImprovement: [
        "Add specific achievements with quantifiable metrics",
        "Include your most relevant experience at the top",
        "Keep summary to 2-3 sentences maximum"
      ],
      skillsHighlight: [
        "Group technical skills by category",
        "Include proficiency levels for each skill",
        "Add skills mentioned in job descriptions"
      ],
      achievementsQuantification: [
        "Add numbers to show impact (e.g., 'increased by 40%')",
        "Include project scope and team size",
        "Mention cost savings or revenue generation"
      ],
      keywordsOptimization: [
        "Use action verbs: Led, Developed, Implemented",
        "Include industry-specific terminology",
        "Match keywords from target job descriptions"
      ],
      formattingTips: [
        "Use bullet points for readability",
        "Keep resume to 1-2 pages",
        "Use consistent formatting throughout"
      ]
    },
    interviewPreparation: {
      technicalQuestions: [
        {
          question: "What's your greatest technical achievement?",
          suggestedAnswer: "Describe a complex project, your role, challenges, and measurable impact",
          category: "Achievements",
          difficulty: "medium"
        },
        {
          question: "How do you stay updated with technology?",
          suggestedAnswer: "Mention blogs, courses, conferences, and side projects",
          category: "Learning",
          difficulty: "easy"
        }
      ],
      behavioralQuestions: [
        {
          question: "Tell me about a time you handled a difficult team situation",
          suggestedAnswer: "Use STAR method to show conflict resolution and teamwork",
          starMethod: {
            situation: "Describe the context",
            task: "Your responsibility",
            action: "Steps you took",
            result: "Positive outcome"
          }
        }
      ],
      systemDesignQuestions: [
        {
          question: "Design a social media feed",
          approach: ["Requirements gathering", "API design", "Database schema", "Scaling"],
          considerations: ["Real-time updates", "Privacy", "Performance"]
        }
      ]
    },
    skillEnhancement: {
      criticalSkills: [
        {
          skill: "System Design",
          currentLevel: "Beginner",
          targetLevel: "Intermediate",
          learningResources: [
            {
              type: "course",
              title: "Grokking the System Design Interview",
              provider: "Educative",
              duration: "15 hours",
              difficulty: "intermediate",
              url: "https://educative.io/courses/grokking-the-system-design-interview",
              priority: "high"
            }
          ],
          practiceProjects: [
            {
              name: "URL Shortener Service",
              description: "Design and implement a scalable URL shortening service",
              technologies: ["Node.js", "Redis", "MongoDB"],
              complexity: "intermediate"
            }
          ]
        }
      ],
      softSkills: [
        {
          skill: "Communication",
          importance: "Essential for team collaboration and client interactions",
          improvementTips: [
            "Practice explaining technical concepts simply",
            "Join public speaking groups"
          ],
          realWorldExamples: [
            "Presented project updates to stakeholders",
            "Documented technical processes for team"
          ]
        }
      ]
    },
    jobSearchStrategy: {
      targetCompanies: [
        {
          name: "Tech Companies",
          whyFit: "Your skills match current market demands",
          applicationTips: "Tailor resume for each application",
          referralOpportunities: "Network with employees on LinkedIn"
        }
      ],
      networkingStrategy: {
        platforms: ["LinkedIn", "GitHub", "Tech meetups"],
        outreachTemplates: [
          {
            type: "linkedin",
            template: "Hi [Name], I'm impressed by your work at [Company]. I'd love to learn about your experience.",
            bestPractices: ["Personalize", "Be concise", "Show genuine interest"]
          }
        ]
      },
      applicationOptimization: {
        resumeTailoring: ["Customize for each role", "Mirror job description language"],
        coverLetterTips: ["Address company needs", "Include 2-3 achievements"],
        followUpStrategy: ["Follow up after 1 week", "Connect on LinkedIn"]
      }
    },
    salaryNegotiation: {
      marketRates: {
        role: targetRole || "Software Engineer",
        experience: experienceLevel || "3-5 years",
        location: "San Francisco",
        min: 120000,
        max: 180000,
        average: 150000
      },
      negotiationTactics: ["Research market rates", "Have multiple offers"],
      benefitsNegotiation: ["Ask about signing bonus", "Negotiate vacation days"],
      counterOfferHandling: ["Get in writing", "Evaluate total compensation"]
    },
    careerGrowth: {
      shortTermGoals: ["Master current stack", "Lead small projects"],
      longTermGoals: ["Move to senior role", "Consider management track"],
      industryTrends: ["AI integration", "Cloud-native apps"],
      certificationPaths: [
        {
          certification: "Cloud Certification",
          provider: "AWS/Azure/GCP",
          cost: "$150",
          duration: "3 months",
          roi: "15-20% salary increase",
          prerequisites: ["Basic cloud knowledge"]
        }
      ]
    }
  }
}
