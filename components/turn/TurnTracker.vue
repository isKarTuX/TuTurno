<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn: Turn
  wsConnected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  wsConnected: true,
})

const estimatedWait = computed(() => {
  if (!props.turn.service?.avgAttentionTime || !props.turn.queuePosition) return 0
  return (props.turn.queuePosition - 1) * props.turn.service.avgAttentionTime
})

const statusMessage = computed(() => {
  switch (props.turn.status) {
    case 'waiting':
      return `Esperando en cola • ${props.turn.queuePosition - 1} turnos antes de ti`
    case 'called':
      return '¡Te están llamando! Acércate al módulo'
    case 'attending':
      return 'Siendo atendido'
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

const statusDotClass = computed(() => {
  switch (props.turn.status) {
    case 'waiting':
      return 'bg-[--color-turn-waiting]'
    case 'called':
      return 'bg-[--color-turn-called] animate-pulse'
    case 'attending':
      return 'bg-[--color-turn-attending]'
    case 'completed':
      return 'bg-[--color-turn-completed]'
    case 'no_show':
      return 'bg-[--color-turn-no-show]'
    case 'cancelled':
      return 'bg-[--color-turn-cancelled]'
    default:
      return 'bg-white/30'
  }
})

const emit = defineEmits<{
  (e: 'share' | 'cancel'): void
}>()

const shareTurn = () => {
  emit('share')
}

const showCancelModal = () => {
  emit('cancel')
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center py-8 relative">
      <div
        class="absolute inset-0 bg-gradient-to-b from-[--color-primary]/10 to-transparent rounded-full blur-3xl"
        :class="{ 'animate-pulse': turn.status === 'called' }"
      />

      <div class="relative">
        <p class="text-white/50 text-sm uppercase tracking-widest mb-2">
          Tu turno
        </p>
        <div class="text-7xl font-bold tracking-tight text-white turn-flip">
          {{ turn.turnNumber }}
        </div>
        <p class="text-white/40 mt-2">en {{ turn.entity?.name || 'Entidad' }}</p>
      </div>
    </div>

    <div class="text-center">
      <Transition name="status" mode="out-in">
        <div
          :key="turn.status"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="statusDotClass"
          />
          <span class="text-white/80">{{ statusMessage }}</span>
        </div>
      </Transition>
    </div>

    <div class="glass rounded-2xl p-6">
      <div class="flex justify-between text-sm mb-4">
        <span class="text-white/50">Tu posición</span>
        <span class="text-white font-medium">#{{ turn.queuePosition }}</span>
      </div>

      <TurnProgressBar
        :position="turn.queuePosition - 1"
        :total="turn.queuePosition"
        :animated="true"
      />

      <div class="flex justify-between text-sm mt-4">
        <span class="text-white/50">Turnos antes de ti</span>
        <span class="text-white font-medium">{{ turn.queuePosition - 1 }}</span>
      </div>

      <div class="mt-6 pt-4 border-t border-white/5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white/50">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">Tiempo estimado</span>
          </div>
          <span class="text-xl font-semibold text-white">
            ~{{ estimatedWait }} <span class="text-sm text-white/50">min</span>
          </span>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <UiButton
        variant="outline"
        class="flex-1"
        @click="shareTurn"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Compartir
      </UiButton>
      <UiButton
        v-if="turn.status === 'waiting'"
        variant="ghost"
        class="flex-1 text-red-400 hover:text-red-300"
        @click="showCancelModal"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Cancelar
      </UiButton>
    </div>

    <div class="flex items-center justify-center gap-2 text-xs text-white/30">
      <span
        class="w-1.5 h-1.5 rounded-full"
        :class="wsConnected ? 'bg-green-400' : 'bg-red-400'"
      />
      {{ wsConnected ? 'Actualizaciones en vivo' : 'Reconectando...' }}
    </div>
  </div>
</template>

<style scoped>
.status-enter-active,
.status-leave-active {
  transition: all 200ms var(--ease-out);
}
.status-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.status-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.turn-flip {
  animation: flip-in 0.4s var(--ease-spring) both;
  transform-origin: center top;
}

@keyframes flip-in {
  0% { transform: rotateX(90deg); opacity: 0; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
</style>