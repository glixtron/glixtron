'use client'

import { createClient } from '@supabase/supabase-js'
import { ENV_CONFIG } from '@/lib/env-config'

// Create Supabase client
const supabase = createClient(
  ENV_CONFIG.SUPABASE_URL!,
  ENV_CONFIG.SUPABASE_ANON_KEY!
)

export const handleSupabaseRegister = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        },
      },
    })

    if (error) {
      console.error("Registration Error:", error.message)
      return { success: false, message: error.message }
    }

    // Because "Confirm Email" is OFF, the user is logged in immediately
    return { success: true, user: data.user }
  } catch (error: any) {
    console.error("Registration Exception:", error)
    return { success: false, message: error.message || 'Registration failed' }
  }
}

export const handleSupabaseLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login Error:", error.message)
      return { success: false, message: error.message }
    }

    return { success: true, user: data.user }
  } catch (error: any) {
    console.error("Login Exception:", error)
    return { success: false, message: error.message || 'Login failed' }
  }
}

export const handleSupabaseLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error("Logout Error:", error.message)
      return { success: false, message: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Logout Exception:", error)
    return { success: false, message: error.message || 'Logout failed' }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error("Get User Error:", error.message)
      return null
    }

    return user
  } catch (error: any) {
    console.error("Get User Exception:", error)
    return null
  }
}

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}
