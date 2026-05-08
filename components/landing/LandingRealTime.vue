<script setup lang="ts">
const features = [
  {
    title: 'Alertas cuando te llaman',
    description: 'Recibe una notificación push instantánea cuando tu turno sea llamado.',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    color: 'indigo',
  },
  {
    title: 'Recordatorio anticipado',
    description: 'Te alertamos cuando te faltan 3 turnos para ser atendido.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'amber',
  },
  {
    title: 'Confirmación al completar',
    description: 'Sabes cuándo fuiste atentido y puedes calificar el servicio.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'green',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  indigo: { bg: 'bg-indigo-500/10 border-indigo-500/20', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  amber: { bg: 'bg-amber-500/10 border-amber-500/20', border: 'border-amber-500/20', text: 'text-amber-400' },
  green: { bg: 'bg-green-500/10 border-green-500/20', border: 'border-green-500/20', text: 'text-green-400' },
}
</script>

<template>
  <section class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

    <div class="max-w-7xl mx-auto relative">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Tiempo real
          </span>

          <h2 class="text-4xl sm:text-5xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Siempre sabrás<br >
            <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              cuándo presentarte
            </span>
          </h2>

          <p class="text-lg text-[--text-secondary] mb-10 max-w-lg">
            No más estar pendiente del pantalla constantemente. TuTurno te mantiene informado en cada paso del proceso.
          </p>

          <div class="space-y-5">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="flex gap-5"
            >
              <div
                class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center"
                :class="colorMap[feature.color].bg"
              >
                <svg class="w-5 h-5" :class="colorMap[feature.color].text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                </svg>
              </div>
              <div class="pt-1">
                <h3 class="text-base font-semibold text-white mb-1">{{ feature.title }}</h3>
                <p class="text-sm text-[--text-muted]">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-indigo-500/20 rounded-3xl blur-2xl opacity-40" />

          <div class="relative bg-[--bg-elevated] rounded-2xl p-5 border border-white/10 shadow-2xl overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            <div class="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-white">Notificaciones push</p>
                <p class="text-xs text-[--text-muted]">TuTurno</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-amber-400 mb-0.5">Te quedan 3 turnos</p>
                  <p class="text-xs text-[--text-muted]">Tu turno A-005 está próximo. Prepárate.</p>
                  <p class="text-xs text-amber-400/60 mt-1">Ahora</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white mb-0.5">Turno completado</p>
                  <p class="text-xs text-[--text-muted]">A-002 fue atentido exitosamente</p>
                  <p class="text-xs text-[--text-muted] mt-1">Hace 5 min</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4V2m0 2a2 2 0 012 2v2m0-2a2 2 0 00-2 2v2m6 0h6M17 8h4l3 4v4h-7V8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white mb-0.5">Turno llamado</p>
                  <p class="text-xs text-[--text-muted]">A-004 - Preséntese al puesto 3</p>
                  <p class="text-xs text-[--text-muted] mt-1">Hace 8 min</p>
                </div>
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span class="text-xs text-green-400">Notificaciones activas</span>
              </div>
              <span class="text-xs text-[--text-muted]">Hace 5s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>