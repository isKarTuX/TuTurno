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
    turn.value = (result as unknown as { success: boolean; data: Turn }).data
  } catch (error: unknown) {
    const err = error as { data?: { error?: { message?: string } } }
    submitError.value = err?.data?.error?.message || 'Error al solicitar turno'
  }
})
</script>

<template>
  <div class="space-y-3">
    <NuxtLink :to="`/app/entities/${service?.entityId}`" class="text-xs uppercase tracking-[0.2em] text-[--text-muted] hover:text-white inline-flex items-center gap-2">
      <Icon name="lucide:chevron-left" class="w-4 h-4" />
      Servicios
    </NuxtLink>

    <div v-if="servicePending" class="glass p-6 rounded-xl">
      <div class="skeleton h-8 w-48 mb-4"/>
      <div class="skeleton h-4 w-32"/>
    </div>

    <div v-else-if="serviceError" class="glass p-6 rounded-xl text-center">
      <p class="text-red-400">Servicio no encontrado</p>
    </div>

    <div v-else-if="service" class="glass p-6 rounded-xl">
      <h1 class="text-xl font-display font-bold text-white">{{ service.name }}</h1>
      <p class="text-[--text-secondary] mt-2">{{ service.description }}</p>

      <div class="bg-white/5 rounded-lg p-4 mt-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-[--text-secondary]">Tiempo promedio</span>
          <span class="text-white">{{ service.avgAttentionTime }} min</span>
        </div>
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-[--text-secondary]">Horario</span>
          <span class="text-white">{{ service.openTime }} - {{ service.closeTime }}</span>
        </div>
      </div>

      <div v-if="turn" class="text-center">
        <p class="text-[--text-secondary] mb-2">Tu turno es</p>
        <div class="text-5xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</div>
        <p class="text-[--text-secondary] mt-3">Posición en cola: #{{ turn.queuePosition }}</p>
        <UiButton class="mt-4" @click="navigateTo('/app/turns')">
          Ver mis turnos
        </UiButton>
      </div>

      <form v-else class="space-y-3" @submit="onSubmit">
        <p v-if="submitError" class="text-red-400 text-sm">{{ submitError }}</p>

        <UiButton type="submit" :loading="isSubmitting" class="w-full">
          {{ isSubmitting ? 'Solicitando...' : 'Solicitar Turno' }}
        </UiButton>
      </form>
    </div>
  </div>
</template>
