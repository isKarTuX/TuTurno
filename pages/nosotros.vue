<script setup lang="ts">
useSeoMeta({
  title: 'Sobre Nosotros - TuTurno',
  description: 'Conoce la historia detrás de TuTurno. Un proyecto académico de la Universidad de Córdoba para eliminar las filas físicas.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

const { observeAll } = useScrollReveal({ threshold: 0.08 })

const team = [
  {
    name: 'Keyner Ramírez Ramos',
    role: 'Ingeniería de Sistemas',
    focus: 'Arquitectura Backend, APIs y Tiempo Real',
    university: 'Universidad de Córdoba',
    initials: 'KR',
    colorKey: 'violet',
  },
  {
    name: 'Bibiana Herrera Martínez',
    role: 'Ingeniería de Sistemas',
    focus: 'Experiencia de Usuario, Diseño UI y Frontend',
    university: 'Universidad de Córdoba',
    initials: 'BH',
    colorKey: 'emerald',
  },
]

const techStack = [
  { name: 'Nuxt 3', role: 'Framework Full-Stack' },
  { name: 'Vue 3', role: 'Composición Reactiva' },
  { name: 'Tailwind v4', role: 'Sistema de Diseño' },
  { name: 'Drizzle ORM', role: 'Capa de Datos' },
  { name: 'WebSockets', role: 'Tiempo Real' },
  { name: 'Supabase', role: 'Infraestructura Cloud' },
]

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    text: 'text-violet-400',
    icon: 'bg-violet-500/10 text-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    icon: 'bg-emerald-500/10 text-emerald-400',
  },
}

const problemPoints = [
  '48+ horas mensuales perdidas en filas presenciales',
  'Estrés y exposición a enfermedades en salas abarrotadas',
  'Pérdida de productividad laboral',
]

const solutionPoints = [
  'Turno solicitado desde cualquier teléfono',
  'Monitoreo en tiempo real de la posición en cola',
  'Notificaciones cuando es tu momento de ser atendido',
]

onMounted(() => {
  observeAll('.reveal-section')
  observeAll('.reveal-card')
})
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col">

    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32">

      <!-- HERO -->
      <section class="relative overflow-hidden pb-20 lg:pb-28">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[oklch(55%_0.18_285_/_0.05)] blur-[100px]" />
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] relative z-10">
          <div class="max-w-3xl mx-auto text-center reveal-section">

            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 tracking-wide uppercase mb-8">
              <Icon name="lucide:book-open" class="w-3.5 h-3.5 text-violet-400" />
              Nuestra Historia
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tight leading-[1.1]">
              Devolviéndole el tiempo a los colombianos
            </h1>

            <p class="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              TuTurno elimina las filas físicas en EPS, bancos y entidades públicas. Solicita tu turno desde cualquier dispositivo y sabe exactamente cuándo serás atendido.
            </p>

          </div>
        </div>
      </section>

      <!-- PROBLEMA Y VISIÓN -->
      <section class="py-16 lg:py-24 border-t border-white/[0.06]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

            <!-- El Problema -->
            <div class="reveal-card glass relative rounded-[2rem] border border-white/[0.08] overflow-hidden p-10 lg:p-12 group hover:border-white/[0.14] transition-all duration-500">
              <div class="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <svg viewBox="0 0 120 120" class="w-full h-full text-rose-500/30">
                  <path d="M120 0 Q120 120 0 120" fill="none" stroke="currentColor" stroke-width="1"/>
                </svg>
              </div>

              <div class="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8">
                <Icon name="lucide:alert-triangle" class="w-7 h-7 text-rose-400" />
              </div>

              <h2 class="text-2xl sm:text-3xl font-display font-medium text-white mb-8 tracking-tight">
                El problema
              </h2>

              <div class="space-y-4">
                <div v-for="point in problemPoints" :key="point" class="flex items-start gap-3">
                  <div class="w-1.5 h-1.5 rounded-full bg-rose-500/60 mt-2.5 shrink-0" />
                  <span class="text-zinc-400 text-base leading-relaxed">{{ point }}</span>
                </div>
              </div>
            </div>

            <!-- La Visión -->
            <div class="reveal-card glass relative rounded-[2rem] border border-white/[0.08] overflow-hidden p-10 lg:p-12 group hover:border-white/[0.14] transition-all duration-500">
              <div class="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <svg viewBox="0 0 120 120" class="w-full h-full text-emerald-500/30">
                  <path d="M120 0 Q120 120 0 120" fill="none" stroke="currentColor" stroke-width="1"/>
                </svg>
              </div>

              <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
                <Icon name="lucide:lightbulb" class="w-7 h-7 text-emerald-400" />
              </div>

              <h2 class="text-2xl sm:text-3xl font-display font-medium text-white mb-8 tracking-tight">
                La visión
              </h2>

              <div class="space-y-4">
                <div v-for="point in solutionPoints" :key="point" class="flex items-start gap-3">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/60 mt-2.5 shrink-0" />
                  <span class="text-zinc-400 text-base leading-relaxed">{{ point }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- EQUIPO -->
      <section class="py-16 lg:py-24 border-t border-white/[0.06]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">

          <div class="max-w-2xl mb-12 reveal-section">
            <h2 class="text-3xl sm:text-4xl font-display font-medium text-white mb-4 tracking-tight">
              El equipo
            </h2>
            <p class="text-lg text-zinc-400">
              Proyecto de grado — Universidad de Córdoba.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            <div
              v-for="member in team"
              :key="member.name"
              class="reveal-card glass relative overflow-hidden rounded-[2rem] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-500 p-8 lg:p-10 group"
            >
              <div class="flex items-center gap-5 mb-6">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center text-lg font-display font-semibold border-2 shrink-0"
                  :class="[colorMap[member.colorKey].bg, colorMap[member.colorKey].border, colorMap[member.colorKey].text]"
                >
                  {{ member.initials }}
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">{{ member.name }}</h3>
                  <p class="text-zinc-400 text-sm mt-1 flex items-center gap-1.5">
                    <Icon name="lucide:school" class="w-3.5 h-3.5" />
                    {{ member.university }}
                  </p>
                </div>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between py-3 border-b border-white/[0.06]">
                  <span class="text-zinc-500 flex items-center gap-2">
                    <Icon name="lucide:book-open" class="w-4 h-4 text-zinc-600" />
                    Rol
                  </span>
                  <span class="text-zinc-300">{{ member.role }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-white/[0.06]">
                  <span class="text-zinc-500 flex items-center gap-2">
                    <Icon name="lucide:target" class="w-4 h-4 text-zinc-600" />
                    Enfoque
                  </span>
                  <span class="text-zinc-300 text-right">{{ member.focus }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- INGENIERÍA -->
      <section class="py-16 lg:py-24 border-t border-white/[0.06]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">

          <div class="max-w-2xl mb-12 reveal-section">
            <h2 class="text-3xl sm:text-4xl font-display font-medium text-white mb-4 tracking-tight">
              Stack tecnológico
            </h2>
            <p class="text-lg text-zinc-400">
              Herramientas modernas para una experiencia fluida y tiempo real.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="reveal-card flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div class="w-11 h-11 rounded-xl bg-[oklch(55%_0.18_285_/_0.1)] border border-[oklch(55%_0.18_285_/_0.2)] flex items-center justify-center shrink-0">
                <Icon :name="tech.name === 'Nuxt 3' ? 'lucide:hexagon' : tech.name === 'Vue 3' ? 'lucide:component' : tech.name === 'Tailwind v4' ? 'lucide:wind' : tech.name === 'Drizzle ORM' ? 'lucide:database' : tech.name === 'WebSockets' ? 'lucide:radio' : 'lucide:cloud'" class="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h4 class="text-white font-medium text-sm">{{ tech.name }}</h4>
                <p class="text-zinc-500 text-xs">{{ tech.role }}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>

    <LandingCTA />
    <LandingFooter />

  </div>
</template>

<style scoped>
.container {
  contain: paint;
}
</style>
