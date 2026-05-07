<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const route = useRoute()
const entityId = route.params.id as string

const { data: entityData, pending } = await useAsyncData(
  `entity-${entityId}`,
  () => $fetch(`/api/entities/${entityId}`) as Promise<{ success: boolean; data: any }>
)

const entity = computed(() => entityData.value?.data)

const typeLabels: Record<string, string> = {
  eps: 'EPS',
  bank: 'Banco',
  public_office: 'Oficina Pública',
  other: 'Otro',
}
</script>

<template>
  <div>
    <NuxtLink to="/app/entities" class="text-sm text-[--text-secondary] hover:text-white mb-4 inline-flex items-center gap-1">
      ← Volver a entidades
    </NuxtLink>

    <div v-if="pending" class="space-y-4">
      <div class="glass p-8 rounded-xl">
        <div class="skeleton h-8 w-64 mb-4"></div>
        <div class="skeleton h-4 w-48"></div>
      </div>
    </div>

    <div v-else-if="entity">
      <div class="glass p-8 rounded-xl mb-6">
        <div class="flex items-start gap-6">
          <div v-if="entity.logoUrl" class="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center">
            <img :src="entity.logoUrl" :alt="entity.name" class="w-12 h-12 object-contain" />
          </div>
          <div v-else class="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center text-4xl">
            🏢
          </div>

          <div class="flex-1">
            <h1 class="text-3xl font-display font-bold text-white">{{ entity.name }}</h1>
            <span class="inline-block px-3 py-1 text-sm rounded-full bg-white/10 text-[--text-secondary] mt-2">
              {{ typeLabels[entity.type] || entity.type }}
            </span>
            <p class="text-[--text-secondary] mt-3">
              📍 {{ entity.address }}, {{ entity.city }}
            </p>
            <p v-if="entity.phone" class="text-[--text-muted] mt-1">
              📞 {{ entity.phone }}
            </p>
            <p v-if="entity.email" class="text-[--text-muted] mt-1">
              ✉️ {{ entity.email }}
            </p>
          </div>
        </div>
      </div>

      <h2 class="text-xl font-semibold text-white mb-4">Servicios Disponibles</h2>

      <EntityServiceList :services="entity.services || []" />
    </div>
  </div>
</template>