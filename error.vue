<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const handleError = useError()

function goHome() {
  handleError.value = null
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-[--bg-base] flex items-center justify-center p-6">
    <div class="glass p-12 rounded-2xl text-center max-w-md">
      <div class="text-6xl mb-6">
        {{ error.statusCode === 404 ? '🔍' : '💥' }}
      </div>

      <div class="text-6xl font-display font-bold text-primary mb-4">
        {{ error.statusCode }}
      </div>

      <h1 class="text-xl font-semibold text-white mb-2">
        {{ error.statusCode === 404 ? 'Página no encontrada' : 'Algo salió mal' }}
      </h1>

      <p class="text-[--text-secondary] mb-8">
        {{ error.statusCode === 404
          ? 'La página que buscas no existe o ha sido movida.'
          : error.message || 'Ha ocurrido un error inesperado.' }}
      </p>

      <button
        class="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
        @click="goHome"
      >
        Volver al inicio
      </button>
    </div>
  </div>
</template>