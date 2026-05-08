<script setup lang="ts">
const city = 'Montería, Córdoba'

defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="screen-home">
    <div class="app-header">
      <div class="app-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="9" stroke-dasharray="56.5 9"/>
          <path d="M12 7V12L15 15"/>
        </svg>
      </div>
      <span class="app-name">TuTurno</span>
      <div class="app-location">
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
        </svg>
        <span>{{ city }}</span>
      </div>
    </div>

    <div class="search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <span>Busca tu EPS, banco u oficina...</span>
    </div>

    <div class="section-head">
      <span class="section-title">Tus entidades recientes</span>
    </div>

    <div class="entity-card">
      <div class="entity-icon">🏥</div>
      <div class="entity-body">
        <span class="entity-name">EPS Saludar</span>
        <span class="entity-addr">Cra 46 #56-56, Montería</span>
        <div class="entity-meta">
          <span class="meta-tag">~5 min</span>
          <span class="meta-dot">·</span>
          <span class="meta-txt">4 personas</span>
        </div>
      </div>
      <div class="entity-status open">Abierto</div>
    </div>

    <div class="entity-card">
      <div class="entity-icon">🏦</div>
      <div class="entity-body">
        <span class="entity-name">Bancolombia Centro</span>
        <span class="entity-addr">Calle 41 #56-56, Montería</span>
        <div class="entity-meta">
          <span class="meta-tag">~3 min</span>
          <span class="meta-dot">·</span>
          <span class="meta-txt">2 personas</span>
        </div>
      </div>
      <div class="entity-status open">Abierto</div>
    </div>

    <div class="section-head">
      <span class="section-title">Servicios más solicitados</span>
    </div>

    <div class="services-grid">
      <button class="service-btn">
        <span class="service-icon">📋</span>
        <span>Afiliaciones</span>
      </button>
      <button class="service-btn">
        <span class="service-icon">🪪</span>
        <span>Carnets</span>
      </button>
      <button class="service-btn">
        <span class="service-icon">💰</span>
        <span>Cotizaciones</span>
      </button>
      <button class="service-btn">
        <span class="service-icon">📄</span>
        <span>Incapacidades</span>
      </button>
    </div>

    <nav class="bottom-nav">
      <div class="nav-item active">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>Inicio</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <span>Entidades</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
        <span>Mis turnos</span>
      </div>
    </nav>

    <button class="continue-btn" @click="$emit('action')">
      <span>Comenzar</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.screen-home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0a0a12;
  color: white;
  padding: 12px 16px;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.app-logo {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6C3AE8, #A78BFA);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-logo svg {
  width: 14px;
  height: 14px;
  color: white;
}

.app-name {
  font-size: 15px;
  font-weight: 700;
  color: white;
}

.app-location {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  margin-bottom: 14px;
}

.search-box svg {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.35);
}

.search-box span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
}

.entity-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.entity-card:active {
  transform: scale(0.98);
  background: rgba(108, 58, 232, 0.1);
  border-color: rgba(108, 58, 232, 0.3);
}

.entity-icon {
  width: 44px;
  height: 44px;
  background: rgba(108, 58, 232, 0.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.entity-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.entity-name {
  font-size: 14px;
  font-weight: 600;
}

.entity-addr {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
}

.entity-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;
}

.meta-tag {
  font-size: 10px;
  font-weight: 600;
  color: #6C3AE8;
  background: rgba(108, 58, 232, 0.12);
  padding: 2px 6px;
  border-radius: 5px;
}

.meta-dot {
  color: rgba(255, 255, 255, 0.25);
}

.meta-txt {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
}

.entity-status {
  font-size: 9px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.entity-status.open {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.service-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(108, 58, 232, 0.08);
  border: 1px solid rgba(108, 58, 232, 0.15);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.service-btn:active {
  transform: scale(0.97);
  background: rgba(108, 58, 232, 0.15);
}

.service-icon {
  font-size: 16px;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: rgba(255, 255, 255, 0.25);
}

.nav-item svg {
  width: 20px;
  height: 20px;
}

.nav-item span {
  font-size: 9px;
}

.nav-item.active {
  color: #6C3AE8;
}

.continue-btn {
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
  box-shadow: 0 8px 25px rgba(108, 58, 232, 0.35);
  transition: all 0.2s ease;
  margin-top: 12px;
}

.continue-btn:active {
  transform: scale(0.98);
}

.continue-btn svg {
  width: 18px;
  height: 18px;
}
</style>