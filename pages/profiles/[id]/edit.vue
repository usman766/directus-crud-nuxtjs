<template>
  <div class="edit-profile-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Edit Profile</h1>
        <p>Update profile information</p>
      </div>
      <div class="header-actions">
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
        <el-skeleton :rows="10" animated />
      </div>
    </el-card>

    <!-- Profile Form -->
    <el-card v-else class="form-card" shadow="never">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        @submit.prevent="handleSubmit"
      >
        <!-- Avatar Upload -->
        <el-form-item label="Avatar" prop="avatar">
          <div class="avatar-upload">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleAvatarChange"
              accept="image/*"
              class="avatar-uploader"
            >
              <div class="avatar-preview">
                <el-avatar
                  v-if="avatarPreview || profile?.avatar"
                  :size="100"
                  :src="avatarPreview || profile?.avatar"
                  fit="cover"
                />
                <el-avatar
                  v-else
                  :size="100"
                  :icon="UserFilled"
                />
                <div class="upload-overlay">
                  <el-icon><Camera /></el-icon>
                  <span>Click to upload</span>
                </div>
              </div>
            </el-upload>
            <div class="avatar-info">
              <p>Upload a profile picture (JPG, PNG, GIF)</p>
              <p>Maximum file size: 5MB</p>
              <el-button
                v-if="profile?.avatar && !avatarPreview"
                type="danger"
                size="small"
                @click="removeAvatar"
              >
                Remove Avatar
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- Basic Information -->
        <el-divider content-position="left">Basic Information</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Full Name" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="Enter full name"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="formData.email"
                type="email"
                placeholder="Enter email address"
                :prefix-icon="Message"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="Enter phone number"
                :prefix-icon="Phone"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Role" prop="role">
              <el-select
                v-model="formData.role"
                placeholder="Select role"
                style="width: 100%"
              >
                <el-option label="User" value="User" />
                <el-option label="Administrator" value="Administrator" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Bio" prop="bio">
          <el-input
            v-model="formData.bio"
            type="textarea"
            :rows="4"
            placeholder="Tell us about yourself..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- Form Actions -->
        <el-form-item>
          <div class="form-actions">
            <el-button
              type="primary"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              {{ isSubmitting ? 'Updating...' : 'Update Profile' }}
            </el-button>
            <el-button @click="resetForm">
              Reset Form
            </el-button>
            <el-button @click="goBack">
              Cancel
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  User,
  Message,
  Phone,
  Camera,
  UserFilled,
  ArrowLeft
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import type { UserProfile, ProfileFormData } from '~/types'

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
const { getProfile, updateProfile, uploadFile } = useDirectusApi()

// Message composable
const { error, success } = useMessage()

// Form refs
const formRef = ref<FormInstance>()
const uploadRef = ref()

// Reactive data
const profile = ref<UserProfile | null>(null)
const formData = reactive<ProfileFormData & { role: string }>({
  name: '',
  email: '',
  phone: '',
  bio: '',
  avatar: null,
  role: 'User'
})

const avatarPreview = ref<string>('')
const isLoading = ref(false)
const isSubmitting = ref(false)

// Form validation rules
const formRules: FormRules = {
  name: [
    { required: true, message: 'Please enter the full name', trigger: 'blur' },
    { min: 2, message: 'Name must be at least 2 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter the email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter the phone number', trigger: 'blur' },
    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  bio: [
    { required: true, message: 'Please enter a bio', trigger: 'blur' },
    { min: 10, message: 'Bio must be at least 10 characters', trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'Please select a role', trigger: 'change' }
  ]
}

// Load profile data
const loadProfile = async () => {
  isLoading.value = true
  try {
    const response = await getProfile(profileId)
    profile.value = response.data
    
    // Populate form data
    formData.name = profile.value.name
    formData.email = profile.value.email
    formData.phone = profile.value.phone || ''
    formData.bio = profile.value.bio || ''
    formData.role = profile.value.role || 'User'
  } catch (err: any) {
    error(err.message || 'Failed to load profile')
    router.push('/profiles')
  } finally {
    isLoading.value = false
  }
}

// Avatar upload handler
const handleAvatarChange = (file: UploadFile) => {
  const isImage = file.raw?.type.startsWith('image/')
  const isLt5M = file.raw && file.raw.size / 1024 / 1024 < 5

  if (!isImage) {
    error('Avatar must be an image file!')
    return false
  }

  if (!isLt5M) {
    error('Avatar file size must be less than 5MB!')
    return false
  }

  formData.avatar = file.raw || null
  
  // Create preview
  if (file.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  return false // Prevent auto upload
}

// Remove avatar
const removeAvatar = () => {
  formData.avatar = null
  avatarPreview.value = ''
  profile.value!.avatar = ''
}

// Form submission
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitting.value = true

    // Upload new avatar if selected
    let avatarUrl = profile.value?.avatar || ''
    if (formData.avatar) {
      const uploadResponse = await uploadFile(formData.avatar)
      avatarUrl = uploadResponse.data.url
    }

    // Update profile
    const profileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      role: formData.role,
      ...(formData.avatar ? { avatar: avatarUrl } : {}) 

    }

    await updateProfile(profileId, profileData)
    
    success('Profile updated successfully!')
    router.push('/profiles')
  } catch (err: any) {
    error(err.message || 'Failed to update profile')
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  if (profile.value) {
    formData.name = profile.value.name
    formData.email = profile.value.email
    formData.phone = profile.value.phone || ''
    formData.bio = profile.value.bio || ''
    formData.role = profile.value.role || 'User'
  }
  formData.avatar = null
  avatarPreview.value = ''
}

// Navigation
const goBack = () => {
  router.push('/profiles')
}

// Initialize
onMounted(async () => {
  // Check admin permissions
  if (!authStore.isAdmin) {
    error('You do not have permission to edit profiles')
    router.push('/profiles')
    return
  }
  
  await loadProfile()
})
</script>

<style scoped>
.edit-profile-container {
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

.loading-card {
  margin-bottom: 24px;
}

.loading-content {
  padding: 20px;
}

.form-card {
  margin-bottom: 24px;
}

.avatar-upload {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.avatar-uploader {
  flex-shrink: 0;
}

.avatar-preview {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px dashed #d9d9d9;
  transition: border-color 0.3s;
}

.avatar-preview:hover {
  border-color: #409eff;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .upload-overlay {
  opacity: 1;
}

.upload-overlay .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.avatar-info {
  flex: 1;
}

.avatar-info p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

/* Responsive design */
@media (max-width: 768px) {
  .edit-profile-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .avatar-upload {
    flex-direction: column;
    align-items: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 