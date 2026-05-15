<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema, loginWithDocumentSchema } from '~/schemas/auth.schema'

useSeoMeta({
  title: 'Iniciar Sesión - TuTurno',
  description: 'Accede a tu cuenta TuTurno para gestionar tus turnos digitales.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { loginAndRedirect } = useAuth()
const toast = useToast()

const loginMode = ref<'email' | 'document'>('email')

// ─── Email Form ───────────────────────────────────────────────────────────────
// Using reactive values/errors from useForm directly avoids the useField
// dual-registration bug that caused "Cannot read properties of undefined
// (reading 'length')" inside vee-validate's normalizeKeyEvent handler.
const {
  values: emailValues,
  errors: emailErrors,
  handleSubmit: handleEmailSubmit,
  isSubmitting: emailSubmitting,
  setFieldValue: setEmailField,
} = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '' },
})

// ─── Document Form ────────────────────────────────────────────────────────────
const {
  values: docValues,
  errors: docErrors,
  handleSubmit: handleDocSubmit,
  isSubmitting: docSubmitting,
  setFieldValue: setDocField,
} = useForm({
  validationSchema: toTypedSchema(loginWithDocumentSchema),
  initialValues: { documentId: '', password: '' },
})

const showPassword = ref(false)

const onEmailSubmit = handleEmailSubmit(async (values) => {
  try {
    await loginAndRedirect(values.email, values.password)
    toast.success('Bienvenido de nuevo')
  }
  catch {
    toast.error('Correo o contraseña incorrectos')
  }
})

const onDocumentSubmit = handleDocSubmit(async (values) => {
  try {
    const authStore = useAuthStore()
    const result = await $fetch('/api/auth/login-document', {
      method: 'POST',
      body: values,
    }) as {
      success: boolean
      data: {
        user: { id: string; role: string; mustChangePassword: boolean }
        mustChangePassword: boolean
      }
    }

    if (result.success) {
      // Sync the auth store with the logged-in user from document login
      await authStore.fetchUser()

      if (result.data?.mustChangePassword) {
        navigateTo('/auth/change-password')
        return
      }

      toast.success('Bienvenido de nuevo')

      if (authStore.isAdmin) return navigateTo('/admin')
      if (authStore.isOperator) return navigateTo('/operator')
      navigateTo('/app')
    }
  }
  catch {
    toast.error('Cédula o contraseña incorrectos')
  }
})
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-display font-bold text-white mb-2">Bienvenido de nuevo</h1>
      <p class="text-secondary">Ingresa a tu cuenta para gestionar tus turnos</p>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        type="button"
        class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="loginMode === 'email'
          ? 'bg-[--color-primary] text-white'
          : 'bg-white/5 text-[--text-secondary] hover:text-white'"
        @click="loginMode = 'email'"
      >
        <Icon name="lucide:mail" class="w-4 h-4 inline mr-2" />
        Correo electrónico
      </button>
      <button
        type="button"
        class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="loginMode === 'document'
          ? 'bg-[--color-primary] text-white'
          : 'bg-white/5 text-[--text-secondary] hover:text-white'"
        @click="loginMode = 'document'"
      >
        <Icon name="lucide:credit-card" class="w-4 h-4 inline mr-2" />
        Cédula
      </button>
    </div>

    <form v-if="loginMode === 'email'" class="space-y-5" @submit="onEmailSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Correo electrónico</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="lucide:mail" class="w-5 h-5 text-muted" />
          </div>
          <input
            :value="emailValues.email"
            name="email"
            type="email"
            placeholder="maria@email.com"
            autocomplete="email"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="emailErrors.email ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
            @input="setEmailField('email', ($event.target as HTMLInputElement).value)"
          >
        </div>
        <span v-if="emailErrors.email" class="text-xs text-red-400">{{ emailErrors.email }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Contraseña</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="lucide:lock" class="w-5 h-5 text-muted" />
          </div>
          <input
            :value="emailValues.password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Escribe tu contraseña"
            autocomplete="current-password"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="emailErrors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
            @input="setEmailField('password', ($event.target as HTMLInputElement).value)"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
            @click="showPassword = !showPassword"
          >
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" />
          </button>
        </div>
        <span v-if="emailErrors.password" class="text-xs text-red-400">{{ emailErrors.password }}</span>
      </div>

      <div class="flex items-center justify-between">
        <NuxtLink to="/auth/forgot-password" class="text-sm text-[--color-primary-light] hover:text-white transition-colors">
          ¿Olvidaste tu contraseña?
        </NuxtLink>
      </div>

      <button
        type="submit"
        :disabled="emailSubmitting"
        class="w-full py-3.5 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[--color-primary]/20 hover:shadow-[--color-primary]/30"
      >
        <span v-if="emailSubmitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Iniciando sesión...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          Entrar
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </span>
      </button>
    </form>

    <form v-else class="space-y-5" @submit="onDocumentSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Número de cédula</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="lucide:credit-card" class="w-5 h-5 text-muted" />
          </div>
          <input
            :value="docValues.documentId"
            name="documentId"
            type="text"
            inputmode="numeric"
            placeholder="Ej: 12345678"
            autocomplete="off"
            class="w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="docErrors.documentId ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
            @input="setDocField('documentId', ($event.target as HTMLInputElement).value)"
          >
        </div>
        <span v-if="docErrors.documentId" class="text-xs text-red-400">{{ docErrors.documentId }}</span>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-secondary">Contraseña</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="lucide:lock" class="w-5 h-5 text-muted" />
          </div>
          <input
            :value="docValues.password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Escribe tu contraseña"
            autocomplete="current-password"
            class="w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            :class="docErrors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'"
            @input="setDocField('password', ($event.target as HTMLInputElement).value)"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
            @click="showPassword = !showPassword"
          >
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5 text-[--text-muted] hover:text-white transition-colors" />
          </button>
        </div>
        <span v-if="docErrors.password" class="text-xs text-red-400">{{ docErrors.password }}</span>
      </div>

      <button
        type="submit"
        :disabled="docSubmitting"
        class="w-full py-3.5 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[--color-primary]/20 hover:shadow-[--color-primary]/30"
      >
        <span v-if="docSubmitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Iniciando sesión...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          Entrar
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
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
