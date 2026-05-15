<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const turnNumber = route.params.turnNumber as string

interface PublicTurn {
  turnNumber: string
  status: 'waiting' | 'called' | 'attending'
  queuePosition: number
  entityName?: string
  serviceName?: string
  estimatedWaitMinutes: number
  positionAhead: number
  calledAt?: Date
  createdAt?: Date
}

const { data: turnData, pending, error } = await useAsyncData(
  `public-turn-${turnNumber}`,
  () => $fetch(`/api/turns/public-turn?turnNumber=${encodeURIComponent(turnNumber)}`) as Promise<{ success: boolean; data: PublicTurn }>
)

const turn = computed(() => turnData.value?.data)

const statusLabels = {
  waiting: 'En espera',
  called: 'Llamado',
  attending: 'En atención',
}

const statusColors = {
  waiting: 'badge-waiting',
  called: 'badge-called',
  attending: 'badge-attending',
}

function formatTime(date: Date | string | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CO', {
    dateStyle: 'medium',
  })
}

const estimatedTime = computed(() => {
  if (!turn.value) return ''
  const mins = turn.value.estimatedWaitMinutes
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return remainingMins > 0 ? `${hours}h ${remainingMins}min` : `${hours}h`
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-[--text-muted] hover:text-white mb-6 transition-colors">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        Volver al inicio
      </NuxtLink>
      <h1 class="text-2xl font-display font-bold text-white mb-2">
        Seguimiento de Turno
      </h1>
      <p class="text-[--text-secondary]">
        Consulta el estado de tu turno en tiempo real
      </p>
    </div>

    <div v-if="pending" class="glass rounded-3xl p-8">
      <div class="flex justify-center mb-8">
        <div class="w-32 h-32 rounded-2xl bg-white/5 animate-pulse" />
      </div>
      <div class="space-y-4">
        <div class="h-6 w-48 mx-auto bg-white/5 rounded animate-pulse" />
        <div class="h-4 w-full bg-white/5 rounded animate-pulse" />
        <div class="h-4 w-32 mx-auto bg-white/5 rounded animate-pulse" />
      </div>
    </div>

    <div v-else-if="error" class="glass rounded-3xl p-8 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-red-500/10 flex items-center justify-center">
        <Icon name="lucide:search-x" class="w-10 h-10 text-red-400" />
      </div>
      <h2 class="text-xl font-semibold text-white mb-2">Turno no encontrado</h2>
      <p class="text-white/50 mb-6">El turno {{ turnNumber }} no existe o no está activo</p>
      <NuxtLink to="/onboarding/request-turn">
        <UiButton variant="primary">
          Solicitar un turno
        </UiButton>
      </NuxtLink>
    </div>

    <div v-else-if="turn" class="space-y-4">
      <div class="glass rounded-3xl p-8 text-center">
        <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-[--color-primary]/20 flex items-center justify-center glow-active">
          <span class="text-5xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</span>
        </div>

        <span class="badge mb-4" :class="statusColors[turn.status]">
          {{ statusLabels[turn.status] }}
        </span>

        <div class="flex items-center justify-center gap-2 mb-6">
          <Icon name="lucide:map-pin" class="w-4 h-4 text-[--text-muted]" />
          <span class="text-[--text-secondary]">{{ turn.entityName || 'Entidad' }}</span>
          <span class="text-[--text-muted]">•</span>
          <span class="text-[--text-secondary]">{{ turn.serviceName || 'Servicio' }}</span>
        </div>
      </div>

      <div class="glass rounded-2xl p-4 space-y-4">
        <h3 class="font-medium text-white flex items-center gap-2">
          <Icon name="lucide:clock" class="w-5 h-5 text-[--color-primary]" />
          Estado de la cola
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-white">{{ turn.queuePosition }}</p>
            <p class="text-xs text-[--text-muted] uppercase tracking-wider">Tu posición</p>
          </div>
          <div class="bg-white/5 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-white">{{ turn.positionAhead }}</p>
            <p class="text-xs text-[--text-muted] uppercase tracking-wider">Adelante</p>
          </div>
        </div>

        <div class="bg-white/5 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[--text-secondary] text-sm">Tiempo estimado</span>
            <span class="text-white font-semibold">{{ estimatedTime }}</span>
          </div>
          <div v-if="turn.status === 'waiting'" class="flex items-center gap-2 text-sm text-[--text-muted]">
            <Icon name="lucide:info" class="w-4 h-4" />
            <span>Espera activa, te avisaremos cuando seas llamado</span>
          </div>
          <div v-else-if="turn.status === 'called'" class="flex items-center gap-2 text-sm text-amber-400">
            <Icon name="lucide:bell" class="w-4 h-4" />
            <span>¡Tu turno está siendo llamado!</span>
          </div>
        </div>
      </div>

      <div class="glass rounded-2xl p-4">
        <h3 class="font-medium text-white mb-3 flex items-center gap-2">
          <Icon name="lucide:calendar" class="w-5 h-5 text-[--color-primary]" />
          Información
        </h3>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between">
            <dt class="text-white/50">Solicitado</dt>
            <dd class="text-white">{{ formatDate(turn.createdAt) }} - {{ formatTime(turn.createdAt) }}</dd>
          </div>
          <div v-if="turn.calledAt" class="flex justify-between">
            <dt class="text-white/50">Llamado</dt>
            <dd class="text-white">{{ formatTime(turn.calledAt) }}</dd>
          </div>
        </dl>
      </div>

      <div class="glass rounded-2xl p-4">
        <h3 class="font-medium text-white mb-3 flex items-center gap-2">
          <Icon name="lucide:lightbulb" class="w-5 h-5 text-[--color-primary]" />
          ¿Sabías qué?
        </h3>
        <p class="text-sm text-[--text-secondary]">
          Crea una cuenta para recibir notificaciones cuando tu turno esté cerca, ver tu historial completo y más funciones.
        </p>
        <NuxtLink to="/auth/register" class="block mt-3">
          <UiButton variant="primary" class="w-full">
            Crear cuenta gratis
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>