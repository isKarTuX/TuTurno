<script setup lang="ts">
const { user, logout } = useAuth()

const route = useRoute()

async function handleLogout() {
  await logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-[--bg-base] flex">
    <aside class="hidden lg:flex flex-col w-64 glass border-r border-white/10 p-6 fixed h-screen">
      <div class="mb-8">
        <NuxtLink to="/operator" class="flex items-center gap-3">
          <img src="/icons/tuturno-logo.svg" alt="TuTurno" class="w-10 h-10 object-contain" draggable="false">
          <div>
            <h1 class="text-lg font-bold text-white">TuTurno</h1>
            <p class="text-xs text-[--text-muted]">Panel Operador</p>
          </div>
        </NuxtLink>
      </div>

      <nav class="space-y-1 flex-1">
        <NuxtLink
          to="/operator"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="route.path === '/operator'
            ? 'bg-[--color-primary]/15 text-[--color-primary]'
            : 'text-[--text-secondary] hover:text-white hover:bg-white/5'"
        >
          <Icon name="lucide:layout-dashboard" class="w-5 h-5" />
          Inicio
        </NuxtLink>
        <NuxtLink
          to="/operator/stats"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="route.path === '/operator/stats'
            ? 'bg-[--color-primary]/15 text-[--color-primary]'
            : 'text-[--text-secondary] hover:text-white hover:bg-white/5'"
        >
          <Icon name="lucide:bar-chart-3" class="w-5 h-5" />
          Estadísticas
        </NuxtLink>
        <NuxtLink
          to="/operator/citizens"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="route.path.startsWith('/operator/citizens')
            ? 'bg-[--color-primary]/15 text-[--color-primary]'
            : 'text-[--text-secondary] hover:text-white hover:bg-white/5'"
        >
          <Icon name="lucide:users" class="w-5 h-5" />
          Ciudadanos
        </NuxtLink>
      </nav>

      <div class="pt-6 border-t border-white/10">
        <div class="flex items-center gap-3 px-4 py-3 mb-3">
          <div class="w-9 h-9 rounded-full bg-[--color-primary]/20 flex items-center justify-center shrink-0">
            <span class="text-sm font-bold text-[--color-primary]">
              {{ user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'OP' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user?.fullName?.split(' ')[0] }}</p>
            <p class="text-xs text-[--text-muted] truncate">Operador</p>
          </div>
        </div>
        <button
          class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-[--text-secondary] hover:text-white hover:bg-white/5 transition-all duration-200"
          @click="handleLogout"
        >
          <Icon name="lucide:log-out" class="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 p-6 lg:ml-64">
      <slot />
    </main>
  </div>
</template>