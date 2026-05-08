<script setup lang="ts">
import { useSimulator } from '~/composables/useSimulator'
import PhoneFrame from './PhoneFrame.vue'
import PhoneStatusBar from './PhoneStatusBar.vue'
import ScreenHome from './screens/ScreenHome.vue'
import ScreenEntityDetail from './screens/ScreenEntityDetail.vue'
import ScreenRequestTurn from './screens/ScreenRequestTurn.vue'
import ScreenTracking from './screens/ScreenTracking.vue'
import ScreenNotification from './screens/ScreenNotification.vue'
import ScreenComplete from './screens/ScreenComplete.vue'

const { state, nextStep, reset, prevStep, transitionDirection } = useSimulator()

function handleAction() {
  nextStep()
}

function handleBack() {
  prevStep()
}

function handleRestart() {
  reset(true)
}
</script>

<template>
  <div class="simulator-wrap" @click.stop>
    <PhoneFrame>
      <PhoneStatusBar />
      <div class="screen-wrap">
        <Transition :name="transitionDirection === 'prev' ? 'slide-right' : 'slide-left'" mode="out-in">
          <ScreenHome
            v-if="state.currentScreen === 'home'"
            key="home"
            @action="handleAction"
          />
          <ScreenEntityDetail
            v-else-if="state.currentScreen === 'entity-detail'"
            key="entity-detail"
            :entity-name="state.entityName"
            :service-name="state.serviceName"
            @action="handleAction"
            @back="handleBack"
          />
          <ScreenRequestTurn
            v-else-if="state.currentScreen === 'request-turn'"
            key="request-turn"
            :entity-name="state.entityName"
            :service-name="state.serviceName"
            :turn-number="state.turnNumber"
            :queue-position="state.queuePosition"
            :estimated-minutes="state.estimatedMinutes"
            :sub-step="state.currentStep"
            @action="handleAction"
          />
          <ScreenTracking
            v-else-if="state.currentScreen === 'tracking'"
            key="tracking"
            :turn-number="state.turnNumber"
            :current-turn-number="state.currentTurnNumber"
            :queue-position="state.queuePosition"
            :estimated-minutes="state.estimatedMinutes"
            :progress-percent="state.progressPercent"
            :entity-name="state.entityName"
            :service-name="state.serviceName"
            @action="handleAction"
          />
          <ScreenNotification
            v-else-if="state.currentScreen === 'notification'"
            key="notification"
            :turn-number="state.turnNumber"
            :entity-name="state.entityName"
            :countdown="state.notificationCountdown"
            @action="handleAction"
          />
          <ScreenComplete
            v-else-if="state.currentScreen === 'complete'"
            key="complete"
            :entity-name="state.entityName"
            :service-name="state.serviceName"
            :wait-time="8"
            :attention-time="6"
            :loop-count="state.loopCount"
            @restart="handleRestart"
          />
        </Transition>
      </div>
    </PhoneFrame>
  </div>
</template>

<style scoped>
.simulator-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen-wrap {
  width: 100%;
  height: calc(100% - 44px);
  overflow: hidden;
  position: relative;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-left-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>