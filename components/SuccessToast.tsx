'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info, TrendingUp } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  timestamp: number
}

interface SuccessToastProps {
  className?: string
}

export default function SuccessToast({ className = '' }: SuccessToastProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id' | 'timestamp'>) => {
    const newToast: Toast = {
      ...toast,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Auto-remove expired toasts
  useEffect(() => {
    const interval = setInterval(() => {
      setToasts(prev => prev.filter(toast => 
        Date.now() - toast.timestamp < (toast.duration || 5000)
      ))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <X className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-80 p-4 rounded-lg shadow-lg border ${getToastStyles(toast.type)} backdrop-blur-sm transform transition-all duration-300 ease-in-out hover:scale-105`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  {toast.title}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-4 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-200 mt-1">
                {toast.message}
              </p>
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="mt-2 px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors text-xs font-medium"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Export hook for easy usage
export const useSuccessToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showSuccess = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'success',
      title,
      message,
      duration: options?.duration || 5000,
      timestamp: Date.now(),
      ...options
    }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, newToast.duration || 5000)
  }

  const showError = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'error',
      title,
      message,
      duration: options?.duration || 7000,
      timestamp: Date.now(),
      ...options
    }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, newToast.duration || 7000)
  }

  const showInfo = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'info',
      title,
      message,
      duration: options?.duration || 4000,
      timestamp: Date.now(),
      ...options
    }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, newToast.duration || 4000)
  }

  const showWarning = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'warning',
      title,
      message,
      duration: options?.duration || 6000,
      timestamp: Date.now(),
      ...options
    }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id))
    }, newToast.duration || 6000)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toasts,
    removeToast
  }
}

// Global toast function for easy access
export const toast = {
  success: (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const toastComponent = document.getElementById('success-toast')
    if (toastComponent) {
      const event = new CustomEvent('showToast', {
        detail: { type: 'success', title, message, ...options }
      })
      toastComponent.dispatchEvent(event)
    }
  },
  error: (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const toastComponent = document.getElementById('success-toast')
    if (toastComponent) {
      const event = new CustomEvent('showToast', {
        detail: { type: 'error', title, message, ...options }
      })
      toastComponent.dispatchEvent(event)
    }
  },
  info: (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const toastComponent = document.getElementById('success-toast')
    if (toastComponent) {
      const event = new CustomEvent('showToast', {
        detail: { type: 'info', title, message, ...options }
      })
      toastComponent.dispatchEvent(event)
    }
  },
  warning: (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'timestamp'>>) => {
    const toastComponent = document.getElementById('success-toast')
    if (toastComponent) {
      const event = new CustomEvent('showToast', {
        detail: { type: 'warning', title, message, ...options }
      })
      toastComponent.dispatchEvent(event)
    }
  }
}
