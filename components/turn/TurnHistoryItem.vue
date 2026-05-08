<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn: Turn
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<{
  (e: 'cancel' | 'view', turnId: string): void
}>()

function formatDate(date: Date | string | null) {
  if (!date) return ''
  return new Date(date).toLocaleString('es-CO', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="glass p-4 rounded-xl">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-xl font-display font-bold text-white">{{ turn.turnNumber }}</div>
        <div class="text-sm text-[--text-secondary]">
          {{ formatDate(turn.createdAt) }}
        </div>
      </div>
      <TurnStatusBadge :status="turn.status" />
    </div>
    <div v-if="showActions" class="flex gap-2 mt-3">
      <button
        class="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
        @click="emit('view', turn.id)"
      >
        Ver
      </button>
      <button
        v-if="turn.status === 'waiting'"
        class="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors"
        @click="emit('cancel', turn.id)"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>