import { NextRequest, NextResponse } from 'next/server'
import { AdvancedScienceMatcher } from '/Users/macbookpro/Desktop/glixtron-pilot/lib/engine/matcher'
import { SkillDictionary, expandAbbreviations } from '/Users/macbookpro/Desktop/glixtron-pilot/lib/engine/utils/dictionary'
import { PCMStream } from '/Users/macbookpro/Desktop/glixtron-pilot/lib/engine/streams/pcm'
import { PCBStream } from '/Users/macbookpro/Desktop/glixtron-pilot/lib/engine/streams/pcb'
import { PCMBStream } from '/Users/macbookpro/Desktop/glixtron-pilot/lib/engine/streams/pcmb'

// GlixAI Master Stream Registry
const streamRegistry = {
  pcm: PCMStream,
  pcb: PCBStream,
  pcmb: PCMBStream,
  general: {
    title: "General Science",
    keywords: ["science", "research", "analysis", "experimental", "laboratory"],
    skills: ["Research Methods", "Data Analysis", "Scientific Writing", "Critical Thinking"],
    tools: ["Excel", "PowerPoint", "Word", "Statistical Software"],
    education: ["Bachelor of Science", "Master of Science", "PhD"],
    jobPortals: ["LinkedIn", "Indeed", "Glassdoor", "Science Careers"],
    roles: ["Research Assistant", "Lab Technician", "Science Writer", "Data Analyst"],
    certifications: ["Lab Safety", "Research Ethics", "Data Analysis Certification"]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, streamType = 'general' } = body

    if (!resumeText) {
      return NextResponse.json(
        { success: false, error: 'Resume text is required' },
        { status: 400 }
      )
    }

    // Get the selected stream data
    const streamKey = streamType as keyof typeof streamRegistry
    const selectedStream = streamRegistry[streamKey] || streamRegistry.general
    
    // Initialize GlixAI Advanced Matcher
    const matcher = new AdvancedScienceMatcher()
    
    // Expand abbreviations using full-form dictionary
    const expandedText = expandAbbreviations(resumeText)
    
    // Perform advanced analysis with stream key
    const analysis = matcher.analyzeResume(expandedText, streamKey)
    
    // Generate GlixAI enhanced results
    const results = {
      score: analysis.score,
      stream: analysis.streamData,
      gaps: analysis.gaps,
      recommendations: analysis.recommendations,
      glixAI_insights: {
        automation_risk: {
          level: analysis.score > 80 ? 'Low' : analysis.score > 60 ? 'Medium' : 'High',
          percentage: Math.max(5, 100 - analysis.score)
        },
        shadow_salary: {
          current: 60000 + (analysis.score * 500),
          potential: 80000 + (analysis.score * 800),
          currency: 'USD'
        },
        future_proofing: {
          score: analysis.score,
          skills_needed: analysis.gaps.slice(0, 3).map((gap: any) => gap.skill || gap),
          timeline_months: Math.max(3, Math.floor((100 - analysis.score) / 10))
        },
        market_trends: {
          growth_rate: '12%',
          demand_level: analysis.score > 70 ? 'High' : 'Medium',
          top_skills: (selectedStream as any).skills?.slice(0, 5) || []
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: 'GlixAI analysis completed successfully'
    })

  } catch (error) {
    console.error('GlixAI Analysis Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        streams: Object.keys(streamRegistry),
        features: ['advanced_matching', 'full_form_expansion', 'gap_analysis', 'salary_projection'],
        provider: 'GlixAI',
        engine: 'Autonomous Science Career Analyzer'
      },
      message: 'GlixAI Analysis service is operational'
    })
  } catch (error) {
    console.error('GlixAI Status Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
