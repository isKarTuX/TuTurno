<script setup lang="ts">
import type { Component } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number | string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2,
})

function toPascalCase(str: string): string {
  return str.split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('')
}

const iconComponent = computed(() => {
  const name = props.name.replace(/^lucide:/, '')
  const pascalName = toPascalCase(name)
  return (LucideIcons as unknown as Record<string, Component>)[pascalName] || null
})
</script>

<template>
  <component
    :is="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    :class="className"
  />
</template>