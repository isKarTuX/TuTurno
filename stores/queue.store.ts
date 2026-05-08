import { defineStore } from 'pinia'
import type { Turn } from '~/types'

export const useQueueStore = defineStore('queue', () => {
  const queue = ref<Turn[]>([])
  const calledTurn = ref<Turn | null>(null)
  const attendingTurn = ref<Turn | null>(null)
  const serviceId = ref<string | null>(null)

  const waitingCount = computed(() => queue.value.length)
  const hasQueue = computed(() => queue.value.length > 0)

  function setQueue(newQueue: Turn[]) {
    queue.value = newQueue
  }

  function setCalledTurn(turn: Turn | null) {
    calledTurn.value = turn
  }

  function setAttendingTurn(turn: Turn | null) {
    attendingTurn.value = turn
  }

  function setServiceId(id: string | null) {
    serviceId.value = id
  }

  async function fetchQueue(id: string) {
    serviceId.value = id
    try {
      const result = await $fetch(`/api/services/${id}/queue`) as { success: boolean; data: { queue: Turn[]; calledTurn: Turn | null; currentTurn: Turn | null } }
      if (result.success) {
        queue.value = result.data.queue || []
        calledTurn.value = result.data.calledTurn || null
        attendingTurn.value = result.data.currentTurn || null
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error)
    }
  }

  function removeFromQueue(turnId: string) {
    queue.value = queue.value.filter((t) => t.id !== turnId)
  }

  function addToQueue(turn: Turn) {
    queue.value.push(turn)
  }

  function reset() {
    queue.value = []
    calledTurn.value = null
    attendingTurn.value = null
    serviceId.value = null
  }

  return {
    queue,
    calledTurn,
    attendingTurn,
    serviceId,
    waitingCount,
    hasQueue,
    setQueue,
    setCalledTurn,
    setAttendingTurn,
    setServiceId,
    fetchQueue,
    removeFromQueue,
    addToQueue,
    reset,
  }
})