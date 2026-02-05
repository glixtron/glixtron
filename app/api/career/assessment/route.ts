import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Extend timeout for Vercel Hobby tier (max 60 seconds)
export const maxDuration = 60

interface AssessmentRequest {
  userAim: string
  currentProfile?: {
    education?: string
    skills?: string[]
    experience?: string
    interests?: string[]
  }
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  questionCount?: number
}

interface AssessmentQuestion {
  id: string
  question: string
  type: 'technical' | 'behavioral' | 'situational' | 'knowledge'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  options?: string[]
  correctAnswer?: string
  explanation?: string
  timeLimit: number // in seconds
  points: number
}

interface AssessmentResponse {
  success: boolean
  questions?: AssessmentQuestion[]
  totalQuestions?: number
  estimatedTime?: number
  categories?: string[]
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

    const body: AssessmentRequest = await request.json()
    const { userAim, currentProfile, difficulty = 'intermediate', questionCount = 5 } = body

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

    // Detect field specialization
    const isMolecularBiology = userAim.toLowerCase().includes('molecular biology') || 
                                  userAim.toLowerCase().includes('scientist') ||
                                  userAim.toLowerCase().includes('biology') ||
                                  userAim.toLowerCase().includes('biotechnology') ||
                                  userAim.toLowerCase().includes('genetics') ||
                                  userAim.toLowerCase().includes('research')

    const isTechnology = userAim.toLowerCase().includes('software') ||
                         userAim.toLowerCase().includes('developer') ||
                         userAim.toLowerCase().includes('engineer') ||
                         userAim.toLowerCase().includes('programming') ||
                         userAim.toLowerCase().includes('coding')

    const isBusiness = userAim.toLowerCase().includes('business') ||
                      userAim.toLowerCase().includes('management') ||
                      userAim.toLowerCase().includes('marketing') ||
                      userAim.toLowerCase().includes('finance') ||
                      userAim.toLowerCase().includes('sales')

    // Build specialized system prompt
    let systemPrompt = ''
    let categories = []

    if (isMolecularBiology) {
      systemPrompt = `
You are Dr. Sarah Chen, PhD, a Molecular Biology expert creating assessment questions for aspiring scientists.

EXPERTISE AREAS:
- Molecular Biology Research Techniques (PCR, CRISPR, Gene Cloning, Protein Engineering)
- Biotechnology Industry Knowledge
- Academic Research Methodology
- Laboratory Safety and Protocols
- Genetic Engineering and Genomics
- Bioinformatics and Data Analysis
- Pharmaceutical R&D Processes
- Clinical Research and Drug Development

QUESTION TYPES TO GENERATE:
1. Technical Knowledge Questions - Test understanding of molecular biology concepts
2. Laboratory Procedure Questions - Test practical lab skills and safety knowledge
3. Research Methodology Questions - Test understanding of scientific research processes
4. Situational Questions - Test problem-solving in research scenarios
5. Current Industry Knowledge Questions - Test awareness of biotechnology trends

DIFFICULTY LEVELS:
- Beginner: Basic molecular biology concepts, lab safety, fundamental techniques
- Intermediate: Advanced techniques, research methodology, data analysis
- Advanced: Complex problem-solving, experimental design, industry applications

CATEGORIES:
- Molecular Biology Fundamentals
- Laboratory Techniques
- Research Methodology
- Biotechnology Industry
- Genetics and Genomics
- Bioinformatics
- Laboratory Safety
- Current Research Trends
`
      categories = ['Molecular Biology', 'Laboratory Techniques', 'Research Methodology', 'Biotechnology', 'Genetics', 'Bioinformatics', 'Lab Safety']
    } else if (isTechnology) {
      systemPrompt = `
You are a senior software engineer and technical interviewer creating assessment questions for developers.

EXPERTISE AREAS:
- Software Development and Programming
- System Design and Architecture
- Data Structures and Algorithms
- Web Development Technologies
- Database Management
- Cloud Computing and DevOps
- Software Testing and Quality Assurance
- Agile Development Methodologies

QUESTION TYPES TO GENERATE:
1. Technical Coding Questions - Test programming skills and problem-solving
2. System Design Questions - Test architectural thinking
3. Algorithm Questions - Test understanding of data structures
4. Database Questions - Test data management knowledge
5. DevOps Questions - Test deployment and infrastructure knowledge

DIFFICULTY LEVELS:
- Beginner: Basic programming concepts, simple algorithms
- Intermediate: Complex algorithms, system design basics
- Advanced: Large-scale system design, optimization, architecture

CATEGORIES:
- Programming Fundamentals
- Data Structures & Algorithms
- System Design
- Web Development
- Database Management
- Cloud & DevOps
- Testing & Quality
- Software Architecture
`
      categories = ['Programming', 'Algorithms', 'System Design', 'Web Development', 'Database', 'Cloud', 'Testing', 'Architecture']
    } else if (isBusiness) {
      systemPrompt = `
You are a business executive and management consultant creating assessment questions for business professionals.

EXPERTISE AREAS:
- Business Strategy and Management
- Marketing and Sales
- Finance and Accounting
- Operations and Supply Chain
- Human Resources and Leadership
- Digital Transformation
- Market Analysis and Research
- Project Management

QUESTION TYPES TO GENERATE:
1. Strategic Thinking Questions - Test business acumen
2. Financial Analysis Questions - Test numerical and analytical skills
3. Marketing Strategy Questions - Test marketing knowledge
4. Leadership Questions - Test management and people skills
5. Case Study Questions - Test problem-solving in business scenarios

DIFFICULTY LEVELS:
- Beginner: Basic business concepts, fundamental principles
- Intermediate: Strategic thinking, financial analysis, marketing basics
- Advanced: Complex business strategy, leadership, organizational management

CATEGORIES:
- Business Strategy
- Marketing & Sales
- Finance & Accounting
- Operations Management
- Leadership
- Digital Transformation
- Market Analysis
- Project Management
`
      categories = ['Strategy', 'Marketing', 'Finance', 'Operations', 'Leadership', 'Digital', 'Analysis', 'Project Management']
    } else {
      systemPrompt = `
You are a versatile career assessment expert creating questions for various professional fields.

QUESTION TYPES TO GENERATE:
1. Technical Knowledge Questions - Test field-specific expertise
2. Problem-Solving Questions - Test analytical thinking
3. Situational Questions - Test practical application
4. Behavioral Questions - Test soft skills and approach
5. Industry Knowledge Questions - Test awareness of current trends

DIFFICULTY LEVELS:
- Beginner: Basic concepts and fundamentals
- Intermediate: Applied knowledge and practical skills
- Advanced: Complex problem-solving and strategic thinking

CATEGORIES:
- General Knowledge
- Problem Solving
- Communication
- Leadership
- Industry Trends
- Technical Skills
- Soft Skills
- Strategic Thinking
`
      categories = ['General', 'Problem Solving', 'Communication', 'Leadership', 'Industry', 'Technical', 'Soft Skills', 'Strategy']
    }

    const userPrompt = `
USER AIM: ${userAim}
USER BACKGROUND: ${currentProfile ? JSON.stringify(currentProfile, null, 2) : 'Not provided'}
DIFFICULTY LEVEL: ${difficulty}
NUMBER OF QUESTIONS: ${questionCount}

TASK: Generate ${questionCount} assessment questions suitable for someone aiming to become a ${userAim}.

For each question, provide:
1. Clear, specific question text
2. Question type (technical, behavioral, situational, knowledge)
3. Category from the relevant field
4. Difficulty level
5. Multiple choice options (for technical/knowledge questions)
6. Correct answer (for objective questions)
7. Brief explanation
8. Time limit in seconds
9. Points value

Please provide the response in this JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is the primary function of CRISPR-Cas9 in molecular biology?",
      "type": "technical",
      "category": "Molecular Biology",
      "difficulty": "intermediate",
      "options": [
        "Gene editing and modification",
        "Protein synthesis",
        "Cell division regulation",
        "DNA replication"
      ],
      "correctAnswer": "Gene editing and modification",
      "explanation": "CRISPR-Cas9 is a revolutionary gene-editing tool that allows scientists to make precise modifications to DNA sequences.",
      "timeLimit": 60,
      "points": 10
    }
  ]
}

Focus on questions that are relevant to the user's career goal and current background level.
`

    try {
      const result = await model.generateContent(systemPrompt + userPrompt)
      const response = await result.response.text()
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const assessmentData = JSON.parse(jsonMatch[0])
        
        // Validate and sanitize the response
        const sanitizedResponse: AssessmentResponse = {
          success: true,
          questions: assessmentData.questions || [],
          totalQuestions: assessmentData.questions?.length || 0,
          estimatedTime: (assessmentData.questions?.length || 0) * 60, // 60 seconds per question average
          categories: categories
        }

        return NextResponse.json({
          success: true,
          data: sanitizedResponse
        })
      }
    } catch (error) {
      console.error('Assessment generation error:', error)
      
      // Return fallback questions
      const fallbackQuestions: AssessmentQuestion[] = [
        {
          id: "q1",
          question: "What motivated you to pursue this career path?",
          type: "behavioral",
          category: "Motivation",
          difficulty: "intermediate",
          timeLimit: 120,
          points: 10
        },
        {
          id: "q2",
          question: "Describe a challenging situation you faced and how you overcame it.",
          type: "situational",
          category: "Problem Solving",
          difficulty: "intermediate",
          timeLimit: 180,
          points: 15
        },
        {
          id: "q3",
          question: "What are your key strengths that make you suitable for this role?",
          type: "behavioral",
          category: "Self Assessment",
          difficulty: "beginner",
          timeLimit: 90,
          points: 10
        }
      ]

      return NextResponse.json({
        success: true,
        data: {
          questions: fallbackQuestions,
          totalQuestions: fallbackQuestions.length,
          estimatedTime: fallbackQuestions.reduce((sum, q) => sum + q.timeLimit, 0),
          categories: ['Motivation', 'Problem Solving', 'Self Assessment']
        }
      })
    }

  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate assessment questions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
