<script setup lang="ts">
import type { Entity } from '~/types'
definePageMeta({
  middleware: 'citizen',
  layout: 'citizen',
})

const searchParams = ref({
  search: '',
  type: '',
})

const { data: entitiesData, pending, refresh } = await useAsyncData(
  'entities',
  () => $fetch('/api/entities', {
    query: searchParams.value,
  }) as Promise<{ success: boolean; data: Entity[]; meta: { total: number } }>
)

const entities = computed(() => entitiesData.value?.data || [])

function handleSearch() {
  refresh()
}
</script>

<template>
  <div class="min-h-screen">
    <div class="sticky top-0 z-10 backdrop-blur-xl bg-[--bg-base]/90 border-b border-white/5 -mx-4">
      <div class="max-w-3xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.2em] text-[--text-muted] font-semibold">Directorio</p>
            <h1 class="text-xl font-display font-black text-white">Entidades</h1>
          </div>
          <span v-if="entities.length" class="text-xs text-[--text-muted] backdrop-blur-sm px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            {{ entities.length }} encontradas
          </span>
        </div>

        <EntitySearchBar v-model="searchParams" @search="handleSearch" />
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-4 pb-8">
      <div v-if="pending" class="space-y-2">
        <EntityCard v-for="i in 4" :key="i" loading />
      </div>

      <div v-else-if="entities.length === 0" class="py-12 text-center">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-5.28M16 17H9M9 12h6" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-white mb-1">No se encontraron entidades</p>
        <p class="text-xs text-[--text-muted]">Prueba con otro filtro o ciudad.</p>
      </div>

      <div v-else class="space-y-2">
        <EntityCard
          v-for="entity in entities"
          :key="entity.id"
          :entity="entity"
        />
      </div>
    </div>
  </div>
</template>