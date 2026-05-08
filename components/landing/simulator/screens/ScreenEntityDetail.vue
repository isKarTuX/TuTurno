<script setup lang="ts">
interface Props {
  entityName: string
  serviceName: string
}

defineProps<Props>()

defineEmits<{
  (e: 'action' | 'back'): void
}>()
</script>

<template>
  <div class="screen-entity">
    <div class="header">
      <button class="back-btn" @click.stop="$emit('back')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="header-title">{{ entityName }}</span>
      <div class="header-spacer" />
    </div>

    <div class="entity-hero">
      <div class="entity-badge">EPS</div>
      <p class="entity-address">Cra 46 #56-56, Montería</p>
      <div class="entity-hours">
        <span class="hours-dot" />
        <span>Abierto · Cierra 5:00 PM</span>
      </div>
      <div class="rating">
        <span class="stars">★★★★☆</span>
        <span class="score">4.2</span>
        <span class="reviews">(127 reseñas)</span>
      </div>
    </div>

    <div class="section-head">Selecciona el servicio</div>

    <div class="services-list">
      <button class="service-item" @click.stop="$emit('action')">
        <div class="service-info">
          <span class="service-name">Afiliaciones y novedades</span>
          <span class="service-time">~5 min de atención</span>
        </div>
        <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <button class="service-item" @click.stop="$emit('action')">
        <div class="service-info">
          <span class="service-name">Entrega de carnets</span>
          <span class="service-time">~3 min de atención</span>
        </div>
        <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <button class="service-item" @click.stop="$emit('action')">
        <div class="service-info">
          <span class="service-name">Cotización手术后</span>
          <span class="service-time">~8 min de atención</span>
        </div>
        <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <button class="service-item" @click.stop="$emit('action')">
        <div class="service-info">
          <span class="service-name">Incapacidades</span>
          <span class="service-time">~10 min de atención</span>
        </div>
        <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.screen-entity {
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
  margin-bottom: 16px;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
}

.header-spacer {
  width: 32px;
}

.entity-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  margin-bottom: 16px;
}

.entity-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6C3AE8;
  background: rgba(108, 58, 232, 0.15);
  padding: 3px 10px;
  border-radius: 6px;
}

.entity-address {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.entity-hours {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #10B981;
}

.hours-dot {
  width: 6px;
  height: 6px;
  background: #10B981;
  border-radius: 50%;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  margin-top: 4px;
}

.stars {
  color: #F59E0B;
}

.score {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.reviews {
  color: rgba(255, 255, 255, 0.4);
}

.section-head {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 10px;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.service-item:active {
  transform: scale(0.98);
  background: rgba(108, 58, 232, 0.1);
  border-color: rgba(108, 58, 232, 0.3);
}

.service-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.service-name {
  font-size: 14px;
  font-weight: 600;
}

.service-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

.chevron {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.3);
}
</style>