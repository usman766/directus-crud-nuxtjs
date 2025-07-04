<template>
  <div class="profiles-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>User Profiles</h1>
        <p>Manage user profiles and information</p>
      </div>
      <div class="header-actions">
        <el-button
          v-if="authStore.isAdmin"
          type="primary"
          :icon="Plus"
          @click="navigateToCreate"
        >
          Add Profile
        </el-button>
        <el-button
          type="danger"
          :icon="SwitchButton"
          @click="handleLogout"
        >
          Logout
        </el-button>
      </div>
    </div>

    <!-- Search and Filters -->
    <el-card class="search-card" shadow="never">
      <div class="search-row">
        <el-input
          v-model="searchQuery"
          placeholder="Search profiles by name or email..."
          :prefix-icon="Search"
          clearable
          style="max-width: 300px"
          @input="handleSearch"
        />
      </div>
    </el-card>

    <!-- Profiles Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="isLoading"
        :data="filteredProfiles"
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column prop="avatar" label="Avatar" width="80">
          <template #default="{ row }">
            <el-avatar
              :size="50"
              :src="row.avatar"
              :icon="UserFilled"
            />
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Name" sortable>
          <template #default="{ row }">
            <div class="name-cell">
              <strong>{{ row.name }}</strong>
              <el-tag
                v-if="row.role"
                :type="row.role === 'Administrator' ? 'danger' : 'info'"
                size="small"
              >
                {{ row.role }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Email" sortable>
          <template #default="{ row }">
            <el-link type="primary" :underline="false">
              {{ row.email }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="Phone" width="150">
          <template #default="{ row }">
            {{ row.phone || 'N/A' }}
          </template>
        </el-table-column>

        <el-table-column prop="bio" label="Bio" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.bio || 'No bio available' }}
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="Created" width="120">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                type="primary"
                :icon="View"
                size="small"
                @click.stop="viewProfile(row)"
              >
                View
              </el-button>
              
              <el-button
                v-if="authStore.isAdmin"
                type="warning"
                :icon="Edit"
                size="small"
                @click.stop="editProfile(row)"
              >
                Edit
              </el-button>
              
              <el-button
                v-if="authStore.isAdmin"
                type="danger"
                :icon="Delete"
                size="small"
                @click.stop="deleteProfile(row)"
              >
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Empty State -->
      <el-empty
        v-if="!isLoading && filteredProfiles.length === 0"
        description="No profiles found"
      >
        <el-button
          v-if="authStore.isAdmin"
          type="primary"
          @click="navigateToCreate"
        >
          Create First Profile
        </el-button>
      </el-empty>
    </el-card>

    <!-- Delete Confirmation Dialog -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="Confirm Delete"
      width="400px"
    >
      <p>Are you sure you want to delete the profile "<strong>{{ profileToDelete?.name }}</strong>"?</p>
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
  Plus,
  Search,
  View,
  Edit,
  Delete,
  SwitchButton,
  UserFilled
} from '@element-plus/icons-vue'
import type { UserProfile } from '~/types'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// API composable
const { getProfiles, deleteProfile: apiDeleteProfile } = useDirectusApi()

// Message composable
const { error, success } = useMessage()

// Reactive data
const profiles = ref<UserProfile[]>([])
const filteredProfiles = ref<UserProfile[]>([])
const searchQuery = ref('')
const roleFilter = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const deleteDialogVisible = ref(false)
const profileToDelete = ref<UserProfile | null>(null)

// Load profiles
const loadProfiles = async () => {
  isLoading.value = true
  try {
    const response = await getProfiles()
    profiles.value = response.data || []
    filteredProfiles.value = profiles.value
  } catch (err: any) {
    error(err.message || 'Failed to load profiles')
  } finally {
    isLoading.value = false
  }
}

// Search and filter
const handleSearch = () => {
  let filtered = profiles.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(profile =>
      profile.name.toLowerCase().includes(query) ||
      profile.email.toLowerCase().includes(query)
    )
  }

  filteredProfiles.value = filtered
}

// Navigation handlers
const navigateToCreate = () => {
  router.push('/profiles/create')
}

const viewProfile = (profile: UserProfile) => {
  router.push(`/profiles/${profile.id}`)
}

const editProfile = (profile: UserProfile) => {
  router.push(`/profiles/${profile.id}/edit`)
}

const handleRowClick = (profile: UserProfile) => {
  viewProfile(profile)
}

// Delete handlers
const deleteProfile = (profile: UserProfile) => {
  profileToDelete.value = profile
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!profileToDelete.value) return

  isDeleting.value = true
  try {
    await apiDeleteProfile(profileToDelete.value.id!)
    success('Profile deleted successfully')
    await loadProfiles()
    deleteDialogVisible.value = false
    profileToDelete.value = null
  } catch (err: any) {
    error(err.message || 'Failed to delete profile')
  } finally {
    isDeleting.value = false
  }
}

// Logout handler
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Initialize
onMounted(async () => {
  await loadProfiles()
})
</script>

<style scoped>
.profiles-container {
  padding: 24px;
  max-width: 1200px;
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

.search-card {
  margin-bottom: 24px;
}

.search-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.table-card {
  margin-bottom: 24px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .profiles-container {
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
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style> 