<script setup lang="ts">
interface Props {
  controlLabel: string
  controlIcon: string
  canGoBack: boolean
  isAutoPlaying: boolean
  currentScreenIndex: number
  totalScreens: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'next' | 'prev' | 'reset' | 'toggleAutoPlay'): void
}>()
</script>

<template>
  <div class="simulator-controls">
    <div class="progress-dots">
      <span
        v-for="i in totalScreens"
        :key="i"
        class="dot"
        :class="{ active: i - 1 === currentScreenIndex }"
      />
    </div>

    <div class="controls">
      <button
        class="control-btn"
        :disabled="!canGoBack"
        aria-label="Anterior"
        @click="emit('prev')"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <button
        class="control-btn play-pause"
        :aria-label="isAutoPlaying ? 'Pausar' : 'Reproducir'"
        @click="emit('toggleAutoPlay')"
      >
        <svg v-if="!isAutoPlaying" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      </button>

      <button
        class="control-btn"
        aria-label="Siguiente"
        @click="emit('next')"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <button
        class="control-btn reset"
        aria-label="Reiniciar"
        @click="emit('reset')"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m0 0a8.001 8.001 0 0114.607 2.108l.688 1.052m-2.295 2.295a8.001 8.001 0 01-12.585-3.04L4.001 7.5M4 4v5h.582m0 0a8.001 8.001 0 0114.607 2.108l.688 1.052"/>
        </svg>
      </button>
    </div>

    <span class="control-label">{{ controlLabel }}</span>
  </div>
</template>

<style scoped>
.simulator-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: oklch(12% 0.02 280);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  width: 320px;
}

.progress-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: oklch(50% 0.02 280 / 0.3);
  transition: all 200ms var(--ease-out);
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: oklch(55% 0.15 280);
}

.controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: oklch(20% 0.02 280);
  border: 1px solid oklch(100% 0 0 / 0.08);
  color: oklch(72% 0.02 280);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms var(--ease-out);
  cursor: pointer;
}

.control-btn:hover:not(:disabled) {
  background: oklch(25% 0.02 280);
  color: oklch(98% 0.01 280);
  transform: scale(1.05);
}

.control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn.play-pause {
  width: 48px;
  height: 48px;
  background: oklch(55% 0.15 280);
  color: white;
}

.control-btn.play-pause:hover {
  background: oklch(60% 0.15 280);
}

.control-btn svg {
  width: 18px;
  height: 18px;
}

.control-label {
  font-size: 0.75rem;
  color: oklch(50% 0.02 280);
}

@media (max-width: 480px) {
  .simulator-controls {
    width: 100%;
    max-width: 320px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot,
  .control-btn {
    transition: none;
  }

  .control-btn:hover:not(:disabled) {
    transform: none;
  }
}
</style>