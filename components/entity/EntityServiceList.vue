<script setup lang="ts">
import type { Service } from '~/types'

interface Props {
  services: Service[]
}

defineProps<Props>()

function isServiceOpen(service: Service): boolean {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  const [openH, openM] = service.openTime.split(':').map(Number)
  const [closeH, closeM] = service.closeTime.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  return currentTime >= openMinutes && currentTime <= closeMinutes && !service.isPaused && service.isActive
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="service in services"
      :key="service.id"
      class="glass p-4 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-white">{{ service.name }}</h4>
          <p v-if="service.description" class="text-sm text-[--text-secondary] mt-1">
            {{ service.description }}
          </p>
        </div>

        <div class="text-right">
          <span
            v-if="service.isPaused"
            class="inline-block px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-400"
          >
            Pausado
          </span>
          <span
            v-else-if="isServiceOpen(service)"
            class="inline-block px-2 py-1 text-xs rounded bg-green-500/20 text-green-400"
          >
            Abierto
          </span>
          <span
            v-else
            class="inline-block px-2 py-1 text-xs rounded bg-gray-500/20 text-gray-400"
          >
            Cerrado
          </span>
          <p class="text-xs text-[--text-muted] mt-1">
            🕐 {{ service.openTime }} - {{ service.closeTime }}
          </p>
          <p class="text-xs text-[--text-secondary] mt-1">
            ⏱️ ~{{ service.avgAttentionTime }} min
          </p>
        </div>
      </div>
    </div>

    <div v-if="services.length === 0" class="text-center py-8 text-[--text-secondary]">
      No hay servicios disponibles
    </div>
  </div>
</template>