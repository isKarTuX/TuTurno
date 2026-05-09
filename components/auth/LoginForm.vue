<script setup lang="ts">
import { loginSchema } from '~/schemas/auth.schema'
import type { LoginInput } from '~/schemas/auth.schema'

interface Props {
  redirectTo?: string
}

withDefaults(defineProps<Props>(), {
  redirectTo: '/app',
})

const { loginAndRedirect } = useAuth()

const activeTab = ref<'login' | 'register'>('login')
const loginForm = reactive({
  email: '',
  password: '',
})
const errors = reactive({
  email: '',
  password: '',
})
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  errors.email = ''
  errors.password = ''
  errorMessage.value = ''

  const result = loginSchema.safeParse(loginForm)

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    if (fieldErrors.email) errors.email = fieldErrors.email[0]
    if (fieldErrors.password) errors.password = fieldErrors.password[0]
    return
  }

  const { email, password } = result.data as LoginInput

  loading.value = true

  try {
    await loginAndRedirect(email, password)
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    errorMessage.value = err.data?.message || err.message || 'Credenciales incorrectas. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'switch-tab', tab: 'login' | 'register'): void
}>()

watch(activeTab, (tab) => {
  emit('switch-tab', tab)
})
</script>

<template>
  <div class="w-full max-w-[400px] mx-auto">
    <div class="flex gap-1 p-1 mb-8 rounded-2xl bg-white/5">
      <button
        class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === 'login' ? 'bg-white text-[--color-bg-base]' : 'text-white/60 hover:text-white'"
        @click="activeTab = 'login'"
      >
        Iniciar sesión
      </button>
      <button
        class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === 'register' ? 'bg-white text-[--color-bg-base]' : 'text-white/60 hover:text-white'"
        @click="activeTab = 'register'"
      >
        Crear cuenta
      </button>
    </div>

    <div class="relative">
      <Transition name="alert">
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-red-400">Error de autenticación</p>
            <p class="text-sm text-red-400/80">{{ errorMessage }}</p>
          </div>
          <button
            class="ml-auto -mr-1 -mt-1 p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            @click="errorMessage = ''"
          >
            <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Transition>

      <Transition name="tab" mode="out-in">
        <form
          v-if="activeTab === 'login'"
          key="login"
          class="space-y-5"
          @submit.prevent="handleLogin"
        >
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-white/80">
              Correo electrónico
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
                :disabled="loading"
              >
            </div>
            <Transition name="error">
              <p v-if="errors.email" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.email }}
              </p>
            </Transition>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-white/80">
                Contraseña
              </label>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-xs text-[--color-primary] hover:text-[--color-primary-light] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </NuxtLink>
            </div>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
                :disabled="loading"
              >
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <Transition name="error">
              <p v-if="errors.password" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.password }}
              </p>
            </Transition>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              role="checkbox"
              :aria-checked="rememberMe"
              class="relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg-base]"
              :class="rememberMe ? 'bg-[--color-primary]' : 'bg-white/10'"
              @click="rememberMe = !rememberMe"
            >
              <span
                class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                :class="rememberMe ? 'translate-x-4' : 'translate-x-0'"
              />
            </button>
            <span class="text-sm text-white/60">Recordarme por 7 días</span>
          </div>

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </UiButton>

          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10" />
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 text-xs text-white/30 bg-transparent">o continúa con</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary] cursor-not-allowed opacity-50"
              disabled
              title="Próximamente"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              <span class="text-sm text-white/60">Google</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary] cursor-not-allowed opacity-50"
              disabled
              title="Próximamente"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              <span class="text-sm text-white/60">GitHub</span>
            </button>
          </div>
        </form>
      </Transition>
    </div>

    <p class="mt-8 text-center text-sm text-white/40">
      ¿No tienes cuenta?
      <button
        type="button"
        class="text-[--color-primary] hover:text-[--color-primary-light] transition-colors font-medium"
        @click="activeTab = 'register'"
      >
        Regístrate gratis
      </button>
    </p>
  </div>
</template>

<style scoped>
.tab-enter-active,
.tab-leave-active {
  transition: all 200ms var(--ease-out);
}
.tab-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.alert-enter-active,
.alert-leave-active {
  transition: all 200ms var(--ease-out);
}
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.error-enter-active,
.error-leave-active {
  transition: all 150ms var(--ease-out);
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

button[type="submit"]:active:not(:disabled) {
  transform: scale(0.97);
}
</style>