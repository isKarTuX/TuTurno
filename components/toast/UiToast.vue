<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000,
  dismissible: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const isVisible = ref(true)

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      isVisible.value = false
      emit('dismiss')
    }, props.duration)
  }
})

const config = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        text: 'text-green-400',
        icon: 'M5 13l4 4L19 7',
      }
    case 'error':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      }
    case 'warning':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      }
    default:
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      }
  }
})
</script>

<template>
  <Transition name="toast">
    <div
      v-if="isVisible"
      class="glass rounded-xl p-4 max-w-sm w-full"
      :class="[config.bg, config.border]"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <svg
          class="w-5 h-5 shrink-0 mt-0.5"
          :class="config.text"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="config.icon"
          />
        </svg>

        <div class="flex-1 min-w-0">
          <p
            v-if="title"
            class="font-medium"
            :class="config.text"
          >
            {{ title }}
          </p>
          <p
            v-if="message"
            class="text-sm text-white/70 mt:1"
          >
            {{ message }}
          </p>
        </div>

        <button
          v-if="dismissible"
          class="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          @click="isVisible = false; emit('dismiss')"
        >
          <svg class="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 200ms var(--ease-out);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>