<script setup lang="ts">
import tuturnoLogoUrl from '~/assets/images/tuturno-logo.svg?url'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  animated?: boolean
  variant?: 'default' | 'handwritten' | 'icon-only'
  showLogoMark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showTagline: false,
  animated: false,
  variant: 'default',
  showLogoMark: true,
})

const iconSizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
}

const taglineSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
}

const logoSizes = {
  sm: { tu: 'text-lg', turno: 'text-xl' },
  md: { tu: 'text-2xl', turno: 'text-3xl' },
  lg: { tu: 'text-3xl', turno: 'text-4xl' },
  xl: { tu: 'text-4xl', turno: 'text-5xl' },
}

const logoImageSize = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
}
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-3 group">
    <div
      v-if="showLogoMark && variant !== 'icon-only'"
      class="relative flex-shrink-0"
      :class="iconSizeClasses[props.size]"
    >
      <img
        :src="tuturnoLogoUrl"
        alt="TuTurno Logo"
        class="w-full h-full object-contain"
        :class="logoImageSize[props.size]"
      >
    </div>

    <div v-if="variant !== 'icon-only'" class="flex flex-col">
      <div class="flex items-baseline">
        <span
          v-if="variant === 'default'"
          class="font-logo font-bold tracking-tight text-white transition-all duration-200 group-hover:text-[--color-primary-light]"
          :class="[
            sizeClasses[props.size],
            { 'animate-logo-reveal': props.animated }
          ]"
        >
          TuTurno
        </span>

        <template v-else-if="variant === 'handwritten'">
          <span
            class="font-logo font-bold text-white"
            :class="logoSizes[props.size].tu"
            style="transform: rotate(-1deg);"
          >
            Tu
          </span>
          <span
            class="font-logo font-bold text-[--color-primary-light] tracking-wide"
            :class="[
              logoSizes[props.size].turno,
              { 'animate-logo-float': props.animated }
            ]"
            style="transform: rotate(-1deg);"
          >
            Turno
          </span>
        </template>
      </div>

      <span
        v-if="props.showTagline"
        class="text-[--text-secondary] tracking-wide"
        :class="taglineSizeClasses[props.size]"
      >
        Elimina las filas
      </span>
    </div>

    <div v-else class="w-10 h-10 rounded-xl">
      <img
        :src="tuturnoLogoUrl"
        alt="TuTurno"
        class="w-full h-full object-contain"
      >
    </div>
  </NuxtLink>
</template>

<style scoped>
.animate-logo-glow {
  animation: logo-glow 3s ease-in-out infinite;
}

.animate-logo-reveal {
  animation: logo-reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  opacity: 0;
  filter: blur(4px);
}

.animate-logo-float {
  animation: logo-float 4s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

@keyframes logo-glow {
  0%, 100% {
    box-shadow: 0 0 20px oklch(55% 0.15 280 / 0.4);
  }
  50% {
    box-shadow: 0 0 35px oklch(55% 0.15 280 / 0.7);
  }
}

@keyframes logo-reveal {
  to {
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  25% { transform: translateY(-2px) rotate(-2.5deg); }
  75% { transform: translateY(-1px) rotate(-1.5deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-logo-glow,
  .animate-logo-reveal,
  .animate-logo-float,
  .animate-spin-slow {
    animation: none;
  }
}
</style>