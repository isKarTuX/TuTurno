<script setup lang="ts">
const isVisible = ref(false)
const isClosing = ref(false)

const preferences = ref({
  necessary: true,
  functional: false,
  analytical: false,
  performance: false,
})

const hasConsented = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('tuTurnoConsent')
  if (consent) {
    hasConsented.value = true
  } else {
    isVisible.value = true
  }
})

function savePreferences() {
  localStorage.setItem('tuTurnoConsent', JSON.stringify(preferences.value))
  isClosing.value = true
  setTimeout(() => {
    isVisible.value = false
    hasConsented.value = true
  }, 300)
}

function acceptAll() {
  preferences.value.functional = true
  preferences.value.analytical = true
  preferences.value.performance = true
  savePreferences()
}

function rejectAll() {
  preferences.value.functional = false
  preferences.value.analytical = false
  preferences.value.performance = false
  savePreferences()
}

function openPreferences() {
  isVisible.value = true
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-4"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isVisible && !hasConsented"
        class="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none"
      >
        <div
          class="pointer-events-auto max-w-2xl mx-auto glass-elevated rounded-2xl border border-white/[0.10] p-6 shadow-2xl"
        >
          <div class="flex items-start gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <Icon name="lucide:cookie" class="w-6 h-6 text-violet-400" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-semibold text-white mb-1">Usamos cookies</h2>
              <p class="text-sm text-zinc-400 leading-relaxed">
                TuTurno usa cookies para funcionar correctamente, recordar tus preferencias y analizar el uso de la plataforma. Puedes personalizar tu elección o aceptar todo.
              </p>
            </div>
          </div>

          <!-- Cookie categories -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon name="lucide:check" class="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p class="text-sm font-medium text-white">Necesarias</p>
                  <p class="text-xs text-zinc-500">Siempre activas</p>
                </div>
              </div>
              <div class="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
                <Icon name="lucide:check" class="w-3 h-3 text-emerald-400" />
              </div>
            </div>

            <div
              v-for="cat in ['functional', 'analytical', 'performance']"
              :key="cat"
              class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div class="flex items-center gap-3">
                <label :for="cat" class="flex items-center gap-3 cursor-pointer">
                  <div
                    class="w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-colors"
                    :class="preferences[cat as keyof typeof preferences] ? 'bg-[--color-primary] border-[--color-primary]' : ''"
                  >
                    <Icon v-if="preferences[cat as keyof typeof preferences]" name="lucide:check" class="w-3 h-3 text-white" />
                  </div>
                  <input
                    :id="cat"
                    v-model="preferences[cat as keyof typeof preferences]"
                    type="checkbox"
                    class="sr-only"
                  >
                  <div>
                    <p class="text-sm font-medium text-white capitalize">{{ cat === 'analytical' ? 'Analíticas' : cat === 'performance' ? 'Rendimiento' : 'Funcionales' }}</p>
                    <p class="text-xs text-zinc-500">
                      {{ cat === 'functional' ? 'Recordar preferencias' : cat === 'analytical' ? 'Analizar uso (Google Analytics)' : 'Monitoreo de errores (Datadog)' }}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              class="flex-1 btn btn-ghost py-3 text-sm"
              @click="rejectAll"
            >
              Solo necesarias
            </button>
            <button
              type="button"
              class="flex-1 btn btn-outline py-3 text-sm"
              @click="openPreferences"
            >
              Personalizar
            </button>
            <button
              type="button"
              class="flex-1 btn btn-primary py-3 text-sm"
              @click="acceptAll"
            >
              Aceptar todo
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>