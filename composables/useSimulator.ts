import { ref, computed, onUnmounted } from 'vue'

export type ScreenId =
  | 'home'
  | 'entity-detail'
  | 'request-turn'
  | 'tracking'
  | 'notification'
  | 'complete'

interface SimulatorState {
  currentScreen: ScreenId
  currentStep: number
  isAutoPlaying: boolean
  isFirstRun: boolean
  turnNumber: string
  turnCounter: number
  entityName: string
  serviceName: string
  queueTotal: number
  queuePosition: number
  currentTurnNumber: string
  currentTurnCounter: number
  estimatedMinutes: number
  progressPercent: number
  notificationCountdown: number
  loopCount: number
}

const INITIAL_STATE: SimulatorState = {
  currentScreen: 'home',
  currentStep: 0,
  isAutoPlaying: true,
  isFirstRun: true,
  turnNumber: 'A-001',
  turnCounter: 1,
  entityName: 'EPS Saludar',
  serviceName: 'Afiliaciones',
  queueTotal: 4,
  queuePosition: 4,
  currentTurnNumber: 'A-000',
  currentTurnCounter: 0,
  estimatedMinutes: 20,
  progressPercent: 0,
  notificationCountdown: 10,
  loopCount: 0,
}

export function useSimulator() {
  const state = ref<SimulatorState>({ ...INITIAL_STATE })
  const transitionDirection = ref<'next' | 'prev' | 'fade'>('next')

  let notificationCountdownInterval: ReturnType<typeof setInterval> | null = null
  let screenTimeout: ReturnType<typeof setTimeout> | null = null

  function scheduleNextStep(delay: number) {
    if (screenTimeout) clearTimeout(screenTimeout)
    if (state.value.isAutoPlaying && state.value.isFirstRun) {
      screenTimeout = setTimeout(() => {
        nextStep()
      }, delay)
    }
  }

  function advanceQueue() {
    if (state.value.queuePosition <= 1) return

    state.value.currentTurnCounter++
    state.value.queuePosition--

    const prefix = state.value.turnNumber.split('-')[0]
    state.value.currentTurnNumber = `${prefix}-${String(state.value.currentTurnCounter).padStart(3, '0')}`

    state.value.progressPercent = Math.round(((state.value.queueTotal - state.value.queuePosition) / state.value.queueTotal) * 100)
    state.value.estimatedMinutes = Math.max(3, Math.round((state.value.queuePosition / state.value.queueTotal) * 20))
  }

  function nextStep() {
    const { currentScreen, currentStep, queuePosition } = state.value

    transitionDirection.value = 'next'

    if (currentScreen === 'home') {
      state.value.currentScreen = 'entity-detail'
      scheduleNextStep(3500)
      return
    }

    if (currentScreen === 'entity-detail') {
      state.value.currentScreen = 'request-turn'
      state.value.currentStep = 0
      scheduleNextStep(2000)
      return
    }

    if (currentScreen === 'request-turn') {
      if (currentStep === 0) {
        state.value.currentStep = 1
        scheduleNextStep(3000)
        return
      }
      state.value.currentScreen = 'tracking'
      scheduleNextStep(3000)
      return
    }

    if (currentScreen === 'tracking') {
      if (queuePosition > 1) {
        advanceQueue()
        scheduleNextStep(4000)
        return
      }
      state.value.currentScreen = 'notification'
      state.value.notificationCountdown = 10
      startNotificationCountdown()
      return
    }

    if (currentScreen === 'notification') {
      stopNotificationCountdown()
      state.value.currentScreen = 'complete'
      return
    }

    if (currentScreen === 'complete') {
      reset(true)
      return
    }
  }

  function prevStep() {
    if (screenTimeout) clearTimeout(screenTimeout)
    state.value.isAutoPlaying = false

    const { currentScreen, currentStep } = state.value

    transitionDirection.value = 'prev'

    if (currentScreen === 'notification') {
      state.value.currentScreen = 'tracking'
      stopNotificationCountdown()
      return
    }

    if (currentScreen === 'tracking') {
      state.value.currentScreen = 'request-turn'
      state.value.currentStep = 1
      return
    }

    if (currentScreen === 'request-turn') {
      if (currentStep === 1) {
        state.value.currentStep = 0
        return
      }
      state.value.currentScreen = 'entity-detail'
      return
    }

    if (currentScreen === 'entity-detail') {
      state.value.currentScreen = 'home'
      return
    }
  }

  function reset(fullReset = true) {
    if (screenTimeout) clearTimeout(screenTimeout)
    stopNotificationCountdown()

    transitionDirection.value = 'fade'

    if (fullReset) {
      state.value.isAutoPlaying = true
      state.value.isFirstRun = true
    } else {
      state.value.isAutoPlaying = false
      state.value.isFirstRun = false
    }

    state.value.turnCounter++
    state.value.turnNumber = `A-${String(state.value.turnCounter).padStart(3, '0')}`

    state.value.queuePosition = 4
    state.value.currentTurnCounter = 0
    state.value.currentTurnNumber = 'A-000'
    state.value.estimatedMinutes = 20
    state.value.progressPercent = 0
    state.value.currentStep = 0
    state.value.loopCount++

    state.value.currentScreen = 'home'
  }

  function startNotificationCountdown() {
    if (notificationCountdownInterval) return

    notificationCountdownInterval = setInterval(() => {
      if (state.value.notificationCountdown > 0) {
        state.value.notificationCountdown--
      } else {
        stopNotificationCountdown()
      }
    }, 1000)
  }

  function stopNotificationCountdown() {
    if (notificationCountdownInterval) {
      clearInterval(notificationCountdownInterval)
      notificationCountdownInterval = null
    }
  }

  function toggleAutoPlay() {
    state.value.isAutoPlaying = !state.value.isAutoPlaying
    if (state.value.isAutoPlaying && state.value.isFirstRun) {
      scheduleNextStep(3000)
    }
  }

  onUnmounted(() => {
    if (screenTimeout) clearTimeout(screenTimeout)
    if (notificationCountdownInterval) clearInterval(notificationCountdownInterval)
  })

  return {
    state: state as Readonly<typeof state>,
    transitionDirection,
    nextStep,
    prevStep,
    reset,
    toggleAutoPlay,
    canGoBack: computed(() => {
      if (state.value.currentScreen === 'home') return false
      if (state.value.currentScreen === 'notification') return true
      if (state.value.currentScreen === 'complete') return true
      return true
    }),
    currentScreenIndex: computed(() => {
      const screens: ScreenId[] = ['home', 'entity-detail', 'request-turn', 'tracking', 'notification', 'complete']
      return screens.indexOf(state.value.currentScreen)
    }),
  }
}