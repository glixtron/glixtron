'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface SafetyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error) => void
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends React.Component<SafetyWrapperProps, ErrorBoundaryState> {
  constructor(props: SafetyWrapperProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SafetyWrapper caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className={`flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-xl ${this.props.className || ''}`}>
          <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
          <p className="text-gray-400 text-center mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while loading this component.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Icon Safety Wrapper - Prevents crashes from undefined icons
interface SafeIconProps {
  icon: React.ComponentType<any> | undefined | null
  fallback?: React.ComponentType<any>
  className?: string
  size?: number | string
  color?: string
}

export function SafeIcon({ 
  icon: Icon, 
  fallback: FallbackIcon = AlertTriangle, 
  className = '', 
  size = 20, 
  color = 'currentColor' 
}: SafeIconProps) {
  try {
    if (!Icon) {
      const Fallback = FallbackIcon
      return <Fallback className={className} size={size} color={color} />
    }
    
    return <Icon className={className} size={size} color={color} />
  } catch (error) {
    console.warn('SafeIcon caught an error:', error)
    const Fallback = FallbackIcon
    return <Fallback className={className} size={size} color={color} />
  }
}

// Safe Component Wrapper - Prevents crashes from component errors
interface SafeComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function SafeComponent({ children, fallback, className = '' }: SafeComponentProps) {
  return (
    <ErrorBoundary fallback={fallback} className={className}>
      {children}
    </ErrorBoundary>
  )
}

// Hook for safe async operations
export function useSafeAsync<T>() {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const execute = React.useCallback(async (asyncFn: () => Promise<T>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFn()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = React.useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, execute, reset }
}

export default ErrorBoundary
