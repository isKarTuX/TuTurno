<script setup lang="ts">
import type { Turn } from '~/types'

interface QueueData {
  queue: Turn[]
  calledTurn: Turn | null
  attendingTurn: Turn | null
  waitingCount: number
}

definePageMeta({
  middleware: 'operator',
  layout: 'operator',
})

const { data: queueData, pending, refresh } = await useAsyncData(
  'operator-queue',
  () => $fetch('/api/operator/queue?serviceId=default') as Promise<{ success: boolean; data: QueueData }>,
  { default() { return null } }
)

const queue = computed(() => queueData.value?.data?.queue || [])
const calledTurn = computed(() => queueData.value?.data?.calledTurn)
const attendingTurn = computed(() => queueData.value?.data?.attendingTurn)
const waitingCount = computed(() => queueData.value?.data?.waitingCount || 0)

async function callNext() {
  try {
    await $fetch('/api/operator/call-next', {
      method: 'POST',
      body: { serviceId: 'default' },
    })
    refresh()
  } catch (error) {
    console.error('Error calling next turn:', error)
  }
}

async function completeTurn(turnId: string) {
  try {
    await $fetch('/api/operator/complete', {
      method: 'POST',
      body: { turnId },
    })
    refresh()
  } catch (error) {
    console.error('Error completing turn:', error)
  }
}

async function markNoShow(turnId: string) {
  try {
    await $fetch('/api/operator/no-show', {
      method: 'POST',
      body: { turnId },
    })
    refresh()
  } catch (error) {
    console.error('Error marking no-show:', error)
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

function handleRefresh() {
  refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-display font-bold text-white">Panel de Operador</h1>
      <button class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors" @click="handleRefresh">
        Actualizar
      </button>
    </div>

    <div v-if="pending" class="glass p-8 rounded-xl text-center">
      <div class="skeleton h-8 w-48 mx-auto mb-4"/>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="glass p-6 rounded-xl">
          <h2 class="text-lg font-semibold text-white mb-4">Cola de Espera</h2>
          <div v-if="queue.length === 0" class="text-center py-8 text-[--text-secondary]">
            No hay turnos en espera
          </div>
          <div v-else class="space-y-3">
            <div
v-for="(turn, index) in queue" :key="turn.id"
              class="flex items-center justify-between bg-white/5 rounded-lg p-4">
              <div class="flex items-center gap-4">
                <span class="text-2xl font-display font-bold text-primary">#{{ Number(index) + 1 }}</span>
                <span class="text-2xl font-display font-bold text-white">{{ turn.turnNumber }}</span>
              </div>
              <span class="text-sm text-[--text-secondary]">{{ getStatusLabel(turn.status) }}</span>
            </div>
          </div>
          <div class="mt-4 text-center text-[--text-secondary]">
            {{ waitingCount }} turnos en espera
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div v-if="calledTurn" class="glass p-6 rounded-xl border-2 border-amber-500/50">
          <h2 class="text-lg font-semibold text-white mb-4">Turno Llamado</h2>
          <div class="text-center">
            <div class="text-5xl font-display font-bold text-amber-400 turn-flip">{{ calledTurn.turnNumber }}</div>
            <div class="mt-4 flex gap-2">
              <button
class="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm"
                @click="completeTurn(calledTurn.id)">
                Atendido
              </button>
              <button
class="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                @click="markNoShow(calledTurn.id)">
                No Vino
              </button>
            </div>
          </div>
        </div>

        <div v-if="attendingTurn" class="glass p-6 rounded-xl border-2 border-blue-500/50">
          <h2 class="text-lg font-semibold text-white mb-4">En Atención</h2>
          <div class="text-center">
            <div class="text-5xl font-display font-bold text-blue-400">{{ attendingTurn.turnNumber }}</div>
            <div class="mt-4">
              <button
class="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm"
                @click="completeTurn(attendingTurn.id)">
                Completar
              </button>
            </div>
          </div>
        </div>

        <button
:disabled="queue.length === 0"
          class="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors text-lg disabled:opacity-50"
          @click="callNext">
          Llamar Siguiente
        </button>
      </div>
    </div>
  </div>
</template>