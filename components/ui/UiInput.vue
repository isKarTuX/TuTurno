<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  modelValue?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search'
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm text-[--text-secondary] mb-1">
      {{ label }}
    </label>
    <input
      v-model="inputValue"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="cn(
        'w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder:text-[--text-muted] transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        error
          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
          : 'border-white/10 focus:border-[--color-primary] focus:ring-[--color-primary]/20',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )"
    />
    <span v-if="error" class="text-sm text-red-400">{{ error }}</span>
  </div>
</template>