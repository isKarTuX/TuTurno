<script setup lang="ts">
interface NavItem {
  to: string
  label: string
  icon: string
}

const route = useRoute()

const navItems: NavItem[] = [
  { to: '/app', label: 'Inicio', icon: 'lucide:home' },
  { to: '/app/entities', label: 'Entidades', icon: 'lucide:building-2' },
  { to: '/app/turns', label: 'Turnos', icon: 'lucide:ticket' },
  { to: '/app/profile', label: 'Perfil', icon: 'lucide:user' },
]

const isActive = (path: string): boolean => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 pb-safe lg:hidden">
    <div class="flex items-center justify-around py-2 px-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[50px]"
        :class="isActive(item.to)
          ? 'text-[--color-primary] bg-[--color-primary]/10'
          : 'text-[--text-muted] hover:text-[--text-secondary]'"
      >
        <Icon :name="item.icon" class="text-xl w-5 h-5" />
        <span class="text-[10px] font-medium tracking-wide">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>