# TuTurno — Módulo Ciudadano: Documento Maestro de Requisitos

> **Versión:** 1.0 | **Fecha:** Mayo 2026 | **Proyecto:** TuTurno - Sistema de Turnos Digitales
> **Propósito:** Consolidar todos los requisitos, reglas y contexto para el desarrollo del módulo ciudadano.
> **Skills aplicadas:** design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation

---

## IMPECCABLE_PREFLIGHT

```
context=pass    ← PRODUCT.md cargado
product=pass    ← No es placeholder
command=pass    ← Sin comando específico, es diseño directo
shape=not_required  ← Es documentación, no construcción
image_gate=skipped  ← No requiere mockups aún
mutation=pending    ← Solo documentación por ahora
```

---

## 1. CONTEXTO Y VISIÓN DEL PROYECTO

### 1.1 Propuesta de Valor

**TuTurno** elimina las filas físicas en entidades colombianas (EPS, bancos, oficinas públicas). El ciudadano puede:

1. **Solicitar turno** sin crear cuenta — solo con número de cédula
2. **Monitorear su posición** en tiempo real desde cualquier dispositivo
3. **Crear cuenta opcional** para guardar historial y recibir notificaciones push

### 1.2 Principios de Diseño (extrados de PRODUCT.md + skills)

| Principio | Aplicación |
|-----------|------------|
| **Cercano, claro, confiable** | Interacciones simples, lenguaje directo, feedback inmediato |
| **Acción principal visible** | Cada pantalla tiene UNA acción prioritaria clara |
| **Reducir fricción** | Login con cédula primero, cuenta después |
| **Estados y feedback inmediatos** | Loading, empty, error states siempre presentes |
| **Responsive-first** | Mobile como base, desktop como enhancement |

### 1.3 Design Language (OKLCH-based)

**Estrategia de color:** Committed — violeta como identidad, zinc oscuro como base. No diluir con azules/verdes en elementos interactivos.

```css
/* Primary - TuTurno Violet */
--color-primary:        oklch(55% 0.18 285);     /* #6C3AE8 */
--color-primary-light:  oklch(72% 0.16 285);     /* #A78BFA */
--color-primary-dark:   oklch(40% 0.15 285);     /* #4C1D95 */

/* Backgrounds - Zinc tintado hacia violeta */
--bg-base:     oklch(13% 0.015 285);   /* #0D0D14 - Fondo principal */
--bg-surface:  oklch(16% 0.015 285);   /* #13131F - Cards, paneles */
--bg-elevated: oklch(20% 0.015 285);   /* #1A1A2E - Elementos elevados */

/* Glass system */
--glass-bg:       oklch(100% 0 0 / 0.04);
--glass-border:   oklch(100% 0 0 / 0.10);
--glass-shadow:   0 8px 32px oklch(55% 0.18 285 / 0.15);
--glass-blur:     blur(16px);

/* Turn Status Colors - informativo, no interactivo */
--turn-waiting:   oklch(55% 0.18 285);   /* violeta */
--turn-called:   oklch(75% 0.16 45);     /* ámbar */
--turn-attending: oklch(65% 0.15 235);   /* azul */
--turn-completed: oklch(70% 0.15 160);   /* verde */
--turn-no-show:   oklch(60% 0.18 25);    /* rojo */
```

### 1.4 Typography Scale

```css
/* Scale fluid con clamp() */
--text-display:  clamp(2.5rem, 5vw + 1rem, 4.5rem);  /* Hero */
--text-h1:       clamp(2rem, 3vw + 1rem, 3rem);       /* Títulos sección */
--text-h2:       clamp(1.5rem, 2vw + 0.5rem, 2rem);  /* Subtítulos */
--text-h3:       1.25rem;                              /* Componentes */
--text-body:     1rem;                                  /* Texto normal */
--text-small:    0.875rem;                             /* Labels, hints */
--text-micro:    0.75rem;                              /* Badges pequeños */

/* Tracking y Leading */
--tracking-tight:  -0.02em;   /* Headlines */
--tracking-normal:  0em;       /* Body */
--leading-none:   1;          /* Headlines */
--leading-relaxed: 1.625;      /* Body text */
```

### 1.5 Motion Philosophy (emil-design-eng)

**Niveles por frecuencia de uso:**

| Frecuencia | Elemento | Motion | Duración |
|------------|----------|--------|----------|
| 100+/día | Navegación, tabs | Sin animación | 0ms |
| 10-50/día | Botones hover | `transform: scale(1.02)` | 150ms |
| 1-10/día | Cards, modals | `translateY + opacity` | 200-300ms |
| Ocasional | Loading states | Skeleton shimmer | Infinito |
| First-time | Onboarding, success | Celebración | 400-600ms |

**Curvas de easing obligatorias:**

```css
--ease-out:     cubic-bezier(0.23, 1, 0.32, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out:  cubic-bezier(0.77, 0, 0.175, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Reglas críticas (NUNCA violar):**
- `transform: scale(0.97)` en `:active` para TODOS los botones
- Nunca `scale(0)` — usar `scale(0.95) + opacity: 0`
- Nunca `ease-in` para elementos UI — siempre `ease-out`
- UI animations < 300ms
- Soporte `prefers-reduced-motion`

---

## 1.6 Theme System — Modo Claro y Oscuro

### 1.6.1 Philosophy

**El tema oscuro es el default** (matching el workspace premium de la app). El modo claro es una opción accesible para usuarios que prefieren mayor luminosidad o usan la app en entornos muy iluminados.

**Regla (impeccable):** El tema no es un switch binario. Es una transición suave que mantiene la identidad de marca en ambos modos.

### 1.6.2 CSS Variables por Tema

```css
/* ============================================
   DARK THEME (Default)
   ============================================ */
:root,
[data-theme="dark"] {
  /* Primary */
  --color-primary:        oklch(55% 0.18 285);     /* #6C3AE8 */
  --color-primary-light:  oklch(72% 0.16 285);     /* #A78BFA */
  --color-primary-dark:   oklch(40% 0.15 285);     /* #4C1D95 */

  /* Backgrounds - Zinc oscuro */
  --bg-base:     oklch(13% 0.015 285);   /* #0D0D14 */
  --bg-surface:  oklch(16% 0.015 285);   /* #13131F */
  --bg-elevated: oklch(20% 0.015 285);   /* #1A1A2E */
  --bg-overlay:  oklch(24% 0.015 285);   /* #1F1F35 */

  /* Glass */
  --glass-bg:       oklch(100% 0 0 / 0.04);
  --glass-bg-hover: oklch(100% 0 0 / 0.07);
  --glass-border:   oklch(100% 0 0 / 0.10);
  --glass-shadow:   0 8px 32px oklch(55% 0.18 285 / 0.15);

  /* Text */
  --text-primary:   oklch(100% 0 0);              /* #FFFFFF */
  --text-secondary: oklch(75% 0 0);              /* #A1A1AA */
  --text-muted:     oklch(50% 0 0);              /* #52525B */
  --text-accent:    oklch(72% 0.16 285);          /* #A78BFA */

  /* Borders */
  --border-subtle:   oklch(100% 0 0 / 0.06);
  --border-default:  oklch(100% 0 0 / 0.10);
  --border-strong:  oklch(100% 0 0 / 0.15);

  /* Status colors remain same */
  --turn-waiting:   oklch(55% 0.18 285);
  --turn-called:   oklch(75% 0.16 45);
  --turn-attending: oklch(65% 0.15 235);
  --turn-completed: oklch(70% 0.15 160);
  --turn-no-show:   oklch(60% 0.18 25);
}

/* ============================================
   LIGHT THEME
   ============================================ */
[data-theme="light"] {
  /* Primary - same violet, slightly adjusted for light bg */
  --color-primary:        oklch(50% 0.18 285);     /* #7C3AED */
  --color-primary-light:  oklch(65% 0.16 285);     /* #8B5CF6 */
  --color-primary-dark:   oklch(40% 0.15 285);     /* #4C1D95 */

  /* Backgrounds - Warm gray tint */
  --bg-base:     oklch(98% 0 0);                /* #FAFAFA */
  --bg-surface:  oklch(100% 0 0);               /* #FFFFFF */
  --bg-elevated: oklch(97% 0 0);                 /* #F5F5F5 */
  --bg-overlay:  oklch(95% 0 0);                 /* #EDEDED */

  /* Glass - more opaque for light */
  --glass-bg:       oklch(100% 0 0 / 0.80);
  --glass-bg-hover: oklch(100% 0 0 / 0.95);
  --glass-border:   oklch(0% 0 0 / 0.08);
  --glass-shadow:   0 8px 32px oklch(0% 0 0 / 0.08);

  /* Text - dark for contrast */
  --text-primary:   oklch(15% 0 0);              /* #171717 */
  --text-secondary: oklch(45% 0 0);              /* #52525B */
  --text-muted:     oklch(65% 0 0);              /* #737373 */
  --text-accent:    oklch(50% 0.18 285);         /* #7C3AED */

  /* Borders */
  --border-subtle:   oklch(0% 0 0 / 0.04);
  --border-default:  oklch(0% 0 0 / 0.08);
  --border-strong:   oklch(0% 0 0 / 0.15);

  /* Status colors - slightly more saturated for light bg */
  --turn-waiting:   oklch(50% 0.18 285);
  --turn-called:   oklch(70% 0.16 45);
  --turn-attending: oklch(60% 0.15 235);
  --turn-completed: oklch(65% 0.15 160);
  --turn-no-show:   oklch(55% 0.18 25);
}
```

### 1.6.3 Theme Toggle Component

```vue
<!-- components/ui/ThemeToggle.vue -->
<script setup lang="ts">
const theme = useTheme()

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="relative w-12 h-12 rounded-xl glass hover:bg-white/10 transition-colors
           flex items-center justify-center"
    :aria-label="`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`"
    @click="toggleTheme"
  >
    <!-- Sun icon (visible in dark mode) -->
    <Transition name="icon-fade" mode="out-in">
      <Icon
        v-if="theme === 'dark'"
        name="sun"
        class="w-5 h-5 text-white/70"
      />
      <!-- Moon icon (visible in light mode) -->
      <Icon
        v-else
        name="moon"
        class="w-5 h-5 text-zinc-600"
      />
    </Transition>
  </button>
</template>

<style scoped>
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 150ms var(--ease-out);
}
.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}
.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
```

### 1.6.4 useTheme Composable

```typescript
// composables/useTheme.ts

export function useTheme() {
  const colorMode = useColorMode()

  const theme = computed(() => colorMode.value as 'dark' | 'light')

  function setTheme(newTheme: 'dark' | 'light') {
    colorMode.preference = newTheme
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}

// Auto-detect system preference on first visit
// Persist user choice in localStorage
// Respect prefers-color-scheme media query
```

### 1.6.5 Theme Application in Layout

```vue
<!-- layouts/citizen.vue -->
<script setup lang="ts">
const { theme } = useTheme()
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :data-theme="theme"
    :class="theme === 'dark' ? 'bg-bg-base' : 'bg-bg-base'"
  >
    <!-- Content uses CSS variables automatically -->
  </div>
</template>

<style>
/* Global theme transition */
[data-theme] {
  transition: background-color 300ms var(--ease-out),
              color 200ms var(--ease-out);
}
</style>
```

### 1.6.6 Persistencia y Sistem Preference

```typescript
// plugins/theme.client.ts (client-side only)

export default defineNuxtPlugin(() => {
  const savedTheme = localStorage.getItem('tuturno-theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme) {
    // User has explicit choice
    useColorMode().preference = savedTheme
  } else {
    // Use system preference by default
    useColorMode().preference = systemPrefersDark ? 'dark' : 'light'
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('tuturno-theme')) {
      useColorMode().preference = e.matches ? 'dark' : 'light'
    }
  })
})
```

### 1.6.7 Component Adaptation Checklist

| Component | Dark Mode | Light Mode |
|-----------|-----------|------------|
| Glass cards | `rgba(255,255,255,0.04)` bg | `rgba(255,255,255,0.80)` bg |
| Text | White primary | Dark gray primary |
| Status badges | Same colors | Slightly more saturated |
| Buttons primary | Violet with glow | Violet, no glow (brighter bg) |
| Turn counter | White text | Dark text |
| TurnCard | Subtle glow effects | No glow, clean shadows |
| Progress bar | White track, gradient fill | Gray track, gradient fill |
| Input fields | White/5 bg | White bg |
| Navigation | Glass with blur | Glass, more opaque |

### 1.6.8 Glass Effect on Light Mode

```css
/* Light mode glass needs more contrast */
[data-theme="light"] .glass {
  background: oklch(100% 0 0 / 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(0% 0 0 / 0.08);
  box-shadow: 0 4px 24px oklch(0% 0 0 / 0.06);
}

[data-theme="light"] .glass-hover:hover {
  background: oklch(100% 0 0 / 0.95);
  box-shadow: 0 8px 40px oklch(0% 0 0 / 0.10);
}
```

### 1.6.9 Turn Status Colors in Light Mode

```css
[data-theme="light"] {
  /* Status badges need higher contrast on light bg */
  --turn-waiting:   oklch(45% 0.18 285);   /* Deeper violet */
  --turn-called:   oklch(65% 0.16 45);    /* Deeper amber */
  --turn-attending: oklch(55% 0.15 235);  /* Deeper blue */
  --turn-completed: oklch(60% 0.15 160);  /* Deeper green */
  --turn-no-show:   oklch(50% 0.18 25);   /* Deeper red */
  --turn-cancelled: oklch(50% 0 0);       /* Gray */
}
```

### 1.6.10 Smooth Theme Transition

```css
/* Prevent flash on page load */
html {
  background-color: oklch(13% 0.015 285);  /* Fallback bg */
}

/* Theme transition */
html.transitioning,
html.transitioning * {
  transition: background-color 300ms var(--ease-out),
              border-color 200ms var(--ease-out),
              color 200ms var(--ease-out) !important;
}
```

### 1.6.11 Responsive Considerations

- **Mobile:** Toggle visible in header, easy to reach
- **Desktop:** Toggle in header + potentially in settings/profile
- **No performance impact:** Theme only changes CSS variables, no re-render

---

## 2. FLUJO DE USUARIO — CÉDULA PRIMERO, CUENTA DESPUÉS

### 2.1 Diagrama de Flujo Principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                                │
│                    (No requiere auth)                               │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  "Ingresa tu número de cédula para buscar tu turno"        │   │
│   │  ┌──────────────────────┐  ┌──────────────┐                │   │
│   │  │  Input: Cédula      │  │  Buscar      │                │   │
│   │  └──────────────────────┘  └──────────────┘                │   │
│   └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Cédula ingresada)
┌─────────────────────────────────────────────────────────────────────┐
│                      TURNO NO ENCONTRADO                            │
│                                                                     │
│   "No tienes turnos activos con esta cédula"                        │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  [Crear cuenta + reclamar turno]    [Solicitar nuevo turno] │   │
│   └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      TURNO ENCONTRADO                                │
│                                                                     │
│   Se muestra el turno con tracking en tiempo real                   │
│   Sin necesidad de cuenta (solo lectura)                             │
│                                                                     │
│   "Para guardar este turno y recibir notificaciones, crea una cuenta"
│                                                                     │
│   [Crear cuenta + reclamar turno]                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    SOLICITAR NUEVO TURNO                            │
│                    (Solo requiere cédula)                            │
│                                                                     │
│   1. Buscar entidad por nombre/ciudad                               │
│   2. Seleccionar servicio                                           │
│   3. Confirmar solicitud                                             │
│   4. → Se genera turno, se muestra tracking                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    CREAR CUENTA (Opcional)                          │
│                                                                     │
│   Campos requeridos:                                                │
│   - Número de cédula (ya existe del turno)                          │
│   - Nombre completo                                                  │
│   - Email                                                            │
│   - Contraseña                                                       │
│   - Teléfono (opcional)                                              │
│                                                                     │
│   Beneficios de crear cuenta:                                       │
│   ✓ Guardar historial de turnos                                    │
│   ✓ Recibir notificaciones push                                     │
│   ✓ Acceso rápido con cédula + contraseña                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Estados de Búsqueda por Cédula

| Estado | Descripción | UI |
|--------|-------------|-----|
| `idle` | Input vacío listo | Placeholder: "Ingresa tu número de cédula" |
| `loading` | Buscando turno | Spinner en input + "Buscando..." |
| `found` | Turno encontrado | Mostrar TurnTracker completo |
| `not_found` | Sin turnos activos | Mensaje + CTAs de acción |
| `error` | Error de red/servidor | Mensaje de error + retry |

### 2.3 API Routes Involucradas

```typescript
// GET /api/turns/by-document?documentId=xxx
// Busca turnos activos por número de cédula
// No requiere auth - público

// POST /api/auth/register-simple
// Registro rápido: cédula + nombre + email + password
// Crea usuario y asocia turnos previos si existen

// POST /api/turns
// Crear turno - solo requiere documentId si no hay sesión
```

---

## 3. SISTEMA REACTIVE — WEBSOCKETS + NOTIFICACIONES

### 3.1 Eventos WebSocket (Contract)

```typescript
// constants/ws.constants.ts
export const WS_EVENTS = {
  // Server → Client (Ciudadano)
  QUEUE_UPDATED:    'QUEUE_UPDATED',    // Posición cambió
  YOUR_TURN_SOON:    'YOUR_TURN_SOON',    // Faltan 3 turnos
  YOUR_TURN:         'YOUR_TURN',        // Es tu turno AHORA
  TURN_CANCELLED:    'TURN_CANCELLED',    // Turno cancelado
  SERVICE_PAUSED:    'SERVICE_PAUSED',    // Servicio pausado

  // Client → Server
  SUBSCRIBE_TURN:    'SUBSCRIBE_TURN',    // Unirse al room del turno
  UNSUBSCRIBE_TURN:  'UNSUBSCRIBE_TURN',  // Salir del room
} as const

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]
```

### 3.2 Composable useTurnRealtime

```typescript
// composables/useTurnRealtime.ts
export function useTurnRealtime(turnId: Ref<string>) {
  const ws = useWebSocket()
  const turnState = ref<TurnState | null>(null)
  const queuePosition = ref(0)
  const estimatedWait = ref(0)
  const status = ref<TurnStatus>('waiting')

  // Suscribir al room del turno específico
  watch(turnId, (newTurnId) => {
    if (newTurnId) {
      ws.send({ type: WS_EVENTS.SUBSCRIBE_TURN, turnId: newTurnId })
    }
  }, { immediate: true })

  // Manejar mensajes entrantes
  ws.onMessage((event) => {
    switch (event.type) {
      case WS_EVENTS.QUEUE_UPDATED:
        queuePosition.value = event.payload.position
        estimatedWait.value = event.payload.estimatedWait
        break
      case WS_EVENTS.YOUR_TURN:
        status.value = 'called'
        showNotification('¡Es tu turno!', 'Acércate al módulo indicado')
        break
      case WS_EVENTS.TURN_CANCELLED:
        status.value = 'cancelled'
        break
    }
  })

  return {
    turnState,
    queuePosition,
    estimatedWait,
    status,
    isConnected: ws.isConnected,
  }
}
```

### 3.3 Notificaciones Push

```typescript
// composables/usePushNotifications.ts
export function usePushNotifications() {
  const notifications = useNotifications()
  const isSubscribed = ref(false)

  async function subscribe() {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'denied') return false

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return false

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: useRuntimeConfig().public.vapidPublicKey,
    })

    // Enviar subscription al server
    await $fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: { subscription },
    })

    isSubscribed.value = true
    return true
  }

  function showNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icons/notification.png' })
    }
    // También mostrar toast in-app
    notifications.info(title, body)
  }

  return { subscribe, isSubscribed, showNotification }
}
```

### 3.4 Estados de Conexión

```
┌─────────────────────────────────────────────────────────────┐
│  WS Connection States                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  disconnected ──→ connecting ──→ connected                │
│       │                │                │                   │
│       │                │                ▼                   │
│       │                │         [ Verde ] "En vivo"        │
│       │                │                                   │
│       │                ▼                                   │
│       │         [ Amarillo ] "Reconectando..."              │
│       │                │                                   │
│       │                ▼                                   │
│       │         [ Rojo ] "Sin conexión"                    │
│       │                │                                   │
│       └────────────────┘                                   │
│                                                             │
│  Auto-reconnect con exponential backoff:                   │
│  1s → 2s → 4s → 8s → 16s (max 5 intentos)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. LAYOUT ARCHITECTURE — RESPONSIVE STRATEGY

### 4.1 Breakpoints

| Breakpoint | Width | Uso |
|------------|-------|-----|
| `xs` | < 384px | Feature phones |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### 4.2 Mobile-First Layout (Default)

```vue
<!-- layouts/citizen.vue - Mobile por defecto -->
<template>
  <div class="min-h-screen bg-bg-base safe-top safe-bottom">
    <!-- Header sticky glass -->
    <header class="sticky top-0 z-40 glass border-b border-white/5">
      <slot name="header">
        <AppHeader />
      </slot>
    </header>

    <!-- Main content -->
    <main class="px-4 py-6 pb-24">
      <slot />
    </main>

    <!-- Bottom nav - Mobile only -->
    <nav class="fixed bottom-0 left-0 right-0 glass border-t border-white/5 safe-bottom">
      <BottomNav />
    </nav>
  </div>
</template>
```

### 4.3 Desktop Enhancement (> 768px)

```vue
<!-- Desktop: sidebar + more space -->
<template>
  <div class="min-h-screen bg-bg-base">
    <!-- Sidebar desktop -->
    <aside class="hidden lg:block fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5">
      <DesktopSidebar />
    </aside>

    <!-- Header desktop -->
    <header class="hidden lg:block sticky top-0 z-40 glass border-b border-white/5 ml-64">
      <DesktopHeader />
    </header>

    <!-- Main content desktop -->
    <main class="lg:ml-64 pt-16 p-6 lg:p-8">
      <div class="max-w-4xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
```

### 4.4 Safe Areas (Mobile)

```css
/* Para iPhone notch y home indicator */
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

### 4.5 Responsive Card Patterns

```vue
<!-- TurnCard responsive -->
<template>
  <div class="
    p-4 sm:p-6           /* Padding dinámico */
    glass rounded-2xl     /* Mobile: redondeado pequeño */
    sm:rounded-3xl        /* Tablet+: redondeado más grande */
    card-lift             /* Hover lift animation */
  ">
    <!-- Content -->
  </div>
</template>

<style scoped>
.card-lift {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px oklch(55% 0.18 285 / 0.2);
}
</style>
```

---

## 5. PAGE FLOW — CADA PANTALLA Y SUS COMPONENTES

### 5.1 Landing Page (Pública — SSG)

```
/ (index.vue)
├── LandingHeader (logo, nav público)
├── LandingHeroNew
│   └── "Ingresa tu cédula para buscar tu turno"
│       └── SearchByDocument component
├── LandingHowItWorks
├── LandingTestimonials
├── LandingFeatures
└── LandingCTA
```

**Búsqueda por cédula en landing:**

```vue
<!-- components/citizen/SearchByDocument.vue -->
<template>
  <div class="relative w-full max-w-md mx-auto">
    <input
      v-model="documentId"
      type="text"
      inputmode="numeric"
      placeholder="Número de cédula"
      class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl
             text-white placeholder:text-white/30
             focus:outline-none focus:border-primary/50 focus:bg-white/10
             transition-all text-center text-lg font-medium tracking-wide"
      @keyup.enter="searchTurn"
    />

    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl
             bg-primary/20 hover:bg-primary/30 transition-colors"
      :disabled="loading || !documentId"
      @click="searchTurn"
    >
      <Icon name="search" class="w-5 h-5 text-primary" />
    </button>

    <!-- Loading state -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <UiSpinner class="w-6 h-6 text-primary" />
    </div>
  </div>

  <!-- Result -->
  <Transition name="fade">
    <div v-if="result" class="mt-6">
      <TurnTracker v-if="result.turn" :turn="result.turn" />
      <EmptyState v-else message="No se encontraron turnos activos" />
    </div>
  </Transition>
</template>
```

### 5.2 App Home (Ciudadano Autenticado)

```
/app (pages/app/index.vue)
├── Greeting header con nombre de usuario
├── SearchBar (entidades y servicios)
├── ActiveTurns section (turnos activos)
│   └── TurnCard (max 2, link "Ver todos")
├── RecommendedEntities (entidades sugeridas)
└── QuickStats (turnos tomados, tiempo promedio, % completados)
```

### 5.3 Mis Turnos

```
/app/turns (pages/app/turns/index.vue)
├── Header sticky con tabs
│   ├── Activos (count)
│   ├── En historia (count)
│   └── Todos
├── Content
│   ├── Active turns list → TurnCard
│   ├── Empty state (si no hay turnos)
│   └── History turns list → TurnHistoryItem
└── FAB: Solicitar nuevo turno
```

### 5.4 Seguimiento de Turno (Tracking Page)

```
/app/turns/[id] (pages/app/turns/[id].vue)
├── Back button + Header
├── TurnTracker component
│   ├── TurnCounterDisplay (número grande)
│   ├── Status badge (waiting/called/attending)
│   ├── TurnProgressBar (posición en cola)
│   ├── EstimatedWait time
│   └── WebSocket connection indicator
├── TurnDetails (entidad, servicio, fecha)
├── InstructionsCard ("Cuando sea tu turno...")
└── Actions (Cancelar turno - solo si waiting)
```

### 5.5 Solicitar Turno

```
/app/entities/[id]/[serviceId] (pages/app/entities/[id]/[serviceId].vue)
├── Header con breadcrumb
├── ServiceInfoCard (nombre, horario, tiempo promedio)
├── QueueStatus (personas en espera, estimado)
├── ConfirmationCard
│   ├── Resumen del turno
│   ├── ConfirmButton
│   └── CancelButton
└── Success modal (on confirm)
    └── TurnCounterDisplay + link a tracking
```

### 5.6 Perfil del Ciudadano

```
/app/profile (pages/app/profile.vue)
├── ProfileHeader (avatar, nombre, email)
├── ProfileForm
│   ├── fullName (editable inline)
│   ├── email (editable inline)
│   ├── phone (editable inline)
│   └── documentId (solo lectura)
├── NotificationSettings
│   ├── Push notifications toggle
│   └── Email notifications toggle
├── ConnectedAccounts (si applicable)
└── DangerZone
    └── DeleteAccount button
```

---

## 6. COMPONENTES — DESIGN + INTERACTIONS

### 6.1 TurnCard

**Estados:** waiting, called, attending, completed, no_show, cancelled

```vue
<template>
  <div
    class="group relative overflow-hidden rounded-3xl glass p-6 card-lift"
    :class="statusClasses"
  >
    <!-- Glow para estados activos -->
    <div
      v-if="status === 'called' || status === 'attending'"
      class="absolute inset-0 opacity-30"
      :class="status === 'called' ? 'animate-pulse-glow-amber' : 'animate-pulse-glow-blue'"
    />

    <!-- Header: Entidad + Status -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
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

    <!-- Turn Number Principal -->
    <div class="flex items-baseline gap-2 mb-4">
      <span class="text-5xl font-bold tracking-tight text-white turn-flip">
        {{ turnNumber }}
      </span>
      <span class="text-lg text-white/40">#{{ queuePosition }}</span>
    </div>

    <!-- Progress para waiting -->
    <div v-if="status === 'waiting'" class="mb-4">
      <TurnProgressBar :position="queuePosition" :total="waitingCount" />
      <p class="text-xs text-white/50 mt-2">
        Estimado: ~{{ estimatedWait }} min
      </p>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2 pt-4 border-t border-white/5">
      <UiButton
        v-if="status === 'waiting'"
        variant="ghost"
        size="sm"
        class="text-white/60 hover:text-white"
        @click="$emit('cancel')"
      >
        Cancelar
      </UiButton>
      <UiButton
        variant="primary"
        size="sm"
        class="flex-1"
        @click="$emit('view')"
      >
        Ver detalles
      </UiButton>
    </div>

    <!-- Skeleton overlay -->
    <div v-if="loading" class="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm
                            flex items-center justify-center">
      <UiSpinner class="w-8 h-8 text-primary" />
    </div>
  </div>
</template>

<style scoped>
.card-lift {
  transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px oklch(55% 0.18 285 / 0.2);
}

.btn-press:active {
  transform: scale(0.97);
}

/* Glow animations */
.animate-pulse-glow-amber {
  background: radial-gradient(circle, oklch(75% 0.16 45 / 0.4) 0%, transparent 70%);
  animation: glow-pulse-amber 2s ease-in-out infinite;
}
.animate-pulse-glow-blue {
  background: radial-gradient(circle, oklch(65% 0.15 235 / 0.4) 0%, transparent 70%);
  animation: glow-pulse-blue 2s ease-in-out infinite;
}
</style>
```

### 6.2 TurnTracker

**El componente principal de tracking — debe sentirse premium y en vivo.**

```vue
<template>
  <div class="space-y-8">
    <!-- Turn Number Principal -->
    <div class="text-center py-12 relative">
      <!-- Glow background animado -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl"
        :class="{ 'animate-pulse': status === 'called' }"
      />

      <div class="relative">
        <p class="text-white/50 text-sm uppercase tracking-widest mb-4">
          Tu turno
        </p>
        <TurnCounterDisplay :number="turnNumber" size="hero" />
        <p class="text-white/40 mt-4">en {{ entityName }}</p>
      </div>
    </div>

    <!-- Status Message animado -->
    <div class="text-center">
      <Transition name="status-fade" mode="out-in">
        <div
          :key="status"
          class="inline-flex items-center gap-3 px-6 py-3 rounded-full glass"
        >
          <span class="w-3 h-3 rounded-full" :class="statusDotClass" />
          <span class="text-white/90 font-medium">{{ statusMessage }}</span>
        </div>
      </Transition>
    </div>

    <!-- Progress Section -->
    <div class="glass rounded-3xl p-8">
      <div class="flex justify-between text-sm mb-6">
        <span class="text-white/50">Tu posición</span>
        <span class="text-white font-semibold text-lg">
          #{{ queuePosition }} de {{ totalWaiting }}
        </span>
      </div>

      <TurnProgressBar
        :position="queuePosition"
        :total="totalWaiting"
        :animated="true"
        size="lg"
      />

      <div class="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
        <div class="flex items-center gap-2 text-white/50">
          <Icon name="clock" class="w-5 h-5" />
          <span class="text-sm">Tiempo estimado</span>
        </div>
        <span class="text-2xl font-bold text-white">
          ~{{ estimatedWait }}<span class="text-sm text-white/50 ml-1">min</span>
        </span>
      </div>
    </div>

    <!-- WebSocket Status -->
    <div class="flex items-center justify-center gap-2 text-sm">
      <span
        class="w-2 h-2 rounded-full transition-colors"
        :class="wsConnected ? 'bg-green-400' : 'bg-red-400'"
      />
      <span class="text-white/40">
        {{ wsConnected ? 'Actualizaciones en vivo' : 'Reconectando...' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.status-fade-enter-active,
.status-fade-leave-active {
  transition: all 200ms var(--ease-out);
}
.status-fade-enter-from,
.status-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
```

### 6.3 TurnCounterDisplay

**Número de turno con flip animation 3D.**

```vue
<template>
  <div class="turn-counter" :class="sizeClasses">
    <span
      v-for="(char, index) in displayChars"
      :key="`${turnNumber}-${index}`"
      class="turn-char"
      :style="{ animationDelay: `${index * 60}ms` }"
    >
      {{ char }}
    </span>
  </div>
</template>

<style scoped>
.turn-counter {
  display: inline-flex;
  align-items: center;
  perspective: 1000px;
  font-variant-numeric: tabular-nums;
}

.turn-char {
  display: inline-block;
  animation: flip-in 0.5s var(--ease-spring) both;
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

@media (prefers-reduced-motion: reduce) {
  .turn-char {
    animation: none;
  }
}
</style>
```

### 6.4 TurnProgressBar

**Barra de progreso animada con gradient y shimmer.**

```vue
<template>
  <div class="relative">
    <!-- Track -->
    <div class="h-3 bg-white/5 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 var(--ease-out) relative overflow-hidden"
        :style="{ width: `${percentage}%` }"
      >
        <!-- Gradient fill -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary to-accent" />

        <!-- Shimmer overlay -->
        <div
          v-if="animated"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
        />
      </div>
    </div>

    <!-- Position marker -->
    <Transition name="marker">
      <div
        v-if="showMarker"
        class="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg
               flex items-center justify-center"
        :style="{ left: `calc(${percentage}% - 12px)` }"
      >
        <div class="w-2 h-2 bg-primary rounded-full" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.marker-enter-active,
.marker-leave-active {
  transition: all 300ms var(--ease-spring);
}
.marker-enter-from,
.marker-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.5);
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
```

### 6.5 TurnStatusBadge

```vue
<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide"
    :class="statusClasses"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
type TurnStatus = 'waiting' | 'called' | 'attending' | 'completed' | 'no_show' | 'cancelled'

const props = defineProps<{
  status: TurnStatus
  size?: 'sm' | 'md' | 'lg'
}>()

const statusConfig = {
  waiting:    { label: 'En espera',    bg: 'bg-violet/20',   text: 'text-violet',   dot: 'bg-violet' },
  called:    { label: 'Te llaman',    bg: 'bg-amber/20',     text: 'text-amber',     dot: 'bg-amber animate-pulse' },
  attending: { label: 'Atendiendo',  bg: 'bg-blue/20',     text: 'text-blue',      dot: 'bg-blue' },
  completed: { label: 'Completado',   bg: 'bg-green/20',     text: 'text-green',     dot: 'bg-green' },
  no_show:   { label: 'No asistió',   bg: 'bg-red/20',       text: 'text-red',       dot: 'bg-red' },
  cancelled: { label: 'Cancelado',    bg: 'bg-gray/20',      text: 'text-gray',      dot: 'bg-gray' },
}
</script>
```

### 6.6 EntityCard

```vue
<template>
  <div class="group glass rounded-2xl p-5 card-lift cursor-pointer"
       @click="$emit('select')">
    <div class="flex items-start gap-4">
      <!-- Logo o icono -->
      <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon :name="entityIcon" class="w-7 h-7 text-primary" />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-white truncate">{{ name }}</h3>
        <p class="text-sm text-white/50 truncate">{{ typeLabel }} · {{ city }}</p>
        <p class="text-sm text-white/40 mt-1">{{ address }}</p>
      </div>

      <!-- Arrow -->
      <Icon name="chevron-right"
            class="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
    </div>

    <!-- Services preview si existen -->
    <div v-if="services?.length" class="mt-4 pt-4 border-t border-white/5">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="service in services.slice(0, 3)"
          :key="service.id"
          class="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60"
        >
          {{ service.name }}
        </span>
        <span v-if="services.length > 3" class="text-xs text-white/40">
          +{{ services.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>
```

### 6.7 Profile Components

**ProfileCard:**
```vue
<template>
  <div class="glass rounded-2xl p-6">
    <!-- Avatar + basic info -->
    <div class="flex items-center gap-4 mb-6">
      <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
        <span class="text-2xl font-bold text-primary">
          {{ initials }}
        </span>
      </div>
      <div>
        <h2 class="text-xl font-semibold text-white">{{ fullName }}</h2>
        <p class="text-white/50">{{ email }}</p>
      </div>
    </div>

    <!-- Editable fields -->
    <div class="space-y-4">
      <ProfileField
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :value="field.value"
        :editable="field.editable"
        @save="(val) => $emit('update', field.key, val)"
      />
    </div>
  </div>
</template>
```

**NotificationSettings:**
```vue
<template>
  <div class="glass rounded-2xl p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Notificaciones</h3>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-white font-medium">Notificaciones push</p>
          <p class="text-sm text-white/50">Recibe alertas cuando te llamen</p>
        </div>
        <UiToggle v-model="pushEnabled" @change="togglePush" />
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-white font-medium">Email</p>
          <p class="text-sm text-white/50">Resumen diario de turnos</p>
        </div>
        <UiToggle v-model="emailEnabled" @change="toggleEmail" />
      </div>
    </div>

    <div v-if="!pushEnabled" class="mt-4 p-4 rounded-xl bg-amber/10 border border-amber/20">
      <p class="text-sm text-amber">
        Activa las notificaciones push para recibir alertas en tiempo real.
      </p>
      <UiButton variant="outline" size="sm" class="mt-2" @click="requestPermission">
        Activar notificaciones
      </UiButton>
    </div>
  </div>
</template>
```

---

## 7. LOADING, EMPTY & ERROR STATES

### 7.1 Skeleton System

```css
/* Global skeleton shimmer */
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
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
    background: oklch(100% 0 0 / 0.03);
  }
}
```

### 7.2 Empty States Premium

```vue
<!-- components/empty/EmptyTurns.vue -->
<template>
  <div class="text-center py-20 px-4">
    <!-- Ilustración animada -->
    <div class="relative w-32 h-32 mx-auto mb-6">
      <div class="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
      <div class="absolute inset-4 rounded-2xl bg-primary/20 flex items-center justify-center">
        <Icon name="ticket" class="w-12 h-12 text-primary" />
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

### 7.3 Error States

```vue
<!-- components/error/ErrorState.vue -->
<template>
  <div class="text-center py-16 px-4">
    <div class="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-500/10
                flex items-center justify-center">
      <Icon name="alert-triangle" class="w-10 h-10 text-red-400" />
    </div>

    <h3 class="text-xl font-semibold text-white mb-2">{{ title }}</h3>
    <p class="text-white/50 mb-6 max-w-sm mx-auto">{{ message }}</p>

    <div class="flex items-center justify-center gap-3">
      <UiButton variant="outline" @click="$emit('retry')">
        Reintentar
      </UiButton>
      <UiButton variant="ghost" @click="$emit('go-back')">
        Volver
      </UiButton>
    </div>
  </div>
</template>
```

---

## 8. MICRO-INTERACTIONS (emil-design-eng)

### 8.1 Button Press Feedback

```css
/* Todo botón debe tener esto */
.btn-press {
  transition: transform 160ms var(--ease-out);
}
.btn-press:active {
  transform: scale(0.97);
}
```

### 8.2 Status Dot Animation

```css
.status-dot {
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}
```

### 8.3 Card Hover Lift

```css
.card-lift {
  transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px oklch(55% 0.18 285 / 0.2);
}
```

### 8.4 Stagger Animation

```css
/* Para listas que entran con stagger */
.animate-enter {
  animation: slide-up-fade 0.5s var(--ease-out) both;
}

@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Stagger delays */
.animate-enter:nth-child(1) { animation-delay: 0ms; }
.animate-enter:nth-child(2) { animation-delay: 80ms; }
.animate-enter:nth-child(3) { animation-delay: 160ms; }
.animate-enter:nth-child(4) { animation-delay: 240ms; }
.animate-enter:nth-child(5) { animation-delay: 320ms; }
```

---

## 9. PWA — INSTALACIÓN EN MÓVIL

### 9.1 Concepto: Installable Web App (No Play Store)

TuTurno es una **Progressive Web App (PWA)** que puede instalarse en el hogar del móvil como un acceso directo, sin pasar por la Play Store o App Store.

**Beneficios:**
- No requiere aprobación de store
- Instalación instantánea
- Funciona offline (partial)
- Acceso desde pantalla de inicio

### 9.2 manifest.json

```json
{
  "name": "TuTurno - Turnos Digitales",
  "short_name": "TuTurno",
  "description": "Solicita y gestiona turnos digitales sin filas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D14",
  "theme_color": "#6C3AE8",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["business", "productivity"],
  "lang": "es-CO",
  "dir": "ltr"
}
```

### 9.3 Service Worker (sw.js)

```javascript
// public/sw.js
const CACHE_NAME = 'tuturno-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const options = {
    body: data.body || 'Tienes una notificación de TuTurno',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'TuTurno', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
```

### 9.4 Cómo instalar en móvil (UX)

**En Chrome/Android:**

1. Usuario abre TuTurno en Chrome móvil
2. Aparece banner inferior: "¿Instalar TuTurno?"
3. Usuario toca "Instalar"
4. App aparece en pantalla de inicio

**Si no aparece el banner:**

1. Menú (tres puntos) → "Instalar app"
2. O: "Agregar a pantalla de inicio" en el menú

**En Safari/iOS:**

1. Usuario abre TuTurno en Safari
2. Compartir → "Agregar a pantalla de inicio"
3. Elegir nombre e icono → Añadir

### 9.5 Componente InstallPrompt

```vue
<!-- components/pwa/InstallPrompt.vue -->
<script setup lang="ts">
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstallable = ref(false)
const isInstalled = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
  })

  window.addEventListener('appinstalled', () => {
    isInstalled.value = true
    deferredPrompt.value = null
    isInstallable.value = false
  })

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled.value = true
  }
})

async function install() {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    isInstallable.value = false
  }
  deferredPrompt.value = null
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isInstallable && !isInstalled"
      class="fixed bottom-20 left-4 right-4 glass rounded-2xl p-4 z-50"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon name="download" class="w-6 h-6 text-primary" />
        </div>
        <div class="flex-1">
          <p class="font-medium text-white">Instalar TuTurno</p>
          <p class="text-sm text-white/50">Accede rápido desde tu pantalla de inicio</p>
        </div>
        <div class="flex gap-2">
          <UiButton variant="ghost" size="sm" @click="isInstallable = false">
            Después
          </UiButton>
          <UiButton variant="primary" size="sm" @click="install">
            Instalar
          </UiButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 300ms var(--ease-out);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
```

---

## 10. API CONTRACTS

### 10.1 Búsqueda por Cédula (Público)

```typescript
// GET /api/turns/by-document?documentId=12345678

interface TurnByDocumentResponse {
  success: true
  data: {
    turns: Turn[]
    hasAccount: boolean
  }
} | {
  success: false
  error: {
    code: 'NOT_FOUND'
    message: 'No se encontraron turnos activos'
  }
}
```

### 10.2 Registro Rápido

```typescript
// POST /api/auth/register-simple

interface RegisterSimpleRequest {
  documentId: string
  fullName: string
  email: string
  password: string
  phone?: string
}

interface RegisterSimpleResponse {
  success: true
  data: {
    user: User
    tokens: {
      accessToken: string
      refreshToken: string
    }
    turnsLinked: number // Turnos asociados a la cédula
  }
}
```

### 10.3 Crear Turno (Ciudadano)

```typescript
// POST /api/turns

interface CreateTurnRequest {
  documentId: string // Si no está autenticado
  serviceId: string
}

interface CreateTurnResponse {
  success: true
  data: {
    turn: Turn
    queuePosition: number
    estimatedWait: number
    turnNumber: string
  }
}
```

---

## 11. RESPONSIVE CHECKLIST

### Pantallas Pequeñas (< 768px)
- [ ] Bottom navigation visible
- [ ] Full-width cards (no max-width限制了)
- [ ] Touch targets mínimo 44x44px
- [ ] Safe areas para notch/home indicator
- [ ] Cards con padding 16px
- [ ] Empty states centrada verticalmente
- [ ] Formularios con input grande (min 48px height)

### Pantallas Grandes (>= 768px)
- [ ] Sidebar visible (si aplica)
- [ ] Content max-width: 64rem (1024px)
- [ ] Cards en grid de 2 columnas si hay muchas
- [ ] Header sticky con más info
- [ ] Hover states funcionando
- [ ] Skeleton loaders no parpadean

---

## 12. ANIMACIONES CHECKLIST (emil-design-eng)

- [ ] `prefers-reduced-motion` respetado en TODAS las animaciones
- [ ] Ninguna animación en elementos de alta frecuencia (navegación, tabs)
- [ ] Botones con `transform: scale(0.97)` en :active
- [ ] Entradas de lista con stagger (30-80ms entre items)
- [ ] Transiciones de página: fade 200ms
- [ ] Skeleton shimmer para loading states
- [ ] Turn number flip animation al cambiar
- [ ] Progress bar con shimmer animado
- [ ] Status badge fade + scale desde 0.95

---

## 13. FLUJO COMPLETO DE SESIÓN

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PANTALLA INICIAL                           │
│                                                                     │
│   Sin sesión                                                         │
│   └── Landing page con búsqueda por cédula                          │
│                                                                     │
│   Input cédula → Busca turnos                                       │
│   ├── Turnos encontrados → Mostrar tracker (solo lectura)         │
│   │                        └── "Crea cuenta para guardar"          │
│   └── Sin turnos → Opciones: crear cuenta o solicitar turno        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Usuario toca "Crear cuenta")
┌─────────────────────────────────────────────────────────────────────┐
│                      FORMULARIO DE REGISTRO                         │
│                                                                     │
│   Campos:                                                           │
│   - Cédula (pre-poblado si venía de búsqueda)                       │
│   - Nombre completo                                                 │
│   - Email                                                            │
│   - Contraseña                                                       │
│   - Teléfono (opcional)                                              │
│                                                                     │
│   Al registrar:                                                     │
│   1. Busca turnos previos con esa cédula                            │
│   2. Asocia turnos al nuevo usuario                                 │
│   3. Login automático                                               │
│   4. Redirige a /app                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Login exitoso)
┌─────────────────────────────────────────────────────────────────────┐
│                         APP CIUDADANO                               │
│                                                                     │
│   /app (Home)                                                       │
│   /app/turns (Mis turnos)                                           │
│   /app/turns/[id] (Tracking)                                        │
│   /app/entities (Listado entidades)                                │
│   /app/entities/[id] (Detalle entidad)                              │
│   /app/profile (Perfil + settings)                                  │
│                                                                     │
│   Logout → Vuelve a landing (sin perder búsquedas)                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 14. PREGUNTAS PARA CONFIRMAR ANTES DE CONSTRUIR

1. **Autenticación dual:** ¿El flujo "solo cédula" es suficiente para buscar, y la cuenta es solo para guardar/perfil?
2. **Vincular turnos:** Si alguien busca por cédula sin cuenta, luego crea cuenta, ¿se vinculan automáticamente los turnos encontrados?
3. **Límite de turnos:** ¿Un ciudadano puede tener múltiples turnos activos? (Normalmente no, solo 1 activo)
4. **Notificaciones:** ¿Push notifications solo cuando está "called" (le están llamando), o también 3 turnos antes?
5. **Geolocalización:** ¿Se usa ubicación para filtrar entidades cercanas, o es solo búsqueda por nombre?
6. **Horarios:** ¿Los turnos se pueden solicitar 24/7, o solo dentro del horario del servicio?

---

*Documento generado: Mayo 2026*
*Skills aplicadas: design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation*