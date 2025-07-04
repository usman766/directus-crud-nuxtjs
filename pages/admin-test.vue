<template>
  <div class="admin-test-container">
    <el-card class="test-card">
      <template #header>
        <h2>Admin CRUD Test Page</h2>
      </template>

      <!-- Auth Status -->
      <el-alert
        :title="authStatus"
        :type="authStore.isAuthenticated ? 'success' : 'error'"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- Admin Status -->
      <el-alert
        :title="adminStatus"
        :type="authStore.isAdmin ? 'success' : 'warning'"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- Test Buttons -->
      <div class="test-buttons">
        <el-button
          type="primary"
          @click="testGetProfiles"
          :loading="isLoading"
        >
          Test Get Profiles
        </el-button>

        <el-button
          type="success"
          @click="testCreateProfile"
          :loading="isLoading"
          :disabled="!authStore.isAdmin"
        >
          Test Create Profile
        </el-button>

        <el-button
          type="warning"
          @click="testUpdateProfile"
          :loading="isLoading"
          :disabled="!authStore.isAdmin"
        >
          Test Update Profile
        </el-button>

        <el-button
          type="danger"
          @click="testDeleteProfile"
          :loading="isLoading"
          :disabled="!authStore.isAdmin"
        >
          Test Delete Profile
        </el-button>
      </div>

      <!-- Results -->
      <div v-if="testResults" class="test-results">
        <h3>Test Results:</h3>
        <pre>{{ JSON.stringify(testResults, null, 2) }}</pre>
      </div>

      <!-- Error Display -->
      <el-alert
        v-if="testError"
        :title="testError"
        type="error"
        show-icon
        style="margin-top: 20px"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  middleware: 'auth'
})

// Auth store
const authStore = useAuthStore()

// API composable
const { 
  getProfiles, 
  createProfile, 
  updateProfile, 
  deleteProfile,
  getCurrentUser 
} = useDirectusApi()

// Message composable
const { success, error } = useMessage()

// Reactive data
const isLoading = ref(false)
const testResults = ref<any>(null)
const testError = ref<string>('')

// Computed properties
const authStatus = computed(() => {
  return authStore.isAuthenticated 
    ? `Authenticated as: ${authStore.user?.email}` 
    : 'Not authenticated'
})

const adminStatus = computed(() => {
  return authStore.isAdmin 
    ? 'User has Admin privileges' 
    : 'User does not have Admin privileges'
})

// Test functions
const testGetProfiles = async () => {
  isLoading.value = true
  testError.value = ''
  testResults.value = null
  
  try {
    const response = await getProfiles()
    testResults.value = {
      operation: 'Get Profiles',
      success: true,
      data: response.data,
      count: response.data?.length || 0
    }
    success('Get profiles test successful!')
  } catch (err: any) {
    testError.value = err.message || 'Failed to get profiles'
    error(testError.value)
  } finally {
    isLoading.value = false
  }
}

const testCreateProfile = async () => {
  isLoading.value = true
  testError.value = ''
  testResults.value = null
  
  try {
    const testProfile = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      phone: '+1234567890',
      bio: 'This is a test profile created by admin',
      role: 'User'
    }
    
    const response = await createProfile(testProfile)
    testResults.value = {
      operation: 'Create Profile',
      success: true,
      data: response.data,
      createdProfile: testProfile
    }
    success('Create profile test successful!')
  } catch (err: any) {
    testError.value = err.message || 'Failed to create profile'
    error(testError.value)
  } finally {
    isLoading.value = false
  }
}

const testUpdateProfile = async () => {
  isLoading.value = true
  testError.value = ''
  testResults.value = null
  
  try {
    // First get a profile to update
    const profilesResponse = await getProfiles()
    const profiles = profilesResponse.data
    
    if (!profiles || profiles.length === 0) {
      throw new Error('No profiles found to update')
    }
    
    const profileToUpdate = profiles[0]
    const updateData = {
      bio: `Updated bio at ${new Date().toISOString()}`
    }
    
    const response = await updateProfile(profileToUpdate.id!, updateData)
    testResults.value = {
      operation: 'Update Profile',
      success: true,
      data: response.data,
      updatedProfile: profileToUpdate,
      updateData
    }
    success('Update profile test successful!')
  } catch (err: any) {
    testError.value = err.message || 'Failed to update profile'
    error(testError.value)
  } finally {
    isLoading.value = false
  }
}

const testDeleteProfile = async () => {
  isLoading.value = true
  testError.value = ''
  testResults.value = null
  
  try {
    // First get a profile to delete
    const profilesResponse = await getProfiles()
    const profiles = profilesResponse.data
    
    if (!profiles || profiles.length === 0) {
      throw new Error('No profiles found to delete')
    }
    
    const profileToDelete = profiles[0]
    
    await deleteProfile(profileToDelete.id!)
    testResults.value = {
      operation: 'Delete Profile',
      success: true,
      deletedProfile: profileToDelete
    }
    success('Delete profile test successful!')
  } catch (err: any) {
    testError.value = err.message || 'Failed to delete profile'
    error(testError.value)
  } finally {
    isLoading.value = false
  }
}

// Initialize
onMounted(async () => {
  // Check if user is admin
  if (!authStore.isAdmin) {
    error('This page is for admin users only')
  }
})
</script>

<style scoped>
.admin-test-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.test-card {
  margin-bottom: 24px;
}

.test-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.test-results {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.test-results h3 {
  margin: 0 0 12px 0;
  color: #303133;
}

.test-results pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  color: #606266;
}

@media (max-width: 768px) {
  .test-buttons {
    flex-direction: column;
  }
}
</style> 