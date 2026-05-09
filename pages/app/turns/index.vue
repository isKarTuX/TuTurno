<script setup lang="ts">
import type { Turn } from '~/types'

definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const activeTab = ref<'active' | 'history'>('active')

const { data: turnsData, pending, refresh } = await useAsyncData(
  'my-turns',
  () => $fetch('/api/turns/my') as Promise<{ success: boolean; data: Turn[] }>
)

const activeTurns = computed(() =>
  (turnsData.value?.data || []).filter((t: Turn) =>
    ['waiting', 'called', 'attending'].includes(t.status)
  )
)

const completedTurns = computed(() =>
  (turnsData.value?.data || []).filter((t: Turn) =>
    ['completed', 'no_show', 'cancelled'].includes(t.status)
  )
)

const currentTurn = computed(() =>
  activeTurns.value.find((t: Turn) => t.status === 'called' || t.status === 'attending')
)

async function cancelTurn(turnId: string) {
  if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return

  try {
    await $fetch(`/api/turns/${turnId}`, { method: 'DELETE' } as Record<string, unknown>)
    refresh()
  } catch {
    // Error silently handled
  }
}

const tabs = computed(() => [
  { id: 'active' as const, label: 'Activos', count: activeTurns.value.length },
  { id: 'history' as const, label: 'Historial', count: completedTurns.value.length },
])
</script>

<template>
  <div class="min-h-screen pb-24">
    <header class="sticky top-0 z-40 glass border-b border-white/5 px-4 py-4">
      <h1 class="text-xl font-bold text-white">Mis Turnos</h1>

      <div class="flex gap-2 mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
          :class="activeTab === tab.id ? 'bg-[--color-primary] text-white' : 'text-white/50 hover:text-white'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span
            v-if="tab.count"
            class="ml-1 text-xs opacity-60"
          >
            ({{ tab.count }})
          </span>
        </button>
      </div>
    </header>

    <div class="px-4 py-6">
      <div v-if="pending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="glass p-6 rounded-3xl">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-white/5 animate-pulse" />
              <div class="space-y-2">
                <div class="h-4 w-32 bg-white/5 rounded animate-pulse" />
                <div class="h-3 w-24 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
            <div class="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div class="h-8 w-24 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      <div v-if="activeTab === 'active'" class="space-y-4">
        <template v-if="activeTurns.length">
          <TurnCard
            v-for="turn in activeTurns"
            :key="turn.id"
            :turn="turn"
            @view="(id) => navigateTo(`/app/turns/${id}`)"
            @cancel="cancelTurn"
          />

          <div
            v-if="currentTurn"
            class="glass rounded-2xl p-4 border-[--color-primary]/30"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[--color-primary]/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-white">Turno en progreso</p>
                <p class="text-sm text-white/50">Sigue el estado en tiempo real</p>
              </div>
            </div>
            <NuxtLink :to="`/app/turns/${currentTurn.id}`">
              <UiButton variant="primary" class="w-full">
                Ver seguimiento
              </UiButton>
            </NuxtLink>
          </div>
        </template>

        <div v-else class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 flex items-center justify-center">
            <svg class="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">No tienes turnos activos</h3>
          <p class="text-white/50 mb-6">Los turnos que solicites aparecerán aquí</p>
          <NuxtLink to="/app/entities">
            <UiButton variant="primary">
              Solicitar turno
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="activeTab === 'history'" class="space-y-3">
        <template v-if="completedTurns.length">
          <div
            v-for="turn in completedTurns"
            :key="turn.id"
            class="glass rounded-2xl p-4 opacity-80"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <svg v-if="turn.status === 'completed'" class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-white">{{ turn.turnNumber }}</p>
                  <p class="text-sm text-white/50">{{ turn.entity?.name }}</p>
                </div>
              </div>
              <span
                class="badge"
                :class="{
                  'badge-completed': turn.status === 'completed',
                  'badge-no-show': turn.status === 'no_show',
                  'bg-white/10 text-white/50': turn.status === 'cancelled',
                }"
              >
                {{ turn.status === 'completed' ? 'Completado' : turn.status === 'no_show' ? 'No asistió' : 'Cancelado' }}
              </span>
            </div>
          </div>
        </template>

        <div v-else class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 flex items-center justify-center">
            <svg class="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Sin historial</h3>
          <p class="text-white/50">Tu historial de turnos aparecerá aquí</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>