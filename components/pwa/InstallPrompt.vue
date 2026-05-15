<script setup lang="ts">
interface Emits {
  (e: 'installed' | 'dismissed'): void
}

const emit = defineEmits<Emits>()

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<{
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed'
      platform: string
    }>
  }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isVisible = ref(false)
const isInstalling = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})

function handleBeforeInstallPrompt(event: Event) {
  event.preventDefault()
  deferredPrompt.value = event as BeforeInstallPromptEvent
  isVisible.value = true
}

function handleAppInstalled() {
  deferredPrompt.value = null
  isVisible.value = false
  emit('installed')
}

async function installApp() {
  if (!deferredPrompt.value) return

  isInstalling.value = true
  try {
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      emit('installed')
    }
  } finally {
    isInstalling.value = false
    deferredPrompt.value = null
    isVisible.value = false
  }
}

function dismissPrompt() {
  isVisible.value = false
  deferredPrompt.value = null
  emit('dismissed')
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      class="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50"
    >
      <div class="glass rounded-2xl p-4 border border-white/10 shadow-xl">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon name="download" class="w-6 h-6 text-primary" />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-white font-semibold mb-1">Instala TuTurno</h3>
            <p class="text-sm text-white/60">
              Accede rápido desde tu pantalla de inicio
            </p>
          </div>

          <button
            type="button"
            class="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Cerrar"
            @click="dismissPrompt"
          >
            <Icon name="x" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex gap-2 mt-4">
          <UiButton
            variant="ghost"
            size="sm"
            class="flex-1"
            @click="dismissPrompt"
          >
            Después
          </UiButton>
          <UiButton
            variant="primary"
            size="sm"
            class="flex-1"
            :loading="isInstalling"
            @click="installApp"
          >
            Instalar
          </UiButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 300ms var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
