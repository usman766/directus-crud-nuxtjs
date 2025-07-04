export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useDirectusApi()
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page
    return navigateTo('/login')
  }
}) 