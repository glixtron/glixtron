import { SkillDictionary, expandAbbreviations, normalizeSkill } from './utils/dictionary';
import { PCMStream } from './streams/pcm';
import { PCBStream } from './streams/pcb';
import { PCMBStream } from './streams/pcmb';
import { StreamData, AdvancedRole } from './streams/pcm';

export interface UserProfile {
  skills: string[];
  experience: string[];
  education: string[];
  tools: string[];
  certifications: string[];
}

export interface MatchResult {
  score: number;
  skillsFound: string[];
  gaps: string[];
  recommendations: AdvancedRole[];
  streamData: StreamData;
  matchDetails: {
    skillMatches: string[];
    toolMatches: string[];
    educationMatches: string[];
    certificationMatches: string[];
    categoryScores: {
      skills: number;
      tools: number;
      education: number;
      certifications: number;
    };
  };
}

export interface StreamAnalysis {
  detectedStream: string;
  confidence: number;
  allStreamScores: Array<{
    stream: string;
    score: number;
    title: string;
  }>;
  bestMatch: MatchResult;
}

export class AdvancedScienceMatcher {
  private streams: Map<string, StreamData>;
  private weightConfig = {
    skills: 0.4,
    tools: 0.2,
    education: 0.2,
    certifications: 0.2
  };

  constructor() {
    this.streams = new Map([
      ['pcm', PCMStream],
      ['pcb', PCBStream],
      ['pcmb', PCMBStream],
      ['physics', PCMStream],
      ['mathematics', PCMStream],
      ['chemistry', PCBStream],
      ['biology', PCBStream],
      ['engineering', PCMStream],
      ['medical', PCBStream],
      ['life-sciences', PCBStream],
      ['physical-sciences', PCMStream],
      ['integrated', PCMBStream]
    ]);
  }

  /**
   * Advanced resume analysis with fuzzy token matching and full-form expansion
   */
  analyzeResume(text: string, streamId?: string): MatchResult {
    const streamData = this.getStreamData(streamId);
    const expandedText = this.expandText(text);
    
    // Extract user profile from text
    const userProfile = this.extractUserProfile(expandedText);
    
    // Calculate matches for each category
    const skillMatches = this.calculateMatches(userProfile.skills, streamData.keywords);
    const toolMatches = this.calculateMatches(userProfile.tools, streamData.tools);
    const educationMatches = this.calculateMatches(userProfile.education, streamData.educationPaths);
    const certificationMatches = this.calculateMatches(userProfile.certifications, streamData.certifications);
    
    // Calculate category scores
    const categoryScores = {
      skills: this.calculateCategoryScore(skillMatches, streamData.keywords.length),
      tools: this.calculateCategoryScore(toolMatches, streamData.tools.length),
      education: this.calculateCategoryScore(educationMatches, streamData.educationPaths.length),
      certifications: this.calculateCategoryScore(certificationMatches, streamData.certifications.length)
    };
    
    // Calculate weighted overall score
    const overallScore = this.calculateWeightedScore(categoryScores);
    
    // Identify gaps
    const allFound = [...skillMatches, ...toolMatches, ...educationMatches, ...certificationMatches];
    const allRequired = [...streamData.keywords, ...streamData.tools, ...streamData.educationPaths, ...streamData.certifications];
    const gaps = allRequired.filter(item => !this.isMatched(item, allFound));
    
    // Generate recommendations
    const recommendations = streamData.advancedRoles.filter(role => 
      overallScore >= (role.matchThreshold - 20)
    );
    
    return {
      score: Math.round(overallScore),
      skillsFound: skillMatches,
      gaps: gaps.slice(0, 10), // Top 10 gaps
      recommendations,
      streamData,
      matchDetails: {
        skillMatches,
        toolMatches,
        educationMatches,
        certificationMatches,
        categoryScores
      }
    };
  }

  /**
   * Detect the best matching stream for a user
   */
  detectBestStream(text: string): StreamAnalysis {
    const expandedText = this.expandText(text);
    const userProfile = this.extractUserProfile(expandedText);
    
    const streamScores = Array.from(this.streams.entries()).map(([id, streamData]) => {
      const result = this.analyzeResumeWithProfile(userProfile, streamData);
      return {
        stream: id,
        score: result.score,
        title: streamData.title
      };
    });
    
    // Sort by score descending
    streamScores.sort((a, b) => b.score - a.score);
    
    const bestMatch = streamScores[0];
    const confidence = bestMatch.score / 100;
    
    return {
      detectedStream: bestMatch.stream,
      confidence,
      allStreamScores: streamScores,
      bestMatch: this.analyzeResume(text, bestMatch.stream)
    };
  }

  /**
   * Expand text using dictionary and normalize
   */
  private expandText(text: string): string {
    let expanded = expandAbbreviations(text);
    
    // Additional normalization
    expanded = expanded.toUpperCase();
    expanded = expanded.replace(/[^\w\s]/g, ' '); // Remove special chars
    expanded = expanded.replace(/\s+/g, ' ').trim(); // Normalize spaces
    
    return expanded;
  }

  /**
   * Extract user profile from text
   */
  private extractUserProfile(text: string): UserProfile {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const skills: string[] = [];
    const tools: string[] = [];
    const education: string[] = [];
    const certifications: string[] = [];
    const experience: string[] = [];
    
    // Simple extraction logic - can be enhanced with NLP
    lines.forEach(line => {
      const upperLine = line.toUpperCase();
      
      // Skills section
      if (upperLine.includes('SKILLS') || upperLine.includes('TECHNICAL')) {
        const skillWords = this.extractWords(line);
        skills.push(...skillWords);
      }
      
      // Tools section
      if (upperLine.includes('TOOLS') || upperLine.includes('SOFTWARE') || upperLine.includes('PROGRAMMING')) {
        const toolWords = this.extractWords(line);
        tools.push(...toolWords);
      }
      
      // Education section
      if (upperLine.includes('EDUCATION') || upperLine.includes('DEGREE') || upperLine.includes('UNIVERSITY') || upperLine.includes('COLLEGE')) {
        const eduWords = this.extractWords(line);
        education.push(...eduWords);
      }
      
      // Certifications section
      if (upperLine.includes('CERTIFICATION') || upperLine.includes('CERTIFIED') || upperLine.includes('LICENSE')) {
        const certWords = this.extractWords(line);
        certifications.push(...certWords);
      }
      
      // Experience section
      if (upperLine.includes('EXPERIENCE') || upperLine.includes('WORK') || upperLine.includes('JOB')) {
        experience.push(line);
      }
    });
    
    return {
      skills: Array.from(new Set(skills)), // Remove duplicates
      tools: Array.from(new Set(tools)),
      education: Array.from(new Set(education)),
      certifications: Array.from(new Set(certifications)),
      experience: Array.from(new Set(experience))
    };
  }

  /**
   * Extract meaningful words from text
   */
  private extractWords(text: string): string[] {
    const words = text.toUpperCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out very short words
      .filter(word => !this.isStopWord(word));
    
    return words;
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = ['THE', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH', 'BY', 'FROM', 'UP', 'ABOUT', 'INTO', 'THROUGH', 'DURING', 'BEFORE', 'AFTER', 'ABOVE', 'BELOW', 'BETWEEN', 'AMONG', 'SKILLS', 'TOOLS', 'EDUCATION', 'EXPERIENCE', 'CERTIFICATIONS'];
    return stopWords.includes(word);
  }

  /**
   * Calculate matches between user items and required items
   */
  private calculateMatches(userItems: string[], requiredItems: string[]): string[] {
    const matches: string[] = [];
    
    requiredItems.forEach(required => {
      const normalizedRequired = required.toUpperCase();
      
      // Check for exact match or partial match
      const isMatch = userItems.some(userItem => {
        const normalizedUser = userItem.toUpperCase();
        
        // Exact match
        if (normalizedUser === normalizedRequired) return true;
        
        // Partial match (user item contains required or vice versa)
        if (normalizedUser.includes(normalizedRequired) || normalizedRequired.includes(normalizedUser)) return true;
        
        // Token-based matching
        const userTokens = normalizedUser.split(/\s+/);
        const requiredTokens = normalizedRequired.split(/\s+/);
        
        // If user tokens contain most required tokens
        const matchingTokens = requiredTokens.filter(token => 
          userTokens.some(userToken => userToken.includes(token) || token.includes(userToken))
        );
        
        return matchingTokens.length >= Math.ceil(requiredTokens.length * 0.6); // 60% token match
      });
      
      if (isMatch) {
        matches.push(required);
      }
    });
    
    return matches;
  }

  /**
   * Calculate category score
   */
  private calculateCategoryScore(matches: string[], totalRequired: number): number {
    if (totalRequired === 0) return 0;
    return (matches.length / totalRequired) * 100;
  }

  /**
   * Calculate weighted overall score
   */
  private calculateWeightedScore(categoryScores: {
    skills: number;
    tools: number;
    education: number;
    certifications: number;
  }): number {
    return (
      categoryScores.skills * this.weightConfig.skills +
      categoryScores.tools * this.weightConfig.tools +
      categoryScores.education * this.weightConfig.education +
      categoryScores.certifications * this.weightConfig.certifications
    );
  }

  /**
   * Check if item is matched
   */
  private isMatched(item: string, matches: string[]): boolean {
    const normalizedItem = item.toUpperCase();
    return matches.some(match => {
      const normalizedMatch = match.toUpperCase();
      return normalizedItem === normalizedMatch || 
             normalizedItem.includes(normalizedMatch) || 
             normalizedMatch.includes(normalizedItem);
    });
  }

  /**
   * Get stream data by ID
   */
  private getStreamData(streamId?: string): StreamData {
    if (!streamId) {
      return PCMStream; // Default fallback
    }
    
    const stream = this.streams.get(streamId.toLowerCase());
    return stream || PCMStream; // Fallback to PCM
  }

  /**
   * Analyze resume with pre-extracted profile
   */
  private analyzeResumeWithProfile(userProfile: UserProfile, streamData: StreamData): MatchResult {
    const skillMatches = this.calculateMatches(userProfile.skills, streamData.keywords);
    const toolMatches = this.calculateMatches(userProfile.tools, streamData.tools);
    const educationMatches = this.calculateMatches(userProfile.education, streamData.educationPaths);
    const certificationMatches = this.calculateMatches(userProfile.certifications, streamData.certifications);
    
    const categoryScores = {
      skills: this.calculateCategoryScore(skillMatches, streamData.keywords.length),
      tools: this.calculateCategoryScore(toolMatches, streamData.tools.length),
      education: this.calculateCategoryScore(educationMatches, streamData.educationPaths.length),
      certifications: this.calculateCategoryScore(certificationMatches, streamData.certifications.length)
    };
    
    const overallScore = this.calculateWeightedScore(categoryScores);
    
    const allFound = [...skillMatches, ...toolMatches, ...educationMatches, ...certificationMatches];
    const allRequired = [...streamData.keywords, ...streamData.tools, ...streamData.educationPaths, ...streamData.certifications];
    const gaps = allRequired.filter(item => !this.isMatched(item, allFound));
    
    const recommendations = streamData.advancedRoles.filter(role => 
      overallScore >= (role.matchThreshold - 20)
    );
    
    return {
      score: Math.round(overallScore),
      skillsFound: skillMatches,
      gaps: gaps.slice(0, 10),
      recommendations,
      streamData,
      matchDetails: {
        skillMatches,
        toolMatches,
        educationMatches,
        certificationMatches,
        categoryScores
      }
    };
  }
}

// Export singleton instance
export const scienceMatcher = new AdvancedScienceMatcher();
