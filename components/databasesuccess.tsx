'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function DatabaseSuccess() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userCount, setUserCount] = useState<number | null>(null)

  useEffect(() => {
    const checkDatabaseSuccess = async () => {
      try {
        const mongodbUri = process.env.MONGODB_URI
        
        if (!mongodbUri) {
          setStatus('error')
          setMessage('Missing MongoDB environment variable')
          return
        }

        // Test MongoDB connection by checking user count
        const response = await fetch('/api/health')
        const data = await response.json()
        
        if (data.database?.status === 'connected') {
          setStatus('success')
          setMessage('MongoDB Atlas connection successful!')
          setUserCount(data.database?.userCount || 0)
        } else {
          setStatus('error')
          setMessage('MongoDB connection failed')
        }
        
      } catch (error: any) {
        setStatus('error')
        setMessage(`Database error: ${error.message}`)
      }
    }

    checkDatabaseSuccess()
  }, [])

  if (status === 'loading') {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-blue-700">Checking database funnel...</span>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Funnel Success!</h4>
            <p className="text-green-700 text-sm mt-1">{message}</p>
            {userCount !== null && (
              <div className="mt-2 text-xs text-green-600">
                Total users in database: {userCount}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-red-800">Funnel Issue</h4>
          <p className="text-red-700 text-sm mt-1">{message}</p>
          <div className="mt-2 text-xs text-red-600">
            <strong>Troubleshooting:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Check MongoDB Atlas connection string</li>
              <li>Ensure MONGODB_URI is set in Vercel</li>
              <li>Verify MongoDB user permissions</li>
              <li>Check Vercel logs for errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
