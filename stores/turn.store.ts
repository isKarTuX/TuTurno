import { defineStore } from 'pinia'
import type { Turn } from '~/types'

export const useTurnStore = defineStore('turn', () => {
  const turns = ref<Turn[]>([])
  const currentTurn = ref<Turn | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeTurns = computed(() =>
    turns.value.filter(t => ['waiting', 'called', 'attending'].includes(t.status))
  )

  const completedTurns = computed(() =>
    turns.value.filter(t => ['completed', 'no_show', 'cancelled'].includes(t.status))
  )

  async function fetchMyTurns() {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/turns/my') as { success: boolean; data: Turn[] }
      if (response.success) {
        turns.value = response.data
      }
    } catch {
      error.value = 'Error al cargar turnos'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTurnById(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch(`/api/turns/${id}`) as { success: boolean; data: Turn }
      if (response.success) {
        currentTurn.value = response.data
        return response.data
      }
    } catch {
      error.value = 'Turno no encontrado'
    } finally {
      isLoading.value = false
    }
    return null
  }

  async function createTurn(serviceId: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/turns', {
        method: 'POST',
        body: { serviceId },
      }) as { success: boolean; data: Turn }
      if (response.success) {
        turns.value.unshift(response.data)
        return response.data
      }
    } catch {
      error.value = 'Error al crear turno'
    } finally {
      isLoading.value = false
    }
    return null
  }

  async function cancelTurn(id: string) {
    try {
      const response = await $fetch(`/api/turns/${id}`, {
        method: 'DELETE',
      }) as { success: boolean }
      if (response.success) {
        const turn = turns.value.find(t => t.id === id)
        if (turn) turn.status = 'cancelled'
        if (currentTurn.value?.id === id) currentTurn.value = null
        return true
      }
    } catch {
      error.value = 'Error al cancelar turno'
    }
    return false
  }

  function clearCurrentTurn() {
    currentTurn.value = null
  }

  return {
    turns,
    currentTurn,
    isLoading,
    error,
    activeTurns,
    completedTurns,
    fetchMyTurns,
    fetchTurnById,
    createTurn,
    cancelTurn,
    clearCurrentTurn,
  }
})