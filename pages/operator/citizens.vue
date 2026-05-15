<script setup lang="ts">
definePageMeta({
  layout: 'operator',
  middleware: 'operator',
})

interface Citizen {
  id: string
  fullName: string
  documentId: string
  email: string
  phone: string
  role: string
  isActive: boolean
  mustChangePassword: boolean
  isIncomplete: boolean
  createdAt: Date | null
}

const { data: citizensData, pending, refresh } = await useAsyncData(
  'operator-citizens',
  () => $fetch('/api/operator/citizens') as Promise<{
    success: boolean
    data: { citizens: Citizen[]; total: number }
  }>
)

const searchQuery = ref('')
const showIncompleteOnly = ref(false)
const selectedCitizen = ref<Citizen | null>(null)
const showEditModal = ref(false)
const editForm = ref({
  fullName: '',
  email: '',
  phone: '',
  isActive: true,
  mustChangePassword: false,
})

const filteredCitizens = computed(() => {
  let citizens = citizensData.value?.data?.citizens || []

  if (showIncompleteOnly.value) {
    citizens = citizens.filter((c: Citizen) => c.isIncomplete)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    citizens = citizens.filter((c: Citizen) =>
      c.fullName.toLowerCase().includes(query) ||
      c.documentId.includes(query) ||
      c.email.toLowerCase().includes(query)
    )
  }

  return citizens
})

function openEditModal(citizen: Citizen) {
  selectedCitizen.value = citizen
  editForm.value = {
    fullName: citizen.fullName,
    email: citizen.email,
    phone: citizen.phone,
    isActive: citizen.isActive,
    mustChangePassword: citizen.mustChangePassword,
  }
  showEditModal.value = true
}

async function onSaveEdit() {
  if (!selectedCitizen.value) return

  try {
    await $fetch(`/api/operator/update-citizen/${selectedCitizen.value.id}`, {
      method: 'PATCH',
      body: editForm.value,
    })
    showEditModal.value = false
    refresh()
  } catch (error) {
    console.error('Failed to update citizen:', error)
  }
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CO', {
    dateStyle: 'medium',
  })
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Gestión de Ciudadanos</h1>
        <p class="text-[--text-secondary]">Administra los usuarios registrados</p>
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-[--text-secondary] cursor-pointer">
          <input
            v-model="showIncompleteOnly"
            type="checkbox"
            class="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
          >
          Solo incompletos
        </label>
      </div>
    </header>

    <div class="glass rounded-xl p-4">
      <div class="relative max-w-md">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[--text-muted]">
          <Icon name="lucide:search" class="w-5 h-5" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, cédula o email..."
          class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-all"
        >
      </div>
    </div>

    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="glass rounded-xl p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-48 bg-white/5 rounded animate-pulse" />
            <div class="h-3 w-32 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredCitizens.length === 0" class="glass rounded-xl p-12 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 flex items-center justify-center">
        <Icon name="lucide:users" class="w-10 h-10 text-white/20" />
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">No se encontraron ciudadanos</h3>
      <p class="text-white/50">Intenta con otro término de búsqueda</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="citizen in filteredCitizens"
        :key="citizen.id"
        class="glass rounded-xl p-4 hover:bg-white/[0.03] transition-colors"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[--color-primary]/20 flex items-center justify-center shrink-0">
            <span class="text-sm font-bold text-[--color-primary]">
              {{ citizen.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }}
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium text-white truncate">{{ citizen.fullName }}</p>
              <span
                v-if="citizen.isIncomplete"
                class="badge badge-waiting text-xs"
              >
                Incompleto
              </span>
              <span
                v-if="!citizen.isActive"
                class="badge bg-white/10 text-white/50 text-xs"
              >
                Inactivo
              </span>
            </div>
            <p class="text-sm text-[--text-muted]">
              {{ citizen.email }} • CC {{ citizen.documentId }}
            </p>
          </div>

          <div class="text-right text-sm">
            <p class="text-white/50">Registrado</p>
            <p class="text-[--text-secondary]">{{ formatDate(citizen.createdAt) }}</p>
          </div>

          <button
            class="p-2 rounded-lg text-[--text-muted] hover:text-white hover:bg-white/10 transition-colors"
            @click="openEditModal(citizen)"
          >
            <Icon name="lucide:pencil" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <UiModal
      :show="showEditModal"
      title="Editar Ciudadano"
      @close="showEditModal = false"
    >
      <form class="space-y-4" @submit.prevent="onSaveEdit">
        <div class="space-y-1.5">
          <label class="text-sm text-[--text-secondary]">Nombre completo</label>
          <input
            v-model="editForm.fullName"
            type="text"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[--color-primary] focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label class="text-sm text-[--text-secondary]">Correo electrónico</label>
          <input
            v-model="editForm.email"
            type="email"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[--color-primary] focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label class="text-sm text-[--text-secondary]">Teléfono</label>
          <input
            v-model="editForm.phone"
            type="tel"
            placeholder="3001234567"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[--color-primary] focus:outline-none transition-all"
          >
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="editForm.isActive"
              type="checkbox"
              class="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
            >
            <span class="text-sm text-white">Usuario activo</span>
          </label>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="editForm.mustChangePassword"
              type="checkbox"
              class="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
            >
            <span class="text-sm text-white">Debe cambiar contraseña</span>
          </label>
        </div>

        <div class="flex gap-3 pt-4">
          <UiButton type="button" variant="outline" class="flex-1" @click="showEditModal = false">
            Cancelar
          </UiButton>
          <UiButton type="submit" class="flex-1">
            Guardar cambios
          </UiButton>
        </div>
      </form>
    </UiModal>
  </div>
</template>