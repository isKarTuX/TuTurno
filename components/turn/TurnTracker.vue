<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn: Turn
}

const props = defineProps<Props>()

const estimatedWait = computed(() => {
  if (!props.turn.service?.avgAttentionTime) return 0
  return props.turn.queuePosition * props.turn.service.avgAttentionTime
})

const statusMessage = computed(() => {
  switch (props.turn.status) {
    case 'waiting':
      return `Te faltan ${props.turn.queuePosition} turnos`
    case 'called':
      return '¡Te están llamando!'
    case 'attending':
      return 'Estás siendo atendido'
    case 'completed':
      return 'Turno completado'
    case 'no_show':
      return 'No asististe al turno'
    case 'cancelled':
      return 'Turno cancelado'
    default:
      return ''
  }
})
</script>

<template>
  <div class="glass p-6 rounded-xl">
    <div class="text-center mb-6">
      <div class="text-sm text-[--text-secondary] mb-1">{{ statusMessage }}</div>
      <div class="text-5xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</div>
    </div>

    <TurnProgressBar
      v-if="turn.status === 'waiting'"
      :current="turn.queuePosition"
      :total="turn.queuePosition + 5"
      :avgAttentionTime="turn.service?.avgAttentionTime || 5"
    />

    <div v-else-if="turn.status === 'called'" class="text-center py-4">
      <div class="text-2xl animate-bounce">📢</div>
      <p class="text-amber-400 font-semibold mt-2">Acércate al puesto de atención</p>
    </div>

    <div v-else-if="turn.status === 'attending'" class="text-center py-4">
      <div class="text-2xl">🔧</div>
      <p class="text-blue-400 font-semibold mt-2">Estás siendo atendido</p>
    </div>

    <div v-else-if="turn.status === 'completed'" class="text-center py-4">
      <div class="text-2xl">✅</div>
      <p class="text-green-400 font-semibold mt-2">¡Gracias por tu visita!</p>
    </div>

    <div class="mt-4 pt-4 border-t border-white/10">
      <div class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Entidad:</span>
        <span class="text-white">{{ turn.entity?.name }}</span>
      </div>
      <div class="flex justify-between text-sm mt-1">
        <span class="text-[--text-secondary]">Servicio:</span>
        <span class="text-white">{{ turn.service?.name }}</span>
      </div>
      <div v-if="estimatedWait > 0" class="flex justify-between text-sm mt-1">
        <span class="text-[--text-secondary]">Tiempo estimado:</span>
        <span class="text-white">~{{ estimatedWait }} min</span>
      </div>
    </div>
  </div>
</template>