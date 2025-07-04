<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>Login to User Profile System</h2>
        </div>
      </template>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="loginForm.email"
            type="email"
            placeholder="Enter your email"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="authStore.isLoading"
            @click="handleLogin"
            style="width: 100%"
          >
            {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- Error Message -->
      <el-alert
        v-if="authStore.error"
        :title="authStore.error"
        type="error"
        show-icon
        closable
        @close="authStore.clearError"
        style="margin-top: 16px"
      />
      
      <!-- Demo Credentials -->
      <div class="demo-credentials">
        <el-divider>Demo Credentials</el-divider>
        <p><strong>Admin User:</strong></p>
        <p>Email: admin@example.com</p>
        <p>Password: admin</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { AuthCredentials } from '~/types'

// Page meta
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// Message composable
const { success } = useMessage()

// Form refs
const loginFormRef = ref<FormInstance>()

// Form data
const loginForm = reactive<AuthCredentials>({
  email: '',
  password: ''
})

// Form validation rules
const loginRules: FormRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 3, message: 'Password must be at least 3 characters', trigger: 'blur' }
  ]
}

// Login handler
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    await authStore.login(loginForm)
    
    // Show success message
    success('Login successful!')
    
    // Redirect to profiles page
    await router.push('/profiles')
  } catch (error: any) {
    // Error is already handled in the store
    console.error('Login error:', error)
  }
}

// Auto-fill demo credentials for testing
const fillDemoCredentials = (isAdmin: boolean = true) => {
  if (isAdmin) {
    loginForm.email = 'admin@example.com'
    loginForm.password = 'admin123'
  } else {
    loginForm.email = 'user@example.com'
    loginForm.password = 'user123'
  }
}

// Initialize auth on page load
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-weight: 600;
}

.demo-credentials {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
}

.demo-credentials p {
  margin: 4px 0;
  color: #606266;
}

.demo-credentials strong {
  color: #303133;
}
</style> 