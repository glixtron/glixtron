// API Service for Dashboard functionality
import { brandConfig } from '@/lib/brand-config'

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Dashboard API calls
  async getDashboardStats() {
    return this.request('/dashboard/stats')
  }

  async getRecentActivity() {
    return this.request('/dashboard/activity')
  }

  async getQuickActions() {
    return this.request('/dashboard/actions')
  }

  // Assessment API calls
  async startAssessment(type: 'full' | 'quick') {
    return this.request('/assessment/start', {
      method: 'POST',
      body: JSON.stringify({ type }),
    })
  }

  async submitAssessmentStep(step: number, data: any) {
    return this.request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ step, data }),
    })
  }

  async getAssessmentResults(assessmentId: string) {
    return this.request(`/assessment/results/${assessmentId}`)
  }

  // Resume Scanner API calls
  async uploadResume(file: File) {
    const formData = new FormData()
    formData.append('resume', file)

    return this.request('/resume/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  async scanResume(resumeId: string) {
    return this.request('/resume/scan', {
      method: 'POST',
      body: JSON.stringify({ resumeId }),
    })
  }

  async getResumeScanResults(scanId: string) {
    return this.request(`/resume/results/${scanId}`)
  }

  // Profile API calls
  async getUserProfile() {
    return this.request('/profile')
  }

  async updateProfile(data: any) {
    return this.request('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async uploadProfilePicture(file: File) {
    const formData = new FormData()
    formData.append('picture', file)

    return this.request('/profile/picture', {
      method: 'POST',
      headers: {},
      body: formData,
    })
  }

  // Settings API calls
  async getSettings() {
    return this.request('/settings')
  }

  async updateSettings(data: any) {
    return this.request('/settings/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async exportUserData() {
    return this.request('/settings/export')
  }

  // Career Guidance API calls
  async getCareerRecommendations() {
    return this.request('/career-guidance/recommendations')
  }

  async getSkillAnalysis() {
    return this.request('/career-guidance/skills')
  }

  async getMarketInsights() {
    return this.request('/career-guidance/market')
  }

  // Notifications API calls
  async getNotifications() {
    return this.request('/notifications')
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    })
  }

  // Utility methods
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiService = new ApiService()

// Mock data for development
export const mockData = {
  dashboardStats: {
    careerScore: 87,
    completedAssessments: 12,
    jobMatches: 48,
    skillPoints: 1234,
    trends: {
      careerScore: { value: '5% from last month', isPositive: true },
      completedAssessments: { value: '2 this week', isPositive: true },
      jobMatches: { value: '12 new matches', isPositive: true },
      skillPoints: { value: '150 earned', isPositive: true },
    }
  },
  
  recentActivity: [
    {
      id: 1,
      type: 'assessment',
      title: 'Completed Technical Skills Assessment',
      description: 'Achieved 92% score',
      timestamp: '2 hours ago',
      icon: 'Award',
      color: 'success'
    },
    {
      id: 2,
      type: 'resume',
      title: 'Resume scan completed',
      description: '92% ATS compatibility score',
      timestamp: '1 day ago',
      icon: 'Briefcase',
      color: 'primary'
    },
    {
      id: 3,
      type: 'career',
      title: 'Career path updated',
      description: 'Software Engineering track selected',
      timestamp: '3 days ago',
      icon: 'TrendingUp',
      color: 'warning'
    }
  ],

  assessmentSteps: [
    { id: 1, title: 'Personal Information', description: 'Tell us about yourself', completed: true },
    { id: 2, title: 'Skills & Experience', description: 'Your professional background', completed: true },
    { id: 3, title: 'Career Preferences', description: 'What you&apos;re looking for', completed: false },
    { id: 4, title: 'Personality Assessment', description: 'Your work style', completed: false },
    { id: 5, title: 'Results & Recommendations', description: 'Your personalized report', completed: false }
  ],

  resumeScanResults: {
    score: 87,
    atsScore: 92,
    sections: {
      contact: 95,
      experience: 88,
      education: 90,
      skills: 82
    },
    suggestions: [
      "Add more quantifiable achievements",
      "Include keywords for your target role",
      "Improve formatting for better ATS readability"
    ],
    keywords: ["Project Management", "Team Leadership", "Data Analysis"]
  },

  userProfile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    experience: '8 years',
    education: 'B.S. Computer Science',
    bio: 'Passionate software engineer with expertise in full-stack development and cloud architecture.',
    stats: {
      assessmentsCompleted: 12,
      resumeScans: 8,
      careerScore: 87,
      memberSince: '2024'
    },
    achievements: [
      { id: 1, title: 'Assessment Master', description: 'Completed 10+ career assessments', icon: 'Award', color: 'success' },
      { id: 2, title: 'Resume Expert', description: 'Achieved 90%+ ATS score', icon: 'Target', color: 'primary' },
      { id: 3, title: 'Continuous Learner', description: 'Active for 30+ days', icon: 'GraduationCap', color: 'warning' }
    ]
  },

  notifications: [
    {
      id: 1,
      title: 'Your assessment is ready',
      description: 'View your personalized career recommendations',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'New career path recommendations',
      description: 'Based on your recent assessment results',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Resume optimization tips',
      description: 'Improve your resume for better results',
      timestamp: '3 hours ago',
      read: true
    }
  ]
}
