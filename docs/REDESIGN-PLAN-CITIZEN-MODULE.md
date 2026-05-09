# TuTurno — Redesign Plan: Módulo Ciudadano

## Contexto y Visión

**IMPECCABLE_PREFLIGHT:** context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:mockups_en_fase_posterior mutation=pending

Transformar TuTurno de "otra página de turnos" a **la referencia en gestión digital de turnos** en Latinoamérica. El citizen module debe sentirse como una **startup de tech premium** — no un panel administrativo genérico. Cada interacción debe comunicar: "esto fue construido por personas que entienden diseño y performance".

La marca **TuTurno** debe ser omnipresente pero elegante — nunca intrusiva. El usuario debe sentir que está usando una herramienta poderosa, no llenando un formulario burocrático.

---

## 1. Design Language Integration

### 1.1 Palette & Color Strategy

**Estrategia:** Committed — violeta como identidad, zinc oscuro como base.

```
/* Primary - TuTurno Violet */
--color-primary:        oklch(55% 0.18 285);     /* #6C3AE8 - El violeta TuTurno */
--color-primary-light:  oklch(72% 0.16 285);     /* #A78BFA */
--color-primary-dark:   oklch(40% 0.15 285);     /* #4C1D95 */

/* Backgrounds - Zinc tintado hacia violeta */
--bg-base:     oklch(13% 0.015 285);   /* #0D0D14 - Fondo principal */
--bg-surface:  oklch(16% 0.015 285);   /* #13131F - Cards, paneles */
--bg-elevated: oklch(20% 0.015 285);   /* #1A1A2E - Elementos elevados */
--bg-overlay:  oklch(24% 0.015 285);   /* #1F1F35 - Modals, overlays */

/* Glass system - Glassmorphism refinado */
--glass-bg:       oklch(100% 0 0 / 0.04);
--glass-border:   oklch(100% 0 0 / 0.10);
--glass-shadow:   0 8px 32px oklch(55% 0.18 285 / 0.15);
--glass-blur:     blur(16px);

/* Turn Status Colors */
--turn-waiting:   oklch(55% 0.18 285);   /* violeta - en espera */
--turn-called:   oklch(75% 0.16 45);    /* ámbar - llamado */
--turn-attending: oklch(65% 0.15 235);  /* azul - atendiendo */
--turn-completed: oklch(70% 0.15 160);  /* verde - completado */
--turn-no-show:   oklch(60% 0.18 25);   /* rojo - no asistió */
```

**Regla 1 (design-taste-frontend):** Max 1 Accent Color. El violeta es EL color. No diluir con azules o verdes como "secundarios" en elementos interactivos. Los estados de turno son informativos, no interactivos.

**Regla 2 (impeccable):** Nunca `#000` ni `#fff`. Usar `oklch(0% 0 0)` y `oklch(100% 0 0)` con tinte violeta.

### 1.2 Typography System

```css
/* Stack: Geist (display) + DM Sans (body) - Ya configurado en nuxt.config */

/* Scale */
--text-display:  clamp(2.5rem, 5vw + 1rem, 4.5rem);  /* Hero, headers principales */
--text-h1:       clamp(2rem, 3vw + 1rem, 3rem);       /* Títulos de sección */
--text-h2:       clamp(1.5rem, 2vw + 0.5rem, 2rem);  /* Subtítulos */
--text-h3:       1.25rem;                              /* Componentes */
--text-body:     1rem;                                  /* Texto normal */
--text-small:    0.875rem;                             /* Labels, hints */
--text-micro:    0.75rem;                              /* Badges pequeños */

/* Tracking */
--tracking-tight:  -0.02em;   /* Headlines */
--tracking-normal:  0em;       /* Body */
--tracking-wide:     0.02em;   /* Labels, badges */

/* Leading */
--leading-none:   1;          /* Headlines */
--leading-snug:   1.25;        /* Subtítulos */
--leading-relaxed: 1.625;      /* Body text */
```

**Aplicación:**
- Logo "TuTurno": `text-display font-bold tracking-tight` + gradient mask animation
- Headlines: `text-h1 font-semibold tracking-tight leading-none`
- Body: `text-base text-zinc-400 leading-relaxed max-w-[65ch]`

### 1.3 Motion Philosophy

**Framework:** CSS-first (performance), Framer Motion para interacciones complejas.

**Niveles de motion por frecuencia (emil-design-eng):**

| Frecuencia | Elemento | Motion | Duración |
|------------|----------|--------|----------|
| 100+/día | Navegación, tabs | Sin animación | 0ms |
| 10-50/día | Botones hover | `transform: scale(1.02)` | 150ms |
| 1-10/día | Cards, modals | `translateY + opacity` | 200-300ms |
| Ocasional | Loading states | Skeleton shimmer | Infinito |
| First-time | Onboarding, success | Celebración | 400-600ms |

**Curvas de easing (emil-design-eng):**

```css
/* Strong ease-out para UI interactions */
--ease-out:     cubic-bezier(0.23, 1, 0.32, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Strong ease-in-out para movimiento en pantalla */
--ease-in-out:  cubic-bezier(0.77, 0, 0.175, 1);

/* Spring-like para elementos "vivos" */
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Reglas críticas (emil-design-eng):**
- `transform: scale(0.97)` en `:active` para TODOS los botones —触感反馈
- Nunca `scale(0)` — usar `scale(0.95) + opacity: 0`
- Nunca `ease-in` para elementos UI — siempre `ease-out`
- UI animations < 300ms
- Soporte `prefers-reduced-motion`

---

## 2. Layout Architecture

### 2.1 Citizen App Layout (layouts/citizen.vue)

**Estado actual:** Navbar simple + BottomNav + max-w-4xl centrado.

**Rediseño:**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER STICKY (glass, blur, border-bottom)            │
│  ┌─────────────────────────────────────────────────────┐│
│  │ [Logo TuTurno]              [Notifs] [Avatar]      ││
│  └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  MAIN CONTENT (scrollable, padding dinámico)           │
│  ┌─────────────────────────────────────────────────────┐│
│  │                                                     ││
│  │  [Page Content - full bleed en mobile]              ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
├─────────────────────────────────────────────────────────┤
│  BOTTOM NAV (glass, safe-area-aware)                   │
│  ┌─────────────────────────────────────────────────────┐│
│  │  [Home]  [Mis Turnos]  [Entidades]  [Perfil]        ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Cambios clave:**
1. **Header glass más refinado:** `backdrop-blur-xl` + `border-b border-white/5` + `shadow-lg`
2. **Content area sin max-width en desktop:** Permite experiencias más ricas
3. **Bottom nav con indicador activo animado:** El item activo tiene pill indicator que transiciona
4. **Transiciones de página:** Fade + slight slide (200ms)

### 2.2 Page Flow del Ciudadano

```
/app (Home)
    │
    ├── Búsqueda de entidades (autocomplete en tiempo real)
    ├── Entidades cercanas (mapa opcional)
    └── Turnos activos (mini cards)

/app/entities
    │
    └── Listado completo con filtros
        └── [id] → Detalle entidad + servicios

/app/entities/[id]
    │
    └── Servicios disponibles
        └── [serviceId] → Solicitar turno

/app/entities/[id]/[serviceId]
    │
    └── FORMULARIO DE SOLICITUD
        ├── Selección de preferencia horaria
        ├── Confirmación
        └── → Redirect a /app/turns/[id]

/app/turns
    │
    ├── Turnos activos (cards con tracking real-time)
    ├── Turnos completados/historial
    └── Empty state si no hay turnos

/app/turns/[id]
    │
    └── TRACKING EN VIVO
        ├── Número de turno grande (flip animation)
        ├── Posición en cola (progress bar)
        ├── Tiempo estimado
        ├── Estado del turno (badge animado)
        └── Notificaciones push status

/app/profile
    │
    ├── Datos personales (edición inline)
    ├── Notificaciones settings
    └── Historial de atención
```

---

## 3. Component Redesign

### 3.1 TurnCard — El componente estrella del ciudadano

**Estados:**
- `waiting` — Violeta, muestra posición #N
- `called` — Ámbar pulsante, "Te están llamando"
- `attending` — Azul, "Siendo atendido"
- `completed` — Verde, checkmark
- `cancelled` — Gris, tachado

**Estructura actual:** Card básica con información.

**Rediseño (Bento-inspired):**

```vue
<!-- Componente: TurnCard.vue -->
<template>
  <div
    class="group relative overflow-hidden rounded-3xl glass p-6"
    :class="statusClasses"
  >
    <!-- Glow effect para estados activos -->
    <div
      v-if="status === 'called' || status === 'attending'"
      class="absolute inset-0 opacity-30 animate-pulse-glow"
    />

    <!-- Header: Entidad + Status Badge -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <!-- Logo de entidad o icono del servicio -->
        <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
          <component :is="serviceIcon" class="w-6 h-6 text-white/80" />
        </div>
        <div>
          <h3 class="font-semibold text-white">{{ entityName }}</h3>
          <p class="text-sm text-white/60">{{ serviceName }}</p>
        </div>
      </div>
      <TurnStatusBadge :status="status" class="shrink-0" />
    </div>

    <!-- Turn Number - Principalidad visual -->
    <div class="flex items-baseline gap-2 mb-4">
      <span class="text-5xl font-bold tracking-tight text-white turn-flip">
        {{ turnNumber }}
      </span>
      <span class="text-lg text-white/40">#{{ queuePosition }}</span>
    </div>

    <!-- Progress indicator para waiting -->
    <div v-if="status === 'waiting'" class="mb-4">
      <TurnProgressBar :position="queuePosition" :total="waitingCount" />
      <p class="text-xs text-white/50 mt-2">
        Estimado: {{ estimatedWait }} min
      </p>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2 pt-4 border-t border-white/5">
      <UiButton
        v-if="status === 'waiting'"
        variant="ghost"
        size="sm"
        class="text-white/60 hover:text-white"
        @click="cancelTurn"
      >
        Cancelar
      </UiButton>
      <UiButton
        variant="primary"
        size="sm"
        class="flex-1"
        @click="viewDetails"
      >
        Ver detalles
      </UiButton>
    </div>

    <!-- Skeleton state -->
    <div v-if="loading" class="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <UiSkeleton variant="circular" class="w-12 h-12" />
        <UiSkeleton variant="text" class="w-32 h-4" />
        <UiSkeleton variant="text" class="w-24 h-8" />
      </div>
    </div>
  </div>
</template>
```

**Animaciones:**
- Card hover: `translateY(-4px)` + shadow intensifica (200ms ease-out)
- Status badge: Fade + scale desde 0.9 (150ms)
- Turn number: Flip animation en cambio de estado
- Skeleton: Shimmer gradient animation

### 3.2 TurnTicket — QR + Número + Info

**Propósito:** El comprobante que el ciudadano muestra cuando es llamado.

**Rediseño:**

```vue
<!-- Componente: TurnTicket.vue -->
<template>
  <div class="relative">
    <!-- Background con gradient sutil -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />

    <div class="relative glass rounded-3xl p-8 text-center">
      <!-- Logo TuTurno mini -->
      <div class="flex justify-center mb-6">
        <span class="text-2xl font-bold tracking-tight">
          Tu<span class="text-primary">Turno</span>
        </span>
      </div>

      <!-- Turn Number con flip animation -->
      <div class="mb-8">
        <TurnCounterDisplay :number="turnNumber" :key="turnNumber" />
        <p class="text-white/60 mt-2">Tu número de turno</p>
      </div>

      <!-- QR Code -->
      <div class="inline-block p-4 bg-white rounded-2xl mb-6">
        <img :src="qrCodeUrl" alt="QR Code" class="w-32 h-32" />
      </div>

      <!-- Info -->
      <div class="space-y-2 text-sm text-white/80">
        <p class="font-medium text-white">{{ entityName }}</p>
        <p>{{ serviceName }}</p>
        <p class="text-white/50">{{ formattedDate }}</p>
      </div>

      <!-- Status Badge grande -->
      <div class="mt-6">
        <TurnStatusBadge :status="status" size="lg" />
      </div>
    </div>
  </div>
</template>
```

### 3.3 TurnTracker — Seguimiento en tiempo real

**El componente más crítico para UX.** Debe communicate posición + tiempo + estado de forma clara.

**Rediseño con micro-animaciones:**

```vue
<!-- Componente: TurnTracker.vue -->
<template>
  <div class="space-y-6">
    <!-- Turn Number Principal -->
    <div class="text-center py-8 relative">
      <!-- Glow background -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl"
        :class="{ 'animate-pulse': status === 'called' }"
      />

      <div class="relative">
        <p class="text-white/50 text-sm uppercase tracking-widest mb-2">
          Tu turno
        </p>
        <TurnCounterDisplay :number="turnNumber" size="hero" />
        <p class="text-white/40 mt-2">en {{ entityName }}</p>
      </div>
    </div>

    <!-- Status Message con animación -->
    <div class="text-center">
      <Transition name="status" mode="out-in">
        <div
          :key="status"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="statusDotClass"
          />
          <span class="text-white/80">{{ statusMessage }}</span>
        </div>
      </Transition>
    </div>

    <!-- Progress Section -->
    <div class="glass rounded-2xl p-6">
      <div class="flex justify-between text-sm mb-4">
        <span class="text-white/50">Tu posición</span>
        <span class="text-white font-medium">#{{ queuePosition }} de {{ totalWaiting }}</span>
      </div>

      <TurnProgressBar
        :position="queuePosition"
        :total="totalWaiting"
        :animated="true"
      />

      <div class="flex justify-between text-sm mt-4">
        <span class="text-white/50">Turnos antes de ti</span>
        <span class="text-white font-medium">{{ queuePosition - 1 }}</span>
      </div>

      <!-- Tiempo estimado -->
      <div class="mt-6 pt-4 border-t border-white/5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white/50">
            <ClockIcon class="w-4 h-4" />
            <span class="text-sm">Tiempo estimado</span>
          </div>
          <span class="text-xl font-semibold text-white">
            ~{{ estimatedWait }} <span class="text-sm text-white/50">min</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Acciones rápido -->
    <div class="flex gap-3">
      <UiButton
        variant="outline"
        class="flex-1"
        @click="shareTurn"
      >
        <ShareIcon class="w-4 h-4 mr-2" />
        Compartir
      </UiButton>
      <UiButton
        v-if="status === 'waiting'"
        variant="ghost"
        class="flex-1 text-red-400 hover:text-red-300"
        @click="showCancelModal"
      >
        <XCircleIcon class="w-4 h-4 mr-2" />
        Cancelar
      </UiButton>
    </div>

    <!-- WebSocket connection status -->
    <div class="flex items-center justify-center gap-2 text-xs text-white/30">
      <span
        class="w-1.5 h-1.5 rounded-full"
        :class="wsConnected ? 'bg-green-400' : 'bg-red-400'"
      />
      {{ wsConnected ? 'Actualizaciones en vivo' : 'Reconectando...' }}
    </div>
  </div>
</template>

<style scoped>
.status-enter-active,
.status-leave-active {
  transition: all 200ms ease-out;
}
.status-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.status-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
```

### 3.4 TurnProgressBar — Barra de progreso animada

**Requisitos:**
- Gradient fill animado (violeta → azul)
- Transición suave cuando cambia posición
- Numeros animados (count up/down)

```vue
<!-- Componente: TurnProgressBar.vue -->
<template>
  <div class="relative">
    <!-- Track -->
    <div class="h-3 bg-white/5 rounded-full overflow-hidden">
      <!-- Fill con gradient -->
      <div
        class="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
        :style="{ width: `${percentage}%` }"
      >
        <!-- Gradient fill -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary to-accent" />

        <!-- Shimmer animation overlay -->
        <div
          v-if="animated"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        />
      </div>
    </div>

    <!-- Animated position marker -->
    <Transition name="marker">
      <div
        v-if="showMarker"
        class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
        :style="{ left: `calc(${percentage}% - 10px)` }"
      >
        <div class="w-2 h-2 bg-primary rounded-full" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.marker-enter-active,
.marker-leave-active {
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.marker-enter-from,
.marker-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.5);
}
</style>
```

### 3.5 TurnCounterDisplay — Número de turno con flip

**Mejoras sobre versión actual:**
- Flip animation mejorada con perspectiva 3D
- Spring physics para entrada
- Sopoerte de tamaño `sm|md|lg|hero`

```vue
<!-- Componente: TurnCounterDisplay.vue -->
<template>
  <div
    class="inline-flex items-center justify-center font-bold tracking-tight turn-flip-container"
    :class="sizeClasses"
  >
    <span
      v-for="(char, index) in displayChars"
      :key="`${char}-${index}`"
      class="inline-block turn-flip-char"
      :style="{ animationDelay: `${index * 50}ms` }"
    >
      {{ char }}
    </span>
  </div>
</template>

<style scoped>
.turn-flip-container {
  perspective: 1000px;
}

.turn-flip-char {
  display: inline-block;
  animation: flip-in 0.4s var(--ease-spring) both;
  transform-origin: center top;
}

@keyframes flip-in {
  0% {
    transform: rotateX(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

.turn-flip-char:nth-child(2) {
  animation-delay: 50ms;
}
</style>
```

---

## 4. Page-by-Page Redesign

### 4.1 /app — Home del Ciudadano

**Rediseño inspirado en Bento Grid + Micro-interactions:**

```vue
<!-- pages/app/index.vue -->
<template>
  <div class="min-h-screen pb-24">
    <!-- Header con greeting personalizado -->
    <header class="px-4 pt-6 pb-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-white/50 text-sm">Buenos días,</p>
          <h1 class="text-2xl font-bold text-white">
            {{ user?.fullName?.split(' ')[0] || 'Ciudadano' }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <!-- Notificaciones badge -->
          <button class="relative p-2 rounded-xl glass hover:bg-white/10 transition-colors">
            <BellIcon class="w-5 h-5 text-white/70" />
            <span
              v-if="unreadNotifications"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center"
            >
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>
          </button>
        </div>
      </div>

      <!-- Búsqueda principal -->
      <div class="relative mb-8">
        <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar entidad o servicio..."
          class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
          @focus="showSearchSuggestions = true"
        />
        <!-- Search suggestions dropdown -->
        <Transition name="dropdown">
          <div
            v-if="showSearchSuggestions && searchResults.length"
            class="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50"
          >
            <div
              v-for="entity in searchResults"
              :key="entity.id"
              class="flex items-center gap-3 p-4 hover:bg-white/10 cursor-pointer transition-colors"
              @click="navigateToEntity(entity)"
            >
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <BuildingIcon class="w-5 h-5 text-primary" />
              </div>
              <div>
                <p class="font-medium text-white">{{ entity.name }}</p>
                <p class="text-sm text-white/50">{{ entity.type }} • {{ entity.city }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>

    <!-- Activo: Turnos activos -->
    <section v-if="activeTurns.length" class="px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Turnos activos</h2>
        <NuxtLink to="/app/turns" class="text-sm text-primary hover:text-primary-light transition-colors">
          Ver todos
        </NuxtLink>
      </div>

      <div class="space-y-4">
        <TurnCard
          v-for="(turn, index) in activeTurns.slice(0, 2)"
          :key="turn.id"
          :turn="turn"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-enter"
        />
      </div>
    </section>

    <!-- Empty state si no hay turnos activos -->
    <section v-else class="px-4 mb-8">
      <div class="glass rounded-3xl p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TicketIcon class="w-8 h-8 text-primary" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Sin turnos activos</h3>
        <p class="text-white/50 mb-6">Encuentra una entidad y solicita tu turno</p>
        <UiButton variant="primary" @click="scrollToSearch">
          Buscar entidad
        </UiButton>
      </div>
    </section>

    <!-- Entidades recomendadas -->
    <section class="px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Recomendados para ti</h2>
        <NuxtLink to="/app/entities" class="text-sm text-primary hover:text-primary-light transition-colors">
          Ver todos
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <EntityCard
          v-for="(entity, index) in recommendedEntities"
          :key="entity.id"
          :entity="entity"
          :style="{ animationDelay: `${(index + 2) * 100}ms` }"
          class="animate-enter"
        />
      </div>
    </section>

    <!-- Quick stats -->
    <section class="px-4">
      <div class="glass rounded-2xl p-4 flex items-center justify-around">
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{{ totalTurnsTaken }}</p>
          <p class="text-xs text-white/50">Turnos tomados</p>
        </div>
        <div class="w-px h-8 bg-white/10" />
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{{ avgWaitTime }}min</p>
          <p class="text-xs text-white/50">Tiempo promedio</p>
        </div>
        <div class="w-px h-8 bg-white/10" />
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{{ completionRate }}%</p>
          <p class="text-xs text-white/50">Completados</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 200ms ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.animate-enter {
  animation: slide-up-fade 0.5s ease-out both;
}

@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```

### 4.2 /app/turns — Mis Turnos

**Rediseño con tabs + lista filtrada + empty states:**

```vue
<!-- pages/app/turns/index.vue -->
<template>
  <div class="min-h-screen pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-40 glass border-b border-white/5 px-4 py-4">
      <h1 class="text-xl font-bold text-white">Mis Turnos</h1>

      <!-- Tabs -->
      <div class="flex gap-2 mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
          :class="activeTab === tab.id ? 'bg-primary text-white' : 'text-white/50 hover:text-white'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span
            v-if="tab.count"
            class="ml-1 text-xs opacity-60"
          >
            ({{ tab.count }})
          </span>
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-6">
      <!-- Active turns -->
      <div v-if="activeTab === 'active'" class="space-y-4">
        <template v-if="activeTurns.length">
          <TurnCard
            v-for="turn in activeTurns"
            :key="turn.id"
            :turn="turn"
            :loading="loading"
          />

          <!-- Tracking CTA -->
          <div
            v-if="currentTurn"
            class="glass rounded-2xl p-4 border-primary/30"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ActivityIcon class="w-5 h-5 text-primary" />
              </div>
              <div>
                <p class="font-medium text-white">Turno en progreso</p>
                <p class="text-sm text-white/50">Sigue el estado en tiempo real</p>
              </div>
            </div>
            <NuxtLink :to="`/app/turns/${currentTurn.id}`">
              <UiButton variant="primary" class="w-full">
                Ver seguimiento
              </UiButton>
            </NuxtLink>
          </div>
        </template>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 flex items-center justify-center">
            <ClipboardListIcon class="w-10 h-10 text-white/20" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">No tienes turnos activos</h3>
          <p class="text-white/50 mb-6">Los turnos que solicites aparecerán aquí</p>
          <NuxtLink to="/app/entities">
            <UiButton variant="primary">
              Solicitar turno
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <!-- History -->
      <div v-else-if="activeTab === 'history'" class="space-y-3">
        <template v-if="completedTurns.length">
          <TurnHistoryItem
            v-for="turn in completedTurns"
            :key="turn.id"
            :turn="turn"
          />
        </template>

        <!-- Empty history -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 flex items-center justify-center">
            <ClockIcon class="w-10 h-10 text-white/20" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Sin historial</h3>
          <p class="text-white/50">Tu historial de turnos aparecera aquí</p>
        </div>
      </div>

      <!-- All -->
      <div v-else class="space-y-4">
        <!-- Same as active but showing all -->
      </div>
    </div>
  </div>
</template>
```

### 4.3 /app/turns/[id] — Tracking Page

**La página más importante para el ciudadano. Debe transmitir:**
1. Posición clara en la cola
2. Tiempo estimado
3. Qué hacer cuando sea su turno
4. Confianza en el sistema

**Rediseño:**

```vue
<!-- pages/app/turns/[id].vue -->
<template>
  <div class="min-h-screen">
    <!-- Back button + Header -->
    <header class="sticky top-0 z-40 glass border-b border-white/5 px-4 py-3">
      <div class="flex items-center gap-3">
        <button
          class="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          @click="goBack"
        >
          <ArrowLeftIcon class="w-5 h-5 text-white/70" />
        </button>
        <span class="text-sm text-white/50">Seguimiento</span>
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="loading" class="px-4 py-8">
      <div class="glass rounded-3xl p-8">
        <div class="flex justify-center mb-8">
          <UiSkeleton variant="circular" class="w-32 h-32 rounded-2xl" />
        </div>
        <div class="space-y-4">
          <UiSkeleton variant="text" class="w-48 h-6 mx-auto" />
          <UiSkeleton variant="rectangular" class="w-full h-4" />
          <UiSkeleton variant="text" class="w-32 h-4 mx-auto" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="turn" class="px-4 py-6">
      <TurnTracker :turn="turn" class="mb-6" />

      <!-- Info adicional -->
      <div class="glass rounded-2xl p-4 mb-6">
        <h3 class="font-medium text-white mb-3">Detalles del turno</h3>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between">
            <dt class="text-white/50">Entidad</dt>
            <dd class="text-white">{{ turn.entity?.name }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-white/50">Servicio</dt>
            <dd class="text-white">{{ turn.service?.name }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-white/50">Solicitado</dt>
            <dd class="text-white">{{ formattedRequestDate }}</dd>
          </div>
        </dl>
      </div>

      <!-- Qué hacer cuando me llamen -->
      <div class="glass rounded-2xl p-4">
        <h3 class="font-medium text-white mb-3 flex items-center gap-2">
          <InformationCircleIcon class="w-5 h-5 text-primary" />
          Cuando sea tu turno
        </h3>
        <ul class="space-y-2 text-sm text-white/70">
          <li class="flex items-start gap-2">
            <CheckCircleIcon class="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Acércate al módulo indicated por la señalización</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircleIcon class="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Ten tu documento de identidad a la mano</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircleIcon class="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Muestra el código QR de este turno</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-red-500/10 flex items-center justify-center">
        <ExclamationTriangleIcon class="w-10 h-10 text-red-400" />
      </div>
      <h2 class="text-xl font-semibold text-white mb-2">Turno no encontrado</h2>
      <p class="text-white/50 mb-6">Este turno no existe o fue cancelado</p>
      <NuxtLink to="/app/turns">
        <UiButton variant="outline">
          Volver a Mis Turnos
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>
```

### 4.4 /app/entities/[id]/[serviceId] — Solicitar Turno

**Formulario de solicitud con validación clara y feedback inmediato:**

```vue
<!-- pages/app/entities/[id]/[serviceId].vue -->
<template>
  <div class="min-h-screen pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-40 glass border-b border-white/5 px-4 py-3">
      <div class="flex items-center gap-3">
        <button
          class="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          @click="$router.back()"
        >
          <ArrowLeftIcon class="w-5 h-5 text-white/70" />
        </button>
        <div>
          <p class="text-sm text-white/50">Solicitar turno</p>
          <h1 class="font-semibold text-white">{{ service?.name }}</h1>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="px-4 py-8">
      <div class="space-y-4">
        <UiSkeleton variant="text" class="w-48 h-8" />
        <UiSkeleton variant="rectangular" class="w-full h-48" />
      </div>
    </div>

    <!-- Content -->
    <div v-else class="px-4 py-6 space-y-6">
      <!-- Service Info Card -->
      <div class="glass rounded-2xl p-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <component :is="serviceIcon" class="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">{{ service?.name }}</h2>
            <p class="text-white/50">{{ entity?.name }}</p>
          </div>
        </div>

        <dl class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5 text-sm">
          <div>
            <dt class="text-white/50">Horario</dt>
            <dd class="text-white">{{ service?.openTime }} - {{ service?.closeTime }}</dd>
          </div>
          <div>
            <dt class="text-white/50">Tiempo promedio</dt>
            <dd class="text-white">{{ service?.avgAttentionTime }} min</dd>
          </div>
        </dl>
      </div>

      <!-- Cola actual -->
      <div class="glass rounded-2xl p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-white/50 text-sm">Personas en espera</span>
          <span class="text-2xl font-bold text-white">{{ queueCount }}</span>
        </div>
        <TurnProgressBar :position="1" :total="queueCount + 1" />
        <p class="text-xs text-white/40 mt-2">
          Tu turno estimado: ~{{ estimatedWait }} min
        </p>
      </div>

      <!-- Confirmation -->
      <div class="glass rounded-2xl p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TicketIcon class="w-8 h-8 text-primary" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">¿Confirmas tu turno?</h3>
        <p class="text-white/50 text-sm mb-6">
          Estás a punto de solicitar un turno para<br />
          <span class="text-white">{{ service?.name }}</span> en <span class="text-white">{{ entity?.name }}</span>
        </p>

        <div class="space-y-3">
          <UiButton
            variant="primary"
            size="lg"
            class="w-full"
            :loading="submitting"
            @click="confirmTurn"
          >
            Confirmar turno
          </UiButton>
          <UiButton
            variant="ghost"
            class="w-full"
            @click="$router.back()"
          >
            Cancelar
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Success modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSuccess"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closeSuccess"
        >
          <div class="glass rounded-3xl p-8 max-w-sm w-full text-center">
            <!-- Animated checkmark -->
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-green-400 animate-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <h3 class="text-xl font-bold text-white mb-2">¡Turno solicitado!</h3>
            <p class="text-white/50 mb-6">
              Tu turno es el<br />
              <span class="text-4xl font-bold text-primary">{{ newTurnNumber }}</span>
            </p>

            <div class="space-y-3">
              <NuxtLink :to="`/app/turns/${newTurnId}`">
                <UiButton variant="primary" class="w-full">
                  Ver seguimiento
                </UiButton>
              </NuxtLink>
              <UiButton variant="ghost" class="w-full" @click="goHome">
                Volver al inicio
              </UiButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 300ms ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .glass,
.modal-leave-to .glass {
  transform: scale(0.95);
}

.animate-check {
  animation: check-draw 0.5s ease-out 0.2s both;
}

@keyframes check-draw {
  from {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
```

---

## 5. Loading States & Skeleton System

### 5.1 Global Skeleton Styles

**Ya existente en animations.css pero mejorar:**

```css
/* Skeleton shimmer - Mejorado */
.skeleton {
  position: relative;
  overflow: hidden;
  background: oklch(100% 0 0 / 0.05);
  border-radius: 0.75rem;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    oklch(100% 0 0 / 0.08),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
    background: oklch(100% 0 0 / 0.03);
  }
}
```

### 5.2 Component-specific Skeletons

```vue
<!-- components/turn/TurnCardSkeleton.vue -->
<template>
  <div class="glass rounded-3xl p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <UiSkeleton variant="circular" class="w-12 h-12" />
        <div class="space-y-2">
          <UiSkeleton variant="text" class="w-32 h-4" />
          <UiSkeleton variant="text" class="w-24 h-3" />
        </div>
      </div>
      <UiSkeleton variant="rectangular" class="w-20 h-6 rounded-full" />
    </div>

    <div class="mb-4">
      <UiSkeleton variant="text" class="w-24 h-10" />
    </div>

    <UiSkeleton variant="rectangular" class="w-full h-2 mb-2" />
    <UiSkeleton variant="text" class="w-32 h-3" />

    <div class="flex gap-2 pt-4 border-t border-white/5">
      <UiSkeleton variant="rectangular" class="w-20 h-8 rounded-lg" />
      <UiSkeleton variant="rectangular" class="flex-1 h-8 rounded-lg" />
    </div>
  </div>
</template>
```

### 5.3 Page-level Loading

```vue
<!-- Para usar en pages -->
<template>
  <div>
    <UiSkeleton v-if="loading" variant="rectangular" class="w-full h-48 rounded-2xl mb-4" />
    <UiSkeleton v-if="loading" variant="rectangular" class="w-full h-32 rounded-2xl mb-4" />
    <div v-else>
      <!-- Real content -->
    </div>
  </div>
</template>
```

---

## 6. Empty States Premium

Cada sección que puede estar vacía necesita un empty state cuiddo:

### 6.1 Empty Turns

```vue
<!-- components/empty/EmptyTurns.vue -->
<template>
  <div class="text-center py-16 px-4">
    <!-- Ilustración -->
    <div class="relative w-32 h-32 mx-auto mb-6">
      <div class="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
      <div class="absolute inset-4 rounded-2xl bg-primary/20 flex items-center justify-center">
        <TicketIcon class="w-12 h-12 text-primary" />
      </div>
    </div>

    <h3 class="text-xl font-semibold text-white mb-2">
      Sin turnos {{ context }}
    </h3>
    <p class="text-white/50 max-w-[280px] mx-auto mb-6">
      {{ description }}
    </p>

    <slot name="action">
      <UiButton variant="primary" @click="$emit('action')">
        {{ actionLabel }}
      </UiButton>
    </slot>
  </div>
</template>
```

---

## 7. Toast & Notification System

### 7.1 useToast Composable Enhancement

```typescript
// composables/useToast.ts
export function useToast() {
  const toast = useToast()

  const success = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'check',
      color: 'green',
      duration: 4000,
    })
  }

  const error = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'x',
      color: 'red',
      duration: 6000,
    })
  }

  const info = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'info',
      color: 'blue',
      duration: 4000,
    })
  }

  return { success, error, info }
}
```

---

## 8. Micro-interactions Específicas

### 8.1 Botón con Press Feedback

```css
/* En main.css - clase utilitaria */
.btn-press {
  transition: transform 160ms ease-out;
}

.btn-press:active {
  transform: scale(0.97);
}
```

### 8.2 Card Hover Lift

```css
.card-lift {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px oklch(55% 0.18 285 / 0.2);
}
```

### 8.3 Status Dot Animation

```css
.status-dot {
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
```

### 8.4 Number Counter Animation

```typescript
// composables/useCountUp.ts
export function useCountUp(target: Ref<number>, duration = 1000) {
  const display = ref(0)
  let startTime: number
  let animationFrame: number

  const animate = (currentTime: number) => {
    if (!startTime) startTime = currentTime
    const progress = Math.min((currentTime - startTime) / duration, 1)

    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress)
    display.value = Math.round(eased * target.value)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  watch(target, () => {
    startTime = 0
    animationFrame = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
  })

  return display
}
```

---

## 9. Brand Presence — TuTurno Omnipresente

### 9.1 Logo Component Enhancement

```vue
<!-- components/ui/UiLogo.vue -->
<template>
  <component
    :is="as"
    class="inline-flex items-center gap-2 font-bold tracking-tight"
    :class="[sizeClasses, { 'logo-text': !iconOnly }]"
  >
    <!-- Icon -->
    <span
      v-if="variant !== 'text-only'"
      class="inline-flex items-center justify-center"
      :class="iconSizeClasses"
    >
      <svg viewBox="0 0 32 32" class="w-full h-full">
        <!-- T icon stylized -->
        <path
          d="M16 4L6 12V14H26V12L16 4Z"
          fill="currentColor"
          class="text-primary"
        />
        <rect x="12" y="14" width="8" height="14" rx="2" fill="currentColor" class="text-primary" />
      </svg>
    </span>

    <!-- Text with gradient on hover -->
    <span class="relative">
      Tu<span class="text-primary">Turno</span>

      <!-- Subtle animation on hover -->
      <span
        v-if="animated"
        class="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      />
    </span>
  </component>
</template>

<style scoped>
.logo-text {
  background: linear-gradient(
    135deg,
    oklch(100% 0 0) 0%,
    oklch(100% 0 0) 40%,
    oklch(55% 0.18 285) 40%,
    oklch(72% 0.16 285) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
}
</style>
```

### 9.2 Footer con Brand

```vue
<!-- En layouts/citizen.vue - Mini footer -->
<template>
  <footer class="px-4 py-6 text-center border-t border-white/5">
    <div class="flex items-center justify-center gap-2 text-sm text-white/30">
      <span>Hecho con</span>
      <HeartIcon class="w-4 h-4 text-red-400" />
      <span>por</span>
      <NuxtLink to="/" class="text-primary hover:text-primary-light transition-colors font-medium">
        TuTurno
      </NuxtLink>
    </div>
  </footer>
</template>
```

---

## 10. Performance Optimization

### 10.1 Lazy Loading Strategy

```typescript
// composables/useLazyLoad.ts
export function useLazyLoad(options: {
  threshold?: number
  rootMargin?: string
}) {
  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    if (!el.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.disconnect()
          }
        })
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '100px',
      }
    )

    observer.observe(el.value)

    onUnmounted(() => observer.disconnect())
  })

  return { el, isVisible }
}
```

### 10.2 Image Optimization

```vue
<!-- Usar en components -->
<NuxtImg
  :src="imageUrl"
  :alt="alt"
  width="400"
  height="300"
  format="webp"
  loading="lazy"
  class="w-full h-full object-cover rounded-2xl"
/>
```

### 10.3 Component Lazy Loading

```vue
<!-- Con defineAsyncComponent -->
<script setup lang="ts">
const TurnTrackerAsync = defineAsyncComponent(() =>
  import('@/components/turn/TurnTracker.vue')
)
</script>

<template>
  <Suspense v-if="shouldLoadTracker">
    <TurnTrackerAsync />
    <template #fallback>
      <UiSkeleton variant="rectangular" class="w-full h-64" />
    </template>
  </Suspense>
</template>
```

---

## 11. Responsive Strategy

### 11.1 Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `xs` | < 384px | Feature phones |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### 11.2 Mobile-First Classes

```vue
<!-- Ejemplo: TurnCard responsive -->
<div class="
  p-4 sm:p-6           <!-- Padding dinámico -->
  glass rounded-2xl     <!-- Mobile: redondeado pequeño -->
  sm:rounded-3xl        <!-- Tablet+: redondeado más grande -->
">
```

### 11.3 Safe Areas (Mobile)

```css
/* En main.css para iPhone notch/home indicator */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-left {
  padding-left: env(safe-area-inset-left);
}

.safe-right {
  padding-right: env(safe-area-inset-right);
}
```

---

## 12. Implementación por Fases

### Fase 1: Core Components (Semana 1)
- [ ] Rediseñar `TurnCard.vue` con todos los estados
- [ ] Crear `TurnCardSkeleton.vue`
- [ ] Mejorar `TurnCounterDisplay.vue` con flip 3D
- [ ] Mejorar `TurnProgressBar.vue` con shimmer
- [ ] Crear `TurnTracker.vue` premium
- [ ] Implementar empty states premium

### Fase 2: Pages (Semana 2)
- [ ] Rediseñar `/app/index.vue` (Home)
- [ ] Rediseñar `/app/turns/index.vue`
- [ ] Rediseñar `/app/turns/[id].vue`
- [ ] Rediseñar `/app/entities/[id]/[serviceId].vue`

### Fase 3: Layout & Polish (Semana 3)
- [ ] Mejorar `layouts/citizen.vue`
- [ ] Implementar transiciones de página
- [ ] Añadir micro-interacciones con CSS
- [ ] Optimizar skeleton loaders
- [ ] Testear en múltiples dispositivos

### Fase 4: Performance (Semana 4)
- [ ] Lazy loading de components pesados
- [ ] Image optimization
- [ ] WebSocket connection status UI
- [ ] Prefetching de rutas
- [ ] Bundle analysis y optimization

---

## 13. Verificación Pre-Commit

- [ ] `npm run typecheck` pasa
- [ ] `npm run lint` pasa
- [ ] No `any` types nuevos
- [ ] Todos los componentes con `defineProps<Props>()`
- [ ] Loading states para todas las operaciones async
- [ ] Empty states para todas las listas
- [ ] Animaciones respetan `prefers-reduced-motion`
- [ ] Touch targets mínimo 44x44px
- [ ] Contrast ratios WCAG AA
- [ ] No console.log en producción
- [ ] .env no commiteado