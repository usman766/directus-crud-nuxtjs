// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // Enable Pinia for state management
  modules: [
    '@pinia/nuxt',
  ],
  
  // Configure Element Plus
  css: [
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css'
  ],
  
  // Build configuration for Element Plus
  build: {
    transpile: ['element-plus/es']
  },
  
  // Auto-imports
  imports: {
    dirs: ['composables', 'stores']
  },
  
  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
      directusProjectId: process.env.DIRECTUS_PROJECT_ID || 'your-project-id'
    }
  },
  
  // Vite configuration for Element Plus
  vite: {
    optimizeDeps: {
      include: ['element-plus/es']
    }
  }
})
