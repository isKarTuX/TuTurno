import type { Turn } from '~/types'

export function useDocumentTurns() {
  const turns = ref<Turn[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchTurnsByDocument(documentId: string) {
    if (!documentId || documentId.length < 5) {
      error.value = 'Ingresa un número de cédula válido'
      return
    }

    pending.value = true
    error.value = null

    try {
      const cleanDoc = documentId.replace(/\D/g, '')
      const response = await $fetch('/api/turns/by-document', {
        query: { documentId: cleanDoc },
      }) as { success: boolean; data: { documentId: string; turns: Turn[] } }

      if (response.success) {
        turns.value = response.data.turns || []
      }
    } catch (err: unknown) {
      const fetchError = err as { data?: { error?: { message?: string } } }
      error.value = fetchError?.data?.error?.message || 'Error al cargar turnos'
      turns.value = []
    } finally {
      pending.value = false
    }
  }

  function clearTurns() {
    turns.value = []
    error.value = null
  }

  const activeTurns = computed(() =>
    turns.value.filter(t => ['waiting', 'called', 'attending'].includes(t.status))
  )

  const completedTurns = computed(() =>
    turns.value.filter(t => ['completed', 'no_show', 'cancelled'].includes(t.status))
  )

  const currentTurn = computed(() =>
    activeTurns.value.find(t => t.status === 'called' || t.status === 'attending')
  )

  return {
    turns,
    activeTurns,
    completedTurns,
    currentTurn,
    pending,
    error,
    fetchTurnsByDocument,
    clearTurns,
  }
}
