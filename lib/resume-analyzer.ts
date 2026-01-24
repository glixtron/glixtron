import { analyzeKeywordsAdvanced, extractSkillsAdvanced, findSimilarSkills } from './nlp-analyzer-browser'
import { extractJDFromURL as extractJDFromURLNew } from '@/lib/jd-extractor-server'

// Re-export the JD extraction function
export { extractJDFromURLNew as extractJDFromURL }

export interface ResumeAnalysis {
  matchScore: number
  skillsMatch: {
    matched: string[]
    missing: string[]
    extra: string[]
    similar: Array<{ skill: string; similarity: number }>
  }
  keywords: {
    found: string[]
    missing: string[]
    density: number
    exactMatches: string[]
    similarMatches: Array<{ keyword: string; matches: string[]; similarity: number }>
    relatedTerms: Array<{ keyword: string; matches: string[]; similarity: number }>
  }
  experience: {
    alignment: number
    gaps: string[]
    strengths: string[]
  }
  education: {
    meetsRequirements: boolean
    notes: string
  }
  suggestions: Suggestion[]
  nextSteps: string[]
  hiringProbability: {
    current: number
    optimized: number
    improvement: number
  }
}

export interface Suggestion {
  type: 'critical' | 'enhancement' | 'optimization'
  category: string
  title: string
  description: string
  action: string
  priority: number
  expectedImpact: number
}

/**
 * Extract skills from text
 */
function extractSkills(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue', 'Angular',
    'Node.js', 'Express', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'MySQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
    'Agile', 'Scrum', 'Product Management', 'Data Analysis', 'SQL',
    'Machine Learning', 'AI', 'Design', 'Figma', 'UI/UX', 'Sales', 'Marketing'
  ]
  
  const found: string[] = []
  const lowerText = text.toLowerCase()
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      found.push(skill)
    }
  })
  
  return found
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string, minLength: number = 4): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= minLength)
  
  // Count frequency
  const frequency: Record<string, number> = {}
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })
  
  // Return top keywords (appearing 2+ times or important terms)
  const importantTerms = ['experience', 'skills', 'years', 'development', 'management', 'design', 'analysis']
  return Object.entries(frequency)
    .filter(([word, count]) => count >= 2 || importantTerms.includes(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word)
}

/**
 * Analyze resume against job description with advanced NLP
 */
export function analyzeResume(resumeText: string, jdText: string): ResumeAnalysis {
  // Use advanced NLP analysis
  const nlpAnalysis = analyzeKeywordsAdvanced(resumeText, jdText)
  const resumeLower = resumeText.toLowerCase()
  const jdLower = jdText.toLowerCase()
  
  // Extract skills with advanced NLP
  const resumeSkills = extractSkillsAdvanced(resumeText)
  const jdSkills = extractSkillsAdvanced(jdText)
  
  // Find matches
  const matchedSkills = resumeSkills.filter(skill => 
    jdSkills.some(jdSkill => 
      skill.toLowerCase() === jdSkill.toLowerCase() ||
      skill.toLowerCase().includes(jdSkill.toLowerCase()) ||
      jdSkill.toLowerCase().includes(skill.toLowerCase())
    )
  )
  
  const missingSkills = jdSkills.filter(skill => 
    !resumeSkills.some(rs => 
      rs.toLowerCase() === skill.toLowerCase() ||
      rs.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(rs.toLowerCase())
    )
  )
  
  const extraSkills = resumeSkills.filter(skill => 
    !jdSkills.some(jdSkill => 
      skill.toLowerCase() === jdSkill.toLowerCase()
    )
  )
  
  // Find similar skills for missing ones
  const similarSkills: Array<{ skill: string; similarity: number }> = []
  missingSkills.forEach(missingSkill => {
    const similar = findSimilarSkills(missingSkill, resumeSkills)
    if (similar.length > 0) {
      similarSkills.push(...similar)
    }
  })
  
  // Use advanced NLP keyword analysis
  const keywordDensity = nlpAnalysis.exactMatches.length > 0 
    ? (nlpAnalysis.exactMatches.length / (nlpAnalysis.exactMatches.length + nlpAnalysis.missingKeywords.length)) * 100 
    : 0
  
  // Calculate match score
  const skillsScore = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 40 : 0
  const keywordsScore = keywordDensity * 0.3
  const experienceScore = resumeLower.includes('experience') || resumeLower.includes('years') ? 20 : 10
  const educationScore = resumeLower.includes('education') || resumeLower.includes('degree') ? 10 : 5
  
  const matchScore = Math.min(100, Math.round(skillsScore + keywordsScore + experienceScore + educationScore))
  
  // Experience analysis
  const experienceAlignment = matchScore > 70 ? 85 : matchScore > 50 ? 65 : 45
  const experienceGaps: string[] = []
  const experienceStrengths: string[] = []
  
  if (missingSkills.length > 0) {
    experienceGaps.push(`Missing key skills: ${missingSkills.slice(0, 3).join(', ')}`)
  }
  if (matchedSkills.length > 0) {
    experienceStrengths.push(`Strong in: ${matchedSkills.slice(0, 3).join(', ')}`)
  }
  
  // Education analysis
  const hasEducation = resumeLower.includes('bachelor') || resumeLower.includes('master') || 
                       resumeLower.includes('degree') || resumeLower.includes('university')
  const jdRequiresEducation = jdLower.includes('degree') || jdLower.includes('bachelor') || 
                              jdLower.includes('education')
  
  // Generate suggestions
  const suggestions: Suggestion[] = []
  
  // Critical suggestions
  if (missingSkills.length > 0) {
    suggestions.push({
      type: 'critical',
      category: 'Skills',
      title: 'Add Missing Key Skills',
      description: `The job description emphasizes these skills that are missing from your resume: ${missingSkills.slice(0, 5).join(', ')}`,
      action: `Add these skills to your resume's skills section or highlight relevant experience: ${missingSkills.slice(0, 3).join(', ')}`,
      priority: 1,
      expectedImpact: 15
    })
  }
  
  if (nlpAnalysis.missingKeywords.length > 5) {
    suggestions.push({
      type: 'critical',
      category: 'Keywords',
      title: 'Incorporate Important Keywords',
      description: `Your resume is missing ${nlpAnalysis.missingKeywords.length} important keywords from the job description.`,
      action: `Naturally incorporate these terms: ${nlpAnalysis.missingKeywords.slice(0, 5).join(', ')}`,
      priority: 2,
      expectedImpact: 12
    })
  }
  
  // Enhancement suggestions
  if (keywordDensity < 50) {
    suggestions.push({
      type: 'enhancement',
      category: 'Content',
      title: 'Improve Keyword Density',
      description: `Only ${Math.round(keywordDensity)}% of important keywords are present in your resume.`,
      action: 'Review the job description and naturally weave more relevant keywords throughout your resume.',
      priority: 3,
      expectedImpact: 8
    })
  }
  
  if (!resumeLower.includes('quantifiable') && !resumeLower.match(/\d+%|\$\d+|\d+\+ years/)) {
    suggestions.push({
      type: 'enhancement',
      category: 'Achievements',
      title: 'Add Quantifiable Achievements',
      description: 'Resumes with numbers and metrics stand out to recruiters and ATS systems.',
      action: 'Add specific metrics: "Increased sales by 30%", "Managed team of 5", "Reduced costs by $50K"',
      priority: 4,
      expectedImpact: 10
    })
  }
  
  // Optimization suggestions
  if (extraSkills.length > 5) {
    suggestions.push({
      type: 'optimization',
      category: 'Focus',
      title: 'Prioritize Relevant Skills',
      description: `You have ${extraSkills.length} skills that aren't mentioned in the job description.`,
      action: 'Consider de-emphasizing less relevant skills and highlighting those that match the JD.',
      priority: 5,
      expectedImpact: 5
    })
  }
  
  if (!hasEducation && jdRequiresEducation) {
    suggestions.push({
      type: 'critical',
      category: 'Education',
      title: 'Address Education Requirements',
      description: 'The job description mentions education requirements that may not be clear in your resume.',
      action: 'If you have relevant education, make it more prominent. If not, emphasize equivalent experience.',
      priority: 2,
      expectedImpact: 10
    })
  }
  
  // Calculate hiring probability
  const currentProbability = matchScore
  const optimizedProbability = Math.min(100, currentProbability + 
    suggestions
      .filter(s => s.type === 'critical')
      .reduce((sum, s) => sum + s.expectedImpact, 0))
  const improvement = optimizedProbability - currentProbability
  
  return {
    matchScore,
    skillsMatch: {
      matched: matchedSkills,
      missing: missingSkills,
      extra: extraSkills.slice(0, 5),
      similar: similarSkills.slice(0, 5)
    },
    keywords: {
      found: nlpAnalysis.exactMatches.slice(0, 10),
      missing: nlpAnalysis.missingKeywords.slice(0, 10),
      density: Math.round(keywordDensity),
      exactMatches: nlpAnalysis.exactMatches,
      similarMatches: nlpAnalysis.similarMatches,
      relatedTerms: nlpAnalysis.relatedTerms
    },
    experience: {
      alignment: experienceAlignment,
      gaps: experienceGaps,
      strengths: experienceStrengths
    },
    education: {
      meetsRequirements: hasEducation || !jdRequiresEducation,
      notes: hasEducation 
        ? 'Education section present' 
        : jdRequiresEducation 
          ? 'Consider highlighting education or equivalent experience'
          : 'Education requirements not specified'
    },
    suggestions: suggestions.sort((a, b) => a.priority - b.priority),
    nextSteps: nlpAnalysis.nextSteps,
    hiringProbability: {
      current: currentProbability,
      optimized: optimizedProbability,
      improvement: improvement
    }
  }
}
