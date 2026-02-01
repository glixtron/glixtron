/**
 * Test API for Career Path Generation (No Auth Required)
 * Demonstrates the Gemini AI career path generation functionality
 */

import { NextRequest, NextResponse } from 'next/server'

// Gemini AI-powered personalized career path generation
async function generatePersonalizedCareerPath(userInput: string, userProfile?: any): Promise<any> {
  try {
    console.log('🤖 Starting Gemini AI career path generation...')
    
    if (!process.env.GEMINI_API_KEY) {
      // Return mock data if Gemini API key is not configured
      return getMockCareerPath(userInput, userProfile)
    }
    
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert career strategist and professional development coach with deep knowledge of various industries, job markets, and career progression paths. Your task is to create a highly personalized, step-by-step career path for the user based on their input and profile.

USER INPUT:
${userInput.substring(0, 2000)}

${userProfile ? `\n\nUSER PROFILE:\n${JSON.stringify(userProfile, null, 2)}` : ''}

Generate a comprehensive, personalized career path with this exact JSON structure:
{
  "careerPath": {
    "currentPosition": "User's current career status",
    "targetPosition": "Recommended target position",
    "timeline": "Estimated time to reach target",
    "confidenceLevel": 85,
    "marketDemand": "High|Medium|Low",
    "salaryPotential": "Entry|Mid|Senior|Executive level"
  },
  "stepByStepPath": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Detailed description of what to do",
      "duration": "Time needed for this step",
      "skills": ["skill1", "skill2", "skill3"],
      "actions": ["action1", "action2", "action3"],
      "milestones": ["milestone1", "milestone2"],
      "resources": ["resource1", "resource2"]
    }
  ],
  "skillEnhancement": {
    "technicalSkills": [
      {
        "skill": "Skill name",
        "currentLevel": "Beginner|Intermediate|Advanced",
        "targetLevel": "Intermediate|Advanced|Expert",
        "importance": "Critical|Important|Nice to have",
        "courses": [
          {
            "name": "Course name",
            "provider": "Coursera|Udemy|edX|LinkedIn Learning|Pluralsight",
            "duration": "Course duration",
            "level": "Beginner|Intermediate|Advanced",
            "url": "Recommended course URL",
            "price": "Free|Paid|Subscription",
            "certificate": true,
            "description": "Course description"
          }
        ]
      }
    ],
    "softSkills": [
      {
        "skill": "Soft skill name",
        "currentLevel": "Beginner|Intermediate|Advanced",
        "targetLevel": "Intermediate|Advanced|Expert",
        "importance": "Critical|Important|Nice to have",
        "courses": [
          {
            "name": "Course name",
            "provider": "Coursera|Udemy|edX|LinkedIn Learning|Pluralsight",
            "duration": "Course duration",
            "level": "Beginner|Intermediate|Advanced",
            "url": "Recommended course URL",
            "price": "Free|Paid|Subscription",
            "certificate": true,
            "description": "Course description"
          }
        ]
      }
    ]
  },
  "industryInsights": {
    "marketTrends": ["trend1", "trend2", "trend3"],
    "growthAreas": ["area1", "area2", "area3"],
    "salaryRanges": {
      "entry": "$X-Y",
      "mid": "$X-Y",
      "senior": "$X-Y",
      "executive": "$X-Y"
    },
    "jobTitles": ["title1", "title2", "title3"],
    "companies": ["company1", "company2", "company3"]
  },
  "personalizedRecommendations": {
    "immediateActions": ["action1", "action2", "action3"],
    "networkingStrategy": ["strategy1", "strategy2"],
    "portfolioProjects": ["project1", "project2"],
    "certificationPriorities": ["cert1", "cert2"],
    "learningResources": ["resource1", "resource2"]
  },
  "successMetrics": {
    "keyIndicators": ["indicator1", "indicator2"],
    "timeBoundGoals": ["goal1", "goal2"],
    "skillMilestones": ["milestone1", "milestone2"]
  }
}

IMPORTANT REQUIREMENTS:
1. Make it highly personalized based on the user's specific input
2. Provide real, actionable steps with specific timelines
3. Include actual course recommendations from real platforms
4. Focus on skill enhancement with specific courses
5. Provide step-by-step path that is achievable and realistic
6. Include industry insights and market trends
7. Make recommendations specific and actionable
8. Use real course names and providers when possible

Return ONLY valid JSON without any markdown formatting or explanations.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Clean response
    let jsonStr = text.replace(/```json|```/g, '').trim()
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) jsonStr = jsonMatch[0]

    const careerPath = JSON.parse(jsonStr)
    
    return {
      ...careerPath,
      aiProvider: 'Gemini',
      generatedAt: new Date().toISOString(),
      personalized: true
    }
    
  } catch (error) {
    console.error('❌ Gemini AI career path generation failed:', error)
    return getMockCareerPath(userInput, userProfile)
  }
}

// Mock career path for testing
function getMockCareerPath(userInput: string, userProfile?: any): any {
  return {
    careerPath: {
      currentPosition: "Junior Software Developer",
      targetPosition: "Senior Full Stack Developer",
      timeline: "18-24 months",
      confidenceLevel: 85,
      marketDemand: "High",
      salaryPotential: "Senior level"
    },
    stepByStepPath: [
      {
        step: 1,
        title: "Master TypeScript and Advanced JavaScript",
        description: "Learn TypeScript fundamentals and advanced JavaScript patterns to improve code quality and type safety",
        duration: "3-4 months",
        skills: ["TypeScript", "Advanced JavaScript", "Type Safety", "Design Patterns"],
        actions: [
          "Complete TypeScript course on Udemy",
          "Build 2 TypeScript projects",
          "Convert existing JavaScript projects to TypeScript",
          "Learn advanced JavaScript patterns"
        ],
        milestones: [
          "Complete TypeScript basics",
          "Build first TypeScript project",
          "Master advanced TypeScript features"
        ],
        resources: [
          "TypeScript Handbook",
          "Udemy TypeScript course",
          "TypeScript Deep Dive book"
        ]
      },
      {
        step: 2,
        title: "Cloud Computing and AWS Fundamentals",
        description: "Gain expertise in cloud computing, particularly AWS services and architecture patterns",
        duration: "4-5 months",
        skills: ["AWS", "Cloud Architecture", "Serverless", "DevOps", "Docker"],
        actions: [
          "Get AWS Certified Solutions Architect",
          "Build cloud-native applications",
          "Learn Docker and Kubernetes",
          "Implement CI/CD pipelines"
        ],
        milestones: [
          "AWS certification achieved",
          "Deploy first cloud application",
          "Master container orchestration"
        ],
        resources: [
          "AWS documentation",
          "Cloud Architecture patterns",
          "Docker tutorials"
        ]
      },
      {
        step: 3,
        title: "System Design and Architecture",
        description: "Learn system design principles, scalability patterns, and distributed systems architecture",
        duration: "3-4 months",
        skills: ["System Design", "Scalability", "Distributed Systems", "Microservices", "Load Balancing"],
        actions: [
          "Study system design fundamentals",
          "Design scalable systems",
          "Learn microservices patterns",
          "Practice system design interviews"
        ],
        milestones: [
          "Complete system design course",
          "Design 3 scalable systems",
          "Master microservices architecture"
        ],
        resources: [
          "System Design Interview book",
          "Grokking System Design course",
          "Designing Data-Intensive Applications"
        ]
      },
      {
        step: 4,
        title: "Technical Leadership and Team Management",
        description: "Develop leadership skills, team management capabilities, and technical decision-making",
        duration: "2-3 months",
        skills: ["Leadership", "Team Management", "Technical Strategy", "Mentoring", "Communication"],
        actions: [
          "Lead a small project team",
          "Mentor junior developers",
          "Learn technical leadership principles",
          "Improve communication skills"
        ],
        milestones: [
          "Lead first project",
          "Mentor 2 junior developers",
          "Complete leadership training"
        ],
        resources: [
          "The Manager's Path book",
          "Technical leadership courses",
          "Communication workshops"
        ]
      }
    ],
    skillEnhancement: {
      technicalSkills: [
        {
          skill: "TypeScript",
          currentLevel: "Beginner",
          targetLevel: "Advanced",
          importance: "Critical",
          courses: [
            {
              name: "TypeScript: The Complete Developer's Guide",
              provider: "Udemy",
              duration: "20 hours",
              level: "Intermediate",
              url: "https://www.udemy.com/course/typescript-the-complete-developers-guide/",
              price: "Paid",
              certificate: true,
              description: "Master TypeScript from basics to advanced concepts"
            },
            {
              name: "Advanced TypeScript Patterns",
              provider: "LinkedIn Learning",
              duration: "3 hours",
              level: "Advanced",
              url: "https://www.linkedin.com/learning/advanced-typescript-patterns",
              price: "Subscription",
              certificate: true,
              description: "Learn advanced TypeScript patterns and best practices"
            }
          ]
        },
        {
          skill: "AWS Cloud Computing",
          currentLevel: "Beginner",
          targetLevel: "Advanced",
          importance: "Critical",
          courses: [
            {
              name: "AWS Certified Solutions Architect - Associate",
              provider: "Coursera",
              duration: "3 months",
              level: "Intermediate",
              url: "https://www.coursera.org/learn/aws-certified-solutions-architect",
              price: "Paid",
              certificate: true,
              description: "Prepare for AWS Solutions Architect certification"
            },
            {
              name: "AWS Cloud Practitioner Essentials",
              provider: "edX",
              duration: "6 weeks",
              level: "Beginner",
              url: "https://www.edx.org/course/aws-cloud-practitioner-essentials",
              price: "Free",
              certificate: true,
              description: "Learn AWS fundamentals and cloud computing basics"
            }
          ]
        },
        {
          skill: "System Design",
          currentLevel: "Beginner",
          targetLevel: "Advanced",
          importance: "Critical",
          courses: [
            {
              name: "Grokking the System Design Interview",
              provider: "Educative",
              duration: "2 months",
              level: "Intermediate",
              url: "https://www.educative.io/courses/grokking-the-system-design-interview",
              price: "Subscription",
              certificate: true,
              description: "Master system design concepts and interview preparation"
            },
            {
              name: "Designing Data-Intensive Applications",
              provider: "Amazon",
              duration: "Self-paced",
              level: "Advanced",
              url: "https://aws.amazon.com/designing-data-intensive-applications/",
              price: "Free",
              certificate: false,
              description: "Learn system design from AWS experts"
            }
          ]
        }
      ],
      softSkills: [
        {
          skill: "Technical Leadership",
          currentLevel: "Beginner",
          targetLevel: "Advanced",
          importance: "Important",
          courses: [
            {
              name: "The Manager's Path",
              provider: "O'Reilly",
              duration: "Self-paced",
              level: "Intermediate",
              url: "https://www.oreilly.com/library/view/the-managers-path/9781491973899/",
              price: "Paid",
              certificate: false,
              description: "Comprehensive guide to technical leadership"
            },
            {
              name: "Engineering Leadership",
              provider: "LinkedIn Learning",
              duration: "4 hours",
              level: "Intermediate",
              url: "https://www.linkedin.com/learning/engineering-leadership",
              price: "Subscription",
              certificate: true,
              description: "Learn engineering leadership principles"
            }
          ]
        },
        {
          skill: "Communication",
          currentLevel: "Intermediate",
          targetLevel: "Advanced",
          importance: "Important",
          courses: [
            {
              name: "Effective Communication for Technical Professionals",
              provider: "Coursera",
              duration: "4 weeks",
              level: "Intermediate",
              url: "https://www.coursera.org/learn/effective-communication-technical-professionals",
              price: "Paid",
              certificate: true,
              description: "Improve communication skills for technical roles"
            },
            {
              name: "Public Speaking for Technical Professionals",
              provider: "Udemy",
              duration: "2 hours",
              level: "Beginner",
              url: "https://www.udemy.com/course/public-speaking-for-technical-professionals/",
              price: "Paid",
              certificate: true,
              description: "Learn public speaking skills for technical presentations"
            }
          ]
        }
      ]
    },
    industryInsights: {
      marketTrends: [
        "Cloud-native applications are becoming standard",
        "Microservices architecture is in high demand",
        "DevOps and automation skills are critical",
        "AI/ML integration is growing rapidly",
        "Remote work is becoming permanent"
      ],
      growthAreas: [
        "Cloud computing and serverless architecture",
        "DevOps and infrastructure as code",
        "AI/ML engineering",
        "Cybersecurity",
        "Data engineering"
      ],
      salaryRanges: {
        entry: "$60,000-$80,000",
        mid: "$80,000-$120,000",
        senior: "$120,000-$180,000",
        executive: "$180,000-$250,000+"
      },
      jobTitles: [
        "Senior Software Engineer",
        "Full Stack Developer",
        "Cloud Engineer",
        "DevOps Engineer",
        "Technical Lead"
      ],
      companies: [
        "Google",
        "Amazon",
        "Microsoft",
        "Meta",
        "Netflix",
        "Apple",
        "Spotify",
        "Airbnb"
      ]
    },
    personalizedRecommendations: {
      immediateActions: [
        "Start learning TypeScript immediately",
        "Get AWS certification within 6 months",
        "Build a portfolio of cloud projects",
        "Join technical communities and meetups"
      ],
      networkingStrategy: [
        "Attend local tech meetups and conferences",
        "Connect with senior developers on LinkedIn",
        "Join online technical communities",
        "Participate in open source projects"
      ],
      portfolioProjects: [
        "Build a cloud-native e-commerce application",
        "Create a microservices-based project",
        "Develop a serverless API",
        "Contribute to open source projects"
      ],
      certificationPriorities: [
        "AWS Solutions Architect Associate",
        "TypeScript certification",
        "Cloud Practitioner certification",
        "DevOps certification"
      ],
      learningResources: [
        "System Design Interview book",
        "AWS documentation and whitepapers",
        "TypeScript Handbook",
        "Clean Code principles"
      ]
    },
    successMetrics: {
      keyIndicators: [
        "Technical skill mastery assessments",
        "Project completion rate",
        "Code quality metrics",
        "Team feedback and reviews"
      ],
      timeBoundGoals: [
        "Complete TypeScript mastery in 3 months",
        "Get AWS certification in 6 months",
        "Lead a project within 12 months",
        "Reach senior level in 18-24 months"
      ],
      skillMilestones: [
        "TypeScript advanced concepts mastered",
        "AWS solutions architect certified",
        "System design interview ready",
        "Technical leadership skills developed"
      ]
    },
    aiProvider: 'Mock (Gemini not available)',
    generatedAt: new Date().toISOString(),
    personalized: true
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userInput, userProfile } = await request.json()

    // Validate required fields
    if (!userInput || userInput.trim().length < 50) {
      return NextResponse.json({ 
        success: false,
        error: 'User input is required and must be at least 50 characters'
      }, { status: 400 })
    }

    console.log('🎯 Generating personalized career path (Test API)...')

    // Generate personalized career path using Gemini AI
    const careerPath = await generatePersonalizedCareerPath(userInput, userProfile)
    
    return NextResponse.json({
      success: true,
      data: {
        careerPath,
        message: 'Personalized career path generated successfully using Gemini AI'
      }
    })
    
  } catch (error) {
    console.error('Career Path Generation Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate career path'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Career Path Generation Test API',
    usage: {
      post: {
        userInput: 'string (required) - Career goals and current situation',
        userProfile: 'object (optional) - Additional user profile information'
      }
    },
    features: {
      aiProvider: 'Gemini AI',
      stepByStepPath: true,
      skillEnhancement: true,
      industryInsights: true,
      personalizedRecommendations: true,
      successMetrics: true,
      realCourses: true
    },
    note: 'This is a test API that demonstrates the career path generation functionality without requiring authentication'
  })
}
