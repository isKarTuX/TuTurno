import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  const accessTokenCookie = useCookie('access_token')
  if (accessTokenCookie.value) {
    await authStore.fetchUser()
  }
})