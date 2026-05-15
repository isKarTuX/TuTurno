<script setup lang="ts">
definePageMeta({
  layout: 'citizen',
})

const route = useRoute()

const turnNumber = route.query.turn as string
const queuePosition = route.query.position as string
const documentId = route.query.documentId as string
const entityId = route.params.id as string

const { data: entityData } = await useAsyncData(
  `entity-${entityId}`,
  () => $fetch(`/api/entities/${entityId}`) as Promise<{ success: boolean; data: { name: string } }>
)

const entityName = computed(() => entityData.value?.data?.name || 'Entidad')

const qrDataUrl = ref<string>('')
const searchParams = ref({ documentId: '', turnNumber: '' })

onMounted(async () => {
  try {
    const QRCode = await import('qrcode')
    const qrData = JSON.stringify({
      turnNumber,
      queuePosition,
      documentId,
    })
    qrDataUrl.value = await QRCode.default.toDataURL(qrData, {
      width: 180,
      margin: 2,
      color: {
        dark: '#6C3AE8',
        light: '#00000000',
      },
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
})
</script>

<template>
  <div class="space-y-4">
    <NuxtLink :to="`/app/entities/${entityId}`" class="text-xs uppercase tracking-[0.2em] text-[--text-muted] hover:text-white inline-flex items-center gap-2">
      <Icon name="lucide:chevron-left" class="w-4 h-4" />
      Volver a servicios
    </NuxtLink>

    <div class="glass p-6 rounded-xl text-center">
      <div class="mb-6">
        <div class="text-sm text-[--text-secondary] mb-1">Tu turno</div>
        <div class="text-5xl font-display font-bold text-primary turn-flip">{{ turnNumber }}</div>
      </div>

      <div v-if="qrDataUrl" class="mx-auto mb-6">
        <img :src="qrDataUrl" alt="Código QR del turno" class="mx-auto" >
      </div>
      <div v-else class="h-[180px] flex items-center justify-center mb-6">
        <div class="skeleton h-[180px] w-[180px] rounded-lg"/>
      </div>

      <div class="bg-white/5 rounded-lg p-4 space-y-3 text-left mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Estado:</span>
          <span class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">En espera</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Posición en cola:</span>
          <span class="text-white font-medium">#{{ queuePosition }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-[--text-secondary]">Entidad:</span>
          <span class="text-white">{{ entityName }}</span>
        </div>
      </div>

      <div class="border-t border-white/10 pt-6 space-y-4">
        <p class="text-[--text-muted] text-sm">
          Anota tu número de turno o guarda este código QR. Te avisaremos cuando sea tu turno.
        </p>
      </div>
    </div>

    <div class="glass p-6 rounded-xl">
      <h3 class="text-white font-semibold mb-4 text-center">Sigue tu turno</h3>
      <div class="flex gap-3">
        <input
          v-model="searchParams.documentId"
          type="text"
          inputmode="numeric"
          placeholder="Tu cédula"
          class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide font-sans focus:outline-none transition-all border-white/10 focus:border-primary/50"
        >
        <input
          v-model="searchParams.turnNumber"
          type="text"
          placeholder="Ej: A-001"
          class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide font-sans uppercase focus:outline-none transition-all border-white/10 focus:border-primary/50"
        >
      </div>
      <p class="text-[--text-muted] text-xs mt-3 text-center">
        Ingresa tu cédula y número de turno para ver el estado actual
      </p>
      <NuxtLink
        :to="`/app/track?documentId=${searchParams.documentId}&turnNumber=${searchParams.turnNumber}`"
        class="mt-4 w-full"
      >
        <UiButton class="w-full">
          <Icon name="lucide:search" class="w-4 h-4" />
          Consultar turno
        </UiButton>
      </NuxtLink>
    </div>

    <div class="glass p-6 rounded-xl">
      <p class="text-[--text-muted] text-sm mb-4 text-center">
        ¿Quieres recibir notificaciones y más funcionalidades?
      </p>
      <NuxtLink to="/auth/register" class="block">
        <UiButton variant="outline" class="w-full">
          <Icon name="user-plus" class="w-4 h-4" />
          Crear cuenta gratis
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>