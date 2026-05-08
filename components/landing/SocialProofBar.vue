<script setup lang="ts">
const entities = [
  { name: 'EPS Sura', type: 'eps' },
  { name: 'Bancolombia', type: 'bank' },
  { name: 'Secretaría de Hacienda', type: 'public' },
  { name: 'Claro Colombia', type: 'telecom' },
]

const entityColors: Record<string, string> = {
  eps: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  bank: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  public: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400',
  telecom: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
}
</script>

<template>
  <section class="py-12 px-4 border-y border-white/5 bg-[--bg-surface]/50">
    <div class="max-w-7xl mx-auto">
      <p class="text-center text-sm text-[--text-muted] mb-8 uppercase tracking-widest">
        Entidades que ya transformaron la atención
      </p>
      <div class="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
        <div
          v-for="entity in entities"
          :key="entity.name"
          class="flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-default group"
          :class="entityColors[entity.type]"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="entityColors[entity.type].split(' ')[0]"
          >
            <svg v-if="entity.type === 'eps'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4m0 0a4 4 0 100-8 4 4 0 000 8zm0 0v6m-8-6h4m0 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else-if="entity.type === 'bank'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <svg v-else-if="entity.type === 'public'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{{ entity.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
