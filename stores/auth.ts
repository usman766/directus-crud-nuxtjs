import { defineStore } from 'pinia'
import type { AuthUser, AuthCredentials, DirectusRole } from '~/types'

// Set your actual Directus admin role UUID here
const ADMIN_ROLE_ID = '3e935259-a0ca-416f-9807-4d11d6ff8466'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Helper function to check if user has admin role
  const checkAdminRole = (role: string | DirectusRole): boolean => {
    if (typeof role === 'string') {
      return role === ADMIN_ROLE_ID
    } else {
      return role.id === ADMIN_ROLE_ID
    }
  }

  // Helper function to check if user has regular user role
  const checkUserRole = (role: string | DirectusRole): boolean => {
    // You can set your regular user role UUID here if needed
    return false
  }

  // Getters - Updated to handle Directus role structure
  const isAdmin = computed(() => {
    if (!user.value?.role) return false
    return checkAdminRole(user.value.role)
  })
  
  const isRegularUser = computed(() => {
    if (!user.value?.role) return false
    return checkUserRole(user.value.role)
  })

  // Actions
  const login = async (credentials: AuthCredentials) => {
    const { login: apiLogin, getCurrentUser } = useDirectusApi()
    
    isLoading.value = true
    error.value = null
    
    try {
      // Login to get token
      await apiLogin(credentials)
      
      // Get current user data
      const userResponse = await getCurrentUser()
      const userData = (userResponse as any).data
      user.value = userData
      isAuthenticated.value = true
      
      // Store user data in localStorage for persistence
      if (process.client) {
        localStorage.setItem('user_data', JSON.stringify(userData))
      }
      
      return userData
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    const { logout: apiLogout } = useDirectusApi()
    
    // Clear API token
    apiLogout()
    
    // Clear local state
    user.value = null
    isAuthenticated.value = false
    error.value = null
    
    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('user_data')
    }
  }

  const checkAuth = async () => {
    const { isAuthenticated: apiIsAuthenticated, getCurrentUser } = useDirectusApi()
    
    if (!apiIsAuthenticated()) {
      return false
    }
    
    try {
      const userResponse = await getCurrentUser()
      const userData = (userResponse as any).data
      user.value = userData
      isAuthenticated.value = true
      return true
    } catch (err) {
      // Token is invalid, clear everything
      logout()
      return false
    }
  }

  const initializeAuth = () => {
    // Try to restore user data from localStorage on app start
    if (process.client) {
      const storedUser = localStorage.getItem('user_data')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
          isAuthenticated.value = true
        } catch {
          // Invalid stored data, clear it
          localStorage.removeItem('user_data')
        }
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Getters
    isAdmin,
    isRegularUser,
    
    // Actions
    login,
    logout,
    checkAuth,
    initializeAuth,
    clearError,
  }
}) 