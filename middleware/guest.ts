export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useDirectusApi()
  
  // Check if user is already authenticated
  if (isAuthenticated()) {
    // Redirect to profiles page
    return navigateTo('/profiles')
  }
}) 