<script setup lang="ts">
import type { Entity } from '~/types'

interface Props {
  entity?: Entity
  loading?: boolean
}

defineProps<Props>()

const typeLabels: Record<string, string> = {
  eps: 'EPS',
  bank: 'Banco',
  public_office: 'Oficina Pública',
  other: 'Otro',
}
</script>

<template>
  <div class="glass p-6 rounded-xl hover:bg-white/7 transition-all cursor-pointer">
    <template v-if="loading">
      <div class="flex items-start gap-4">
        <div class="skeleton w-12 h-12 rounded-lg" />
        <div class="flex-1 space-y-3">
          <div class="skeleton h-5 w-40 rounded" />
          <div class="skeleton h-4 w-20 rounded-full" />
          <div class="skeleton h-4 w-full rounded" />
          <div class="skeleton h-4 w-32 rounded" />
        </div>
        <div class="skeleton w-5 h-5 rounded" />
      </div>
    </template>

    <template v-else-if="entity">
      <div class="flex items-start gap-4">
        <div v-if="entity.logoUrl" class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
          <img :src="entity.logoUrl" :alt="entity.name" class="w-8 h-8 object-contain" >
        </div>
        <div v-else class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          <span class="text-2xl">🏢</span>
        </div>

        <div class="flex-1">
          <h3 class="text-lg font-semibold text-white">{{ entity.name }}</h3>
          <span class="inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-[--text-secondary] mt-1">
            {{ typeLabels[entity.type] || entity.type }}
          </span>
          <p class="text-sm text-[--text-secondary] mt-2 line-clamp-2">
            📍 {{ entity.address }}, {{ entity.city }}
          </p>
          <p v-if="entity.phone" class="text-sm text-[--text-muted] mt-1">
            📞 {{ entity.phone }}
          </p>
        </div>

        <div class="text-primary-light">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </template>
  </div>
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