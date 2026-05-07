<script setup lang="ts">
interface Props {
  status: 'waiting' | 'called' | 'attending' | 'completed' | 'no_show' | 'cancelled'
}

const props = defineProps<Props>()

const statusConfig = {
  waiting: { label: 'En espera', class: 'bg-primary/20 text-primary' },
  called: { label: 'Llamado', class: 'bg-amber-500/20 text-amber-400' },
  attending: { label: 'En atención', class: 'bg-blue-500/20 text-blue-400' },
  completed: { label: 'Completado', class: 'bg-green-500/20 text-green-400' },
  no_show: { label: 'No asistido', class: 'bg-red-500/20 text-red-400' },
  cancelled: { label: 'Cancelado', class: 'bg-gray-500/20 text-gray-400' },
}

const config = computed(() => statusConfig[props.status] || statusConfig.waiting)
</script>

<template>
  <span class="inline-block px-3 py-1 rounded-full text-sm font-medium" :class="config.class">
    {{ config.label }}
  </span>
</template>