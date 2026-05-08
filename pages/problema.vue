<script setup lang="ts">
useSeoMeta({
  title: 'El Problema - TuTurno',
  description: 'El problema de las filas interminables en Colombia y cómo TuTurno lo resuelve.',
})

useHead({
  htmlAttrs: { lang: 'es' },
})
</script>

<template>
  <div>
    <LandingHeader />

    <main class="pt-16 lg:pt-20">
      <div class="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
              El problema de las filas
            </h1>
            <p class="text-lg lg:text-xl text-[--text-secondary] max-w-3xl mx-auto">
              En Colombia, esperar puede costarte meses. TuTurno existe para cambiar esta realidad.
            </p>
          </div>

          <ImpactStats />

          <LandingTestimonials />
        </div>
      </div>

      <LandingCTA />
    </main>
  </div>
</template>
