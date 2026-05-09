<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn: Turn
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'cancel' | 'view', turnId: string): void
}>()

const statusClasses = computed(() => {
  const base = 'relative overflow-hidden rounded-[2rem] glass p-6 sm:p-8 transition-all duration-300 ease-out border shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_rgba(108,58,232,0.05)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_16px_48px_rgba(108,58,232,0.15)] hover:bg-white/10 active:scale-[0.98] cursor-pointer'
  switch (props.turn.status) {
    case 'waiting':
      return `${base} border-violet-500/20`
    case 'called':
      return `${base} border-amber-500/30 bg-amber-500/5`
    case 'attending':
      return `${base} border-blue-500/20`
    case 'completed':
      return `${base} border-emerald-500/20 opacity-90`
    case 'no_show':
      return `${base} border-rose-500/20 opacity-75`
    case 'cancelled':
      return `${base} border-zinc-500/20 opacity-75`
    default:
      return `${base} border-white/10`
  }
})

const iconColorClass = computed(() => {
  switch (props.turn.status) {
    case 'waiting': return 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    case 'called': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    case 'attending': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    case 'no_show': return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    case 'cancelled': return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    default: return 'text-zinc-400 bg-white/5 border-white/10'
  }
})

const statusBadgeClass = computed(() => {
  switch (props.turn.status) {
    case 'waiting':
      return 'badge-waiting'
    case 'called':
      return 'badge-called badge-pulse'
    case 'attending':
      return 'badge-attending'
    case 'completed':
      return 'badge-completed'
    case 'no_show':
      return 'badge-no-show'
    case 'cancelled':
      return 'bg-white/10 text-white/50'
    default:
      return ''
  }
})

const statusLabel = computed(() => {
  switch (props.turn.status) {
    case 'waiting':
      return 'En espera'
    case 'called':
      return 'Te están llamando'
    case 'attending':
      return 'Siendo atendido'
    case 'completed':
      return 'Completado'
    case 'no_show':
      return 'No asistió'
    case 'cancelled':
      return 'Cancelado'
    default:
      return props.turn.status
  }
})

const estimatedWait = computed(() => {
  if (!props.turn.service?.avgAttentionTime || !props.turn.queuePosition) return 0
  return props.turn.queuePosition * props.turn.service.avgAttentionTime
})

const viewDetails = () => {
  emit('view', props.turn.id)
}

const cancelTurn = () => {
  emit('cancel', props.turn.id)
}
</script>

<template>
  <div class="group" :class="statusClasses">
    <div
      v-if="turn.status === 'called' || turn.status === 'attending'"
      class="absolute inset-0 opacity-30 animate-pulse-glow pointer-events-none"
    />

    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" :class="iconColorClass">
          <Icon name="lucide:ticket" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-semibold text-white tracking-tight text-lg">{{ turn.entity?.name || 'Entidad' }}</h3>
          <p class="text-sm text-zinc-400">{{ turn.service?.name || 'Servicio' }}</p>
        </div>
      </div>
      <span class="badge" :class="statusBadgeClass">
        {{ statusLabel }}
      </span>
    </div>

    <div class="flex items-baseline gap-3 mb-6">
      <span class="text-5xl sm:text-6xl font-display font-medium tracking-tighter text-white turn-flip">
        {{ turn.turnNumber }}
      </span>
      <span class="text-lg font-medium text-zinc-500">#{{ turn.queuePosition }}</span>
    </div>

    <div v-if="turn.status === 'waiting'" class="mb-4">
      <div class="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out relative"
          style="width: 75%; background: linear-gradient(to right, var(--color-primary), var(--color-accent));"
        />
      </div>
      <p class="text-xs text-white/50 mt-2">
        Estimado: ~{{ estimatedWait }} min
      </p>
    </div>

    <div class="flex gap-2 pt-4 border-t border-white/5">
      <UiButton
        v-if="turn.status === 'waiting'"
        variant="ghost"
        size="sm"
        class="text-white/60 hover:text-white"
        @click="cancelTurn"
      >
        Cancelar
      </UiButton>
      <UiButton
        variant="primary"
        size="sm"
        class="flex-1"
        @click="viewDetails"
      >
        Ver detalles
      </UiButton>
    </div>

    <div v-if="loading" class="absolute inset-0 bg-[--color-bg-surface]/80 backdrop-blur-sm flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        <p class="text-sm text-white/50">Cargando...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px oklch(55% 0.18 285 / 0.4); }
  50% { box-shadow: 0 0 40px oklch(55% 0.18 285 / 0.6); }
}

.turn-flip {
  animation: flip-in 0.4s var(--ease-spring);
  transform-origin: center top;
}

@keyframes flip-in {
  0% { transform: rotateX(90deg); opacity: 0; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
</style>