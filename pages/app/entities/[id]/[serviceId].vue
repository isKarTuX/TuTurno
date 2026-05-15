<script setup lang="ts">
import type { Service, Turn } from '~/types'

definePageMeta({
  layout: 'citizen',
})

const route = useRoute()
const router = useRouter()
const serviceId = route.params.serviceId as string
const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const { documentId: sessionDocumentId } = useTurnSession()

const { data: serviceData, pending: servicePending, error: serviceError } = await useAsyncData(
  `service-${serviceId}`,
  () => $fetch(`/api/services/${serviceId}`) as Promise<{ success: boolean; data: Service }>
)

const service = computed(() => serviceData.value?.data)

const turn = ref<Turn | null>(null)
const submitError = ref<string | null>(null)
const isSubmitting = ref(false)

const selectedDate = ref('')
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})
const maxDate = computed(() => {
  const future = new Date()
  future.setDate(future.getDate() + 30)
  return future.toISOString().split('T')[0]
})

if (!isAuthenticated.value && !sessionDocumentId.value) {
  router.push('/onboarding/request-turn')
}

async function onSubmitPublic() {
  if (!sessionDocumentId.value) {
    submitError.value = 'Necesitas ingresar tu cédula primero'
    router.push('/onboarding/request-turn')
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    const result = await $fetch('/api/turns/public', {
      method: 'POST',
      body: {
        serviceId,
        documentId: sessionDocumentId.value,
      },
    })
    turn.value = (result as unknown as { success: boolean; data: Turn }).data
  } catch (error: unknown) {
    const err = error as { data?: { error?: { message?: string } } }
    submitError.value = err?.data?.error?.message || 'Error al solicitar turno'
  } finally {
    isSubmitting.value = false
  }
}

async function onSubmitAuthenticated() {
  isSubmitting.value = true
  submitError.value = null

  try {
    const result = await $fetch('/api/turns', {
      method: 'POST',
      body: {
        serviceId,
        requestedDate: selectedDate.value || undefined,
      },
    })
    turn.value = (result as unknown as { success: boolean; data: Turn }).data
  } catch (error: unknown) {
    const err = error as { data?: { error?: { message?: string } } }
    submitError.value = err?.data?.error?.message || 'Error al solicitar turno'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <NuxtLink :to="`/app/entities/${service?.entityId}`" class="text-xs uppercase tracking-[0.2em] text-[--text-muted] hover:text-white inline-flex items-center gap-2">
      <Icon name="lucide:chevron-left" class="w-4 h-4" />
      Servicios
    </NuxtLink>

    <div v-if="servicePending" class="glass p-6 rounded-xl">
      <div class="skeleton h-8 w-48 mb-4"/>
      <div class="skeleton h-4 w-32"/>
    </div>

    <div v-else-if="serviceError" class="glass p-6 rounded-xl text-center">
      <p class="text-red-400">Servicio no encontrado</p>
    </div>

    <div v-else-if="service" class="glass p-6 rounded-xl">
      <h1 class="text-xl font-display font-bold text-white">{{ service.name }}</h1>
      <p class="text-[--text-secondary] mt-2">{{ service.description }}</p>

      <div class="bg-white/5 rounded-lg p-4 mt-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-[--text-secondary]">Tiempo promedio</span>
          <span class="text-white">{{ service.avgAttentionTime }} min</span>
        </div>
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-[--text-secondary]">Horario</span>
          <span class="text-white">{{ service.openTime }} - {{ service.closeTime }}</span>
        </div>
      </div>

      <div v-if="turn" class="text-center py-8">
        <p class="text-[--text-secondary] mb-2">Tu turno es</p>
        <div class="text-5xl font-display font-bold text-primary turn-flip">{{ turn.turnNumber }}</div>
        <p class="text-[--text-secondary] mt-3">Posición en cola: #{{ turn.queuePosition }}</p>
        <div class="mt-6 pt-6 border-t border-white/10">
          <p class="text-[--text-muted] text-xs mb-4">Crea una cuenta para recibir notificaciones cuando tu turno esté cerca</p>
          <NuxtLink to="/auth/register">
            <UiButton variant="outline" class="w-full">
              <Icon name="lucide:user-plus" class="w-4 h-4" />
              Crear cuenta gratis
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="!isAuthenticated" class="space-y-4">
        <UiButton
          type="button"
          :loading="isSubmitting"
          class="w-full"
          @click="onSubmitPublic"
        >
          {{ isSubmitting ? 'Solicitando...' : 'Solicitar Turno para Hoy' }}
        </UiButton>

        <p v-if="submitError" class="text-red-400 text-sm text-center">{{ submitError }}</p>

        <p class="text-center text-[--text-muted] text-xs">
          ¿Ya tienes cuenta?
          <NuxtLink to="/auth/login" class="text-primary hover:text-primary-light ml-1">Inicia sesión</NuxtLink>
        </p>
      </div>

      <form v-else class="space-y-4" @submit.prevent="onSubmitAuthenticated">
        <div class="bg-white/5 rounded-xl p-4 space-y-4">
          <div>
            <label class="text-[--text-secondary] text-sm mb-2 block">Selecciona la fecha</label>
            <input
              v-model="selectedDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary/50 focus:outline-none transition-all"
            >
            <p class="text-[--text-muted] text-xs mt-1">Puedes reservar hasta 30 días anticipación</p>
          </div>
        </div>

        <p v-if="submitError" class="text-red-400 text-sm">{{ submitError }}</p>

        <UiButton type="submit" :loading="isSubmitting" class="w-full">
          {{ isSubmitting ? 'Solicitando...' : 'Solicitar Turno' }}
        </UiButton>
      </form>
    </div>
  </div>
</template>
