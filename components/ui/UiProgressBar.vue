<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  size: 'md',
  showLabel: false,
  color: 'primary',
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))

const colorClasses = {
  primary: 'bg-[--color-primary]',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}
</script>

<template>
  <div class="w-full">
    <div
      :class="cn(
        'w-full bg-white/10 rounded-full overflow-hidden',
        sizeClasses[props.size]
      )"
    >
      <div
        :class="cn('h-full transition-all duration-300 rounded-full', colorClasses[props.color])"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <div v-if="showLabel" class="flex justify-between mt-1 text-xs text-[--text-secondary]">
      <span>{{ value }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>