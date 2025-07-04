export default defineNuxtRouteMiddleware((to, from) => {
  // This middleware just checks auth status without redirecting
  // The page will handle the redirect logic
  const { isAuthenticated } = useDirectusApi()
  
  // You can add any additional logic here if needed
  // For now, we just let the page handle the redirect
}) 