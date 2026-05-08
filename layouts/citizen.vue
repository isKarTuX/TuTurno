<script setup lang="ts">
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-[--bg-base] flex flex-col">
    <nav class="glass sticky top-0 z-50 px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <NuxtLink to="/app" class="text-xl font-display font-bold text-white">
          TuTurno
        </NuxtLink>

        <div class="flex items-center gap-4">
          <span class="text-sm text-[--text-secondary]">{{ user?.fullName }}</span>
          <button
            class="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            @click="handleLogout"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-4xl mx-auto w-full p-6 pb-24 md:pb-6">
      <slot />
    </main>

    <AppMobileNav />
  </div>
</template>