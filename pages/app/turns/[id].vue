<script setup lang="ts">
import type { Turn } from '~/types'
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const route = useRoute()
const turnId = route.params.id as string

const { data: turnData, pending, error } = await useAsyncData(
  `turn-${turnId}`,
  () => $fetch(`/api/turns/${turnId}`) as Promise<{ success: boolean; data: Turn }>
)

const turn = computed(() => turnData.value?.data)

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    waiting: 'En espera',
    called: 'Llamado',
    attending: 'En atención',
    completed: 'Completado',
    no_show: 'No asistido',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}
</script>

<template>
  <div>
    <NuxtLink to="/app/turns" class="text-sm text-[--text-secondary] hover:text-white mb-4 inline-flex items-center gap-1">
      ← Volver a mis turnos
    </NuxtLink>

    <div v-if="pending" class="glass p-8 rounded-xl">
      <div class="skeleton h-8 w-48 mb-4"/>
      <div class="skeleton h-4 w-32"/>
    </div>

    <div v-else-if="error || !turn" class="glass p-8 rounded-xl text-center">
      <p class="text-red-400">Turno no encontrado</p>
    </div>

    <div v-else class="glass p-8 rounded-xl">
      <div class="text-center mb-8">
        <p class="text-[--text-secondary] mb-2">Tu turno</p>
        <div class="text-6xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</div>
      </div>

      <div class="bg-white/5 rounded-lg p-4 space-y-3">
        <div class="flex justify-between">
          <span class="text-[--text-secondary]">Estado:</span>
          <span
class="font-medium"
            :class="{
              'text-primary': turn.status === 'waiting',
              'text-amber-400': turn.status === 'called',
              'text-blue-400': turn.status === 'attending',
              'text-green-400': turn.status === 'completed',
              'text-red-400': turn.status === 'no_show' || turn.status === 'cancelled',
            }">
            {{ getStatusLabel(turn.status) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-[--text-secondary]">Entidad:</span>
          <span class="text-white">{{ turn.entity?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[--text-secondary]">Servicio:</span>
          <span class="text-white">{{ turn.service?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[--text-secondary]">Posición en cola:</span>
          <span class="text-white">#{{ turn.queuePosition }}</span>
        </div>
        <div v-if="turn.service?.avgAttentionTime" class="flex justify-between">
          <span class="text-[--text-secondary]">Tiempo estimado:</span>
          <span class="text-white">~{{ turn.queuePosition * turn.service.avgAttentionTime }} min</span>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-[--text-secondary]">
          Created: {{ new Date(turn.createdAt).toLocaleString('es-CO') }}
        </p>
      </div>
    </div>
  </div>
</template>