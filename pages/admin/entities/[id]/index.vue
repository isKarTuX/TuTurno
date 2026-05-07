<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toFieldValidator } from '@vee-validate/zod'
import { updateEntitySchema } from '~/schemas/entity.schema'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const entityId = route.params.id as string

const { data: entity, pending, refresh } = await useAsyncData(
  `entity-${entityId}`,
  () => $fetch(`/api/entities/${entityId}`) as Promise<{ success: boolean; data: any }>,
  { default() { return null } }
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toFieldValidator(updateEntitySchema),
})

const name = useField<string>('name')
const type = useField<string>('type')
const address = useField<string>('address')
const city = useField<string>('city')
const phone = useField<string>('phone')
const email = useField<string>('email')
const isActive = useField<boolean>('isActive')

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await $fetch(`/api/entities/${entityId}`, {
      method: 'PATCH',
      body: values,
    }) as { success: boolean }

    if (response.success) {
      refresh()
    }
  } catch (error) {
    console.error('Error updating entity:', error)
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        @click="router.back()"
        class="text-[--text-secondary] hover:text-white transition-colors"
      >
        ← Volver
      </button>
      <h1 class="text-2xl font-display font-bold text-white">Editar Entidad</h1>
    </div>

    <div v-if="pending" class="glass p-8 rounded-xl">
      <UiSkeleton height="2rem" width="200px" class="mb-4" />
      <UiSkeleton height="1rem" class="mb-2" />
      <UiSkeleton height="1rem" width="60%" />
    </div>

    <UiCard v-else-if="entity?.data" class="max-w-2xl">
      <form @submit="onSubmit" class="space-y-4">
        <UiInput
          :model-value="String(entity.data.name)"
          label="Nombre"
          placeholder="Nombre de la entidad"
          :error="name.errorMessage.value"
          @update:model-value="name.value.value = $event"
        />

        <div>
          <label class="block text-sm text-[--text-secondary] mb-1">Tipo</label>
          <select
            :value="entity.data.type"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            @change="type.value.value = ($event.target as HTMLSelectElement).value"
          >
            <option value="eps">EPS</option>
            <option value="bank">Banco</option>
            <option value="public_office">Oficina Pública</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <UiInput
          :model-value="String(entity.data.address)"
          label="Dirección"
          placeholder="Dirección completa"
          :error="address.errorMessage.value"
          @update:model-value="address.value.value = $event"
        />

        <UiInput
          :model-value="String(entity.data.city)"
          label="Ciudad"
          placeholder="Montería"
          :error="city.errorMessage.value"
          @update:model-value="city.value.value = $event"
        />

        <UiInput
          :model-value="String(entity.data.phone ?? '')"
          type="tel"
          label="Teléfono (opcional)"
          placeholder="6051234567"
          :error="phone.errorMessage.value"
          @update:model-value="phone.value.value = $event"
        />

        <UiInput
          :model-value="String(entity.data.email ?? '')"
          type="email"
          label="Email (opcional)"
          placeholder="contacto@entidad.gov.co"
          :error="email.errorMessage.value"
          @update:model-value="email.value.value = $event"
        />

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="entity.data.isActive"
            @change="isActive.value.value = ($event.target as HTMLInputElement).checked"
            class="w-4 h-4 rounded border-white/20 bg-white/5 text-[--color-primary] focus:ring-[--color-primary]"
          />
          <label class="text-sm text-white">Entidad activa</label>
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <UiButton variant="outline" type="button" @click="router.back()">
            Cancelar
          </UiButton>
          <UiButton type="submit" :loading="isSubmitting">
            Guardar Cambios
          </UiButton>
        </div>
      </form>

      <div class="mt-8 pt-8 border-t border-white/10">
        <h3 class="text-lg font-semibold text-white mb-4">Servicios</h3>
        <div v-if="entity.data.services?.length" class="space-y-2">
          <div
            v-for="service in entity.data.services"
            :key="service.id"
            class="flex items-center justify-between bg-white/5 p-3 rounded-lg"
          >
            <div>
              <p class="text-white">{{ service.name }}</p>
              <p class="text-xs text-[--text-muted]">
                {{ service.openTime }} - {{ service.closeTime }}
              </p>
            </div>
            <UiBadge :variant="service.isPaused ? 'warning' : 'success'">
              {{ service.isPaused ? 'Pausado' : 'Activo' }}
            </UiBadge>
          </div>
        </div>
        <p v-else class="text-[--text-muted]">No hay servicios definidos</p>
      </div>
    </UiCard>
  </div>
</template>