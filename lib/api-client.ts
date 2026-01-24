/**
 * Enhanced API Client with Server Failover
 * Automatically switches between servers for maximum uptime
 */

import { serverManager, apiCall } from './server-config'
import { ENV_CONFIG, getApiUrl, handleApiError } from './env-config'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  serverId?: string
  responseTime?: number
}

export interface ApiOptions extends RequestInit {
  timeout?: number
  retries?: number
  useFallback?: boolean
}

/**
 * Enhanced API client with automatic failover
 */
export class ApiClient {
  private static instance: ApiClient

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  /**
   * Make API request with automatic failover
   */
  async request<T = any>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    const {
      timeout = ENV_CONFIG.TIMEOUTS.API_REQUEST,
      retries = 3,
      useFallback = true,
      ...fetchOptions
    } = options

    try {
      const response = await apiCall(endpoint, {
        ...fetchOptions,
        signal: AbortSignal.timeout(timeout)
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        message: data.message,
        serverId: response.headers.get('X-Server-ID') || undefined,
        responseTime
      }

    } catch (error: any) {
      const responseTime = Date.now() - startTime
      
      if (useFallback && retries > 0) {
        console.warn(`API request failed, retrying... (${retries} attempts left)`)
        return this.request<T>(endpoint, { ...options, retries: retries - 1 })
      }

      return {
        success: false,
        error: handleApiError(error),
        responseTime
      }
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Upload file
   */
  async upload<T = any>(endpoint: string, file: File, options?: ApiOptions): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...options?.headers
      }
    })
  }

  /**
   * Get server status
   */
  async getServerStatus() {
    const response = await this.get('/api/health')
    return response
  }

  /**
   * Health check with fallback
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/api/health', { 
        timeout: 5000,
        retries: 1,
        useFallback: true
      })
      return response.success
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance()

/**
 * Convenience methods for specific API endpoints
 */
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/api/auth/signin', credentials),
    register: (userData: { name: string; email: string; password: string }) =>
      apiClient.post('/api/auth/register', userData),
    logout: () =>
      apiClient.post('/api/auth/signout'),
    session: () =>
      apiClient.get('/api/auth/session'),
    verifyEmail: (data: { email: string; token: string }) =>
      apiClient.post('/api/auth/verify-email', data)
  },

  // User profile
  user: {
    profile: () =>
      apiClient.get('/api/user/profile'),
    updateProfile: (data: any) =>
      apiClient.put('/api/user/profile', data),
    assessment: (data?: any) =>
      data ? apiClient.post('/api/user/assessment', data) : apiClient.get('/api/user/assessment'),
    resumeScans: () =>
      apiClient.get('/api/user/resume-scans'),
    saveResumeScan: (data: any) =>
      apiClient.post('/api/user/resume-scans', data),
    resumeText: (data?: any) =>
      data ? apiClient.post('/api/user/resume-text', data) : apiClient.get('/api/user/resume-text'),
    userData: () =>
      apiClient.get('/api/user/data')
  },

  // Admin
  admin: {
    users: () =>
      apiClient.get('/api/admin/users')
  },

  // Tools
  tools: {
    extractJD: (url: string) =>
      apiClient.post('/api/jd/extract', { url }),
    analyzeResume: (data: { resume: string; jobDescription: string }) =>
      apiClient.post('/api/resume/analyze', data)
  },

  // Health and testing
  health: {
    check: () =>
      apiClient.get('/api/health'),
    deepCheck: () =>
      apiClient.post('/api/health', { action: 'deep-check' }),
    status: () =>
      apiClient.get('/api/test/auth-status'),
    testUsers: () =>
      apiClient.get('/api/test/users'),
    connection: () =>
      apiClient.get('/api/test/connection')
  },

  // Server management
  server: {
    status: () => serverManager.getServerStatus(),
    currentServer: () => serverManager.getCurrentServer(),
    switchServer: () => serverManager.switchToHealthyServer()
  }
}

/**
 * React hook for API calls
 */
export function useApi() {
  return {
    api,
    apiClient,
    serverManager,
    ENV_CONFIG,
    getApiUrl,
    handleApiError
  }
}

export default api
