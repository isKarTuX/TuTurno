<script setup lang="ts">
useSeoMeta({
  title: 'Nosotros - TuTurno',
  description: 'Sobre TuTurno. Proyecto académico de la Universidad de Córdoba.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

const { observeAll } = useScrollReveal({ threshold: 0.15 })

const team = [
  {
    name: 'Keyner Ramírez Ramos',
    role: 'Estudiante de Ingeniería de Sistemas',
    university: 'Universidad de Córdoba',
    avatar: 'K',
    color: 'violet',
  },
  {
    name: 'Bibiana Herrera Martínez',
    role: 'Estudiante de Ingeniería de Sistemas',
    university: 'Universidad de Córdoba',
    avatar: 'B',
    color: 'emerald',
  },
]

const technologies = [
  { name: 'Nuxt 3', description: 'Framework Vue.js full-stack' },
  { name: 'TypeScript', description: 'Lenguaje tipado' },
  { name: 'Tailwind CSS', description: 'Framework CSS' },
  { name: 'Drizzle ORM', description: 'ORM para base de datos' },
  { name: 'Supabase', description: 'Backend as a Service' },
  { name: 'WebSockets', description: 'Tiempo real' },
]

const colorMap = {
  violet: { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/20', border: 'border-violet-500/30' },
  emerald: { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
}

onMounted(() => {
  observeAll('.reveal-section')
})
</script>

<template>
  <div>
    <LandingHeader />

    <main class="pt-16 lg:pt-20">
      <div class="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Conócenos
            </span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
              Sobre TuTurno
            </h1>
            <p class="text-lg lg:text-xl text-[--text-secondary] max-w-3xl mx-auto">
              Un proyecto académico de la Universidad de Córdoba, Colombia.
            </p>
          </div>

          <section class="mb-20 reveal-section">
            <div class="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[--bg-surface] to-purple-500/10 border border-white/10 overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
              <div class="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

              <div class="relative">
                <div class="flex items-center gap-4 mb-8">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-white">Proyecto Académico</h2>
                    <p class="text-[--text-muted]">Universidad de Córdoba</p>
                  </div>
                </div>

                <div class="space-y-6 text-[--text-secondary]">
                  <p class="text-lg leading-relaxed">
                    TuTurno es un proyecto desarrollado como trabajo de grado por estudiantes del
                    programa de Ingeniería de Sistemas y Telecomunicaciones de la Universidad de Córdoba, Colombia.
                  </p>
                  <p class="leading-relaxed">
                    El proyecto busca resolver un problema cotidiano en Colombia: las largas filas en EPS,
                    bancos y oficinas públicas. Mediante una plataforma digital de gestión de turnos,
                    buscamos mejorar la experiencia de los ciudadanos y la eficiencia de las entidades.
                  </p>
                  <p class="leading-relaxed">
                    Utilizamos tecnologías modernas como Nuxt 3, TypeScript, Tailwind CSS, Drizzle ORM
                    y Supabase para crear una solución robusta, escalable y con soporte en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section class="mb-20">
            <h2 class="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">Equipo</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="member in team"
                :key="member.name"
                class="reveal-section p-6 rounded-2xl bg-[--bg-surface] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 group"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl font-bold text-white shadow-lg"
                    :class="colorMap[member.color as keyof typeof colorMap].gradient"
                  >
                    {{ member.avatar }}
                  </div>
                  <div>
                    <p class="font-semibold text-white group-hover:text-indigo-300 transition-colors">{{ member.name }}</p>
                    <p class="text-sm text-[--text-muted]">{{ member.role }}</p>
                    <p class="text-xs text-[--text-muted]">{{ member.university }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">Tecnologías</h2>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div
                v-for="tech in technologies"
                :key="tech.name"
                class="reveal-section p-4 rounded-xl bg-[--bg-surface] border border-white/[0.06] hover:border-indigo-500/30 transition-colors text-center group"
              >
                <p class="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">{{ tech.name }}</p>
                <p class="text-xs text-[--text-muted]">{{ tech.description }}</p>
              </div>
            </div>
          </section>

          <section class="mt-16 pt-12 border-t border-white/5">
            <div class="text-center">
              <h3 class="text-xl font-bold text-white mb-4">¿Tienes preguntas?</h3>
              <p class="text-[--text-secondary] mb-6">
                Contáctanos para más información sobre el proyecto.
              </p>
              <a
                href="mailto:contacto@tuturno.co"
                class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@tuturno.co
              </a>
            </div>
          </section>
        </div>
      </div>

      <LandingCTA />
    </main>
  </div>
</template>
