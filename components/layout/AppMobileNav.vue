<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/app', label: 'Inicio', icon: '🏠' },
  { to: '/app/entities', label: 'Entidades', icon: '🏢' },
  { to: '/app/turns', label: 'Turnos', icon: '🎫' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 md:hidden">
    <div class="flex items-center justify-around py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors"
        :class="isActive(item.to) ? 'text-primary' : 'text-[--text-secondary] hover:text-white'"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span class="text-xs">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>