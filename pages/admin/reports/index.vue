<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const selectedPeriod = ref('today')
const { data: reports, pending } = await useAsyncData(
  'admin-reports',
  () => $fetch(`/api/admin/reports?period=${selectedPeriod.value}`) as Promise<{ success: boolean; data: any }>,
  { watch: [selectedPeriod] }
)

const periods = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
]

const statusLabels: Record<string, string> = {
  waiting: 'En espera',
  called: 'Llamado',
  attending: 'En atención',
  completed: 'Completado',
  no_show: 'No asistido',
  cancelled: 'Cancelado',
}

const statusColors: Record<string, string> = {
  waiting: 'bg-primary/20 text-primary',
  called: 'bg-amber-500/20 text-amber-400',
  attending: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  no_show: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-400',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-display font-bold text-white">Reportes</h1>
      <select
        v-model="selectedPeriod"
        class="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
      >
        <option v-for="p in periods" :key="p.value" :value="p.value">
          {{ p.label }}
        </option>
      </select>
    </div>

    <div v-if="pending" class="glass p-8 rounded-xl text-center">
      <div class="skeleton h-8 w-48 mx-auto mb-4"></div>
    </div>

    <div v-else-if="reports?.data" class="space-y-6">
      <div class="glass p-6 rounded-xl">
        <h2 class="text-lg font-semibold text-white mb-4">Resumen - {{ reports.data.period }}</h2>
        <div class="text-4xl font-display font-bold text-primary mb-2">
          {{ reports.data.total }}
        </div>
        <p class="text-[--text-secondary]">turnos totales</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="(count, status) in reports.data.byStatus"
          :key="status"
          class="glass p-4 rounded-xl text-center"
        >
          <div class="text-2xl font-bold text-white">{{ count }}</div>
          <span class="inline-block px-2 py-1 rounded-full text-xs mt-2" :class="statusColors[status]">
            {{ statusLabels[status] || status }}
          </span>
        </div>
      </div>

      <div class="glass p-6 rounded-xl">
        <h2 class="text-lg font-semibold text-white mb-4">Top Servicios</h2>
        <div class="space-y-3">
          <div v-for="(service, index) in reports.data.topServices" :key="service.id" class="flex items-center gap-4">
            <span class="text-2xl font-bold text-[--text-secondary] w-8">{{ Number(index) + 1 }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-white font-medium">{{ service.name }}</span>
                <span class="text-white">{{ service.total }} turnos</span>
              </div>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full"
                  :style="{ width: `${(Number(service.total) / Number(reports.data.total)) * 100}%` }"
                />
              </div>
            </div>
          </div>
          <div v-if="!reports.data.topServices?.length" class="text-center text-[--text-secondary] py-4">
            No hay datos disponibles
          </div>
        </div>
      </div>

      <div class="glass p-6 rounded-xl">
        <h2 class="text-lg font-semibold text-white mb-4">Top Entidades</h2>
        <div class="space-y-3">
          <div v-for="(entity, index) in reports.data.topEntities" :key="entity.id" class="flex items-center gap-4">
            <span class="text-2xl font-bold text-[--text-secondary] w-8">{{ Number(index) + 1 }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-white font-medium">{{ entity.name }}</span>
                <span class="text-white">{{ entity.total }} turnos</span>
              </div>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-accent rounded-full"
                  :style="{ width: `${(Number(entity.total) / Number(reports.data.total)) * 100}%` }"
                />
              </div>
            </div>
          </div>
          <div v-if="!reports.data.topEntities?.length" class="text-center text-[--text-secondary] py-4">
            No hay datos disponibles
          </div>
        </div>
      </div>
    </div>
  </div>
</template>