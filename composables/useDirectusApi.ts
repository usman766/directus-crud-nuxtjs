import type { UserProfile, AuthCredentials, AuthResponse, ApiResponse, FileUploadResponse, ApiError } from '~/types'

export const useDirectusApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.directusUrl
  const projectId = config.public.directusProjectId

  // Get stored token from localStorage
  const getToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('directus_token')
    }
    return null
  }

  // Set token in localStorage
  const setToken = (token: string): void => {
    if (process.client) {
      localStorage.setItem('directus_token', token)
    }
  }

  // Remove token from localStorage
  const removeToken = (): void => {
    if (process.client) {
      localStorage.removeItem('directus_token')
    }
  }

  // Generic API request function for Directus
  const apiRequest = async <T>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    const token = getToken()
    const url = `${baseUrl}/items/${endpoint}`

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await $fetch<T>(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    return response
  }

  // Authentication
  const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const url = `${baseUrl}/auth/login`
    
    try {
      const response = await $fetch<AuthResponse>(url, {
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.data?.access_token) {
        setToken(response.data.access_token)
      }

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Login failed')
    }
  }

  const logout = (): void => {
    removeToken()
  }

  const getCurrentUser = async () => {
    const url = `${baseUrl}/users/me`
    const token = getToken()

    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      return await $fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error: any) {
      throw new Error(error.data?.message || 'Failed to get current user')
    }
  }

  // Profile CRUD Operations
  const getProfiles = async (): Promise<ApiResponse<UserProfile[]>> => {
    return await apiRequest<ApiResponse<UserProfile[]>>('profiles')
  }

  const getProfile = async (id: string): Promise<ApiResponse<UserProfile>> => {
    return await apiRequest<ApiResponse<UserProfile>>(`profiles/${id}`)
  }

  const createProfile = async (profile: Omit<UserProfile, 'id'>): Promise<ApiResponse<UserProfile>> => {
    return await apiRequest<ApiResponse<UserProfile>>('profiles', {
      method: 'POST',
      body: profile, // Directus expects the object directly, not JSON stringified
    })
  }

  const updateProfile = async (id: string, profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    return await apiRequest<ApiResponse<UserProfile>>(`profiles/${id}`, {
      method: 'PATCH',
      body: profile, // Directus expects the object directly, not JSON stringified
    })
  }

  const deleteProfile = async (id: string): Promise<void> => {
    await apiRequest(`profiles/${id}`, {
      method: 'DELETE',
    })
  }

  // File Upload
  const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    const token = getToken()
    const url = `${baseUrl}/files`

    if (!token) {
      throw new Error('No authentication token found')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await $fetch<FileUploadResponse>(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'File upload failed')
    }
  }

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return !!getToken()
  }

  // Check if user has admin role
  const isAdmin = async (): Promise<boolean> => {
    try {
      const user = await getCurrentUser()
      const userData = (user as any).data
      const role = userData?.role
      
      if (typeof role === 'string') {
        return role === 'Administrator'
      } else if (role && typeof role === 'object') {
        return role.name === 'Administrator' || role.id === 'administrator'
      }
      
      return false
    } catch {
      return false
    }
  }

  return {
    // Authentication
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    
    // Profile CRUD
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    
    // File operations
    uploadFile,
    
    // Token management
    getToken,
    setToken,
    removeToken,
  }
} 