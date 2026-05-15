<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const router = useRouter()
const { setDocument } = useTurnSession()
const { activeTurns, pending, error, fetchTurnsByDocument } = useDocumentTurns()

const documentId = ref('')
const documentError = ref('')
const showTurns = ref(false)

function validateDocument(): boolean {
  const cleanDoc = documentId.value.replace(/\D/g, '')
  if (cleanDoc.length < 5 || cleanDoc.length > 20) {
    documentError.value = 'Ingresa un número de cédula válido (5-20 dígitos)'
    return false
  }
  documentError.value = ''
  return true
}

async function onSearchTurns() {
  if (!validateDocument()) return

  const cleanDoc = documentId.value.replace(/\D/g, '')
  setDocument(cleanDoc)
  await fetchTurnsByDocument(cleanDoc)
  showTurns.value = true
}

function onRequestTurn() {
  router.push('/app/entities')
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CO', {
    dateStyle: 'medium',
  })
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-display font-bold text-white mb-2">
        Mis Turnos
      </h1>
      <p class="text-[--text-secondary]">
        Consulta tus turnos activos con tu número de cédula
      </p>
    </div>

    <div class="space-y-6">
      <div class="glass rounded-xl p-6 space-y-4">
        <div>
          <label class="text-[--text-secondary] text-sm mb-2 block">Número de cédula</label>
          <div class="flex gap-3">
            <input
              v-model="documentId"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="Ej: 12345678"
              class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide focus:outline-none transition-all"
              :class="documentError ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'"
              @keyup.enter="onSearchTurns"
            >
          </div>
          <p v-if="documentError" class="text-red-400 text-xs mt-2 text-center">{{ documentError }}</p>
        </div>

        <UiButton
          type="button"
          :loading="pending"
          class="w-full"
          @click="onSearchTurns"
        >
          {{ pending ? 'Buscando...' : 'Buscar Mis Turnos' }}
        </UiButton>

        <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
      </div>

      <div v-if="showTurns && activeTurns.length === 0 && !pending" class="glass rounded-xl p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
          <Icon name="lucide:search" class="w-8 h-8 text-white/30" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Sin turnos activos</h3>
        <p class="text-white/50 text-sm mb-4">No tienes turnos pendientes para esta cédula</p>
        <UiButton variant="primary" @click="onRequestTurn">
          Solicitar un turno
        </UiButton>
      </div>

      <div v-else-if="showTurns && activeTurns.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">Turnos Activos</h2>
          <span class="text-sm text-[--text-muted]">{{ activeTurns.length }} turno(s)</span>
        </div>

        <div
          v-for="turn in activeTurns"
          :key="turn.id"
          class="glass rounded-xl p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[--color-primary]/20 flex items-center justify-center">
                <span class="text-xl font-bold text-primary">{{ turn.turnNumber }}</span>
              </div>
              <div>
                <p class="font-semibold text-white">{{ turn.entity?.name }}</p>
                <p class="text-sm text-white/50">{{ turn.service?.name }}</p>
              </div>
            </div>
            <span
              class="badge"
              :class="{
                'badge-waiting': turn.status === 'waiting',
                'badge-called': turn.status === 'called',
                'badge-attending': turn.status === 'attending',
              }"
            >
              {{ turn.status === 'waiting' ? 'En espera' : turn.status === 'called' ? 'Llamado' : 'En atención' }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-white/50">Posición</span>
            <span class="text-white font-medium">#{{ turn.queuePosition }}</span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-white/50">Fecha</span>
            <span class="text-white">{{ formatDate(turn.requestedDate || turn.createdAt) }}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 space-y-3">
          <p class="text-center text-[--text-muted] text-xs">
            ¿Quieres más funcionalidades?
          </p>
          <NuxtLink
            to="/auth/register"
            class="block w-full px-4 py-3 bg-gradient-to-r from-[--color-primary] to-[--color-primary-dark] text-white font-medium rounded-xl text-center hover:opacity-90 transition-opacity"
          >
            Crear cuenta gratis
          </NuxtLink>
          <NuxtLink
            to="/onboarding/request-turn"
            class="block w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl text-center hover:bg-white/10 transition-colors"
          >
            Solicitar otro turno
          </NuxtLink>
          <p class="text-center text-[--text-muted] text-xs">
            Con cuenta puedes ver tu historial completo, recibir notificaciones y más.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
