<script setup lang="ts">
import type { Turn, Entity } from '~/types'

definePageMeta({
  middleware: 'citizen',
  layout: 'citizen',
})

const { user } = useAuth()
const searchQuery = ref('')
const showSearchSuggestions = ref(false)

const activeTurns = ref<Turn[]>([])
const loading = ref(true)

const recommendedEntities = ref<Entity[]>([])

const totalTurnsTaken = ref(0)
const avgWaitTime = ref(0)
const completionRate = ref(0)

onMounted(async () => {
  try {
    const turnsResponse = await $fetch('/api/turns') as { success: boolean; data: Turn[] }
    if (turnsResponse.success) {
      activeTurns.value = turnsResponse.data.filter((t) =>
        ['waiting', 'called', 'attending'].includes(t.status)
      )
    }
  } catch {
    // Error silently handled - user sees empty state
  } finally {
    loading.value = false
  }
})

const scrollToSearch = () => {
  const searchInput = document.querySelector<HTMLInputElement>('input[placeholder="Buscar entidad o servicio..."]')
  searchInput?.scrollIntoView({ behavior: 'smooth' })
  searchInput?.focus()
}

const navigateToEntity = (entity: Entity) => {
  showSearchSuggestions.value = false
  navigateTo(`/app/entities/${entity.id}`)
}

const timeOfDay = computed(() => {
  if (!import.meta.client) return 'Buenos días'
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
})
</script>

<template>
  <div class="min-h-screen pb-24">
    <header class="px-4 pt-6 pb-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-white/50 text-sm">{{ timeOfDay }},</p>
          <h1 class="text-2xl font-bold text-white">
            {{ user?.fullName?.split(' ')[0] || 'Ciudadano' }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button class="relative p-2 rounded-xl glass hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      <div class="relative mb-8">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar entidad o servicio..."
          class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[--color-primary]/50 focus:bg-white/10 transition-all"
          @focus="showSearchSuggestions = true"
        >
        <Transition name="dropdown">
          <div
            v-if="showSearchSuggestions && searchQuery.length > 0"
            class="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50"
          >
            <div
              v-for="entity in recommendedEntities.slice(0, 3)"
              :key="entity.id"
              class="flex items-center gap-3 p-4 hover:bg-white/10 cursor-pointer transition-colors"
              @click="navigateToEntity(entity)"
            >
              <div class="w-10 h-10 rounded-xl bg-[--color-primary]/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-white">{{ entity.name }}</p>
                <p class="text-sm text-white/50">{{ entity.type }} • {{ entity.city }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>

    <section v-if="activeTurns.length" class="px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Turnos activos</h2>
        <NuxtLink to="/app/turns" class="text-sm text-[--color-primary] hover:text-[--color-primary-light] transition-colors">
          Ver todos
        </NuxtLink>
      </div>

      <div class="space-y-4">
        <TurnCard
          v-for="(turn, index) in activeTurns.slice(0, 2)"
          :key="turn.id"
          :turn="turn"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-enter"
          @view="(id) => navigateTo(`/app/turns/${id}`)"
        />
      </div>
    </section>

    <section v-else class="px-4 mb-8">
      <div class="glass rounded-3xl p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[--color-primary]/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Sin turnos activos</h3>
        <p class="text-white/50 mb-6">Encuentra una entidad y solicita tu turno</p>
        <UiButton variant="primary" @click="scrollToSearch">
          Buscar entidad
        </UiButton>
      </div>
    </section>

    <section class="px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Recomendados para ti</h2>
        <NuxtLink to="/app/entities" class="text-sm text-[--color-primary] hover:text-[--color-primary-light] transition-colors">
          Ver todos
        </NuxtLink>
      </div>

      <NuxtLink
        to="/app/entities"
        class="block glass rounded-2xl p-4 hover:bg-white/7 transition-all group"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-[--color-primary]/20 flex items-center justify-center">
            <svg class="w-7 h-7 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium text-white group-hover:text-[--color-primary-light] transition-colors">EPS Sura</p>
            <p class="text-sm text-white/50">Consultas generales</p>
          </div>
          <svg class="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLink>
    </section>

    <section class="px-4">
      <div class="glass rounded-2xl p-4 flex items-center justify-around">
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{{ totalTurnsTaken }}</p>
          <p class="text-xs text-white/50">Turnos tomados</p>
        </div>
        <div class="w-px h-8 bg-white/10" />
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{{ avgWaitTime }}min</p>
          <p class="text-xs text-white/50">Tiempo promedio</p>
        </div>
        <div class="w-px h-8 bg-white/10" />
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{{ completionRate }}%</p>
          <p class="text-xs text-white/50">Completados</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 200ms var(--ease-out);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.animate-enter {
  animation: slide-up-fade 0.5s var(--ease-out) both;
}

@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>