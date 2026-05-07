<script setup lang="ts">
const features = [
  {
    title: 'Dashboard en tiempo real',
    description: 'Visualiza la cola de turnos, tiempos de espera y métricas de atención en un solo lugar.',
    icon: '📊',
  },
  {
    title: 'Llamado automático',
    description: 'Llama turnos con un clic. El sistema notifica automáticamente al siguiente ciudadano.',
    icon: '📢',
  },
  {
    title: 'Reportes detallados',
    description: 'Accede a reportes de turnos atendidos, tiempos promedio y más para optimizar tu servicio.',
    icon: '📈',
  },
  {
    title: 'Multi-servicio',
    description: 'Gestiona múltiples servicios y puntos de atención desde una única plataforma.',
    icon: '🏢',
  },
]
</script>

<template>
  <section class="py-24 px-6 bg-white/5">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Para entidades y operadores
          </h2>
          <p class="text-[--text-secondary] text-lg mb-8">
            TuTurno también es una poderosa herramienta para gestionar tu punto de atención.
            Olvídate del caos de las filas yoptimiza tu operación.
          </p>

          <div class="space-y-6">
            <div v-for="feature in features" :key="feature.title" class="flex gap-4">
              <div class="text-3xl">{{ feature.icon }}</div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">{{ feature.title }}</h3>
                <p class="text-[--text-secondary] text-sm">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/auth/register?role=operator"
            class="inline-block mt-8 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
          >
            Registrar mi entidad →
          </NuxtLink>
        </div>

        <div class="relative">
          <div class="glass p-8 rounded-2xl">
            <div class="bg-[--bg-surface] rounded-xl p-6 mb-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-[--text-secondary]">Cola de espera</span>
                <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">En vivo</span>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span class="text-2xl font-bold text-amber-400">A-003</span>
                  <span class="text-sm text-[--text-secondary]">Llamado</span>
                </div>
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span class="text-2xl font-bold text-primary">A-004</span>
                  <span class="text-sm text-[--text-secondary]">En espera #1</span>
                </div>
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span class="text-2xl font-bold text-white/60">A-005</span>
                  <span class="text-sm text-[--text-secondary]">En espera #2</span>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  </section>
</template>