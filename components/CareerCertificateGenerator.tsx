'use client'

import { useState } from 'react'
import { Download, Award, Calendar, User, CheckCircle } from 'lucide-react'
import { brandConfig } from '@/config/brand'
import jsPDF from 'jspdf'

interface CertificateData {
  userName: string
  courseName: string
  completionDate: string
  score: number
  instructorName: string
  skills: string[]
}

export default function CareerCertificateGenerator({ data }: { data: CertificateData }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCertificate = async () => {
    setIsGenerating(true)
    
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Set colors from brand config
      const primaryColor = brandConfig.colors.primary
      const secondaryColor = brandConfig.colors.secondary

      // Background gradient effect (simplified)
      pdf.setFillColor(245, 245, 250)
      pdf.rect(0, 0, 297, 210, 'F')

      // Border
      pdf.setDrawColor(primaryColor)
      pdf.setLineWidth(2)
      pdf.rect(10, 10, 277, 190)

      // Inner border
      pdf.setDrawColor(secondaryColor)
      pdf.setLineWidth(1)
      pdf.rect(15, 15, 267, 180)

      // Header with brand colors
      pdf.setFillColor(primaryColor)
      pdf.rect(15, 15, 267, 30, 'F')
      
      // Brand name
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text(brandConfig.name, 148.5, 35, { align: 'center' })

      // Certificate title
      pdf.setFillColor(secondaryColor)
      pdf.rect(15, 50, 267, 20, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(18)
      pdf.text('CAREER READINESS CERTIFICATE', 148.5, 64, { align: 'center' })

      // Main content area
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      
      // Certificate text
      pdf.text('This is to certify that', 148.5, 90, { align: 'center' })
      
      // User name
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.userName, 148.5, 105, { align: 'center' })
      
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      pdf.text('has successfully completed the', 148.5, 120, { align: 'center' })
      
      // Course name
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.courseName, 148.5, 135, { align: 'center' })
      
      // Score
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`with a score of ${data.score}%`, 148.5, 150, { align: 'center' })

      // Skills section
      pdf.setFontSize(12)
      pdf.text('Key Skills Demonstrated:', 30, 165)
      
      pdf.setFontSize(10)
      data.skills.forEach((skill, index) => {
        const x = 30 + (index % 3) * 90
        const y = 172 + Math.floor(index / 3) * 8
        pdf.text(`• ${skill}`, x, y)
      })

      // Date section
      pdf.setFontSize(12)
      pdf.text(`Completed on: ${data.completionDate}`, 30, 190)

      // Instructor signature
      pdf.text('_________________________', 200, 190)
      pdf.text(data.instructorName, 200, 195, { align: 'center' })
      pdf.setFontSize(10)
      pdf.text('Career Advisor', 200, 200, { align: 'center' })

      // Add QR Code placeholder (simplified)
      pdf.setDrawColor(0, 0, 0)
      pdf.rect(250, 160, 30, 30)
      pdf.setFontSize(8)
      pdf.text('Scan for', 265, 175, { align: 'center' })
      pdf.text('verification', 265, 185, { align: 'center' })

      // Footer with brand info
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`${brandConfig.name} - ${brandConfig.tagline}`, 148.5, 205, { align: 'center' })

      // Download the PDF
      pdf.save(`${data.userName.replace(/\s+/g, '_')}_Career_Certificate.pdf`)
      
    } catch (error) {
      console.error('Error generating certificate:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Career Certificate</h3>
        </div>
        <button
          onClick={generateCertificate}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
        </button>
      </div>

      {/* Certificate Preview */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{brandConfig.name}</span>
          </div>
          
          <div className="text-yellow-400 font-bold text-lg">CAREER READINESS CERTIFICATE</div>
          
          <div className="text-white">
            <p className="text-sm text-gray-400">This is to certify that</p>
            <p className="text-lg font-semibold">{data.userName}</p>
            <p className="text-sm text-gray-400 mt-2">has successfully completed</p>
            <p className="text-md font-medium">{data.courseName}</p>
            <p className="text-sm text-blue-400 mt-1">Score: {data.score}%</p>
          </div>

          <div className="text-left text-sm text-gray-300">
            <p className="font-medium text-white">Skills Demonstrated:</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-4">
            <span>Date: {data.completionDate}</span>
            <span>Certified by: {data.instructorName}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>Branded Design</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>QR Verification</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>Professional Format</span>
        </div>
      </div>
    </div>
  )
}
