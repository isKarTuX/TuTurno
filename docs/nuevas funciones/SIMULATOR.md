# SIMULATOR.md — TuTurno Phone Simulator
> Plan de implementación para el agente de Claude Code.
> Lee este documento completo antes de escribir una sola línea.
> Este componente es la pieza más visible de la landing — debe ser perfecta.

---

## 0. CONTEXTO Y OBJETIVO

### Qué se construye
Un simulador interactivo de la app TuTurno embebido en el **Hero de la landing page**,
presentado dentro de un mockup realista de smartphone. El visitante presiona botones
para avanzar por el flujo de la app y ver cómo funciona el sistema de turnos.

### Por qué importa
Este es el primer impacto visual que tiene cualquier visitante. Referentes directos:
- **Linear.app** → hero con producto animado en tiempo real
- **Vercel.com** → demo interactivo del dashboard en el hero
- **Loom.com** → mockup de video-app en el hero

El simulador debe verse como un **producto real corriendo**, no como un mockup estático.

### Estado actual del proyecto
- Stack: Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS v4
- Identidad: Glassmorphism, fondo oscuro (#0D0D14), primario violeta (#6C3AE8)
- Existe un `PhoneMockup.vue` y `LandingRealTime.vue` previos — reemplazarlos o
  refactorizarlos según lo que el agente encuentre. No preservar código que no sirva.

### Arquitectura futura
El simulador ahora es 100% frontend (estado local Vue).
Cuando el backend esté listo (PHASE-06 del proyecto), se migra:
- `useSimulator.ts` (composable local) → `useWebSocket.ts` (composable real)
- Estado local de Pinia → estado reactivo del WebSocket
- Timers simulados → eventos reales del servidor
El composable debe estar diseñado con esta migración en mente desde el inicio.

---

## 1. LAYOUT DEL HERO — REGLAS ABSOLUTAS

### Estructura del Hero (split layout)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO SECTION (100vh mínimo, centrado vertical)                 │
│                                                                 │
│   ┌──────────────────────┐    ┌─────────────────────────────┐   │
│   │   LEFT SIDE (55%)    │    │   RIGHT SIDE (45%)          │   │
│   │                      │    │                             │   │
│   │  Badge: "Turnos      │    │   [PhoneFrame]              │   │
│   │  digitales"          │    │   ┌─────────────────────┐   │   │
│   │                      │    │   │ StatusBar           │   │   │
│   │  H1: Headline        │    │   │ AppScreen (cambia)  │   │   │
│   │  grande y bold       │    │   │                     │   │   │
│   │                      │    │   │                     │   │   │
│   │  Subheadline         │    │   │                     │   │   │
│   │  2 líneas max        │    │   │ HomeIndicator       │   │   │
│   │                      │    │   └─────────────────────┘   │   │
│   │  [CTA Ciudadano]     │    │                             │   │
│   │  [CTA Entidad]       │    │   StepIndicator (dots)      │   │
│   │                      │    │   ControlPanel (botones)    │   │
│   │  TrustBadges         │    │                             │   │
│   └──────────────────────┘    └─────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive breakpoints

```
Mobile (< 768px):
  → Layout en columna: primero texto, luego phone mockup
  → Phone mockup: 75% del ancho de la pantalla, centrado
  → ControlPanel debajo del phone

Tablet (768px - 1024px):
  → Layout split pero phone más pequeño (40% escala)
  → Headline más corto

Desktop (> 1024px):
  → Layout split completo como el diagrama
  → Phone a escala completa
```

---

## 2. COMPONENTES A CREAR

Crear todos en `components/landing/simulator/`:

```
components/landing/simulator/
├── HeroSimulator.vue          ← Componente padre que une todo el hero
├── PhoneFrame.vue             ← El chasis físico del teléfono
├── PhoneStatusBar.vue         ← Barra superior (hora, batería, señal)
├── PhoneHomeIndicator.vue     ← Línea inferior estilo iPhone
├── SimulatorScreen.vue        ← Contenedor de la pantalla activa (transiciones)
├── SimulatorControls.vue      ← Botones de avance + indicador de pasos
└── screens/
    ├── ScreenHome.vue         ← Pantalla 1: Home de la app
    ├── ScreenEntityDetail.vue ← Pantalla 2: Detalle de EPS Sura
    ├── ScreenRequestTurn.vue  ← Pantalla 3: Solicitar turno + confirmación
    ├── ScreenTracking.vue     ← Pantalla 4: Seguimiento en tiempo real
    ├── ScreenNotification.vue ← Pantalla 5: "¡Es tu turno!"
    └── ScreenComplete.vue     ← Pantalla 6: Turno completado + loop
```

Y el composable:
```
composables/useSimulator.ts    ← Toda la lógica de estado del simulador
```

---

## 3. DISEÑO DEL PhoneFrame.vue

### Especificaciones del chasis

El teléfono debe verse como un **iPhone 15 Pro / Pixel 8 estilizado** —
no usar imágenes externas, construir el frame 100% con CSS.

```
Dimensiones base:
  width:  320px (desktop) / 260px (tablet) / 75vw max 300px (mobile)
  height: ratio 19.5:9 (pantalla moderna)
  
Frame exterior:
  - Border-radius: 48px (esquinas muy redondeadas)
  - Background: gradiente titanio oscuro
    linear-gradient(145deg, #2A2A2A, #1A1A1A, #2A2A2A)
  - Box-shadow múltiple:
    → Sombra exterior: 0 40px 80px rgba(0,0,0,0.6)
    → Highlight superior: inset 0 1px 0 rgba(255,255,255,0.1)
    → Glow violeta: 0 0 60px rgba(108,58,232,0.2)
  - Border: 1px solid rgba(255,255,255,0.08)
  - Padding: 12px (el "bisel" del teléfono)

Elementos físicos del frame (solo CSS):
  - Dynamic Island (top center):
    width: 120px, height: 34px, border-radius: 20px
    background: #000
    position: absolute, top: 16px, left: 50%, transform: translateX(-50%)
    
  - Botón lateral derecho (Power):
    width: 3px, height: 70px
    background: #333
    position: absolute, right: -3px, top: 30%
    border-radius: 0 2px 2px 0
    
  - Botones volumen izquierda:
    Dos barras: width: 3px, height: 40px
    background: #333
    position: absolute, left: -3px
    
  - Pantalla interior:
    border-radius: 40px (ligeramente menor que el frame)
    overflow: hidden
    background: #000 (base)
    position: relative

Efecto de profundidad:
  El teléfono flota con animación sutil:
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg) }
    50%      { transform: translateY(-10px) rotate(0.5deg) }
  }
  animation: float 6s ease-in-out infinite;
  
  En hover: pausar la animación y hacer scale(1.02)
```

### PhoneStatusBar.vue

```
Altura: 44px
Background: transparent (muestra el fondo de la pantalla)
Contenido:
  - Izquierda: hora actual real (usar new Date() actualizado cada minuto)
  - Derecha: íconos de señal (3 barras SVG), WiFi (SVG), batería (SVG en 78%)
  - Tipografía: 12px, font-weight: 600, color: white
  - Todo debe verse como una status bar real de iOS
```

---

## 4. DISEÑO DE CADA PANTALLA

### REGLAS GENERALES DE PANTALLAS
- Fondo de cada pantalla: #0F0F1A (casi negro, no negro puro)
- Fuente: var(--font-body) o system-ui
- Scrollbar: hidden (el teléfono no muestra scrollbars)
- Overflow: hidden, todo debe caber sin scroll
- Transición entre pantallas: slide horizontal suave (como iOS)
  `transform: translateX` con transition 350ms cubic-bezier(0.4, 0, 0.2, 1)

---

### PANTALLA 1 — ScreenHome.vue
**Representa:** La pantalla de inicio de la app TuTurno

```
Layout:
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│ Header de la app:           │
│  Logo TuTurno (pequeño)     │
│  "Hola, Carlos 👋"          │
│  Subtítulo: "¿Dónde necesitas│
│  un turno hoy?"             │
├─────────────────────────────┤
│ Barra de búsqueda:          │
│  [🔍 Buscar entidad...]     │
│  Fondo glass, border violeta│
├─────────────────────────────┤
│ Categorías (chips):         │
│  [🏥 EPS] [🏦 Banco]       │
│  [🏛️ Oficinas] [+ Ver todo] │
│  Scroll horizontal          │
├─────────────────────────────┤
│ "Cerca de ti"               │
│  ┌──────────────────────┐   │
│  │ EPS Sura             │   │
│  │ ⭐ Abierto ahora     │   │
│  │ 📍 0.3 km            │   │
│  │ Tiempo est: 15 min   │   │
│  └──────────────────────┘   │
│  (card glass con highlight  │
│   violeta al ser la que     │
│   el usuario va a elegir)   │
│                             │
│  ┌──────────────────────┐   │
│  │ Bancolombia          │   │
│  │ ⭐ Abierto            │   │
│  │ 📍 1.2 km            │   │
│  └──────────────────────┘   │
├─────────────────────────────┤
│ Bottom Nav:                 │
│  [🏠 Inicio] [📋 Mis Turnos]│
│  [🔔 Alertas] [👤 Perfil]   │
└─────────────────────────────┘
```

**Animación de entrada:**
- Header: fade-in desde arriba (100ms delay)
- Search bar: fade-in (200ms delay)  
- Cards: stagger, cada una 80ms de diferencia

**Interacción:**
- La card de "EPS Sura" tiene un pulse sutil (box-shadow pulsante violeta)
  indicando que el usuario debe hacer clic ahí
- Tooltip o flecha animada apuntando a esa card
- El botón de control dice: "Seleccionar EPS Sura →"

---

### PANTALLA 2 — ScreenEntityDetail.vue
**Representa:** Detalle de EPS Sura con sus servicios

```
Layout:
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│ ← Volver    EPS Sura        │
├─────────────────────────────┤
│ Header de entidad:          │
│  [Logo EPS placeholder]     │
│  EPS Sura                   │
│  📍 Cra 2 #34-12, Montería  │
│  🕐 Lun-Vie 7:00am - 5:00pm │
│  🟢 Abierto ahora           │
├─────────────────────────────┤
│ Cola actual:                │
│  ┌────────────────────┐     │
│  │ 👥 5 personas      │     │
│  │ ⏱️ ~25 min espera  │     │
│  └────────────────────┘     │
│  (badge glass con info)     │
├─────────────────────────────┤
│ Servicios disponibles:      │
│                             │
│  ┌──────────────────────┐   │
│  │ Atención General     │   │
│  │ ⏱️ ~5 min por turno  │   │
│  │ 👥 3 en cola         │   │
│  │ [Solicitar turno →]  │   │
│  └──────────────────────┘   │ ← highlighted
│                             │
│  ┌──────────────────────┐   │
│  │ Autorizaciones       │   │
│  │ ⏱️ ~8 min por turno  │   │
│  │ 👥 7 en cola         │   │
│  └──────────────────────┘   │
│                             │
│  ┌──────────────────────┐   │
│  │ Medicamentos         │   │
│  │ ⏱️ ~3 min por turno  │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

**Botón de control:** "Solicitar Atención General →"

---

### PANTALLA 3 — ScreenRequestTurn.vue
**Representa:** Confirmación y generación del turno

Esta pantalla tiene DOS sub-estados (micro-flujo interno):

**Sub-estado A: Confirmación (1.5s)**
```
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│ ← Volver                   │
│ Solicitar Turno             │
├─────────────────────────────┤
│ Resumen:                    │
│  Entidad:  EPS Sura         │
│  Servicio: Atención General │
│  Cola:     5 personas       │
│  Espera:   ~25 min          │
├─────────────────────────────┤
│ Tu información:             │
│  👤 Carlos Martínez         │
│  🪪 CC: 10***456            │
│  📱 +57 310***789           │
├─────────────────────────────┤
│ Notificaciones:             │
│  🔔 Activadas ✓             │
│  Te avisaremos 3 turnos     │
│  antes del tuyo             │
├─────────────────────────────┤
│ [✓ Confirmar y solicitar]   │
│  (botón violeta, full width)│
└─────────────────────────────┘
```

**Sub-estado B: Ticket generado (animación) — aparece al presionar Confirmar**
```
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│                             │
│  ✅ (icono check animado,   │
│     scale desde 0 con       │
│     bounce, color verde)    │
│                             │
│  ¡Turno solicitado!         │
│                             │
│  ┌──────────────────────┐   │
│  │ Tu número de turno   │   │
│  │                      │   │
│  │     B - 0 4 7        │   │  ← tipografía monoespaciada grande
│  │                      │   │     animación: digits caen como slot machine
│  │  EPS Sura            │   │
│  │  Atención General    │   │
│  │  Puesto 3            │   │
│  │  ────────────────    │   │
│  │  [QR Code pequeño]   │   │  ← QR decorativo (puede ser imagen SVG fija)
│  └──────────────────────┘   │
│  (card con border violeta   │
│   y glow, como ticket real) │
│                             │
│  Posición en cola: #5       │
│  Tiempo estimado: ~25 min   │
│                             │
│  [Ver mi turno en tiempo    │
│   real →]                   │
└─────────────────────────────┘
```

**Animación del número B-047:**
- El ticket aparece con scale(0.8) → scale(1) + fade-in (400ms)
- Los dígitos del número hacen "slot machine": cada dígito rueda de arriba
  hacia abajo hasta posicionarse en el número correcto
- Duración: 800ms, stagger de 100ms entre dígitos

**Botón de control:** "Ver seguimiento en tiempo real →"

---

### PANTALLA 4 — ScreenTracking.vue
**Representa:** El corazón del producto — seguimiento en tiempo real

Esta es la pantalla más importante. Debe verse viva y en movimiento.

```
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│ TuTurno          🔔 [menu]  │
├─────────────────────────────┤
│ EPS Sura  ·  Atención Gral  │
│ 🟢 En espera                │
├─────────────────────────────┤
│                             │
│  Tu turno número            │
│  ┌──────────────────────┐   │
│  │                      │   │
│  │     B-047            │   │  ← grande, monoespaciado, glow violeta
│  │                      │   │
│  └──────────────────────┘   │
│                             │
│  Turno actual: B-044        │  ← cambia cada vez que avanza la cola
│                             │
├─────────────────────────────┤
│  Posición en cola           │
│  ┌──────────────────────┐   │
│  │  ● ● ● [TÚ]          │   │  ← avatares de las personas adelante
│  │  3 personas antes    │   │
│  └──────────────────────┘   │
│                             │
│  Barra de progreso:         │
│  [████████░░░░░░░░░░] 40%   │  ← animada, avanza con la cola
│                             │
├─────────────────────────────┤
│  ⏱️ Tiempo estimado         │
│  ~12 minutos                │  ← countdown animado (decrementa)
├─────────────────────────────┤
│  📍 Puesto 3                │
│  Operadora: María López     │
├─────────────────────────────┤
│  ⚠️ [Cancelar mi turno]     │
│  (botón ghost, texto rojo)  │
└─────────────────────────────┘
```

**Animaciones activas en esta pantalla:**

1. **Turno actual** — cuando avanza, el número hace flip animation:
   `B-044` → `B-045` → `B-046` → `B-047` (el tuyo)
   Cada flip: rotateX(90deg) → rotateX(0deg), duración 300ms

2. **Avatares de la cola** — los puntos/avatares de las personas adelante
   desaparecen uno a uno con fade-out + scale-down cuando avanza el turno

3. **Barra de progreso** — se incrementa suavemente con CSS transition

4. **Tiempo estimado** — decrementa cada vez que avanza un turno
   (de ~25 min → ~20 min → ~15 min → ~10 min → ~5 min → ¡Tu turno!)

5. **Número B-047** — tiene glow pulse:
   box-shadow violeta pulsante cada 2s (más intenso cuando faltan 2 turnos)

**Lógica de simulación:**
```
Cola inicial: [B-044, B-045, B-046, B-047(tú)]
Al presionar "Siguiente →" en el control:
  - El turno actual avanza un número
  - Se elimina un avatar de la cola
  - La barra de progreso avanza
  - El tiempo estimado se reduce
  - Cuando llega a B-047: disparar ScreenNotification
```

**Botón de control en cada paso:**
- 3 o 4 personas adelante: "Avanzar cola (faltan 3) →"
- 2 personas adelante: "Avanzar cola (faltan 2) →"  
- 1 persona adelante: "¡Ya casi! Avanzar →"
- 0 personas: transición automática a ScreenNotification (sin botón)

---

### PANTALLA 5 — ScreenNotification.vue
**Representa:** El momento de máximo impacto — es tu turno

```
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│                             │
│   Notificación push:        │
│   ┌──────────────────────┐  │
│   │ 🔔 TuTurno           │  │  ← banner de notificación push
│   │ ¡Es tu turno!        │  │     baja desde arriba con slide-down
│   │ B-047 · EPS Sura     │  │     fondo glass blur
│   └──────────────────────┘  │
│                             │
│  Fondo: violeta vibrante    │
│  con partículas/confetti    │
│                             │
│  🎉 (emoji grande animado)  │
│                             │
│  ¡Es tu turno,              │
│  Carlos!                    │
│  (texto blanco, bold, 24px) │
│                             │
│  Tu número: B-047           │
│  (gigante, glow máximo)     │
│                             │
│  Dirígete al:               │
│  ┌──────────────────────┐   │
│  │ 🪑 Puesto 3           │   │
│  │ Operadora: María L.  │   │
│  │ EPS Sura - Piso 1    │   │
│  └──────────────────────┘   │
│                             │
│  Tienes 5 minutos para      │
│  presentarte                │
│  ⏱️ [05:00 countdown]       │
│                             │
│  [✓ Ya me presenté]         │
│  (botón violeta full width) │
└─────────────────────────────┘
```

**Animaciones:**
- Fondo explota en violeta con fade-in (200ms)
- El banner de notificación baja desde arriba (slide-down, 400ms)
- El número B-047 hace scale 0 → 1.2 → 1 (bounce, 600ms)
- Confetti o partículas (usar canvas pequeño o CSS puro con pseudo-elementos)
- El countdown de 5 minutos es real (usa setInterval)

**Botón de control:** "Marcar como atendido →"

---

### PANTALLA 6 — ScreenComplete.vue
**Representa:** Turno completado + opción de reiniciar

```
┌─────────────────────────────┐
│ StatusBar                   │
├─────────────────────────────┤
│                             │
│  ✅ (check verde grande,    │
│     animación draw stroke)  │
│                             │
│  ¡Turno completado!         │
│                             │
│  EPS Sura                   │
│  Atención General           │
│  Hoy, 2:34 PM               │
│                             │
│  ┌──────────────────────┐   │
│  │ ⏱️ Tiempo de espera  │   │
│  │    12 minutos        │   │
│  │ ─────────────────    │   │
│  │ 🎯 Tiempo atención   │   │
│  │    8 minutos         │   │
│  └──────────────────────┘   │
│  (card glass con stats)     │
│                             │
│  ¿Cómo fue tu experiencia?  │
│  ⭐ ⭐ ⭐ ⭐ ⭐             │
│  (estrellas clickeables)    │
│                             │
│  [📋 Pedir otro turno]      │
│  (botón primario violeta)   │
│                             │
│  [🏠 Ir al inicio]          │
│  (botón ghost)              │
└─────────────────────────────┘
```

**Comportamiento:**
- Al presionar "Pedir otro turno" O después de 3 segundos automáticamente:
  → Reinicia a ScreenHome con transición suave
  → El número de turno incrementa (B-048, B-049...)
  → La cola se reinicia con 5 personas nuevas
- Esto crea el loop infinito mencionado en el objetivo

---

## 5. COMPOSABLE useSimulator.ts — ESPECIFICACIÓN COMPLETA

```typescript
// composables/useSimulator.ts
// TODA la lógica del simulador vive aquí. Los componentes solo consumen estado.

interface SimulatorState {
  // Control de flujo
  currentScreen: ScreenId      // qué pantalla está activa
  currentStep: number          // paso dentro de una pantalla (para sub-estados)
  isAutoPlaying: boolean        // si está en modo auto-play
  
  // Datos del turno
  turnNumber: string           // 'B-047'
  turnCounter: number          // 47 (número incremental global)
  entityName: string           // 'EPS Sura'
  serviceName: string          // 'Atención General'
  
  // Estado de la cola
  queueTotal: number           // 5 (personas totales al inicio)
  queuePosition: number        // posición actual del usuario (empieza en 5)
  currentTurnNumber: string    // 'B-044' (el turno que se está atendiendo)
  currentTurnCounter: number   // 44
  estimatedMinutes: number     // 25 → decrementa
  progressPercent: number      // 0 → 100
  
  // Notificación
  notificationVisible: boolean
  notificationCountdown: number // 300 → 0
  
  // Loop
  loopCount: number            // cuántas veces ha completado el ciclo
}

type ScreenId = 
  | 'home'
  | 'entity-detail'
  | 'request-turn'
  | 'tracking'
  | 'notification'
  | 'complete'

// API del composable (lo que exponen los componentes)
interface SimulatorAPI {
  // Estado (readonly)
  state: Readonly<SimulatorState>
  
  // Acciones
  nextStep(): void         // El usuario presiona el botón de control
  prevStep(): void         // Volver atrás (si aplica)
  reset(): void            // Reiniciar todo el simulador
  toggleAutoPlay(): void   // Activar/desactivar auto-avance
  
  // Computed
  canGoBack: ComputedRef<boolean>
  controlLabel: ComputedRef<string>  // Texto del botón de control
  controlIcon: ComputedRef<string>   // Ícono del botón de control
  progressDots: ComputedRef<number>  // Para el step indicator
}
```

### Máquina de estados del simulador

```
Estado inicial:
  screen: 'home', step: 0

nextStep() transiciones:
  'home'          → 'entity-detail'
  'entity-detail' → 'request-turn' (sub-step 0: confirmación)
  'request-turn' step 0 → step 1 (mostrar ticket, animación)
  'request-turn' step 1 → 'tracking' (cola en 5 personas)
  'tracking' (queuePosition > 1) → avanzar cola en 1
  'tracking' (queuePosition === 1) → 'notification' (auto, sin botón)
  'notification'  → 'complete'
  'complete'      → 'home' (reset del turno, incrementar contador)
```

### Nota de migración al backend real

```typescript
// Cuando se migre al backend (PHASE-06), reemplazar:
//
// ANTES (simulado):
// function advanceQueue() {
//   state.currentTurnCounter++
//   state.queuePosition--
// }
//
// DESPUÉS (WebSocket real):
// wsClient.on('QUEUE_UPDATED', (payload) => {
//   state.currentTurnNumber = payload.currentTurn
//   state.queuePosition = payload.userPosition
// })
//
// El resto del estado y la UI no cambia.
```

---

## 6. SimulatorControls.vue — ESPECIFICACIÓN

```
┌──────────────────────────────────────────────────┐
│  Step Indicator (dots)                           │
│  ● ● ● ○ ○ ○  (dot activo = violeta lleno)      │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  ← Atrás    [Seleccionar EPS Sura →]  ↺   │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  Modo auto: [▶ Auto-play]  (toggle)              │
└──────────────────────────────────────────────────┘
```

**Diseño:**
- Fondo: glass card debajo del teléfono
- Border-radius: 16px
- El botón principal (CTA) es el botón violeta con el label dinámico
- Botón ← Atrás: ghost, solo visible cuando `canGoBack === true`
- Botón ↺ Reset: ícono, siempre visible
- Auto-play toggle: activa que el simulador avance solo cada 3 segundos
- Los dots son 6 (uno por pantalla), el activo tiene escala mayor y color violeta

---

## 7. ANIMACIONES DE TRANSICIÓN ENTRE PANTALLAS

```css
/* SimulatorScreen.vue — usar Vue <Transition> con CSS */

/* Avanzar (slide left) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 350ms cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to   { transform: translateX(-100%); opacity: 0; }

/* Retroceder (slide right) */
.slide-right-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-right-leave-to   { transform: translateX(100%); opacity: 0; }

/* Fade para transiciones especiales (complete → home) */
.fade-enter-active, .fade-leave-active {
  transition: opacity 400ms ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }
```

La dirección de la transición la determina `useSimulator`:
- `nextStep()` → slide-left
- `prevStep()` → slide-right
- reset/loop → fade

---

## 8. EFECTOS DE FONDO DEL HERO (contexto del teléfono)

Alrededor del teléfono, el fondo del Hero debe tener:

```css
/* Gradiente radial desde el centro-derecha donde está el teléfono */
background: radial-gradient(
  ellipse 60% 60% at 75% 50%,
  rgba(108, 58, 232, 0.15) 0%,
  transparent 70%
);

/* Grid de puntos sutiles */
background-image: radial-gradient(
  circle,
  rgba(255,255,255,0.08) 1px,
  transparent 1px
);
background-size: 24px 24px;

/* Blur orbs flotantes (CSS puro, no JS) */
.orb-1 {
  position: absolute;
  width: 300px; height: 300px;
  background: rgba(108,58,232,0.1);
  border-radius: 50%;
  filter: blur(60px);
  top: 10%; right: 5%;
  animation: float-orb 8s ease-in-out infinite;
}
.orb-2 {
  /* Segunda orb con delay diferente */
  animation-delay: -4s;
}
```

**Elementos flotantes alrededor del teléfono** (posición absoluta, CSS puro):
Cards pequeñas glassmorphism que flotan cerca del teléfono:

```
Card 1 (arriba-izquierda del teléfono):
  "✅ Turno completado" — Pepito G. — hace 2 min
  Animación: float lento, delay 0s

Card 2 (abajo-derecha del teléfono):  
  "👥 47 personas atendidas hoy"
  EPS Sura — Puesto 3
  Animación: float lento, delay 2s

Card 3 (arriba-derecha, más pequeña):
  "⏱️ -15 min de espera promedio"
  Animación: float lento, delay 4s
```

En móvil: ocultar las floating cards (`hidden md:block`)

---

## 9. REGLAS DE IMPLEMENTACIÓN PARA EL AGENTE

### Lo que SÍ debes hacer

- Construir el PhoneFrame 100% con CSS, cero imágenes externas para el chasis
- Usar `<Transition>` de Vue para todas las transiciones de pantallas
- Toda la lógica en `useSimulator.ts`, los componentes solo consumen
- El teléfono debe verse bien en todos los breakpoints (definidos en sección 1)
- Usar las variables CSS del proyecto (`--color-primary`, `--glass-bg`, etc.)
- Cada pantalla es un componente separado en `screens/` — no un switch/case en un solo archivo
- El auto-play usa `setInterval` limpiado correctamente con `onUnmounted`
- Las animaciones de números (slot machine, flip) se implementan con CSS puro + clase dinámica, sin librerías externas de animación
- El QR en ScreenRequestTurn puede ser un SVG estático decorativo que simule un QR
- Testear que el loop funcione correctamente: complete → home → nuevo turno

### Lo que NO debes hacer

- No usar `<img>` para el frame del teléfono
- No instalar librerías de animación (Framer Motion, GSAP, etc.) — todo CSS + Vue transitions
- No usar `any` en TypeScript
- No mezclar lógica del simulador con lógica de la landing page real
- No hacer el simulador dependiente de Pinia global — usar estado local del composable
- No olvidar limpiar `setInterval` y event listeners en `onUnmounted`
- No hardcodear colores — usar siempre las variables CSS del proyecto
- No hacer las pantallas scrolleables — todo debe caber en el viewport del teléfono

### Checklist de QA antes de terminar

```
[ ] PhoneFrame se ve realista con bordes, botones físicos y Dynamic Island
[ ] StatusBar muestra hora real actualizada
[ ] Transición slide-left/right funciona en todos los pasos
[ ] Slot machine animation funciona al generar el número de turno
[ ] Flip animation funciona al avanzar la cola en ScreenTracking
[ ] Barra de progreso avanza correctamente
[ ] Tiempo estimado decrementa con cada avance
[ ] ScreenNotification aparece con impacto visual
[ ] Loop funciona: complete → home → nuevo turno (B-048, B-049...)
[ ] Auto-play avanza automáticamente y se puede pausar
[ ] SimulatorControls muestra el label correcto en cada paso
[ ] Responsive: se ve bien en 320px, 768px, 1440px
[ ] No hay console.log ni errores en consola
[ ] No hay memory leaks (setInterval limpiado)
[ ] Todas las variables CSS del proyecto están siendo usadas
[ ] TypeScript sin errores (npm run typecheck)
```

---

## 10. ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
1. useSimulator.ts — máquina de estados completa con datos mock
2. PhoneFrame.vue — solo el chasis, sin contenido
3. PhoneStatusBar.vue — con hora real
4. SimulatorScreen.vue — con Vue <Transition>
5. ScreenHome.vue — layout estático primero
6. SimulatorControls.vue — botones y dots
7. Integrar HeroSimulator.vue — unir todo, verificar que nextStep() funciona
8. ScreenEntityDetail.vue
9. ScreenRequestTurn.vue (sub-estado A: confirmación)
10. Añadir animación slot machine al ticket (sub-estado B)
11. ScreenTracking.vue — estático primero, luego animaciones
12. Añadir flip animation al avanzar cola
13. ScreenNotification.vue con efectos
14. ScreenComplete.vue + loop
15. Floating cards del fondo del Hero
16. Auto-play + toggle
17. Polish responsive
18. QA completo con la checklist
```

---

*Documento para el agente de Claude Code — Proyecto TuTurno*
*Universidad de Córdoba — Ingeniería de Sistemas*
