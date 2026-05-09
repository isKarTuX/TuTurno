<script setup lang="ts">
useSeoMeta({
  title: 'Política de Privacidad - TuTurno',
  description: 'Política de privacidad de TuTurno. Cómo recopilamos, usamos y protegemos tus datos personales en cumplimiento con la Ley 1581 de 2012.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const lastUpdated = '15 de marzo de 2025'
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[800px]">

        <!-- Header -->
        <div class="mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-6">
            <Icon name="lucide:shield" class="w-3.5 h-3.5 text-violet-400" />
            Legal
          </div>
          <h1 class="text-4xl sm:text-5xl font-display font-medium text-white mb-4 tracking-tighter">
            Política de Privacidad
          </h1>
          <p class="text-zinc-500 text-sm">Última actualización: {{ lastUpdated }}</p>
        </div>

        <!-- Content -->
        <div class="prose prose-invert max-w-none space-y-10">

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:user" class="w-5 h-5 text-violet-400 shrink-0" />
              1. Responsable del tratamiento
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              TuTurno, como proyecto académico de la Universidad de Córdoba, es el responsable del tratamiento de tus datos personales. Nuestros datos de contacto: <a href="mailto:privacidad@tuturno.co" class="text-violet-400 hover:text-violet-300">privacidad@tuturno.co</a>, Montería, Córdoba, Colombia.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:layout-grid" class="w-5 h-5 text-violet-400 shrink-0" />
              2. Datos que recopilamos
            </h2>
            <p class="text-zinc-400 leading-relaxed">Recopilamos los siguientes datos personales:</p>
            <ul class="list-disc list-inside text-zinc-400 space-y-2 mt-3">
              <li><strong class="text-white">Datos de registro:</strong> nombre completo, número de cédula, correo electrónico y teléfono.</li>
              <li><strong class="text-white">Datos de uso:</strong> turnos solicitados, estados de cola, horarios de atención y métricas de uso.</li>
              <li><strong class="text-white">Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo y cookies (ver Política de Cookies).</li>
              <li><strong class="text-white">Notificaciones push:</strong> token del dispositivo para enviar alertas de turno.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:zap" class="w-5 h-5 text-violet-400 shrink-0" />
              3. Finalidad del tratamiento
            </h2>
            <p class="text-zinc-400 leading-relaxed">Usamos tus datos para:</p>
            <ul class="list-disc list-inside text-zinc-400 space-y-2 mt-3">
              <li>Gestionar tu cuenta y autenticarte en la plataforma.</li>
              <li>Asignarte turnos y trackear tu posición en la cola.</li>
              <li>Enviarte notificaciones push cuando tu turno esté cerca o sea tu turno.</li>
              <li>Generar estadísticas anónimas para mejorar el servicio.</li>
              <li>Cumplir obligaciones legales y regulatorias.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:shield-check" class="w-5 h-5 text-violet-400 shrink-0" />
              4. Tus derechos (Ley 1581 de 2012 - Habeas Data)
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Como titular de datos personales, tienes derecho a:
            </p>
            <ul class="list-disc list-inside text-zinc-400 space-y-2 mt-3">
              <li><strong class="text-white">Conocer</strong> los datos personales que tenemos sobre ti.</li>
              <li><strong class="text-white">Actualizar</strong> y rectificar tus datos cuando sean incorrectos.</li>
              <li><strong class="text-white">Eliminar</strong> tus datos cuando ya no sean necesarios.</li>
              <li><strong class="text-white">Revocar</strong> el consentimiento para su tratamiento.</li>
              <li><strong class="text-white">Presentar quejas</strong> ante la Superintendencia de Industria y Comercio.</li>
            </ul>
            <p class="text-zinc-400 leading-relaxed mt-4">
              Para ejercer tus derechos, envía un correo a <a href="mailto:privacidad@tuturno.co" class="text-violet-400 hover:text-violet-300">privacidad@tuturno.co</a> con tu número de cédula y la solicitud específica.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:message-square" class="w-5 h-5 text-violet-400 shrink-0" />
              5. Compartición de datos
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              No vendemos tus datos personales. Compartimos información únicamente con: las entidades donde solicites turnos (para gestionar la atención), autoridades judiciales o regulatorias cuando sea requerido por ley, y proveedores técnicos que operan bajo acuerdos de confidencialidad.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:lock" class="w-5 h-5 text-violet-400 shrink-0" />
              6. Seguridad de los datos
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos: encriptación en tránsito (TLS), encriptación en reposo, acceso restringido por roles, y auditorías periódicas de seguridad.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:x-circle" class="w-5 h-5 text-violet-400 shrink-0" />
              7. Retención de datos
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Conservamos tus datos mientras tu cuenta esté activa o sea necesario para prestar el servicio. Los datos de turnos completados se anonimizan tras 2 años para estadísticas. Puedes solicitar la eliminación de tus datos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:settings" class="w-5 h-5 text-violet-400 shrink-0" />
              8. Cambios a esta política
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Notificaremos cualquier cambio material por correo electrónico o mediante un aviso en la plataforma 30 días antes de que entren en vigencia.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:mail" class="w-5 h-5 text-violet-400 shrink-0" />
              9. Contacto
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Responsable de privacidad: <a href="mailto:privacidad@tuturno.co" class="text-violet-400 hover:text-violet-300">privacidad@tuturno.co</a>
            </p>
          </section>

        </div>
      </div>
    </main>

    <LandingFooter />
  </div>
</template>