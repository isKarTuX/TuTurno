# TuTurno — Módulo Operador: Documento Maestro de Requisitos

> **Versión:** 1.0 | **Fecha:** Mayo 2026 | **Proyecto:** TuTurno - Sistema de Turnos Digitales
> **Propósito:** Consolidar requisitos, reglas y contexto para el módulo de operador.
> **Skills aplicadas:** design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation

---

## 1. CONTEXTO Y VISIÓN

### 1.1 Propuesta de Valor

El **Operador** es la persona que atiende al ciudadano en un punto de atención específico (ventanilla, módulo, escritorio). Su rol es:

1. **Llamar al siguiente turno** de la cola
2. **Registrar atención completada** o no-show
3. **Pausar/Reanudar cola** si es necesario
4. **Ver estadísticas del día** en tiempo real

### 1.2 Principios de Diseño

| Principio | Aplicación |
|-----------|------------|
| **Velocidad** | Acciones en máximo 2 taps |
| **Claridad** | Estado de cola siempre visible |
| **Feedback inmediato** | Cada acción confirma visualmente |
| **Sin fricción** | No requiere formación, interfaz intuitiva |

---

## 1.3 Theme System — Modo Claro y Oscuro

### 1.3.1 Philosophy

El operador puede estar usando la app en condiciones de mucha luz (ventanilla junto a ventana) o poca luz (oficina oscura). El tema debe adaptarse sin afectar su eficiencia.

**El tema oscuro es default**, pero el operador puede cambiarlo rápidamente. La preferencia se guarda para futuras sesiones.

### 1.3.2 CSS Variables (same as Citizen, repeated for completitud)

```css
/* Dark (default) */
:root,
[data-theme="dark"] {
  --color-primary:        oklch(55% 0.18 285);
  --bg-base:     oklch(13% 0.015 285);
  --bg-surface:  oklch(16% 0.015 285);
  --text-primary:   oklch(100% 0 0);
  --text-secondary: oklch(75% 0 0);
  /* ... resto de variables dark */
}

/* Light */
[data-theme="light"] {
  --color-primary:        oklch(50% 0.18 285);
  --bg-base:     oklch(98% 0 0);
  --bg-surface:  oklch(100% 0 0);
  --text-primary:   oklch(15% 0 0);
  --text-secondary: oklch(45% 0 0);
  /* ... resto de variables light */
}
```

### 1.3.3 Operator-Specific Theme Considerations

| Elemento | Dark Mode | Light Mode |
|----------|-----------|------------|
| Current turn highlight | Glow violeta pulsante | Sombra violeta suave, sin glow |
| Stats numbers | White text | Dark text |
| Action buttons | Violeta con glow | Violeta sólido, mejor contraste |
| Queue list | Cards oscuras | Cards claras |
| WS status indicator | Verde/rojo claro | Verde/rojo oscuro |

### 1.3.4 Theme Toggle for Operator

```vue
<!-- En operator header/layout -->
<button
  class="w-10 h-10 rounded-xl glass flex items-center justify-center"
  @click="toggleTheme"
>
  <Icon :name="theme === 'dark' ? 'sun' : 'moon'" class="w-5 h-5" />
</button>
```

### 1.3.5 Performance Consideration

El operador puede cambiar de tema frecuentemente durante el día. La transición debe ser **instantánea**, sin delay.

```css
/* Transition suave pero rápida */
[data-theme] {
  transition: background-color 200ms var(--ease-out),
              color 150ms var(--ease-out);
}
```

---

## 2. FLUJO DE TRABAJO DEL OPERADOR

### 2.1 Pantalla Principal: Cola de Turnos

```
┌─────────────────────────────────────────────────────────────────────┐
│  OPERADOR DASHBOARD                                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  EPS Sura - Afiliaciones                    [Pausar] [Ajustes] │ │
│  │  Turnos hoy: 47  |  Atendidos: 32  |  Tiempo avg: 8 min       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                         COLA ACTUAL                            │ │
│  │                                                                │ │
│  │   AHORA ATENDIENDO                                            │ │
│  │   ┌─────────────────────────────────────────────────────────┐ │ │
│  │   │  B-047                                      🔴 Atendiendo │ │ │
│  │   │  Estado: En atención desde hace 6 min                  │ │ │
│  │   └─────────────────────────────────────────────────────────┘ │ │
│  │                                                                │ │
│  │   SIGUIENTE EN COLA                                           │ │
│  │   ┌─────────────────────────────────────────────────────────┐ │ │
│  │   │  B-048   María González           #2 en cola            │ │ │
│  │   │  Esperando ~12 min                                      │ │ │
│  │   │                                    [Llamar siguiente]   │ │ │
│  │   └─────────────────────────────────────────────────────────┘ │ │
│  │   ┌─────────────────────────────────────────────────────────┐ │ │
│  │   │  B-049   Carlos Rodríguez        #3 en cola            │ │ │
│  │   │  Esperando ~24 min                                      │ │ │
│  │   └─────────────────────────────────────────────────────────┘ │ │
│  │   ┌─────────────────────────────────────────────────────────┐ │ │
│  │   │  B-050   Ana Martínez            #4 en cola            │ │ │
│  │   │  Esperando ~36 min                                      │ │ │
│  │   └─────────────────────────────────────────────────────────┘ │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  [Llamar siguiente]  [Marcar no-show]  [Pausar cola]          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Acciones Rápidas

| Acción | Atajo | Resultado |
|--------|-------|-----------|
| Llamar siguiente | Tap botón / `Space` | Turno pasa a `called`, WS notifica al ciudadano |
| Completar atención | Tap botón / `Enter` | Turno pasa a `completed`, se limpia pantalla actual |
| No-show | Tap botón / `N` | Turno pasa a `no_show`, se llama siguiente |
| Pausar cola | Tap botón / `P` | Cola deja de aceptar nuevos turnos (admin puede reanudar) |

### 2.3 Estados de Turno (desde el operador)

```
waiting ──[Llamar]──→ called ──[Completar]──→ completed
                        │
                        │──[No-show]──→ no_show
                        │
                        └── (cola pausada)
```

---

## 3. API CONTRACTS — OPERADOR

### 3.1 Obtener Cola del Servicio

```typescript
// GET /api/operator/queue?serviceId=xxx

interface QueueResponse {
  success: true
  data: {
    service: Service
    entity: Entity
    currentTurn: Turn | null
    nextTurns: Turn[]
    stats: {
      totalToday: number
      attended: number
      noShow: number
      avgWaitTime: number
      avgAttentionTime: number
    }
    isPaused: boolean
  }
}
```

### 3.2 Acciones de Operador

```typescript
// POST /api/operator/call-next
interface CallNextRequest {
  serviceId: string
}
interface CallNextResponse {
  success: true
  data: {
    turn: Turn
    queuePosition: number
    estimatedWait: number
  }
}

// POST /api/operator/complete
interface CompleteRequest {
  turnId: string
  serviceId: string
}
interface CompleteResponse {
  success: true
  data: {
    turn: Turn
    nextTurn: Turn | null
  }
}

// POST /api/operator/no-show
interface NoShowRequest {
  turnId: string
  serviceId: string
}
interface NoShowResponse {
  success: true
  data: {
    turn: Turn
    nextTurn: Turn | null
  }
}

// POST /api/operator/pause-queue
interface PauseQueueRequest {
  serviceId: string
  paused: boolean
}
```

### 3.3 WebSocket para Operador

```typescript
// El operador también recibe actualizaciones en tiempo real

WS_EVENTS = {
  // Server → Operator
  QUEUE_UPDATED: 'QUEUE_UPDATED',      // Cola cambió
  TURN_CALLED: 'TURN_CALLED',          // Alguien fue llamado
  SERVICE_PAUSED: 'SERVICE_PAUSED',    // Servicio pausado
  SERVICE_RESUMED: 'SERVICE_RESUMED',  // Servicio reanudado

  // Client → Server
  OPERATOR_ACTION: 'OPERATOR_ACTION',  // call_next | complete | no_show | pause
}
```

---

## 4. COMPONENTES — OPERADOR

### 4.1 OperatorQueue (Componente Principal)

```vue
<template>
  <div class="space-y-6">
    <!-- Stats Bar -->
    <div class="glass rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-6 text-sm">
        <div>
          <span class="text-white/50">Turnos hoy</span>
          <span class="ml-2 text-white font-semibold">{{ stats.totalToday }}</span>
        </div>
        <div class="w-px h-4 bg-white/10" />
        <div>
          <span class="text-white/50">Atendidos</span>
          <span class="ml-2 text-white font-semibold">{{ stats.attended }}</span>
        </div>
        <div class="w-px h-4 bg-white/10" />
        <div>
          <span class="text-white/50">Tiempo avg</span>
          <span class="ml-2 text-white font-semibold">{{ stats.avgAttentionTime }}min</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full"
          :class="isPaused ? 'bg-amber' : 'bg-green-400'"
        />
        <span class="text-sm text-white/50">
          {{ isPaused ? 'Pausado' : 'Activo' }}
        </span>
      </div>
    </div>

    <!-- Current Turn -->
    <div v-if="currentTurn" class="glass rounded-3xl p-6 border-2 border-primary/50">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-white/50 uppercase tracking-wider">Atendiendo ahora</span>
        <span class="px-3 py-1 rounded-full bg-blue/20 text-blue text-sm">
          En progreso
        </span>
      </div>

      <div class="text-center py-8">
        <TurnCounterDisplay :number="currentTurn.turnNumber" size="hero" />
        <p class="text-white/70 mt-2">{{ currentTurn.citizenName }}</p>
        <p class="text-sm text-white/40 mt-1">
          En atención desde {{ formatTime(currentTurn.calledAt) }}
        </p>
      </div>

      <div class="flex gap-3 mt-6">
        <UiButton
          variant="primary"
          size="lg"
          class="flex-1 btn-press"
          @click="completeTurn"
        >
          <Icon name="check" class="w-5 h-5 mr-2" />
          Completar
        </UiButton>
        <UiButton
          variant="outline"
          size="lg"
          class="btn-press"
          @click="markNoShow"
        >
          <Icon name="user-x" class="w-5 h-5" />
        </UiButton>
      </div>
    </div>

    <!-- Empty state: no current turn -->
    <div v-else class="glass rounded-3xl p-8 text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
        <Icon name="clock" class="w-10 h-10 text-white/20" />
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">Sin turnos en atención</h3>
      <p class="text-white/50 mb-6">Presiona "Llamar siguiente" para continuar</p>

      <UiButton
        variant="primary"
        size="lg"
        class="btn-press"
        :disabled="nextTurns.length === 0 || isPaused"
        @click="callNext"
      >
        <Icon name="phone-outgoing" class="w-5 h-5 mr-2" />
        Llamar siguiente
      </UiButton>
    </div>

    <!-- Next in queue -->
    <div v-if="nextTurns.length > 0" class="space-y-3">
      <h3 class="text-sm text-white/50 uppercase tracking-wider">Siguientes en cola</h3>

      <div
        v-for="(turn, index) in nextTurns"
        :key="turn.id"
        class="glass rounded-2xl p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-2xl font-bold text-white">{{ turn.turnNumber }}</span>
            <div>
              <p class="text-white font-medium">{{ turn.citizenName }}</p>
              <p class="text-sm text-white/50">#{{ index + 2 }} en cola · ~{{ turn.estimatedWait }}min</p>
            </div>
          </div>

          <UiButton
            v-if="index === 0"
            variant="outline"
            size="sm"
            @click="callNext"
          >
            Llamar
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Pause Controls -->
    <div class="glass rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-white font-medium">Pausar cola</p>
        <p class="text-sm text-white/50">No se aceptarán nuevos turnos</p>
      </div>
      <UiToggle :modelValue="isPaused" @change="togglePause" />
    </div>
  </div>
</template>

<style scoped>
.btn-press:active {
  transform: scale(0.97);
}
</style>
```

### 4.2 OperatorStats

```vue
<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="glass rounded-2xl p-4 text-center">
      <p class="text-3xl font-bold text-white">{{ totalToday }}</p>
      <p class="text-sm text-white/50 mt-1">Turnos hoy</p>
    </div>

    <div class="glass rounded-2xl p-4 text-center">
      <p class="text-3xl font-bold text-green-400">{{ attended }}</p>
      <p class="text-sm text-white/50 mt-1">Atendidos</p>
    </div>

    <div class="glass rounded-2xl p-4 text-center">
      <p class="text-3xl font-bold text-red-400">{{ noShow }}</p>
      <p class="text-sm text-white/50 mt-1">No asistiron</p>
    </div>

    <div class="glass rounded-2xl p-4 text-center">
      <p class="text-3xl font-bold text-white">{{ avgWaitTime }}<span class="text-sm text-white/50">min</span></p>
      <p class="text-sm text-white/50 mt-1">Espera promedio</p>
    </div>
  </div>
</template>
```

---

## 5. LAYOUT — OPERADOR

### 5.1 Desktop Layout (Operator)

```vue
<!-- layouts/operator.vue -->
<template>
  <div class="min-h-screen bg-bg-base">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 p-4">
      <div class="mb-6">
        <UiLogo size="lg" />
      </div>

      <nav class="space-y-2">
        <NuxtLink
          to="/operator"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/operator') ? 'bg-primary/20 text-primary' : 'text-white/70 hover:bg-white/5'"
        >
          <Icon name="view-list" class="w-5 h-5" />
          <span>Cola</span>
        </NuxtLink>

        <NuxtLink
          to="/operator/stats"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/operator/stats') ? 'bg-primary/20 text-primary' : 'text-white/70 hover:bg-white/5'"
        >
          <Icon name="chart-bar" class="w-5 h-5" />
          <span>Estadísticas</span>
        </NuxtLink>
      </nav>

      <!-- Service selector -->
      <div class="mt-auto pt-4 border-t border-white/5">
        <label class="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Servicio activo
        </label>
        <select
          v-model="activeServiceId"
          class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
        >
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>
    </aside>

    <!-- Main content -->
    <main class="ml-64 p-6">
      <slot />
    </main>
  </div>
</template>
```

### 5.2 Responsive: Mobile Operator View

**El operador puede usar tablet o móvil en el mostrador.**

```vue
<!-- Mobile: Full screen queue, big buttons -->
<template>
  <div class="fixed inset-0 bg-bg-base p-4">
    <!-- Current turn - full width -->
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-white">{{ serviceName }}</h1>
        <UiButton variant="ghost" size="sm">
          <Icon name="cog" class="w-5 h-5" />
        </UiButton>
      </div>

      <!-- Big current turn -->
      <div class="flex-1 flex items-center justify-center">
        <div v-if="currentTurn" class="text-center">
          <TurnCounterDisplay :number="currentTurn.turnNumber" size="hero" />
        </div>
        <div v-else class="text-center text-white/40">
          <Icon name="inbox" class="w-16 h-16 mx-auto mb-4" />
          <p>Sin turnos en atención</p>
        </div>
      </div>

      <!-- Big action buttons -->
      <div class="grid grid-cols-2 gap-4 pb-4 safe-bottom">
        <UiButton
          variant="outline"
          size="xl"
          class="h-20 btn-press"
          @click="markNoShow"
        >
          <Icon name="user-x" class="w-6 h-6" />
        </UiButton>

        <UiButton
          variant="primary"
          size="xl"
          class="h-20 btn-press"
          @click="currentTurn ? completeTurn() : callNext()"
        >
          {{ currentTurn ? 'Completar' : 'Llamar' }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
```

---

## 6. KEYBOARD SHORTCUTS

Para eficiencia, el operador puede usar teclado:

| Tecla | Acción |
|-------|--------|
| `Space` | Llamar siguiente turno |
| `Enter` | Completar turno actual |
| `N` | Marcar no-show |
| `P` | Pausar/Reanudar cola |
| `Escape` | Deseleccionar / Cancelar |

```typescript
// composables/useOperatorShortcuts.ts
export function useOperatorShortcuts() {
  function handleKeydown(e: KeyboardEvent) {
    // Solo si no hay input enfocado
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key) {
      case ' ':
        e.preventDefault()
        callNext()
        break
      case 'Enter':
        e.preventDefault()
        completeTurn()
        break
      case 'n':
      case 'N':
        e.preventDefault()
        markNoShow()
        break
      case 'p':
      case 'P':
        e.preventDefault()
        togglePause()
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
```

---

## 7. STATES & FEEDBACK

### 7.1 Loading State

```vue
<!-- Skeleton para operator queue -->
<div class="space-y-6">
  <div class="glass rounded-2xl p-4 animate-pulse">
    <div class="flex justify-between">
      <div class="h-4 w-32 bg-white/10 rounded" />
      <div class="h-4 w-16 bg-white/10 rounded" />
    </div>
  </div>

  <div class="glass rounded-3xl p-8">
    <div class="flex justify-center mb-6">
      <div class="w-40 h-20 bg-white/10 rounded-2xl" />
    </div>
    <div class="space-y-2">
      <div class="h-4 w-48 mx-auto bg-white/10 rounded" />
      <div class="h-4 w-32 mx-auto bg-white/10 rounded" />
    </div>
  </div>
</div>
```

### 7.2 WS Connection Status

```vue
<!-- Siempre visible para el operador -->
<div class="fixed top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
  <span
    class="w-2 h-2 rounded-full"
    :class="wsConnected ? 'bg-green-400' : 'bg-red-400'"
  />
  <span class="text-white/50">
    {{ wsConnected ? 'Conectado' : 'Reconectando...' }}
  </span>
</div>
```

### 7.3 Success Feedback (Animations)

```vue
<!-- Cuando se completa un turno, feedback visual -->
<Transition name="success">
  <div
    v-if="showSuccess"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
  >
    <div class="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-in">
      <Icon name="check" class="w-16 h-16 text-green-400" />
    </div>
  </div>
</Transition>

<style scoped>
.success-enter-active {
  animation: bounce-in 0.5s var(--ease-spring);
}
.success-leave-active {
  animation: fade-out 0.3s var(--ease-out);
}

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-out {
  to { opacity: 0; }
}
</style>
```

---

## 8. PAGINAS DEL OPERADOR

### 8.1 /operator (Cola Principal)

```
pages/operator/index.vue
├── definePageMeta({ layout: 'operator', middleware: 'operator' })
├── OperatorQueue component
├── Stats summary
└── WS connection indicator
```

### 8.2 /operator/stats (Estadísticas)

```
pages/operator/stats.vue
├── Today's metrics cards
├── Hourly distribution chart (turnos por hora)
├── Average wait time chart
├── No-show rate
└── Service performance comparison
```

---

## 9. RESPONSIVE CHECKLIST — OPERADOR

### Desktop (>= 1024px)
- [ ] Sidebar visible con navegación
- [ ] Cola en formato de lista compacta
- [ ] Stats en row horizontal
- [ ] Keyboard shortcuts activos

### Tablet (768px - 1023px)
- [ ] Sidebar colapsable (hamburger menu)
- [ ] Cola ocupa todo el ancho
- [ ] Botones más grandes

### Mobile (< 768px)
- [ ] Sin sidebar, full screen queue
- [ ] Botones de acción HUGE (44px min touch target, mejor 60px+)
- [ ] Current turn en centro visual
- [ ] Stats hidden (ver stats en página separada)

---

## 10. PREGUNTAS PARA CONFIRMAR

1. **Múltiples servicios:** ¿Un operador puede manejar múltiples servicios a la vez, o siempre es uno?
2. **Llamar sin ser llamado:** ¿Un operador puede "reservar" un turno para llamarlo después, o siempre es FIFO?
3. **Transferencia:** ¿Un operador puede transferir un turno a otro módulo/ventanilla?
4. **Descanso:** ¿Hay concepto de "pausa personal" del operador (no solo de la cola)?
5. **Prioridad:** ¿Hay turnos prioritarios (embarazadas, tercera edad) que pueden saltar la cola?

---

*Documento generado: Mayo 2026*
*Skills aplicadas: design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation*