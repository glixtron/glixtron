'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { brandConfig } from '@/config/brand'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onAnalysisComplete: (result: any) => void
  onError: (error: string) => void
  isAnalyzing?: boolean
  acceptedFormats?: string[]
  maxFileSize?: number
}

export default function FileUpload({
  onFileSelect,
  onAnalysisComplete,
  onError,
  isAnalyzing = false,
  acceptedFormats = brandConfig.features.supportedFormats,
  maxFileSize = brandConfig.features.maxFileSize
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  // Convert formats to MIME types
  const getAcceptedTypes = () => {
    const typeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'txt': 'text/plain'
    }
    
    const accepted: Record<string, string[]> = {}
    acceptedFormats.forEach(format => {
      const mime = typeMap[format]
      if (mime) {
        accepted[mime] = [`.${format}`]
      }
    })
    
    return accepted
  }

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragActive(false)
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        onError(`File too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`)
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        onError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`)
      } else {
        onError('File upload failed. Please try again.')
      }
      return
    }

    // Handle accepted file
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setUploadedFile(file)
      onFileSelect(file)
      
      // Auto-analyze the file
      analyzeFile(file)
    }
  }, [acceptedFormats, maxFileSize, onFileSelect, onError])

  const analyzeFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('resume', file)
      
      // Add job description if available (you can get this from state or props)
      // formData.append('jobDescription', jobDescription)
      
      const response = await fetch('/api/resume/analyze-enhanced', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.success) {
        onAnalysisComplete(result.data)
      } else {
        onError(result.error || 'Analysis failed')
      }
    } catch (error) {
      onError('Network error. Please try again.')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: getAcceptedTypes(),
    maxSize: maxFileSize,
    multiple: false,
    disabled: isAnalyzing
  })

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Area */}
      {!uploadedFile && !isAnalyzing && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${dragActive 
              ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
            }
            ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full transition-all duration-200
              ${dragActive ? 'bg-blue-500/20' : 'bg-slate-700/50'}
            `}>
              {isAnalyzing ? (
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isAnalyzing ? 'Analyzing Resume...' : 'Upload Your Resume'}
              </h3>
              <p className="text-slate-400 text-sm">
                {isAnalyzing 
                  ? 'Please wait while we analyze your document...'
                  : dragActive 
                    ? 'Drop your resume here' 
                    : 'Drag and drop your resume here, or click to browse'
                }
              </p>
            </div>
            
            {!isAnalyzing && (
              <div className="flex flex-wrap gap-2 justify-center">
                {acceptedFormats.map(format => (
                  <span
                    key={format}
                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
                  >
                    .{format.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-xs text-slate-500">
              Maximum file size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>
      )}

      {/* File Preview */}
      {uploadedFile && !isAnalyzing && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{uploadedFile.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>{formatFileSize(uploadedFile.size)}</span>
                  <span>•</span>
                  <span>{uploadedFile.type || 'Unknown type'}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={removeFile}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">File uploaded successfully</span>
          </div>
        </div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">Analyzing Resume</h4>
              <p className="text-sm text-slate-400">
                Extracting text and running AI analysis...
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
