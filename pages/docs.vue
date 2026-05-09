<script setup lang="ts">
useSeoMeta({
  title: 'Documentación - TuTurno',
  description: 'Documentación técnica completa de TuTurno. Integración, APIs, SDKs, webhooks y guías para desarrolladores.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const sections = [
  {
    id: 'introduccion',
    title: 'Introducción',
    icon: 'lucide:book-open',
    content: [
      {
        title: '¿Qué es TuTurno API?',
        body: 'TuTurno ofrece una API REST completa para que cualquier entidad pueda integrar la gestión de turnos en sus sistemas existentes. La API está basada en HTTP/JSON, es RESTful y soporta autenticación mediante JWT.',
      },
      {
        title: 'Conceptos fundamentales',
        body: 'La API opera sobre tres entidades principales: Entidades (las organizaciones que ofrecen turnos), Servicios (los tipos de atención que proveen) y Turnos (las solicitudes de atención de los ciudadanos).',
      },
    ],
  },
  {
    id: 'autenticacion',
    title: 'Autenticación',
    icon: 'lucide:shield-check',
    content: [
      {
        title: 'Tokens JWT',
        body: 'La API usa JSON Web Tokens (JWT) para autenticación. Incluye un access_token de corta duración (15 min) y un refresh_token para sesiones prolongadas (7 días).',
      },
      {
        title: 'Encabezados requeridos',
        body: 'Todas las peticiones deben incluir Authorization: Bearer <access_token>. Los tokens se obtienen mediante el endpoint POST /api/auth/login.',
      },
    ],
  },
  {
    id: 'turnos',
    title: 'Turnos',
    icon: 'lucide:ticket',
    content: [
      {
        title: 'Crear un turno',
        body: 'POST /api/turns - Crea un nuevo turno para un ciudadano en un servicio específico. Retorna el número de turno asignado y la posición en cola.',
      },
      {
        title: 'Listar turnos',
        body: 'GET /api/turns - Lista los turnos de un ciudadano. Soporta filtros por estado (waiting, called, attending, completed).',
      },
      {
        title: 'Cancelar turno',
        body: 'DELETE /api/turns/[id] - Cancela un turno existente. Solo turnos en estado "waiting" pueden ser cancelados.',
      },
    ],
  },
  {
    id: 'entidades',
    title: 'Entidades',
    icon: 'lucide:building-2',
    content: [
      {
        title: 'Listar entidades',
        body: 'GET /api/entities - Devuelve todas las entidades activas con sus servicios. Soporta filtro por ciudad y tipo (eps, bank, public_office).',
      },
      {
        title: 'Detalle de entidad',
        body: 'GET /api/entities/[id] - Información completa de una entidad incluyendo horarios, servicios activos y operadores.',
      },
    ],
  },
  {
    id: 'operadores',
    title: 'Operadores',
    icon: 'lucide:headphones',
    content: [
      {
        title: 'Llamar siguiente turno',
        body: 'POST /api/operator/call-next - El operador llama al siguiente turno en espera de su servicio. Notifica al ciudadano por push.',
      },
      {
        title: 'Completar turno',
        body: 'POST /api/operator/complete - Marca el turno actual como completado y registra el tiempo de atención.',
      },
    ],
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    icon: 'lucide:webhook',
    content: [
      {
        title: 'Eventos disponibles',
        body: 'turn.created, turn.called, turn.attending, turn.completed, turn.no_show, turn.cancelled, service.paused, service.resumed',
      },
      {
        title: 'Formato del payload',
        body: 'Cada webhook envía un POST HTTP con JSON: { event: string, data: object, timestamp: string }. Incluye firma HMAC-SHA256 en X-TuTurno-Signature.',
      },
    ],
  },
]

const activeSection = ref('introduccion')
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <div class="flex-1 pt-16 flex">
      <!-- Sidebar -->
      <aside class="hidden lg:block w-72 shrink-0 border-r border-white/[0.06] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-6">
        <p class="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 px-3">Contenido</p>
        <nav class="space-y-1">
          <button
            v-for="section in sections"
            :key="section.id"
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left"
            :class="activeSection === section.id
              ? 'bg-[--color-primary]/10 text-[--color-primary-light] font-medium'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'"
            @click="activeSection = section.id"
          >
            <Icon :name="section.icon" class="w-4 h-4 shrink-0" />
            {{ section.title }}
          </button>
        </nav>

        <div class="mt-8 pt-8 border-t border-white/[0.06]">
          <p class="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 px-3">Recursos</p>
          <nav class="space-y-1">
            <NuxtLink to="/api-docs" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all">
              <Icon name="lucide:code" class="w-4 h-4" />
              API Reference
            </NuxtLink>
            <a href="mailto:dev@tuturno.co" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all">
              <Icon name="lucide:mail" class="w-4 h-4" />
              dev@tuturno.co
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 py-12 px-8 lg:px-16 max-w-4xl">
        <!-- Top bar (mobile) -->
        <div class="lg:hidden mb-8">
          <select
            v-model="activeSection"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          >
            <option v-for="section in sections" :key="section.id" :value="section.id">
              {{ section.title }}
            </option>
          </select>
        </div>

        <div class="space-y-16">
          <section v-for="section in sections" :id="section.id" :key="section.id">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <Icon :name="section.icon" class="w-6 h-6 text-violet-400" />
              </div>
              <h2 class="text-3xl font-display font-medium text-white">{{ section.title }}</h2>
            </div>

            <div class="space-y-8">
              <div v-for="doc in section.content" :key="doc.title" class="glass rounded-2xl border border-white/[0.08] p-8">
                <h3 class="text-lg font-semibold text-white mb-4">{{ doc.title }}</h3>
                <p class="text-zinc-400 leading-relaxed">{{ doc.body }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Navigation -->
        <div class="mt-20 pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <NuxtLink to="/soporte" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            <span class="text-sm">Volver a Soporte</span>
          </NuxtLink>
          <NuxtLink to="/api-docs" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <span class="text-sm">API Reference</span>
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </main>
    </div>

    <LandingFooter />
  </div>
</template>