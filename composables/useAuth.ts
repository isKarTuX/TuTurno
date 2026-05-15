export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

async function loginAndRedirect(email: string, password: string) {
    const result = await store.login(email, password)

    if (!result) {
      throw new Error('Credenciales incorrectas')
    }

    if ('mustChangePassword' in result && result.mustChangePassword) {
      return router.push('/auth/change-password')
    }
    if (store.isAdmin) return router.push('/admin')
    if (store.isOperator) return router.push('/operator')
    return router.push('/app')
  }

  async function registerAndRedirect(data: {
    fullName: string
    documentId: string
    email: string
    phone: string
    password: string
  }) {
    await store.register(data)
    return router.push('/app')
  }

  async function logoutAndRedirect() {
    await store.logout()
    return router.push('/auth/login')
  }

  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    role: computed(() => store.role),
    isAdmin: computed(() => store.isAdmin),
    isOperator: computed(() => store.isOperator),
    isCitizen: computed(() => store.isCitizen),
    login: store.login,
    register: store.register,
    logout: store.logout,
    loginAndRedirect,
    registerAndRedirect,
    logoutAndRedirect,
  }
}