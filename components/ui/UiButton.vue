<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--bg-base]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white focus:ring-[--color-primary]': props.variant === 'primary',
      'border border-white/20 bg-transparent hover:bg-white/10 text-white focus:ring-white/30': props.variant === 'outline',
      'bg-transparent hover:bg-white/5 text-white focus:ring-white/20': props.variant === 'ghost',
    },
    {
      'px-3 py-1.5 text-sm': props.size === 'sm',
      'px-4 py-2.5 text-base': props.size === 'md',
      'px-6 py-3 text-lg': props.size === 'lg',
    }
  )
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </span>
    <slot />
  </button>
</template>