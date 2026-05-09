<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface StatItem {
  value: string
  numericValue: number
  suffix: string
  label: string
  description: string
  source: string
  icon: string
  color: string
}

const problemStats = ref<StatItem[]>([
  {
    value: '2.5h',
    numericValue: 150,
    suffix: 'min',
    label: 'Tiempo promedio en EPS',
    description: 'Tiempo medio de espera en entidades de salud de Colombia',
    source: 'Ministerio de Salud',
    icon: 'clock',
    color: 'red',
  },
  {
    value: '23%',
    numericValue: 23,
    suffix: '',
    label: 'Pierden el turno',
    description: 'De colombianos que esperan en fila terminan abandonando sin atención',
    source: 'Sigma Dos',
    icon: 'users',
    color: 'red',
  },
  {
    value: '47',
    numericValue: 47,
    suffix: 'min',
    label: 'En bancos',
    description: 'Tiempo promedio de espera en entidades bancarias',
    source: 'Asobancaria',
    icon: 'bank',
    color: 'red',
  },
  {
    value: '85%',
    numericValue: 85,
    suffix: '',
    label: 'No llega a tiempo',
    description: 'De ciudadanos pierden su turno por no saber cuándo serán llamados',
    source: 'TuTurno Beta',
    icon: 'alert',
    color: 'red',
  },
])

const solutionStats = ref([
  {
    value: '<30s',
    label: 'para tu turno',
    description: 'Recibe tu número al instante sin registros largos',
    icon: 'zap',
    color: 'green',
  },
  {
    value: '100%',
    label: 'en tiempo real',
    description: 'Sabes exactamente cuándo te van a llamar',
    icon: 'bell',
    color: 'green',
  },
  {
    value: '0',
    label: 'papeles',
    description: 'Código QR que reemplaza tickets físicos',
    icon: 'qr',
    color: 'green',
  },
  {
    value: 'Gratis',
    label: 'para todos',
    description: 'Sin costo para el ciudadano',
    icon: 'check',
    color: 'green',
  },
])

const visibleItems = ref<Set<number>>(new Set())
const showSolution = ref(false)
const solutionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          setTimeout(() => {
            visibleItems.value.add(index)
          }, index * 150)
        }
      })
    },
    { threshold: 0.2 }
  )

  document.querySelectorAll('.stat-item').forEach((el) => {
    observer.observe(el)
  })

  const solutionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        showSolution.value = true
      }
    },
    { threshold: 0.3 }
  )

  if (solutionRef.value) {
    solutionObserver.observe(solutionRef.value)
  }
})

const iconPaths = {
  clock: 'M12 6v6l4 2m6-4a10 10 0 11-20 0 10 10 0 0120 0z',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  bank: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3',
  zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0112 15.174V7.826a2 2 0 011.405-1.405L15 7.826V17z M5 7.826a2 2 0 004 0V7.826a2 2 0 00-4 0z',
  check: 'M5 13l4 4L19 7',
  qr: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
}
</script>

<template>
  <section class="py-16 lg:py-20 px-4 relative">
    <div class="absolute inset-0 bg-gradient-to-b from-[--bg-base] via-[--bg-surface]/30 to-[--bg-base]" />

    <div class="max-w-6xl mx-auto relative">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-12">
        <div
          v-for="(stat, index) in problemStats"
          :key="index"
          :data-index="index"
          class="stat-item group relative rounded-xl p-4 lg:p-5 bg-gradient-to-br from-red-500/8 to-red-500/3 border border-red-500/15 hover:border-red-500/30 transition-all duration-300"
          :class="[
            visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ]"
        >
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[stat.icon as keyof typeof iconPaths]" />
              </svg>
            </div>
            <span class="text-[10px] text-red-400/50 uppercase tracking-wider">Dato</span>
          </div>

          <div class="flex items-baseline gap-1 mb-1">
            <div class="text-2xl lg:text-3xl font-black text-white">{{ stat.value }}</div>
            <div v-if="stat.suffix" class="text-sm text-red-400 font-medium">{{ stat.suffix }}</div>
          </div>
          <div class="text-xs font-semibold text-red-300 mb-2 leading-tight">{{ stat.label }}</div>
          <p class="text-[11px] text-[--text-muted] leading-snug">{{ stat.description }}</p>
        </div>
      </div>

      <div ref="solutionRef" class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-600/8 via-transparent to-emerald-600/8 rounded-2xl blur-xl" />

        <div class="relative bg-[--bg-surface]/80 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border border-emerald-500/15">
          <div class="text-center mb-10">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Con TuTurno
            </span>
            <h3 class="text-3xl lg:text-4xl font-display font-black text-white mb-3 tracking-tight">
              La solución ya existe
            </h3>
            <p class="text-base text-[--text-secondary] max-w-xl mx-auto">
              No inventamos la rueda. Optimizamos el proceso para que cada minuto de espera sea productivo.
            </p>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            <div
              v-for="(stat, index) in solutionStats"
              :key="`solution-${index}`"
              class="relative text-center p-5 rounded-xl bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/10 hover:border-emerald-500/25 transition-all duration-300"
              :class="[
                `reveal-delay-${index + 1}`,
                showSolution ? 'reveal in-view' : 'opacity-0 translate-y-2',
              ]"
            >
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[stat.icon as keyof typeof iconPaths]" />
                </svg>
              </div>
              <div class="text-3xl lg:text-4xl font-black text-white mb-2">{{ stat.value }}</div>
              <div class="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wide">{{ stat.label }}</div>
              <p class="text-xs text-[--text-muted] leading-snug">{{ stat.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 100ms; }
.reveal-delay-2 { transition-delay: 200ms; }
.reveal-delay-3 { transition-delay: 300ms; }
.reveal-delay-4 { transition-delay: 400ms; }

.stat-item {
  transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .reveal, .stat-item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
