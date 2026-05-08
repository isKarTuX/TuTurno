<script setup lang="ts">
const features = [
  {
    title: 'Sin registro previo',
    description: 'Solicita tu turno con solo tu número de cédula. Sin cuentas, sin contraseñas.',
    icon: 'M16 7a4 4 0 00-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7 7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7H5a7 7 0 000 14h14a7 7 0 000-14',
    color: 'emerald',
  },
  {
    title: 'Notificaciones push',
    description: 'Recibe alertas cuando tu turno se acerque. No más esperar sin saber cuándo te llamarán.',
    icon: 'M15 17h5l-1.405-1.405A2 2 0 0112 15.174V7.826a2 2 0 011.405-1.405L15 7.826V17z M5 7.826a2 2 0 004 0V7.826a2 2 0 00-4 0z',
    color: 'violet',
  },
  {
    title: 'Seguimiento en tiempo real',
    description: 'Monitorea tu posición en la cola desde cualquier dispositivo. Sabrás exactamente cuándo presentarte.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'amber',
  },
  {
    title: 'Código QR',
    description: 'Recibe un código único que el operador escaneará cuando sea tu turno. Simple y seguro.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'blue',
  },
]

const colorMap = {
  emerald: 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  violet: 'from-violet-500/15 to-violet-600/5 border-violet-500/20 text-violet-400',
  amber: 'from-amber-500/15 to-amber-600/5 border-amber-500/20 text-amber-400',
  blue: 'from-blue-500/15 to-blue-600/5 border-blue-500/20 text-blue-400',
}
</script>

<template>
  <section class="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium uppercase tracking-wider mb-4">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 00-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7 7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7H5a7 7 0 000 14h14a7 7 0 000-14" />
          </svg>
          Para ciudadanos
        </span>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Tu turno, sin filas
        </h2>
        <p class="text-lg text-[--text-secondary] max-w-2xl mx-auto">
          Olvídate de madrugar o dormir en la calle. Solicita tu turno digital y recibe actualizaciones en tiempo real.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="relative group"
        >
          <div
            class="h-full rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            :class="[colorMap[feature.color as keyof typeof colorMap], 'bg-[--bg-surface]']"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              :class="colorMap[feature.color as keyof typeof colorMap].split(' ')[0]"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-[--text-muted]">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
        >
          Solicitar mi turno
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
