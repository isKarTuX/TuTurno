<script setup lang="ts">
import type { Turn } from '~/types'
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const { data: turnsData, pending, refresh } = await useAsyncData(
  'my-turns',
  () => $fetch('/api/turns/my') as Promise<{ success: boolean; data: Turn[] }>
)

const activeTurns = computed(() =>
  (turnsData.value?.data || []).filter((t: Turn) =>
    ['waiting', 'called', 'attending'].includes(t.status)
  )
)

const pastTurns = computed(() =>
  (turnsData.value?.data || []).filter((t: Turn) =>
    ['completed', 'no_show', 'cancelled'].includes(t.status)
  )
)

async function cancelTurn(turnId: string) {
  if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return

  try {
    await $fetch(`/api/turns/${turnId}`, { method: 'DELETE' })
    refresh()
  } catch (error) {
    console.error('Error cancelling turn:', error)
  }
}

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
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-display font-bold text-white">Mis Turnos</h1>
    </div>

    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="glass p-6 rounded-xl">
        <div class="skeleton h-6 w-32 mb-2"/>
        <div class="skeleton h-4 w-48"/>
      </div>
    </div>

    <div v-else-if="activeTurns.length === 0 && pastTurns.length === 0" class="glass p-8 rounded-xl text-center">
      <p class="text-[--text-secondary] mb-4">Aún no tienes turnos solicitados</p>
      <NuxtLink to="/app/entities" class="text-primary hover:text-primary-light">
        Buscar entidades →
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <div v-if="activeTurns.length > 0" class="space-y-4">
        <h2 class="text-lg font-semibold text-white">Turnos Activos</h2>
        <div v-for="turn in activeTurns" :key="turn.id" class="glass p-6 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-display font-bold text-primary mb-1">{{ turn.turnNumber }}</div>
              <div class="text-sm text-[--text-secondary]">{{ turn.entityName }} - {{ turn.serviceName }}</div>
            </div>
            <div class="text-right">
              <span
class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-primary/20 text-primary': turn.status === 'waiting',
                  'bg-amber-500/20 text-amber-400': turn.status === 'called',
                  'bg-blue-500/20 text-blue-400': turn.status === 'attending',
                }">
                {{ getStatusLabel(turn.status) }}
              </span>
              <div class="text-sm text-[--text-secondary] mt-1">Posición: #{{ turn.queuePosition }}</div>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <NuxtLink :to="`/app/turns/${turn.id}`" class="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg transition-colors text-sm">
              Ver detalle
            </NuxtLink>
            <button
v-if="turn.status === 'waiting'" class="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
              @click="cancelTurn(turn.id)">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div v-if="pastTurns.length > 0" class="space-y-4">
        <h2 class="text-lg font-semibold text-white">Historial</h2>
        <div v-for="turn in pastTurns" :key="turn.id" class="glass p-4 rounded-xl opacity-60">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xl font-display font-bold text-white">{{ turn.turnNumber }}</div>
              <div class="text-sm text-[--text-secondary]">{{ turn.entityName }} - {{ turn.serviceName }}</div>
            </div>
            <span
class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              :class="{
                'bg-green-500/20 text-green-400': turn.status === 'completed',
                'bg-red-500/20 text-red-400': turn.status === 'no_show' || turn.status === 'cancelled',
              }">
              {{ getStatusLabel(turn.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>