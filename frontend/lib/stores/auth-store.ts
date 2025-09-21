import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  phone?: string
  role: 'customer' | 'designer' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export interface RegisterData {
  email: string
  username: string
  full_name: string
  phone?: string
  password: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData, autoLogin?: boolean) => Promise<void>
  forgotPassword: (email: string) => Promise<{ message: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshToken: () => Promise<void>
  checkAuth: () => Promise<void>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8082'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          console.log('Attempting login with:', { email, apiUrl: `${API_BASE_URL}/api/auth/login` })
          
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          })

          console.log('Login response status:', response.status)
          console.log('Login response headers:', Object.fromEntries(response.headers.entries()))

          if (!response.ok) {
            let errorMessage = 'Login failed'
            try {
              const errorData = await response.json()
              errorMessage = errorData.detail || errorData.error || errorMessage
            } catch (parseError) {
              console.error('Failed to parse error response:', parseError)
              if (response.status === 0) {
                errorMessage = 'Network error - please check if the server is running and CORS is configured'
              } else if (response.status >= 500) {
                errorMessage = 'Server error - please try again later'
              }
            }
            throw new Error(errorMessage)
          }

          const responseData = await response.json()
          console.log('Login response data:', responseData)
          const { access_token } = responseData

          // Get user data with the token
          const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
            credentials: 'include',
          })

          if (!userResponse.ok) {
            throw new Error('Failed to get user data')
          }

          const userData = await userResponse.json()
          
          set({
            user: userData,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })

          // Store token in localStorage and cookie
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', access_token)
            // Set cookie with httpOnly: false so we can access it client-side for middleware
            document.cookie = `auth_token=${access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
          }

        } catch (error: any) {
          console.error('Login error:', error)
          set({ isLoading: false })
          
          // Enhanced error messages for common issues
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error - unable to connect to authentication server. Please check your internet connection and try again.')
          }
          
          throw error
        }
      },

      register: async (data: RegisterData, autoLogin: boolean = true) => {
        set({ isLoading: true })
        
        try {
          console.log('Attempting registration with:', { email: data.email, apiUrl: `${API_BASE_URL}/api/auth/register` })
          
          const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          })

          console.log('Registration response status:', response.status)
          console.log('Registration response headers:', Object.fromEntries(response.headers.entries()))

          if (!response.ok) {
            let errorMessage = 'Registration failed'
            try {
              const errorData = await response.json()
              errorMessage = errorData.detail || errorData.error || errorMessage
            } catch (parseError) {
              console.error('Failed to parse registration error response:', parseError)
              if (response.status === 0) {
                errorMessage = 'Network error - please check if the server is running and CORS is configured'
              } else if (response.status >= 500) {
                errorMessage = 'Server error - please try again later'
              } else if (response.status === 400) {
                errorMessage = 'Registration failed - please check your input data'
              }
            }
            throw new Error(errorMessage)
          }

          const tokenData = await response.json()
          console.log('Registration response:', tokenData)

          // Registration now returns JWT token directly for auto-login
          if (autoLogin && tokenData.access_token) {
            console.log('Token received, getting user data...')
            // Get user data with the token
            const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
              credentials: 'include',
            })

            if (!userResponse.ok) {
              throw new Error('Failed to get user data after registration')
            }

            const userData = await userResponse.json()
            console.log('User data received:', userData)
            
            set({
              user: userData,
              token: tokenData.access_token,
              isAuthenticated: true,
              isLoading: false,
            })

            // Store token in localStorage and cookie
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', tokenData.access_token)
              // Set cookie with httpOnly: false so we can access it client-side for middleware
              document.cookie = `auth_token=${tokenData.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
            }
            console.log('Registration complete, user authenticated')
          } else {
            console.log('No token received or autoLogin disabled')
            set({ isLoading: false })
          }

        } catch (error: any) {
          console.error('Registration error:', error)
          set({ isLoading: false })
          
          // Enhanced error messages for common issues
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error - unable to connect to authentication server. Please check your internet connection and try again.')
          }
          
          throw error
        }
      },

      forgotPassword: async (email: string) => {
        try {
          console.log('Attempting forgot password for:', { email, apiUrl: `${API_BASE_URL}/api/auth/forgot-password` })
          
          const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email }),
          })

          console.log('Forgot password response status:', response.status)

          if (!response.ok) {
            let errorMessage = 'Failed to send reset password email'
            try {
              const errorData = await response.json()
              errorMessage = errorData.detail || errorData.error || errorMessage
            } catch (parseError) {
              console.error('Failed to parse forgot password error response:', parseError)
              if (response.status === 0) {
                errorMessage = 'Network error - please check if the server is running and CORS is configured'
              } else if (response.status >= 500) {
                errorMessage = 'Server error - please try again later'
              }
            }
            throw new Error(errorMessage)
          }

          const responseData = await response.json()
          console.log('Forgot password response:', responseData)
          return { message: responseData.message || 'Password reset email sent successfully' }
          
        } catch (error: any) {
          console.error('Forgot password error:', error)
          
          // Enhanced error messages for common issues
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error - unable to connect to authentication server. Please check your internet connection and try again.')
          }
          
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })

        // Clear token from localStorage and cookies
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          // Clear cookie by setting it to expire immediately
          document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict'
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },

      refreshToken: async () => {
        const token = get().token
        if (!token) return

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          })

          if (response.ok) {
            const { access_token } = await response.json()
            set({ token: access_token })
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', access_token)
            }
          } else {
            // Token refresh failed, logout user
            get().logout()
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          get().logout()
        }
      },

      checkAuth: async () => {
        const token = get().token

        if (!token) {
          set({ isAuthenticated: false })
          return
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          })

          if (response.ok) {
            const userData = await response.json()
            set({
              user: userData,
              isAuthenticated: true,
            })
          } else {
            // Token is invalid
            get().logout()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helper hooks
export const useUser = () => {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return { user, isAuthenticated }
}

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const forgotPassword = useAuthStore((state) => state.forgotPassword)
  const logout = useAuthStore((state) => state.logout)
  const updateUser = useAuthStore((state) => state.updateUser)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  
  return {
    login,
    register,
    forgotPassword,
    logout,
    updateUser,
    refreshToken,
    checkAuth,
  }
}

// Auth initialization hook
export const useAuthInit = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  // Initialize auth on app start
  const initializeAuth = async () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken && !isAuthenticated) {
        await checkAuth()
      }
    }
  }

  return { initializeAuth, isLoading, isAuthenticated }
}
