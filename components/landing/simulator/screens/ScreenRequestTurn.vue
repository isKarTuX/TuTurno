<script setup lang="ts">
interface Props {
  entityName: string
  serviceName: string
  turnNumber: string
  queuePosition: number
  estimatedMinutes: number
  subStep: number
}

defineProps<Props>()

defineEmits<{
  (e: 'action'): void
}>()

function formatTurn(num: string) {
  const [prefix, ...digits] = num.split('-')
  return { prefix, digits: digits.join('') }
}
</script>

<template>
  <div class="screen-request">
    <div class="header">
      <span class="step-indicator">Paso 2 de 3</span>
    </div>

    <div v-if="subStep === 0" class="confirm-view">
      <div class="turn-display">
        <p class="turn-label">Tu turno es</p>
        <p class="turn-number">{{ turnNumber }}</p>
        <p class="turn-position">Posición #{{ queuePosition }} en cola</p>
      </div>

      <div class="queue-info">
        <div class="info-card">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <span class="info-label">Tiempo estimado</span>
            <span class="info-value">~{{ estimatedMinutes }} minutos</span>
          </div>
        </div>
        <div class="info-card">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
          </svg>
          <div>
            <span class="info-label">Personas adelante</span>
            <span class="info-value">{{ queuePosition - 1 }}</span>
          </div>
        </div>
      </div>

      <div class="qr-section">
        <div class="qr-code">
          <div class="qr-placeholder"/>
        </div>
        <p class="qr-instruction">Muestra este código cuando te llamen</p>
      </div>

      <button class="action-btn" @click.stop="$emit('action')">
        Ver mi turno en tiempo real
      </button>
    </div>

    <div v-else class="ticket-view">
      <div class="success-animation">
        <div class="success-ring" />
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <h2 class="ticket-title">¡Turno confirmado!</h2>

      <div class="ticket-card">
        <div class="ticket-label">Tu turno</div>
        <div class="ticket-num">
          <span class="ticket-pre">{{ formatTurn(turnNumber).prefix }}</span>
          <span class="ticket-sep">-</span>
          <span v-for="(d, i) in formatTurn(turnNumber).digits" :key="i" class="ticket-digit" :style="{ animationDelay: `${i * 120}ms` }">{{ d }}</span>
        </div>
        <div class="ticket-divider" />
        <div class="ticket-info">
          <span>{{ entityName }}</span>
          <span>{{ serviceName }}</span>
        </div>
      </div>

      <div class="position-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <span>Posición #{{ queuePosition }}</span>
      </div>

      <div class="track-btn" @click.stop="$emit('action')">
        <span>Ver estado</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen-request {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0a0a12;
  color: white;
  padding: 12px 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.step-indicator {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.confirm-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.turn-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.turn-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.turn-number {
  font-size: 42px;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #6C3AE8;
}

.turn-position {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.queue-info {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
}

.info-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.info-card svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
}

.info-card > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.info-value {
  font-size: 13px;
  font-weight: 600;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.qr-code {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background: repeating-linear-gradient(
    0deg,
    #0a0a12 0px,
    #0a0a12 8px,
    white 8px,
    white 16px
  );
  opacity: 0.8;
  border-radius: 4px;
}

.qr-instruction {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.action-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border-radius: 12px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 6px 22px rgba(108, 58, 232, 0.32);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
}

.action-btn:active {
  transform: scale(0.98);
}

.ticket-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-animation {
  position: relative;
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
}

.success-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: #6C3AE8;
  border-radius: 50%;
  animation: spin 0.8s linear forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-icon {
  position: absolute;
  inset: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border-radius: 50%;
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}

@keyframes pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.success-icon svg {
  width: 32px;
  height: 32px;
  color: white;
  stroke-dasharray: 32;
  stroke-dashoffset: 32;
  animation: draw 0.3s ease-out 0.7s forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.ticket-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.ticket-card {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, rgba(108, 58, 232, 0.18), rgba(108, 58, 232, 0.06));
  border: 2px solid rgba(108, 58, 232, 0.35);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  box-shadow: 0 0 35px rgba(108, 58, 232, 0.2);
}

.ticket-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
}

.ticket-num {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.ticket-pre {
  font-size: 38px;
  font-weight: 800;
  color: #6C3AE8;
}

.ticket-sep {
  font-size: 38px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.25);
}

.ticket-digit {
  font-size: 38px;
  font-weight: 800;
  color: white;
  animation: roll 0.4s ease-out both;
}

@keyframes roll {
  0% {
    transform: translateY(-20px) rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotateX(0);
    opacity: 1;
  }
}

.ticket-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 4px 0;
}

.ticket-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
}

.position-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(108, 58, 232, 0.12);
  border-radius: 20px;
  margin-bottom: 16px;
}

.position-pill svg {
  width: 16px;
  height: 16px;
  color: #6C3AE8;
}

.position-pill span {
  font-size: 13px;
  font-weight: 600;
  color: #A78BFA;
}

.track-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border-radius: 12px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 6px 22px rgba(108, 58, 232, 0.32);
  cursor: pointer;
  transition: all 0.2s ease;
}

.track-btn:active {
  transform: scale(0.98);
}

.track-btn svg {
  width: 18px;
  height: 18px;
}
</style>