<script setup lang="ts">
import type { ScreenId } from '~/composables/useSimulator'

interface Props {
  currentScreen: ScreenId
  transitionDirection: 'next' | 'prev' | 'fade'
}

defineProps<Props>()
</script>

<template>
  <div class="simulator-screen">
    <slot />
  </div>
</template>

<style scoped>
.simulator-screen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>