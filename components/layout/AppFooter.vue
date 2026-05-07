<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="py-6 border-t border-white/10 text-center text-sm text-[--text-secondary]">
    <p>&copy; {{ currentYear }} TuTurno - Universidad de Córdoba</p>
    <p class="mt-1">Montería, Córdoba - Colombia</p>
  </footer>
</template>