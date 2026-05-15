<script setup lang="ts">
const features = [
  {
    title: 'Sin registro previo',
    description: 'Solo necesitas tu número de documento. Sin crear cuenta, sin recordar contraseñas.',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    title: 'Notificaciones push',
    description: 'Recibe alertas cuando tu turno esté cerca. No más esperar sin saber.',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  },
  {
    title: 'Código QR',
    description: 'Tu turno se verifica con un código único. El operador lo escanea y listo.',
    icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
  },
  {
    title: 'Tiempo estimado',
    description: 'Calculamos cuánto falta para tu turno basándonos en el flujo real.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]
</script>

<template>
  <section class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

    <div class="max-w-7xl mx-auto relative">
      <div class="text-center mb-16 lg:mb-20">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Para ciudadanos
        </span>

        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
            <span class="font-logo">Tu turno,</span> sin esperar
        </h2>

        <p class="text-lg lg:text-xl text-[--text-secondary] max-w-2xl mx-auto">
          Sin filas físicas. Sin incertidumbre. TuTurno te permite gestionar tus turnos desde cualquier lugar.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="group relative p-6 lg:p-8 rounded-2xl bg-[--bg-surface] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div class="relative">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
              </svg>
            </div>

            <h3 class="text-lg font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
              {{ feature.title }}
            </h3>

            <p class="text-sm text-[--text-muted] leading-relaxed">
              {{ feature.description }}
            </p>
          </div>

          <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  </section>
</template>