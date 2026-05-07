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
      <UiInput
        v-model="email.value.value"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        :error="email.errorMessage.value"
      />

      <UiInput
        v-model="password.value.value"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        :error="password.errorMessage.value"
      />

      <UiButton type="submit" :loading="isSubmitting" class="w-full">
        {{ isSubmitting ? 'Iniciando sesión...' : 'Entrar' }}
      </UiButton>
    </form>

    <p class="text-center text-[--text-secondary] mt-6">
      ¿No tienes cuenta?
      <NuxtLink to="/auth/register" class="text-[--color-primary-light] hover:underline">
        Crear una cuenta
      </NuxtLink>
    </p>
  </div>
</template>