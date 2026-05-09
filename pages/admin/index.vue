<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { data: metrics, pending } = await useAsyncData(
  'admin-metrics',
  () => $fetch('/api/admin/metrics') as Promise<{
    success: boolean
    data: {
      summary: Record<string, number>
      today: Record<string, number>
      entityMetrics: Array<{ id: string; name: string; type: string; totalTurns: number; completed: number }>
      serviceMetrics: Array<{ id: string; name: string; totalTurns: number; completed: number }>
    }
  }>
)

const summary = computed(() => metrics.value?.data?.summary || {})
const today = computed(() => metrics.value?.data?.today || {})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-display font-bold text-white">Dashboard</h1>
      <NuxtLink
        to="/admin/reports"
        class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm"
      >
        Ver Reportes
      </NuxtLink>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="glass p-6 rounded-xl">
        <div class="skeleton h-4 w-24 mb-2"/>
        <div class="skeleton h-8 w-16"/>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminMetricCard
        title="Entidades Activas"
        :value="summary.totalEntities"
        icon="🏢"
      />
      <AdminMetricCard
        title="Servicios Activos"
        :value="summary.totalServices"
        icon="📋"
      />
      <AdminMetricCard
        title="Operadores"
        :value="summary.totalOperators"
        icon="👤"
      />
      <AdminMetricCard
        title="Ciudadanos Registrados"
        :value="summary.totalCitizens"
        icon="👥"
      />
    </div>

    <div v-if="!pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminMetricCard
        title="Turnos Hoy"
        :value="today.total"
        icon="🎫"
      />
      <AdminMetricCard
        title="En Espera"
        :value="today.waiting"
        icon="⏳"
        change-type="neutral"
      />
      <AdminMetricCard
        title="Completados"
        :value="today.completed"
        icon="✅"
        change-type="positive"
      />
      <AdminMetricCard
        title="No Asistieron"
        :value="today.noShow"
        icon="❌"
        change-type="negative"
      />
    </div>

    <div v-if="!pending" class="glass p-6 rounded-xl">
      <h2 class="text-lg font-semibold text-white mb-4">Estadísticas por Entidad</h2>
      <div class="space-y-4">
        <div v-for="entity in metrics?.data?.entityMetrics" :key="entity.id" class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">{{ entity.name }}</p>
            <p class="text-sm text-[--text-secondary]">{{ entity.type }}</p>
          </div>
          <div class="text-right">
            <p class="text-white font-medium">{{ entity.totalTurns }} turnos</p>
            <p class="text-sm text-green-400">{{ entity.completed }} completados</p>
          </div>
        </div>
        <div v-if="!metrics?.data?.entityMetrics?.length" class="text-center text-[--text-secondary] py-4">
          No hay datos disponibles
        </div>
      </div>
    </div>

    <div v-if="!pending" class="glass p-6 rounded-xl">
      <h2 class="text-lg font-semibold text-white mb-4">Estadísticas por Servicio</h2>
      <div class="space-y-4">
        <div v-for="service in metrics?.data?.serviceMetrics" :key="service.id" class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">{{ service.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-white font-medium">{{ service.totalTurns }} turnos</p>
            <p class="text-sm text-green-400">{{ service.completed }} completados</p>
          </div>
        </div>
        <div v-if="!metrics?.data?.serviceMetrics?.length" class="text-center text-[--text-secondary] py-4">
          No hay datos disponibles
        </div>
      </div>
    </div>
  </div>
</template>