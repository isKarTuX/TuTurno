import { useRuntimeConfig } from '#imports'

export function useWebSocket() {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  const eventHandlers = new Map<string, Set<(data: any) => void>>()

  function connect(serviceId?: string, userId?: string) {
    if (ws.value?.readyState === WebSocket.OPEN) return

    const config = useRuntimeConfig()
    const params = new URLSearchParams()
    if (serviceId) params.set('serviceId', serviceId)
    if (userId) params.set('userId', userId)

    const wsUrl = `${config.public.wsUrl}/_ws?${params.toString()}`
    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    }

    ws.value.onclose = () => {
      isConnected.value = false
      scheduleReconnect(serviceId, userId)
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.value.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        const { type, payload } = message
        const handlers = eventHandlers.get(type)
        if (handlers) {
          handlers.forEach((handler) => handler(payload))
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }
  }

  function scheduleReconnect(serviceId?: string, userId?: string) {
    if (reconnectAttempts.value >= maxReconnectAttempts) return
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 16000)
    reconnectAttempts.value++
    setTimeout(() => connect(serviceId, userId), delay)
  }

  function disconnect() {
    ws.value?.close()
    ws.value = null
    isConnected.value = false
  }

  function on(event: string, handler: (data: any) => void) {
    if (!eventHandlers.has(event)) {
      eventHandlers.set(event, new Set())
    }
    eventHandlers.get(event)!.add(handler)
  }

  function off(event: string, handler: (data: any) => void) {
    eventHandlers.get(event)?.delete(handler)
  }

  function send(data: { type: string; payload?: any }) {
    if (ws.value?.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(data))
    }
  }

  return {
    isConnected,
    connect,
    disconnect,
    on,
    off,
    send,
  }
}