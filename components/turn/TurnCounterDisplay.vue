<script setup lang="ts">
interface Props {
  turnNumber: string
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
}
</script>

<template>
  <div class="relative">
    <div
      class="font-display font-bold text-primary turn-flip"
      :class="sizeClasses[size]"
    >
      {{ turnNumber }}
    </div>
  </div>
</template>