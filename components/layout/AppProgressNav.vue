<script setup lang="ts">
interface Step {
  id: string
  label: string
  status: 'completed' | 'current' | 'pending'
}

interface Props {
  steps: Step[]
}

defineProps<Props>()
</script>

<template>
  <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
    <div
      v-for="step in steps"
      :key="step.id"
      class="h-full float-left transition-all duration-500"
      :class="{
        'bg-[--color-primary]': step.status === 'completed' || step.status === 'current',
        'bg-transparent': step.status === 'pending',
      }"
      :style="{ width: `${100 / steps.length}%` }"
    />
  </div>
</template>