<script setup lang="ts">
const features = [
  {
    title: 'Panel de control intuitivo',
    description: 'Interfaz simple y potente para gestionar tu cola de turnos sin complicaciones.',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    title: 'Llamado con un clic',
    description: 'Llama al siguiente turno instantáneamente. Notificaciones automáticas al ciudadano.',
    icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728',
  },
  {
    title: 'Métricas en tiempo real',
    description: 'Visualiza turnos atendidos, tiempos promedio y conoce mejor tu operación.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: 'Gestión multi-servicio',
    description: 'Administra múltiples servicios y puntos de atención desde una sola plataforma.',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
]
</script>

<template>
  <section id="para-operadores" class="py-24 px-4 sm:px-6 lg:px-8 bg-[--bg-surface]">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="order-2 lg:order-1">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-10 border-primary-20 rounded-full mb-6">
            <span class="text-xs text-[--text-secondary]">Para operadores</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Gestiona tu cola<br class="hidden sm:block" >
            <span class="bg-gradient-to-r from-[--color-primary] to-[--color-accent] bg-clip-text text-transparent">
              sin complicaciones
            </span>
          </h2>

          <p class="text-lg text-[--text-secondary] mb-8 max-w-xl">
            Olvídate del caos. TuTurno te da las herramientas para gestionar turnos de manera eficiente y profesional.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-[--color-primary]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.icon" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white mb-1">{{ feature.title }}</h3>
                <p class="text-xs text-[--text-muted]">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/auth/register?role=operator"
            class="inline-flex items-center gap-2 px-6 py-3 bg-[--color-primary] hover:bg-[--color-primary-hover] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[--color-primary]/20 hover:-translate-y-0.5"
          >
            Probar gratis
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <div class="order-1 lg:order-2">
          <div class="relative">
            <div class="bg-[--bg-elevated] rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">Panel de operador</p>
                    <p class="text-xs text-[--text-muted]">EPS Sura - Montería</p>
                  </div>
                </div>
                <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">En vivo</span>
              </div>

              <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs text-[--text-muted]">Turno actual</span>
                  <span class="text-xs text-[--text-muted]">3 en cola</span>
                </div>
                <div class="flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                  <div>
                    <p class="text-xs text-amber-400 mb-1">Llamando</p>
                    <p class="text-4xl font-display font-bold text-amber-400">A-012</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="w-10 h-10 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 flex items-center justify-center text-amber-400 transition-colors">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                      </svg>
                    </button>
                    <button class="w-10 h-10 rounded-lg bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center text-green-400 transition-colors">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button class="w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-colors">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div class="flex items-center gap-3">
                    <span class="text-lg font-bold text-white/60">A-013</span>
                    <span class="text-xs text-[--text-muted]">General</span>
                  </div>
                  <span class="text-xs text-[--text-muted]">#1</span>
                </div>
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div class="flex items-center gap-3">
                    <span class="text-lg font-bold text-white/60">A-014</span>
                    <span class="text-xs text-[--text-muted]">General</span>
                  </div>
                  <span class="text-xs text-[--text-muted]">#2</span>
                </div>
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div class="flex items-center gap-3">
                    <span class="text-lg font-bold text-white/60">B-002</span>
                    <span class="text-xs text-[--text-muted]">Preferencial</span>
                  </div>
                  <span class="text-xs text-[--text-muted]">#3</span>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-4 text-xs text-[--text-muted]">
                  <span>Atendidos: <strong class="text-white">24</strong></span>
                  <span>T. promedio: <strong class="text-white">4:32</strong></span>
                </div>
                <span class="text-xs text-[--text-muted]">Hoy 14:32</span>
              </div>
            </div>

            <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-20 rounded-full blur-2xl" />
            <div class="absolute -top-4 -left-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
