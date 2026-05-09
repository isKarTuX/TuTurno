<script setup lang="ts">
import type { Entity } from '~/types'
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const route = useRoute()
const entityId = route.params.id as string

const { data: entityData, pending } = await useAsyncData(
  `entity-${entityId}`,
  () => $fetch(`/api/entities/${entityId}`) as Promise<{ success: boolean; data: Entity }>
)

const entity = computed(() => entityData.value?.data)

const typeConfig: Record<string, { label: string; gradient: string; icon: string; color: string }> = {
  eps: {
    label: 'EPS',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-5.28M9 12h6m-6 4h6',
    color: 'text-rose-400',
  },
  bank: {
    label: 'Banco',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3',
    color: 'text-blue-400',
  },
  public_office: {
    label: 'Oficina Pública',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 10h18M5 6l7-3 7 3M9 12v9M12 12v9M15 12v9',
    color: 'text-amber-400',
  },
  other: {
    label: 'Otro',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-5.28M16 17H9M9 12h6',
    color: 'text-violet-400',
  },
}
</script>

<template>
  <div class="min-h-screen">
    <div v-if="pending" class="max-w-3xl mx-auto px-4 py-4">
      <div class="glass rounded-xl p-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl skeleton" />
          <div class="flex-1 space-y-2">
            <div class="skeleton h-5 w-40" />
            <div class="skeleton h-3 w-24" />
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="entity">
      <div class="max-w-3xl mx-auto px-4 pb-8">
        <NuxtLink
          to="/app/entities"
          class="inline-flex items-center gap-1.5 text-xs text-[--text-muted] hover:text-white transition-colors duration-200 py-3"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-semibold">Volver</span>
        </NuxtLink>

        <div class="relative rounded-xl overflow-hidden mb-4">
          <div
            class="absolute inset-0 opacity-20"
            :class="'bg-gradient-to-br from-[' + typeConfig[entity.type]?.gradient.split(' ')[0] + '] to-transparent'"
          />

          <div class="relative p-5">
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                :class="'bg-gradient-to-br ' + typeConfig[entity.type]?.gradient"
              >
                <svg
                  v-if="!entity.logoUrl"
                  class="w-7 h-7 text-white/90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" :d="typeConfig[entity.type]?.icon" />
                </svg>
                <NuxtImg
                  v-else
                  :src="entity.logoUrl"
                  :alt="entity.name"
                  width="40"
                  height="40"
                  class="w-8 h-8 object-contain"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h1 class="text-xl font-display font-black text-white tracking-tight">
                    {{ entity.name }}
                  </h1>
                  <span
                    class="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm border"
                    :class="'bg-gradient-to-r ' + typeConfig[entity.type]?.gradient + '/20 border-white/20 text-white'"
                  >
                    {{ typeConfig[entity.type]?.label || entity.type }}
                  </span>
                </div>

                <div class="space-y-1 text-xs text-[--text-secondary]">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ entity.address }}, {{ entity.city }}</span>
                  </div>
                  <div v-if="entity.phone" class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{{ entity.phone }}</span>
                  </div>
                  <div v-if="entity.email" class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{{ entity.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4" :class="typeConfig[entity.type]?.color" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Servicios
            </h2>
            <span class="text-xs text-[--text-muted] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {{ entity.services?.length || 0 }}
            </span>
          </div>

          <EntityServiceList :services="entity.services || []" />
        </div>
      </div>
    </template>
  </div>
</template>