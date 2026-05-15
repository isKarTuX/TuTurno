import { useQueueStore } from '~/stores/queue.store'
import { WS_EVENTS } from '~/constants/ws.constants'
import type { Turn } from '~/types'

export function useTurnRealtime(turnId: Ref<string>, serviceId: Ref<string>) {
  const queueStore = useQueueStore()
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  let ws: WebSocket | null = null
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

  function connect() {
    if (import.meta.server) return
    if (ws?.readyState === WebSocket.OPEN) return

    const config = useRuntimeConfig()
    const wsUrl = config.public.wsUrl || 'ws://localhost:3000'
    const params = new URLSearchParams()

    if (serviceId.value) params.set('serviceId', serviceId.value)

    const fullUrl = `${wsUrl}/_ws?${params.toString()}`

    try {
      ws = new WebSocket(fullUrl)

      ws.onopen = () => {
        isConnected.value = true
        reconnectAttempts.value = 0
      }

      ws.onclose = () => {
        isConnected.value = false
        scheduleReconnect()
      }

      ws.onerror = (error) => {
        console.error('Turn Realtime WS error:', error)
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WS message:', error)
        }
      }
    } catch (error) {
      console.error('Failed to connect Turn Realtime WS:', error)
      scheduleReconnect()
    }
  }

  function scheduleReconnect() {
    if (reconnectAttempts.value >= maxReconnectAttempts) return
    if (reconnectTimeout) clearTimeout(reconnectTimeout)

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 16000)
    reconnectAttempts.value++

    reconnectTimeout = setTimeout(() => {
      connect()
    }, delay)
  }

  function disconnect() {
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    ws?.close()
    ws = null
    isConnected.value = false
  }

  function handleMessage(message: { type: string; payload: Record<string, unknown> }) {
    const { type, payload } = message

    switch (type) {
      case WS_EVENTS.QUEUE_UPDATED: {
        if (payload.queue) {
          queueStore.setQueue(payload.queue as Turn[])
        }
        if (payload.calledTurn !== undefined) {
          queueStore.setCalledTurn(payload.calledTurn as Turn | null)
        }
        break
      }

      case WS_EVENTS.TURN_CALLED: {
        const turn = payload.turn as Turn | undefined
        if (turn?.citizenId) {
          queueStore.setCalledTurn(turn)
        }
        break
      }

      case WS_EVENTS.YOUR_TURN_SOON:
        break

      case WS_EVENTS.YOUR_TURN:
        break

      case WS_EVENTS.SERVICE_PAUSED:
        break

      case WS_EVENTS.SERVICE_RESUMED:
        break
    }
  }

  onMounted(() => {
    connect()
  })

  onBeforeUnmount(() => {
    disconnect()
  })

  watch([turnId, serviceId], () => {
    disconnect()
    connect()
  })

  return {
    isConnected,
    connect,
    disconnect,
  }
}