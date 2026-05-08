<script setup lang="ts">
const features = [
  {
    title: 'Dashboard en tiempo real',
    description: 'Visualiza la cola de turnos, tiempos de espera y métricas de atención en un solo lugar.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: 'Llamado automático',
    description: 'Llama turnos con un clic. El sistema notifica automáticamente al siguiente ciudadano.',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    title: 'Reportes detallados',
    description: 'Accede a reportes de turnos atendidos, tiempos promedio y más para optimizar tu servicio.',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'Multi-servicio',
    description: 'Gestiona múltiples servicios y puntos de atención desde una única plataforma.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
]
</script>

<template>
  <section class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent" />

    <div class="max-w-7xl mx-auto relative">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
            Para entidades
          </span>

          <h2 class="text-4xl sm:text-5xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Optimiza la gestión<br >
            <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              de tu punto de atención
            </span>
          </h2>

          <p class="text-lg text-[--text-secondary] mb-10 max-w-lg">
            TuTurno es una poderosa herramienta para gestionar tu punto de atención.
            Olvídate del caos de las filas y optimiza tu operación.
          </p>

          <div class="space-y-5">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="flex gap-5 group"
            >
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-200">
                <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                </svg>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {{ feature.title }}
                </h3>
                <p class="text-sm text-[--text-muted]">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/auth/register?role=operator"
            class="inline-flex items-center gap-2 mt-10 px-7 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Registrar mi entidad
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <div class="relative">
          <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-indigo-500/20 rounded-3xl blur-2xl opacity-50" />

          <div class="relative bg-[--bg-elevated] rounded-2xl p-5 border border-white/10 shadow-2xl">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-white">EPS Sura</p>
                  <p class="text-xs text-[--text-muted]">Montería, Córdoba</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span class="text-xs text-green-400 font-medium">En vivo</span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-5">
              <div class="bg-white/5 rounded-xl p-3 text-center">
                <p class="text-2xl font-display font-bold text-white">12</p>
                <p class="text-xs text-[--text-muted]">En espera</p>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center">
                <p class="text-2xl font-display font-bold text-amber-400">A-007</p>
                <p class="text-xs text-[--text-muted]">Llamado</p>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center">
                <p class="text-2xl font-display font-bold text-green-400">4:32</p>
                <p class="text-xs text-[--text-muted]">T. promedio</p>
              </div>
            </div>

            <div class="space-y-2 mb-5">
              <div class="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-2xl font-display font-bold text-amber-400">A-007</span>
                  <div>
                    <span class="text-xs text-amber-400 font-medium">Llamando</span>
                    <p class="text-xs text-[--text-muted]">General · Juan Pérez</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 flex items-center justify-center transition-colors">
                    <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between bg-white/5 rounded-xl p-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xl font-display font-bold text-white/70">A-008</span>
                  <span class="text-xs text-[--text-muted]">General</span>
                </div>
                <span class="text-xs text-[--text-muted]">#1</span>
              </div>

              <div class="flex items-center justify-between bg-white/5 rounded-xl p-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xl font-display font-bold text-white/70">A-009</span>
                  <span class="text-xs text-[--text-muted]">General</span>
                </div>
                <span class="text-xs text-[--text-muted]">#2</span>
              </div>

              <div class="flex items-center justify-between bg-white/5 rounded-xl p-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xl font-display font-bold text-white/70">B-003</span>
                  <span class="text-xs text-[--text-muted]">Preferencial</span>
                </div>
                <span class="text-xs text-[--text-muted]">#3</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/5">
              <div class="flex items-center gap-4 text-xs text-[--text-muted]">
                <span>Atendidos: <strong class="text-white">47</strong></span>
                <span class="hidden sm:inline">Turnos hoy: <strong class="text-white">59</strong></span>
              </div>
              <span class="text-xs text-[--text-muted]">Actualizado hace 5s</span>
            </div>
          </div>

          <button class="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>