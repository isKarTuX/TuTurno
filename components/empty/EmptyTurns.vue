<script setup lang="ts">
interface Props {
  context?: string
  description?: string
  actionLabel?: string
}

withDefaults(defineProps<Props>(), {
  context: 'activos',
  description: 'Los turnos que solicites aparecerán aquí',
  actionLabel: 'Solicitar turno',
})
</script>

<template>
  <div class="text-center py-16 px-4">
    <div class="relative w-32 h-32 mx-auto mb-6">
      <div class="absolute inset-0 rounded-3xl bg-[--color-primary]/10 animate-pulse" />
      <div class="absolute inset-4 rounded-2xl bg-[--color-primary]/20 flex items-center justify-center">
        <svg class="w-12 h-12 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
    </div>

    <h3 class="text-xl font-semibold text-white mb-2">
      Sin turnos {{ context }}
    </h3>
    <p class="text-white/50 max-w-[280px] mx-auto mb-6">
      {{ description }}
    </p>

    <slot name="action">
      <UiButton variant="primary">
        {{ actionLabel }}
      </UiButton>
    </slot>
  </div>
</template>