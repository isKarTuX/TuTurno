<script setup lang="ts">
</script>

<template>
  <section class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <div class="glass p-12 md:p-16 rounded-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-[--color-primary]/20 to-[--color-accent]/10"></div>

        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Listo para eliminar las filas?
          </h2>
          <p class="text-[--text-secondary] text-lg mb-8 max-w-2xl mx-auto">
            Unete a las miles de personas que ya disfrutan de una atencion sin filas.
            Registrate gratis en menos de un minuto.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/auth/register"
              class="px-8 py-4 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-xl transition-all hover:scale-105"
              style="--tw-shadow-color: var(--color-primary);"
            >
              Crear cuenta gratis
            </NuxtLink>
            <NuxtLink
              to="/auth/login"
              class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
            >
              Ya tengo cuenta
            </NuxtLink>
          </div>

          <p class="mt-8 text-sm text-[--text-muted]">
            Para entidades que quieran ofrecer este servicio,
            <NuxtLink to="/auth/register?role=operator" class="text-[--color-primary] hover:underline">
              registra tu entidad aqui
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>