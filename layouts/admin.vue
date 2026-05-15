<script setup lang="ts">
import tuturnoLogoUrl from '~/assets/images/tuturno-logo.svg?url'

const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-[--bg-base] flex">
    <aside class="w-64 glass border-r border-white/10 p-6">
      <div class="mb-8 flex items-center gap-3">
          <img :src="tuturnoLogoUrl" alt="TuTurno" class="w-10 h-10 object-contain" draggable="false">
          <div>
            <h1 class="text-xl font-logo font-bold text-white">TuTurno</h1>
            <p class="text-sm text-[--text-secondary]">Administración</p>
          </div>
        </div>

      <nav class="space-y-2">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          active-class="bg-primary/20"
        >
          📊 Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/entities"
          class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          active-class="bg-primary/20"
        >
          🏢 Entidades
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-6 border-t border-white/10">
        <div class="mb-4">
          <p class="text-sm text-white">{{ user?.fullName }}</p>
          <p class="text-xs text-[--text-muted]">Administrador</p>
        </div>
        <button
          class="w-full px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          @click="handleLogout"
        >
          Salir
        </button>
      </div>
    </aside>

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>