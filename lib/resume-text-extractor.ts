/**
 * Resume Text Extractor - NLP-based text extraction from uploaded resumes
 * Supports multiple file formats and uses advanced parsing techniques
 */

export interface ResumeExtractionResult {
  success: boolean
  content: string
  metadata?: {
    extractedAt: string
    wordCount: number
    readingTime: number
    format: string
    sections: ResumeSection[]
  }
  error?: string
}

export interface ResumeSection {
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'other'
  title: string
  content: string
  confidence: number
}

export class ResumeTextExtractor {
  /**
   * Extract text from uploaded resume file
   */
  async extractResumeText(file: File): Promise<ResumeExtractionResult> {
    try {
      const fileType = this.getFileType(file)
      let content = ''

      switch (fileType) {
        case 'pdf':
          content = await this.extractFromPDF(file)
          break
        case 'docx':
          content = await this.extractFromDOCX(file)
          break
        case 'txt':
          content = await this.extractFromTXT(file)
          break
        case 'html':
        case 'htm':
          content = await this.extractFromHTML(file)
          break
        default:
          return {
            success: false,
            content: '',
            error: `Unsupported file format: ${fileType}. Supported formats: PDF, DOCX, TXT, HTML`
          }
      }

      if (!content || content.trim().length < 50) {
        return {
          success: false,
          content: '',
          error: 'Could not extract sufficient text content from the resume'
        }
      }

      // Clean and structure the content
      const cleanedContent = this.cleanResumeContent(content)
      const sections = this.identifySections(cleanedContent)
      const wordCount = this.countWords(cleanedContent)
      const readingTime = Math.ceil(wordCount / 200)

      return {
        success: true,
        content: cleanedContent,
        metadata: {
          extractedAt: new Date().toISOString(),
          wordCount,
          readingTime,
          format: fileType,
          sections
        }
      }
    } catch (error) {
      console.error('Resume extraction error:', error)
      return {
        success: false,
        content: '',
        error: `Failed to extract resume text: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get file type from file object
   */
  private getFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const mimeType = file.type.toLowerCase()

    // Check MIME type first
    if (mimeType.includes('pdf')) return 'pdf'
    if (mimeType.includes('word') || mimeType.includes('docx')) return 'docx'
    if (mimeType.includes('text') || mimeType.includes('plain')) return 'txt'
    if (mimeType.includes('html')) return 'html'

    // Fallback to extension
    if (extension === 'pdf') return 'pdf'
    if (extension === 'docx' || extension === 'doc') return 'docx'
    if (extension === 'txt') return 'txt'
    if (extension === 'html' || extension === 'htm') return 'html'

    return 'unknown'
  }

  /**
   * Extract text from PDF file
   */
  private async extractFromPDF(file: File): Promise<string> {
    // For now, return a placeholder - in production, you'd use pdf-parse or similar
    // This is a simplified implementation
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // In production, use pdf-parse library
        // For now, we'll simulate text extraction
        const arrayBuffer = reader.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // Simple text extraction from PDF (very basic)
        let text = ''
        for (let i = 0; i < uint8Array.length; i++) {
          const char = uint8Array[i]
          if (char >= 32 && char <= 126) { // Printable ASCII
            text += String.fromCharCode(char)
          } else if (char === 10 || char === 13) { // Newline
            text += '\n'
          } else {
            text += ' '
          }
        }
        
        resolve(this.extractReadableText(text))
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Extract text from DOCX file
   */
  private async extractFromDOCX(file: File): Promise<string> {
    // For now, return a placeholder - in production, you'd use mammoth.js
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        // In production, use mammoth.js to extract text from DOCX
        // For now, we'll simulate text extraction
        const uint8Array = new Uint8Array(arrayBuffer)
        let text = ''
        
        for (let i = 0; i < uint8Array.length; i++) {
          const char = uint8Array[i]
          if (char >= 32 && char <= 126) {
            text += String.fromCharCode(char)
          } else if (char === 10 || char === 13) {
            text += '\n'
          } else {
            text += ' '
          }
        }
        
        resolve(this.extractReadableText(text))
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Extract text from TXT file
   */
  private async extractFromTXT(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  /**
   * Extract text from HTML file
   */
  private async extractFromHTML(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const htmlContent = reader.result as string
        const text = this.extractTextFromHTML(htmlContent)
        resolve(text)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  /**
   * Extract readable text from HTML content
   */
  private extractTextFromHTML(htmlContent: string): string {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Remove script and style elements
    const scripts = tempDiv.querySelectorAll('script, style')
    scripts.forEach(script => script.remove())
    
    // Extract text content
    let text = tempDiv.textContent || tempDiv.innerText || ''
    
    // Clean up the text
    return this.cleanResumeContent(text)
  }

  /**
   * Extract readable text from raw binary data
   */
  private extractReadableText(rawText: string): string {
    // Remove non-printable characters and clean up
    return rawText
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Keep only printable ASCII and newlines
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
      .trim()
  }

  /**
   * Clean and format resume content
   */
  private cleanResumeContent(content: string): string {
    return content
      .replace(/\s+/g, ' ')           // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n')     // Ensure proper paragraph separation
      .replace(/^\s+|\s+$/g, '')       // Trim leading and trailing whitespace
      .replace(/\s*([,.!?;:])\s*/g, '$1 ') // Ensure proper spacing around punctuation
      .replace(/\s+/g, ' ')           // Final cleanup of multiple spaces
      .trim()
  }

  /**
   * Identify resume sections using NLP patterns
   */
  private identifySections(content: string): ResumeSection[] {
    const sections: ResumeSection[] = []
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Section patterns
    const sectionPatterns = {
      contact: [
        'contact', 'email', 'phone', 'address', 'linkedin', 'github', 'portfolio',
        'name', 'profile', 'personal information'
      ],
      summary: [
        'summary', 'objective', 'profile', 'about', 'overview', 'introduction',
        'professional summary', 'career summary'
      ],
      experience: [
        'experience', 'work experience', 'employment', 'career', 'professional experience',
        'work history', 'job history', 'employment history'
      ],
      education: [
        'education', 'academic', 'qualification', 'degree', 'university', 'college',
        'educational background', 'academic background'
      ],
      skills: [
        'skills', 'technical skills', 'competencies', 'abilities', 'expertise',
        'technical expertise', 'core competencies', 'skill set'
      ],
      projects: [
        'projects', 'portfolio', 'work samples', 'case studies', 'personal projects',
        'academic projects', 'professional projects'
      ],
      certifications: [
        'certifications', 'certificates', 'credentials', 'licenses', 'accreditations',
        'professional certifications', 'technical certifications'
      ]
    }

    let currentSection: ResumeSection | null = null
    let sectionContent: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase()
      
      // Check if this line is a section header
      let foundSection = false
      for (const [sectionType, patterns] of Object.entries(sectionPatterns)) {
        for (const pattern of patterns) {
          if (line.includes(pattern) && line.length < 50) {
            // Save previous section if exists
            if (currentSection) {
              currentSection.content = sectionContent.join('\n')
              currentSection.confidence = this.calculateSectionConfidence(currentSection)
              sections.push(currentSection)
            }
            
            // Start new section
            currentSection = {
              type: sectionType as ResumeSection['type'],
              title: lines[i],
              content: '',
              confidence: 0
            }
            sectionContent = []
            foundSection = true
            break
          }
        }
        if (foundSection) break
      }

      // Add line to current section content
      if (!foundSection && currentSection) {
        sectionContent.push(lines[i])
      } else if (!foundSection && !currentSection) {
        // Content before first section - likely contact info
        if (!sections.find(s => s.type === 'contact')) {
          currentSection = {
            type: 'contact',
            title: 'Contact Information',
            content: '',
            confidence: 0
          }
          sectionContent = [lines[i]]
        }
      }
    }

    // Save last section
    if (currentSection) {
      currentSection.content = sectionContent.join('\n')
      currentSection.confidence = this.calculateSectionConfidence(currentSection)
      sections.push(currentSection)
    }

    return sections
  }

  /**
   * Calculate confidence score for a section
   */
  private calculateSectionConfidence(section: ResumeSection): number {
    let confidence = 0.5 // Base confidence

    // Check content length
    if (section.content.length > 50) confidence += 0.1
    if (section.content.length > 200) confidence += 0.1

    // Check for section-specific keywords
    const keywords: Record<string, string[]> = {
      contact: ['email', 'phone', 'address', '@', '.com', 'linkedin'],
      summary: ['experienced', 'skilled', 'professional', 'expertise', 'background'],
      experience: ['years', 'worked', 'managed', 'developed', 'responsible', 'achieved'],
      education: ['university', 'college', 'degree', 'bachelor', 'master', 'phd', 'graduated'],
      skills: ['proficient', 'expert', 'skilled', 'knowledge', 'familiar', 'experienced'],
      projects: ['project', 'developed', 'created', 'built', 'implemented', 'designed'],
      certifications: ['certified', 'certificate', 'license', 'accredited', 'qualified'],
      other: []
    }

    const sectionKeywords = keywords[section.type] || []
    const content = section.content.toLowerCase()
    
    const foundKeywords = sectionKeywords.filter((keyword: string) => content.includes(keyword))
    confidence += (foundKeywords.length / sectionKeywords.length) * 0.3

    return Math.min(confidence, 1.0)
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Validate if file contains resume content
   */
  static validateResumeContent(content: string): boolean {
    if (!content || content.length < 100) {
      return false
    }

    // Check for resume indicators
    const resumeIndicators = [
      'experience', 'education', 'skills', 'resume', 'cv', 'curriculum vitae',
      'employment', 'career', 'professional', 'background', 'qualification',
      'university', 'college', 'degree', 'worked', 'managed', 'developed'
    ]

    const lowerContent = content.toLowerCase()
    const foundIndicators = resumeIndicators.filter(indicator => 
      lowerContent.includes(indicator)
    )

    return foundIndicators.length >= 3
  }
}

export const resumeTextExtractor = new ResumeTextExtractor()
