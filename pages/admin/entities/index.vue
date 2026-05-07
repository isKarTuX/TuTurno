<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { data: entities, pending } = await useAsyncData(
  'admin-entities',
  () => $fetch('/api/entities?perPage=100') as Promise<{ success: boolean; data: any[]; meta: any }>,
  { default() { return null } }
)

const showForm = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-display font-bold text-white">Entidades</h1>
      <UiButton @click="navigateTo('/admin/entities/new')">
        + Nueva Entidad
      </UiButton>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiSkeleton v-for="i in 6" :key="i" height="200px" />
    </div>

    <div v-else-if="entities?.data?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="entity in entities.data"
        :key="entity.id"
        :to="`/admin/entities/${entity.id}`"
        class="glass p-6 rounded-xl hover:bg-white/7 transition-all"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-white">{{ entity.name }}</h3>
            <p class="text-sm text-[--text-secondary]">{{ entity.type }}</p>
          </div>
          <UiBadge :variant="entity.isActive ? 'success' : 'error'">
            {{ entity.isActive ? 'Activa' : 'Inactiva' }}
          </UiBadge>
        </div>
        <p class="text-sm text-[--text-muted] mt-2">{{ entity.address }}</p>
        <p class="text-sm text-[--text-muted]">{{ entity.city }}</p>
      </NuxtLink>
    </div>

    <div v-else class="glass p-12 rounded-xl text-center">
      <p class="text-[--text-secondary]">No hay entidades registradas</p>
      <UiButton class="mt-4" @click="showForm = true">
        Crear la primera entidad
      </UiButton>
    </div>
  </div>
</template>