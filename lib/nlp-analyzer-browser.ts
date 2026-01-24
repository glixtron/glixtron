/**
 * Browser-compatible NLP analyzer
 * Simplified version without Node.js dependencies
 */

interface KeywordMatch {
  keyword: string
  matches: string[]
  similarity: number
  category: 'exact' | 'similar' | 'related'
}

interface AdvancedKeywordAnalysis {
  exactMatches: string[]
  similarMatches: KeywordMatch[]
  relatedTerms: KeywordMatch[]
  missingKeywords: string[]
  suggestions: string[]
  nextSteps: string[]
}

/**
 * Simple string similarity (Dice coefficient)
 */
function stringSimilarity(str1: string, str2: string): number {
  const pairs1 = getBigrams(str1.toLowerCase())
  const pairs2 = getBigrams(str2.toLowerCase())
  
  let intersection = 0
  const union = pairs1.length + pairs2.length
  
  for (const pair of pairs1) {
    if (pairs2.includes(pair)) {
      intersection++
      pairs2.splice(pairs2.indexOf(pair), 1)
    }
  }
  
  return union === 0 ? 0 : (2 * intersection) / union
}

function getBigrams(str: string): string[] {
  const bigrams: string[] = []
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.substr(i, 2))
  }
  return bigrams
}

/**
 * Simple stemmer (basic implementation)
 */
function stem(word: string): string {
  // Basic stemming - remove common suffixes
  const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'sion', 'ness', 'ment']
  for (const suffix of suffixes) {
    if (word.toLowerCase().endsWith(suffix) && word.length > suffix.length + 2) {
      return word.slice(0, -suffix.length)
    }
  }
  return word.toLowerCase()
}

/**
 * Extract keywords from text (browser-compatible)
 */
export function extractKeywordsNLP(text: string, minFrequency: number = 2): string[] {
  const stopwords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
  ])
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word))
  
  // Count frequency
  const frequency: Record<string, number> = {}
  words.forEach(word => {
    const stemmed = stem(word)
    frequency[stemmed] = (frequency[stemmed] || 0) + 1
  })
  
  // Return keywords that appear minFrequency times or more
  return Object.entries(frequency)
    .filter(([_, count]) => count >= minFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word)
}

/**
 * Find similar keywords using string similarity
 */
export function findSimilarKeywords(
  targetKeyword: string,
  candidateKeywords: string[],
  threshold: number = 0.6
): KeywordMatch[] {
  const matches: KeywordMatch[] = []
  const targetStemmed = stem(targetKeyword)
  
  candidateKeywords.forEach(candidate => {
    const candidateStemmed = stem(candidate)
    
    // Exact match
    if (targetStemmed === candidateStemmed) {
      matches.push({
        keyword: targetKeyword,
        matches: [candidate],
        similarity: 1.0,
        category: 'exact'
      })
      return
    }
    
    // String similarity
    const similarity = stringSimilarity(targetKeyword, candidate)
    
    if (similarity >= threshold) {
      matches.push({
        keyword: targetKeyword,
        matches: [candidate],
        similarity: similarity,
        category: similarity >= 0.8 ? 'similar' : 'related'
      })
    }
  })
  
  return matches.sort((a, b) => b.similarity - a.similarity)
}

/**
 * Advanced keyword analysis with similarity matching (browser-compatible)
 */
export function analyzeKeywordsAdvanced(
  resumeText: string,
  jdText: string
): AdvancedKeywordAnalysis {
  // Extract keywords from both texts
  const resumeKeywords = extractKeywordsNLP(resumeText)
  const jdKeywords = extractKeywordsNLP(jdText, 1) // Lower threshold for JD
  
  // Find exact matches
  const exactMatches = jdKeywords.filter(jdKeyword => 
    resumeKeywords.some(resumeKeyword => 
      stem(jdKeyword) === stem(resumeKeyword)
    )
  )
  
  // Find missing keywords
  const missingKeywords = jdKeywords.filter(jdKeyword => 
    !exactMatches.includes(jdKeyword)
  )
  
  // Find similar matches for missing keywords
  const similarMatches: KeywordMatch[] = []
  const relatedTerms: KeywordMatch[] = []
  
  missingKeywords.forEach(missingKeyword => {
    const similar = findSimilarKeywords(missingKeyword, resumeKeywords, 0.6)
    
    similar.forEach(match => {
      if (match.category === 'similar') {
        similarMatches.push(match)
      } else {
        relatedTerms.push(match)
      }
    })
  })
  
  // Generate suggestions
  const suggestions: string[] = []
  
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Add these key terms: ${missingKeywords.slice(0, 5).join(', ')}`
    )
  }
  
  if (similarMatches.length > 0) {
    suggestions.push(
      `You have similar terms (${similarMatches.length}). Consider using exact JD terminology for better ATS matching.`
    )
  }
  
  if (relatedTerms.length > 0) {
    suggestions.push(
      `Consider adding related terms: ${relatedTerms.slice(0, 3).map(t => t.matches[0]).join(', ')}`
    )
  }
  
  // Generate next steps
  const nextSteps: string[] = []
  
  if (missingKeywords.length > 5) {
    nextSteps.push('High Priority: Add missing keywords to increase ATS compatibility')
  }
  
  if (similarMatches.length > 0) {
    nextSteps.push('Medium Priority: Replace similar terms with exact JD keywords')
  }
  
  if (exactMatches.length / jdKeywords.length < 0.5) {
    nextSteps.push('Focus: Increase keyword density to match 50%+ of JD keywords')
  }
  
  if (nextSteps.length === 0) {
    nextSteps.push('Great! Your resume has good keyword alignment. Focus on quantifiable achievements.')
  }
  
  return {
    exactMatches,
    similarMatches: similarMatches.slice(0, 10),
    relatedTerms: relatedTerms.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 15),
    suggestions,
    nextSteps
  }
}

/**
 * Extract skills with NLP (browser-compatible)
 */
export function extractSkillsAdvanced(text: string): string[] {
  // Common skill patterns
  const skillPatterns = [
    /(?:proficient|experienced|skilled|expert|knowledgeable)\s+(?:in|with|at)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:experience|skills?|proficiency|expertise)/gi,
  ]
  
  const skills: Set<string> = new Set()
  
  skillPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        skills.add(match[1].trim())
      }
    }
  })
  
  // Also extract from common skill list
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue', 'Angular',
    'Node.js', 'Express', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'MySQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
    'Agile', 'Scrum', 'Product Management', 'Data Analysis', 'SQL',
    'Machine Learning', 'AI', 'Design', 'Figma', 'UI/UX', 'Sales', 'Marketing'
  ]
  
  const lowerText = text.toLowerCase()
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      skills.add(skill)
    }
  })
  
  return Array.from(skills)
}

/**
 * Find similar skills (browser-compatible)
 */
export function findSimilarSkills(
  targetSkill: string,
  candidateSkills: string[]
): { skill: string; similarity: number }[] {
  return candidateSkills
    .map(skill => ({
      skill,
      similarity: stringSimilarity(targetSkill, skill)
    }))
    .filter(match => match.similarity >= 0.6)
    .sort((a, b) => b.similarity - a.similarity)
}
