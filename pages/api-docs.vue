<script setup lang="ts">
useSeoMeta({
  title: 'API Reference - TuTurno',
  description: 'Referencia completa de la API REST de TuTurno. Endpoints, autenticación, formatos de request/response y códigos de error.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const endpoints = [
  {
    group: 'Autenticación',
    items: [
      {
        method: 'POST',
        path: '/api/auth/login',
        desc: 'Inicia sesión y devuelve access_token y refresh_token',
        body: '{ email: string, password: string }',
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        desc: 'Registra un nuevo usuario',
        body: '{ fullName: string, documentId: string, email: string, phone: string, password: string }',
      },
      {
        method: 'POST',
        path: '/api/auth/refresh',
        desc: 'Renueva el access_token usando refresh_token',
        body: '{ refreshToken: string }',
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        desc: 'Invalida el refresh_token actual',
        body: '',
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        desc: 'Obtiene el perfil del usuario autenticado',
        body: '',
      },
    ],
  },
  {
    group: 'Turnos',
    items: [
      {
        method: 'GET',
        path: '/api/turns',
        desc: 'Lista los turnos del usuario autenticado',
        body: '?status=waiting|called|attending|completed',
      },
      {
        method: 'POST',
        path: '/api/turns',
        desc: 'Crea un nuevo turno',
        body: '{ serviceId: string }',
      },
      {
        method: 'GET',
        path: '/api/turns/:id',
        desc: 'Detalle de un turno específico',
        body: '',
      },
      {
        method: 'DELETE',
        path: '/api/turns/:id',
        desc: 'Cancela un turno en estado waiting',
        body: '',
      },
    ],
  },
  {
    group: 'Entidades',
    items: [
      {
        method: 'GET',
        path: '/api/entities',
        desc: 'Lista entidades activas',
        body: '?city=string&type=eps|bank|public_office',
      },
      {
        method: 'GET',
        path: '/api/entities/:id',
        desc: 'Detalle de entidad con servicios',
        body: '',
      },
      {
        method: 'POST',
        path: '/api/entities',
        desc: 'Crea una nueva entidad (admin)',
        body: '{ name: string, type: string, address: string, city: string }',
      },
      {
        method: 'PATCH',
        path: '/api/entities/:id',
        desc: 'Actualiza una entidad (admin)',
        body: '{ name?: string, address?: string, isActive?: boolean }',
      },
    ],
  },
  {
    group: 'Servicios',
    items: [
      {
        method: 'GET',
        path: '/api/services',
        desc: 'Lista servicios de una entidad',
        body: '?entityId=string',
      },
      {
        method: 'POST',
        path: '/api/services',
        desc: 'Crea un servicio',
        body: '{ entityId: string, name: string, avgAttentionTime: number }',
      },
      {
        method: 'GET',
        path: '/api/services/:id/queue',
        desc: 'Estado actual de la cola de un servicio',
        body: '',
      },
    ],
  },
  {
    group: 'Operador',
    items: [
      {
        method: 'GET',
        path: '/api/operator/queue',
        desc: 'Cola de turnos del operador',
        body: '',
      },
      {
        method: 'POST',
        path: '/api/operator/call-next',
        desc: 'Llama al siguiente turno en espera',
        body: '{ serviceId: string }',
      },
      {
        method: 'POST',
        path: '/api/operator/complete',
        desc: 'Completa el turno actual',
        body: '{ turnId: string }',
      },
      {
        method: 'POST',
        path: '/api/operator/no-show',
        desc: 'Marca turno como no-show',
        body: '{ turnId: string }',
      },
    ],
  },
]

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  POST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PATCH: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

const errorCodes = [
  { code: 'UNAUTHORIZED', status: 401, desc: 'Token inválido o expirado' },
  { code: 'FORBIDDEN', status: 403, desc: 'Sin permisos para este recurso' },
  { code: 'NOT_FOUND', status: 404, desc: 'Recurso no encontrado' },
  { code: 'VALIDATION_ERROR', status: 400, desc: 'Datos de entrada inválidos' },
  { code: 'RATE_LIMITED', status: 429, desc: 'Demasiadas solicitudes, reintentar en 1 minuto' },
  { code: 'CONFLICT', status: 409, desc: 'Conflicto de estado (ej: turno ya cancelado)' },
]
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">

        <!-- Hero -->
        <div class="mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-8">
            <Icon name="lucide:code-2" class="w-3.5 h-3.5 text-violet-400" />
            API Reference v1
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tighter">
            API REST
          </h1>
          <p class="text-lg text-zinc-400 max-w-2xl">
            Interactúa con TuTurno mediante nuestra API REST. Base URL: <code class="text-violet-400 bg-white/5 px-2 py-1 rounded text-sm">https://api.tuturno.co/v1</code>
          </p>
        </div>

        <!-- Base URL note -->
        <div class="glass rounded-2xl border border-white/[0.08] p-6 mb-12 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Icon name="lucide:info" class="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 class="font-medium text-white mb-1">API en desarrollo</h3>
            <p class="text-sm text-zinc-400">La API REST está disponible en el entorno de desarrollo en <code class="text-violet-400">http://localhost:3000</code>. Los endpoints son los mismos, solo cambia la base URL.</p>
          </div>
        </div>

        <!-- Endpoints -->
        <div class="space-y-12">
          <div v-for="group in endpoints" :key="group.group">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Icon name="lucide:code-2" class="w-5 h-5 shrink-0 text-violet-400" />
              {{ group.group }}
            </h2>

            <div class="space-y-3">
              <div
                v-for="ep in group.items"
                :key="ep.path"
                class="glass rounded-xl border border-white/[0.08] p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/[0.12] transition-colors"
              >
                <div class="flex items-center gap-3 shrink-0">
                  <span
                    class="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-md border uppercase tracking-wider"
                    :class="methodColors[ep.method]"
                  >
                    {{ ep.method }}
                  </span>
                  <code class="text-sm text-white font-mono">{{ ep.path }}</code>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-zinc-400">{{ ep.desc }}</p>
                  <p v-if="ep.body" class="text-xs text-zinc-600 mt-1 font-mono truncate">Body: {{ ep.body }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error codes -->
        <div class="mt-20">
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Icon name="lucide:alert-circle" class="w-5 h-5 shrink-0 text-violet-400" />
              Códigos de error
            </h2>
          <div class="glass rounded-2xl border border-white/[0.08] overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-white/[0.06]">
                  <th class="text-left px-6 py-4 text-zinc-500 font-medium">Código</th>
                  <th class="text-left px-6 py-4 text-zinc-500 font-medium">Status</th>
                  <th class="text-left px-6 py-4 text-zinc-500 font-medium">Descripción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.04]">
                <tr v-for="err in errorCodes" :key="err.code" class="hover:bg-white/[0.02] transition-colors">
                  <td class="px-6 py-4">
                    <code class="text-rose-400 text-xs font-mono">{{ err.code }}</code>
                  </td>
                  <td class="px-6 py-4 text-zinc-400">{{ err.status }}</td>
                  <td class="px-6 py-4 text-zinc-400">{{ err.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Navigation -->
        <div class="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <NuxtLink to="/docs" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            <span class="text-sm">Documentación</span>
          </NuxtLink>
        </div>

      </div>
    </main>

    <LandingFooter />
  </div>
</template>