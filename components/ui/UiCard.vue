<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  variant?: 'default' | 'glass' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  padding: 'md',
  hoverable: false,
})

const classes = computed(() =>
  cn(
    'rounded-xl border transition-all duration-200',
    {
      'bg-white/5 border-white/10': props.variant === 'default',
      'glass': props.variant === 'glass',
      'bg-[--bg-elevated] border-white/10': props.variant === 'elevated',
    },
    {
      'p-0': props.padding === 'none',
      'p-4': props.padding === 'sm',
      'p-6': props.padding === 'md',
      'p-8': props.padding === 'lg',
    },
    props.hoverable && 'hover:bg-white/7 cursor-pointer'
  )
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>