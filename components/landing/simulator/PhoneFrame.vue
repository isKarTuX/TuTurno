<script setup lang="ts">
interface Props {
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
})
</script>

<template>
  <div
    class="phone-frame"
    :style="{ '--scale': props.scale }"
  >
    <div class="phone-body">
      <div class="dynamic-island" />

      <div class="phone-screen">
        <div class="screen-content">
          <slot />
        </div>
      </div>

      <div class="home-indicator" />
    </div>
  </div>
</template>

<style scoped>
.phone-frame {
  width: 320px;
  height: 660px;
  transform: scale(var(--scale, 1));
  transform-origin: center center;
  filter: drop-shadow(0 25px 60px rgba(108, 58, 232, 0.25));
}

.phone-body {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%);
  border-radius: 46px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 50px 100px rgba(0, 0, 0, 0.5);
  animation: float 5s ease-in-out infinite;
}

.phone-body:hover {
  animation-play-state: paused;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(0.4deg);
  }
}

.dynamic-island {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 28px;
  background: #000;
  border-radius: 16px;
  z-index: 10;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 38px;
  overflow: hidden;
  background: #0a0a12;
  position: relative;
}

.screen-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 4px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .phone-frame {
    width: 280px;
    height: 580px;
  }
}

@media (max-width: 480px) {
  .phone-frame {
    width: 75vw;
    max-width: 300px;
    height: auto;
    aspect-ratio: 9 / 19.5;
  }
}
</style>