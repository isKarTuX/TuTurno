<script setup lang="ts">
const email = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)
const submittedEmail = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handleSubmit = async () => {
  error.value = ''

  if (!email.value) {
    error.value = 'El correo es requerido'
    return
  }

  if (!emailRegex.test(email.value)) {
    error.value = 'Ingresa un correo válido'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    submittedEmail.value = email.value
    success.value = true
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err.data?.message || 'No pudimos enviar el correo. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  if (!submittedEmail.value) return

  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: submittedEmail.value },
    })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err.data?.message || 'No pudimos reenviar el correo. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[400px] mx-auto">
    <NuxtLink
      to="/auth/login"
      class="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Volver a iniciar sesión
    </NuxtLink>

    <Transition name="fade" mode="out-in">
      <div v-if="success" key="success" class="text-center py-8">
        <div class="w-20 h-20 mx-auto mb-6 rounded-3xl bg-green-500/10 flex items-center justify-center">
          <svg class="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Revisa tu correo</h1>
        <p class="text-white/60 mb-8">
          Enviamos un enlace de recuperación a<br >
          <span class="text-white font-medium">{{ submittedEmail }}</span>
        </p>
        <p class="text-sm text-white/40">
          ¿No recibiste el correo?
          <button
            class="text-[--color-primary] hover:text-[--color-primary-light] transition-colors"
            :disabled="loading"
            @click="resendEmail"
          >
            Reenviar
          </button>
        </p>
        <p v-if="error" class="mt-4 text-sm text-red-400">{{ error }}</p>
      </div>

      <div v-else key="form">
        <h1 class="text-2xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h1>
        <p class="text-white/60 mb-8">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label for="reset-email" class="block text-sm font-medium text-white/80">
              Correo electrónico
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="reset-email"
                v-model="email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-[--color-primary]"
                :class="error ? 'border-red-500' : 'border-white/10'"
                :disabled="loading"
              >
            </div>
            <Transition name="error">
              <p v-if="error" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ error }}
              </p>
            </Transition>
          </div>

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
          >
            {{ loading ? 'Enviando...' : 'Enviar enlace' }}
          </UiButton>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 200ms var(--ease-out);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

button:active:not(:disabled) {
  transform: scale(0.98);
}
</style>