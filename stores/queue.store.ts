import { defineStore } from 'pinia'
import type { Turn } from '~/types'

interface QueueState {
  queue: Turn[]
  calledTurn: Turn | null
  attendingTurn: Turn | null
  serviceId: string | null
}

export const useQueueStore = defineStore('queue', {
  state: (): QueueState => ({
    queue: [],
    calledTurn: null,
    attendingTurn: null,
    serviceId: null,
  }),

  getters: {
    waitingCount: (state) => state.queue.length,
    hasQueue: (state) => state.queue.length > 0,
  },

  actions: {
    setQueue(queue: Turn[]) {
      this.queue = queue
    },

    setCalledTurn(turn: Turn | null) {
      this.calledTurn = turn
    },

    setAttendingTurn(turn: Turn | null) {
      this.attendingTurn = turn
    },

    setServiceId(serviceId: string | null) {
      this.serviceId = serviceId
    },

    async fetchQueue(serviceId: string) {
      this.serviceId = serviceId
      try {
        const result = await $fetch(`/api/services/${serviceId}/queue`) as { success: boolean; data: any }
        if (result.success) {
          this.queue = result.data.queue || []
          this.calledTurn = result.data.calledTurn || null
          this.attendingTurn = result.data.currentTurn || null
        }
      } catch (error) {
        console.error('Failed to fetch queue:', error)
      }
    },

    removeFromQueue(turnId: string) {
      this.queue = this.queue.filter((t) => t.id !== turnId)
    },

    addToQueue(turn: Turn) {
      this.queue.push(turn)
    },

    reset() {
      this.queue = []
      this.calledTurn = null
      this.attendingTurn = null
      this.serviceId = null
    },
  },
})