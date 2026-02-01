// Dynamic import for client-side compatibility
let jsPDF: any = null;

const loadJsPDF = async () => {
  if (!jsPDF) {
    const pdfModule = await import('jspdf');
    jsPDF = pdfModule.default;
  }
  return jsPDF;
};

import { brandConfig } from '@/config/brand'

interface ResumeAnalysisData {
  overallScore: number
  atsScore: number
  contentScore: number
  structureScore: number
  interviewLikelihood: number
  criticalIssues: string[]
  improvements: string[]
  missingKeywords: string[]
  recommendations: string[]
  fileName: string
  processedAt: string
}

export class ResumeReportGenerator {
  private doc: any = null
  private brandColors = brandConfig.colors

  constructor() {
    // Will be initialized when needed
  }

  private async initializeDoc() {
    if (!this.doc) {
      const JsPDF = await loadJsPDF();
      this.doc = new JsPDF();
    }
    return this.doc;
  }

  async generateReport(data: ResumeAnalysisData): Promise<void> {
    await this.initializeDoc();
    
    // Set up document
    this.doc.setFillColor(15, 23, 42) // Dark background
    this.doc.rect(0, 0, 210, 297, 'F')

    // Add header with branding
    this.addHeader()

    // Add overall score section
    this.addScoreSection(data)

    // Add detailed analysis
    this.addDetailedAnalysis(data)

    // Add recommendations
    this.addRecommendations(data)

    // Add footer
    this.addFooter()
  }

  private addHeader(): void {
    // Brand logo/icon
    this.doc.setTextColor(this.brandColors.primary)
    this.doc.setFontSize(24)
    this.doc.text(brandConfig.name, 20, 30)

    // Title
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(20)
    this.doc.text('Career Readiness Report', 40, 30)

    // Subtitle
    this.doc.setFontSize(12)
    this.doc.setTextColor(148, 163, 184)
    this.doc.text('AI-Powered Resume Analysis', 40, 40)

    // Date
    this.doc.setFontSize(10)
    this.doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55)
  }

  private addScoreSection(data: ResumeAnalysisData): void {
    let yPosition = 80

    // Overall Score
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(16)
    this.doc.text('Overall Assessment', 20, yPosition)
    yPosition += 15

    // Score circles
    const scores = [
      { label: 'Overall', score: data.overallScore, color: this.brandColors.primary },
      { label: 'ATS', score: data.atsScore, color: this.brandColors.accent },
      { label: 'Content', score: data.contentScore, color: this.brandColors.secondary },
      { label: 'Structure', score: data.structureScore, color: this.brandColors.accent }
    ]

    scores.forEach((scoreData, index) => {
      const x = 30 + (index * 45)
      const y = yPosition

      // Draw circle
      this.doc.setDrawColor(scoreData.color)
      this.doc.setLineWidth(2)
      this.doc.circle(x, y, 15)

      // Add score
      this.doc.setTextColor(255, 255, 255)
      this.doc.setFontSize(12)
      this.doc.text(`${scoreData.score}/10`, x - 8, y + 5)

      // Add label
      this.doc.setFontSize(8)
      this.doc.setTextColor(148, 163, 184)
      this.doc.text(scoreData.label, x - 12, y + 25)
    })

    yPosition += 50

    // Interview likelihood
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(12)
    this.doc.text(`Interview Likelihood: ${data.interviewLikelihood}%`, 20, yPosition)
    yPosition += 20
  }

  private addDetailedAnalysis(data: ResumeAnalysisData): void {
    let yPosition = 150

    // Critical Issues
    if (data.criticalIssues.length > 0) {
      this.doc.setTextColor(239, 68, 68) // Red
      this.doc.setFontSize(14)
      this.doc.text('Critical Issues to Fix', 20, yPosition)
      yPosition += 10

      data.criticalIssues.forEach((issue) => {
        this.doc.setTextColor(255, 255, 255)
        this.doc.setFontSize(10)
        const lines = this.doc.splitTextToSize(`• ${issue}`, 170)
        this.doc.text(lines, 20, yPosition)
        yPosition += lines.length * 5 + 3
      })
      yPosition += 10
    }

    // Top Improvements
    if (data.improvements.length > 0) {
      this.doc.setTextColor(59, 130, 246) // Blue
      this.doc.setFontSize(14)
      this.doc.text('Top 3 Improvements', 20, yPosition)
      yPosition += 10

      data.improvements.forEach((improvement, index) => {
        this.doc.setTextColor(255, 255, 255)
        this.doc.setFontSize(10)
        const lines = this.doc.splitTextToSize(`${index + 1}. ${improvement}`, 170)
        this.doc.text(lines, 20, yPosition)
        yPosition += lines.length * 5 + 3
      })
      yPosition += 10
    }

    // Missing Keywords
    if (data.missingKeywords.length > 0) {
      this.doc.setTextColor(245, 158, 11) // Yellow
      this.doc.setFontSize(14)
      this.doc.text('Missing Keywords for ATS', 20, yPosition)
      yPosition += 10

      const keywordText = data.missingKeywords.join(', ')
      this.doc.setTextColor(255, 255, 255)
      this.doc.setFontSize(10)
      const lines = this.doc.splitTextToSize(keywordText, 170)
      this.doc.text(lines, 20, yPosition)
      yPosition += lines.length * 5 + 10
    }
  }

  private addRecommendations(data: ResumeAnalysisData): void {
    let yPosition = 240

    this.doc.setTextColor(34, 197, 94) // Green
    this.doc.setFontSize(14)
    this.doc.text('Additional Recommendations', 20, yPosition)
    yPosition += 10

    data.recommendations.forEach((rec) => {
      this.doc.setTextColor(255, 255, 255)
      this.doc.setFontSize(10)
      const lines = this.doc.splitTextToSize(`✓ ${rec}`, 170)
      this.doc.text(lines, 20, yPosition)
      yPosition += lines.length * 5 + 3
    })
  }

  private addFooter(): void {
    const yPosition = 280

    // Brand name
    this.doc.setTextColor(148, 163, 184)
    this.doc.setFontSize(8)
    this.doc.text(`${brandConfig.name} - ${brandConfig.tagline}`, 20, yPosition)

    // Watermark
    this.doc.setTextColor(200, 200, 200)
    this.doc.setFontSize(6)
    this.doc.text(`Generated by ${brandConfig.name}`, 150, 280, { angle: 45 })

    // Page number
    this.doc.setTextColor(148, 163, 184)
    this.doc.setFontSize(8)
    this.doc.text('Page 1 of 1', 180, yPosition)
  }

  async downloadPDF(data: ResumeAnalysisData): Promise<void> {
    await this.generateReport(data)
    
    // Generate filename
    const fileName = `${brandConfig.name.toLowerCase()}-resume-analysis-${new Date().getTime()}.pdf`
    
    // Download the PDF
    this.doc.save(fileName)
  }

  async getPDFBlob(data: ResumeAnalysisData): Promise<Blob> {
    await this.generateReport(data)
    return this.doc.output('blob')
  }
}

// Hook for React components
export const useResumeReport = () => {
  const generator = new ResumeReportGenerator()

  const downloadReport = async (data: ResumeAnalysisData) => {
    await generator.downloadPDF(data)
  }

  const getPDFBlob = async (data: ResumeAnalysisData) => {
    return await generator.getPDFBlob(data)
  }

  return { downloadReport, getPDFBlob }
}
