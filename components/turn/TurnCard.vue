<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn?: Turn
  loading?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  turn: undefined,
  loading: false,
  compact: false,
})

const emit = defineEmits<{
  (e: 'cancel' | 'view', turnId: string): void
}>()

const isLoading = computed(() => props.loading || !props.turn)
</script>

<template>
  <div class="glass p-6 rounded-xl" :class="{ 'glow-active': turn?.status === 'called' }">
    <template v-if="isLoading">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="skeleton h-10 w-24 rounded-lg mb-2" />
          <div v-if="!compact" class="skeleton h-4 w-20 rounded" />
        </div>
        <div class="skeleton h-6 w-20 rounded-full" />
      </div>

      <div v-if="!compact" class="bg-white/5 rounded-lg p-3 mb-4 space-y-2">
        <div class="flex justify-between">
          <div class="skeleton h-4 w-16 rounded" />
          <div class="skeleton h-4 w-24 rounded" />
        </div>
        <div class="flex justify-between">
          <div class="skeleton h-4 w-16 rounded" />
          <div class="skeleton h-4 w-24 rounded" />
        </div>
      </div>

      <div v-if="!compact" class="flex gap-2">
        <div class="skeleton h-10 w-full rounded-lg" />
        <div class="skeleton h-10 w-full rounded-lg" />
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-3xl font-display font-bold text-primary mb-1">{{ turn!.turnNumber }}</div>
          <div v-if="!compact" class="text-sm text-[--text-secondary]">
            Posición: #{{ turn!.queuePosition }}
          </div>
        </div>
        <TurnStatusBadge :status="turn!.status" />
      </div>

      <div v-if="!compact" class="bg-white/5 rounded-lg p-3 mb-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Entidad:</span>
          <span class="text-white">{{ turn!.entity?.name || 'N/A' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Servicio:</span>
          <span class="text-white">{{ turn!.service?.name || 'N/A' }}</span>
        </div>
      </div>

      <div v-if="!compact" class="flex gap-2">
        <NuxtLink
          :to="`/app/turns/${turn!.id}`"
          class="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg transition-colors text-sm"
        >
          Ver detalle
        </NuxtLink>
        <button
          v-if="turn!.status === 'waiting'"
          class="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
          @click="emit('cancel', turn!.id)"
        >
          Cancelar
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>