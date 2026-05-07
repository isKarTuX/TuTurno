<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { data: operatorsData, refresh } = await useAsyncData(
  'admin-operators',
  () => $fetch('/api/admin/operators') as Promise<{ success: boolean; data: any[] }>
)

const operators = computed(() => operatorsData.value?.data || [])

async function toggleOperatorStatus(operatorId: string, _currentStatus: boolean) {
  try {
    await $fetch(`/api/admin/operators/${operatorId}`, {
      method: 'PATCH',
    } as any)
    refresh()
  } catch (error) {
    console.error('Failed to toggle operator status:', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-display font-bold text-white">Operadores</h1>
      <NuxtLink
        to="/admin/operators/new"
        class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm"
      >
        + Asignar Operador
      </NuxtLink>
    </div>

    <div class="glass rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-white/5">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">
              Nombre
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">
              Entidad
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">
              Servicio
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-[--text-secondary] uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr v-for="operator in operators" :key="operator.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-white">{{ operator.user?.fullName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-[--text-secondary]">{{ operator.user?.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-[--text-secondary]">{{ operator.entity?.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-[--text-secondary]">{{ operator.service?.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="operator.isActive ? 'text-green-400' : 'text-gray-400'"
                class="text-sm"
              >
                {{ operator.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                @click="toggleOperatorStatus(operator.id, operator.isActive)"
                :class="operator.isActive ? 'text-red-400' : 'text-green-400'"
                class="hover:underline"
              >
                {{ operator.isActive ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
          <tr v-if="operators.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-[--text-secondary]">
              No hay operadores asignados
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>