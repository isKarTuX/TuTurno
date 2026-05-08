import { useQueueStore } from '~/stores/queue.store'
import { WS_EVENTS } from '~/constants/ws.constants'
import type { Turn } from '~/types'

interface WSMessage {
  type: string
  payload: {
    queue?: Turn[]
    calledTurn?: Turn | null
    turn?: Turn
    [key: string]: unknown
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const queueStore = useQueueStore()

  const ws = ref<WebSocket | null>(null)
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5

  function connect(serviceId?: string, userId?: string) {
    if (import.meta.server) return

    const config = useRuntimeConfig()
    const wsUrl = config.public.wsUrl || `ws://localhost:3000`
    const params = new URLSearchParams()
    if (serviceId) params.set('serviceId', serviceId)
    if (userId) params.set('userId', userId)

    const fullUrl = `${wsUrl}/_ws?${params.toString()}`

    try {
      ws.value = new WebSocket(fullUrl)

      ws.value.onopen = () => {
        reconnectAttempts = 0
      }

      ws.value.onclose = () => {
        scheduleReconnect(serviceId, userId)
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WS message:', error)
        }
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      scheduleReconnect(serviceId, userId)
    }
  }

  function scheduleReconnect(serviceId?: string, userId?: string) {
    if (reconnectAttempts >= maxReconnectAttempts) return
    if (reconnectTimeout) clearTimeout(reconnectTimeout)

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 16000)
    reconnectAttempts++

    reconnectTimeout = setTimeout(() => {
      connect(serviceId, userId)
    }, delay)
  }

  function disconnect() {
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    ws.value?.close()
    ws.value = null
  }

  function handleMessage(message: WSMessage) {
    const { type, payload } = message

    switch (type) {
      case WS_EVENTS.QUEUE_UPDATED:
        if (payload.queue) queueStore.setQueue(payload.queue)
        if (payload.calledTurn !== undefined) queueStore.setCalledTurn(payload.calledTurn)
        break

      case WS_EVENTS.TURN_CALLED:
        if (payload.turn?.citizenId) {
          queueStore.setCalledTurn(payload.turn)
        }
        break

      case WS_EVENTS.YOUR_TURN:
        break

      case WS_EVENTS.SERVICE_PAUSED:
        break

      case WS_EVENTS.SERVICE_RESUMED:
        break
    }
  }

  nuxtApp.provide('ws', {
    connect,
    disconnect,
    isConnected: () => ws.value?.readyState === WebSocket.OPEN,
  })
})