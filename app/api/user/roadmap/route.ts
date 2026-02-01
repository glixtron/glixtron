import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MongoClient } from 'mongodb'

// Extend timeout for Vercel Hobby tier
export const maxDuration = 60

// Gemini AI-powered personalized career path generation
async function generatePersonalizedCareerPath(userInput: string, userProfile?: any): Promise<any> {
  try {
    console.log('🤖 Starting Gemini AI career path generation...')
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
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
    throw new Error('Failed to generate personalized career path')
  }
}

// New POST endpoint for personalized career path generation
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const { userInput, userProfile } = await request.json()

    // Validate required fields
    if (!userInput || userInput.trim().length < 50) {
      return NextResponse.json({ 
        success: false,
        error: 'User input is required and must be at least 50 characters'
      }, { status: 400 })
    }

    console.log('🎯 Generating personalized career path for user:', session.user.email)

    // Generate personalized career path using Gemini AI
    const careerPath = await generatePersonalizedCareerPath(userInput, userProfile)

    // Connect to MongoDB to save the career path
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Save the generated career path
      const result = await db.collection('users').updateOne(
        { email: session.user.email },
        { 
          $set: {
            'personalizedCareerPath': careerPath,
            'roadmapState.lastGenerated': new Date(),
            'roadmapState.aiGenerated': true
          }
        },
        { upsert: true }
      )
      
      // Also save to career path history for analytics
      await db.collection('career_path_history').insertOne({
        email: session.user.email,
        userInput: userInput.substring(0, 500),
        careerPath,
        aiProvider: 'Gemini',
        generatedAt: new Date()
      })
      
      console.log('✅ Personalized career path saved for user:', session.user.email)
      
      return NextResponse.json({
        success: true,
        data: {
          careerPath,
          message: 'Personalized career path generated successfully using Gemini AI'
        }
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Career Path Generation Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate career path'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const { milestone, targetDate, priority, progressScore } = await request.json()

    // Validate required fields
    if (!milestone || !targetDate || !priority) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: milestone, targetDate, priority'
      }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Add the new milestone to the user's roadmap array
      const result = await db.collection('users').updateOne(
        { email: session.user.email },
        { 
          $push: { 
            roadmap: {
              id: new Date().getTime().toString(), // Simple ID generation
              milestone,
              targetDate,
              priority,
              status: 'pending',
              progressScore: progressScore || 25,
              createdAt: new Date(),
              updatedAt: new Date()
            } 
          } as any,
          // Update current roadmap state
          $set: {
            'roadmapState.currentMilestone': milestone,
            'roadmapState.targetDate': targetDate,
            'roadmapState.progressScore': progressScore || 25,
            'roadmapState.updatedAt': new Date()
          }
        },
        { upsert: true }
      )
      
      // Also save to roadmap history for analytics
      await db.collection('roadmap_history').insertOne({
        email: session.user.email,
        milestone,
        targetDate,
        priority,
        progressScore: progressScore || 25,
        source: 'ai_generated',
        createdAt: new Date()
      })
      
      console.log('✅ Roadmap milestone saved for user:', session.user.email)
      
      return NextResponse.json({
        success: true,
        data: {
          id: new Date().getTime().toString(),
          milestone,
          targetDate,
          priority,
          status: 'pending',
          progressScore: progressScore || 25
        }
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Roadmap Update Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    try {
      await client.connect()
      const db = client.db()
      
      // Get user's roadmap and personalized career path
      const user = await db.collection('users').findOne(
        { email: session.user.email },
        { 
          projection: {
            'roadmap': 1,
            'personalizedCareerPath': 1,
            'roadmapState': 1
          }
        }
      )
      
      // Return roadmap data in the expected format
      const roadmapData = user?.roadmap || []
      const personalizedPath = user?.personalizedCareerPath
      const roadmapState = user?.roadmapState || {}
      
      return NextResponse.json({
        success: true,
        data: {
          milestones: Array.isArray(roadmapData) ? roadmapData : [],
          currentMilestone: roadmapState.currentMilestone || 'Getting Started',
          targetDate: roadmapState.targetDate || '6 months',
          progressScore: roadmapState.progressScore || 25,
          personalizedCareerPath: personalizedPath || null,
          hasPersonalizedPath: !!personalizedPath,
          lastGenerated: roadmapState.lastGenerated || null,
          aiGenerated: roadmapState.aiGenerated || false
        }
      })
      
    } finally {
      await client.close()
    }
    
  } catch (error) {
    console.error('Roadmap fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
