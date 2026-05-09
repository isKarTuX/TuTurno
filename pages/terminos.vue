<script setup lang="ts">
useSeoMeta({
  title: 'Términos de Uso - TuTurno',
  description: 'Términos y condiciones de uso de la plataforma TuTurno. Lee nuestras condiciones antes de usar el servicio.',
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
            <Icon name="lucide:scale" class="w-3.5 h-3.5 text-violet-400" />
            Legal
          </div>
          <h1 class="text-4xl sm:text-5xl font-display font-medium text-white mb-4 tracking-tighter">
            Términos de Uso
          </h1>
          <p class="text-zinc-500 text-sm">Última actualización: {{ lastUpdated }}</p>
        </div>

        <!-- Content -->
        <div class="prose prose-invert max-w-none space-y-10">

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-violet-400 shrink-0" />
              1. Aceptación de los términos
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Al acceder y usar TuTurno, aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con alguna parte, no deberías usar el servicio. TuTurno es operado por estudiantes de la Universidad de Córdoba como proyecto académico.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:layout-dashboard" class="w-5 h-5 text-violet-400 shrink-0" />
              2. Descripción del servicio
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              TuTurno es una plataforma digital que permite a los ciudadanos solicitar turnos para ser atendidos en entidades como EPS, bancos y oficinas públicas, eliminando la necesidad de esperar físicamente en filas. El servicio incluye solicitud de turnos, seguimiento en tiempo real y notificaciones.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:user" class="w-5 h-5 text-violet-400 shrink-0" />
              3. Registro y cuenta
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Para usar TuTurno debes registrarte con información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Debes tener al menos 18 años o contar con autorización de un representante legal.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:shield-check" class="w-5 h-5 text-violet-400 shrink-0" />
              4. Uso responsable
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Te comprometes a usar TuTurno únicamente para fines legítimos. Queda prohibido: presentar información falsa al solicitar turnos, intentar manipular el sistema de colas, realizar ataques de denegación de servicio, o usar la plataforma para cualquier actividad ilegal.
            </p>
            <p class="text-zinc-400 leading-relaxed mt-4">
              Los ciudadanos que acumulen 3 "no-shows" (turnos llamados sin presentarse) en un período de 30 días, no podrán solicitar turnos durante los siguientes 7 días.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:building-2" class="w-5 h-5 text-violet-400 shrink-0" />
              5. Entidades y operadores
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Las entidades que usan TuTurno son responsables de gestionar sus propias colas y servicios. TuTurno no es responsable de los tiempos de atención, decisiones de los operadores ni de la calidad del servicio prestado por las entidades.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:copyright" class="w-5 h-5 text-violet-400 shrink-0" />
              6. Propiedad intelectual
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Todo el contenido, diseño, código y marcas de TuTurno son propiedad de sus creadores (proyecto académico Universidad de Córdoba) o están licenciados. No puedes copiar, modificar o redistribuir ningún componente sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:alert-triangle" class="w-5 h-5 text-violet-400 shrink-0" />
              7. Limitación de responsabilidad
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              TuTurno se proporciona "tal cual". No garantizamos que el servicio esté libre de interrupciones o errores. No somos responsables de pérdidas derivadas del uso de la plataforma, incluyendo pérdida de tiempo, datos, oportunidades de negocio o cualquier daño indirecto.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:settings-2" class="w-5 h-5 text-violet-400 shrink-0" />
              8. Modificaciones
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Podemos modificar estos términos en cualquier momento. Los cambios sustanciales serán notificados por correo electrónico o mediante un aviso en la plataforma. El uso continuado después de los cambios constituye aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:scale" class="w-5 h-5 text-violet-400 shrink-0" />
              9. Ley aplicable y jurisdicción
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia será resuelta ante los tribunales competentes de Montería, Córdoba. El uso de TuTurno implica la aceptación expresa de esta jurisdicción.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Icon name="lucide:mail" class="w-5 h-5 text-violet-400 shrink-0" />
              10. Contacto
            </h2>
            <p class="text-zinc-400 leading-relaxed">
              Para consultas sobre estos términos, contacta a <a href="mailto:legal@tuturno.co" class="text-violet-400 hover:text-violet-300">legal@tuturno.co</a>.
            </p>
          </section>

        </div>
      </div>
    </main>

    <LandingFooter />
  </div>
</template>