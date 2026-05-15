<script setup lang="ts">
import type { Turn } from '~/types'

definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const route = useRoute()
const turnId = route.params.id as string

const showCancelModal = ref(false)

const { data: turnData, pending, error } = await useAsyncData(
  `turn-${turnId}`,
  () => $fetch(`/api/turns/${turnId}`) as Promise<{ success: boolean; data: Turn }>
)

const turn = computed(() => turnData.value?.data)
const serviceId = computed(() => turn.value?.serviceId || '')

const turnIdRef = computed(() => turnId)
const serviceIdRef = computed(() => serviceId.value)
const { isConnected } = useTurnRealtime(turnIdRef, serviceIdRef)

const goBack = () => {
  navigateTo('/app/turns')
}

const formattedRequestDate = computed(() => {
  if (!turn.value?.createdAt) return ''
  return new Date(turn.value.createdAt).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
})

const handleShare = () => {
  if (navigator.share && turn.value) {
    navigator.share({
      title: `Mi turno ${turn.value.turnNumber}`,
      text: `Mi turno en ${turn.value.entity?.name}: ${turn.value.turnNumber}`,
      url: window.location.href,
    })
  }
}

const handleCancel = () => {
  showCancelModal.value = true
}

const onConfirmCancel = async () => {
  try {
    await $fetch(`/api/turns/${turnId}`, { method: 'DELETE' } as Record<string, unknown>)
    navigateTo('/app/turns')
  } catch {
    // Error silently handled
  }
}
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-40 glass border-b border-white/5 px-4 py-3">
      <div class="flex items-center gap-3">
        <button
          class="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          @click="goBack"
        >
          <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <span class="text-sm text-white/50">Seguimiento</span>
      </div>
    </header>

    <div v-if="pending" class="px-4 py-8">
      <div class="glass rounded-3xl p-8">
        <div class="flex justify-center mb-8">
          <div class="w-32 h-32 rounded-2xl bg-white/5 animate-pulse" />
        </div>
        <div class="space-y-4">
          <div class="h-6 w-48 mx-auto bg-white/5 rounded animate-pulse" />
          <div class="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div class="h-4 w-32 mx-auto bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>

    <div v-else-if="error || !turn" class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-red-500/10 flex items-center justify-center">
        <svg class="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-white mb-2">Turno no encontrado</h2>
      <p class="text-white/50 mb-6">Este turno no existe o fue cancelado</p>
      <UiButton variant="outline" @click="goBack">
        Volver a Mis Turnos
      </UiButton>
    </div>

    <div v-else class="px-4 py-6">
      <TurnTracker
        :turn="turn"
        :ws-connected="isConnected"
        class="mb-6"
        @share="handleShare"
        @cancel="handleCancel"
      />

      <UiConfirmModal
        :show="showCancelModal"
        title="Cancelar turno"
        message="¿Estás seguro de que deseas cancelar este turno? Esta acción no se puede deshacer."
        confirm-text="Sí, cancelar"
        cancel-text="No, mantener"
        variant="danger"
        @confirm="onConfirmCancel"
        @cancel="showCancelModal = false"
      />

      <div class="glass rounded-2xl p-4 mb-6">
        <h3 class="font-medium text-white mb-3">Detalles del turno</h3>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between">
            <dt class="text-white/50">Entidad</dt>
            <dd class="text-white">{{ turn.entity?.name }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-white/50">Servicio</dt>
            <dd class="text-white">{{ turn.service?.name }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-white/50">Solicitado</dt>
            <dd class="text-white">{{ formattedRequestDate }}</dd>
          </div>
        </dl>
      </div>

      <div class="glass rounded-2xl p-4">
        <h3 class="font-medium text-white mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cuando sea tu turno
        </h3>
        <ul class="space-y-2 text-sm text-white/70">
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Acércate al módulo indicado por la señalización</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Ten tu documento de identidad a la mano</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Muestra el código QR de este turno</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>