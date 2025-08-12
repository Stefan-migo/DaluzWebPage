'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState } from '@/hooks/useAuth'
import { Tables } from '@/types/database'

type Profile = Tables<'profiles'>

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData?: {
    first_name?: string
    last_name?: string
  }) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>
  resetPassword: (email: string) => Promise<{ error: any }>
  refetchProfile: () => Promise<Profile | null> | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}

// Convenient hook for checking if user is authenticated
export function useRequireAuth() {
  const { user, loading } = useAuthContext()
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
    isLoading: loading
  }
}

// Hook for getting user profile with type safety
export function useProfile() {
  const { profile, user, loading } = useAuthContext()
  
  return {
    profile,
    user,
    loading,
    hasProfile: !!profile,
    isProfileLoading: loading && !!user
  }
} 