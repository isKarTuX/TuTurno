<script setup lang="ts">
const route = useRoute()
const { user, logout } = useAuth()

const props = defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const isCollapsed = computed({
  get: () => props.collapsed ?? false,
  set: (val) => emit('update:collapsed', val),
})

const showUserMenu = ref(false)

interface NavItem {
  to: string
  label: string
  icon: string
  badge?: number
}

const navItems: NavItem[] = [
  { to: '/app', label: 'Inicio', icon: 'lucide:home' },
  { to: '/app/entities', label: 'Entidades', icon: 'lucide:building-2' },
  { to: '/app/turns', label: 'Mis Turnos', icon: 'lucide:ticket' },
  { to: '/app/profile', label: 'Mi Perfil', icon: 'lucide:user' },
  { to: '/app/settings', label: 'Configuración', icon: 'lucide:settings' },
]

const isActive = (path: string): boolean => {
  if (path === '/app') {
    return route.path === '/app'
  }
  return route.path.startsWith(path)
}

async function handleLogout() {
  showUserMenu.value = false
  await logout()
  navigateTo('/auth/login')
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside
    :class="[
      'hidden lg:flex flex-col h-screen fixed left-0 top-0 glass border-r border-white/10 z-40 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <div class="p-4 border-b border-white/10">
      <div class="flex items-center gap-3">
        <button
          class="w-10 h-10 rounded-xl bg-[--color-primary] flex items-center justify-center shrink-0 hover:bg-[--color-primary-dark] transition-colors"
          @click="toggleCollapse"
        >
          <Icon name="lucide:menu" class="w-5 h-5 text-white" />
        </button>
        <div v-if="!isCollapsed" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[--color-primary] flex items-center justify-center">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <span class="text-lg font-bold text-white">TuTurno</span>
            <p class="text-[10px] uppercase tracking-[0.15em] text-[--text-muted]">Ciudadano</p>
          </div>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
        :class="[
          isCollapsed ? 'justify-center px-2' : '',
          isActive(item.to)
            ? 'bg-[--color-primary]/15 text-[--color-primary]'
            : 'text-[--text-secondary] hover:text-white hover:bg-white/5'
        ]"
      >
        <Icon :name="item.icon" class="text-xl w-5 h-5 shrink-0" />
        <span v-if="!isCollapsed" class="flex-1">{{ item.label }}</span>
        <span
          v-if="item.badge && !isCollapsed"
          class="ml-auto text-xs px-2 py-0.5 rounded-full bg-[--color-primary]/20 text-[--color-primary]"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-white/10">
      <div v-if="!isCollapsed" class="mb-3">
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="w-9 h-9 rounded-full bg-[--color-primary]/20 flex items-center justify-center shrink-0">
            <span class="text-sm font-bold text-[--color-primary]">
              {{ user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user?.fullName?.split(' ')[0] }}</p>
            <p class="text-xs text-[--text-muted] truncate">{{ user?.email }}</p>
          </div>
          <button
            class="p-1.5 rounded-lg text-[--text-muted] hover:text-white hover:bg-white/10 transition-colors"
            @click="showUserMenu = !showUserMenu"
          >
            <Icon name="lucide:more-vertical" class="w-4 h-4" />
          </button>
        </div>

        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-150"
          enter-from-class="opacity-0 -translate-y-2"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="showUserMenu" class="mt-2 p-2 glass rounded-xl border border-white/10 space-y-1">
            <NuxtLink
              to="/app/profile"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[--text-secondary] hover:text-white hover:bg-white/5 transition-colors"
              @click="showUserMenu = false"
            >
              <Icon name="lucide:user" class="w-4 h-4" />
              Mi Perfil
            </NuxtLink>
            <NuxtLink
              to="/app/settings"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[--text-secondary] hover:text-white hover:bg-white/5 transition-colors"
              @click="showUserMenu = false"
            >
              <Icon name="lucide:settings" class="w-4 h-4" />
              Configuración
            </NuxtLink>
            <hr class="border-white/10 my-2">
            <button
              type="button"
              class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              @click="handleLogout"
            >
              <Icon name="lucide:log-out" class="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </Transition>
      </div>

      <button
        v-if="isCollapsed"
        type="button"
        class="flex items-center justify-center w-full px-4 py-3 rounded-xl text-[--text-secondary] hover:text-white hover:bg-white/5 transition-all duration-200"
        @click="handleLogout"
      >
        <Icon name="lucide:log-out" class="text-xl w-5 h-5" />
      </button>

      <button
        v-else
        type="button"
        class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-[--text-secondary] hover:text-white hover:bg-white/5 transition-all duration-200"
        @click="handleLogout"
      >
        <Icon name="lucide:log-out" class="text-xl w-5 h-5" />
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>