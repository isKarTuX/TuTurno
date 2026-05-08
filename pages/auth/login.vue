<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { loginSchema } from '~/schemas/auth.schema'

useSeoMeta({
  title: 'Iniciar Sesión - TuTurno',
  description: 'Accede a tu cuenta TuTurno para gestionar tus turnos digitales.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

definePageMeta({
  layout: 'auth',
})

const { loginAndRedirect } = useAuth()
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toFieldValidator(loginSchema),
  initialValues: {
    email: '',
    password: '',
  },
})

const email = useField<string>('email')
const password = useField<string>('password')

const showPassword = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    await loginAndRedirect(values.email, values.password)
  } catch (error) {
    console.error('Login failed:', error)
  }
})
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-display font-bold text-white mb-2">Bienvenido de nuevo</h1>
      <p class="text-secondary">Ingresa a tu cuenta para gestionar tus turnos</p>
    </div>

    <form class="space-y-5" @submit="onSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Correo electrónico</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <input
            v-model="email.value.value"
            name="email"
            type="email"
            placeholder="maria@email.com"
            autocomplete="email"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="email.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
        </div>
        <span v-if="email.errorMessage.value" class="text-xs text-red-400">{{ email.errorMessage.value }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Contraseña</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <input
            v-model="password.value.value"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Escribe tu contraseña"
            autocomplete="current-password"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="password.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c4.638 0 8.573-3.007 9.963-7.178.07-.207.07-.431 0-.639A10.475 10.475 0 0012 4.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.12 13.12L19.05 19.05" />
            </svg>
          </button>
        </div>
        <span v-if="password.errorMessage.value" class="text-xs text-red-400">{{ password.errorMessage.value }}</span>
      </div>

      <div class="flex items-center justify-between">
        <NuxtLink to="/auth/forgot-password" class="text-sm text-[--color-primary-light] hover:text-white transition-colors">
          ¿Olvidaste tu contraseña?
        </NuxtLink>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-3.5 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[--color-primary]/20 hover:shadow-[--color-primary]/30"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Iniciando sesión...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          Entrar
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </button>
    </form>

    <p class="text-center text-secondary mt-8">
      ¿Primera vez?
      <NuxtLink to="/auth/register" class="text-primary-light hover:text-white font-medium transition-colors">
        Crea tu cuenta gratis
      </NuxtLink>
    </p>
  </div>
</template>
