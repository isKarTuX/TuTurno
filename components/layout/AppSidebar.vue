<script setup lang="ts">
interface Props {
  items: Array<{
    label: string
    to: string
    icon?: string
    active?: boolean
  }>
}

defineProps<Props>()
</script>

<template>
  <aside class="w-64 glass border-r border-white/10 p-6 flex flex-col h-full">
    <div class="mb-8">
      <slot name="header" />
    </div>

    <nav class="flex-1 space-y-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
        active-class="bg-primary/20"
      >
        <span v-if="item.icon" class="text-lg">{{ item.icon }}</span>
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="mt-auto pt-6 border-t border-white/10">
      <slot name="footer" />
    </div>
  </aside>
</template>