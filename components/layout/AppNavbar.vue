<script setup lang="ts">
const { isAuthenticated } = useAuth()
const { user } = useAuth()
</script>

<template>
  <header class="glass sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-display font-bold text-white">
          TuTurno
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/#como-funciona" class="text-sm text-[--text-secondary] hover:text-white transition-colors">
            Cómo funciona
          </NuxtLink>
          <NuxtLink to="/#para-entidades" class="text-sm text-[--text-secondary] hover:text-white transition-colors">
            Para entidades
          </NuxtLink>

          <div v-if="isAuthenticated" class="flex items-center gap-4">
            <NuxtLink to="/app/entities" class="text-sm text-[--text-secondary] hover:text-white transition-colors">
              Entidades
            </NuxtLink>
            <NuxtLink to="/app/turns" class="text-sm text-[--text-secondary] hover:text-white transition-colors">
              Mis turnos
            </NuxtLink>
            <span class="text-sm text-[--text-secondary]">{{ user?.fullName }}</span>
          </div>

          <div v-else class="flex items-center gap-3">
            <NuxtLink
              to="/auth/login"
              class="px-4 py-2 text-sm text-white hover:text-primary transition-colors"
            >
              Iniciar sesión
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              Registrarse
            </NuxtLink>
          </div>
        </nav>

        <button class="md:hidden text-white p-2">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>