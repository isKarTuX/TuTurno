<script setup lang="ts">
interface Props {
  entityName: string
  serviceName: string
  waitTime: number
  attentionTime: number
  loopCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()
</script>

<template>
  <div class="screen-complete">
    <div class="success-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>

    <h2 class="complete-title">Completado</h2>

    <div class="visit-info">
      <span class="visit-entity">{{ entityName }}</span>
      <span class="visit-service">{{ serviceName }}</span>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <span class="stat-value">{{ waitTime }}s</span>
        <span class="stat-label">espera</span>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <span class="stat-value">{{ attentionTime }}s</span>
        <span class="stat-label">atencion</span>
      </div>
    </div>

    <div class="rating-section">
      <span class="rating-label">¿Como fue tu experiencia?</span>
      <div class="stars">
        <svg v-for="i in 4" :key="i" viewBox="0 0 24 24" fill="currentColor" class="star-filled">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <svg viewBox="0 0 24 24" fill="currentColor" class="star-empty">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
    </div>

    <button class="restart-btn" @click="emit('restart')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
      <span>Nuevo turno</span>
    </button>
  </div>
</template>

<style scoped>
.screen-complete {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0a0a12;
  color: white;
  padding: 20px 16px;
}

.success-badge {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10B981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.4);
}

@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.success-badge svg {
  width: 32px;
  height: 32px;
  color: white;
  stroke-dasharray: 28;
  stroke-dashoffset: 28;
  animation: drawCheck 0.3s ease-out 0.25s forwards;
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

.complete-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.visit-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 18px;
}

.visit-entity {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}

.visit-service {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
  color: #6C3AE8;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #6C3AE8;
}

.stat-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.rating-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

.stars {
  display: flex;
  gap: 6px;
}

.star-filled {
  width: 26px;
  height: 26px;
  color: #F59E0B;
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.4));
  cursor: pointer;
  transition: transform 0.15s ease;
}

.star-filled:hover {
  transform: scale(1.2);
}

.star-empty {
  width: 26px;
  height: 26px;
  color: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.star-empty:hover {
  transform: scale(1.2);
}

.restart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6C3AE8, #8B5CF6);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(108, 58, 232, 0.35);
  transition: all 0.2s ease;
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(108, 58, 232, 0.45);
}

.restart-btn:active {
  transform: scale(0.98);
}

.restart-btn svg {
  width: 18px;
  height: 18px;
}

@media (prefers-reduced-motion: reduce) {
  .success-badge,
  .success-badge svg,
  .stats-row,
  .stars,
  .restart-btn {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>