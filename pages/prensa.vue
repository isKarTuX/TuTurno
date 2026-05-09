<script setup lang="ts">
useSeoMeta({
  title: 'Prensa - TuTurno',
  description: 'Sala de prensa de TuTurno. Comunicados, recursos para medios, logos y contacto de prensa.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const pressReleases = [
  {
    date: '20 de marzo, 2025',
    title: 'TuTurno levanta ronda seed de USD $500K',
    excerpt: 'La startup colombiana de gestión de turnos digitales cierra su primera ronda de inversión liderada por angel investors de Medellín.',
    tag: 'Comunicado',
  },
  {
    date: '5 de febrero, 2025',
    title: 'Alianza con la Cámara de Comercio de Montería',
    excerpt: 'Más de 40 establecimientos comerciales de la ciudad adoptarán el sistema de turnos digitales.',
    tag: 'Alianza',
  },
  {
    date: '15 de enero, 2025',
    title: 'Lanzamiento público de TuTurno en Córdoba',
    excerpt: 'Tras 6 meses de piloto en EPS Sura, la plataforma se abre a todas las entidades de la región.',
    tag: 'Anuncio',
  },
]

const mediaAssets = [
  {
    name: 'Logo principal',
    format: 'PNG / SVG',
    size: '4 colores / monocromo',
  },
  {
    name: 'Fotos del equipo',
    format: 'ZIP',
    size: '12 fotos en alta resolución',
  },
  {
    name: 'Pack de medios',
    format: 'ZIP',
    size: 'Logos + fotos + iconos',
  },
]

const stats = [
  { value: '50.000+', label: 'Turnos gestionados' },
  { value: '12', label: 'Entidades activas' },
  { value: '73%', label: 'Reducción de tiempo de espera' },
  { value: '4.8/5', label: 'Satisfacción ciudadana' },
]

const pressContact = {
  name: 'Oficina de Comunicaciones',
  email: 'prensa@tuturno.co',
  phone: '+57 300 123 4567',
}
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">

        <!-- Hero -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-8">
            <Icon name="lucide:newspaper" class="w-3.5 h-3.5 text-violet-400" />
            Sala de Prensa
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tighter">
            Prensa y Medios
          </h1>
          <p class="text-lg text-zinc-400 max-w-xl mx-auto">
            Recursos, datos y contacto para periodistas y medios que cubren la historia de TuTurno.
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="glass rounded-2xl border border-white/[0.08] p-6 text-center"
          >
            <p class="text-3xl lg:text-4xl font-display font-bold text-white mb-1">{{ stat.value }}</p>
            <p class="text-sm text-zinc-400">{{ stat.label }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">

          <!-- Press releases -->
          <div class="lg:col-span-3">
            <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-violet-400" />
              Comunicados de prensa
            </h2>
            <div class="space-y-4">
              <div
                v-for="pr in pressReleases"
                :key="pr.title"
                class="glass rounded-2xl border border-white/[0.08] p-6 hover:border-white/[0.12] transition-colors"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Icon name="lucide:file-text" class="w-6 h-6 text-violet-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-xs text-zinc-500">{{ pr.date }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {{ pr.tag }}
                      </span>
                    </div>
                    <h3 class="font-semibold text-white mb-2">{{ pr.title }}</h3>
                    <p class="text-sm text-zinc-400">{{ pr.excerpt }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Media kit -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400" />
              Recursos para medios
            </h2>
            <div class="glass rounded-2xl border border-white/[0.08] p-6 mb-6">
              <p class="text-sm text-zinc-400 mb-5">Descarga nuestro kit de medios con logos, fotos y activos gráficos.</p>
              <div class="space-y-3">
                <div
                  v-for="asset in mediaAssets"
                  :key="asset.name"
                  class="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon name="lucide:download" class="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">{{ asset.name }}</p>
                      <p class="text-xs text-zinc-500">{{ asset.format }} · {{ asset.size }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quote -->
            <div class="glass rounded-2xl border border-white/[0.08] p-6">
              <p class="text-zinc-300 italic mb-4 leading-relaxed">
                "TuTurno nació de la frustración de perder medio día en una fila. Queríamos demostrar que la tecnología puede devolver algo tan básico como el tiempo a las personas."
              </p>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-semibold text-sm">
                  KR
                </div>
                <div>
                  <p class="text-sm font-medium text-white">Keyner Ramírez Ramos</p>
                  <p class="text-xs text-zinc-500">Co-fundador, Universidad de Córdoba</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Press contact -->
        <div class="glass rounded-3xl border border-white/[0.08] p-10 lg:p-14 text-center">
          <div class="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <Icon name="lucide:mic" class="w-8 h-8 text-blue-400" />
          </div>
          <h2 class="text-2xl font-semibold text-white mb-3">Contacto de prensa</h2>
          <p class="text-zinc-400 mb-8 max-w-md mx-auto">
            Para entrevistas, declaraciones o consultas de medios, contacta a nuestra oficina de comunicaciones.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              :href="`mailto:${pressContact.email}`"
              class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Icon name="lucide:mail" class="w-4 h-4" />
              {{ pressContact.email }}
            </a>
            <span class="hidden sm:block text-zinc-600">·</span>
            <a
              :href="`tel:${pressContact.phone}`"
              class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Icon name="lucide:phone" class="w-4 h-4" />
              {{ pressContact.phone }}
            </a>
          </div>
        </div>

      </div>
    </main>

    <LandingFooter />
  </div>
</template>