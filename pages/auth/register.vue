<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { registerSchema } from '~/schemas/auth.schema'

useSeoMeta({
  title: 'Crear Cuenta - TuTurno',
  description: 'Regístrate en TuTurno para solicitar turnos digitales sin filas.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

definePageMeta({
  layout: 'auth',
})

const { registerAndRedirect } = useAuth()
const toast = useToast()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toFieldValidator(registerSchema),
  initialValues: {
    fullName: '',
    documentId: '',
    email: '',
    phone: '',
    password: '',
  },
})

const fullName = useField<string>('fullName')
const documentId = useField<string>('documentId')
const email = useField<string>('email')
const phone = useField<string>('phone')
const password = useField<string>('password')

const showPassword = ref(false)

const passwordRequirements = computed(() => {
  const pwd = password.value.value || ''
  return {
    length: pwd.length >= 8,
    number: /\d/.test(pwd),
    uppercase: /[A-Z]/.test(pwd),
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await registerAndRedirect(values)
    toast.success('Cuenta creada exitosamente')
  } catch {
    toast.error('No se pudo crear la cuenta. Intenta de nuevo.')
  }
})

function formatPhone(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 10) value = value.slice(0, 10)
  if (value.length > 7) {
    value = value.slice(0, 7) + ' ' + value.slice(7)
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ' ' + value.slice(3)
  }
  phone.value.value = value
}
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-display font-bold text-white mb-2">Crea tu cuenta gratis</h1>
      <p class="text-secondary">En segundos puedes pedir tu primer turno</p>
    </div>

    <form class="space-y-5" @submit="onSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Tu nombre</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.503 7.503 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <input
            v-model="fullName.value.value"
            name="fullName"
            type="text"
            placeholder="María del Pilar Gómez"
            autocomplete="name"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="fullName.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
        </div>
        <span v-if="fullName.errorMessage.value" class="text-xs text-red-400">{{ fullName.errorMessage.value }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Número de cédula</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 0v3.75m-3 0h3" />
            </svg>
          </div>
          <input
            v-model="documentId.value.value"
            name="documentId"
            type="text"
            placeholder="1234567890"
            inputmode="numeric"
            maxlength="10"
            autocomplete="off"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="documentId.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
        </div>
        <span v-if="documentId.errorMessage.value" class="text-xs text-red-400">{{ documentId.errorMessage.value }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Tu correo</label>
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
        <label class="block text-sm font-medium text-secondary">Celular</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 4.5a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V4.5zm3 0a.75.75 0 01.75-.75h6.75a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H6.75A.75.75 0 016 6.75V4.5zm3 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V4.5zm3 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H12.75A.75.75 0 0112 6.75V4.5zM19.5 4.5a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75V4.5zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75V7.5a.75.75 0 01-.75.75h-2.25A.75.75 0 0119.5 7.5V7.5zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V10.5zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H19.5a.75.75 0 01-.75-.75V13.5z" />
            </svg>
          </div>
          <input
            v-model="phone.value.value"
            name="phone"
            type="tel"
            placeholder="300 123 4567"
            autocomplete="tel"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="phone.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
            @input="formatPhone"
          >
        </div>
        <span v-if="phone.errorMessage.value" class="text-xs text-red-400">{{ phone.errorMessage.value }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Crea una contraseña</label>
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
            placeholder="Crea una contraseña segura"
            autocomplete="new-password"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="password.errorMessage.value ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" class="w-5 h-5 text-muted hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-muted hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c4.638 0 8.573-3.007 9.963-7.178.07-.207.07-.431 0-.639A10.475 10.475 0 0012 4.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.12 13.12L19.05 19.05" />
            </svg>
          </button>
        </div>
        <span v-if="password.errorMessage.value" class="text-xs text-red-400">{{ password.errorMessage.value }}</span>

        <div class="mt-2 space-y-1.5">
          <div class="flex items-center gap-2 text-xs">
            <svg v-if="passwordRequirements.length" class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span :class="passwordRequirements.length ? 'text-emerald-400' : 'text-muted'">Mínimo 8 caracteres</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <svg v-if="passwordRequirements.number" class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span :class="passwordRequirements.number ? 'text-emerald-400' : 'text-muted'">Al menos un número</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <svg v-if="passwordRequirements.uppercase" class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span :class="passwordRequirements.uppercase ? 'text-emerald-400' : 'text-muted'">Al menos una mayúscula</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Creando tu cuenta...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          Crear mi cuenta
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </button>
    </form>

    <p class="text-center text-secondary mt-8">
      ¿Ya tienes cuenta?
      <NuxtLink to="/auth/login" class="text-primary-light hover:text-white font-medium transition-colors">
        Inicia sesión
      </NuxtLink>
    </p>
  </div>
</template>
