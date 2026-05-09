<script setup lang="ts">
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

      <div class="relative z-10 flex flex-col justify-between w-full p-8 xl:p-12">
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-[--color-primary] flex items-center justify-center">
              <svg viewBox="0 0 32 32" class="w-6 h-6">
                <path d="M16 4L6 12V14H26V12L16 4Z" fill="currentColor" class="text-white" />
                <rect x="12" y="14" width="8" height="14" rx="2" fill="currentColor" class="text-white" />
              </svg>
            </div>
            <span class="text-2xl font-bold tracking-tight">
              Tu<span style="color: var(--color-primary)">Turno</span>
            </span>
          </NuxtLink>
        </div>

        <div class="flex-1 flex items-center justify-center py-8">
          <div class="simulator-container">
            <HeroSimulator :scale="0.7" />
          </div>
        </div>

        <div class="space-y-6">
          <div class="space-y-3">
            <h1 class="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
              Tu turno,<br >
              <span style="color: var(--color-primary)">sin esperar</span>
            </h1>
            <p class="text-base text-white/60 max-w-sm">
              Olvídate de las filas. Solicita tu turno desde cualquier lugar y llega justo a tiempo.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-white">10K+</p>
              <p class="text-xs text-white/50">Turnos gestionados</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-white">85%</p>
              <p class="text-xs text-white/50">Menos tiempo de espera</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-white">&lt;30min</p>
              <p class="text-xs text-white/50">Tiempo promedio</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-h-screen">
      <header class="lg:hidden px-4 py-4 border-b border-white/5">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[--color-primary] flex items-center justify-center">
            <svg viewBox="0 0 32 32" class="w-5 h-5">
              <path d="M16 4L6 12V14H26V12L16 4Z" fill="currentColor" class="text-white" />
              <rect x="12" y="14" width="8" height="14" rx="2" fill="currentColor" class="text-white" />
            </svg>
          </div>
          <span class="font-bold tracking-tight">
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
  max-width: 320px;
}

@media (prefers-reduced-motion: reduce) {
  .simulator-container :deep(.phone-body) {
    animation: none;
  }
}
</style>