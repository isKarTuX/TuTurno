<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Sin contenido',
  description: 'No hay elementos para mostrar',
  icon: 'ticket',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="relative w-28 h-28 mb-6">
      <div class="absolute inset-0 rounded-3xl bg-white/5" />
      <div class="absolute inset-3 rounded-2xl bg-white/5 flex items-center justify-center">
        <Icon
          :name="icon"
          class="w-12 h-12 text-white/20"
        />
      </div>
    </div>

    <h3 class="text-xl font-semibold text-white mb-2">
      {{ title }}
    </h3>
    <p class="text-white/50 max-w-[280px] mx-auto mb-6">
      {{ description }}
    </p>

    <slot name="action" />
  </div>
</template>