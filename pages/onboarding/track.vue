<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

interface TrackedTurn {
  turnNumber: string
  status: 'waiting' | 'called' | 'attending'
  queuePosition: number
  entityName?: string
  serviceName?: string
  estimatedWaitMinutes: number
  positionAhead: number
  calledAt?: string
  createdAt?: string
}

const documentId = ref('')
const turnNumber = ref('')
const documentError = ref('')
const turnNumberError = ref('')
const pending = ref(false)
const error = ref<string | null>(null)
const trackedTurn = ref<TrackedTurn | null>(null)

function validateDocument(): boolean {
  const cleanDoc = documentId.value.replace(/\D/g, '')
  if (cleanDoc.length < 5 || cleanDoc.length > 20) {
    documentError.value = 'Ingresa un número de cédula válido (5-20 dígitos)'
    return false
  }
  documentError.value = ''
  return true
}

function validateTurnNumber(): boolean {
  const cleanTurn = turnNumber.value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase()
  if (cleanTurn.length < 3) {
    turnNumberError.value = 'Ingresa un número de turno válido (ej: A-001)'
    return false
  }
  turnNumberError.value = ''
  return true
}

async function onTrack() {
  if (!validateDocument() || !validateTurnNumber()) return

  pending.value = true
  error.value = null
  trackedTurn.value = null

  const cleanDoc = documentId.value.replace(/\D/g, '')
  const cleanTurn = turnNumber.value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase()

  try {
    const result = await $fetch('/api/turns/track', {
      query: { documentId: cleanDoc, turnNumber: cleanTurn },
    }) as { success: boolean; data: TrackedTurn }

    if (result.success && result.data) {
      trackedTurn.value = result.data
    }
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: { message?: string } } }
    const message = fetchError?.data?.error?.message || 'Turno no encontrado'
    error.value = message
  } finally {
    pending.value = false
  }
}

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

function formatTime(date: string | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(date: string | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CO', {
    dateStyle: 'medium',
  })
}

const estimatedTime = computed(() => {
  if (!trackedTurn.value) return ''
  const mins = trackedTurn.value.estimatedWaitMinutes
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
        Rastrear Turno
      </h1>
      <p class="text-[--text-secondary]">
        Consulta el estado de tu turno con tu cédula y número
      </p>
    </div>

    <div class="glass rounded-xl p-6 space-y-4">
      <div>
        <label class="text-[--text-secondary] text-sm mb-2 block">Número de cédula</label>
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[--text-muted]">
            <Icon name="lucide:credit-card" class="w-5 h-5" />
          </div>
          <input
            v-model="documentId"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="Ej: 12345678"
            class="w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide focus:outline-none transition-all"
            :class="documentError ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'"
            @keyup.enter="onTrack"
          >
        </div>
        <p v-if="documentError" class="text-red-400 text-xs mt-2 text-center">{{ documentError }}</p>
      </div>

      <div>
        <label class="text-[--text-secondary] text-sm mb-2 block">Número de turno</label>
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[--text-muted]">
            <Icon name="lucide:hash" class="w-5 h-5" />
          </div>
          <input
            v-model="turnNumber"
            type="text"
            autocomplete="off"
            placeholder="Ej: A-001"
            class="w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide uppercase focus:outline-none transition-all"
            :class="turnNumberError ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'"
            @keyup.enter="onTrack"
          >
        </div>
        <p v-if="turnNumberError" class="text-red-400 text-xs mt-2 text-center">{{ turnNumberError }}</p>
      </div>

      <UiButton
        type="button"
        :loading="pending"
        class="w-full"
        @click="onTrack"
      >
        {{ pending ? 'Buscando...' : 'Rastrear Turno' }}
      </UiButton>

      <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
    </div>

    <div v-if="trackedTurn" class="mt-6 space-y-4">
      <div class="glass rounded-3xl p-8 text-center">
        <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-[--color-primary]/20 flex items-center justify-center glow-active">
          <span class="text-5xl font-display font-bold text-primary turn-flip">{{ trackedTurn.turnNumber }}</span>
        </div>

        <span class="badge mb-4" :class="statusColors[trackedTurn.status]">
          {{ statusLabels[trackedTurn.status] }}
        </span>

        <div class="flex items-center justify-center gap-2 mb-6">
          <Icon name="lucide:map-pin" class="w-4 h-4 text-[--text-muted]" />
          <span class="text-[--text-secondary]">{{ trackedTurn.entityName || 'Entidad' }}</span>
          <span class="text-[--text-muted]">•</span>
          <span class="text-[--text-secondary]">{{ trackedTurn.serviceName || 'Servicio' }}</span>
        </div>
      </div>

      <div class="glass rounded-2xl p-4 space-y-4">
        <h3 class="font-medium text-white flex items-center gap-2">
          <Icon name="lucide:clock" class="w-5 h-5 text-[--color-primary]" />
          Estado de la cola
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-white">{{ trackedTurn.queuePosition }}</p>
            <p class="text-xs text-[--text-muted] uppercase tracking-wider">Tu posición</p>
          </div>
          <div class="bg-white/5 rounded-xl p-4 text-center">
            <p class="text-3xl font-bold text-white">{{ trackedTurn.positionAhead }}</p>
            <p class="text-xs text-[--text-muted] uppercase tracking-wider">Adelante</p>
          </div>
        </div>

        <div class="bg-white/5 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[--text-secondary] text-sm">Tiempo estimado</span>
            <span class="text-white font-semibold">{{ estimatedTime }}</span>
          </div>
          <div v-if="trackedTurn.status === 'waiting'" class="flex items-center gap-2 text-sm text-[--text-muted]">
            <Icon name="lucide:info" class="w-4 h-4" />
            <span>Espera activa, te avisaremos cuando seas llamado</span>
          </div>
          <div v-else-if="trackedTurn.status === 'called'" class="flex items-center gap-2 text-sm text-amber-400">
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
            <dd class="text-white">{{ formatDate(trackedTurn.createdAt) }}</dd>
          </div>
          <div v-if="trackedTurn.calledAt" class="flex justify-between">
            <dt class="text-white/50">Llamado</dt>
            <dd class="text-white">{{ formatTime(trackedTurn.calledAt) }}</dd>
          </div>
        </dl>
      </div>

      <div class="glass rounded-2xl p-4">
        <p class="text-center text-[--text-muted] text-xs mb-4">
          ¿Quieres más funcionalidades?
        </p>
        <div class="flex gap-3">
          <NuxtLink to="/auth/register" class="flex-1">
            <UiButton variant="primary" class="w-full">
              Crear cuenta
            </UiButton>
          </NuxtLink>
          <NuxtLink to="/onboarding/my-turns" class="flex-1">
            <UiButton variant="outline" class="w-full">
              Ver mis turnos
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-6 space-y-3">
      <NuxtLink to="/onboarding/request-turn" class="block">
        <UiButton variant="ghost" class="w-full">
          <Icon name="lucide:ticket-plus" class="w-4 h-4 mr-2" />
          Solicitar un turno
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>