# TUTURNO — ESPECIFICACIONES TÉCNICAS Y DATOS PENDIENTES
## Documento de Implementación Detallada

**Proyecto:** TuTurno - Sistema de Gestión de Turnos Digitales
**Fecha:** Mayo 2026
**Versión:** 1.0
**Propósito:** Especificaciones técnicas y espacios de datos para que el usuario complete

---

## PARTE 1: DATOS PENDIENTES POR EL USUARIO

### 1.1 Información de Contacto

```
┌─────────────────────────────────────────────────────────────┐
│  📞 CONTACTOS TUTURNO                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Teléfono principal:     [ Tu número real ]                 │
│  WhatsApp Business:     [ +57 3XX XXX XXXX ]              │
│  Email contacto:        [ hola@tuturno.co ]               │
│  Email soporte:         [ soporte@tuturno.co ]             │
│                                                             │
│  Dirección oficina:     [ Dirección completa ]             │
│  Ciudad:               [ Montería / Bogotá / otra ]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Estadísticas Reales (para stats de landing)

```
┌─────────────────────────────────────────────────────────────┐
│  📊 ESTADÍSTICAS COLOMBIA (investigar datos reales)         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TIEMPOS DE ESPERA PROMEDIO:                                │
│  ──────────────────────────────────────────────────────     │
│  □ EPS en Montería:           [X] minutos                   │
│  □ EPS en Bogotá:             [X] minutos                   │
│  □ Bancos en Colombia:        [X] minutos                   │
│  □ Oficinas gobierno:         [X] minutos                   │
│                                                             │
│  FUENTE: [Ministerio de Salud / Asobancaria / Dane / otra] │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ESTADÍSTICAS TUTURNO (cuando tenga datos):                  │
│  ──────────────────────────────────────────────────────     │
│  □ Turnos totales procesados:     [ NÚMERO ]              │
│  □ Entidades activas:              [ NÚMERO ]              │
│  □ Tiempo promedio espera:        [ X ] minutos            │
│  □ Satisfacción promedio (1-5):   [ X.X ]                 │
│  □ Turnos activos hoy:            [ NÚMERO ]               │
│  □ No-shows (quedan sin atender): [ X ]%                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Entidades y Servicios (para simulador)

```
┌─────────────────────────────────────────────────────────────┐
│  🏥 ENTIDADES PARA SIMULADOR (datos realistas colombianos)  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ENTIDAD PRINCIPAL (ejemplo EPS monitoreada):               │
│  ─────────────────────────────────────────────────────     │
│  Nombre:              [ EPS Suraría / EPS Saludar ]        │
│  Tipo:                 [ EPS / Banco / Oficina ]           │
│  Ciudad:               [ Montería ]                        │
│  Dirección:           [ Cra 46 #56-56 ]                   │
│  Teléfono:            [ +57 604 XXX XXXX ]                │
│                                                             │
│  SERVICIOS DISPONIBLES:                                     │
│  1. Nombre: [ Afiliaciones ]                               │
│     - Tiempo promedio: [ 5 ] minutos                       │
│     - Horario: [ 8:00 - 17:00 ]                           │
│                                                             │
│  2. Nombre: [ Entrega de carnets ]                        │
│     - Tiempo promedio: [ 3 ] minutos                       │
│     - Horario: [ 8:00 - 17:00 ]                           │
│                                                             │
│  3. Nombre: [ Cotizaciones ]                               │
│     - Tiempo promedio: [ 8 ] minutos                      │
│     - Horario: [ 8:00 - 12:00 ]                           │
│                                                             │
│  4. Nombre: [ Incapacidades ]                              │
│     - Tiempo promedio: [ 10 ] minutos                      │
│     - Horario: [ 8:00 - 11:00 ]                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CIUDADANOS DE EJEMPLO (nombres realistas colombianos):     │
│  ─────────────────────────────────────────────────────     │
│  1. Nombre: [ María del Pilar Gómez ]                      │
│     - Cédula: [ 1088945632 ]                              │
│     - Teléfono: [ 300 123 4567 ]                          │
│                                                             │
│  2. Nombre: [ Juan Carlos Mendoza ]                       │
│     - Cédula: [ 78562341 ]                                 │
│     - Teléfono: [ 310 987 6543 ]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## PARTE 2: SPECIFICATIONS TÉCNICAS DETALLADAS

### 2.1 UiLogo — Variant Handwritten

**Ubicación:** `components/ui/UiLogo.vue`

```typescript
// INTERFAZ ACTUAL
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  animated?: boolean
}

// NUEVA INTERFAZ
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  animated?: boolean
  variant?: 'default' | 'handwritten' | 'icon-only'  // NUEVO
  showLogoMark?: boolean  // true por defecto
}
```

**VARIANTS:**
- `default`: Logo completo con texto "TuTurno" en Unbounded bold
- `handwritten`: "Tu" en Unbounded + "Turno" en Caveat (handwritten style)
- `icon-only`: Solo el icon sin texto (para mobile menu)

**FONTS PARA VARIANT HANDWRITTEN:**
```css
/* Google Fonts: Caveat */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');

/* O alternativa: Dancing Script */
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
```

**IMPLEMENTACIÓN ESTILOS:**
```vue
<!-- variant="handwritten" -->
<template>
  <NuxtLink to="/" class="flex items-center gap-3 group">
    <!-- Logo Mark (ícono de reloj/ticket) -->
    <div v-if="showLogoMark" class="icon-container">
      <!-- SVG del logo -->
    </div>

    <!-- Text Container -->
    <div class="text-container flex">
      <span class="logo-tu">Tu</span>
      <span class="logo-turno">Turno</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.logo-tu {
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.02em;
}

.logo-turno {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  /* Efecto de escritura a mano */
  letter-spacing: 0.02em;
  transform: rotate(-1deg);
}
</style>
```

### 2.2 LandingHeader — Glass Enhancement

**Ubicación:** `components/landing/LandingHeader.vue`

**MEJORAS:**
1. Backdrop blur más pronunciado: `blur(24px)` → `blur(32px)`
2. Background más sólido: `bg-[--bg-base]/90` → `bg-[--bg-base]/85`
3. Border más sutil: `border-white/[0.05]` → `border-white/[0.03]`
4. Shadow más pronunciada en scroll

```css
/* Estado scrolled mejorado */
.header-scrolled {
  background: oklch(8% 0.01 280 / 0.90);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border-bottom: 1px solid oklch(100% 0 0 / 0.04);
  box-shadow: 0 12px 48px oklch(0 0 0 / 0.4);
}
```

**MOBILE MENU ANIMATIONS:**
```css
/* Slide-in desde arriba */
.mobile-menu-enter-active {
  animation: mobileMenuSlideIn 300ms var(--ease-out) forwards;
}

.mobile-menu-leave-active {
  animation: mobileMenuSlideOut 200ms var(--ease-out) forwards;
}

@keyframes mobileMenuSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger para links */
.nav-link {
  animation: navLinkFadeIn 200ms var(--ease-out) forwards;
  animation-delay: calc(var(--index) * 50ms);
  opacity: 0;
}

@keyframes navLinkFadeIn {
  to { opacity: 1; }
}
```

### 2.3 LandingHeroNew — Hero Completo

**Ubicación:** `components/landing/LandingHeroNew.vue`

**NUEVA ESTRUCTURA:**
```
┌─────────────────────────────────────────────────────────────┐
│  <section class="relative min-h-[100dvh] flex items-center">
│                                                             │
│    {/* Background layers */}
│    <div class="absolute inset-0 bg-gradient-to-br..." />
│    <div class="absolute top-glow blur-glow" />
│    <div class="absolute bottom-glow blur-glow" />
│                                                             │
│    {/* Main content container */}
│    <div class="relative z-10 max-w-7xl mx-auto px-4...">
│      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
│                                                             │
│        {/* LEFT: Text content (7 cols) */}
│        <div class="lg:col-span-7">
│          <p class="logo-handwritten ...">TuTurno</p>
│          <h1 class="hero-subtitle ...">Deja de esperar...</h1>
│          <p class="hero-description ...">...</p>
│          <div class="hero-ctas ...">
│            <NuxtLink to="/auth/register" class="btn-primary">
│              Solicitar mi turno
│            </NuxtLink>
│            <a href="#como-funciona" class="btn-secondary">
│              Conoce cómo funciona
│            </a>
│          </div>
│          <div class="trust-badges ...">
│            {/* 3 badges */}
│          </div>
│        </div>
│                                                             │
│        {/* RIGHT: Phone Simulator (5 cols) */}
│        <div class="lg:col-span-5">
│          <HeroSimulator />
│        </div>
│                                                             │
│      </div>
│    </div>
│  </section>
└─────────────────────────────────────────────────────────────┘
```

**LETTERING "TuTurno" EFFECT:**
```css
/* Para el logo en hero */
.hero-logo {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3rem, 8vw, 5rem);
  letter-spacing: -0.03em;
  line-height: 1;

  /* Gradient text */
  background: linear-gradient(
    135deg,
    oklch(98% 0.01 280) 0%,
    oklch(75% 0.12 280) 40%,
    oklch(98% 0.01 280) 60%,
    oklch(65% 0.15 280) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  /* Subtle animation */
  animation: heroLogoShimmer 3s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes heroLogoShimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 2.4 Phone Simulator — Pantallas Detalladas

**UBICACIÓN:** `components/landing/simulator/`

#### A. ScreenHome.vue (Pantalla inicio app)

```vue
<template>
  <div class="screen-home">
    <!-- Header con logo y ubicación -->
    <div class="header">
      <div class="logo-small">
        <span class="text-white font-bold">TuTurno</span>
      </div>
      <div class="location">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <span>Montería, Córdoba</span>
      </div>
    </div>

    <!-- Search bar -->
    <div class="search-bar">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input type="text" placeholder="Busca tu EPS, banco u oficina..." />
    </div>

    <!-- entidades recientes -->
    <div class="section">
      <h3>Tus entidades recientes</h3>
      <div class="entity-list">
        <div class="entity-card">
          <div class="entity-icon">🏥</div>
          <div class="entity-info">
            <span class="entity-name">EPS Saludar</span>
            <span class="entity-address">Cra 46 #56-56, Montería</span>
          </div>
          <div class="entity-status open">Abierto</div>
        </div>
        <div class="entity-card">
          <div class="entity-icon">🏦</div>
          <div class="entity-info">
            <span class="entity-name">Bancolombia Centro</span>
            <span class="entity-address">Calle 41 #56-56, Montería</span>
          </div>
          <div class="entity-status open">Abierto</div>
        </div>
      </div>
    </div>

    <!-- Services shortcuts -->
    <div class="section">
      <h3>Servicios más solicitados</h3>
      <div class="services-grid">
        <button class="service-btn">
          <span class="icon">📋</span>
          <span>Afiliaciones</span>
        </button>
        <button class="service-btn">
          <span class="icon">🪪</span>
          <span>Carnets</span>
        </button>
        <button class="service-btn">
          <span class="icon">💰</span>
          <span>Cotizaciones</span>
        </button>
        <button class="service-btn">
          <span class="icon">📄</span>
          <span>Incapacidades</span>
        </button>
      </div>
    </div>

    <!-- Bottom nav -->
    <div class="bottom-nav">
      <button class="nav-item active">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>Inicio</span>
      </button>
      <button class="nav-item">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <span>Entidades</span>
      </button>
      <button class="nav-item">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        <span>Mis turnos</span>
      </button>
    </div>
  </div>
</template>
```

#### B. ScreenEntityDetail.vue (Detalle de entidad)

```vue
<template>
  <div class="screen-entity">
    <!-- Back button + entity name -->
    <div class="header">
      <button class="back-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1>EPS Saludar</h1>
    </div>

    <!-- Entity info card -->
    <div class="entity-card">
      <div class="entity-badge">EPS</div>
      <p class="entity-address">Cra 46 #56-56, Montería</p>
      <p class="entity-hours">Abierto · Cierra 5:00 PM</p>
      <div class="rating">
        <span class="stars">★★★☆☆</span>
        <span class="score">4.2</span>
        <span class="reviews">(127 reseñas)</span>
      </div>
    </div>

    <!-- Services list -->
    <div class="services-section">
      <h2>Selecciona el servicio</h2>
      <div class="services-list">
        <button class="service-item" @action="$emit('action')">
          <div class="service-info">
            <span class="service-name">Afiliaciones y novedades</span>
            <span class="service-time">~5 min de atención</span>
          </div>
          <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="service-item">
          <div class="service-info">
            <span class="service-name">Entrega de carnets</span>
            <span class="service-time">~3 min de atención</span>
          </div>
          <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button class="service-item">
          <div class="service-info">
            <span class="service-name">Cotización手术后</span>
            <span class="service-time">~8 min de atención</span>
          </div>
          <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
```

#### C. ScreenRequestTurn.vue (Solicitar turno)

```vue
<template>
  <div class="screen-request">
    <!-- Header -->
    <div class="header">
      <span class="step-indicator">Paso 2 de 3</span>
    </div>

    <!-- Turno solicitado -->
    <div class="turn-display">
      <p class="turn-label">Tu turno es</p>
      <p class="turn-number">A-047</p>
      <p class="turn-position">Posición #7 en cola</p>
    </div>

    <!-- Queue info -->
    <div class="queue-info">
      <div class="info-card">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <span class="info-label">Tiempo estimado</span>
          <span class="info-value">~25 minutos</span>
        </div>
      </div>
      <div class="info-card">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
        </svg>
        <div>
          <span class="info-label">Personas adelante</span>
          <span class="info-value">6</span>
        </div>
      </div>
    </div>

    <!-- QR Code placeholder -->
    <div class="qr-section">
      <div class="qr-code">
        <div class="qr-placeholder"></div>
      </div>
      <p class="qr-instruction">Muestra este código cuando te llamen</p>
    </div>

    <!-- Action button -->
    <button class="action-btn" @action="$emit('action')">
      Ver mi turno en tiempo real
    </button>
  </div>
</template>
```

#### D. ScreenTracking.vue (Seguimiento en tiempo real)

```vue
<template>
  <div class="screen-tracking">
    <!-- Entity info -->
    <div class="entity-bar">
      <span class="entity-name">EPS Saludar</span>
      <span class="service-name">Afiliaciones</span>
    </div>

    <!-- Turn display -->
    <div class="turn-section">
      <p class="your-turn">Tu turno</p>
      <p class="turn-number-large">A-047</p>
    </div>

    <!-- Progress bar -->
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-labels">
        <span>Esperando</span>
        <span>Te llaman</span>
        <span>Tu turno</span>
      </div>
    </div>

    <!-- Queue status -->
    <div class="status-card">
      <div class="status-row">
        <span class="status-label">Posición actual</span>
        <span class="status-value highlight">#7</span>
      </div>
      <div class="status-row">
        <span class="status-label">Turno siendo atendido</span>
        <span class="status-value">{{ currentTurnNumber }}</span>
      </div>
      <div class="status-row">
        <span class="status-label">Tiempo estimado</span>
        <span class="status-value">~12 min</span>
      </div>
    </div>

    <!-- Notification message -->
    <div class="notification-msg" v-if="queuePosition <= 3">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>
      <span>¡Te quedan 3 turnos! Prepárate.</span>
    </div>

    <!-- Action hint -->
    <p class="action-hint">Te notificaremos cuando sea tu turno</p>
  </div>
</template>
```

#### E. ScreenNotification.vue (Notificación de turno listo)

```vue
<template>
  <div class="screen-notification">
    <!-- Animated bell/icon -->
    <div class="notification-icon">
      <svg class="bell" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>
    </div>

    <div class="content">
      <h1>¡Es tu turno!</h1>
      <p class="turn-info">
        Turno <span class="turn-number">A-047</span> en EPS Saludar
      </p>
      <p class="instruction">Preséntate en el escritorio indicated.</p>

      <div class="countdown">
        <span class="countdown-label">Dirígete ahora</span>
        <span class="countdown-time">{{ countdown }}s</span>
      </div>
    </div>
  </div>
</template>
```

#### F. ScreenComplete.vue (Turno completado)

```vue
<template>
  <div class="screen-complete">
    <!-- Checkmark animation -->
    <div class="success-icon">
      <svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7"/>
      </svg>
    </div>

    <div class="content">
      <h1>¡Turno completado!</h1>
      <p class="turn-info">
        Turno <span class="turn-number">A-047</span> atendido en
        <span class="wait-time">{{ waitTime }} min</span>
      </p>
    </div>

    <!-- Loop indicator -->
    <div class="loop-indicator">
      <span class="loop-label">Reiniciando demo...</span>
      <div class="loop-dots">
        <span class="dot" v-for="i in 3" :key="i" :class="{ active: i <= loopCount }"></span>
      </div>
    </div>
  </div>
</template>
```

### 2.5 SimulatorControls — Controles Mejorados

**Ubicación:** `components/landing/simulator/SimulatorControls.vue`

```vue
<template>
  <div class="simulator-controls">
    <!-- Progress dots -->
    <div class="progress-dots">
      <span
        v-for="i in totalScreens"
        :key="i"
        class="dot"
        :class="{ active: i === currentScreenIndex }"
      />
    </div>

    <!-- Control buttons -->
    <div class="controls">
      <button
        class="control-btn"
        @click="$emit('prev')"
        :disabled="!canGoBack"
        aria-label="Anterior"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <button
        class="control-btn play-pause"
        @click="$emit('toggle-auto-play')"
        :aria-label="isAutoPlaying ? 'Pausar' : 'Reproducir'"
      >
        <svg v-if="!isAutoPlaying" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      </button>

      <button
        class="control-btn"
        @click="$emit('next')"
        aria-label="Siguiente"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <button
        class="control-btn reset"
        @click="$emit('reset')"
        aria-label="Reiniciar"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m0 0a8.001 8.001 0 0114.607 2.108l.688 1.052m-2.295 2.295a8.001 8.001 0 01-12.585-3.04L4.001 7.5M4 4v5h.582m0 0a8.001 8.001 0 0114.607 2.108l.688 1.052"/>
        </svg>
      </button>
    </div>

    <!-- Control label -->
    <span class="control-label">{{ controlLabel }}</span>
  </div>
</template>

<style scoped>
.simulator-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.progress-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: oklch(50% 0.02 280 / 0.3);
  transition: all 200ms var(--ease-out);
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: oklch(55% 0.15 280);
}

.controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: oklch(20% 0.02 280);
  border: 1px solid oklch(100% 0 0 / 0.08);
  color: oklch(72% 0.02 280);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms var(--ease-out);
}

.control-btn:hover:not(:disabled) {
  background: oklch(25% 0.02 280);
  color: oklch(98% 0.01 280);
  transform: scale(1.05);
}

.control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn.play-pause {
  width: 48px;
  height: 48px;
  background: oklch(55% 0.15 280);
  color: white;
}

.control-btn.play-pause:hover {
  background: oklch(60% 0.15 280);
}

.control-label {
  font-size: 0.75rem;
  color: oklch(50% 0.02 280);
}
</style>
```

### 2.6 SolutionsTabs — Tabs para Soluciones

**COMPONENTE NUEVO:** `components/landing/sections/LandingSolutionsTabs.vue`

```vue
<template>
  <section class="solutions-section">
    <!-- Tab buttons -->
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="tab-icon" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab indicator (animated) -->
    <div class="tab-indicator" :style="indicatorStyle" />

    <!-- Tab content -->
    <Transition name="tab-fade" mode="out-in">
      <div :key="activeTab" class="tab-content">
        <component :is="activeComponent" />
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
const tabs = [
  {
    id: 'citizens',
    label: 'Ciudadanos',
    icon: 'IconUser',
    component: 'SolutionsForCitizens',
  },
  {
    id: 'entities',
    label: 'Entidades',
    icon: 'IconBuilding',
    component: 'SolutionsForEntities',
  },
  {
    id: 'operators',
    label: 'Operadores',
    icon: 'IconHeadset',
    component: 'SolutionsForOperators',
  },
]

const activeTab = ref('citizens')

const activeComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.component
})

const indicatorStyle = computed(() => {
  const index = tabs.findIndex(t => t.id === activeTab.value)
  return {
    transform: `translateX(${index * 100}%)`,
  }
})
</script>

<style scoped>
.tabs-container {
  display: flex;
  gap: 4px;
  background: oklch(12% 0.02 280);
  border-radius: 16px;
  padding: 4px;
  position: relative;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: oklch(72% 0.02 280);
  transition: color 200ms var(--ease-out);
  position: relative;
  z-index: 1;
}

.tab-btn.active {
  color: oklch(98% 0.01 280);
}

.tab-icon {
  width: 18px;
  height: 18px;
}

.tab-indicator {
  display: none; /* Solo visible en mobile si es necesario */
}

@media (max-width: 768px) {
  .tab-btn {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .tab-btn span {
    display: none; /* Mostrar solo iconos en mobile */
  }
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
```

---

## PARTE 3: ANIMACIONES — KEYFRAMES COMPLETOS

### 3.1 Scroll Reveal

```css
/* Scroll reveal base */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 600ms var(--ease-out),
    transform 600ms var(--ease-out);
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays */
.reveal-delay-1 { transition-delay: 100ms; }
.reveal-delay-2 { transition-delay: 200ms; }
.reveal-delay-3 { transition-delay: 300ms; }
.reveal-delay-4 { transition-delay: 400ms; }
.reveal-delay-5 { transition-delay: 500ms; }
```

### 3.2 Hero Animations

```css
/* Logo reveal con blur */
@keyframes heroLogoReveal {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

/* Subtitle reveal */
@keyframes heroSubtitleReveal {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered badge animation */
@keyframes badgeFadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3.3 Phone Simulator

```css
/* Phone float animation */
@keyframes phoneFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0.3deg);
  }
  50% {
    transform: translateY(-12px) rotate(0.5deg);
  }
}

/* Screen slide transitions */
.screen-slide-enter-active {
  animation: screenSlideIn 300ms var(--ease-out);
}

.screen-slide-leave-active {
  animation: screenSlideOut 200ms var(--ease-out);
}

@keyframes screenSlideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes screenSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
}
```

### 3.4 Button Press Feedback

```css
/* Button press */
.btn-press:active {
  transform: scale(0.97);
}

/* Magnetic hover effect (optional, for desktop) */
@media (hover: hover) and (pointer: fine) {
  .btn-magnetic:hover {
    transform: translateY(-2px);
  }
}
```

### 3.5 Count-Up Animation

```typescript
// composables/useCountUp.ts
export function useCountUp(
  target: Ref<number>,
  duration: number = 1500,
) {
  const current = ref(0)
  const isAnimating = ref(false)

  function animate() {
    const startTime = performance.now()
    const startValue = current.value
    const endValue = target.value

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      current.value = Math.round(startValue + (endValue - startValue) * eased)

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        isAnimating.value = false
      }
    }

    isAnimating.value = true
    requestAnimationFrame(update)
  }

  return { current, animate, isAnimating }
}
```

### 3.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }

  .phone-float {
    animation: none !important;
  }
}
```

---

## PARTE 4: RESPONSIVE BREAKPOINTS Y SPECS

### 4.1 Header Responsive

| Breakpoint | Layout | Logo | Nav | Auth |
|------------|--------|------|-----|------|
| < 640px | Compact | md | Hidden (hamburger) | Icon only |
| 640-1023px | Full | md | Hidden (hamburger) | Full buttons |
| ≥ 1024px | Full | lg | Full nav | Full buttons |

### 4.2 Hero Responsive

| Breakpoint | Layout | Text | Phone Simulator |
|------------|--------|------|-----------------|
| < 768px | Stacked | Full width, centered | 75vw max, centered |
| 768-1023px | Side by side | 60% | 40%, scaled 0.85 |
| ≥ 1024px | Side by side | 55% | 45%, scaled 1.0 |

### 4.3 How It Works Responsive

| Breakpoint | Layout | Visual |
|------------|--------|--------|
| < 640px | Vertical stack | Numbered list, horizontal lines |
| 640-1023px | 2x2 grid | Cards with top numbers |
| ≥ 1024px | 4 columns | Horizontal layout with connecting line |

### 4.4 Features Responsive

| Breakpoint | Columns |
|------------|---------|
| < 640px | 1 column |
| 640-1023px | 2 columns |
| ≥ 1024px | 4 columns |

### 4.5 Footer Responsive

| Breakpoint | Layout |
|------------|--------|
| < 640px | Stack, brand info only |
| 640-1023px | 2x2 grid of links |
| ≥ 1024px | Brand left (4 cols), links right (8 cols) |

---

## PARTE 5: CHECKLIST FINAL DE IMPLEMENTACIÓN

### 5.1 Sistema de Diseño
- [ ] Actualizar `main.css` con variables OKLCH
- [ ] Agregar Google Font Caveat
- [ ] Actualizar `tailwind.config.ts`
- [ ] Verificar todos los componentes usan variables CSS

### 5.2 Landing Page
- [ ] Implementar UiLogo variant handwritten
- [ ] Mejorar LandingHeader con glass mejorado
- [ ] Rediseñar LandingHeroNew con lettering effect
- [ ] Expandir HeroSimulator con más pantallas
- [ ] Implementar LandingHowItWorks con copy mejorado
- [ ] Crear LandingSolutionsTabs component
- [ ] Implementar LandingFeatures para cada tab
- [ ] Mejorar LandingCTA con mejor copy
- [ ] Actualizar LandingFooter con datos reales

### 5.3 Auth Pages
- [ ] Rediseñar layout auth (40/60 split)
- [ ] Agregar PhoneSimulator pequeño al brand side
- [ ] Actualizar login copy
- [ ] Actualizar register copy
- [ ] Implementar forgot password flow
- [ ] Agregar toast notifications (useToast)

### 5.4 Animaciones
- [ ] Implementar useScrollReveal composable
- [ ] Agregar staggered animations
- [ ] Implementar useCountUp composable
- [ ] Agregar reduced motion support
- [ ] Optimizar performance (lazy loading)

### 5.5 Content
- [ ] Llenar datos de contacto reales
- [ ] Investigar tiempos de espera Colombia
- [ ] Agregar estadísticas reales cuando estén disponibles
- [ ] Actualizar copy con voz de startup

---

*Documento de especificaciones para TuTurno — Universidad de Córdoba*
*Mayo 2026*
