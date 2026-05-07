<script setup lang="ts">
import { cn } from '~/utils/cn.utils'

interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')" />
        <div
          :class="cn(
            'relative w-full glass rounded-xl p-6',
            sizeClasses[props.size]
          )"
        >
          <button
            v-if="title"
            class="absolute top-4 right-4 text-[--text-muted] hover:text-white transition-colors"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 v-if="title" class="text-xl font-display font-bold text-white mb-4">{{ title }}</h3>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>