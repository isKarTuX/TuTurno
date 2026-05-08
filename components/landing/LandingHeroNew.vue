<script setup lang="ts">
const trustBadges = [
  'Sin registro previo',
  'Notificaciones en tiempo real',
  'Gratis para todos',
]

const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <section class="relative min-h-[100dvh] flex items-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[--bg-base] to-[--bg-base]" />

    <div class="absolute top-0 right-0 w-[700px] h-[700px] bg-[--color-primary]/10 rounded-full blur-[180px] -translate-y-1/3 translate-x-1/3" />
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[--color-primary-light]/8 rounded-full blur-[150px]" />

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        <div class="lg:col-span-7 text-left">
          <div class="mb-6">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[--color-primary]/10 border border-[--color-primary]/20 text-sm text-[--color-primary-light]">
              <span class="w-2 h-2 rounded-full bg-[--color-primary] animate-pulse" />
              Más de 500 entidades en Colombia
            </span>
          </div>

          <h1 class="mb-4">
            <span
              class="block font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none animate-hero-logo"
              :style="{ animationDelay: '0ms' }"
            >
              <span class="text-white">Tu</span><span class="text-[--color-primary-light]">Turno</span>
            </span>
          </h1>

          <p
            class="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[--text-secondary] leading-[1.15] mb-6 tracking-tight"
            :class="isLoaded ? 'animate-fade-in-up' : 'opacity-0'"
            style="animation-delay: 200ms;"
          >
            Elimina las
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary-light] via-[--color-primary] to-[--color-primary-light]">
              filas para siempre
            </span>
          </p>

          <p
            class="text-base sm:text-lg text-[--text-secondary] mb-10 max-w-lg leading-relaxed"
            :class="isLoaded ? 'animate-fade-in-up' : 'opacity-0'"
            style="animation-delay: 400ms;"
          >
            Deja de esperar en filas. Solicita tu turno desde el celular y te avisamos cuando casi sea tu turno — sin registro, sin complicaciones.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 mb-12"
            :class="isLoaded ? 'animate-fade-in-up' : 'opacity-0'"
            style="animation-delay: 550ms;"
          >
            <NuxtLink
              to="/auth/register"
              class="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-press"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-[--color-primary] to-[--color-primary-dark] shadow-xl shadow-[--color-primary]/40" />
              <div class="absolute inset-0 bg-gradient-to-r from-[--color-primary-light] to-[--color-primary] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span class="relative flex items-center gap-2">
                Solicitar mi turno
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </NuxtLink>
            <a
              href="#como-funciona"
              class="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-semibold text-white rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              <span>Conoce cómo funciona</span>
            </a>
          </div>

          <div
            class="flex flex-wrap gap-5"
            :class="isLoaded ? 'animate-fade-in-up' : 'opacity-0'"
            style="animation-delay: 700ms;"
          >
            <div
              v-for="(badge, index) in trustBadges"
              :key="badge"
              class="flex items-center gap-2.5 animate-badge-fade-in"
              :style="{ animationDelay: `${700 + index * 100}ms` }"
            >
              <div class="w-5 h-5 rounded-full bg-[--color-success]/20 flex items-center justify-center">
                <svg class="w-3 h-3 text-[--color-success]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm text-[--text-muted]">{{ badge }}</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <HeroSimulator />
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animate-badge-fade-in {
  animation: badgeFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes badgeFadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-hero-logo,
  .animate-hero-shimmer,
  .animate-fade-in-up,
  .animate-badge-fade-in {
    animation: none;
    opacity: 1;
  }
}
</style>