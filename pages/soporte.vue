<script setup lang="ts">
useSeoMeta({
  title: 'Soporte - TuTurno',
  description: 'Obtén ayuda con TuTurno. Guías, tutoriales y soporte técnico para ciudadanos, entidades y operadores.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const guides = [
  {
    category: 'Guía Rápida',
    icon: 'lucide:rocket',
    color: 'violet',
    items: [
      {
        title: 'Primeros pasos con TuTurno',
        desc: 'Aprende a registrarte, buscar entidades y solicitar tu primer turno en menos de 5 minutos.',
        duration: '3 min',
        level: 'Principiante',
      },
      {
        title: 'Rastrear tu turno en tiempo real',
        desc: 'Cómo funciona el tracker de posición y las notificaciones push cuando tu turno está cerca.',
        duration: '2 min',
        level: 'Principiante',
      },
      {
        title: 'Cancelar o reprogramar un turno',
        desc: 'Pasos para cancelar un turno antes de que sea llamado y solicitar uno nuevo.',
        duration: '1 min',
        level: 'Principiante',
      },
    ],
  },
  {
    category: 'Para Entidades',
    icon: 'lucide:building-2',
    color: 'blue',
    items: [
      {
        title: 'Configurar tu entidad en TuTurno',
        desc: 'Registro completo: datos básicos, horarios, servicios, operadores y pantallas de display.',
        duration: '10 min',
        level: 'Intermedio',
      },
      {
        title: 'Gestionar operadores y permisos',
        desc: 'Cómo añadir operadores, asignarlos a servicios y configurar sus permisos.',
        duration: '5 min',
        level: 'Intermedio',
      },
      {
        title: 'Usar el dashboard de métricas',
        desc: 'Interpretación de gráficos de atención, tiempo promedio, no-shows y satisfacción.',
        duration: '7 min',
        level: 'Avanzado',
      },
    ],
  },
  {
    category: 'Para Operadores',
    icon: 'lucide:headphones',
    color: 'emerald',
    items: [
      {
        title: 'Panel de operador: guía completa',
        desc: 'Cómo llamar turnos, marcar atención, no-shows y pausar la cola.',
        duration: '5 min',
        level: 'Principiante',
      },
      {
        title: 'Flujo de atención recomendado',
        desc: 'Mejores prácticas para maximizar la eficiencia y reducir tiempos de espera.',
        duration: '8 min',
        level: 'Avanzado',
      },
      {
        title: 'Notificaciones y alertas',
        desc: 'Configurar alertas sonores y visuales para cuando un ciudadano no se presente.',
        duration: '3 min',
        level: 'Intermedio',
      },
    ],
  },
  {
    category: 'Integración API',
    icon: 'lucide:code-2',
    color: 'amber',
    items: [
      {
        title: 'Introducción a la API REST',
        desc: 'Autenticación, endpoints disponibles y formato de respuestas.',
        duration: '6 min',
        level: 'Avanzado',
      },
      {
        title: 'Webhooks para tiempo real',
        desc: 'Cómo recibir notificaciones instantáneas cuando un turno cambia de estado.',
        duration: '8 min',
        level: 'Avanzado',
      },
      {
        title: 'Ejemplos de integración',
        desc: 'Snippets de código en JavaScript, Python y cURL para los endpoints principales.',
        duration: '10 min',
        level: 'Avanzado',
      },
    ],
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-400', icon: 'lucide:rocket' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/25', text: 'text-blue-400', icon: 'lucide:building-2' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400', icon: 'lucide:headphones' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400', icon: 'lucide:code-2' },
}

const levelBadge: Record<string, string> = {
  Principiante: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermedio: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Avanzado: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">

        <!-- Hero -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-8">
            <Icon name="lucide:lifebuoy" class="w-3.5 h-3.5 text-violet-400" />
            Centro de Soporte
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tighter">
            ¿En qué podemos ayudarte?
          </h1>
          <p class="text-lg text-zinc-400 max-w-xl mx-auto">
            Guías paso a paso, tutoriales en video y soporte técnico para que aproveches TuTurno al máximo.
          </p>
        </div>

        <!-- Quick actions -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          <NuxtLink
            to="/faq"
            class="card-interactive flex items-center gap-4 p-5 rounded-2xl group"
          >
            <div class="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
              <Icon name="lucide:help-circle" class="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 class="font-medium text-white group-hover:text-violet-300 transition-colors">Preguntas Frecuentes</h3>
              <p class="text-sm text-zinc-500 mt-0.5">Respuestas rápidas</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/contacto"
            class="card-interactive flex items-center gap-4 p-5 rounded-2xl group"
          >
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <Icon name="lucide:message-circle" class="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 class="font-medium text-white group-hover:text-blue-300 transition-colors">Chat en vivo</h3>
              <p class="text-sm text-zinc-500 mt-0.5">Habla con soporte</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/docs"
            class="card-interactive flex items-center gap-4 p-5 rounded-2xl group"
          >
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
              <Icon name="lucide:book-open" class="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 class="font-medium text-white group-hover:text-emerald-300 transition-colors">Documentación API</h3>
              <p class="text-sm text-zinc-500 mt-0.5">Para desarrolladores</p>
            </div>
          </NuxtLink>
        </div>

        <!-- Guides by category -->
        <div class="space-y-16">
          <div v-for="section in guides" :key="section.category">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="colorMap[section.color].bg"
              >
                <Icon :name="section.icon" class="w-5 h-5" :class="colorMap[section.color].text" />
              </div>
              <h2 class="text-2xl font-display font-medium text-white">{{ section.category }}</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="guide in section.items"
                :key="guide.title"
                class="group cursor-pointer"
              >
                <div class="h-full glass rounded-2xl border border-white/[0.08] p-6 hover:border-white/[0.14] transition-all duration-300 flex flex-col">
                  <div class="flex items-center gap-2 mb-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border"
                      :class="levelBadge[guide.level]"
                    >
                      <Icon name="lucide:signal" class="w-3 h-3" />
                      {{ guide.level }}
                    </span>
                    <span class="text-xs text-zinc-500 flex items-center gap-1">
                      <Icon name="lucide:clock" class="w-3 h-3" />
                      {{ guide.duration }}
                    </span>
                  </div>
                  <h3 class="font-semibold text-white mb-2 group-hover:text-[--color-primary-light] transition-colors">
                    {{ guide.title }}
                  </h3>
                  <p class="text-sm text-zinc-400 flex-1">{{ guide.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report bug -->
        <div class="mt-20 glass rounded-2xl border border-white/[0.08] p-10 text-center">
          <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
            <Icon name="lucide:bug" class="w-8 h-8 text-rose-400" />
          </div>
          <h3 class="text-2xl font-semibold text-white mb-3">Reportar un problema técnico</h3>
          <p class="text-zinc-400 mb-8 max-w-md mx-auto">
            ¿Encontraste un bug? Ayúdanos a mejorar reportándolo con detalle para que nuestro equipo pueda resolverlo.
          </p>
          <a
            href="mailto:soporte@tuturno.co?subject=Reporte%20de%20bug%20TuTurno"
            class="btn btn-outline px-8 py-3"
          >
            <Icon name="lucide:send" class="w-4 h-4" />
            Reportar bug
          </a>
        </div>

      </div>
    </main>

    <LandingFooter />
  </div>
</template>