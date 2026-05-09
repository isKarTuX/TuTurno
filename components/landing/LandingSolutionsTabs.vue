<script setup lang="ts">
const activeTab = ref<'citizens' | 'entities' | 'operators'>('entities')

const tabs = [
  {
    id: 'citizens' as const,
    label: 'Ciudadanos',
    icon: 'user',
  },
  {
    id: 'entities' as const,
    label: 'Entidades',
    icon: 'building',
  },
  {
    id: 'operators' as const,
    label: 'Operadores',
    icon: 'headset',
  },
]

const citizensBenefits = [
  {
    title: 'Sin filas físicas',
    description: 'Olvídate de esperar parado. Solicita tu turno desde cualquier lugar.',
    icon: 'ticket',
  },
  {
    title: 'Notificaciones a tiempo',
    description: 'Recibe alertas cuando queden pocos turnos antes del tuyo.',
    icon: 'bell',
  },
  {
    title: 'Tu turno en el celular',
    description: 'Código QR único que el operador escanea cuando te llama.',
    icon: 'qr',
  },
  {
    title: 'Sin registro complejo',
    description: 'Solo tu número de cédula. Sin crear cuenta, sin recordar contraseñas.',
    icon: 'id-card',
  },
]

const entitiesBenefits = [
  {
    title: 'Dashboard en tiempo real',
    description: 'Ve cuántos turnos esperan, tiempos promedio y métricas clave.',
    icon: 'chart',
  },
  {
    title: 'Optimiza tu operación',
    description: 'Reduce tiempos de espera y mejora la satisfacción de clientes.',
    icon: 'efficiency',
  },
  {
    title: 'Analytics profundos',
    description: 'Reports detallado del flujo de atención. Datos para mejores decisiones.',
    icon: 'analytics',
  },
  {
    title: 'Integración simple',
    description: 'Conecta con tus sistemas existentes. API completa disponible.',
    icon: 'plug',
  },
]

const operatorsBenefits = [
  {
    title: 'Un-click para llamar',
    description: 'Botón grande para llamar siguiente turno. Sin confusiones.',
    icon: 'click',
  },
  {
    title: 'Gestión de no-shows',
    description: 'Marca ciudadanos que no se presenten. Se llama al siguiente automáticamente.',
    icon: 'skip',
  },
  {
    title: 'Panel de control',
    description: 'Pausar cola, cambiar servicio, actualizar tiempos de atención.',
    icon: 'settings',
  },
  {
    title: 'Historial de atenciones',
    description: 'Registro automático de cada turno atendido con tiempos.',
    icon: 'history',
  },
]

const iconPaths: Record<string, string> = {
  'ticket': 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  'bell': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  'qr': 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
  'id-card': 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0a2 2 0 114 0m0 0v1m0-1v-1m-4 1l-1-1m1 1l1 1m0 0v1m0-1v-1m0 0v1',
  'chart': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'efficiency': 'M13 10V3L4 14h7v7l9-11h-7z',
  'analytics': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'plug': 'M13 10V3L4 14h7v7l9-11h-7z',
  'click': 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
  'skip': 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-4h4l3 4v4h-7V5l-3-4z',
  'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'history': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <section class="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="max-w-7xl mx-auto relative">
      <div class="text-center mb-8">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary-light font-semibold uppercase tracking-widest mb-4">
          Soluciones
        </span>

        <h2 class="text-3xl sm:text-4xl font-display font-black text-white mb-3 tracking-tight">
          Soluciones para
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">tu entidad</span>
        </h2>

        <p class="text-sm text-secondary max-w-xl mx-auto">
          TuTurno ofrece herramientas para que tu entidad gestione turnos digitales y optimice la atención.
        </p>
      </div>

      <div class="flex justify-center mb-6">
        <div class="inline-flex gap-1 p-1 bg-surface rounded-xl border border-white/5">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="relative px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            :class="activeTab === tab.id ? 'text-white' : 'text-muted hover:text-secondary'"
            @click="activeTab = tab.id"
          >
            <span v-if="activeTab === tab.id" class="absolute inset-0 bg-primary rounded-lg" />
            <span class="relative flex items-center gap-1.5">
              <svg v-if="tab.icon === 'user'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg v-else-if="tab.icon === 'building'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <svg v-else-if="tab.icon === 'headset'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
              </svg>
              <span>{{ tab.label }}</span>
            </span>
          </button>
        </div>
      </div>

      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'citizens'" key="citizens" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="(benefit, index) in citizensBenefits"
            :key="benefit.title"
            class="group relative p-4 rounded-xl bg-surface border border-white/6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
              <svg class="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[benefit.icon]" />
              </svg>
            </div>

            <h3 class="text-sm font-semibold text-white mb-1 group-hover:text-primary-light transition-colors">
              {{ benefit.title }}
            </h3>

            <p class="text-[11px] text-muted leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>

        <div v-else-if="activeTab === 'entities'" key="entities" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="(benefit, index) in entitiesBenefits"
            :key="benefit.title"
            class="group relative p-4 rounded-xl bg-surface border border-white/6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
              <svg class="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[benefit.icon]" />
              </svg>
            </div>

            <h3 class="text-sm font-semibold text-white mb-1 group-hover:text-primary-light transition-colors">
              {{ benefit.title }}
            </h3>

            <p class="text-[11px] text-muted leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>

        <div v-else-if="activeTab === 'operators'" key="operators" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="(benefit, index) in operatorsBenefits"
            :key="benefit.title"
            class="group relative p-4 rounded-xl bg-surface border border-white/6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
              <svg class="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[benefit.icon]" />
              </svg>
            </div>

            <h3 class="text-sm font-semibold text-white mb-1 group-hover:text-primary-light transition-colors">
              {{ benefit.title }}
            </h3>

            <p class="text-[11px] text-muted leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </Transition>

      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <NuxtLink
          to="/auth/register"
          class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark shadow-xl shadow-primary/40" />
          <div class="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span class="relative flex items-center gap-2">
            Solicitar mi turno
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </NuxtLink>
        <NuxtLink
          to="/auth/login"
          class="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold text-white rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
        >
          Solicitar demo
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 150ms var(--ease-out), transform 150ms var(--ease-out);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>