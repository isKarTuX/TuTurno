<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function toggle() {
  if (!props.disabled) {
    isChecked.value = !isChecked.value
  }
}

const toggleClasses = computed(() =>
  cn(
    'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'w-11 h-6': props.size === 'md',
      'w-9 h-5': props.size === 'sm',
    },
    isChecked.value ? 'bg-primary' : 'bg-white/20'
  )
)

const knobClasses = computed(() =>
  cn(
    'pointer-events-none inline-block rounded-full bg-white shadow-sm transform transition-all duration-200 ease-out',
    {
      'w-5 h-5': props.size === 'md',
      'w-4 h-4': props.size === 'sm',
    },
    isChecked.value
      ? props.size === 'md' ? 'translate-x-5' : 'translate-x-4'
      : 'translate-x-0.5'
  )
)
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :disabled="disabled"
    :class="toggleClasses"
    @click="toggle"
  >
    <span :class="knobClasses" />
  </button>
</template>