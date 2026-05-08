<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  modelValue?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search'
  placeholder?: string
  disabled?: boolean
  error?: string
  success?: boolean
  label?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (val) => emit('update:modelValue', val),
})

const isFocused = ref(false)
const hasValue = computed(() => inputValue.value.length > 0)

const iconPaths: Record<string, string> = {
  email: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  lock: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  phone: 'M2.25 4.5a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V4.5zm3 0a.75.75 0 01.75-.75h6.75a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H6.75A.75.75 0 016 6.75V4.5zm3 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V4.5zm3 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H12.75A.75.75 0 0112 6.75V4.5zM19.5 4.5a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75V4.5zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75V7.5a.75.75 0 01-.75.75h-2.25A.75.75 0 0119.5 7.5V7.5zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V10.5zm0 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H19.5a.75.75 0 01-.75-.75V13.5z',
  user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.503 7.503 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  id: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 0v3.75m-3 0h3',
}

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<template>
  <div class="relative">
    <div
      v-if="label"
      class="absolute left-0 pl-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
      :class="[
        (isFocused || hasValue) ? 'pt-4 pb-2 text-[10px]' : 'pt-3 pb-3 text-sm',
        isFocused ? 'text-[--color-primary]' : 'text-[--text-muted]'
      ]"
      style="transform-origin: left top; transition: all 0.2s ease-out;"
    >
      {{ label }}
    </div>

    <div class="relative">
      <div v-if="icon && !isFocused && !hasValue" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[icon] || iconPaths.user" />
        </svg>
      </div>

      <div
        v-else-if="icon && (isFocused || hasValue)"
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
        :class="isFocused ? 'text-[--color-primary]' : 'text-[--text-muted]'"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[icon] || iconPaths.user" />
        </svg>
      </div>

      <input
        v-model="inputValue"
        :name="name"
        :type="inputType"
        :placeholder="(isFocused || hasValue) ? placeholder : ''"
        :disabled="disabled"
        :class="cn(
          'w-full py-3.5 bg-white/5 border rounded-xl text-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          icon ? 'pl-12 pr-12' : 'px-4',
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : success
              ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
              : 'border-white/10 focus:border-[--color-primary] focus:ring-[--color-primary]/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isFocused && !error && !success ? 'border-[--color-primary]/50' : ''
        )"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >

      <div v-if="type === 'password'" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <button
          type="button"
          class="text-[--text-muted] hover:text-white transition-colors"
          @click="showPassword = !showPassword"
        >
          <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c4.638 0 8.573-3.007 9.963-7.178.07-.207.07-.431 0-.639A10.475 10.475 0 0012 4.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.12 13.12L19.05 19.05" />
          </svg>
        </button>
      </div>

      <div v-else-if="success && !error" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <span v-if="error" class="text-xs text-red-400 mt-1.5 block">{{ error }}</span>
  </div>
</template>
