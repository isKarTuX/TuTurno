<script setup lang="ts">
import type { Service } from '~/types'

interface Props {
  services: Service[]
}

defineProps<Props>()

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

function isServiceOpen(service: Service): boolean {
  if (!isClient.value) return true
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  const [openH, openM] = service.openTime.split(':').map(Number)
  const [closeH, closeM] = service.closeTime.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  return currentTime >= openMinutes && currentTime <= closeMinutes && !service.isPaused && service.isActive
}

const statusConfig = {
  open: {
    label: 'Abierto',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  paused: {
    label: 'Pausado',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  closed: {
    label: 'Cerrado',
    gradient: 'from-gray-500/20 to-gray-600/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/10',
  },
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(service, index) in services"
      :key="service.id"
      class="group relative rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5"
      :class="[
        'bg-[--bg-surface]',
        'border border-white/8',
        'shadow-lg',
        'hover:shadow-xl',
        'hover:border-white/12',
      ]"
      :style="{ animationDelay: `${index * 60}ms` }"
    >
      <div class="p-5">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="text-base font-semibold text-white tracking-tight">{{ service.name }}</h4>
              <span
                v-if="service.isPaused"
                class="shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full"
                :class="[statusConfig.paused.gradient, statusConfig.paused.border, statusConfig.paused.text]"
              >
                {{ statusConfig.paused.label }}
              </span>
              <span
                v-else-if="isServiceOpen(service)"
                class="shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full"
                :class="[statusConfig.open.gradient, statusConfig.open.border, statusConfig.open.text]"
              >
                {{ statusConfig.open.label }}
              </span>
              <span
                v-else
                class="shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full"
                :class="[statusConfig.closed.gradient, statusConfig.closed.border, statusConfig.closed.text]"
              >
                {{ statusConfig.closed.label }}
              </span>
            </div>

            <p v-if="service.description" class="text-sm text-[--text-secondary] leading-relaxed mb-4">
              {{ service.description }}
            </p>

            <div class="flex flex-wrap items-center gap-4 text-xs text-[--text-muted]">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">{{ service.openTime }} - {{ service.closeTime }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="font-medium">~{{ service.avgAttentionTime }} min</span>
              </div>
            </div>
          </div>

          <NuxtLink
            :to="`/app/entities/${service.entityId}/${service.id}`"
            class="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[--color-primary]/20 to-[--color-accent]/10 border border-[--color-primary]/20 text-[--color-primary-light] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[--color-primary]/20"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>

    <div v-if="services.length === 0" class="py-12 text-center">
      <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-sm text-[--text-secondary]">No hay servicios disponibles</p>
    </div>
  </div>
</template>