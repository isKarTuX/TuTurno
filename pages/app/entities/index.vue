<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
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
  }) as Promise<{ success: boolean; data: any[]; meta: { total: number } }>
)

const entities = computed(() => entitiesData.value?.data || [])

function handleSearch() {
  refresh()
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-white mb-6">
      Entidades de Atención
    </h1>

    <EntitySearchBar v-model="searchParams" @search="handleSearch" />

    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="glass p-6 rounded-xl">
        <div class="skeleton h-6 w-48 mb-2"></div>
        <div class="skeleton h-4 w-32"></div>
      </div>
    </div>

    <div v-else-if="entities.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">🔍</div>
      <p class="text-[--text-secondary]">No se encontraron entidades</p>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink
        v-for="entity in entities"
        :key="entity.id"
        :to="`/app/entities/${entity.id}`"
      >
        <EntityCard :entity="entity" />
      </NuxtLink>
    </div>
  </div>
</template>