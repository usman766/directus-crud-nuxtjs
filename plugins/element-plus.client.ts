import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Install Element Plus
  nuxtApp.vueApp.use(ElementPlus)
  
  // Register all icons
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    nuxtApp.vueApp.component(key, component)
  }
}) 