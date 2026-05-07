<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  change: '',
  changeType: 'neutral',
})

const changeClass = computed(() => {
  switch (props.changeType) {
    case 'positive':
      return 'text-green-400'
    case 'negative':
      return 'text-red-400'
    default:
      return 'text-[--text-secondary]'
  }
})
</script>

<template>
  <div class="glass p-6 rounded-xl">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-[--text-secondary] mb-1">{{ title }}</p>
        <p class="text-3xl font-display font-bold text-white">{{ value }}</p>
        <p v-if="change" class="text-sm mt-2" :class="changeClass">
          {{ change }}
        </p>
      </div>
      <div v-if="icon" class="text-3xl">{{ icon }}</div>
    </div>
  </div>
</template>