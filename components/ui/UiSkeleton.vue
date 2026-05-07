<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: '1rem',
})

const classes = computed(() =>
  cn(
    'animate-pulse bg-white/10',
    {
      'rounded': props.variant === 'text',
      'rounded-full': props.variant === 'circular',
      'rounded-lg': props.variant === 'rectangular',
    },
    props.class
  )
)
</script>

<template>
  <div :class="classes" :style="{ width, height }" />
</template>