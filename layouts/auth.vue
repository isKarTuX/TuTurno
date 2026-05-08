<script setup lang="ts">
interface Props {
  showBrandSide?: boolean
}

withDefaults(defineProps<Props>(), {
  showBrandSide: true,
})
</script>

<template>
  <div class="min-h-screen flex bg-[--bg-base]">
    <div
      v-if="showBrandSide"
      class="hidden lg:flex lg:w-2/5 relative overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[--bg-base] to-[--bg-base]" />

      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[180px] -translate-y-1/3 translate-x-1/3" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[150px]" />

      <div class="relative z-10 flex flex-col justify-center px-10 xl:px-14 py-16 w-full">
        <UiLogo size="xl" variant="handwritten" animated />

        <div class="mt-12 flex justify-center">
          <div class="w-[260px]">
            <HeroSimulator :scale="0.75" />
          </div>
        </div>

        <div class="mt-10 space-y-5">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-white font-medium text-sm">10,000+ turnos generados</p>
              <p class="text-xs text-[--text-muted]">En todo Colombia</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-medium text-sm">85% menos tiempo de espera</p>
              <p class="text-xs text-[--text-muted]">Medición promedio</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-medium text-sm">Menos de 30 minutos</p>
              <p class="text-xs text-[--text-muted]">Para recibir tu turno</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-[480px]">
        <slot />
      </div>
    </div>
  </div>
</template>
