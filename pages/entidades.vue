<script setup lang="ts">
useSeoMeta({
  title: 'Para Entidades - TuTurno',
  description: 'Gestiona turnos digitales sin filas para tu entidad.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})

const activeTab = ref<'citizens' | 'entities' | 'operators'>('entities')

const tabs = [
  { id: 'citizens' as const, label: 'Ciudadanos', icon: 'user' },
  { id: 'entities' as const, label: 'Entidades', icon: 'building' },
  { id: 'operators' as const, label: 'Operadores', icon: 'headset' },
]
</script>

<template>
  <div>
    <LandingHeader />

    <main class="pt-16 lg:pt-20">
      <section class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div class="max-w-7xl mx-auto relative">
          <div class="text-center mb-16">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary-light font-medium uppercase tracking-wider mb-6">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Soluciones
            </span>

            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
              Soluciones para tu entidad
            </h2>

            <p class="text-lg lg:text-xl text-[--text-secondary] max-w-2xl mx-auto">
              TuTurno ofrece herramientas para que tu entidad gestione turnos digitales y optimice la atención a los ciudadanos.
            </p>
          </div>

          <div class="flex justify-center mb-12">
            <div class="inline-flex gap-1 p-1 bg-surface rounded-2xl border border-white/5">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="relative px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                :class="activeTab === tab.id ? 'text-white' : 'text-muted hover:text-secondary'"
                @click="activeTab = tab.id"
              >
                <span v-if="activeTab === tab.id" class="absolute inset-0 bg-primary rounded-xl" />
                <span class="relative flex items-center gap-2">
                  <svg v-if="tab.icon === 'user'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg v-else-if="tab.icon === 'building'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <svg v-else-if="tab.icon === 'headset'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
                  </svg>
                  <span>{{ tab.label }}</span>
                </span>
              </button>
            </div>
          </div>

          <Transition name="tab-fade" mode="out-in">
            <LandingForCitizens v-if="activeTab === 'citizens'" key="citizens" />
            <LandingForEntities v-else-if="activeTab === 'entities'" key="entities" />
            <LandingForOperators v-else-if="activeTab === 'operators'" key="operators" />
          </Transition>
        </div>
      </section>

      <LandingCTA />
    </main>
  </div>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>