<script setup lang="ts">
import type { Service, Turn } from '~/types'
import { z } from 'zod'
import { toFieldValidator } from '@vee-validate/zod'

definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const route = useRoute()
const serviceId = route.params.serviceId as string

const { data: serviceData, pending: servicePending, error: serviceError } = await useAsyncData(
  `service-${serviceId}`,
  () => $fetch(`/api/services/${serviceId}`) as Promise<{ success: boolean; data: Service }>
)

const service = computed(() => serviceData.value?.data)

const createTurnSchema = z.object({
  serviceId: z.string().uuid(),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toFieldValidator(createTurnSchema),
  initialValues: {
    serviceId,
  },
})

const turn = ref<Turn | null>(null)
const submitError = ref<string | null>(null)

const onSubmit = handleSubmit(async () => {
  submitError.value = null
  try {
    const result = await $fetch('/api/turns', {
      method: 'POST',
      body: { serviceId },
    })
    turn.value = (result as { success: boolean; data: Turn }).data
  } catch (error: unknown) {
    const err = error as { data?: { error?: { message?: string } } }
    submitError.value = err?.data?.error?.message || 'Error al solicitar turno'
  }
})
</script>

<template>
  <div>
    <NuxtLink :to="`/app/entities/${service?.entityId}`" class="text-sm text-[--text-secondary] hover:text-white mb-4 inline-flex items-center gap-1">
      ← Volver a entidad
    </NuxtLink>

    <div v-if="servicePending" class="glass p-8 rounded-xl">
      <div class="skeleton h-8 w-48 mb-4"/>
      <div class="skeleton h-4 w-32"/>
    </div>

    <div v-else-if="serviceError" class="glass p-8 rounded-xl text-center">
      <p class="text-red-400">Servicio no encontrado</p>
    </div>

    <div v-else-if="service" class="glass p-8 rounded-xl">
      <h1 class="text-2xl font-display font-bold text-white mb-2">{{ service.name }}</h1>
      <p class="text-[--text-secondary] mb-6">{{ service.description }}</p>

      <div class="bg-white/5 rounded-lg p-4 mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Tiempo promedio de atención:</span>
          <span class="text-white">{{ service.avgAttentionTime }} minutos</span>
        </div>
        <div class="flex justify-between text-sm mt-2">
          <span class="text-[--text-secondary]">Horario:</span>
          <span class="text-white">{{ service.openTime }} - {{ service.closeTime }}</span>
        </div>
      </div>

      <div v-if="turn" class="text-center">
        <p class="text-[--text-secondary] mb-2">Tu turno es:</p>
        <div class="text-6xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</div>
        <p class="text-[--text-secondary] mt-4">Posición en cola: #{{ turn.queuePosition }}</p>
        <NuxtLink to="/app/turns" class="inline-block mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">
          Ver mis turnos
        </NuxtLink>
      </div>

      <form v-else class="space-y-4" @submit="onSubmit">
        <p v-if="submitError" class="text-red-400 text-sm">{{ submitError }}</p>

        <button type="submit" :disabled="isSubmitting" class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">
          {{ isSubmitting ? 'Solicitando...' : 'Solicitar Turno' }}
        </button>
      </form>
    </div>
  </div>
</template>