<script setup lang="ts">
const { user, logout } = useAuth()
const isAuthenticated = computed(() => !!user.value)

const sidebarCollapsed = ref(false)

async function handleLogout() {
  await logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-[--bg-base] flex flex-col lg:flex-row">
    <AppSidebarCitizen v-model:collapsed="sidebarCollapsed" />

    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'"
    >
      <header class="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4">
        <div class="max-w-5xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/app" class="flex items-center gap-2">
              <img src="/icons/tuturno-logo.svg" alt="TuTurno" class="w-8 h-8 object-contain" draggable="false">
              <span class="text-xl font-bold text-white">TuTurno</span>
            </NuxtLink>
            <span class="hidden md:inline-flex text-xs uppercase tracking-[0.2em] text-[--text-muted]">
              {{ isAuthenticated ? 'Ciudadano' : 'Turnos' }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <UiThemeToggle />
            <template v-if="isAuthenticated">
              <span class="hidden sm:inline-flex text-sm text-[--text-secondary]">{{ user?.fullName }}</span>
              <UiButton variant="ghost" size="sm" class="px-3" @click="handleLogout">
                Salir
              </UiButton>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login">
                <UiButton variant="ghost" size="sm" class="px-3">
                  Iniciar sesión
                </UiButton>
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <UiButton size="sm" class="px-3">
                  Crear cuenta
                </UiButton>
              </NuxtLink>
            </template>
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-5xl mx-auto w-full px-6 py-4 pb-24 lg:pb-6">
        <slot />
      </main>

      <AppMobileNav />
    </div>
  </div>
</template>
