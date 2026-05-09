<script setup lang="ts">
useSeoMeta({
  title: 'Preguntas Frecuentes - TuTurno',
  description: 'Resolvemos las dudas más comunes sobre TuTurno: cómo funciona para ciudadanos, entidades y operadores.',
})

useHead({ htmlAttrs: { lang: 'es' } })

const categories = [
  {
    id: 'ciudadanos',
    label: 'Para Ciudadanos',
    icon: 'lucide:user',
    faqs: [
      {
        q: '¿Cómo solicito un turno?',
        a: 'Inicia sesión en TuTurno, busca la entidad que necesitas visitar (EPS, banco, oficina pública), selecciona el servicio y solicita tu turno. Recibirás un número y podrás rastrear tu posición en tiempo real.',
      },
      {
        q: '¿Puedo cancelar mi turno?',
        a: 'Sí. Desde "Mis Turnos" en la app, puedes cancelar cualquier turno que aún no haya sido llamado. Los turnos cancelados no penalizan tu historial.',
      },
      {
        q: '¿Qué pasa si mi turno es llamado y no estoy?',
        a: 'Si no te presentas cuando tu turno es llamado, el operador puede marcarlo como "no-show". Tras 3 no-shows en 30 días, no podrás solicitar turnos por 7 días.',
      },
      {
        q: '¿Cómo sé cuándo es mi turno?',
        a: 'Recibirás una notificación push cuando falten 3 turnos para ti, y otra cuando sea tu turno. También puedes rastrear tu posición en tiempo real desde la app.',
      },
      {
        q: '¿Cuánto cuesta usar TuTurno?',
        a: 'TuTurno es completamente gratuito para los ciudadanos. El servicio es financiado por las entidades que lo utilizan.',
      },
      {
        q: '¿Puedo sacar turno para cualquier entidad?',
        a: 'Por ahora, TuTurno está disponible en las entidades que se han registrado en la plataforma. Estamos expandiendo la red constantemente.',
      },
    ],
  },
  {
    id: 'entidades',
    label: 'Para Entidades',
    icon: 'lucide:building-2',
    faqs: [
      {
        q: '¿Cómo registro mi entidad en TuTurno?',
        a: 'Regístrate en TuTurno como entidad. Añade tu información básica, crea tus servicios y asigna operadores. El proceso toma menos de 15 minutos.',
      },
      {
        q: '¿Qué hardware necesito?',
        a: 'Solo necesitas pantallas o dispositivos para mostrar el número de turno llamado. El resto funciona desde cualquier navegador web.',
      },
      {
        q: '¿Puedo integrar TuTurno con mis sistemas existentes?',
        a: 'Sí. Disponemos de una API REST completa para integrar con sistemas de gestión ciudadana, CRM o cualquier software propio.',
      },
      {
        q: '¿Cómo sé cuántas personas atiendo al día?',
        a: 'El dashboard de operador muestra métricas en tiempo real: turnos atendidos, tiempo promedio de atención, filaspeak y más. Los reportes históricos están disponibles para administradores.',
      },
    ],
  },
  {
    id: 'operadores',
    label: 'Para Operadores',
    icon: 'lucide:headphones',
    faqs: [
      {
        q: '¿Cómo llamo al siguiente turno?',
        a: 'En el panel de operador, haz clic en "Llamar siguiente". El turno pasará a estado "llamado" y el ciudadano recibirá una notificación.',
      },
      {
        q: '¿Qué hago si un ciudadano no se presenta?',
        a: 'Usa el botón "No se presentó" para marcar el turno. Esto libera la cola y se registra en el historial del ciudadano.',
      },
      {
        q: '¿Puedo pausar la cola?',
        a: 'Sí. El administrador del servicio puede pausar la recepción de turnos en cualquier momento desde el panel de gestión.',
      },
      {
        q: '¿Cómo Atiendo un turno completo?',
        a: 'Una vez con el ciudadano frente a ti, marca "Iniciar atención". Al terminar, usa "Completar turno". El tiempo de atención queda registrado.',
      },
    ],
  },
]

const activeCategory = ref('ciudadanos')

const filteredFaqs = computed(() => {
  return categories.find((c) => c.id === activeCategory.value)?.faqs ?? []
})

function setCategory(id: string) {
  activeCategory.value = id
}
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col selection:bg-indigo-500/30">
    <LandingHeader />

    <main class="flex-1 pt-24 lg:pt-32 pb-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">

        <!-- Hero -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wide mb-8">
            <Icon name="lucide:help-circle" class="w-3.5 h-3.5 text-violet-400" />
            Centro de Ayuda
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tighter text-balance">
            Preguntas Frecuentes
          </h1>
          <p class="text-lg text-zinc-400 max-w-xl mx-auto">
            Todo lo que necesitas saber sobre TuTurno, organizado por tipo de usuario.
          </p>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            :class="activeCategory === cat.id
              ? 'bg-[--color-primary] text-white shadow-lg shadow-[--color-primary]/30'
              : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]'"
            @click="setCategory(cat.id)"
          >
            <Icon :name="cat.icon" class="w-4 h-4" />
            {{ cat.label }}
          </button>
        </div>

        <!-- FAQ List -->
        <div class="space-y-3">
          <LandingFaqItem
            v-for="(faq, i) in filteredFaqs"
            :key="i"
            :question="faq.q"
            :answer="faq.a"
          />
        </div>

        <!-- Still have questions -->
        <div class="mt-16 glass rounded-2xl border border-white/[0.08] p-8 text-center">
          <div class="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <Icon name="lucide:message-circle" class="w-7 h-7 text-violet-400" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-3">¿No encontraste tu respuesta?</h3>
          <p class="text-zinc-400 mb-6">Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.</p>
          <NuxtLink to="/contacto" class="btn btn-primary px-6 py-3">
            Contactar soporte
          </NuxtLink>
        </div>

      </div>
    </main>

    <LandingFooter />
  </div>
</template>