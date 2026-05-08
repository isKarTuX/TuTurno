<script setup lang="ts">
interface Props {
  turnNumber: string
  entityName: string
  countdown: number
}

defineProps<Props>()

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
</script>

<template>
  <div class="screen-notif">
    <div class="notif-banner">
      <div class="notif-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <div class="notif-content">
        <span class="notif-title">TuTurno</span>
        <span class="notif-main">Es tu turno</span>
        <span class="notif-sub">{{ turnNumber }} · {{ entityName }}</span>
      </div>
    </div>

    <div class="confetti-container">
      <div v-for="i in 8" :key="i" class="confetti" :style="{ '--i': i }" />
    </div>

    <div class="turn-hero">
      <span class="turn-label">Tu número</span>
      <div class="turn-number">{{ turnNumber }}</div>
    </div>

    <div class="message">Es tu turno, Carlos</div>

    <div class="location-card">
      <div class="location-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
        </svg>
      </div>
      <div class="location-body">
        <span class="location-label">Dirígete a</span>
        <span class="location-value">Puesto 3</span>
        <span class="location-op">Ana M. te espera</span>
      </div>
    </div>

    <div class="timer-card">
      <div class="timer-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div class="timer-body">
        <span class="timer-label">Tienes para presentarte</span>
        <span class="timer-value">{{ formatCountdown(countdown) }}</span>
      </div>
    </div>

    <div class="done-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Ya estoy ahí</span>
    </div>
  </div>
</template>

<style scoped>
.screen-notif {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, rgba(108, 58, 232, 0.3) 0%, #0a0a12 40%);
  color: white;
  padding: 10px 14px;
}

.notif-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  animation: slideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.notif-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bellRing 0.5s ease-out 0.3s;
}

@keyframes bellRing {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
}

.notif-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.notif-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.notif-title {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.notif-main {
  font-size: 15px;
  font-weight: 700;
  color: #10B981;
}

.notif-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.confetti-container {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confettiBurst 1.5s ease-out infinite;
}

.confetti:nth-child(1) { background: #6C3AE8; --angle: 0deg; animation-delay: 0s; }
.confetti:nth-child(2) { background: #10B981; --angle: 45deg; animation-delay: 0.1s; }
.confetti:nth-child(3) { background: #F59E0B; --angle: 90deg; animation-delay: 0.2s; }
.confetti:nth-child(4) { background: #EC4899; --angle: 135deg; animation-delay: 0.15s; }
.confetti:nth-child(5) { background: #3B82F6; --angle: 180deg; animation-delay: 0.25s; }
.confetti:nth-child(6) { background: #8B5CF6; --angle: 225deg; animation-delay: 0.05s; }
.confetti:nth-child(7) { background: #A78BFA; --angle: 270deg; animation-delay: 0.3s; }
.confetti:nth-child(8) { background: #10B981; --angle: 315deg; animation-delay: 0.12s; }

@keyframes confettiBurst {
  0% {
    transform: rotate(var(--angle)) translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateY(-80px) scale(0);
    opacity: 0;
  }
}

.turn-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.turn-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.turn-number {
  font-size: 54px;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: white;
  text-shadow:
    0 0 20px rgba(108, 58, 232, 0.8),
    0 0 60px rgba(108, 58, 232, 0.4);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow:
      0 0 20px rgba(108, 58, 232, 0.8),
      0 0 60px rgba(108, 58, 232, 0.4);
  }
  50% {
    text-shadow:
      0 0 40px rgba(108, 58, 232, 1),
      0 0 80px rgba(108, 58, 232, 0.6);
  }
}

.message {
  font-size: 22px;
  font-weight: 700;
  margin: 12px 0;
  animation: fadeUp 0.4s ease-out 0.3s both;
}

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.location-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  margin-bottom: 8px;
  animation: fadeUp 0.4s ease-out 0.4s both;
}

.location-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(108, 58, 232, 0.2), rgba(108, 58, 232, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-icon svg {
  width: 28px;
  height: 28px;
  color: #6C3AE8;
}

.location-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
}

.location-value {
  font-size: 18px;
  font-weight: 700;
}

.location-op {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

.timer-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.18);
  border-radius: 12px;
  margin-bottom: 10px;
  animation: fadeUp 0.4s ease-out 0.5s both;
}

.timer-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-icon svg {
  width: 22px;
  height: 22px;
  color: #F59E0B;
}

.timer-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.timer-label {
  font-size: 12px;
  color: #F59E0B;
}

.timer-value {
  font-size: 18px;
  font-weight: 700;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #F59E0B;
}

.done-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border-radius: 14px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
  box-shadow: 0 8px 25px rgba(108, 58, 232, 0.4);
  transition: all 0.2s ease;
  animation: fadeUp 0.4s ease-out 0.6s both;
}

.done-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(108, 58, 232, 0.5);
}

.done-btn:active {
  transform: scale(0.98);
}

.done-btn svg {
  width: 20px;
  height: 20px;
}
</style>