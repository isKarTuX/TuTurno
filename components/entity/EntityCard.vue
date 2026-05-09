<script setup lang="ts">
import type { Entity } from '~/types'

interface Props {
  entity?: Entity
  loading?: boolean
}

defineProps<Props>()

const typeConfig: Record<string, { label: string; gradient: string; icon: string }> = {
  eps: {
    label: 'EPS',
    gradient: 'from-rose-500/20 to-pink-500/10 border-rose-500/25',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-5.28M9 12h6m-6 4h6',
  },
  bank: {
    label: 'Banco',
    gradient: 'from-blue-500/20 to-indigo-500/10 border-blue-500/25',
    icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3',
  },
  public_office: {
    label: 'Oficina Pública',
    gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/25',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 10h18M5 6l7-3 7 3M9 12v9M12 12v9M15 12v9',
  },
  other: {
    label: 'Otro',
    gradient: 'from-violet-500/20 to-purple-500/10 border-violet-500/25',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-5.28M16 17H9M9 12h6',
  },
}
</script>

<template>
  <NuxtLink
    :to="entity ? `/app/entities/${entity.id}` : '#'"
    class="group block relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
    :class="entity ? [
      'bg-[--bg-surface]',
      'border border-white/8',
      'shadow-lg',
      'hover:shadow-2xl',
      'hover:border-white/15',
      'hover:bg-[--bg-elevated]',
    ] : ''"
  >
    <template v-if="loading">
      <div class="flex items-center gap-4 p-4">
        <div class="w-14 h-14 rounded-xl bg-white/5 skeleton" />
        <div class="flex-1 space-y-3">
          <div class="skeleton h-5 w-48 rounded" />
          <div class="skeleton h-3 w-32 rounded" />
        </div>
      </div>
    </template>

    <template v-else-if="entity">
      <div class="flex items-center gap-4 p-4">
        <div
          class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110"
          :class="[typeConfig[entity.type]?.gradient || typeConfig.other.gradient]"
        >
          <svg
            v-if="!entity.logoUrl"
            class="w-6 h-6 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="typeConfig[entity.type]?.icon || typeConfig.other.icon" />
          </svg>
          <NuxtImg
            v-else
            :src="entity.logoUrl"
            :alt="entity.name"
            width="32"
            height="32"
            class="w-8 h-8 object-contain"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-base font-semibold text-white truncate tracking-tight">{{ entity.name }}</h3>
            <span
              class="shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm"
              :class="typeConfig[entity.type]?.gradient || typeConfig.other.gradient"
            >
              {{ typeConfig[entity.type]?.label || entity.type }}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-[--text-muted]">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="truncate">{{ entity.address }}, {{ entity.city }}</span>
          </div>
        </div>

        <div class="shrink-0">
          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-white/10">
            <svg class="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </template>
  </NuxtLink>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>