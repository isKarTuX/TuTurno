<script setup lang="ts">
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

const colorMap: Record<string, { gradient: string; bg: string; border: string }> = {
  amber: { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  rose: { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  violet: { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
}

const sectors = [
  { name: 'EPS y clínicas', icon: 'health', description: 'Salud' },
  { name: 'Bancos', icon: 'bank', description: 'Finanzas' },
  { name: 'Registraduría', icon: 'document', description: 'Documentos' },
  { name: 'Notarías', icon: 'stamp', description: 'Legal' },
  { name: 'Gobernación / Alcaldía', icon: 'office', description: 'Público' },
]

const iconPaths: Record<string, string> = {
  health: 'M12 6v6h4m0 0a4 4 0 100-8 4 4 0 000 8zm0 0v6m-8-6h4m0 0a4 4 0 11-8 0 4 4 0 018 0z',
  bank: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  stamp: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  office: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
}
</script>

<template>
  <section class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent" />

    <div class="max-w-7xl mx-auto relative">
      <div class="text-center mb-16 lg:mb-20">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Testimonios
        </span>

<h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
            El drama de esperar
          </h2>

          <p class="text-lg lg:text-xl text-[--text-secondary] max-w-2xl mx-auto">
            Miles de colombianos pasan horas en filas todos los días. Así suena su realidad.
          </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.author"
          class="relative p-6 lg:p-8 rounded-2xl bg-[--bg-surface] border border-white/[0.06] hover:border-white/10 transition-all duration-300 hover:-translate-y-1 group"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div class="relative">
            <svg class="w-10 h-10 text-indigo-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p class="text-base lg:text-lg text-[--text-secondary] leading-relaxed mb-6">
              "{{ testimonial.quote }}"
            </p>

            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-white shadow-lg"
                :class="colorMap[testimonial.color].gradient"
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

      <div class="text-center">
        <p class="text-sm text-[--text-muted] mb-6">Sectores afectados por las filas interminables</p>
        <div class="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
          <div
            v-for="sector in sectors"
            :key="sector.name"
            class="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <svg class="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[sector.icon]" />
              </svg>
            </div>
            <div class="text-left">
              <span class="text-sm text-white font-medium">{{ sector.name }}</span>
              <p class="text-xs text-[--text-muted]">{{ sector.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>