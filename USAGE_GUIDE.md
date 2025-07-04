# User Profile CRUD System - Usage Guide

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` file in your project root:
```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_PROJECT_ID=your-project-id
```

### 2. Directus Collection Setup
Create a `profiles` collection in Directus with these fields:
```json
{
  "id": "uuid (Primary Key)",
  "name": "string (Required)",
  "email": "string (Required, Unique)",
  "phone": "string (Optional)",
  "bio": "text (Optional)",
  "avatar": "file (Optional)",
  "role": "string (Optional)",
  "created_at": "datetime (Auto)",
  "updated_at": "datetime (Auto)"
}
```

### 3. Run the Application
```bash
npm install
npm run dev
```

## 📚 API Integration Examples

### 1. Using the Directus API Composable

```typescript
// In any Vue component
const { 
  login, 
  getProfiles, 
  createProfile, 
  updateProfile, 
  deleteProfile,
  uploadFile 
} = useDirectusApi()

// Authentication
const handleLogin = async () => {
  try {
    await login({ email: 'user@example.com', password: 'password' })
    // User is now authenticated
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Get all profiles
const loadProfiles = async () => {
  try {
    const response = await getProfiles()
    const profiles = response.data
    console.log('Profiles:', profiles)
  } catch (error) {
    console.error('Failed to load profiles:', error)
  }
}

// Create a new profile
const createNewProfile = async () => {
  try {
    const profileData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      bio: 'Software Developer',
      role: 'User'
    }
    
    const response = await createProfile(profileData)
    console.log('Profile created:', response.data)
  } catch (error) {
    console.error('Failed to create profile:', error)
  }
}

// Upload avatar
const uploadAvatar = async (file: File) => {
  try {
    const response = await uploadFile(file)
    const avatarUrl = response.data.url
    console.log('Avatar uploaded:', avatarUrl)
  } catch (error) {
    console.error('Failed to upload avatar:', error)
  }
}
```

### 2. Using the Auth Store

```typescript
// In any Vue component
const authStore = useAuthStore()

// Check authentication status
if (authStore.isAuthenticated) {
  console.log('User is logged in')
}

// Check user role
if (authStore.isAdmin) {
  console.log('User is admin')
}

// Login
const handleLogin = async () => {
  try {
    await authStore.login({
      email: 'admin@example.com',
      password: 'admin123'
    })
    console.log('Login successful')
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Logout
const handleLogout = () => {
  authStore.logout()
  console.log('User logged out')
}
```

### 3. Using the Message Composable

```typescript
// In any Vue component
const { success, error, warning, info } = useMessage()

// Show success message
success('Operation completed successfully!')

// Show error message
error('Something went wrong!')

// Show warning message
warning('Please check your input!')

// Show info message
info('This is an informational message!')
```

## 🎯 Component Examples

### 1. Custom Profile Card Component

```vue
<template>
  <el-card class="profile-card" shadow="hover">
    <div class="profile-header">
      <el-avatar :size="60" :src="profile.avatar" :icon="UserFilled" />
      <div class="profile-info">
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.email }}</p>
        <el-tag :type="profile.role === 'Administrator' ? 'danger' : 'info'">
          {{ profile.role }}
        </el-tag>
      </div>
    </div>
    
    <div class="profile-content">
      <p>{{ profile.bio || 'No bio available' }}</p>
    </div>
    
    <div class="profile-actions">
      <el-button type="primary" size="small" @click="viewProfile">
        View
      </el-button>
      <el-button 
        v-if="authStore.isAdmin" 
        type="warning" 
        size="small" 
        @click="editProfile"
      >
        Edit
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue'
import type { UserProfile } from '~/types'

// Props
interface Props {
  profile: UserProfile
}

const props = defineProps<Props>()

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// Methods
const viewProfile = () => {
  router.push(`/profiles/${props.profile.id}`)
}

const editProfile = () => {
  router.push(`/profiles/${props.profile.id}/edit`)
}
</script>

<style scoped>
.profile-card {
  margin-bottom: 16px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.profile-info h3 {
  margin: 0 0 4px 0;
  color: #303133;
}

.profile-info p {
  margin: 0 0 8px 0;
  color: #606266;
}

.profile-content {
  margin-bottom: 16px;
}

.profile-actions {
  display: flex;
  gap: 8px;
}
</style>
```

### 2. Custom Search Component

```vue
<template>
  <div class="search-container">
    <el-input
      v-model="searchQuery"
      placeholder="Search profiles..."
      :prefix-icon="Search"
      clearable
      @input="handleSearch"
    />
    
    <el-select
      v-model="roleFilter"
      placeholder="Filter by role"
      clearable
      @change="handleSearch"
    >
      <el-option label="All Roles" value="" />
      <el-option label="Admin" value="Administrator" />
      <el-option label="User" value="User" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import type { UserProfile } from '~/types'

// Props
interface Props {
  profiles: UserProfile[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  filtered: [profiles: UserProfile[]]
}>()

// Reactive data
const searchQuery = ref('')
const roleFilter = ref('')

// Search handler
const handleSearch = () => {
  let filtered = props.profiles

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(profile =>
      profile.name.toLowerCase().includes(query) ||
      profile.email.toLowerCase().includes(query)
    )
  }

  // Filter by role
  if (roleFilter.value) {
    filtered = filtered.filter(profile => profile.role === roleFilter.value)
  }

  emit('filtered', filtered)
}
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }
}
</style>
```

## 🔧 Customization Examples

### 1. Custom Theme Colors

```css
/* In your global CSS or component */
:root {
  --el-color-primary: #1890ff;
  --el-color-success: #52c41a;
  --el-color-warning: #faad14;
  --el-color-danger: #ff4d4f;
  --el-color-info: #8c8c8c;
}
```

### 2. Custom API Configuration

```typescript
// In composables/useDirectusApi.ts
export const useDirectusApi = () => {
  const config = useRuntimeConfig()
  
  // Custom base URL
  const baseUrl = config.public.directusUrl || 'https://your-directus-instance.com'
  
  // Custom project ID
  const projectId = config.public.directusProjectId || 'your-project-id'
  
  // Custom headers
  const getDefaultHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'your-custom-value'
  })
  
  // ... rest of the implementation
}
```

### 3. Custom Validation Rules

```typescript
// In any form component
const formRules = {
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Name must be 2-50 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  bio: [
    { min: 10, max: 500, message: 'Bio must be 10-500 characters', trigger: 'blur' }
  ]
}
```

## 🚀 Deployment Examples

### 1. Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output",
  "framework": "nuxt",
  "env": {
    "DIRECTUS_URL": "https://your-directus-instance.com",
    "DIRECTUS_PROJECT_ID": "your-project-id"
  }
}
```

### 2. Netlify Deployment

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  DIRECTUS_URL = "https://your-directus-instance.com"
  DIRECTUS_PROJECT_ID = "your-project-id"
```

### 3. Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🧪 Testing Examples

### 1. Unit Test Example

```typescript
// tests/useDirectusApi.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useDirectusApi } from '~/composables/useDirectusApi'

describe('useDirectusApi', () => {
  it('should authenticate user', async () => {
    const { login } = useDirectusApi()
    
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    }
    
    // Mock the API call
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires: 3600
        }
      })
    })
    
    const result = await login(credentials)
    expect(result.data.access_token).toBe('mock-token')
  })
})
```

### 2. Component Test Example

```typescript
// tests/ProfileCard.test.ts
import { mount } from '@vue/test-utils'
import ProfileCard from '~/components/ProfileCard.vue'

describe('ProfileCard', () => {
  it('should display profile information', () => {
    const profile = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'User'
    }
    
    const wrapper = mount(ProfileCard, {
      props: { profile }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })
})
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on mobile devices. Key responsive features:

- Flexible grid layouts
- Mobile-friendly navigation
- Touch-optimized buttons and inputs
- Responsive tables with horizontal scroll
- Optimized avatar upload for mobile

## 🔒 Security Considerations

1. **JWT Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
2. **Input Validation**: All forms include client-side validation
3. **Role-based Access**: Admin-only actions are properly protected
4. **File Upload Security**: File type and size validation implemented
5. **CORS Configuration**: Ensure Directus CORS settings are properly configured

## 🎨 UI/UX Best Practices

1. **Loading States**: All async operations show loading indicators
2. **Error Handling**: Comprehensive error messages with user-friendly text
3. **Success Feedback**: Clear success messages for completed actions
4. **Confirmation Dialogs**: Destructive actions require confirmation
5. **Accessibility**: Proper ARIA labels and keyboard navigation support

This usage guide provides comprehensive examples for integrating and customizing the User Profile CRUD system in your Nuxt.js application. 