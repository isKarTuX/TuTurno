<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const { user } = useAuth()
</script>

<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-white mb-2">
      Bienvenido, {{ user?.fullName }}
    </h1>
    <p class="text-[--text-secondary] mb-8">
      Gestiona tus turnos y accede a entidades de atención.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink
        to="/app/entities"
        class="glass p-6 rounded-xl hover:bg-white/7 transition-all group"
      >
        <div class="text-3xl mb-3">🏢</div>
        <h2 class="text-lg font-semibold text-white group-hover:text-primary-light transition-colors">
          Buscar Entidades
        </h2>
        <p class="text-sm text-[--text-secondary] mt-1">
          Encuentra EPS, bancos y oficinas públicas
        </p>
      </NuxtLink>

      <NuxtLink
        to="/app/turns"
        class="glass p-6 rounded-xl hover:bg-white/7 transition-all group"
      >
        <div class="text-3xl mb-3">🎫</div>
        <h2 class="text-lg font-semibold text-white group-hover:text-primary-light transition-colors">
          Mis Turnos
        </h2>
        <p class="text-sm text-[--text-secondary] mt-1">
          Ver y gestionar tus turnos activos
        </p>
      </NuxtLink>
    </div>
  </div>
</template>