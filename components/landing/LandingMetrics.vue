<script setup lang="ts">
const metrics = [
  {
    value: '10,000+',
    label: 'Turnos generados',
    description: 'En entidades reales de Montería',
    icon: '🎫',
  },
  {
    value: '85%',
    label: 'Tiempo reducido',
    description: 'De espera promedio vs. sistema tradicional',
    icon: '⚡',
  },
  {
    value: '50+',
    label: 'Entidades',
    description: 'EPS, bancos y oficinas públicas',
    icon: '🏢',
  },
  {
    value: '4.8/5',
    label: 'Satisfacción',
    description: 'Calificación promedio de usuarios',
    icon: '⭐',
  },
]
</script>

<template>
  <section class="py-24 px-6 bg-white/5">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          TuTurno en números
        </h2>
        <p class="text-[--text-secondary] text-lg">
          Impacto real en la gestión de turnos
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="glass p-8 rounded-xl text-center hover:bg-white/10 transition-colors"
        >
          <div class="text-4xl mb-4">{{ metric.icon }}</div>
          <div class="text-4xl font-display font-bold text-primary mb-2">{{ metric.value }}</div>
          <div class="text-lg font-semibold text-white mb-1">{{ metric.label }}</div>
          <div class="text-sm text-[--text-secondary]">{{ metric.description }}</div>
        </div>
      </div>
    </div>
  </section>
</template>