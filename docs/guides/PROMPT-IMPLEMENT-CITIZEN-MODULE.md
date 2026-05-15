# PROMPT: Implementar Módulo Ciudadano — TuTurno

## Contexto General

**Proyecto:** TuTurno - Sistema de Turnos Digitales para Colombia
**Stack:** Nuxt 3 + Vue 3 Composition API + TypeScript + Tailwind CSS v4 + Drizzle ORM
**DB:** SQLite (dev) / Supabase PostgreSQL (prod)

**Archivos de referencia obligatorios:**
- `CLAUDE.md` — Reglas绝对的 de código y arquitectura
- `PRODUCT.md` — Propósito del producto y principios de diseño
- `docs/profiles/CITIZEN-MODULE-REQUIREMENTS.md` — **ESTE ES EL DOCUMENTO MAESTRO**
- `docs/BRAND-DESIGN-SYSTEM.md` — Tokens de diseño y sistema visual

---

## Objetivo

Implementar COMPLETAMENTE el módulo ciudadano de TuTurno siguiendo los documentos de requisitos. No generar código sin antes haber leído y comprendido los documentos.

---

## Pasos Obligatorios (ORDEN ESTRICTO)

### FASE 1: Lectura y Comprensión

**Paso 1.1** — Leer COMPLETAMENTE los siguientes archivos en este orden:
1. `PRODUCT.md`
2. `docs/profiles/CITIZEN-MODULE-REQUIREMENTS.md` (leer TODAS las secciones, no saltar)
3. `docs/BRAND-DESIGN-SYSTEM.md`
4. `CLAUDE.md` (secciones 1-7 especialmente)

**Paso 1.2** — Después de leer, resumir en 5 puntos:
- El flujo de usuario principal (cómo un ciudadano interactúa con el sistema)
- Los componentes clave que deben construirse
- Las reglas de diseño que son innegociables
- Los estados y validaciones necesarios
- Las consideraciones responsive

**Paso 1.3** — Identificar dependencias:
- ¿Qué composables existen que puedo usar?
- ¿Qué componentes UI base ya están fabricados?
- ¿Qué API routes ya existen vs cuáles hay que crear?

---

### FASE 2: Inventario de Componentes Existentes

**Paso 2.1** — Listar todos los componentes existentes en `/components`:
```
components/
├── ui/         ← ¿Qué componentes UI base hay?
├── turn/       ← ¿Qué componentes de turno existen?
├── entity/     ← ¿Qué componentes de entidad hay?
└── layout/     ← ¿Qué layouts hay?
```

**Paso 2.2** — Listar composables existentes en `/composables`:
```
composables/
├── useAuth.ts          ← ¿Existe? ¿Qué hace?
├── useTurnQueue.ts      ← ¿Existe? ¿Qué hace?
├── useWebSocket.ts      ← ¿Existe? ¿Qué hace?
├── useNotifications.ts  ← ¿Existe? ¿Qué hace?
└── useToast.ts          ← ¿Existe? ¿Qué hace?
```

**Paso 2.3** — Listar stores existentes en `/stores`:
```
stores/
├── auth.store.ts       ← ¿Existe?
├── turn.store.ts       ← ¿Existe?
└── queue.store.ts      ← ¿Existe?
```

**Paso 2.4** — Listar API routes existentes en `/server/api`:
```
server/api/
├── auth/               ← ¿Qué endpoints hay?
├── turns/              ← ¿Qué endpoints hay?
├── entities/           ← ¿Qué endpoints hay?
└── notifications/       ← ¿Qué endpoints hay?
```

**Paso 2.5** — Leer los componentes y composables existentes para entender convenciones antes de crear nuevos.

---

### FASE 3: Implementación

### Paso 3.1: Composables y Stores (si no existen)

Crear en este orden:
1. **`composables/useTheme.ts`** — Gestión de tema claro/oscuro
   - Implementar según sección 1.6 de CITIZEN-MODULE-REQUIREMENTS.md
   - Debe usar useColorMode de @nuxtjs/color-mode
   - Persistir elección en localStorage
   - Detectar preferencia del sistema

2. **`composables/useTurnRealtime.ts`** — WebSocket para turnos
   - Implementar según sección 3 de CITIZEN-MODULE-REQUIREMENTS.md
   - Suscribir a room del turno específico
   - Manejar eventos: QUEUE_UPDATED, YOUR_TURN, TURN_CANCELLED
   - Auto-reconexión con exponential backoff

3. **`composables/usePushNotifications.ts`** — Notificaciones push
   - Implementar según sección 3.3 de CITIZEN-MODULE-REQUIREMENTS.md
   - Solicitar permiso de Notification
   - Registrar service worker subscription
   - Mostrar notificación in-app + system

4. **`stores/turn.store.ts`** — Estado de turnos del ciudadano
   - `activeTurns` — Turnos activos
   - `historyTurns` — Turnos completados
   - `currentTurn` — Turno siendo atentido ahora
   - acciones: `fetchTurns`, `createTurn`, `cancelTurn`

### Paso 3.2: Componentes UI Base (si no existen)

1. **`components/ui/ThemeToggle.vue`**
   - Toggle entre sol (dark mode) y luna (light mode)
   - Animación de rotación en transición (icon-fade)
   - Accesibilidad: aria-label dinámico

2. **`components/ui/UiSkeleton.vue`** — Sistema de skeleton
   - Variants: `text`, `rectangular`, `circular`
   - Shimmer animation con prefers-reduced-motion respetado

3. **`components/ui/UiToggle.vue`** — Toggle switch
   - Estados: checked/unchecked/disabled
   - Transición suave
   - Tamaño touch-friendly (44x44px min)

4. **`components/empty/EmptyState.vue`**
   - Slot para icono/ilustración
   - Slot para título y descripción
   - Slot para acción

### Paso 3.3: Componentes de Turno

1. **`components/turn/TurnStatusBadge.vue`**
   - Estados: waiting, called, attending, completed, no_show, cancelled
   - Colores según design system (sección 1.3 de CITIZEN)
   - Dot animado para estado "called"
   - Variants de tamaño: sm, md, lg

2. **`components/turn/TurnCounterDisplay.vue`**
   - Flip animation 3D al cambiar número (sección 6.3 del doc)
   - Tamaños: sm, md, lg, hero
   - Perspective para efecto 3D
   - Soporte prefers-reduced-motion

3. **`components/turn/TurnProgressBar.vue`**
   - Gradient fill animado (violeta → azul)
   - Shimmer overlay cuando animated=true
   - Marker de posición animado
   - Responsive (altura adaptable)

4. **`components/turn/TurnCard.vue`**
   - TODOS los estados: waiting, called, attending, completed, no_show, cancelled
   - Glow effect para estados activos (sección 6.1)
   - Turn number con TurnCounterDisplay
   - Progress bar para waiting
   - Acciones: Cancelar, Ver detalles
   - Skeleton overlay para loading

5. **`components/turn/TurnTracker.vue`**
   - Componente principal de tracking (sección 6.2 del doc)
   - Turn number hero size
   - Status message con transición
   - Progress section con stats
   - WS connection indicator
   - Tiempo estimado

6. **`components/turn/TurnHistoryItem.vue`**
   - Para lista de turnos completados
   - Información resumida: número, entidad, fecha, estado
   - Enlace a detalle

### Paso 3.4: Componentes de Búsqueda

1. **`components/citizen/SearchByDocument.vue`**
   - Input cédula con validación
   - Estados: idle, loading, found, not_found, error
   - Placeholder contextual
   - Keyboard: Enter para buscar

2. **`components/citizen/TurnResults.vue`**
   - Muestra resultado de búsqueda
   - TurnTracker si encontró turno
   - Opciones si no encontró (crear cuenta / solicitar turno)

### Paso 3.5: Componentes de Entidad

1. **`components/entity/EntityCard.vue`**
   - Logo/icono de entidad
   - Info: nombre, tipo, ciudad, dirección
   - Services preview (primeros 3 + count)
   - Hover lift animation
   - Responsive padding

2. **`components/entity/EntitySearchBar.vue`**
   - Autocomplete con debounce
   - Resultados filtrados en dropdown
   - Navegación a detalle de entidad

### Paso 3.6: Componentes de Perfil

1. **`components/profile/ProfileCard.vue`**
   - Avatar con iniciales
   - Campos editables inline
   - Estado de carga en edición

2. **`components/profile/NotificationSettings.vue`**
   - Toggle para push notifications
   - Toggle para email notifications
   - Estado de suscripción
   - Botón para solicitar permiso

### Paso 3.7: Componentes PWA

1. **`components/pwa/InstallPrompt.vue`**
   - Detectar beforeinstallprompt event
   - Mostrar banner cuando instalable
   - Botones: Instalar, Después
   - Ocultar después de instalado

### Paso 3.8: API Routes

1. **`server/api/turns/by-document.get.ts`** (NUEVO)
   - Busca turnos activos por número de cédula
   - NO requiere auth (público)
   - Validación Zod para documentId

2. **`server/api/auth/register-simple.post.ts`** (NUEVO)
   - Registro rápido: cédula + nombre + email + password
   - Busca turnos previos con esa cédula y asocia
   - Retorna tokens de auth

3. **`server/api/turns/index.post.ts`** (MODIFICAR)
   - Crear turno puede no requerir auth si se pasa documentId
   - Si usuario logueado, asociar a su cuenta

4. **`server/api/notifications/subscribe.post.ts`** (NUEVO)
   - Registrar push subscription del browser
   - Guardar en tabla push_subscriptions

### Paso 3.9: Layouts

1. **`layouts/citizen.vue`** (MODIFICAR si existe)
   - Header con ThemeToggle + notificar indicator
   - Bottom nav para mobile
   - Safe areas para notch/home indicator
   - Responsive: sidebar para desktop

2. **`layouts/auth.vue`** — Para páginas de auth
   - Sin nav
   - Centrado
   - Compatible con tema claro/oscuro

### Paso 3.10: Páginas

1. **`pages/index.vue`** (MODIFICAR)
   - Mantener landing page actual
   - INTEGRAR SearchByDocument en el hero
   - No debe pedir login para buscar turno

2. **`pages/app/index.vue`** (MODIFICAR si existe)
   - Home del ciudadano autenticado
   - Greeting con nombre
   - Búsqueda de entidades
   - Turnos activos (mini cards)
   - Entidades recomendadas
   - Quick stats

3. **`pages/app/turns/index.vue`** (NUEVO)
   - Lista de turnos con tabs: Activos / Historia
   - TurnCard para cada turno
   - Empty state cuando no hay turnos

4. **`pages/app/turns/[id].vue`** (NUEVO)
   - Tracking page
   - TurnTracker component
   - Detalles del turno
   - Instrucciones "Cuando sea tu turno"
   - WS connection

5. **`pages/app/entities/index.vue`** (NUEVO)
   - Listado de entidades
   - Filtros por tipo/ciudad
   - EntityCard components

6. **`pages/app/entities/[id]/index.vue`** (NUEVO)
   - Detalle de entidad
   - Lista de servicios
   - Horarios

7. **`pages/app/entities/[id]/[serviceId].vue`** (NUEVO)
   - Solicitar turno para servicio específico
   - Info del servicio
   - Cola actual
   - Confirmación
   - Success modal

8. **`pages/app/profile.vue`** (NUEVO)
   - ProfileCard
   - NotificationSettings
   - Editar perfil inline

9. **`pages/auth/login.vue`** (MODIFICAR si existe)
   - Permitir login con cédula + contraseña
   - Link a "Olvidé mi contraseña"

10. **`pages/auth/register.vue`** (MODIFICAR si existe)
    - Registro completo
    - Validación de cédula única

---

### FASE 4: Plugin y Middleware

1. **`plugins/theme.client.ts`**
   - Inicializar colorMode
   - Detectar preferencia del sistema
   - Escuchar cambios de preferencia del sistema

2. **`plugins/ws.client.ts`**
   - Inicializar conexión WebSocket
   - Store connection state
   - Auto-reconexión

3. **`middleware/auth.ts`** (MODIFICAR)
   - Verificar autenticación
   - Redirect a login si no autenticado

4. **`middleware/guest.ts`**
   - Solo para no autenticados (login/register)

---

### FASE 5: Testing y Verificación

**Paso 5.1** — Verificar que TODOS los componentes:
- Usan `<script setup lang="ts">`
- Tienen `defineProps<Props>()` con interfaces
- Tienen `defineEmits<Emits>()` donde necesario
- Siguen naming conventions de CLAUDE.md

**Paso 5.2** — Verificar que TODOS los composables:
- Estan tipados correctamente
- Manejan edge cases
- Tienen cleanup en onUnmounted

**Paso 5.3** — Verificar que TODAS las API routes:
- Validan input con Zod
- Retornan ApiResponse tipado
- Manejan errores con createError

**Paso 5.4** — TypeScript check:
```bash
npm run typecheck
```
Corrigir CUALQUIER error antes de continuar.

**Paso 5.5** — Lint check:
```bash
npm run lint
npm run lint:fix
```
Corrigir warnings.

**Paso 5.6** — Probar en navegador:
- Landing page sin auth
- Búsqueda por cédula
- Crear cuenta
- Solicitar turno
- Ver tracking en tiempo real
- Toggle tema claro/oscuro
- Responsive en mobile

---

## Reglas ABSOLUTAS (NO VIOLAR)

1. **TypeScript strict mode** — No usar `any`, usar tipos específicos
2. **Un componente = una responsabilidad** — Si >200 líneas, dividir
3. **Nunca hardcodear colores** — Usar CSS variables
4. **Nunca `scale(0)` en animaciones** — Usar `scale(0.95) + opacity: 0`
5. **Nunca `ease-in` para UI** — Usar `ease-out` o custom curves
6. **Botones deben tener `transform: scale(0.97)` en :active**
7. **Respetar `prefers-reduced-motion`**
8. **Touch targets mínimo 44x44px**
9. **Loading states para TODAS las operaciones async**
10. **Empty states para TODAS las listas**

---

## Skills a Usar

Usar las siguientes skills según sea necesario:

- **`nuxt`** — Para configuración de Nuxt, routing, server routes
- **`vue-best-practices`** — Para componentes Vue, composables, reactivity
- **`design-taste-frontend`** — Para decisiones de diseño premium
- **`impeccable`** — Para review de diseño, colores OKLCH
- **`emil-design-eng`** — Para animaciones, transiciones, micro-interacciones
- **`responsive-design`** — Para layouts mobile-first, breakpoints
- **`real-time-features`** — Para WebSocket, SSE
- **`websocket-implementation`** — Para implementación de WS

---

## Output Esperado

Al terminar cada fase, reportar:
1. Qué archivos se crearon/modificaron
2. Qué se probó manualmente
3. Qué errores se encontraron y corrigieron
4. Qué falta por hacer

**Antes de hacer commit final:**
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin warnings
- [ ] No console.log en código de producción
- [ ] No `any` types nuevos
- [ ] Animaciones respetan prefers-reduced-motion
- [ ] Theme toggle funciona en ambos modos

---

*Prompt generado: Mayo 2026*
*Para usar con Claude Code u otro asistente de IA*