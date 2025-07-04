<template>
  <div class="profile-view-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Profile Details</h1>
        <p>View profile information</p>
      </div>
      <div class="header-actions">
        <el-button
          v-if="authStore.isAdmin"
          type="warning"
          :icon="Edit"
          @click="editProfile"
        >
          Edit Profile
        </el-button>
        <el-button
          v-if="authStore.isAdmin"
          type="danger"
          :icon="Delete"
          @click="deleteProfile"
        >
          Delete Profile
        </el-button>
        <el-button
          :icon="ArrowLeft"
          @click="goBack"
        >
          Back to Profiles
        </el-button>
      </div>
    </div>

    <!-- Loading State -->
    <el-card v-if="isLoading" class="loading-card" shadow="never">
      <div class="loading-content">
        <el-skeleton :rows="8" animated />
      </div>
    </el-card>

    <!-- Profile Details -->
    <div v-else-if="profile" class="profile-details">
      <!-- Profile Header -->
      <el-card class="profile-header-card" shadow="never">
        <div class="profile-header">
          <div class="profile-avatar">
            <el-avatar
              :size="120"
              :src="profile.avatar"
              :icon="UserFilled"
              fit="cover"
            />
          </div>
          <div class="profile-info">
            <h2>{{ profile.name }}</h2>
            <p class="profile-email">{{ profile.email }}</p>
            <el-tag
              v-if="profile.role"
              :type="profile.role === 'Administrator' ? 'danger' : 'info'"
              size="large"
            >
              {{ profile.role }}
            </el-tag>
          </div>
        </div>
      </el-card>

      <!-- Profile Content -->
      <el-card class="profile-content-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3>Profile Information</h3>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="Full Name">
            {{ profile.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Email">
            <el-link type="primary" :underline="false">
              {{ profile.email }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="Phone">
            {{ profile.phone || 'Not provided' }}
          </el-descriptions-item>
          <el-descriptions-item label="Role">
            <el-tag
              :type="profile.role === 'Administrator' ? 'danger' : 'info'"
            >
              {{ profile.role || 'User' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Created">
            {{ formatDate(profile.created_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="Last Updated">
            {{ formatDate(profile.updated_at) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">Bio</el-divider>
        
        <div class="bio-section">
          <p v-if="profile.bio" class="bio-text">
            {{ profile.bio }}
          </p>
          <el-empty
            v-else
            description="No bio available"
            :image-size="100"
          />
        </div>
      </el-card>
    </div>

    <!-- Error State -->
    <el-card v-else class="error-card" shadow="never">
      <el-empty
        description="Profile not found"
        :image-size="200"
      >
        <el-button type="primary" @click="goBack">
          Back to Profiles
        </el-button>
      </el-empty>
    </el-card>

    <!-- Delete Confirmation Dialog -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="Confirm Delete"
      width="400px"
    >
      <p>Are you sure you want to delete the profile "<strong>{{ profile?.name }}</strong>"?</p>
      <p>This action cannot be undone.</p>
      
      <template #footer>
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button
          type="danger"
          :loading="isDeleting"
          @click="confirmDelete"
        >
          Delete
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Edit,
  Delete,
  ArrowLeft,
  UserFilled
} from '@element-plus/icons-vue'
import type { UserProfile } from '~/types'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Route params
const route = useRoute()
const profileId = route.params.id as string

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// API composable
const { getProfile, deleteProfile: apiDeleteProfile } = useDirectusApi()

// Message composable
const { error, success } = useMessage()

// Reactive data
const profile = ref<UserProfile | null>(null)
const isLoading = ref(false)
const isDeleting = ref(false)
const deleteDialogVisible = ref(false)

// Load profile data
const loadProfile = async () => {
  isLoading.value = true
  try {
    const response = await getProfile(profileId)
    profile.value = response.data
  } catch (err: any) {
    error(err.message || 'Failed to load profile')
    profile.value = null
  } finally {
    isLoading.value = false
  }
}

// Navigation handlers
const editProfile = () => {
  router.push(`/profiles/${profileId}/edit`)
}

const deleteProfile = () => {
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!profile.value) return

  isDeleting.value = true
  try {
    await apiDeleteProfile(profile.value.id!)
    success('Profile deleted successfully')
    router.push('/profiles')
  } catch (err: any) {
    error(err.message || 'Failed to delete profile')
  } finally {
    isDeleting.value = false
    deleteDialogVisible.value = false
  }
}

const goBack = () => {
  router.push('/profiles')
}

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize
onMounted(async () => {
  await loadProfile()
})
</script>

<style scoped>
.profile-view-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #606266;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.loading-card {
  margin-bottom: 24px;
}

.loading-content {
  padding: 20px;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-header-card {
  margin-bottom: 0;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-info h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.profile-email {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 16px;
}

.profile-content-card {
  margin-bottom: 0;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.bio-section {
  margin-top: 16px;
}

.bio-text {
  margin: 0;
  color: #303133;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.error-card {
  margin-bottom: 24px;
}

/* Responsive design */
@media (max-width: 768px) {
  .profile-view-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
}
</style> 