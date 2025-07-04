<template>
  <div class="create-profile-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Create New Profile</h1>
        <p>Add a new user profile to the system</p>
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

    <!-- Profile Form -->
    <el-card class="form-card" shadow="never">
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
                  v-if="avatarPreview"
                  :size="100"
                  :src="avatarPreview"
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
              <template #extra>
                <div style="color: #909399; font-size: 12px;">
                  Enter a valid phone number, e.g. +1 234-567-8900 or (123) 456-7890
                </div>
              </template>
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
              {{ isSubmitting ? 'Creating...' : 'Create Profile' }}
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
import type { ProfileFormData } from '~/types'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// API composable
const { createProfile, uploadFile } = useDirectusApi()

// Message composable
const { error, success } = useMessage()

// Set your actual Directus 'User' role UUID here
const USER_ROLE_ID = '9e7617ab-6ac9-42ec-8c50-6d88b1b5a413' // <-- Replace with your actual 'User' role UUID

// Form refs
const formRef = ref<FormInstance>()
const uploadRef = ref()

// Reactive data
const formData = reactive<ProfileFormData & { role: string }>({
  name: '',
  email: '',
  phone: '',
  bio: '',
  avatar: null,
  role: USER_ROLE_ID // Use the UUID by default
})

const avatarPreview = ref<string>('')
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
    { pattern: /^\+?[0-9\s\-()]{7,20}$/, message: 'Please enter a valid phone number, e.g. +1 234-567-8900 or (123) 456-7890', trigger: 'blur' }
  ],
  bio: [
    { required: true, message: 'Please enter a bio', trigger: 'blur' },
    { min: 10, message: 'Bio must be at least 10 characters', trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'Please select a role', trigger: 'change' }
  ]
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

// Form submission
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitting.value = true

    // Upload avatar if selected
    let avatarUrl = ''
    if (formData.avatar) {
      const uploadResponse = await uploadFile(formData.avatar)
      avatarUrl = uploadResponse.data.url
    }

    // Create profile
    const profileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      role: formData.role,
      ...(formData.avatar ? { avatar: avatarUrl } : {})
    }

    await createProfile(profileData)
    
    success('Profile created successfully!')
    router.push('/profiles')
  } catch (err: any) {
    error(err.message || 'Failed to create profile')
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.avatar = null
  avatarPreview.value = ''
  formData.role = USER_ROLE_ID // Reset to default
}

// Navigation
const goBack = () => {
  router.push('/profiles')
}

// Check admin permissions
onMounted(() => {
  if (!authStore.isAdmin) {
    error('You do not have permission to create profiles')
    router.push('/profiles')
  }
})
</script>

<style scoped>
.create-profile-container {
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
  .create-profile-container {
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