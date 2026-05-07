import { defineStore } from 'pinia'
import type { Entity, Service } from '~/types'

interface EntityWithServices extends Entity {
  services: Service[]
}

export const useEntityStore = defineStore('entity', () => {
  const entities = ref<Entity[]>([])
  const currentEntity = ref<EntityWithServices | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeEntities = computed(() =>
    entities.value.filter(e => e.isActive)
  )

  async function fetchEntities(params?: { search?: string; type?: string; page?: number; perPage?: number }) {
    isLoading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (params?.search) query.set('search', params.search)
      if (params?.type) query.set('type', params.type)
      if (params?.page) query.set('page', String(params.page))
      if (params?.perPage) query.set('perPage', String(params.perPage))

      const response = await $fetch(`/api/entities?${query.toString()}`) as {
        success: boolean
        data: Entity[]
        meta?: { total: number }
      }
      if (response.success) {
        entities.value = response.data
      }
    } catch {
      error.value = 'Error al cargar entidades'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchEntityById(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch(`/api/entities/${id}`) as {
        success: boolean
        data: EntityWithServices
      }
      if (response.success) {
        currentEntity.value = response.data
        return response.data
      }
    } catch {
      error.value = 'Entidad no encontrada'
    } finally {
      isLoading.value = false
    }
    return null
  }

  function clearCurrentEntity() {
    currentEntity.value = null
  }

  return {
    entities,
    currentEntity,
    isLoading,
    error,
    activeEntities,
    fetchEntities,
    fetchEntityById,
    clearCurrentEntity,
  }
})