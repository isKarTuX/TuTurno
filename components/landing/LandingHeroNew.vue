<script setup lang="ts">
const trustBadges = [
  'Sin registro previo',
  'Notificaciones en tiempo real',
  'Gratis para todos',
]
</script>

<template>
  <section class="relative min-h-[100dvh] flex items-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[--bg-base] to-[--bg-base]" />

    <div class="absolute top-0 right-0 w-[700px] h-[700px] bg-[--color-primary]/10 rounded-full blur-[180px] -translate-y-1/3 translate-x-1/3" />
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[--color-primary-light]/8 rounded-full blur-[150px]" />

    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 lg:py-8">
      <div class="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">

        <div class="lg:col-span-7 text-left">
          <div class="mb-3">
            <span
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style="background: linear-gradient(135deg, rgba(108, 58, 232, 0.15), rgba(167, 139, 250, 0.1)); border: 1px solid rgba(108, 58, 232, 0.3); color: #A78BFA; text-shadow: 0 0 12px rgba(108, 58, 232, 0.5);"
            >
              <span class="w-2 h-2 rounded-full bg-[--color-primary] animate-pulse" style="box-shadow: 0 0 8px rgba(108, 58, 232, 0.8);" />
              Más de 500 entidades en Colombia
            </span>
          </div>

          <h1 class="mb-2">
            <div class="hero-logo-wrapper">
              <span class="hero-logo-tu" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(108, 58, 232, 0.2);">Tu</span>
              <span class="hero-logo-turno" style="text-shadow: 0 0 20px rgba(167, 139, 250, 0.5), 0 0 40px rgba(108, 58, 232, 0.3);">Turno</span>
            </div>
          </h1>

          <p
            class="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[--text-secondary] leading-[1.15] mb-3 tracking-tight"
          >
            Elimina las
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary-light] via-[--color-primary] to-[--color-primary-light]">
              filas para siempre
            </span>
          </p>

          <p
            class="text-sm sm:text-base text-[--text-secondary] mb-6 max-w-lg leading-relaxed"
          >
            Deja de esperar en filas. Solicita tu turno desde el celular y te avisamos cuando casi sea tu turno — sin registro, sin complicaciones.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <NuxtLink
              to="/onboarding/request-turn"
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
            class="flex flex-wrap gap-4"
          >
            <div
              v-for="badge in trustBadges"
              :key="badge"
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-full font-medium text-sm"
              style="background: linear-gradient(135deg, rgba(108, 58, 232, 0.12), rgba(167, 139, 250, 0.08)); border: 1px solid rgba(108, 58, 232, 0.25); color: #A78BFA; text-shadow: 0 0 8px rgba(108, 58, 232, 0.4);"
            >
              <div class="w-5 h-5 rounded-full bg-[--color-success]/20 flex items-center justify-center">
                <svg class="w-3 h-3 text-[--color-success]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>{{ badge }}</span>
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
.hero-logo-wrapper {
  display: inline-flex;
  align-items: baseline;
  gap: 0;
  line-height: 1;
  padding-right: 0.1em;
}

.hero-logo-tu {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  font-size: clamp(3.2rem, 8.5vw, 5.3rem);
  letter-spacing: 0.01em;
  color: white;
  transform: rotate(-1deg);
  display: inline-block;
}

.hero-logo-turno {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  font-size: clamp(3.2rem, 8.5vw, 5.3rem);
  letter-spacing: 0.01em;
  background: linear-gradient(
    135deg,
    oklch(98% 0.01 280) 0%,
    oklch(75% 0.12 280) 40%,
    oklch(98% 0.01 280) 60%,
    oklch(65% 0.15 280) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: rotate(-1deg);
  display: inline-block;
  padding-right: 0.05em;
}

@media (prefers-reduced-motion: reduce) {
  .hero-logo-wrapper {
    animation: none;
  }

  .hero-logo-tu,
  .hero-logo-turno {
    opacity: 1;
    background: none;
    -webkit-background-clip: unset;
    background-clip: unset;
    color: inherit;
    transform: none;
  }
}
</style>