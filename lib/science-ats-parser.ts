/**
 * Science-Optimized ATS Parser
 * Specialized for parsing resumes from all science disciplines
 */

import { ScienceStream, detectScienceStream } from './science-streams-config'

export interface ScienceResumeParse {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
  }
  education: ScienceEducation[]
  experience: ScienceExperience[]
  skills: ScienceSkills
  publications: Publication[]
  research: ResearchExperience[]
  patents: Patent[]
  certifications: Certification[]
  conferences: Conference[]
  grants: Grant[]
  teaching: TeachingExperience[]
  scienceStream: ScienceStream | null
  overallScore: number
  marketReadiness: 'Low' | 'Medium' | 'High'
  recommendations: string[]
}

export interface ScienceEducation {
  degree: string
  field: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  thesis?: string
  relevantCoursework: string[]
  honors: string[]
  researchComponent: boolean
}

export interface ScienceExperience {
  title: string
  institution: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  responsibilities: string[]
  achievements: string[]
  techniques: string[]
  equipment: string[]
  software: string[]
  publications: string[]
}

export interface ScienceSkills {
  technical: TechnicalSkill[]
  laboratory: LaboratorySkill[]
  research: ResearchSkill[]
  software: SoftwareSkill[]
  soft: SoftSkill[]
  languages: LanguageSkill[]
}

export interface TechnicalSkill {
  skill: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  experience: string
  projects: string[]
  certifications: string[]
}

export interface LaboratorySkill {
  technique: string
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
  experience: string
  equipment: string[]
  applications: string[]
}

export interface ResearchSkill {
  methodology: string
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
  experience: string
  applications: string[]
  publications: string[]
}

export interface SoftwareSkill {
  software: string
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
  experience: string
  applications: string[]
  projects: string[]
}

export interface SoftSkill {
  skill: string
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
  evidence: string[]
}

export interface LanguageSkill {
  language: string
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native'
  certification?: string
}

export interface Publication {
  title: string
  authors: string[]
  journal: string
  year: string
  volume?: string
  pages?: string
  doi?: string
  impact: number
  type: 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Review'
}

export interface ResearchExperience {
  title: string
  institution: string
  duration: string
  description: string
  methodologies: string[]
  findings: string[]
  presentations: string[]
  funding?: string
}

export interface Patent {
  title: string
  number: string
  date: string
  inventors: string[]
  description: string
  status: 'Pending' | 'Granted' | 'Licensed'
}

export interface Certification {
  name: string
  issuer: string
  date: string
  expiry?: string
  credentialId?: string
}

export interface Conference {
  name: string
  location: string
  date: string
  presentation: string
  type: 'Oral' | 'Poster' | 'Workshop' | 'Keynote'
}

export interface Grant {
  name: string
  agency: string
  amount: string
  duration: string
  role: 'Principal Investigator' | 'Co-Investigator' | 'Researcher'
  status: 'Active' | 'Completed' | 'Pending'
}

export interface TeachingExperience {
  course: string
  institution: string
  duration: string
  level: string
  role: string
  evaluations?: string
}

export class ScienceATSParser {
  private scienceKeywords = {
    physics: [
      'quantum mechanics', 'electromagnetism', 'thermodynamics', 'statistical mechanics',
      'optics', 'astrophysics', 'particle physics', 'condensed matter', 'nuclear physics',
      'spectroscopy', 'laser', 'vacuum', 'cryogenics', 'monte carlo', 'comsol'
    ],
    chemistry: [
      'organic chemistry', 'inorganic chemistry', 'physical chemistry', 'analytical chemistry',
      'biochemistry', 'polymer chemistry', 'spectroscopy', 'chromatography', 'nmr',
      'mass spectrometry', 'hplc', 'gc-ms', 'ftir', 'synthesis', 'catalysis'
    ],
    biology: [
      'molecular biology', 'cell biology', 'genetics', 'microbiology', 'ecology',
      'evolution', 'biochemistry', 'physiology', 'neurobiology', 'immunology',
      'pcr', 'western blot', 'elisa', 'flow cytometry', 'cell culture', 'dna sequencing',
      'crispr', 'protein purification', 'gel electrophoresis'
    ],
    mathematics: [
      'calculus', 'linear algebra', 'differential equations', 'statistics', 'probability',
      'numerical analysis', 'topology', 'algebra', 'geometry', 'analysis',
      'mathematical modeling', 'statistical analysis', 'machine learning', 'data science'
    ]
  }

  private laboratoryEquipment = [
    'spectrometer', 'microscope', 'centrifuge', 'chromatograph', 'thermocycler',
    'flow cytometer', 'sequencer', 'laser', 'vacuum pump', 'cryostat',
    'mass spectrometer', 'nmr spectrometer', 'x-ray diffractometer', 'electrophoresis',
    'gel documentation system', 'incubator', 'autoclave', 'biosafety cabinet'
  ]

  private researchSoftware = [
    'matlab', 'mathematica', 'python', 'r', 'sas', 'spss', 'stata',
    'chemdraw', 'gaussian', 'spartan', 'mestrenova', 'origin',
    'blast', 'geneious', 'snapgene', 'imagej', 'graphpad prism',
    'comsol', 'ansys', 'autocad', 'labview', 'igor pro'
  ]

  async parseScienceResume(resumeText: string): Promise<ScienceResumeParse> {
    const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Detect science stream
    const scienceStream = detectScienceStream(resumeText)
    
    // Parse personal information
    const personalInfo = this.parsePersonalInfo(lines, resumeText)
    
    // Parse education
    const education = this.parseEducation(lines)
    
    // Parse experience
    const experience = this.parseExperience(lines)
    
    // Parse skills
    const skills = this.parseSkills(lines, scienceStream)
    
    // Parse publications
    const publications = this.parsePublications(lines)
    
    // Parse research experience
    const research = this.parseResearch(lines)
    
    // Parse patents
    const patents = this.parsePatents(lines)
    
    // Parse certifications
    const certifications = this.parseCertifications(lines)
    
    // Parse conferences
    const conferences = this.parseConferences(lines)
    
    // Parse grants
    const grants = this.parseGrants(lines)
    
    // Parse teaching experience
    const teaching = this.parseTeaching(lines)
    
    // Calculate scores
    const { overallScore, marketReadiness } = this.calculateScienceScores(
      education, experience, skills, publications, research, scienceStream
    )
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      education, experience, skills, publications, scienceStream
    )
    
    return {
      personalInfo,
      education,
      experience,
      skills,
      publications,
      research,
      patents,
      certifications,
      conferences,
      grants,
      teaching,
      scienceStream,
      overallScore,
      marketReadiness,
      recommendations
    }
  }

  private parsePersonalInfo(lines: string[], resumeText: string) {
    const personalInfo = {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: ''
    }
    
    // Extract name (usually first line)
    if (lines.length > 0) {
      personalInfo.name = lines[0]
    }
    
    // Extract email
    const emailMatch = resumeText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g)
    if (emailMatch) {
      personalInfo.email = emailMatch[0]
    }
    
    // Extract phone
    const phoneMatch = resumeText.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g)
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0]
    }
    
    // Extract location
    const locationMatch = resumeText.match(/([A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+,\s*[A-Z][a-z]+)/g)
    if (locationMatch) {
      personalInfo.location = locationMatch[0]
    }
    
    // Extract LinkedIn
    const linkedinMatch = resumeText.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/g)
    if (linkedinMatch) {
      personalInfo.linkedin = linkedinMatch[0]
    }
    
    return personalInfo
  }

  private parseEducation(lines: string[]): ScienceEducation[] {
    const education: ScienceEducation[] = []
    const educationSection = this.extractSection(lines, ['Education', 'Academic Background', 'Qualifications'])
    
    for (const entry of educationSection) {
      const degreeMatch = entry.match(/(Bachelor|Master|PhD|Doctorate|B\.S\.|M\.S\.|Ph\.D\.|B\.A\.|M\.A\.)/i)
      const institutionMatch = entry.match(/(?:at|of)\s+([^,\n]+)/i)
      const dateMatch = entry.match(/(\d{4}|\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/g)
      const gpaMatch = entry.match(/GPA[:\s]*([0-9]+\.[0-9]+)/i)
      
      if (degreeMatch) {
        education.push({
          degree: degreeMatch[0],
          field: this.extractFieldOfStudy(entry),
          institution: institutionMatch ? institutionMatch[1] : '',
          location: '',
          startDate: dateMatch && dateMatch[0] ? dateMatch[0] : '',
          endDate: dateMatch && dateMatch[1] ? dateMatch[1] : '',
          gpa: gpaMatch ? gpaMatch[1] : undefined,
          thesis: this.extractThesis(entry),
          relevantCoursework: this.extractCoursework(entry),
          honors: this.extractHonors(entry),
          researchComponent: this.hasResearchComponent(entry)
        })
      }
    }
    
    return education
  }

  private parseExperience(lines: string[]): ScienceExperience[] {
    const experience: ScienceExperience[] = []
    const experienceSection = this.extractSection(lines, ['Experience', 'Work Experience', 'Professional Experience', 'Research Experience'])
    
    for (const entry of experienceSection) {
      const titleMatch = entry.match(/^(.+?)(?:\s+at|\s*\|)/im)
      const institutionMatch = entry.match(/(?:at|of)\s+([^,\n]+)/i)
      const dateMatch = entry.match(/(\d{4}|\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/g)
      
      if (titleMatch) {
        experience.push({
          title: titleMatch[1],
          institution: institutionMatch ? institutionMatch[1] : '',
          location: '',
          startDate: dateMatch && dateMatch[0] ? dateMatch[0] : '',
          endDate: dateMatch && dateMatch[1] ? dateMatch[1] : '',
          current: entry.toLowerCase().includes('present') || entry.toLowerCase().includes('current'),
          description: entry,
          responsibilities: this.extractResponsibilities(entry),
          achievements: this.extractAchievements(entry),
          techniques: this.extractTechniques(entry),
          equipment: this.extractEquipment(entry),
          software: this.extractSoftware(entry),
          publications: this.extractPublicationsFromExperience(entry)
        })
      }
    }
    
    return experience
  }

  private parseSkills(lines: string[], scienceStream: ScienceStream | null): ScienceSkills {
    const skillsSection = this.extractSection(lines, ['Skills', 'Technical Skills', 'Laboratory Skills', 'Software', 'Research Skills'])
    const skillsText = skillsSection.join(' ').toLowerCase()
    
    return {
      technical: this.extractTechnicalSkills(skillsText, scienceStream),
      laboratory: this.extractLaboratorySkills(skillsText, scienceStream),
      research: this.extractResearchSkills(skillsText, scienceStream),
      software: this.extractSoftwareSkills(skillsText, scienceStream),
      soft: this.extractSoftSkills(skillsText),
      languages: this.extractLanguageSkills(skillsText)
    }
  }

  private extractTechnicalSkills(text: string, scienceStream: ScienceStream | null): TechnicalSkill[] {
    const skills: TechnicalSkill[] = []
    
    if (scienceStream) {
      for (const skill of scienceStream.keySkills) {
        if (text.includes(skill.toLowerCase())) {
          skills.push({
            skill,
            level: this.assessSkillLevel(text, skill),
            experience: this.extractExperience(text, skill),
            projects: [],
            certifications: []
          })
        }
      }
    }
    
    return skills
  }

  private extractLaboratorySkills(text: string, scienceStream: ScienceStream | null): LaboratorySkill[] {
    const skills: LaboratorySkill[] = []
    
    if (scienceStream) {
      for (const technique of scienceStream.laboratoryTechniques) {
        if (text.includes(technique.toLowerCase())) {
          skills.push({
            technique,
            proficiency: this.assessSkillLevel(text, technique) as any,
            experience: this.extractExperience(text, technique),
            equipment: this.extractEquipmentForTechnique(text, technique),
            applications: []
          })
        }
      }
    }
    
    return skills
  }

  private extractResearchSkills(text: string, scienceStream: ScienceStream | null): ResearchSkill[] {
    const skills: ResearchSkill[] = []
    
    if (scienceStream) {
      for (const method of scienceStream.researchMethods) {
        if (text.includes(method.toLowerCase())) {
          skills.push({
            methodology: method,
            proficiency: this.assessSkillLevel(text, method) as any,
            experience: this.extractExperience(text, method),
            applications: [],
            publications: []
          })
        }
      }
    }
    
    return skills
  }

  private extractSoftwareSkills(text: string, scienceStream: ScienceStream | null): SoftwareSkill[] {
    const skills: SoftwareSkill[] = []
    
    if (scienceStream) {
      for (const software of scienceStream.softwareTools) {
        if (text.includes(software.toLowerCase())) {
          skills.push({
            software,
            proficiency: this.assessSkillLevel(text, software) as any,
            experience: this.extractExperience(text, software),
            applications: [],
            projects: []
          })
        }
      }
    }
    
    return skills
  }

  private extractSoftSkills(text: string): SoftSkill[] {
    const softSkills = [
      'communication', 'leadership', 'teamwork', 'problem solving',
      'critical thinking', 'analytical thinking', 'creativity', 'adaptability',
      'time management', 'project management', 'presentation skills'
    ]
    
    const skills: SoftSkill[] = []
    
    for (const skill of softSkills) {
      if (text.includes(skill)) {
        skills.push({
          skill: skill.charAt(0).toUpperCase() + skill.slice(1),
          level: this.assessSkillLevel(text, skill) as any,
          evidence: []
        })
      }
    }
    
    return skills
  }

  private extractLanguageSkills(text: string): LanguageSkill[] {
    const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic']
    const skills: LanguageSkill[] = []
    
    for (const lang of languages) {
      if (text.includes(lang)) {
        skills.push({
          language: lang.charAt(0).toUpperCase() + lang.slice(1),
          proficiency: 'Advanced' as any,
          certification: undefined
        })
      }
    }
    
    return skills
  }

  private parsePublications(lines: string[]): Publication[] {
    const publications: Publication[] = []
    const publicationsSection = this.extractSection(lines, ['Publications', 'Papers', 'Journal Articles'])
    
    for (const entry of publicationsSection) {
      const authorMatch = entry.match(/^(.+?)(?:\s*\(|\s*\d{4})/im)
      const yearMatch = entry.match(/(\d{4})/)
      const journalMatch = entry.match(/(?:\(|,)\s*([^,\)]+)/)
      
      if (authorMatch && yearMatch) {
        publications.push({
          title: entry,
          authors: authorMatch[1].split(',').map(a => a.trim()),
          journal: journalMatch ? journalMatch[1] : '',
          year: yearMatch[1],
          volume: '',
          pages: '',
          doi: '',
          impact: 0,
          type: 'Journal Article'
        })
      }
    }
    
    return publications
  }

  private parseResearch(lines: string[]): ResearchExperience[] {
    const research: ResearchExperience[] = []
    const researchSection = this.extractSection(lines, ['Research', 'Research Experience', 'Projects'])
    
    for (const entry of researchSection) {
      research.push({
        title: entry.split('\n')[0],
        institution: '',
        duration: '',
        description: entry,
        methodologies: this.extractMethodologies(entry),
        findings: [],
        presentations: [],
        funding: ''
      })
    }
    
    return research
  }

  private parsePatents(lines: string[]): Patent[] {
    const patents: Patent[] = []
    const patentsSection = this.extractSection(lines, ['Patents', 'Intellectual Property'])
    
    for (const entry of patentsSection) {
      patents.push({
        title: entry.split('\n')[0],
        number: '',
        date: '',
        inventors: [],
        description: entry,
        status: 'Pending'
      })
    }
    
    return patents
  }

  private parseCertifications(lines: string[]): Certification[] {
    const certifications: Certification[] = []
    const certSection = this.extractSection(lines, ['Certifications', 'Certificates', 'Licenses'])
    
    for (const entry of certSection) {
      certifications.push({
        name: entry.split('\n')[0],
        issuer: '',
        date: '',
        expiry: '',
        credentialId: ''
      })
    }
    
    return certifications
  }

  private parseConferences(lines: string[]): Conference[] {
    const conferences: Conference[] = []
    const conferenceSection = this.extractSection(lines, ['Conferences', 'Presentations', 'Talks'])
    
    for (const entry of conferenceSection) {
      conferences.push({
        name: entry.split('\n')[0],
        location: '',
        date: '',
        presentation: entry,
        type: 'Oral'
      })
    }
    
    return conferences
  }

  private parseGrants(lines: string[]): Grant[] {
    const grants: Grant[] = []
    const grantSection = this.extractSection(lines, ['Grants', 'Funding', 'Awards'])
    
    for (const entry of grantSection) {
      grants.push({
        name: entry.split('\n')[0],
        agency: '',
        amount: '',
        duration: '',
        role: 'Researcher',
        status: 'Completed'
      })
    }
    
    return grants
  }

  private parseTeaching(lines: string[]): TeachingExperience[] {
    const teaching: TeachingExperience[] = []
    const teachingSection = this.extractSection(lines, ['Teaching', 'Instruction', 'Education'])
    
    for (const entry of teachingSection) {
      teaching.push({
        course: entry.split('\n')[0],
        institution: '',
        duration: '',
        level: '',
        role: 'Instructor',
        evaluations: ''
      })
    }
    
    return teaching
  }

  // Helper methods
  private extractSection(lines: string[], sectionHeaders: string[]): string[] {
    const section: string[] = []
    let inSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (sectionHeaders.some(header => line.toLowerCase().includes(header.toLowerCase()))) {
        inSection = true
        continue
      }
      
      if (inSection) {
        if (line.match(/^[A-Z][a-z]+:|^[A-Z][A-Z\s]+$/)) {
          break
        }
        section.push(line)
      }
    }
    
    return section
  }

  private extractFieldOfStudy(text: string): string {
    const fields = [
      'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
      'Engineering', 'Biochemistry', 'Molecular Biology', 'Neuroscience',
      'Materials Science', 'Environmental Science', 'Data Science'
    ]
    
    for (const field of fields) {
      if (text.toLowerCase().includes(field.toLowerCase())) {
        return field
      }
    }
    
    return ''
  }

  private extractThesis(text: string): string {
    const thesisMatch = text.match(/Thesis[:\s]*([^.]+)/i)
    return thesisMatch ? thesisMatch[1] : ''
  }

  private extractCoursework(text: string): string[] {
    const courseworkMatch = text.match(/Coursework[:\s]*([^.]+)/i)
    return courseworkMatch ? courseworkMatch[1].split(',').map(c => c.trim()) : []
  }

  private extractHonors(text: string): string[] {
    const honors = []
    if (text.toLowerCase().includes('cum laude')) honors.push('Cum Laude')
    if (text.toLowerCase().includes('magna cum laude')) honors.push('Magna Cum Laude')
    if (text.toLowerCase().includes('summa cum laude')) honors.push('Summa Cum Laude')
    if (text.toLowerCase().includes('dean\'s list')) honors.push('Dean\'s List')
    return honors
  }

  private hasResearchComponent(text: string): boolean {
    return text.toLowerCase().includes('thesis') || 
           text.toLowerCase().includes('research') || 
           text.toLowerCase().includes('dissertation')
  }

  private extractResponsibilities(text: string): string[] {
    const responsibilities = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.match(/^[-•*]\s+/) || line.match(/^\d+\.\s+/)) {
        responsibilities.push(line.replace(/^[-•*\d.\s]+/, '').trim())
      }
    }
    
    return responsibilities
  }

  private extractAchievements(text: string): string[] {
    const achievements = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.toLowerCase().includes('achieved') || 
          line.toLowerCase().includes('improved') || 
          line.toLowerCase().includes('developed') ||
          line.toLowerCase().includes('published')) {
        achievements.push(line.trim())
      }
    }
    
    return achievements
  }

  private extractTechniques(text: string): string[] {
    const techniques = []
    
    for (const technique of this.laboratoryEquipment) {
      if (text.toLowerCase().includes(technique.toLowerCase())) {
        techniques.push(technique)
      }
    }
    
    return techniques
  }

  private extractEquipment(text: string): string[] {
    const equipment = []
    
    for (const eq of this.laboratoryEquipment) {
      if (text.toLowerCase().includes(eq.toLowerCase())) {
        equipment.push(eq)
      }
    }
    
    return equipment
  }

  private extractSoftware(text: string): string[] {
    const software = []
    
    for (const sw of this.researchSoftware) {
      if (text.toLowerCase().includes(sw.toLowerCase())) {
        software.push(sw)
      }
    }
    
    return software
  }

  private extractPublicationsFromExperience(text: string): string[] {
    const publications = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.toLowerCase().includes('published') || 
          line.toLowerCase().includes('paper') || 
          line.toLowerCase().includes('journal')) {
        publications.push(line.trim())
      }
    }
    
    return publications
  }

  private assessSkillLevel(text: string, skill: string): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const lowerText = text.toLowerCase()
    const skillLower = skill.toLowerCase()
    
    if (lowerText.includes(`${skillLower} expert`) || lowerText.includes(`expert ${skillLower}`)) {
      return 'Expert'
    } else if (lowerText.includes(`${skillLower} advanced`) || lowerText.includes(`advanced ${skillLower}`)) {
      return 'Advanced'
    } else if (lowerText.includes(`${skillLower} intermediate`) || lowerText.includes(`intermediate ${skillLower}`)) {
      return 'Intermediate'
    } else {
      return 'Beginner'
    }
  }

  private extractExperience(text: string, skill: string): string {
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.toLowerCase().includes(skill.toLowerCase())) {
        return line.trim()
      }
    }
    
    return ''
  }

  private extractEquipmentForTechnique(text: string, technique: string): string[] {
    const equipment = []
    
    if (technique.toLowerCase().includes('spectroscopy')) {
      equipment.push('Spectrometer', 'Sample Holder', 'Detector')
    } else if (technique.toLowerCase().includes('microscopy')) {
      equipment.push('Microscope', 'Slides', 'Cover Slips')
    }
    
    return equipment
  }

  private extractMethodologies(text: string): string[] {
    const methodologies = []
    
    if (text.toLowerCase().includes('experimental')) methodologies.push('Experimental')
    if (text.toLowerCase().includes('theoretical')) methodologies.push('Theoretical')
    if (text.toLowerCase().includes('computational')) methodologies.push('Computational')
    if (text.toLowerCase().includes('statistical')) methodologies.push('Statistical')
    
    return methodologies
  }

  private calculateScienceScores(
    education: ScienceEducation[],
    experience: ScienceExperience[],
    skills: ScienceSkills,
    publications: Publication[],
    research: ResearchExperience[],
    scienceStream: ScienceStream | null
  ): { overallScore: number; marketReadiness: 'Low' | 'Medium' | 'High' } {
    let score = 0
    
    // Education score (30%)
    const educationScore = this.calculateEducationScore(education, scienceStream)
    score += educationScore * 0.3
    
    // Experience score (25%)
    const experienceScore = this.calculateExperienceScore(experience, scienceStream)
    score += experienceScore * 0.25
    
    // Skills score (25%)
    const skillsScore = this.calculateSkillsScore(skills, scienceStream)
    score += skillsScore * 0.25
    
    // Publications score (15%)
    const publicationsScore = this.calculatePublicationsScore(publications, scienceStream)
    score += publicationsScore * 0.15
    
    // Research score (5%)
    const researchScore = this.calculateResearchScore(research, scienceStream)
    score += researchScore * 0.05
    
    const overallScore = Math.round(score)
    
    let marketReadiness: 'Low' | 'Medium' | 'High' = 'Low'
    if (overallScore >= 80) marketReadiness = 'High'
    else if (overallScore >= 60) marketReadiness = 'Medium'
    
    return { overallScore, marketReadiness }
  }

  private calculateEducationScore(education: ScienceEducation[], scienceStream: ScienceStream | null): number {
    let score = 0
    
    for (const edu of education) {
      if (edu.degree.toLowerCase().includes('phd')) score += 40
      else if (edu.degree.toLowerCase().includes('master')) score += 30
      else if (edu.degree.toLowerCase().includes('bachelor')) score += 20
      
      if (edu.researchComponent) score += 10
      if (edu.gpa && parseFloat(edu.gpa) >= 3.5) score += 5
    }
    
    return Math.min(score, 100)
  }

  private calculateExperienceScore(experience: ScienceExperience[], scienceStream: ScienceStream | null): number {
    let score = 0
    
    for (const exp of experience) {
      const years = this.calculateYears(exp.startDate, exp.endDate)
      score += Math.min(years * 10, 50)
      
      if (exp.techniques.length > 0) score += 10
      if (exp.publications.length > 0) score += 10
    }
    
    return Math.min(score, 100)
  }

  private calculateSkillsScore(skills: ScienceSkills, scienceStream: ScienceStream | null): number {
    let score = 0
    
    score += Math.min(skills.technical.length * 5, 30)
    score += Math.min(skills.laboratory.length * 5, 30)
    score += Math.min(skills.research.length * 5, 20)
    score += Math.min(skills.software.length * 5, 20)
    
    return Math.min(score, 100)
  }

  private calculatePublicationsScore(publications: Publication[], scienceStream: ScienceStream | null): number {
    let score = 0
    
    for (const pub of publications) {
      if (pub.type === 'Journal Article') score += 20
      else if (pub.type === 'Conference Paper') score += 10
      else if (pub.type === 'Review') score += 30
      
      if (pub.impact > 5) score += 10
    }
    
    return Math.min(score, 100)
  }

  private calculateResearchScore(research: ResearchExperience[], scienceStream: ScienceStream | null): number {
    let score = 0
    
    for (const res of research) {
      score += 20
      if (res.funding) score += 10
      if (res.presentations.length > 0) score += 10
    }
    
    return Math.min(score, 100)
  }

  private calculateYears(startDate: string, endDate: string): number {
    // Simple year calculation - would need more sophisticated parsing
    const start = parseInt(startDate) || 0
    const end = parseInt(endDate) || new Date().getFullYear()
    return Math.max(0, end - start)
  }

  private generateRecommendations(
    education: ScienceEducation[],
    experience: ScienceExperience[],
    skills: ScienceSkills,
    publications: Publication[],
    scienceStream: ScienceStream | null
  ): string[] {
    const recommendations: string[] = []
    
    if (education.length === 0) {
      recommendations.push('Consider pursuing formal education in your chosen science field')
    }
    
    if (experience.length === 0) {
      recommendations.push('Gain practical research experience through internships or volunteer positions')
    }
    
    if (skills.technical.length < 5) {
      recommendations.push('Develop more technical skills specific to your field')
    }
    
    if (publications.length === 0) {
      recommendations.push('Aim to publish your research in peer-reviewed journals')
    }
    
    if (scienceStream) {
      recommendations.push(`Focus on developing skills in ${scienceStream.coreDisciplines.slice(0, 3).join(', ')}`)
    }
    
    return recommendations
  }
}
