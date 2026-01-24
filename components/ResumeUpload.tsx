'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { parseResumeFile, type ParsedResume } from '@/lib/file-parser'

interface ResumeUploadProps {
  onResumeParsed: (text: string, fileName: string) => void
  currentText?: string
}

export default function ResumeUpload({ onResumeParsed, currentText }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<ParsedResume | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')
    setIsParsing(true)

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ]

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, DOCX, or TXT file')
      setIsParsing(false)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      setIsParsing(false)
      return
    }

    try {
      const parsed = await parseResumeFile(file)
      setUploadedFile(parsed)
      onResumeParsed(parsed.text, parsed.fileName)
      setIsParsing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to parse file')
      setIsParsing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    onResumeParsed('', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
          />

          {isParsing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
              <p className="text-slate-400">Parsing resume...</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2 font-medium">
                Drop your resume here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, DOCX, DOC, and TXT files (max 10MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-white font-medium">{uploadedFile.fileName}</p>
              <p className="text-sm text-slate-400">
                {(uploadedFile.size / 1024).toFixed(1)} KB • Parsed successfully
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {uploadedFile && (
        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
          ✓ Resume parsed successfully. {uploadedFile.text.split('\n').length} lines extracted.
        </div>
      )}
    </div>
  )
}
