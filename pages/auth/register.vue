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

    <form @submit="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm text-[--text-secondary] mb-1">Nombre completo</label>
        <input
          v-model="fullName.value.value"
          name="fullName"
          type="text"
          placeholder="Juan Pérez"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
        />
        <span v-if="fullName.errorMessage.value" class="text-sm text-red-400 mt-1">{{ fullName.errorMessage.value }}</span>
      </div>

      <div>
        <label class="block text-sm text-[--text-secondary] mb-1">Cédula de ciudadanía</label>
        <input
          v-model="documentId.value.value"
          name="documentId"
          type="text"
          placeholder="12345678"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
        />
        <span v-if="documentId.errorMessage.value" class="text-sm text-red-400 mt-1">{{ documentId.errorMessage.value }}</span>
      </div>

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
        <label class="block text-sm text-[--text-secondary] mb-1">Teléfono (3001234567)</label>
        <input
          v-model="phone.value.value"
          name="phone"
          type="tel"
          placeholder="3001234567"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
        />
        <span v-if="phone.errorMessage.value" class="text-sm text-red-400 mt-1">{{ phone.errorMessage.value }}</span>
      </div>

      <div>
        <label class="block text-sm text-[--text-secondary] mb-1">Contraseña</label>
        <input
          v-model="password.value.value"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres con número"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
        />
        <span v-if="password.errorMessage.value" class="text-sm text-red-400 mt-1">{{ password.errorMessage.value }}</span>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-3 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
      </button>
    </form>

    <p class="text-center text-[--text-secondary] mt-6">
      ¿Ya tienes cuenta?
      <NuxtLink to="/auth/login" class="text-[--color-primary-light] hover:underline">
        Iniciar sesión
      </NuxtLink>
    </p>
  </div>
</template>