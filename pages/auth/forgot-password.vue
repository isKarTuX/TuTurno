<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: 'auth',
})

const email = ref('')
const isSubmitted = ref(false)
const isSubmitting = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value) {
    error.value = 'El email es requerido'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    isSubmitted.value = true
  } catch (e) {
    error.value = 'No se encontró una cuenta con ese email'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="glass p-8 rounded-xl max-w-md w-full">
    <template v-if="!isSubmitted">
      <h2 class="text-2xl font-display font-bold text-white mb-2">Recuperar Contraseña</h2>
      <p class="text-[--text-secondary] mb-6">
        Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
          v-model="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          :error="error"
        />

        <UiButton type="submit" :loading="isSubmitting" class="w-full">
          Enviar instrucciones
        </UiButton>
      </form>

      <p class="text-center text-[--text-secondary] mt-6">
        ¿Recordaste tu contraseña?
        <NuxtLink to="/auth/login" class="text-[--color-primary-light] hover:underline">
          Iniciar sesión
        </NuxtLink>
      </p>
    </template>

    <template v-else>
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-display font-bold text-white mb-2">Email enviado</h2>
        <p class="text-[--text-secondary]">
          Hemos enviado instrucciones a <strong>{{ email }}</strong>. Revisa tu bandeja de entrada.
        </p>
      </div>

      <p class="text-center text-[--text-secondary] mt-6">
        ¿No recibiste el email?
        <button @click="isSubmitted = false" class="text-[--color-primary-light] hover:underline">
          Intentar de nuevo
        </button>
      </p>
    </template>
  </div>
</template>