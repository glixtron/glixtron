import { NextRequest, NextResponse } from 'next/server'

// Mock user profile data
let userProfile = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  title: 'Senior Software Engineer',
  experience: '8 years',
  education: 'B.S. Computer Science',
  bio: 'Passionate software engineer with expertise in full-stack development and cloud architecture.',
  profilePicture: null,
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
  ],
  skills: [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'AWS', level: 70 }
  ],
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketingEmails: false
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      data: userProfile,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update profile data
    userProfile = {
      ...userProfile,
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: userProfile,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('picture') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large' },
        { status: 400 }
      )
    }

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In a real app, you would upload to cloud storage and get URL
    // For now, we'll simulate a successful upload
    const mockImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.id}&backgroundColor=3b82f6`
    
    userProfile.profilePicture = mockImageUrl
    userProfile.pictureUpdatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      data: {
        profilePicture: mockImageUrl,
        message: 'Profile picture uploaded successfully'
      }
    })
  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload profile picture' },
      { status: 500 }
    )
  }
}
