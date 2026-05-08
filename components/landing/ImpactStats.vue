<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface StatItem {
  value: string
  label: string
  description: string
  source: string
  date: string
  icon: string
  color: string
  isProblem: boolean
}

const stats = ref<StatItem[]>([
  {
    value: '150+',
    label: 'días de espera',
    description: 'Tiempo promedio para atención médica en Colombia',
    source: 'El Tiempo',
    date: 'Junio 2024',
    icon: 'clock',
    color: 'red',
    isProblem: true,
  },
  {
    value: '12h',
    label: 'en fila',
    description: 'Para reclamar medicamentos en ciertas EPS de Bogotá',
    source: 'Infobae',
    date: 'Oct 2025',
    icon: 'alert',
    color: 'red',
    isProblem: true,
  },
  {
    value: '75%',
    label: 'sin atención',
    description: 'De colombianos que solicitan cita médica el mismo día no son atendidos',
    source: 'La República',
    date: '2024',
    icon: 'users',
    color: 'red',
    isProblem: true,
  },
  {
    value: '34K',
    label: 'afectados',
    description: 'Pacientes de Nueva EPS atrapados en filas interminables en Rionegro',
    source: 'La FM',
    date: 'Abril 2025',
    icon: 'alert',
    color: 'red',
    isProblem: true,
  },
])

const solutionStats = ref([
  {
    value: 'Digital',
    label: 'Sin filas físicas',
    description: 'Olvídate de madrugar o dormir en la calle',
    icon: 'check',
    color: 'green',
  },
  {
    value: 'Tiempo real',
    label: 'Notificaciones',
    description: 'Sabes exactamente cuándo te van a llamar',
    icon: 'bell',
    color: 'green',
  },
  {
    value: 'QR',
    label: 'Código único',
    description: 'Identificación segura para cada turno',
    icon: 'qr',
    color: 'green',
  },
  {
    value: 'Fácil',
    label: 'Solo tu cédula',
    description: 'Sin registro previo, sin claves',
    icon: 'id',
    color: 'green',
  },
])

const visibleItems = ref<Set<number>>(new Set())

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          setTimeout(() => {
            visibleItems.value.add(index)
          }, index * 100)
        }
      })
    },
    { threshold: 0.2 }
  )

  document.querySelectorAll('.stat-item').forEach((el) => {
    observer.observe(el)
  })
})

const iconPaths = {
  clock: 'M12 6v6l4 2m6-4a10 10 0 11-20 0 10 10 0 0120 0z',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  bell: 'M15 17h5l-1.405-1.405A2 2 0 0112 15.174V7.826a2 2 0 011.405-1.405L15 7.826V17z M5 7.826a2 2 0 004 0V7.826a2 2 0 00-4 0z',
  check: 'M5 13l4 4L19 7',
  qr: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  id: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2h-4a2 2 0 00-2-2v0a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2h-4a2 2 0 01-2-2v0z',
}
</script>

<template>
  <section class="py-24 px-4 bg-[--bg-base]">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal in-view">
        <span class="inline-block px-4 py-1.5 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-full border border-violet-500/20 mb-6">
          La realidad colombiana
        </span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
          El drama de las <span class="text-red-400">filas</span>
        </h2>
        <p class="text-lg text-[--text-secondary] max-w-3xl mx-auto">
          En Colombia, esperar puede costarte meses. Familias enteras madrugan, duermen en la calle,
          y aún así no garantiza atención. TuTurno existe para cambiar esta realidad.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          :data-index="index"
          class="stat-item glass rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
          :class="[
            visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="stat.color === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[stat.icon as keyof typeof iconPaths]" />
              </svg>
            </div>
            <span class="text-xs text-[--text-muted] uppercase tracking-wider">Problema</span>
          </div>

          <div class="text-4xl font-black text-white mb-2">{{ stat.value }}</div>
          <div class="text-lg font-semibold mb-2" :class="stat.color === 'red' ? 'text-red-400' : 'text-emerald-400'">
            {{ stat.label }}
          </div>
          <p class="text-sm text-[--text-secondary] mb-4">{{ stat.description }}</p>

          <div class="pt-3 border-t border-white/5">
            <span class="text-xs text-[--text-muted]">
              Fuente: {{ stat.source }}, {{ stat.date }}
            </span>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-emerald-600/20 rounded-3xl blur-3xl" />

        <div class="relative bg-[--bg-surface]/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10">
          <div class="text-center mb-12">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Con TuTurno
            </span>
            <h3 class="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              La solución ya existe
            </h3>
            <p class="text-[--text-secondary] max-w-2xl mx-auto">
              No inventamos lawheel. Optimizamos el proceso completo para que cada minuto de espera
              sea productivo y predecible.
            </p>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="(stat, index) in solutionStats"
              :key="`solution-${index}`"
              class="text-center"
              :class="[`reveal-delay-${index + 1}`, 'reveal in-view']"
            >
              <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[stat.icon as keyof typeof iconPaths]" />
                </svg>
              </div>
              <div class="text-3xl lg:text-4xl font-black text-white mb-1">{{ stat.value }}</div>
              <div class="text-sm font-semibold text-emerald-400 mb-2">{{ stat.label }}</div>
              <p class="text-xs text-[--text-secondary]">{{ stat.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <blockquote class="text-lg md:text-xl text-[--text-secondary] italic max-w-3xl mx-auto">
          "Se acaba el drama de las filas y las excusas"
          <footer class="mt-2 text-sm text-[--text-muted] not-italic">
            — David Luna, exMinistro de Salud de Colombia, 2024
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 100ms; }
.reveal-delay-2 { transition-delay: 200ms; }
.reveal-delay-3 { transition-delay: 300ms; }
.reveal-delay-4 { transition-delay: 400ms; }

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}
</style>
