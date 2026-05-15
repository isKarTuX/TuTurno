<script setup lang="ts">
import tuturnoLogoUrl from '~/assets/images/tuturno-logo.svg?url'

interface Props {
  showBrandSide?: boolean
}

withDefaults(defineProps<Props>(), {
  showBrandSide: true,
})
</script>

<template>
  <div class="min-h-screen flex">
    <div
      v-if="showBrandSide"
      class="hidden lg:flex lg:w-2/5 relative overflow-hidden"
      style="background: linear-gradient(135deg, oklch(13% 0.015 285) 0%, oklch(16% 0.015 285) 100%);"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30"
          style="background: radial-gradient(circle, oklch(55% 0.18 285 / 0.4), transparent 70%); filter: blur(60px);"
        />
        <div
          class="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-20"
          style="background: radial-gradient(circle, oklch(72% 0.16 285 / 0.4), transparent 70%); filter: blur(80px);"
        />
        <div
          class="absolute inset-0 opacity-[0.02]"
          style="background-image: linear-gradient(oklch(100% 0 0 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(100% 0 0 / 0.5) 1px, transparent 1px); background-size: 40px 40px;"
        />
      </div>

      <div class="relative z-10 flex flex-col w-full p-6 xl:p-8">
        <div class="flex-1 flex items-center justify-center -mt-4">
          <div class="simulator-container">
            <HeroSimulator :scale="0.65" />
          </div>
        </div>

        <div class="space-y-3">
          <h1 class="text-2xl xl:text-3xl font-bold text-white leading-tight tracking-tight">
            <span style="font-family: 'Caveat', cursive;">Tu turno</span>,<br >
            <span style="color: var(--color-primary)">sin esperar</span>
          </h1>
          <p class="text-sm text-white/60 max-w-sm">
            Olvídate de las filas. Solicita tu turno desde cualquier lugar y llega justo a tiempo.
          </p>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-h-screen">
      <header class="hidden lg:flex items-center justify-between px-4 py-4 border-b border-white/5">
        <NuxtLink to="/" class="inline-flex items-center gap-2 group">
          <img :src="tuturnoLogoUrl" alt="TuTurno" class="w-8 h-8 object-contain" draggable="false">
          <span class="font-bold tracking-tight" style="font-family: 'Caveat', cursive;">
            Tu<span style="color: var(--color-primary)">Turno</span>
          </span>
        </NuxtLink>
      </header>

      <header class="lg:hidden px-4 py-4 border-b border-white/5">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <img :src="tuturnoLogoUrl" alt="TuTurno" class="w-8 h-8 object-contain" draggable="false">
          <span class="font-bold tracking-tight" style="font-family: 'Caveat', cursive;">
            Tu<span style="color: var(--color-primary)">Turno</span>
          </span>
        </NuxtLink>
      </header>

      <main class="flex-1 flex flex-col justify-center px-4 py-8 lg:px-12">
        <slot />
      </main>

      <footer class="px-4 py-6 text-center border-t border-white/5">
        <p class="text-xs text-white/30">
          Al continuar, aceptas nuestros
          <a href="/terminos" class="text-white/40 hover:text-white transition-colors">Términos</a>
          y
          <a href="/privacidad" class="text-white/40 hover:text-white transition-colors">Política de Privacidad</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.simulator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 280px;
}

@media (prefers-reduced-motion: reduce) {
  .simulator-container :deep(.phone-body) {
    animation: none;
  }
}
</style>
