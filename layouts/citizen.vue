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
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/app" class="text-xl font-display font-bold text-white">
            TuTurno
          </NuxtLink>
          <span class="hidden md:inline-flex text-xs uppercase tracking-[0.2em] text-[--text-muted]">
            Ciudadano
          </span>
        </div>

        <div class="flex items-center gap-3">
          <span class="hidden sm:inline-flex text-sm text-[--text-secondary]">{{ user?.fullName }}</span>
          <UiButton variant="ghost" size="sm" class="px-3" @click="handleLogout">
            Salir
          </UiButton>
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-5xl mx-auto w-full px-6 py-4 pb-24 md:pb-6">
      <slot />
    </main>

    <AppMobileNav />
  </div>
</template>
