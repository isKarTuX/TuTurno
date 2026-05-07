<script setup lang="ts">
const notifications = [
  {
    title: 'Turno llamado',
    message: 'A-003 - Preséntese al puesto 3',
    time: 'Hace 2 min',
    icon: '📢',
  },
  {
    title: 'Te quedan 3 turnos',
    message: 'Tu turno A-005 está próximo',
    time: 'Hace 5 min',
    icon: '⏰',
  },
  {
    title: 'Turno completado',
    message: 'A-002 fue atentido exitosamente',
    time: 'Hace 8 min',
    icon: '✅',
  },
]
</script>

<template>
  <section class="py-24 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Actualizaciones en tiempo real
        </h2>
        <p class="text-[--text-secondary] text-lg max-w-2xl mx-auto">
          Siempre sabrás en qué posición estás y cuándo es tu turno
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div class="order-2 lg:order-1">
          <div class="relative">
            <div class="glass p-6 rounded-2xl">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-white font-medium">Notificaciones en vivo</span>
              </div>

              <div class="space-y-4">
                <div
                  v-for="notification in notifications"
                  :key="notification.title"
                  class="flex items-start gap-4 p-4 bg-white/5 rounded-xl"
                >
                  <div class="text-2xl">{{ notification.icon }}</div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <p class="text-white font-medium">{{ notification.title }}</p>
                      <span class="text-xs text-[--text-muted]">{{ notification.time }}</span>
                    </div>
                    <p class="text-sm text-[--text-secondary]">{{ notification.message }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div class="order-1 lg:order-2 text-center lg:text-left">
          <div class="text-6xl mb-6">📱</div>
          <h3 class="text-2xl font-display font-bold text-white mb-4">
            Notificaciones push
          </h3>
          <p class="text-[--text-secondary] mb-6">
            Recibe alertas cuando te falten pocos turnos para ser atendido.
            No más estar pendiente del pantalla constantemente.
          </p>
          <ul class="space-y-3 text-[--text-secondary]">
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              Alertas cuando te llaman
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              Recordatorio cuando te faltan 3 turnos
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-400">✓</span>
              Confirmación al completar tu turno
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>