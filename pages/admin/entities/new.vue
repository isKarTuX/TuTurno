<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { createEntitySchema } from '~/schemas/entity.schema'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const router = useRouter()
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toFieldValidator(createEntitySchema),
  initialValues: {
    name: '',
    type: 'other',
    address: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    phone: undefined,
    email: undefined,
    logoUrl: undefined,
  },
})

const name = useField<string>('name')
const type = useField<string>('type')
const address = useField<string>('address')
const city = useField<string>('city')
const latitude = useField<string>('latitude')
const longitude = useField<string>('longitude')
const phone = useField<string>('phone')
const email = useField<string>('email')

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      ...values,
      latitude: values.latitude ? Number(values.latitude) : undefined,
      longitude: values.longitude ? Number(values.longitude) : undefined,
    }
    const response = await $fetch('/api/entities', {
      method: 'POST',
      body: payload,
    }) as { success: boolean; data: Entity }

    if (response.success) {
      router.push('/admin/entities')
    }
  } catch (error) {
    console.error('Error creating entity:', error)
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        class="text-[--text-secondary] hover:text-white transition-colors"
        @click="router.back()"
      >
        ← Volver
      </button>
      <h1 class="text-2xl font-display font-bold text-white">Nueva Entidad</h1>
    </div>

    <UiCard class="max-w-2xl">
      <form class="space-y-4" @submit="onSubmit">
        <UiInput
          v-model="name.value.value"
          label="Nombre"
          placeholder="Nombre de la entidad"
          :error="name.errorMessage.value"
        />

        <div>
          <label class="block text-sm text-[--text-secondary] mb-1">Tipo</label>
          <select
            v-model="type.value.value"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="eps">EPS</option>
            <option value="bank">Banco</option>
            <option value="public_office">Oficina Pública</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <UiInput
          v-model="address.value.value"
          label="Dirección"
          placeholder="Dirección completa"
          :error="address.errorMessage.value"
        />

        <UiInput
          v-model="city.value.value"
          label="Ciudad"
          placeholder="Montería"
          :error="city.errorMessage.value"
        />

        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="latitude.value.value"
            type="text"
            label="Latitud (opcional)"
            placeholder="8.7555"
          />
          <UiInput
            v-model="longitude.value.value"
            type="text"
            label="Longitud (opcional)"
            placeholder="-75.8815"
          />
        </div>

        <UiInput
          v-model="phone.value.value"
          type="tel"
          label="Teléfono (opcional)"
          placeholder="6051234567"
        />

        <UiInput
          v-model="email.value.value"
          type="email"
          label="Email (opcional)"
          placeholder="contacto@entidad.gov.co"
        />

        <div class="flex justify-end gap-4 pt-4">
          <UiButton variant="outline" type="button" @click="router.back()">
            Cancelar
          </UiButton>
          <UiButton type="submit" :loading="isSubmitting">
            Crear Entidad
          </UiButton>
        </div>
      </form>
    </UiCard>
  </div>
</template>