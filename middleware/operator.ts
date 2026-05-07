export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  if (auth.role !== 'operator' && auth.role !== 'admin') {
    return navigateTo('/app')
  }
})