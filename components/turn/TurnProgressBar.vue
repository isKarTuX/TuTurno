<script setup lang="ts">
interface Props {
  position: number
  total: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
})

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.max(0, Math.min(100, ((props.total - props.position) / props.total) * 100))
})

const showMarker = ref(false)

watch(() => props.position, () => {
  if (props.animated) {
    showMarker.value = true
    setTimeout(() => {
      showMarker.value = false
    }, 500)
  }
})
</script>

<template>
  <div class="relative">
    <div class="h-3 bg-white/5 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out relative"
        :style="{ width: `${percentage}%` }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-[--color-primary] to-[--color-accent]"
        />
        <div
          v-if="animated"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        />
      </div>
    </div>

    <Transition name="marker">
      <div
        v-if="showMarker"
        class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
        :style="{ left: `calc(${percentage}% - 10px)` }"
      >
        <div class="w-2 h-2 bg-[--color-primary] rounded-full" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.marker-enter-active,
.marker-leave-active {
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.marker-enter-from,
.marker-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.5);
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>