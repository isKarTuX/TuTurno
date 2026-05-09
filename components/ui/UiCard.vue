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
    'relative overflow-hidden rounded-[2rem] transition-all duration-300 ease-out',
    {
      'bg-white/5 border border-white/10': props.variant === 'default',
      'glass border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_rgba(108,58,232,0.05)]': props.variant === 'glass',
      'bg-[#1A1A2E] border border-white/10 shadow-xl': props.variant === 'elevated',
    },
    {
      'p-0': props.padding === 'none',
      'p-4 sm:p-6': props.padding === 'sm',
      'p-6 sm:p-8': props.padding === 'md',
      'p-8 sm:p-10': props.padding === 'lg',
    },
    props.hoverable && 'hover:bg-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_16px_48px_rgba(108,58,232,0.15)] active:scale-[0.98] cursor-pointer'
  )
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>