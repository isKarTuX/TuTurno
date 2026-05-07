<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})

const classes = computed(() =>
  cn(
    'inline-flex items-center font-medium rounded-full',
    {
      'bg-white/10 text-white': props.variant === 'default',
      'bg-green-500/20 text-green-400': props.variant === 'success',
      'bg-amber-500/20 text-amber-400': props.variant === 'warning',
      'bg-red-500/20 text-red-400': props.variant === 'error',
      'bg-blue-500/20 text-blue-400': props.variant === 'info',
    },
    {
      'px-2 py-0.5 text-xs': props.size === 'sm',
      'px-3 py-1 text-sm': props.size === 'md',
    }
  )
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>