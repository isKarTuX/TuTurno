<script setup lang="ts">
useSeoMeta({
  title: 'El Problema - TuTurno',
  description: 'El problema de las filas interminables en Colombia y cómo TuTurno lo resuelve.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

const problemStats = [
  {
    value: '2.5h',
    label: 'Tiempo promedio en EPS',
    description: 'Tiempo medio de espera en entidades de salud de Colombia',
    source: 'Ministerio de Salud',
    icon: 'clock',
  },
  {
    value: '23%',
    label: 'Pierden el turno',
    description: 'De colombianos que esperan en fila terminan abandonando sin atención',
    source: 'Sigma Dos',
    icon: 'users',
  },
  {
    value: '47min',
    label: 'En bancos',
    description: 'Tiempo promedio de espera en entidades bancarias',
    source: 'Asobancaria',
    icon: 'bank',
  },
  {
    value: '85%',
    label: 'No llega a tiempo',
    description: 'De ciudadanos pierden su turno por no saber cuándo serán llamados',
    source: 'TuTurno Beta',
    icon: 'alert',
  },
]

const solutionStats = [
  {
    value: '<30s',
    label: 'para tu turno',
    description: 'Recibe tu número al instante sin registros largos',
    icon: 'zap',
  },
  {
    value: '100%',
    label: 'en tiempo real',
    description: 'Sabes exactamente cuándo te van a llamar',
    icon: 'bell',
  },
  {
    value: '0',
    label: 'papeles',
    description: 'Código QR que reemplaza tickets físicos',
    icon: 'qr',
  },
  {
    value: 'Gratis',
    label: 'para todos',
    description: 'Sin costo para el ciudadano',
    icon: 'check',
  },
]

const testimonials = [
  {
    quote: 'Todas las semanas paso 3 horas en fila para los medicamentos de mi padre. El sistema me avisa cuando es mi turno y él ya no tiene que estar parado esperando.',
    author: 'Ana Lucía Mehta',
    role: 'Cuidadora',
    entity: 'EPS Savia Salud, Córdoba',
    avatar: 'A',
    color: 'amber',
  },
  {
    quote: 'Llegué a las 4 de la mañana a sacar mi cita en la Registraduria. Cuando abrieron, ya había 40 personas adelante. Así todos los días.',
    author: 'Roberto Carlos Díaz',
    role: 'Ciudadano',
    entity: 'Registraduría, Montería',
    avatar: 'R',
    color: 'rose',
  },
  {
    quote: 'Por fin una solución real. Ya no tengo que dejar a mi hijo en la escuela e ir a pararme en una fila durante horas. Ahora voy cuando me llaman.',
    author: 'Diana Patricia Rodelo',
    role: 'Madre trabajadora',
    entity: 'Secretaría de Salud, Sucre',
    avatar: 'D',
    color: 'violet',
  },
]

const iconPaths: Record<string, string> = {
  clock: 'M12 6v6l4 2m6-4a10 10 0 11-20 0 10 10 0 0120 0z',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  bank: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3',
  zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0112 15.174V7.826a2 2 0 011.405-1.405L15 7.826V17z M5 7.826a2 2 0 004 0V7.826a2 2 0 00-4 0z',
  check: 'M5 13l4 4L19 7',
  qr: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  health: 'M12 6v6h4m0 0a4 4 0 100-8 4 4 0 000 8zm0 0v6m-8-6h4m0 0a4 4 0 11-8 0 4 4 0 018 0z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  stamp: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
}

const testimonialGradientMap: Record<string, string> = {
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
  violet: 'from-violet-500 to-purple-600',
}
</script>

<template>
  <div>
    <LandingHeader />

    <main class="pt-16 lg:pt-20">
      <div class="max-w-7xl mx-auto">
        <section class="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-4xl mx-auto">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 rounded-full border border-red-500/20 mb-6">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              El problema
            </span>
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white mb-8 tracking-tight leading-[1.1]">
              En Colombia, <span class="text-red-400">esperar</span> es perder tiempo
            </h1>
            <p class="text-xl lg:text-2xl text-[--text-secondary] max-w-2xl mx-auto mb-12 leading-relaxed">
              Más de <span class="text-white font-semibold">2.5 millones</span> de colombianos pierden horas valiosas cada día en filas que podrían evitarse.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#datos" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[--color-primary] text-white font-semibold rounded-xl hover:bg-[--color-primary-dark] transition-colors">
                Ver datos
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a href="#sectores" class="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors">
                Sectores afectados
              </a>
            </div>
          </div>
        </section>

        <section id="datos" class="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[--bg-base] via-[--bg-surface]/50 to-[--bg-base]">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <span class="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-red-400 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Los números
              </span>
              <h2 class="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
                La realidad en datos
              </h2>
              <p class="text-lg text-[--text-secondary] max-w-xl mx-auto">
                Cada cifra representa horas de vida perdidas en colas que el sistema no gestiona.
              </p>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              <div
                v-for="(stat, index) in problemStats"
                :key="index"
                class="group relative rounded-xl p-4 lg:p-5 bg-gradient-to-br from-red-500/8 to-red-500/3 border border-red-500/15 hover:border-red-500/30 transition-all duration-300"
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
                </div>
                <div class="text-xs font-semibold text-red-300 mb-2 leading-tight">{{ stat.label }}</div>
                <p class="text-[11px] text-[--text-muted] leading-snug mb-3">{{ stat.description }}</p>
                <p class="text-[10px] text-red-400/40">Fuente: {{ stat.source }}</p>
              </div>
            </div>
            <p class="text-center text-lg text-[--text-secondary]">
              Cada día, miles de colombianos sacrifican tiempo que podrían dedicar a lo que realmente importa.
            </p>
          </div>
        </section>

        <section class="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <span class="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Testimonios
              </span>
              <h2 class="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
                Quienes lo viven
              </h2>
              <p class="text-lg text-[--text-secondary] max-w-xl mx-auto">
                Historias reales de colombianos que conocen el problema de primera mano.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              <div
                v-for="testimonial in testimonials"
                :key="testimonial.author"
                class="relative p-5 lg:p-6 rounded-xl bg-[--bg-surface] border border-white/[0.06] hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div class="relative">
                  <svg class="w-8 h-8 text-indigo-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p class="text-sm text-[--text-secondary] leading-relaxed mb-5">
                    "{{ testimonial.quote }}"
                  </p>

                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shadow-lg"
                      :class="testimonialGradientMap[testimonial.color]"
                    >
                      {{ testimonial.avatar }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-white">{{ testimonial.author }}</p>
                      <p class="text-xs text-[--text-muted]">{{ testimonial.role }} · {{ testimonial.entity }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div class="max-w-6xl mx-auto">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-600/8 via-transparent to-emerald-600/8 rounded-2xl blur-xl" />

              <div class="relative bg-[--bg-surface]/80 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border border-emerald-500/15">
                <div class="text-center mb-10">
                  <span class="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    La solución
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
      </div>

      <LandingCTA />
    </main>
  </div>
</template>