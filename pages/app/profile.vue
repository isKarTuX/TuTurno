<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-display font-bold text-white">Mi Perfil</h1>

    <UiCard class="space-y-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-[--color-primary] flex items-center justify-center text-2xl font-bold text-white">
          {{ user?.fullName?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h2 class="text-xl font-semibold text-white">{{ user?.fullName }}</h2>
          <p class="text-[--text-secondary]">{{ user?.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div>
          <p class="text-sm text-[--text-muted]">Cédula</p>
          <p class="text-white">{{ user?.documentId }}</p>
        </div>
        <div>
          <p class="text-sm text-[--text-muted]">Teléfono</p>
          <p class="text-white">{{ user?.phone }}</p>
        </div>
        <div>
          <p class="text-sm text-[--text-muted]">Rol</p>
          <UiBadge variant="info">{{ user?.role }}</UiBadge>
        </div>
        <div>
          <p class="text-sm text-[--text-muted]">Estado</p>
          <UiBadge :variant="user?.isActive ? 'success' : 'error'">
            {{ user?.isActive ? 'Activo' : 'Inactivo' }}
          </UiBadge>
        </div>
      </div>
    </UiCard>

    <div class="flex justify-end">
      <UiButton variant="outline" @click="handleLogout">
        Cerrar sesión
      </UiButton>
    </div>
  </div>
</template>