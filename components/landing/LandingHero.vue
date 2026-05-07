<script setup lang="ts">
</script>

<template>
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/10"></div>
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/30 rounded-full blur-3xl"></div>

    <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <div class="animate-enter">
        <span class="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 mb-6">
          Elimina las filas para siempre
        </span>
      </div>

      <h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-enter animate-enter-1">
        TuTurno
      </h1>

      <p class="text-xl md:text-2xl text-[--text-secondary] mb-8 animate-enter animate-enter-2">
        Solicita turnos digitales desde cualquier dispositivo.<br class="hidden md:block" />
        Sin filas, sin esperar.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-enter animate-enter-3">
        <NuxtLink
          to="/auth/register"
          class="px-8 py-4 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg"
          style="--tw-shadow-color: var(--color-primary);"
        >
          Comenzar ahora
        </NuxtLink>
        <NuxtLink
          to="#como-funciona"
          class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
        >
          Como funciona
        </NuxtLink>
      </div>

      <div class="mt-16 animate-enter animate-enter-4">
        <div class="flex items-center justify-center gap-8 text-[--text-secondary]">
          <div class="text-center">
            <div class="text-3xl font-bold text-white">10K+</div>
            <div class="text-sm">Turnos dados</div>
          </div>
          <div class="w-px h-12 bg-white/20"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">50+</div>
            <div class="text-sm">Entidades</div>
          </div>
          <div class="w-px h-12 bg-white/20"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">5min</div>
            <div class="text-sm">Tiempo promedio</div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[--bg-base] to-transparent"></div>
  </section>
</template>