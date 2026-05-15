<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const router = useRouter()
const { setDocument } = useTurnSession()

const documentId = ref('')
const documentError = ref('')
const isSubmitting = ref(false)

function validateDocument(): boolean {
  const cleanDoc = documentId.value.replace(/\D/g, '')
  if (cleanDoc.length < 5 || cleanDoc.length > 20) {
    documentError.value = 'Ingresa un número de cédula válido (5-20 dígitos)'
    return false
  }
  documentError.value = ''
  return true
}

async function onContinue() {
  if (!validateDocument()) return

  const cleanDoc = documentId.value.replace(/\D/g, '')
  setDocument(cleanDoc)
  router.push('/app/entities')
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-display font-bold text-white mb-2">
        Solicita tu turno
      </h1>
      <p class="text-[--text-secondary]">
        Sin registro, sin complicaciones. Solo ingresa tu cédula.
      </p>
    </div>

    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div class="w-8 h-8 rounded-full bg-[--color-primary]/20 flex items-center justify-center shrink-0">
            <span class="text-[--color-primary] font-bold text-sm">1</span>
          </div>
          <div>
            <p class="text-white font-medium">Ingresa tu número de cédula</p>
            <p class="text-white/50 text-sm">Sin puntos ni espacios. Ej: 12345678</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div class="w-8 h-8 rounded-full bg-[--color-primary]/20 flex items-center justify-center shrink-0">
            <span class="text-[--color-primary] font-bold text-sm">2</span>
          </div>
          <div>
            <p class="text-white font-medium">Recibe tu turno</p>
            <p class="text-white/50 text-sm">Te mostraremos tu número y posición en cola</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div class="w-8 h-8 rounded-full bg-[--color-primary]/20 flex items-center justify-center shrink-0">
            <span class="text-[--color-primary] font-bold text-sm">3</span>
          </div>
          <div>
            <p class="text-white font-medium">Te avisamos cuando sea tu turno</p>
            <p class="text-white/50 text-sm">Solo presenta tu número cuando te llamen</p>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-white/10">
        <p class="text-[--text-secondary] text-sm mb-3 text-center">
          Ingresa tu número de cédula para comenzar
        </p>
        <div class="flex gap-3">
          <input
            v-model="documentId"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="Ej: 12345678"
            class="flex-1 px-4 py-3 bg-white/5 border rounded-xl text-white text-center text-lg tracking-wide focus:outline-none transition-all"
            :class="documentError ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'"
            @keyup.enter="onContinue"
          >
          <UiButton type="button" :loading="isSubmitting" class="px-6" @click="onContinue">
            {{ isSubmitting ? '...' : 'Continuar' }}
          </UiButton>
        </div>
        <p v-if="documentError" class="text-red-400 text-xs mt-2 text-center">{{ documentError }}</p>
      </div>

      <div class="space-y-3 pt-4 border-t border-white/10">
        <p class="text-center text-[--text-muted] text-xs">
          ¿Quieres más funcionalidades?
        </p>
        <div class="flex flex-col gap-2">
          <NuxtLink
            to="/auth/register"
            class="w-full px-4 py-3 bg-gradient-to-r from-[--color-primary] to-[--color-primary-dark] text-white font-medium rounded-xl text-center hover:opacity-90 transition-opacity"
          >
            Crear cuenta gratis
          </NuxtLink>
          <NuxtLink
            to="/onboarding/my-turns"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl text-center hover:bg-white/10 transition-colors"
          >
            Ver mis turnos
          </NuxtLink>
          <p class="text-center text-[--text-muted] text-xs">
            Con cuenta puedes ver tu historial, recibir notificaciones y más.
          </p>
        </div>
      </div>

      
    </div>
  </div>
</template>
