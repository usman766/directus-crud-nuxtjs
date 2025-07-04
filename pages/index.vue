<template>
  <div class="index-container">
    <div class="loading-content">
      <el-skeleton :rows="3" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  middleware: 'auth-check'
})

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// Check authentication and redirect
onMounted(async () => {
  // Wait a bit for auth to initialize
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (authStore.isAuthenticated) {
    await router.push('/profiles')
  } else {
    await router.push('/login')
  }
})
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}
</style> 