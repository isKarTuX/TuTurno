<script setup lang="ts">
const { observeAll } = useScrollReveal({ threshold: 0.1 })

const metrics = [
  {
    value: '10,000+',
    label: 'Turnos generados',
    description: 'En entidades reales de Montería',
    icon: 'ticket',
    accent: 'violet',
  },
  {
    value: '85%',
    label: 'Tiempo reducido',
    description: 'De espera promedio vs. sistema tradicional',
    icon: 'zap',
    accent: 'amber',
  },
  {
    value: '50+',
    label: 'Entidades',
    description: 'EPS, bancos y oficinas públicas',
    icon: 'building',
    accent: 'emerald',
  },
  {
    value: '4.8/5',
    label: 'Satisfacción',
    description: 'Calificación promedio de usuarios',
    icon: 'star',
    accent: 'blue',
  },
]

const iconPaths = {
  ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.951-.69l1.519-4.674z',
}

const accentMap = {
  violet: { bg: 'from-violet-500/20 to-violet-600/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  amber: { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  blue: { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', border: 'border-blue-500/20' },
}

onMounted(() => {
  observeAll('.metric-card')
})
</script>

<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

    <div class="max-w-6xl mx-auto relative">
      <div class="text-center mb-16">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Métricas
        </span>
        <h2 class="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
          TuTurno en números
        </h2>
        <p class="text-lg text-[--text-secondary]">
          Impacto real en la gestión de turnos
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(metric, index) in metrics"
          :key="metric.label"
          class="metric-card reveal glass p-6 lg:p-8 rounded-2xl text-center hover:bg-white/8 transition-all duration-300 group"
          :class="['reveal-delay-' + (index + 1)]"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-5"
            :class="accentMap[metric.accent as keyof typeof accentMap].bg"
          >
            <svg
              class="w-7 h-7"
              :class="accentMap[metric.accent as keyof typeof accentMap].text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[metric.icon as keyof typeof iconPaths]" />
            </svg>
          </div>

          <div class="text-4xl lg:text-5xl font-black font-display text-white mb-2 tracking-tight">
            {{ metric.value }}
          </div>
          <div class="text-base font-semibold mb-1" :class="accentMap[metric.accent as keyof typeof accentMap].text">
            {{ metric.label }}
          </div>
          <div class="text-sm text-[--text-muted]">
            {{ metric.description }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
