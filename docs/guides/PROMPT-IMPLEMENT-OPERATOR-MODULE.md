# PROMPT: Implementar Módulo Operador — TuTurno

## Contexto

**Proyecto:** TuTurno - Sistema de Turnos Digitales
**Stack:** Nuxt 3 + Vue 3 Composition API + TypeScript + Tailwind CSS v4
**Archivos de referencia:**
- `CLAUDE.md` — Reglas de código
- `docs/profiles/OPERATOR-MODULE-REQUIREMENTS.md` — **DOCUMENTO MAESTRO**
- `docs/profiles/CITIZEN-MODULE-REQUIREMENTS.md` — Referencia para theme system y componentes compartidos

---

## Objetivo

Implementar COMPLETAMENTE el módulo operador siguiendo los documentos.

---

## Pasos Obligatorios

### FASE 1: Lectura

**1.1** Leer COMPLETAMENTE:
1. `docs/profiles/OPERATOR-MODULE-REQUIREMENTS.md`
2. `docs/profiles/CITIZEN-MODULE-REQUIREMENTS.md` (sección 1.6 Theme, sección 3 WebSocket)
3. `CLAUDE.md`

**1.2** Resumir:
- Flujo de trabajo del operador (acciones: llamar, completar, no-show, pausar)
- Componentes específicos del operador
- Integración WebSocket para cola en tiempo real
- Keyboard shortcuts

---

### FASE 2: Inventario

**2.1** Ver qué existe deOperatorModule en `/components/operator/`

**2.2** Ver qué API routes existen en `/server/api/operator/`

**2.3** Revisar layouts existentes (`/layouts/operator.vue`)

---

### FASE 3: Implementación

### 3.1 Composable: useOperatorShortcuts
```typescript
// composables/useOperatorShortcuts.ts
// Keyboard shortcuts: Space (call next), Enter (complete), N (no-show), P (pause)
// Solo activo cuando NO hay input enfocado
```

### 3.2 Composable: useOperatorQueue
```typescript
// composables/useOperatorQueue.ts
// ws.subscribe('service:XXX')
// actions: callNext(), complete(), noShow(), pause()
// stats: totalToday, attended, noShow, avgWaitTime
```

### 3.3 Componentes Operator

1. **`components/operator/OperatorQueue.vue`**
   - Stats bar (turnos hoy, atendidos, tiempo avg)
   - Current turn con TurnCounterDisplay hero size
   - Botones: Completar, No-show
   - Lista de siguientes en cola
   - Pause toggle

2. **`components/operator/OperatorCurrentTurn.vue`**
   - Número de turno grande
   - Nombre del ciudadano
   - Tiempo en atención
   - Animación de glow cuando activo

3. **`components/operator/OperatorControls.vue`**
   - Botones grandes para acciones
   - Estados: idle (call next), attending (complete/no-show)
   - Feedback visual al completar (bounce check animation)

4. **`components/operator/OperatorStats.vue`**
   - Cards con métricas del día
   - Grid responsive

5. **`components/operator/OperatorStatsChart.vue`**
   - Chart.js o similar
   - Turnos por hora
   - Tiempo de espera promedio

### 3.4 Páginas

1. **`pages/operator/index.vue`**
   - definePageMeta({ middleware: 'operator', layout: 'operator' })
   - OperatorQueue component
   - useOperatorShortcuts activo
   - ws connection indicator

2. **`pages/operator/stats.vue`**
   - Estadísticas del día
   - Gráficos de rendimiento
   - Selector de período

### 3.5 Layout

1. **`layouts/operator.vue`**
   - Sidebar con navegación
   - Service selector dropdown
   - Theme toggle
   - Responsive: mobile full-screen queue

### 3.6 API Routes

1. **`server/api/operator/queue.get.ts`**
   - GET /api/operator/queue?serviceId=XXX
   - Retorna currentTurn, nextTurns, stats, isPaused

2. **`server/api/operator/call-next.post.ts`**
   - POST con serviceId
   - Actualiza turno a 'called'
   - Broadcast WS a todos en el room

3. **`server/api/operator/complete.post.ts`**
   - POST con turnId, serviceId
   - Actualiza a 'completed'
   - Llama siguiente si hay

4. **`server/api/operator/no-show.post.ts`**
   - POST con turnId, serviceId
   - Actualiza a 'no_show'
   - Llama siguiente

5. **`server/api/operator/pause-queue.post.ts`**
   - POST con serviceId, paused: boolean
   - Broadcast SERVICE_PAUSED/SERVICE_RESUMED

### 3.7 Middleware

1. **`middleware/operator.ts`**
   - Verificar role === 'operator' || role === 'admin'
   - Redirect a login si no autenticado
   - Redirect a /app si no es operador

---

### FASE 4: Verificación

**4.1** TypeScript:
```bash
npm run typecheck
```

**4.2** Probar manualmente:
- Login como operador
- Ver cola de turnos
- Llamar siguiente turno
- Completar turno
- Marcar no-show
- Pausar/reanudar cola
- Keyboard shortcuts funcionando
- Theme toggle

**4.3** Responsive:
- Desktop: sidebar visible, botones normales
- Tablet: sidebar colapsable
- Mobile: full-screen queue, botones huge (60px+)

---

## Reglas ABSOLUTAS

1. TypeScript strict, sin `any`
2. Botones con `transform: scale(0.97)` en :active
3. Acciones del operador generan broadcast WS inmediato
4. Tiempo real: operador ve cambios sin refrescar
5. Stats actualizados en tiempo real

---

## Skills a Usar

- `nuxt` — routing, layouts, server routes
- `vue-best-practices` — componentes Vue
- `websocket-implementation` — WS para cola
- `real-time-features` — eventos en tiempo real
- `emil-design-eng` — animaciones de feedback (bounce on complete)

---

## Output Esperado

Reportar al terminar:
1. Archivos creados/modificados
2. API routes creadas
3. Pruebas manuales realizadas
4. Errores corregidos
5. Checklist pre-commit completo

---

*Prompt generado: Mayo 2026*