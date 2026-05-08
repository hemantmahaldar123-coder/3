'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { 
  signIn as firebaseSignIn, 
  signUp as firebaseSignUp, 
  signOut as firebaseSignOut,
  subscribeToAuthState,
  hasFirebaseConfig
} from '@/lib/firebase'
import type { User as FirebaseUser } from 'firebase/auth'

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
  isFirebaseEnabled: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Convert Firebase user to our User type
function firebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || undefined,
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now())
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (hasFirebaseConfig) {
      // Use Firebase auth state listener
      const unsubscribe = subscribeToAuthState((firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUserToUser(firebaseUser))
        } else {
          setUser(null)
        }
        setIsLoading(false)
      })
      
      return () => unsubscribe()
    } else {
      // Fallback to localStorage for demo mode
      const storedUser = localStorage.getItem('wanderly_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setUser({
            ...parsed,
            createdAt: new Date(parsed.createdAt)
          })
        } catch {
          localStorage.removeItem('wanderly_user')
        }
      }
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    if (hasFirebaseConfig) {
      const { user: firebaseUser, error } = await firebaseSignIn(email, password)
      
      if (firebaseUser) {
        setUser(firebaseUserToUser(firebaseUser))
        setIsLoading(false)
        return { success: true }
      }
      
      setIsLoading(false)
      return { success: false, error: error || 'Login failed' }
    }
    
    // Demo mode fallback
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (email && password.length >= 6) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        createdAt: new Date()
      }
      setUser(newUser)
      localStorage.setItem('wanderly_user', JSON.stringify(newUser))
      setIsLoading(false)
      return { success: true }
    }
    
    setIsLoading(false)
    return { success: false, error: 'Invalid credentials. Password must be at least 6 characters.' }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    if (hasFirebaseConfig) {
      const { user: firebaseUser, error } = await firebaseSignUp(email, password, name)
      
      if (firebaseUser) {
        setUser(firebaseUserToUser(firebaseUser))
        setIsLoading(false)
        return { success: true }
      }
      
      setIsLoading(false)
      return { success: false, error: error || 'Signup failed' }
    }
    
    // Demo mode fallback
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        createdAt: new Date()
      }
      setUser(newUser)
      localStorage.setItem('wanderly_user', JSON.stringify(newUser))
      setIsLoading(false)
      return { success: true }
    }
    
    setIsLoading(false)
    return { success: false, error: 'Please fill all fields. Password must be at least 6 characters.' }
  }

  const logout = async () => {
    if (hasFirebaseConfig) {
      await firebaseSignOut()
    } else {
      localStorage.removeItem('wanderly_user')
    }
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      isFirebaseEnabled: hasFirebaseConfig,
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
