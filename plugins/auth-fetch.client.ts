import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  const accessTokenCookie = useCookie('access_token')
  if (accessTokenCookie.value) {
    await authStore.fetchUser()
  }

  const refreshCookie = useCookie('refresh_token')
  if (refreshCookie.value && !accessTokenCookie.value) {
    try {
      await authStore.refresh()
    } catch {
      refreshCookie.value = null
    }
  }

  const router = useRouter()

  router.beforeEach(async (to) => {
    if (to.path.startsWith('/app') ||
        to.path.startsWith('/operator') ||
        to.path.startsWith('/admin')) {
      if (!accessTokenCookie.value && refreshCookie.value) {
        try {
          await authStore.refresh()
        } catch {
          refreshCookie.value = null
          return '/auth/login'
        }
      }
    }
    return undefined
  })
})