'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('tripsync_user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt)
        })
      } catch {
        localStorage.removeItem('tripsync_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo, accept any valid email format
    if (email && password.length >= 6) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        createdAt: new Date()
      }
      setUser(newUser)
      localStorage.setItem('tripsync_user', JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        createdAt: new Date()
      }
      setUser(newUser)
      localStorage.setItem('tripsync_user', JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tripsync_user')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
