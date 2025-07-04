// User Profile Interface
export interface UserProfile {
  id?: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar?: string
  role?: string
  created_at?: string
  updated_at?: string
}

// Authentication Interface
export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  data: {
    access_token: string
    refresh_token: string
    expires: number
  }
}

// Directus Role Interface
export interface DirectusRole {
  id: string
  name: string
  icon?: string
  description?: string
}

export interface AuthUser {
  id: string
  email: string
  role: string | DirectusRole
  first_name?: string
  last_name?: string
}

// API Response Interfaces
export interface ApiResponse<T> {
  data: T
  meta?: {
    total_count?: number
    filter_count?: number
  }
}

export interface FileUploadResponse {
  data: {
    id: string
    filename_download: string
    filesize: number
    type: string
    url: string
  }
}

// Form Interfaces
export interface ProfileFormData {
  name: string
  email: string
  phone: string
  bio: string
  avatar?: File | null
}

// Error Interface
export interface ApiError {
  errors: Array<{
    message: string
    extensions?: {
      code?: string
    }
  }>
} 