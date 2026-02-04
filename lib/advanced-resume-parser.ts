/**
 * Advanced Resume Parser with AI-Powered Extraction
 * Uses multiple technologies for comprehensive resume analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

interface ParsedResume {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  summary: string
  skills: {
    technical: Array<{
      skill: string
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      experience: string
      certifications: string[]
      projects: string[]
    }>
    soft: Array<{
      skill: string
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      examples: string[]
    }>
    tools: Array<{
      tool: string
      proficiency: number
      usage: string
    }>
  }
  experience: Array<{
    company: string
    position: string
    duration: string
    location: string
    description: string
    achievements: string[]
    technologies: string[]
    responsibilities: string[]
    impact: string
  }>
  education: Array<{
    degree: string
    field: string
    institution: string
    location: string
    graduationYear: string
    gpa?: string
    honors: string[]
    coursework: string[]
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    role: string
    duration: string
    achievements: string[]
    url?: string
    github?: string
    complexity: 'simple' | 'moderate' | 'complex' | 'enterprise'
    teamSize?: number
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
    expiryDate?: string
    credentialId?: string
    url?: string
  }>
  languages: Array<{
    language: string
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
  }>
  publications: Array<{
    title: string
    publisher: string
    date: string
    url?: string
    coAuthors?: string[]
  }>
  patents: Array<{
    title: string
    patentNumber: string
    date: string
    description: string
  }>
  volunteer: Array<{
    organization: string
    role: string
    duration: string
    description: string
    achievements: string[]
  }>
  awards: Array<{
    name: string
    issuer: string
    date: string
    description: string
  }>
  interests: string[]
  metadata: {
    totalExperience: number
    careerLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'executive'
    industry: string[]
    targetRoles: string[]
    salaryExpectation?: string
    relocationWillingness: boolean
    workAuthorization: string
    lastUpdated: string
    parsingConfidence: number
  }
}

export type { ParsedResume }
export class AdvancedResumeParser {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('Advanced Resume Parser: No API key found, using enhanced parsing')
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    }
  }

  async parseResume(resumeText: string, fileFormat?: string): Promise<ParsedResume> {
    try {
      // Pre-process text for better parsing
      const cleanedText = this.preprocessText(resumeText)
      
      // Extract structured data using multiple techniques
      const basicExtraction = this.extractBasicInfo(cleanedText)
      const skillExtraction = this.extractSkills(cleanedText)
      const experienceExtraction = this.extractExperience(cleanedText)
      const educationExtraction = this.extractEducation(cleanedText)
      const projectExtraction = this.extractProjects(cleanedText)

      let aiEnhancedData: Partial<ParsedResume> = {}
      
      if (this.model) {
        try {
          aiEnhancedData = await this.enhanceWithAI(cleanedText, {
            basicExtraction,
            skillExtraction,
            experienceExtraction,
            educationExtraction,
            projectExtraction
          })
        } catch (error) {
          console.error('AI enhancement failed, using rule-based parsing:', error)
        }
      }

      // Combine all extraction methods
      const parsedResume: ParsedResume = {
        personalInfo: aiEnhancedData.personalInfo || basicExtraction.personalInfo,
        summary: aiEnhancedData.summary || this.extractSummary(cleanedText),
        skills: aiEnhancedData.skills || skillExtraction,
        experience: aiEnhancedData.experience || experienceExtraction,
        education: aiEnhancedData.education || educationExtraction,
        projects: aiEnhancedData.projects || projectExtraction,
        certifications: aiEnhancedData.certifications || this.extractCertifications(cleanedText),
        languages: aiEnhancedData.languages || this.extractLanguages(cleanedText),
        publications: aiEnhancedData.publications || this.extractPublications(cleanedText),
        patents: aiEnhancedData.patents || this.extractPatents(cleanedText),
        volunteer: aiEnhancedData.volunteer || this.extractVolunteer(cleanedText),
        awards: aiEnhancedData.awards || this.extractAwards(cleanedText),
        interests: aiEnhancedData.interests || this.extractInterests(cleanedText),
        metadata: aiEnhancedData.metadata || this.generateMetadata(basicExtraction, experienceExtraction)
      }

      return parsedResume
    } catch (error) {
      console.error('Resume parsing error:', error)
      throw new Error('Failed to parse resume')
    }
  }

  private preprocessText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[^\w\s@.-]/g, ' ') // Remove special characters except email/URL chars
      .trim()
  }

  private extractBasicInfo(text: string): { personalInfo: ParsedResume['personalInfo'] } {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi
    const githubRegex = /github\.com\/[\w-]+/gi
    const portfolioRegex = /(?:portfolio|website|site):\s*(https?:\/\/[^\s]+)/gi

    const emails = text.match(emailRegex) || []
    const phones = text.match(phoneRegex) || []
    const linkedins = text.match(linkedinRegex) || []
    const githubs = text.match(githubRegex) || []
    const portfolios = text.match(portfolioRegex) || []

    // Extract name (usually at the beginning)
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    const name = lines[0]?.replace(/[^\w\s]/g, '').trim() || 'Unknown'

    // Extract location
    const locationRegex = /(?:City|Location|Address):\s*([^\n]+)/i
    const locationMatch = text.match(locationRegex)
    const location = locationMatch?.[1]?.trim() || this.extractLocationFromText(text)

    return {
      personalInfo: {
        name,
        email: emails[0] || '',
        phone: phones[0] || '',
        location,
        linkedin: linkedins[0] || '',
        github: githubs[0] || '',
        portfolio: portfolios[0] || ''
      }
    }
  }

  private extractSkills(text: string): ParsedResume['skills'] {
    const technicalSkills = this.extractTechnicalSkills(text)
    const softSkills = this.extractSoftSkills(text)
    const tools = this.extractTools(text)

    return {
      technical: technicalSkills,
      soft: softSkills,
      tools
    }
  }

  private extractTechnicalSkills(text: string): ParsedResume['skills']['technical'] {
    const skillKeywords = {
      programming: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'php', 'scala', 'perl', 'r', 'matlab'],
      frontend: ['react', 'vue', 'angular', 'html', 'css', 'sass', 'less', 'webpack', 'babel', 'next.js', 'gatsby', 'tailwind', 'bootstrap', 'jquery'],
      backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', 'fastapi', 'nest.js'],
      database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'oracle', 'sqlite'],
      cloud: ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'vercel', 'netlify', 'firebase'],
      devops: ['docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions', 'terraform', 'ansible', 'ci/cd', 'microservices'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin', 'cordova'],
      ai_ml: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'nlp', 'computer vision', 'opencv'],
      data: ['pandas', 'numpy', 'spark', 'hadoop', 'tableau', 'power bi', 'excel', 'data analysis', 'statistics'],
      testing: ['jest', 'mocha', 'jasmine', 'selenium', 'cypress', 'unit testing', 'integration testing', 'tdd'],
      security: ['oauth', 'jwt', 'ssl', 'https', 'encryption', 'cybersecurity', 'penetration testing', 'authentication']
    }

    const foundSkills: ParsedResume['skills']['technical'] = []
    const lowerText = text.toLowerCase()

    Object.entries(skillKeywords).forEach(([category, skills]) => {
      skills.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
          const level = this.determineSkillLevel(text, skill)
          foundSkills.push({
            skill: skill.charAt(0).toUpperCase() + skill.slice(1),
            level,
            experience: this.extractSkillExperience(text, skill),
            certifications: this.extractSkillCertifications(text, skill),
            projects: this.extractSkillProjects(text, skill)
          })
        }
      })
    })

    return foundSkills
  }

  private extractSoftSkills(text: string): ParsedResume['skills']['soft'] {
    const softSkillKeywords = [
      'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking', 'creativity',
      'adaptability', 'time management', 'project management', 'mentoring', 'collaboration',
      'negotiation', 'presentation', 'analytical thinking', 'decision making', 'strategic planning',
      'attention to detail', 'organization', 'multitasking', 'interpersonal skills', 'emotional intelligence'
    ]

    const foundSkills: ParsedResume['skills']['soft'] = []
    const lowerText = text.toLowerCase()

    softSkillKeywords.forEach(skill => {
      if (lowerText.includes(skill)) {
        foundSkills.push({
          skill: skill.charAt(0).toUpperCase() + skill.slice(1),
          level: 'intermediate',
          examples: this.extractSkillExamples(text, skill)
        })
      }
    })

    return foundSkills
  }

  private extractTools(text: string): ParsedResume['skills']['tools'] {
    const toolKeywords = [
      'git', 'github', 'gitlab', 'jira', 'slack', 'trello', 'asana', 'notion', 'figma', 'sketch',
      'visual studio code', 'intellij', 'eclipse', 'postman', 'chrome devtools', 'docker desktop',
      'kubernetes dashboard', 'aws console', 'azure portal', 'google cloud console'
    ]

    const foundTools: ParsedResume['skills']['tools'] = []
    const lowerText = text.toLowerCase()

    toolKeywords.forEach(tool => {
      if (lowerText.includes(tool)) {
        foundTools.push({
          tool: tool.charAt(0).toUpperCase() + tool.slice(1),
          proficiency: 75,
          usage: this.extractToolUsage(text, tool)
        })
      }
    })

    return foundTools
  }

  private extractExperience(text: string): ParsedResume['experience'] {
    const experienceSection = this.extractSection(text, ['experience', 'work history', 'professional experience', 'employment'])
    const experiences: ParsedResume['experience'] = []

    if (experienceSection) {
      const experienceEntries = this.splitExperienceEntries(experienceSection)
      
      experienceEntries.forEach(entry => {
        const experience = this.parseExperienceEntry(entry)
        if (experience) {
          experiences.push(experience)
        }
      })
    }

    return experiences
  }

  private extractEducation(text: string): ParsedResume['education'] {
    const educationSection = this.extractSection(text, ['education', 'academic', 'university', 'college'])
    const educationEntries: ParsedResume['education'] = []

    if (educationSection) {
      const educationBlocks = this.splitEducationEntries(educationSection)
      
      educationBlocks.forEach(block => {
        const education = this.parseEducationEntry(block)
        if (education) {
          educationEntries.push(education)
        }
      })
    }

    return educationEntries
  }

  private extractProjects(text: string): ParsedResume['projects'] {
    const projectSection = this.extractSection(text, ['projects', 'portfolio', 'personal projects'])
    const projects: ParsedResume['projects'] = []

    if (projectSection) {
      const projectEntries = this.splitProjectEntries(projectSection)
      
      projectEntries.forEach(entry => {
        const project = this.parseProjectEntry(entry)
        if (project) {
          projects.push(project)
        }
      })
    }

    return projects
  }

  private async enhanceWithAI(text: string, extractedData: any): Promise<Partial<ParsedResume>> {
    const prompt = `
You are an expert resume parser. Analyze this resume text and provide detailed JSON extraction:

RESUME TEXT:
${text}

CURRENT EXTRACTION:
${JSON.stringify(extractedData, null, 2)}

Provide comprehensive JSON extraction in this format:
{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1-555-0123",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "https://portfolio.com"
  },
  "summary": "Professional summary...",
  "skills": {
    "technical": [
      {
        "skill": "JavaScript",
        "level": "advanced",
        "experience": "3 years",
        "certifications": ["React Certification"],
        "projects": ["E-commerce platform"]
      }
    ],
    "soft": [
      {
        "skill": "Leadership",
        "level": "intermediate",
        "examples": ["Led team of 3 developers"]
      }
    ],
    "tools": [
      {
        "tool": "Git",
        "proficiency": 85,
        "usage": "Version control for all projects"
      }
    ]
  },
  "experience": [
    {
      "company": "Tech Corp",
      "position": "Software Engineer",
      "duration": "2021-2023",
      "location": "San Francisco, CA",
      "description": "Full-stack development...",
      "achievements": ["Improved performance by 40%"],
      "technologies": ["React", "Node.js", "AWS"],
      "responsibilities": ["Developed web applications"],
      "impact": "Increased user engagement by 25%"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "institution": "University Name",
      "location": "City, State",
      "graduationYear": "2020",
      "gpa": "3.8",
      "honors": ["Dean's List"],
      "coursework": ["Data Structures", "Algorithms"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description...",
      "technologies": ["React", "Node.js"],
      "role": "Lead Developer",
      "duration": "3 months",
      "achievements": ["Launched successfully"],
      "url": "https://project.com",
      "github": "github.com/username/project",
      "complexity": "complex",
      "teamSize": 3
    }
  ],
  "certifications": [
    {
      "name": "AWS Solutions Architect",
      "issuer": "Amazon",
      "date": "2023",
      "credentialId": "AWS-123456",
      "url": "https://aws.amazon.com/certification"
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "native"
    }
  ],
  "publications": [],
  "patents": [],
  "volunteer": [],
  "awards": [],
  "interests": ["Technology", "Open Source"],
  "metadata": {
    "totalExperience": 3,
    "careerLevel": "mid",
    "industry": ["Technology", "Software"],
    "targetRoles": ["Senior Software Engineer"],
    "salaryExpectation": "$120k-150k",
    "relocationWillingness": true,
    "workAuthorization": "US Citizen",
    "lastUpdated": "2024",
    "parsingConfidence": 95
  }
}

Focus on:
1. Extract ALL technical skills with proficiency levels
2. Identify specific achievements with metrics
3. Determine career level and experience
4. Extract project details and complexity
5. Identify certifications and their validity
6. Analyze career trajectory and target roles
7. Estimate salary expectations based on experience
8. Determine industry specialization
9. Extract soft skills with examples
10. Provide confidence scores for extraction accuracy
`

    const result = await this.model.generateContent(prompt)
    const response = await result.response.text()
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
    }
    
    return {}
  }

  // Helper methods for extraction
  private determineSkillLevel(text: string, skill: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes(`${skill.toLowerCase()} expert`) || lowerText.includes(`expert in ${skill.toLowerCase()}`)) {
      return 'expert'
    } else if (lowerText.includes(`${skill.toLowerCase()} senior`) || lowerText.includes(`advanced ${skill.toLowerCase()}`)) {
      return 'advanced'
    } else if (lowerText.includes(`${skill.toLowerCase()} junior`) || lowerText.includes(`basic ${skill.toLowerCase()}`)) {
      return 'beginner'
    } else {
      return 'intermediate'
    }
  }

  private extractSkillExperience(text: string, skill: string): string {
    const regex = new RegExp(`${skill.toLowerCase()}[^.]*?(\\d+\\s*(?:years?|months?))`, 'gi')
    const match = text.match(regex)
    return match?.[1] || 'Not specified'
  }

  private extractSkillCertifications(text: string, skill: string): string[] {
    const certifications: string[] = []
    const lines = text.split('\n')
    
    lines.forEach(line => {
      if (line.toLowerCase().includes(skill.toLowerCase()) && 
          (line.toLowerCase().includes('certified') || line.toLowerCase().includes('certification'))) {
        certifications.push(line.trim())
      }
    })
    
    return certifications
  }

  private extractSkillProjects(text: string, skill: string): string[] {
    const projects: string[] = []
    const lines = text.split('\n')
    
    lines.forEach(line => {
      if (line.toLowerCase().includes(skill.toLowerCase()) && 
          (line.toLowerCase().includes('project') || line.toLowerCase().includes('app'))) {
        projects.push(line.trim())
      }
    })
    
    return projects
  }

  private extractSkillExamples(text: string, skill: string): string[] {
    const examples: string[] = []
    const lines = text.split('\n')
    
    lines.forEach(line => {
      if (line.toLowerCase().includes(skill.toLowerCase()) && 
          (line.includes('led') || line.includes('managed') || line.includes('developed'))) {
        examples.push(line.trim())
      }
    })
    
    return examples
  }

  private extractToolUsage(text: string, tool: string): string {
    const regex = new RegExp(`${tool.toLowerCase()}[^.]*\\.`, 'gi')
    const match = text.match(regex)
    return match?.[0]?.trim() || 'Regular usage'
  }

  private extractSection(text: string, keywords: string[]): string | null {
    const lowerText = text.toLowerCase()
    
    for (const keyword of keywords) {
      const regex = new RegExp(`(?:${keyword})[\\s\\S]*?(?=\n[a-z]|$)`, 'gi')
      const match = text.match(regex)
      if (match) {
        return match[0]
      }
    }
    
    return null
  }

  private splitExperienceEntries(section: string): string[] {
    return section.split(/\n(?=[A-Z][a-z])/).filter(entry => entry.trim().length > 10)
  }

  private parseExperienceEntry(entry: string): ParsedResume['experience'][0] | null {
    const lines = entry.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null

    const firstLine = lines[0]
    const secondLine = lines[1] || ''
    
    // Extract company and position
    const position = firstLine.split(',')[0].trim()
    const company = firstLine.split(',')[1]?.trim() || ''
    
    // Extract duration and location
    const durationMatch = secondLine.match(/(\d{4}|\d{1,2}\/\d{4})\s*[-–]\s*(\d{4}|\d{1,2}\/\d{4}|present)/i)
    const duration = durationMatch ? `${durationMatch[1]} - ${durationMatch[2]}` : 'Not specified'
    
    const locationMatch = secondLine.match(/([^|,\n]+(?:[A-Z]{2}|[A-Z]{3}|[A-Z]{4}))$/)
    const location = locationMatch ? locationMatch[1].trim() : 'Not specified'
    
    // Extract description
    const description = lines.slice(2).join(' ').trim()
    
    // Extract achievements (lines starting with •, -, or numbers)
    const achievements = lines.slice(2).filter(line => 
      /^[•\-\*\d]/.test(line.trim())
    ).map(line => line.replace(/^[•\-\*\d]\s*/, '').trim())

    // Extract technologies
    const techKeywords = ['react', 'node.js', 'python', 'java', 'aws', 'docker', 'kubernetes', 'mongodb', 'sql']
    const technologies = techKeywords.filter(tech => 
      description.toLowerCase().includes(tech.toLowerCase())
    ).map(tech => tech.charAt(0).toUpperCase() + tech.slice(1))

    return {
      company,
      position,
      duration,
      location,
      description,
      achievements,
      technologies,
      responsibilities: [],
      impact: achievements[0] || 'Contributed to company success'
    }
  }

  private splitEducationEntries(section: string): string[] {
    return section.split(/\n(?=[A-Z])/).filter(entry => entry.trim().length > 10)
  }

  private parseEducationEntry(entry: string): ParsedResume['education'][0] | null {
    const lines = entry.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null

    const firstLine = lines[0]
    
    // Extract degree and field
    const degreeMatch = firstLine.match(/(Bachelor|Master|PhD|Associate|Certificate)[^,]*/i)
    const degree = degreeMatch ? degreeMatch[0].trim() : 'Degree'
    
    const fieldMatch = firstLine.match(/in\s+([^,\n]+)/i)
    const field = fieldMatch ? fieldMatch[1].trim() : 'Field of Study'
    
    // Extract institution
    const institutionMatch = firstLine.match(/([^,\n]*University|[^,\n]*College|[^,\n]*Institute)/i)
    const institution = institutionMatch ? institutionMatch[0].trim() : 'Institution'
    
    // Extract graduation year
    const yearMatch = entry.match(/(20\d{2})/)
    const graduationYear = yearMatch ? yearMatch[1] : 'Year'
    
    // Extract GPA
    const gpaMatch = entry.match(/gpa[:\s]*([0-9]\.[0-9]+)/i)
    const gpa = gpaMatch ? gpaMatch[1] : undefined

    return {
      degree,
      field,
      institution,
      location: 'Location',
      graduationYear,
      gpa,
      honors: [],
      coursework: []
    }
  }

  private splitProjectEntries(section: string): string[] {
    return section.split(/\n(?=[A-Z])/).filter(entry => entry.trim().length > 10)
  }

  private parseProjectEntry(entry: string): ParsedResume['projects'][0] | null {
    const lines = entry.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null

    const name = lines[0].trim()
    const description = lines.slice(1).join(' ').trim()
    
    // Extract technologies
    const techKeywords = ['react', 'node.js', 'python', 'java', 'aws', 'docker', 'mongodb', 'sql', 'typescript']
    const technologies = techKeywords.filter(tech => 
      description.toLowerCase().includes(tech.toLowerCase())
    ).map(tech => tech.charAt(0).toUpperCase() + tech.slice(1))

    return {
      name,
      description,
      technologies,
      role: 'Developer',
      duration: 'Not specified',
      achievements: [],
      complexity: technologies.length > 3 ? 'complex' : 'moderate'
    }
  }

  private extractSummary(text: string): string {
    const summarySection = this.extractSection(text, ['summary', 'profile', 'about', 'objective'])
    return summarySection?.trim() || 'Professional summary not found'
  }

  private extractCertifications(text: string): ParsedResume['certifications'] {
    const certifications: ParsedResume['certifications'] = []
    const lines = text.split('\n')
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('certified') || line.toLowerCase().includes('certification')) {
        certifications.push({
          name: line.trim(),
          issuer: 'Issuer',
          date: 'Date',
          url: ''
        })
      }
    })
    
    return certifications
  }

  private extractLanguages(text: string): ParsedResume['languages'] {
    const languages: ParsedResume['languages'] = []
    const languageKeywords = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'korean']
    
    languageKeywords.forEach(lang => {
      if (text.toLowerCase().includes(lang)) {
        languages.push({
          language: lang.charAt(0).toUpperCase() + lang.slice(1),
          proficiency: 'fluent'
        })
      }
    })
    
    return languages
  }

  private extractPublications(text: string): ParsedResume['publications'] {
    return []
  }

  private extractPatents(text: string): ParsedResume['patents'] {
    return []
  }

  private extractVolunteer(text: string): ParsedResume['volunteer'] {
    return []
  }

  private extractAwards(text: string): ParsedResume['awards'] {
    return []
  }

  private extractInterests(text: string): string[] {
    const interestsSection = this.extractSection(text, ['interests', 'hobbies'])
    if (interestsSection) {
      return interestsSection.split(',').map(interest => interest.trim())
    }
    return []
  }

  private extractLocationFromText(text: string): string {
    const locationRegex = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/g
    const matches = text.match(locationRegex)
    return matches?.[0] || 'Location not found'
  }

  private generateMetadata(basicExtraction: any, experienceExtraction: ParsedResume['experience']): ParsedResume['metadata'] {
    const totalExperience = experienceExtraction.reduce((total, exp) => {
      const years = this.extractYearsFromDuration(exp.duration)
      return total + years
    }, 0)

    let careerLevel: ParsedResume['metadata']['careerLevel'] = 'entry'
    if (totalExperience >= 10) careerLevel = 'senior'
    else if (totalExperience >= 5) careerLevel = 'mid'
    else if (totalExperience >= 2) careerLevel = 'junior'

    return {
      totalExperience,
      careerLevel,
      industry: ['Technology'],
      targetRoles: ['Software Engineer'],
      relocationWillingness: false,
      workAuthorization: 'Not specified',
      lastUpdated: new Date().toISOString().split('T')[0],
      parsingConfidence: 85
    }
  }

  private extractYearsFromDuration(duration: string): number {
    const yearMatch = duration.match(/(\d+)\s*(?:years?|y)/i)
    return yearMatch ? parseInt(yearMatch[1]) : 0
  }
}

export const advancedResumeParser = new AdvancedResumeParser()
