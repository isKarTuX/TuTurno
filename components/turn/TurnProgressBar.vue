<script setup lang="ts">
interface Props {
  current: number
  total: number
  avgAttentionTime: number
}

const props = defineProps<Props>()

const progress = computed(() => {
  if (props.total === 0) return 100
  return Math.round(((props.total - props.current) / props.total) * 100)
})

const estimatedMinutes = computed(() => props.current * props.avgAttentionTime)
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-[--text-secondary]">Progreso</span>
      <span class="text-white font-medium">{{ progress }}%</span>
    </div>
    <div class="h-3 bg-white/10 rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-[--text-secondary]">Turnos restantes</span>
      <span class="text-white">{{ current }}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-[--text-secondary]">Tiempo estimado</span>
      <span class="text-white">~{{ estimatedMinutes }} min</span>
    </div>
  </div>
</template>