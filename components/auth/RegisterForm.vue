<script setup lang="ts">
import { registerSchema } from '~/schemas/auth.schema'

const { registerAndRedirect } = useAuth()

const activeTab = ref<'login' | 'register'>('register')
const registerForm = reactive({
  fullName: '',
  documentId: '',
  phone: '',
  email: '',
  password: '',
})
const errors = reactive({
  fullName: '',
  documentId: '',
  phone: '',
  email: '',
  password: '',
  terms: '',
})
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const acceptTerms = ref(false)
const passwordStrength = ref(0)

const strengthLabels = [
  'Muy débil',
  'Débil',
  'Aceptable',
  'Fuerte',
]

const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
]

const strengthTexts = [
  'text-red-400',
  'text-orange-400',
  'text-yellow-400',
  'text-green-400',
]

const passwordRequirements = ref([
  { id: 'length', label: 'Mínimo 8 caracteres', met: false },
  { id: 'number', label: 'Al menos un número', met: false },
  { id: 'upper', label: 'Una mayúscula', met: false },
  { id: 'special', label: 'Un carácter especial', met: false },
])

const checkPasswordStrength = () => {
  const pwd = registerForm.password
  let strength = 0

  passwordRequirements.value[0].met = pwd.length >= 8
  if (pwd.length >= 8) strength++

  passwordRequirements.value[1].met = /\d/.test(pwd)
  if (/\d/.test(pwd)) strength++

  passwordRequirements.value[2].met = /[A-Z]/.test(pwd)
  if (/[A-Z]/.test(pwd)) strength++

  passwordRequirements.value[3].met = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++

  passwordStrength.value = strength
}

const formatDocumentId = (e: Event) => {
  const input = e.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '').slice(0, 12)
  registerForm.documentId = input.value
}

const formatPhone = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 10)

  if (value.length > 0) {
    value = value.match(/.{1,3}/g)?.join(' ') || value
  }

  registerForm.phone = value
}

const handleRegister = async () => {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
  errorMessage.value = ''

  const result = registerSchema.safeParse(registerForm)

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    if (fieldErrors.fullName) errors.fullName = fieldErrors.fullName[0]
    if (fieldErrors.documentId) errors.documentId = fieldErrors.documentId[0]
    if (fieldErrors.phone) errors.phone = fieldErrors.phone[0]
    if (fieldErrors.email) errors.email = fieldErrors.email[0]
    if (fieldErrors.password) errors.password = fieldErrors.password[0]
    return
  }

  if (!acceptTerms.value) {
    errors.terms = 'Debes aceptar los términos para continuar'
    return
  }

  loading.value = true

  try {
    await registerAndRedirect({
      fullName: registerForm.fullName,
      documentId: registerForm.documentId,
      email: registerForm.email,
      phone: registerForm.phone.replace(/\s/g, ''),
      password: registerForm.password,
    })
    successMessage.value = 'Redirigiendo a tu cuenta...'
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    errorMessage.value = err.data?.message || err.message || 'No se pudo crear la cuenta. Intenta de nuevo.'
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
          v-if="successMessage"
          class="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-3"
        >
          <svg class="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-green-400">¡Cuenta creada!</p>
            <p class="text-sm text-green-400/80">{{ successMessage }}</p>
          </div>
        </div>
      </Transition>

      <Transition name="alert">
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-red-400">Error</p>
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
          v-if="activeTab === 'register'"
          key="register"
          class="space-y-5"
          @submit.prevent="handleRegister"
        >
          <div class="space-y-2">
            <label for="fullName" class="block text-sm font-medium text-white/80">
              Nombre completo
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                id="fullName"
                v-model="registerForm.fullName"
                type="text"
                placeholder="Como aparece en tu cédula"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
                :disabled="loading"
              >
            </div>
            <Transition name="error">
              <p v-if="errors.fullName" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.fullName }}
              </p>
            </Transition>
          </div>

          <div class="space-y-2">
            <label for="documentId" class="block text-sm font-medium text-white/80">
              Cédula de ciudadanía
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <input
                id="documentId"
                v-model="registerForm.documentId"
                type="text"
                placeholder="1XXXXXXXX"
                maxlength="12"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.documentId ? 'border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
                :disabled="loading"
                @input="formatDocumentId"
              >
            </div>
            <Transition name="error">
              <p v-if="errors.documentId" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.documentId }}
              </p>
            </Transition>
          </div>

          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-white/80">
              Celular (con WhatsApp)
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <input
                id="phone"
                v-model="registerForm.phone"
                type="tel"
                placeholder="300 123 4567"
                maxlength="13"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.phone ? 'border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
                :disabled="loading"
                @input="formatPhone"
              >
            </div>
            <Transition name="error">
              <p v-if="errors.phone" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.phone }}
              </p>
            </Transition>
            <p class="text-xs text-white/40">Ejemplo: 300 123 4567</p>
          </div>

          <div class="space-y-2">
            <label for="reg-email" class="block text-sm font-medium text-white/80">
              Correo electrónico
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="reg-email"
                v-model="registerForm.email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.email ? 'border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
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
            <label for="reg-password" class="block text-sm font-medium text-white/80">
              Contraseña
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                id="reg-password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                class="w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.password ? 'border-red-500' : 'border-white/10 focus:border-[--color-primary]'"
                :disabled="loading"
                @input="checkPasswordStrength"
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

            <div v-if="registerForm.password" class="space-y-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="passwordStrength >= i ? strengthColors[passwordStrength - 1] : 'bg-white/10'"
                />
              </div>
              <p class="text-xs" :class="passwordStrength > 0 ? strengthTexts[passwordStrength - 1] : 'text-white/40'">
                {{ passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Muy débil' }}
              </p>
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

          <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5">
            <div
              v-for="req in passwordRequirements"
              :key="req.id"
              class="flex items-center gap-2 text-xs"
              :class="req.met ? 'text-green-400' : 'text-white/30'"
            >
              <svg v-if="req.met" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ req.label }}
            </div>
          </div>

          <div class="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              :aria-checked="acceptTerms"
              class="relative mt-0.5 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center shrink-0"
              :class="acceptTerms ? 'bg-[--color-primary] border-[--color-primary]' : 'border-white/30 hover:border-white/50'"
              @click="acceptTerms = !acceptTerms"
            >
              <svg v-if="acceptTerms" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <span class="text-sm text-white/60">
              Acepto los
              <a href="/terminos" class="text-[--color-primary] hover:text-[--color-primary-light]">Términos de servicio</a>
              y la
              <a href="/privacidad" class="text-[--color-primary] hover:text-[--color-primary-light]">Política de privacidad</a>
            </span>
          </div>
          <Transition name="error">
            <p v-if="errors.terms" class="text-xs text-red-400 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errors.terms }}
            </p>
          </Transition>

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading || !acceptTerms"
          >
            {{ loading ? 'Creando cuenta...' : 'Crear mi cuenta' }}
          </UiButton>
        </form>
      </Transition>
    </div>

    <p class="mt-8 text-center text-sm text-white/40">
      ¿Ya tienes cuenta?
      <button
        type="button"
        class="text-[--color-primary] hover:text-[--color-primary-light] transition-colors font-medium"
        @click="activeTab = 'login'"
      >
        Inicia sesión
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