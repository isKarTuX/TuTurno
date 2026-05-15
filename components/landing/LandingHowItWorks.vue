<script setup lang="ts">
const { observeAll } = useScrollReveal({ threshold: 0.15 })

const steps = [
  {
    number: '01',
    title: 'Encuentra tu lugar',
    description: 'Busca por nombre o ubicación. Encontramos más de 500 entidades en toda Colombia.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    color: 'indigo',
  },
  {
    number: '02',
    title: 'Recibe tu número',
    description: 'Elige el trámite que necesitas. En menos de 30 segundos tienes tu turno.',
    icon: 'M7 4V2m0 2a2 2 0 012 2v2m0-2a2 2 0 00-2 2v2m6 0h6M17 8h4l3 4v4h-7V8z',
    color: 'violet',
  },
  {
    number: '03',
    title: 'Mira cuánto falta',
    description: 'Recibe alertas cuando queden 3 turnos antes del tuyo. No pierdas tiempo en la espera.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'purple',
  },
  {
    number: '04',
    title: 'Llega y muestra tu QR',
    description: 'Llega tranquilo. El operador recibe tu llamado y te atiende en minutos.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'indigo',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; gradient: string; glow: string }> = {
  indigo: {
    bg: 'from-indigo-500/15 to-indigo-600/5',
    border: 'indigo-500/30',
    text: 'indigo-400',
    gradient: 'from-indigo-500 to-indigo-600',
    glow: 'shadow-indigo-500/20',
  },
  violet: {
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'violet-500/30',
    text: 'violet-400',
    gradient: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/20',
  },
  purple: {
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'purple-500/30',
    text: 'purple-400',
    gradient: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/20',
  },
}

onMounted(() => {
  observeAll('.step-card')
})
</script>

<template>
  <section id="como-funciona" class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

<div class="max-w-7xl mx-auto relative">
      <div class="text-center mb-16 lg:mb-24">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Proceso simple
        </span>

        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
          Cuatro pasos para <span class="font-logo">tu turno</span>
        </h2>

        <p class="text-lg lg:text-xl text-[--text-secondary] max-w-2xl mx-auto">
          Sin filas, sin esperar. Tu tiempo es valioso.
        </p>
      </div>

      <div class="relative">
        <div class="hidden lg:block absolute left-0 right-0 top-[108px] h-0.5 bg-gradient-to-r from-indigo-500/60 via-indigo-500/40 to-indigo-500/60" />

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            <div
              v-for="(step, index) in steps"
              :key="step.number"
              class="relative group step-card reveal"
            >
              <div class="hidden lg:flex flex-col items-center">
                <div
                  class="w-24 h-24 rounded-3xl bg-gradient-to-br p-px mb-6 relative group-hover:scale-105 transition-transform duration-300 z-10"
                  :class="[colorMap[step.color].bg, `from-${step.color}-500/30 to-${step.color}-500/10`]"
                >
                  <div class="w-full h-full rounded-3xl bg-[--bg-surface] flex items-center justify-center relative">
                    <svg class="w-9 h-9" :class="`text-${step.color}-400`" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="step.icon" />
                    </svg>
                    <div
                      class="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center text-sm font-black text-white shadow-lg"
                      :class="[colorMap[step.color].gradient, colorMap[step.color].glow]"
                    >
                      {{ index + 1 }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="lg:hidden flex items-center gap-4 mb-6">
                <div
                  class="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-lg font-black text-white shadow-lg flex-shrink-0"
                  :class="[colorMap[step.color].gradient, colorMap[step.color].glow]"
                >
                  {{ index + 1 }}
                </div>
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-0.5 bg-gradient-to-r from-indigo-500/40 to-transparent"
                />
              </div>

              <h3 class="text-xl lg:text-2xl font-semibold text-white mb-3 tracking-tight lg:text-center group-hover:text-indigo-300 transition-colors">
                {{ step.title }}
              </h3>
              <p class="text-sm lg:text-base text-[--text-muted] leading-relaxed lg:text-center">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
    </div>
  </section>
</template>