<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Busca la entidad',
    description: 'Encuentra la entidad donde necesitas atención: EPS, banco, oficina pública o cualquier otra.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Solicita tu turno',
    description: 'Selecciona el servicio que necesitas y recibe tu turno digital al instante con código QR.',
    icon: '🎫',
  },
  {
    number: '03',
    title: 'Monitorea tu posición',
    description: 'Recibe actualizaciones en tiempo real sobre tu posición en la cola y tiempo de espera estimado.',
    icon: '📱',
  },
  {
    number: '04',
    title: 'Preséntate a tiempo',
    description: 'Cuando te falten pocos turnos, recibe una notificación. Presenta tu código QR al llegar.',
    icon: '✅',
  },
]
</script>

<template>
  <section id="como-funciona" class="py-24 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          ¿Cómo funciona?
        </h2>
        <p class="text-[--text-secondary] text-lg max-w-2xl mx-auto">
          En cuatro pasos simples, obtén tu turno sin hacer fila
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(step, index) in steps"
          :key="step.number"
          class="relative"
        >
          <div class="glass p-6 rounded-xl h-full hover:bg-white/10 transition-colors group">
            <div class="text-4xl mb-4">{{ step.icon }}</div>
            <div class="text-5xl font-display font-bold text-primary/30 mb-2">{{ step.number }}</div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ step.title }}</h3>
            <p class="text-[--text-secondary] text-sm">{{ step.description }}</p>
          </div>

          <div
            v-if="index < steps.length - 1"
            class="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2"
          >
            <svg class="w-8 h-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>