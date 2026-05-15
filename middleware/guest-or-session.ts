export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  const { documentId: sessionDocumentId } = useTurnSession()

  if (auth.isAuthenticated || sessionDocumentId.value) {
    return navigateTo('/app')
  }
})