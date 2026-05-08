<script setup lang="ts">
</script>

<template>
  <section class="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-indigo-500/20 rounded-full blur-3xl" />

    <div class="max-w-5xl mx-auto relative">
      <div class="relative p-8 lg:p-12 rounded-3xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-[--bg-surface] to-purple-600/10 rounded-3xl" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent rounded-3xl" />

        <div class="relative">
          <div class="text-center mb-10">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-medium uppercase tracking-wider mb-6">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Comienza hoy
            </span>

            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight">
              ¿Listo para dejar de esperar?
            </h2>

            <p class="text-lg lg:text-xl text-secondary max-w-2xl mx-auto mb-8">
              Crea tu cuenta en 30 segundos. Sin costo, sin compromiso.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink
              to="/auth/register"
              class="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-press"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark shadow-xl shadow-primary/40" />
              <div class="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span class="relative flex items-center gap-2">
                Solicitar mi turno
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </NuxtLink>

            <NuxtLink
              to="/auth/login"
              class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Iniciar sesión
            </NuxtLink>
          </div>

          <div class="text-center mt-10">
            <p class="text-sm text-muted">
              ¿Entidad u operador?
              <NuxtLink
                to="/auth/register?role=operator"
                class="text-primary-light hover:text-white font-medium transition-colors"
              >
                Solicitar demo personalizada →
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>