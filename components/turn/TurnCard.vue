<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn: Turn
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const emit = defineEmits<{
  (e: 'cancel', turnId: string): void
  (e: 'view', turnId: string): void
}>()
</script>

<template>
  <div class="glass p-6 rounded-xl" :class="{ 'glow-active': turn.status === 'called' }">
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="text-3xl font-display font-bold text-primary mb-1">{{ turn.turnNumber }}</div>
        <div v-if="!compact" class="text-sm text-[--text-secondary]">
          Posición: #{{ turn.queuePosition }}
        </div>
      </div>
      <TurnStatusBadge :status="turn.status" />
    </div>

    <div v-if="!compact" class="bg-white/5 rounded-lg p-3 mb-4 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Entidad:</span>
        <span class="text-white">{{ turn.entity?.name || 'N/A' }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Servicio:</span>
        <span class="text-white">{{ turn.service?.name || 'N/A' }}</span>
      </div>
    </div>

    <div v-if="!compact" class="flex gap-2">
      <NuxtLink
        :to="`/app/turns/${turn.id}`"
        class="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg transition-colors text-sm"
      >
        Ver detalle
      </NuxtLink>
      <button
        v-if="turn.status === 'waiting'"
        @click="emit('cancel', turn.id)"
        class="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>