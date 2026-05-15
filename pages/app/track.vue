<script setup lang="ts">
import type { Turn, Entity, Service } from '~/types'

definePageMeta({
  layout: 'citizen',
})

const route = useRoute()
const documentId = (route.query.documentId as string) || ''
const turnNumber = (route.query.turnNumber as string) || ''

const searchParams = ref({
  documentId,
  turnNumber,
})
const turn = ref<(Turn & { entity?: Partial<Entity>; service?: Partial<Service>; estimatedWaitMinutes?: number; positionAhead?: number }) | null>(null)
const isLoading = ref(false)
const error = ref('')
const hasSearched = ref(false)

const statusConfig = {
  waiting: { label: 'En espera', class: 'bg-primary/20 text-primary', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  called: { label: 'Llamado', class: 'bg-amber-500/20 text-amber-400', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  attending: { label: 'En atención', class: 'bg-blue-500/20 text-blue-400', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  completed: { label: 'Atendido', class: 'bg-green-500/20 text-green-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  no_show: { label: 'No asistido', class: 'bg-red-500/20 text-red-400', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  cancelled: { label: 'Cancelado', class: 'bg-gray-500/20 text-gray-400', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
}

async function searchTurn() {
  if (!searchParams.value.documentId || !searchParams.value.turnNumber) {
    error.value = 'Ingresa tu número de cédula y turno'
    return
  }

  isLoading.value = true
  error.value = ''
  hasSearched.value = true

  try {
    const result = await $fetch('/api/turns/track', {
      query: {
        documentId: searchParams.value.documentId.replace(/\D/g, ''),
        turnNumber: searchParams.value.turnNumber.toUpperCase(),
      },
    }) as { success: boolean; data: Turn & { entity?: Entity; service?: Service; estimatedWaitMinutes?: number; positionAhead?: number } }

    if (result.success) {
      turn.value = result.data
    }
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: { message?: string } } }
    error.value = fetchError?.data?.error?.message || 'Turno no encontrado'
    turn.value = null
  } finally {
    isLoading.value = false
  }
}

const statusInfo = computed(() => {
  if (!turn.value) return null
  return statusConfig[turn.value.status] || statusConfig.waiting
})

function formatDate(date: Date | string | null) {
  if (!date) return ''
  return new Date(date).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

onMounted(() => {
  if (documentId && turnNumber) {
    searchTurn()
  }
})
</script>

<template>
  <div class="space-y-4">
    <NuxtLink to="/app" class="text-xs uppercase tracking-[0.2em] text-[--text-muted] hover:text-white inline-flex items-center gap-2">
      <Icon name="lucide:chevron-left" class="w-4 h-4" />
      Inicio
    </NuxtLink>

    <div class="glass p-6 rounded-xl">
      <h1 class="text-xl font-display font-bold text-white mb-6 text-center">Sigue tu turno</h1>

      <div class="flex gap-3 mb-4">
        <input
          v-model="searchParams.documentId"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder="Tu cédula"
          class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide font-sans focus:outline-none transition-all border-white/10 focus:border-primary/50"
        >
        <input
          v-model="searchParams.turnNumber"
          type="text"
          autocomplete="off"
          placeholder="Ej: A-001"
          class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide font-sans uppercase focus:outline-none transition-all border-white/10 focus:border-primary/50"
          @keyup.enter="searchTurn"
        >
      </div>
      <UiButton class="w-full" :loading="isLoading" @click="searchTurn">
        <Icon name="lucide:search" class="w-4 h-4" />
        Consultar
      </UiButton>
      <p v-if="error" class="text-red-400 text-sm mt-3 text-center">{{ error }}</p>
    </div>

    <div v-if="isLoading" class="glass p-6 rounded-xl space-y-4">
      <div class="skeleton h-8 w-32 mx-auto"/>
      <div class="skeleton h-16 w-48 mx-auto"/>
      <div class="space-y-3">
        <div class="skeleton h-4 w-full"/>
        <div class="skeleton h-4 w-3/4"/>
        <div class="skeleton h-4 w-1/2"/>
      </div>
    </div>

    <div v-else-if="turn && statusInfo" class="glass p-6 rounded-xl text-center">
      <div class="text-sm text-[--text-secondary] mb-1">Tu turno</div>
      <div class="text-5xl font-display font-bold text-primary turn-flip mb-2">{{ turn.turnNumber }}</div>

      <span class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6" :class="statusInfo.class">
        {{ statusInfo.label }}
      </span>

      <div class="bg-white/5 rounded-lg p-4 space-y-3 text-left mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Servicio:</span>
          <span class="text-white">{{ turn.service?.name || 'N/A' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Entidad:</span>
          <span class="text-white">{{ turn.entity?.name || 'N/A' }}</span>
        </div>
        <div v-if="turn.status === 'waiting' && turn.positionAhead !== undefined" class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Turnos antes:</span>
          <span class="text-white font-medium">{{ turn.positionAhead }}</span>
        </div>
        <div v-if="turn.status === 'waiting' && turn.estimatedWaitMinutes" class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Tiempo estimado:</span>
          <span class="text-white">~{{ turn.estimatedWaitMinutes }} min</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Fecha:</span>
          <span class="text-white text-xs">{{ formatDate(turn.createdAt) }}</span>
        </div>
      </div>

      <div v-if="turn.status === 'waiting'" class="pt-4 border-t border-white/10">
        <p class="text-[--text-muted] text-sm mb-4">
          Mantén esta página abierta para ver las actualizaciones en tiempo real.
        </p>
        <p class="text-[--text-muted] text-xs">
          También puedes crear una cuenta para recibir notificaciones cuando te llamen.
        </p>
        <NuxtLink to="/auth/register" class="block mt-4">
          <UiButton variant="outline" class="w-full">
            <Icon name="user-plus" class="w-4 h-4" />
            Crear cuenta gratis
          </UiButton>
        </NuxtLink>
      </div>

      <div v-else-if="['completed', 'no_show', 'cancelled'].includes(turn.status)" class="pt-4 border-t border-white/10">
        <p class="text-[--text-muted] text-sm mb-4">
          Este turno ya no está activo.
        </p>
        <NuxtLink to="/app">
          <UiButton class="w-full">
            Solicitar nuevo turno
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="hasSearched && !isLoading && !turn" class="glass p-6 rounded-xl text-center">
      <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-white font-semibold mb-1">Turno no encontrado</p>
      <p class="text-[--text-muted] text-sm">Verifica tu número de cédula y turno</p>
    </div>

    <div v-if="!hasSearched" class="glass p-6 rounded-xl">
      <h3 class="text-white font-semibold mb-4 text-center">¿Cómo funciona?</h3>
      <div class="space-y-3 text-sm text-[--text-secondary]">
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <span class="text-primary text-xs font-bold">1</span>
          </div>
          <p>Ingresa tu número de cédula sin puntos ni espacios</p>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <span class="text-primary text-xs font-bold">2</span>
          </div>
          <p>Ingresa el número de turno que recibiste (Ej: A-001)</p>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <span class="text-primary text-xs font-bold">3</span>
          </div>
          <p>Consulta el estado de tu turno en cualquier momento</p>
        </div>
      </div>
    </div>
  </div>
</template>