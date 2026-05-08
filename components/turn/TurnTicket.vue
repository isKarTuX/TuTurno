<script setup lang="ts">
import type { Turn } from '~/types'

interface Props {
  turn: Turn
}

const props = defineProps<Props>()

const qrDataUrl = ref<string>('')

onMounted(async () => {
  try {
    const QRCode = await import('qrcode')
    const qrData = JSON.stringify({
      id: props.turn.id,
      number: props.turn.turnNumber,
      status: props.turn.status,
    })
    qrDataUrl.value = await QRCode.default.toDataURL(qrData, {
      width: 200,
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

function formatDate(date: Date | string | null) {
  if (!date) return ''
  return new Date(date).toLocaleString('es-CO')
}
</script>

<template>
  <div class="glass p-6 rounded-xl text-center">
    <div class="mb-4">
      <div class="text-sm text-[--text-secondary] mb-1">Tu turno</div>
      <div class="text-5xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</div>
    </div>

    <div v-if="qrDataUrl" class="mx-auto mb-4">
      <img :src="qrDataUrl" alt="QR Code" class="mx-auto" >
    </div>
    <div v-else class="h-[200px] flex items-center justify-center mb-4">
      <div class="skeleton h-[200px] w-[200px] rounded-lg"/>
    </div>

    <div class="bg-white/5 rounded-lg p-3 space-y-2 text-left">
      <div class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Estado:</span>
        <TurnStatusBadge :status="turn.status" />
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Posición:</span>
        <span class="text-white">#{{ turn.queuePosition }}</span>
      </div>
      <div v-if="turn.service?.avgAttentionTime" class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Tiempo estimado:</span>
        <span class="text-white">~{{ turn.queuePosition * turn.service.avgAttentionTime }} min</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-[--text-secondary]">Fecha:</span>
        <span class="text-white text-xs">{{ formatDate(turn.createdAt) }}</span>
      </div>
    </div>

    <p class="text-xs text-[--text-muted] mt-4">
      Presenta este ticket en la entidad
    </p>
  </div>
</template>