<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { registerSchema } from '~/schemas/auth.schema'

const { registerAndRedirect } = useAuth()

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

const onSubmit = handleSubmit(async (values) => {
  try {
    await registerAndRedirect(values)
  } catch (error) {
    console.error('Registration failed:', error)
  }
})
</script>

<template>
  <div class="glass p-8 rounded-xl">
    <h2 class="text-2xl font-display font-bold text-white mb-6">Crear Cuenta</h2>

    <form class="space-y-4" @submit="onSubmit">
      <UiInput
        v-model="fullName.value.value"
        name="fullName"
        type="text"
        label="Nombre completo"
        placeholder="Juan Pérez"
        :error="fullName.errorMessage.value"
      />

      <UiInput
        v-model="documentId.value.value"
        name="documentId"
        type="text"
        label="Cédula de ciudadanía"
        placeholder="12345678"
        :error="documentId.errorMessage.value"
      />

      <UiInput
        v-model="email.value.value"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        :error="email.errorMessage.value"
      />

      <UiInput
        v-model="phone.value.value"
        name="phone"
        type="tel"
        label="Teléfono (3001234567)"
        placeholder="3001234567"
        :error="phone.errorMessage.value"
      />

      <UiInput
        v-model="password.value.value"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Mínimo 8 caracteres con número"
        :error="password.errorMessage.value"
      />

      <UiButton type="submit" :loading="isSubmitting" class="w-full">
        {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
      </UiButton>
    </form>

    <p class="text-center text-[--text-secondary] mt-6">
      ¿Ya tienes cuenta?
      <NuxtLink to="/auth/login" class="text-[--color-primary-light] hover:underline">
        Iniciar sesión
      </NuxtLink>
    </p>
  </div>
</template>