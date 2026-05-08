<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  entityName?: string
  serviceName?: string
}

const props = withDefaults(defineProps<Props>(), {
  entityName: 'EPS Sura',
  serviceName: 'Atención general',
})

const currentStep = ref(0)
const isPaused = ref(false)

const turnNumber = ref('B-047')
const turnPosition = ref(3)
const estimatedTime = ref(12)
const showNotification = ref(false)
const notificationText = ref('')
const notificationType = ref<'info' | 'warning' | 'success'>('info')

const steps = [
  { position: 3, time: 12 },
  { position: 3, time: 12, notification: 'Te quedan 3 turnos', type: 'info' as const },
  { position: 2, time: 8 },
  { position: 2, time: 8, notification: 'Te quedan 2 turnos', type: 'info' as const },
  { position: 2, time: 8, notification: 'B-046 está siendo llamado', type: 'warning' as const },
  { position: 1, time: 4 },
  { position: 1, time: 4, notification: '¡Es tu turno!', type: 'success' as const },
]

const progressPercent = computed(() => {
  return Math.max(10, 100 - (turnPosition.value * 25))
})

const statusColor = computed(() => {
  if (turnPosition.value === 1) return 'text-emerald-400'
  if (turnPosition.value === 2) return 'text-amber-400'
  return 'text-violet-400'
})

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    if (isPaused.value) return

    currentStep.value = (currentStep.value + 1) % steps.length
    const step = steps[currentStep.value]
    turnPosition.value = step.position
    estimatedTime.value = step.time

    if (step.notification) {
      notificationText.value = step.notification
      notificationType.value = step.type || 'info'
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 1800)
    }
  }, 2500)
})

onUnmounted(() => {
  clearInterval(interval)
})

function handleMouseEnter() {
  isPaused.value = true
}

function handleMouseLeave() {
  isPaused.value = false
}
</script>

<template>
  <div
    class="relative"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="relative w-[280px] sm:w-[320px] mx-auto">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl" />

      <div class="relative bg-[#1A1A2E] rounded-[2rem] p-2 shadow-2xl shadow-violet-500/10 border border-white/10">
        <div class="bg-[#0F0F1A] rounded-[1.75rem] overflow-hidden">
          <div class="h-8 bg-[#1A1A2E] flex items-center justify-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-[10px] text-white/60 font-medium">9:41</span>
          </div>

          <div class="px-5 py-6 space-y-4">
            <div class="text-center space-y-1">
              <p class="text-xs text-[--text-muted] uppercase tracking-wider">Tu turno activo</p>
              <p class="text-sm text-[--text-secondary]">{{ props.entityName }}</p>
            </div>

            <div class="flex items-center justify-center py-4">
              <div class="relative">
                <div class="text-6xl sm:text-7xl font-black tracking-tight" :class="statusColor">
                  {{ turnNumber }}
                </div>
                <div
                  class="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[--color-primary] animate-ping opacity-75"
                />
              </div>
            </div>

            <div class="glass rounded-xl px-4 py-3 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-[--text-secondary]">Posición en cola</span>
                <span class="text-sm font-semibold" :class="statusColor">#{{ turnPosition }}</span>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[--text-secondary]">Tiempo estimado</span>
                  <span class="text-sm font-medium text-white">~{{ estimatedTime }} min</span>
                </div>

                <div class="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    class="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    :class="[
                      turnPosition === 1 ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                    ]"
                    :style="{ width: `${progressPercent}%` }"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-white/5">
                <span class="text-xs text-[--text-secondary]">{{ props.serviceName }}</span>
                <div class="flex items-center gap-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span class="text-xs text-emerald-400">Notificaciones activas</span>
                </div>
              </div>
            </div>

            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-x-4"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 translate-x-4"
            >
              <div
                v-if="showNotification"
                class="rounded-xl px-4 py-3 text-sm font-medium"
                :class="[
                  notificationType === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : '',
                  notificationType === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : '',
                  notificationType === 'info' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : ''
                ]"
              >
                <div class="flex items-center gap-2">
                  <svg v-if="notificationType === 'success'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="notificationType === 'warning'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2 2 0 0112 15.174V7.826a2 2 0 011.405-1.405L15 7.826V17z" />
                  </svg>
                  {{ notificationText }}
                </div>
              </div>
            </Transition>

            <div class="flex justify-center pt-2">
              <div class="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
                <svg viewBox="0 0 100 100" class="w-12 h-12">
                  <rect x="10" y="10" width="80" height="80" rx="8" fill="none" stroke="#1A1A2E" stroke-width="4" />
                  <rect x="20" y="30" width="60" height="4" fill="#1A1A2E" />
                  <rect x="20" y="45" width="40" height="4" fill="#1A1A2E" />
                  <rect x="20" y="60" width="50" height="4" fill="#1A1A2E" />
                  <circle cx="60" cy="65" r="8" fill="none" stroke="#1A1A2E" stroke-width="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-white/20 rounded-full blur-sm" />
    </div>

    <div class="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block">
      <div class="flex flex-col gap-2">
        <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse" title="Notificación" />
        <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style="animation-delay: 0.5s" title="Llamado" />
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style="animation-delay: 1s" title="Completado" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
