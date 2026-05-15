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

async function handleUpdate(field: string, value: string) {
  try {
    await $fetch('/api/users/profile', {
      method: 'PATCH',
      body: { [field]: value },
    })
  } catch {
    // Error silently handled
  }
}
</script>

<template>
  <div class="space-y-6 pb-24 lg:pb-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-display font-bold text-white">Mi Perfil</h1>
    </div>

    <ProfileCard v-if="user" :user="user" @update="handleUpdate" />

    <NotificationSettings />

    <div class="glass rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Acciones</h3>
      <div class="space-y-3">
        <NuxtLink
          to="/app/settings"
          class="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Icon name="lucide:settings" class="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p class="font-medium text-white">Configuración</p>
              <p class="text-sm text-white/50">Tema, notificaciones y más</p>
            </div>
          </div>
          <Icon name="lucide:chevron-right" class="w-5 h-5 text-white/30" />
        </NuxtLink>

        <button
          type="button"
          class="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
          @click="handleLogout"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Icon name="lucide:log-out" class="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p class="font-medium text-red-400">Cerrar sesión</p>
              <p class="text-sm text-white/30">Salir de tu cuenta</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>