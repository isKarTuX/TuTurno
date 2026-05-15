<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'default',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const variantClasses = {
  danger: {
    confirm: 'bg-red-500 hover:bg-red-600 text-white',
    icon: 'text-red-400',
    iconBg: 'bg-red-500/10',
  },
  warning: {
    confirm: 'bg-amber-500 hover:bg-amber-600 text-white',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  default: {
    confirm: 'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white',
    icon: 'text-[--color-primary]',
    iconBg: 'bg-[--color-primary]/10',
  },
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="emit('cancel')" />
        <div class="relative w-full max-w-sm glass rounded-xl p-6 shadow-2xl">
          <div class="flex items-start gap-4 mb-5">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :class="variantClasses[variant].iconBg">
              <svg v-if="variant === 'danger'" class="w-6 h-6" :class="variantClasses[variant].icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else-if="variant === 'warning'" class="w-6 h-6" :class="variantClasses[variant].icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-6 h-6" :class="variantClasses[variant].icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 v-if="title" class="text-lg font-semibold text-white mb-1">{{ title }}</h3>
              <p class="text-sm text-[--text-secondary] leading-relaxed">{{ message }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              :class="cn('flex-1 px-4 py-2.5 font-medium rounded-xl transition-all duration-200 active:scale-[0.98]', variantClasses[variant].confirm)"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>