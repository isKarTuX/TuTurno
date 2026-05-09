<script setup lang="ts">
interface Props {
  turnNumber: string
  currentTurnNumber: string
  queuePosition: number
  estimatedMinutes: number
  progressPercent: number
  entityName: string
  serviceName: string
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
  <div class="screen-tracking">
    <div class="header">
      <span class="header-title">TuTurno</span>
      <div class="header-indicator" />
    </div>

    <div class="service-info">
      <span>{{ entityName }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
      <span>{{ serviceName }}</span>
    </div>

    <div class="status-row">
      <div class="status-dot" />
      <span>En espera</span>
    </div>

    <div class="turn-display">
      <span class="turn-label">Tu turno</span>
      <div class="turn-number">
        {{ formatTurn(turnNumber).prefix }}-<span class="turn-highlight">{{ formatTurn(turnNumber).digits }}</span>
      </div>
    </div>

    <div class="current-info">
      <span class="current-label">Ahora atendiendo</span>
      <span class="current-value">{{ currentTurnNumber }}</span>
    </div>

    <div class="queue-section">
      <div class="queue-header">
        <span>Antes de ti</span>
        <span class="queue-badge">{{ queuePosition - 1 }} personas</span>
      </div>
      <div class="queue-progress">
        <div class="queue-bar">
          <div class="queue-fill" :style="{ width: `${((queuePosition - 1) / 4) * 100}%` }" />
        </div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-header">
        <span>Progreso</span>
        <span class="progress-value">{{ progressPercent }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
      </div>
    </div>

    <div class="time-card">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <div class="time-body">
        <span class="time-value">~{{ estimatedMinutes }} min</span>
        <span class="time-label">tiempo estimado</span>
      </div>
    </div>

    <div class="location-row">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <div class="location-body">
        <span class="location-desk">Puesto 3</span>
        <span class="location-op">Operadora: Ana M.</span>
      </div>
    </div>

    <div class="advance-btn" @click="$emit('action')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="13 17 18 12 13 7"/>
        <polyline points="6 17 11 12 6 7"/>
      </svg>
      <span>Avanzar</span>
    </div>
  </div>
</template>

<style scoped>
.screen-tracking {
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
  justify-content: space-between;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
}

.header-indicator {
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.service-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}

.service-info svg {
  width: 4px;
  height: 4px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #10B981;
  border-radius: 50%;
}

.status-row span {
  font-size: 11px;
  font-weight: 500;
  color: #10B981;
}

.turn-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
}

.turn-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 4px;
}

.turn-number {
  font-size: 48px;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: white;
  text-shadow: 0 0 40px rgba(108, 58, 232, 0.5);
}

.turn-highlight {
  color: #6C3AE8;
}

.current-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  margin-bottom: 10px;
}

.current-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

.current-value {
  font-size: 15px;
  font-weight: 700;
  color: #A78BFA;
}

.queue-section {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  margin-bottom: 10px;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.queue-header span:first-child {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
}

.queue-badge {
  font-size: 10px;
  font-weight: 600;
  color: #6C3AE8;
  background: rgba(108, 58, 232, 0.12);
  padding: 2px 8px;
  border-radius: 6px;
}

.queue-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.queue-fill {
  height: 100%;
  background: linear-gradient(90deg, #6C3AE8, #A78BFA);
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-section {
  margin-bottom: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-header span:first-child {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
}

.progress-value {
  font-size: 10px;
  font-weight: 600;
  color: #A78BFA;
}

.progress-bar {
  height: 5px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6C3AE8, #A78BFA);
  border-radius: 3px;
  transition: width 0.4s ease-out;
}

.time-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(135deg, rgba(108, 58, 232, 0.12), rgba(108, 58, 232, 0.04));
  border: 1px solid rgba(108, 58, 232, 0.18);
  border-radius: 14px;
  margin-bottom: 10px;
}

.time-card svg {
  width: 24px;
  height: 24px;
  color: #6C3AE8;
}

.time-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-value {
  font-size: 18px;
  font-weight: 700;
}

.time-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
}

.location-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 10px;
}

.location-row svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
}

.location-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-desk {
  font-size: 13px;
  font-weight: 600;
}

.location-op {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
}

.advance-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border-radius: 14px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
  box-shadow: 0 8px 25px rgba(108, 58, 232, 0.35);
  transition: all 0.2s ease;
}

.advance-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(108, 58, 232, 0.45);
}

.advance-btn:active {
  transform: scale(0.98);
}

.advance-btn svg {
  width: 18px;
  height: 18px;
}
</style>