import { useQueueStore } from '~/stores/queue.store'
import { useTurnStore } from '~/stores/turn.store'
import { WS_EVENTS } from '~/constants/ws.constants'
import type { Turn } from '~/types'

export function useTurnQueue() {
  const queueStore = useQueueStore()
  const turnStore = useTurnStore()

  async function fetchQueueForService(serviceId: string) {
    await queueStore.fetchQueue(serviceId)
  }

  function subscribeToQueueUpdates(serviceId: string, userId: string) {
    const ws = useWebSocket()
    ws.connect(serviceId, userId)

    ws.on(WS_EVENTS.QUEUE_UPDATED, (payload: any) => {
      if (payload.queue) queueStore.setQueue(payload.queue)
      if (payload.calledTurn !== undefined) queueStore.setCalledTurn(payload.calledTurn)
      if (payload.waitingCount !== undefined) {
        queueStore.setServiceId(serviceId)
      }
    })

    ws.on(WS_EVENTS.TURN_CALLED, (payload: any) => {
      if (payload.turn?.citizenId === userId) {
        turnStore.currentTurn = payload.turn
        queueStore.setCalledTurn(payload.turn)
      }
    })

    ws.on(WS_EVENTS.YOUR_TURN, (payload: any) => {
      turnStore.currentTurn = payload.turn
    })

    return () => {
      ws.disconnect()
    }
  }

  function getPositionAhead(turnId: string): number {
    const index = queueStore.queue.findIndex(t => t.id === turnId)
    return index >= 0 ? index + 1 : 0
  }

  function getEstimatedWaitTime(turn: Turn, avgAttentionTime: number): number {
    const position = getPositionAhead(turn.id)
    return position * avgAttentionTime
  }

  return {
    queue: computed(() => queueStore.queue),
    calledTurn: computed(() => queueStore.calledTurn),
    attendingTurn: computed(() => queueStore.attendingTurn),
    waitingCount: computed(() => queueStore.waitingCount),
    fetchQueueForService,
    subscribeToQueueUpdates,
    getPositionAhead,
    getEstimatedWaitTime,
  }
}