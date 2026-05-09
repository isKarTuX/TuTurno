<script setup lang="ts">
const features = [
  {
    title: 'Sin registro previo',
    description: 'Solicita tu turno con solo tu número de cédula. Sin cuentas, sin contraseñas.',
    icon: 'M16 7a4 4 0 00-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7 7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7H5a7 7 0 000 14h14a7 7 0 000-14',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    glow: 'emerald',
  },
  {
    title: 'Notificaciones push',
    description: 'Recibe alertas cuando tu turno se acerque. No más esperar sin saber cuándo te llamarán.',
    icon: 'M15 17h5l-1.405-1.405A2 2 0 0112 15.174V7.826a2 2 0 011.405-1.405L15 7.826V17z M5 7.826a2 2 0 004 0V7.826a2 2 0 00-4 0z',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow: 'violet',
  },
  {
    title: 'Seguimiento en tiempo real',
    description: 'Monitorea tu posición en la cola desde cualquier dispositivo. Sabrás exactamente cuándo presentarte.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    glow: 'amber',
  },
  {
    title: 'Código QR',
    description: 'Recibe un código único que el operador escaneará cuando sea tu turno. Simple y seguro.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    glow: 'blue',
  },
]

const glowColors = {
  emerald: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
  violet: 'shadow-violet-500/30 hover:shadow-violet-500/50',
  amber: 'shadow-amber-500/30 hover:shadow-amber-500/50',
  blue: 'shadow-blue-500/30 hover:shadow-blue-500/50',
}
</script>

<template>
  <section class="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[--color-primary]/5 to-transparent" />

    <div class="max-w-7xl mx-auto relative">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Para ciudadanos
        </div>

        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
          Tu turno, <span class="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">sin filas</span>
        </h2>

        <p class="text-lg lg:text-xl text-[--text-secondary] max-w-2xl mx-auto leading-relaxed">
          Olvídate de madrugar o dormir en la calle. Solicita tu turno digital y recibe actualizaciones en tiempo real.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="group relative"
          :style="{ animationDelay: `${index * 80}ms` }"
        >
          <div
            class="relative h-full rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2"
            :class="['bg-[--bg-surface]', 'border border-white/5', glowColors[feature.glow as keyof typeof glowColors], 'shadow-lg']"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br via-transparent to-transparent"
              :class="[feature.gradient]"
              style="mix-blend-mode: overlay;"
            />

            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              :class="feature.gradient"
              style="mix-blend-mode: soft-light;"
            />

            <div class="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700" :class="feature.gradient" />

            <div class="relative">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                :class="feature.gradient"
              >
                <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                </svg>
              </div>

              <h3 class="text-lg font-bold text-white mb-2 tracking-tight">
                {{ feature.title }}
              </h3>

              <p class="text-sm text-[--text-muted] leading-relaxed">
                {{ feature.description }}
              </p>
            </div>

            <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <NuxtLink
          to="/auth/register"
          class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
        >
          <span>Solicitar mi turno</span>
          <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>