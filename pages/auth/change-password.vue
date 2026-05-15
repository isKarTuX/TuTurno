<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { changePasswordSchema } from '~/schemas/auth.schema'

useSeoMeta({
  title: 'Cambiar Contraseña - TuTurno',
  description: 'Debes cambiar tu contraseña para continuar.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

const router = useRouter()
const toast = useToast()
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toFieldValidator(changePasswordSchema),
  initialValues: {
    currentPassword: '',
    newPassword: '',
  },
})

const currentPassword = useField<string>('currentPassword')
const newPassword = useField<string>('newPassword')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: values,
    })
    toast.success('Contraseña actualizada correctamente')
    router.push('/app')
  } catch {
    toast.error('No se pudo cambiar la contraseña')
  }
})
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <div class="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h1 class="text-3xl font-display font-bold text-white mb-2">Cambiar Contraseña</h1>
      <p class="text-secondary">Por seguridad, debes crear una nueva contraseña</p>
    </div>

    <form class="space-y-5" @submit="onSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Contraseña Actual</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <input
            v-model="currentPassword.value.value"
            name="currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            placeholder="Tu contraseña actual"
            autocomplete="current-password"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="currentPassword.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
            @click="showCurrentPassword = !showCurrentPassword"
          >
            <svg v-if="!showCurrentPassword" class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c4.638 0 8.573-3.007 9.963-7.178.07-.207.07-.431 0-.639A10.475 10.475 0 0012 4.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.12 13.12L19.05 19.05" />
            </svg>
          </button>
        </div>
        <span v-if="currentPassword.errorMessage.value" class="text-xs text-red-400">{{ currentPassword.errorMessage.value }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Nueva Contraseña</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            v-model="newPassword.value.value"
            name="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Mínimo 8 caracteres, un número y una mayúscula"
            autocomplete="new-password"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="newPassword.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
            @click="showNewPassword = !showNewPassword"
          >
            <svg v-if="!showNewPassword" class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c4.638 0 8.573-3.007 9.963-7.178.07-.207.07-.431 0-.639A10.475 10.475 0 0012 4.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.12 13.12L19.05 19.05" />
            </svg>
          </button>
        </div>
        <span v-if="newPassword.errorMessage.value" class="text-xs text-red-400">{{ newPassword.errorMessage.value }}</span>
      </div>

      <div class="bg-white/5 rounded-lg p-4 border border-white/10">
        <p class="text-xs text-[--text-muted] mb-2">La nueva contraseña debe tener:</p>
        <ul class="space-y-1 text-xs text-[--text-muted]">
          <li class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Al menos 8 caracteres
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Al menos un número
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Al menos una mayúscula
          </li>
        </ul>
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
          Guardando...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          Guardar Nueva Contraseña
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </button>
    </form>
  </div>
</template>