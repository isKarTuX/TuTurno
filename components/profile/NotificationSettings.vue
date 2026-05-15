<script setup lang="ts">
const pushEnabled = ref(false)
const emailEnabled = ref(false)
const isLoading = ref(false)

const pushNotifications = usePushNotifications()

pushEnabled.value = pushNotifications.isSubscribed.value

async function togglePush() {
  isLoading.value = true
  try {
    if (pushEnabled.value) {
      await pushNotifications.disable()
    } else {
      await pushNotifications.enable()
    }
    pushEnabled.value = pushNotifications.isSubscribed.value
  } finally {
    isLoading.value = false
  }
}

function toggleEmail() {
  emailEnabled.value = !emailEnabled.value
}
</script>

<template>
  <div class="glass rounded-2xl p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Notificaciones</h3>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-white font-medium">Notificaciones push</p>
          <p class="text-sm text-white/50">Recibe alertas cuando te llamen</p>
        </div>
        <UiToggle
          v-model="pushEnabled"
          :disabled="isLoading"
          @change="togglePush"
        />
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-white font-medium">Correo electrónico</p>
          <p class="text-sm text-white/50">Resumen diario de turnos</p>
        </div>
        <UiToggle v-model="emailEnabled" @change="toggleEmail" />
      </div>
    </div>

    <div
      v-if="!pushEnabled"
      class="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
    >
      <p class="text-sm text-amber-400">
        Activa las notificaciones push para recibir alertas en tiempo real.
      </p>
      <UiButton variant="outline" size="sm" class="mt-2" @click="pushNotifications.enable">
        Activar notificaciones
      </UiButton>
    </div>
  </div>
</template>