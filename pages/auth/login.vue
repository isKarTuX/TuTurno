<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { loginSchema } from '~/schemas/auth.schema'

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

const onSubmit = handleSubmit(async (values) => {
  try {
    await loginAndRedirect(values.email, values.password)
  } catch (error) {
    console.error('Login failed:', error)
  }
})
</script>

<template>
  <div class="glass p-8 rounded-xl">
    <h2 class="text-2xl font-display font-bold text-white mb-6">Iniciar Sesión</h2>

    <form @submit="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm text-[--text-secondary] mb-1">Correo electrónico</label>
        <input
          v-model="email.value.value"
          name="email"
          type="email"
          placeholder="tu@email.com"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
        />
        <span v-if="email.errorMessage.value" class="text-sm text-red-400 mt-1">{{ email.errorMessage.value }}</span>
      </div>

      <div>
        <label class="block text-sm text-[--text-secondary] mb-1">Contraseña</label>
        <input
          v-model="password.value.value"
          name="password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
        />
        <span v-if="password.errorMessage.value" class="text-sm text-red-400 mt-1">{{ password.errorMessage.value }}</span>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-3 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {{ isSubmitting ? 'Iniciando sesión...' : 'Entrar' }}
      </button>
    </form>

    <p class="text-center text-[--text-secondary] mt-6">
      ¿No tienes cuenta?
      <NuxtLink to="/auth/register" class="text-[--color-primary-light] hover:underline">
        Crear una cuenta
      </NuxtLink>
    </p>
  </div>
</template>