<script setup lang="ts">
useSeoMeta({
  title: 'Política de Cookies - TuTurno',
  description: 'Política de cookies de TuTurno. Qué cookies usamos, para qué las usamos y cómo puedes controlarlas.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const lastUpdated = '15 de marzo de 2025'

const cookieTypes = [
  {
    category: 'Necesarias',
    description: 'Esenciales para el funcionamiento de la plataforma. Sin ellas, el inicio de sesión y la solicitud de turnos no funcionarían.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
    cookies: [
      { name: 'access_token', purpose: 'JWT de acceso para autenticación', duration: '15 minutos' },
      { name: 'refresh_token', purpose: 'Token de renovación de sesión', duration: '7 días' },
      { name: 'consent', purpose: 'Registro de tu preferencia de cookies', duration: '1 año' },
    ],
    required: true,
  },
  {
    category: 'Funcionales',
    description: 'Mejoran tu experiencia recordando tus preferencias, como el idioma y la última entidad que visitaste.',
    icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    cookies: [
      { name: 'preferences', purpose: 'Configuración de interfaz elegida', duration: '6 meses' },
      { name: 'recent_entities', purpose: 'Entidades recientemente vistas', duration: '30 días' },
    ],
    required: false,
  },
  {
    category: 'Analíticas',
    description: 'Nos ayudan a entender cómo los usuarios usan TuTurno para que podamos mejorar la plataforma. Datos anónimos y agregados.',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    cookies: [
      { name: '_ga', purpose: 'Google Analytics - distingue usuarios', duration: '2 años' },
      { name: '_gid', purpose: 'Google Analytics - distingue usuarios', duration: '24 horas' },
    ],
    required: false,
  },
  {
    category: 'Rendimiento',
    description: 'Nos ayudan a monitorear el rendimiento de la plataforma para detectar errores y optimizar velocidad.',
    icon: 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    cookies: [
      { name: '_dd_s', purpose: 'Datadog - monitor de errores', duration: '1 día' },
    ],
    required: false,
  },
]
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[800px]">

        <!-- Header -->
        <div class="mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-6">
            <Icon name="lucide:cookie" class="w-3.5 h-3.5 text-violet-400" />
            Legal
          </div>
          <h1 class="text-4xl sm:text-5xl font-display font-medium text-white mb-4 tracking-tighter">
            Política de Cookies
          </h1>
          <p class="text-zinc-500 text-sm">Última actualización: {{ lastUpdated }}</p>
        </div>

        <!-- Content -->
        <div class="prose prose-invert max-w-none space-y-10">

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:help-circle" class="w-5 h-5 text-violet-400 shrink-0" />
              1. ¿Qué son las cookies?
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computador, tablet o teléfono) cuando visitas un sitio web. Se usan ampliamente para que los sitios funcionen correctamente, guardar preferencias y analizar cómo se usa el sitio.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:settings" class="w-5 h-5 text-violet-400 shrink-0" />
              2. Cómo usamos las cookies
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              TuTurno usa cookies para autenticación, recordar tus preferencias y analizar el uso de la plataforma. No usamos cookies con fines publicitarios.
            </p>
          </section>

          <!-- Cookie table -->
          <section>
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Icon name="lucide:list" class="w-5 h-5 text-violet-400 shrink-0" />
              3. Detalle de cookies por categoría
            </h2>

            <div class="space-y-6">
              <div
                v-for="type in cookieTypes"
                :key="type.category"
                class="glass rounded-2xl border border-white/[0.08] p-6"
              >
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Icon :name="type.icon" class="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-white">{{ type.category }}</h3>
                        <span
                          v-if="type.required"
                          class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          Siempre activas
                        </span>
                        <span
                          v-else
                          class="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        >
                          Opcional
                        </span>
                      </div>
                      <p class="text-sm text-zinc-400">{{ type.description }}</p>
                    </div>
                  </div>
                </div>

                <div class="overflow-hidden rounded-xl border border-white/[0.06]">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-white/[0.02] border-b border-white/[0.06]">
                        <th class="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Nombre</th>
                        <th class="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Propósito</th>
                        <th class="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Duración</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/[0.04]">
                      <tr v-for="cookie in type.cookies" :key="cookie.name">
                        <td class="px-4 py-3">
                          <code class="text-violet-400 text-xs font-mono">{{ cookie.name }}</code>
                        </td>
                        <td class="px-4 py-3 text-zinc-400">{{ cookie.purpose }}</td>
                        <td class="px-4 py-3 text-zinc-400">{{ cookie.duration }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:globe" class="w-5 h-5 text-violet-400 shrink-0" />
              4. Cookies de terceros
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Usamos Google Analytics (cookies <code class="text-violet-400 text-xs">_ga</code>, <code class="text-violet-400 text-xs">_gid</code>) para analizar el uso de la plataforma de forma anonimizada. Google puede usar estos datos conforme a su propia política de privacidad. También usamos Datadog para monitoreo de errores.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:settings-2" class="w-5 h-5 text-violet-400 shrink-0" />
              5. Cómo controlar las cookies
            </h2>
            <p class="text-zinc-400 leading-relaxed mb-4">
              Puedes aceptar, rechazar o configurar tus preferencias de cookies de las siguientes formas:
            </p>
            <ul class="list-disc list-inside text-zinc-400 space-y-2">
              <li><strong class="text-white">Banner de cookies:</strong> Al visitar TuTurno por primera vez, un banner te permitirá aceptar solo las necesarias o personalizar tu elección.</li>
              <li><strong class="text-white">Panel de preferencias:</strong> Cambia tus preferencias en cualquier momento desde el ícono de cookies en la esquina inferior derecha.</li>
              <li><strong class="text-white">Configuración del navegador:</strong> La mayoría de navegadores permiten bloquear o eliminar cookies desde la configuración. Ten en cuenta que bloquear cookies necesarias puede afectar el funcionamiento del servicio.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:settings" class="w-5 h-5 text-violet-400 shrink-0" />
              6. Cambios a esta política
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Actualizaremos esta política cuando añadamos nuevas cookies o cambien las finalidades de las existentes. Los cambios serán notificados mediante un aviso en la plataforma.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:mail" class="w-5 h-5 text-violet-400 shrink-0" />
              7. Contacto
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Para consultas sobre nuestra política de cookies: <a href="mailto:privacidad@tuturno.co" class="text-violet-400 hover:text-violet-300">privacidad@tuturno.co</a>
            </p>
          </section>

        </div>
      </div>
    </main>

    <LandingFooter />
  </div>
</template>