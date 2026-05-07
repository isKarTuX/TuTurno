import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => user.value?.role)
  const isAdmin = computed(() => role.value === 'admin')
  const isOperator = computed(() => role.value === 'operator' || role.value === 'admin')
  const isCitizen = computed(() => role.value === 'citizen')

  async function login(email: string, password: string) {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }) as { success: boolean; data: { user: User } }

    if (response.success) {
      user.value = response.data.user
    }
  }

  async function register(data: {
    fullName: string
    documentId: string
    email: string
    phone: string
    password: string
  }) {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: data,
    }) as { success: boolean; data: { user: User } }

    if (response.success) {
      user.value = response.data.user
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
    }
  }

  async function refresh() {
    try {
      await $fetch('/api/auth/refresh', { method: 'POST' })
    } catch {
      user.value = null
    }
  }

  async function fetchUser() {
    try {
      const response = await $fetch('/api/auth/me') as { success: boolean; data: { user: User } }
      if (response.success) {
        user.value = response.data.user
      }
    } catch {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    role,
    isAdmin,
    isOperator,
    isCitizen,
    login,
    register,
    logout,
    refresh,
    fetchUser,
  }
})