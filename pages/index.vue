<script setup lang="ts">
useSeoMeta({
  title: 'TuTurno - Turnos digitales sin filas',
  ogTitle: 'TuTurno - Turnos digitales sin filas',
  description: 'Solicita turnos digitales desde cualquier dispositivo. Sin filas, sin esperar. Para EPS, bancos y oficinas públicas en Colombia.',
  ogDescription: 'Solicita turnos digitales desde cualquier dispositivo. Sin filas, sin esperar.',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'es',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <div>
    <LandingHero />
    <LandingHowItWorks />
    <LandingRealTime />
    <LandingForEntities />
    <LandingMetrics />
    <LandingCTA />
  </div>
</template>