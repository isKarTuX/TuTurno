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

const colorMap: Record<string, { gradient: string }> = {
  amber: { gradient: 'from-amber-500 to-orange-600' },
  rose: { gradient: 'from-rose-500 to-pink-600' },
  violet: { gradient: 'from-violet-500 to-purple-600' },
}

const sectors = [
  {
    name: 'EPS y clínicas',
    icon: 'health',
    description: 'Salud',
    color: 'rose',
    stat: '150 min',
  },
  {
    name: 'Bancos',
    icon: 'bank',
    description: 'Finanzas',
    color: 'blue',
    stat: '47 min',
  },
  {
    name: 'Registraduría',
    icon: 'document',
    description: 'Documentos',
    color: 'amber',
    stat: '4 AM',
  },
  {
    name: 'Notarías',
    icon: 'stamp',
    description: 'Legal',
    color: 'violet',
    stat: 'horas',
  },
  {
    name: 'Gobernación',
    icon: 'office',
    description: 'Público',
    color: 'emerald',
    stat: '100%',
  },
]

const iconPaths: Record<string, string> = {
  health: 'M12 6v6h4m0 0a4 4 0 100-8 4 4 0 000 8zm0 0v6m-8-6h4m0 0a4 4 0 11-8 0 4 4 0 018 0z',
  bank: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  stamp: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  office: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
}

const sectorColorMap: Record<string, { bg: string; border: string; icon: string; stat: string }> = {
  rose: { bg: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-500/20', icon: 'text-rose-400', stat: 'text-rose-300' },
  blue: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', icon: 'text-blue-400', stat: 'text-blue-300' },
  amber: { bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', icon: 'text-amber-400', stat: 'text-amber-300' },
  violet: { bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/20', icon: 'text-violet-400', stat: 'text-violet-300' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', stat: 'text-emerald-300' },
}
</script>

<template>
  <section class="py-20 lg:py-28 px-4 relative">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent" />

    <div class="max-w-6xl mx-auto relative">
      <div class="text-center mb-10">
        <span class="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-red-400 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          La cruda realidad
        </span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white mb-4 tracking-tight">
          Sectores afectados por las <span class="text-red-400">filas</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-16">
        <div
          v-for="sector in sectors"
          :key="sector.name"
          class="group relative p-4 rounded-xl bg-gradient-to-br border transition-all duration-300 hover:-translate-y-0.5 cursor-default"
          :class="[sectorColorMap[sector.color].bg, sectorColorMap[sector.color].border]"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="[sectorColorMap[sector.color].bg.replace('from-', 'bg-').replace(' to-', '/'), sectorColorMap[sector.color].icon.replace('text-', 'text-')]">
              <svg class="w-5 h-5" :class="sectorColorMap[sector.color].icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[sector.icon]" />
              </svg>
            </div>
            <div class="text-xl font-black" :class="sectorColorMap[sector.color].stat">{{ sector.stat }}</div>
          </div>
          <h3 class="text-sm font-bold text-white mb-0.5">{{ sector.name }}</h3>
          <p class="text-xs" :class="sectorColorMap[sector.color].icon">{{ sector.description }}</p>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-center text-lg font-semibold text-[--text-secondary] mb-6">Lo que dicen los ciudadanos</h3>
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
    </div>
  </section>
</template>
