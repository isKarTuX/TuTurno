# TuTurno — Plan Maestro de Rediseño Frontend

> **Fecha:** Mayo 2026 | **Proyecto:** TuTurno — Sistema de Gestión de Turnos Digitales
> ** Stack:** Nuxt 3 + Vue 3 + Tailwind CSS + TypeScript
> ** Skills aplicadas:** design-taste-frontend (v8,6,4) + impeccable + emil-design-eng

---

## ESTADO ACTUAL — DIAGNÓSTICO

### Lo que funciona bien
- Sistema de glassmorphism bien implementado
- Esquema de colores consistente con variables CSS
- Animaciones base (flip, shimmer, glow) disponibles
- Componentes UI base (UiButton, UiInput, etc.) bien diseñados
- Arquitectura Nuxt híbrida (SSG + SPA)

### Problemas críticos identificados
| Problema | Impacto | Prioridad |
|----------|---------|-----------|
| Color primario #6366F1 es "AI Purple" (design-taste frontal bans) | Identidad genérica | CRÍTICA |
| Logo "TuTurno" sin lettering distintivo | Brand débil | CRÍTICA |
| Sin animaciones de scroll (IntersectionObserver) | Experiencia plana | ALTA |
| Nav mobile usa `<a>` en vez de NuxtLink | SEO y rendimiento | MEDIA |
| Sin skeleton loaders en estados de carga | Percepción de velocidad | ALTA |
| Landing pages no pre-renderizadas | SEO suboptimal | MEDIA |
| Sin microinteracciones en botones | Siente "static" | ALTA |
| Duplicación LandingHero + LandingHeroNew | Código redundante | BAJA |

---

## FASE 1 — IDENTIDAD DE MARCA "TUTURNO"

### 1.1 Paleta de colores estratégicos

**Color Strategy:** `COMMITTED` — Un color saturado carrying 30-60% of surface

| Rol | Color | Justificación |
|-----|-------|---------------|
| **Primary (Brand)** | `#6366F1` (Indigo) |Mantener — es el color de la empresa, coherencia con datos de cédula de ciudadanía |
| **Background Base** | `#09090B` (Zinc-950) | En lugar de `#0F0F1A` — más profundo, menos azul |
| **Surface** | `#18181B` (Zinc-900) | Con tinte cálido sutil hacia marrón |
| **Text Primary** | `#FAFAFA` (Zinc-50) | Nunca blanco puro (#FFF) |
| **Text Secondary** | `#A1A1AA` (Zinc-400) | Con tinte cálido |
| **Turn Status Colors** | OKLCH puro | Verde `#10B981`, Amber `#F59E0B`, etc. |

**Regla OKLCH aplicada:**
```css
--color-primary: oklch(60% 0.18 275); /* Indigo profundo */
--bg-base: oklch(8% 0.01 240); /* Casi negro sin tinte azulado */
--text-primary: oklch(98% 0 0); /* Blanco cálido */
```

### 1.2 Tipografía — Lettering "TuTurno"

**Problema actual:** Font `Unbounded` es geométrica y fría — no transmite la calidez de una app para personas.

**Solución — Sistema tipográfico de 3 capas:**

| Uso | Font | Weight | Carácter |
|-----|------|--------|----------|
| **Logo "TuTurno"** | `Dela Gothic One` o `Clash Display` | 700 | Bold, redondeado, amigable |
| **Headings** | `Geist` | 600-700 | Technical pero legible |
| **Body** | `Geist` | 400 | Claridad en lectura |

**Implementación del logo:**
```css
/* TuTurno logo con efecto hand-drawn sutil */
.logo-text {
  font-family: 'Dela Gothic One', cursive;
  font-size: clamp(2rem, 5vw, 3.5rem);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #818CF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.4));
}

/* Animación de entrada tipo "typewriter" */
@keyframes logo-reveal {
  0% { clip-path: inset(0 100% 0 0); opacity: 0; }
  100% { clip-path: inset(0 0 0 0); opacity: 1; }
}
```

### 1.3 Logo mark — Símbolo "TT"

**Icono actual:** "TT" con gradiente violeta — genérico.

**Rediseño:**
```
Concepto: El reloj de turnos + fluidez
- Forma: Círculo con flecha curvada (símbolo de espera/turno)
- Colores: Primary gradient sobre fondo oscuro
- Animación: La flecha "rota" continuamente (subtle, 8s loop)
```

---

## FASE 2 — LANDING PAGE PRINCIPAL

### 2.1 Arquitectura de secciones (Scroll Storytelling)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER — Nav fijo con blur                                 │
│ Logo "TuTurno" [izquierda] — Nav links [centro] — Auth [derecha] │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ HERO — Full viewport (min-h-[100dvh])                      │
│ ┌─────────────────────┬─────────────────────────────────┐  │
│ │  TuTurno            │   [PHONE MOCKUP INTERACTIVO]     │  │
│ │  Elimina las filas  │   - Turno activo "B-047"        │  │
│ │  para siempre       │   - Progreso animado            │  │
│ │                     │   - Notificaciones simuladas     │  │
│ │  [CTA: Comenzar]    │   -qr code visual               │  │
│ └─────────────────────┴─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ SOCIAL PROOF BAR — Logos de entidades                      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ COMO FUNCIONA — 3 pasos con icons animados                  │
│ (IntersectionObserver reveal por paso)                     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CTA SECTION — Gradient card                                 │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ FOOTER — Links + info                                      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Hero Interactivo (Phone Mockup)

**Concepto:** Un teléfono simulado que muestra la app funcionando en tiempo real.

**Elementos del mockup:**
1. **Header del teléfono:** Hora + battery icon (decorativo)
2. **Pantalla de Turno Activo:**
   - Entidad: "EPS Sura"
   - Turno: "B-047" (número grande, flip animation)
   - Posición: "#3 en cola" (actualizándose)
   - Tiempo estimado: "~12 min"
   - Progress bar animada
3. **Notificaciones simuladas** (cíclicas):
   - "Te quedan 3 turnos" → aparece con slide-in
   - "Tu turno está siendo llamado" → highlight amber
   - "Turno #B-046 completado" → strike-through

**Animaciones del mockup:**
```css
/* Progress bar del turno */
@keyframes progress-pulse {
  0%, 100% { width: 45%; opacity: 1; }
  50% { width: 60%; opacity: 0.8; }
}

/* Notificación entra */
@keyframes notify-slide {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

/* Turno "flip" cuando cambia */
.turn-flip {
  animation: flip-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Interactividad:**
- Al hacer hover sobre el mockup: pausan las animaciones
- Click en "Ver cómo funciona": smooth scroll a sección explicativa
- Las notificaciones son cíclicas cada 4 segundos

### 2.3 Scroll Animations (IntersectionObserver)

**Implementación por secciones:**

```typescript
// composables/useScrollReveal.ts
export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null)

  function setupObserver(options = { threshold: 0.1, rootMargin: '-50px' }) {
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.value?.unobserve(entry.target)
        }
      })
    }, options)
  }

  function observe(element: Element) {
    element.classList.add('reveal')
    observer.value?.observe(element)
  }

  onMounted(() => setupObserver())
  onUnmounted(() => observer.value?.disconnect())

  return { observe }
}
```

**CSS para reveal:**
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

.reveal.delay-1 { transition-delay: 100ms; }
.reveal.delay-2 { transition-delay: 200ms; }
.reveal.delay-3 { transition-delay: 300ms; }
.reveal.delay-4 { transition-delay: 400ms; }
```

### 2.4 Social Proof Bar

**Logos de entidades (del seed):**
- EPS Sura
- Bancolombia
- Secretaría de Hacienda Montería
- Claro Colombia

**Diseño:**
- Fondo oscuro (`bg-base`)
- 4 logos en fila horizontal
- Opacity sutil (60%) que aumenta a 100% en hover
- Scroll horizontal en mobile

---

## FASE 3 — PÁGINAS SECUNDARIAS (SOLUCIONES, RESULTADOS, NOSOTROS)

### 3.1 Soluciones — Para quién es TuTurno

**Estructura de subpestañas (tabs):**

```
┌──────────────────────────────────────────────────────────┐
│ SOLUCIONES                                               │
│                                                          │
│ [Ciudadanos] [Entidades] [Operadores]                    │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │  Contenido de la pestaña activa                    │  │
│ │                                                     │  │
│ │  - Feature cards (3 columnas → 1 en mobile)       │  │
│ │  - Dashboard mockup interactivo                    │  │
│ │  - CTA específico                                  │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Ciudadanos (tab activo por defecto):**
- Turnos desde cualquier dispositivo
- Sin registro previo
- Notificaciones push
- Seguimiento en tiempo real

**Entidades:**
- Dashboard de gestión
- Multi-servicio
- Reportes y métricas
- Integración QR

**Operadores:**
- Panel de llamada de turnos
- Estadísticas en vivo
- Historial de atenciones
- Sin software adicional

### 3.2 Resultados — Métricas y Testimonios

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ RESULTADOS                                              │
│                                                          │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │ 10,000+│ │  85%   │ │  50+   │ │  4.8/5 │            │
│ │ Turnos │ │ Tiempo │ │Entidades│ │Satisf.│            │
│ └────────┘ └────────┘ └────────┘ └────────┘            │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │ TESTIMONIOS                                          ││
│ │ ┌────────────┐ ┌────────────┐ ┌────────────┐        ││
│ │ │ Persona 1  │ │ Persona 2  │ │ Persona 3  │        ││
│ │ │ Ciudadan@  │ │ Coordinador│ │ Padre/Fam  │        ││
│ │ └────────────┘ └────────────┘ └────────────┘        ││
│ └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Cards de métricas:**
- Bento grid layout (diseño assimétrico)
- Animación "breathing" en los números (subtle pulse)
- Hover reveal de contexto adicional

### 3.3 Nosotros — Historia y equipo

**Secciones:**
1. **Historia del proyecto** — Contexto académico Universidad de Córdoba
2. **El problema** — Filas en Colombia, impacto real
3. **La solución** — TuTurno como innovación
4. **Equipo** — Keyner Ramírez Ramos, Bibiana Herrera Martínez
5. **Contacto** — Email, ubicación Montería

---

## FASE 4 — AUTENTICACIÓN (LOGIN/REGISTER)

### 4.1 Login Page

**Layout actual:** Centrado simple con glassmorphism card.

**Rediseño — Split screen:**

```
┌──────────────────────────────────────────────────────────┐
│ ┌────────────────────┬────────────────────────────────┐ │
│ │                    │                                │ │
│ │   [BRAND SIDE]     │        [FORM SIDE]             │ │
│ │                    │                                │ │
│ │   TuTurno          │   Iniciar Sesión               │ │
│ │   tagline          │                                │ │
│ │                    │   ┌─────────────────────┐      │ │
│ │   [Animated        │   │ Email               │      │ │
│ │    phone mockup]   │   └─────────────────────┘      │ │
│ │                    │   ┌─────────────────────┐      │ │
│ │   Social proof:    │   │ Contraseña          │      │ │
│ │   10k+ usuarios    │   └─────────────────────┘      │ │
│ │                    │                                │ │
│ │                    │   [¿Olvidaste tu contraseña?]   │ │
│ │                    │   [Iniciar Sesión]             │ │
│ │                    │                                │ │
│ │                    │   ¿No tienes cuenta?           │ │
│ │                    │   [Crear cuenta]               │ │
│ └────────────────────┴────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Brand side (izquierda):**
- Fondo con gradient mesh sutil
- Logo "TuTurno" grande animado
- Phone mockup mostrando la app
- Stats flotantes con micro-animaciones

**Form side (derecha):**
- Formulario con glassmorphism card
- Inputs con iconos a la izquierda
- Focus state con glow púrpura sutil
- Micro-interacciones: scale(0.98) on press

### 4.2 Register Page

**Campos:**
1. Nombre completo
2. Número de cédula (colombiano)
3. Correo electrónico
4. Teléfono (formato 3XX XXX XXXX)
5. Contraseña (con requirements visuales)

**UX improvements:**
- Progress indicator de los pasos
- Validación en tiempo real (Zod)
- Requisitos de contraseña con checkmarks animados
- Teléfono con máscara automática (3XXXXXXXXXX)

### 4.3 Animaciones de Auth

```css
/* Input focus glow */
.input-field:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  border-color: var(--color-primary);
}

/* Button press */
.btn-primary:active {
  transform: scale(0.97);
  transition: transform 100ms ease-out;
}

/* Form card entrance */
.form-card {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## FASE 5 — COMPONENTES UI MEJORADOS

### 5.1 UiButton

**Mejoras:**
```css
.btn {
  transition: transform 160ms ease-out, box-shadow 160ms ease-out;
}

.btn:active {
  transform: scale(0.97);
}

/* Gradient glow on hover */
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
}
```

**Estados a implementar:**
- Default
- Hover (glow + lift)
- Active (scale 0.97)
- Loading (spinner interno)
- Disabled (opacity 0.5)

### 5.2 UiInput

**Mejoras:**
- Label con transición float (arriba del input al focus)
- Icono a la izquierda
- Error state con shake animation
- Success state con checkmark verde

```css
.input-wrapper {
  position: relative;
}

.input-field:focus + .input-label,
.input-field:not(:placeholder-shown) + .input-label {
  transform: translateY(-100%) scale(0.85);
  color: var(--color-primary);
}
```

### 5.3 Skeleton Loaders

**Implementar en:**
- TurnCard (mientras carga datos)
- EntityCard
- OperatorQueue items
- Stats cards

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## FASE 6 — ANIMACIONES Y MICROINTERACCIONES

### 6.1 Sistema de animaciones por tier

| Tier | Frecuencia | Animación | Ejemplo |
|------|------------|-----------|---------|
| **TIER 1** | 100+/día | **SIN animación** | Teclado, command palette |
| **TIER 2** | 10-99/día | Hover states sutil | Cards, buttons |
| **TIER 3** | 1-9/día | Standard | Modals, dropdowns (200-300ms) |
| **TIER 4** | <1/día | Marketing | Landing animations (pueden ser más largas) |

### 6.2 Easing curves personalizados

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 6.3 Animaciones del Hero

```css
/* Título "TuTurno" con reveal */
.hero-title {
  animation: title-reveal 0.8s var(--ease-out) forwards;
  opacity: 0;
  filter: blur(4px);
}

@keyframes title-reveal {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

/* Subtítulo delay */
.hero-subtitle {
  animation: subtitle-reveal 0.7s var(--ease-out) 150ms forwards;
  opacity: 0;
}

/* Phone mockup float */
.phone-mockup {
  animation: phone-float 3s ease-in-out infinite;
}

@keyframes phone-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 6.4 Scroll-triggered sections

```typescript
// Intersection Observer para animaciones
const { observe } = useScrollReveal()

// En cada sección:
onMounted(() => {
  const section = document.querySelector('.how-it-works')
  if (section) observe(section)
})
```

---

## FASE 7 — RESPONSIVE Y PERFORMANCE

### 7.1 Breakpoints optimizados

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 7.2 Performance checklist

| Optimización | Implementación |
|--------------|---------------|
| **Imágenes** | `<NuxtImg>` con webp + lazy loading |
| **Fonts** | `display: swap` + preload de Unbounded |
| **CSS** | Tailwind purge, CSS variables |
| **Animaciones** | Solo `transform` y `opacity` |
| **Blur** | `backdrop-filter` solo en elementos fixed/sticky |
| **Code splitting** | Dynamic imports para componentes pesados |

### 7.3 Prerender de landing pages

```typescript
// nuxt.config.ts
routeRules: {
  '/': { prerender: true },
  '/soluciones': { prerender: true },
  '/resultados': { prerender: true },
  '/nosotros': { prerender: true },
}
```

---

## FASE 1.5 — DATOS REALES DE COLOMBIA (Problem Stats)

### 1.5.1 Investigación de problemática real

**Fuentes verificadas (2024-2025):**

| Dato | Valor | Fuente | Fecha |
|------|-------|-------|-------|
| Tiempo de espera médica | 150+ días | El Tiempo | Jun 2024 |
| Filas para medicamentos | 12 horas | Infobae | Oct 2025 |
| Colombianos sin atención el mismo día | 75% | La República | 2024 |
| Afectados en Rionegro (Nueva EPS) | 34,000+ | La FM | Abr 2025 |
| Resolución Ministerio de Salud | 2117/2025 | MinSalud | Oct 2025 |

**Cita destacada:**
> "Se acaba el drama de las filas y las excusas" — David Luna, exMinistro de Salud

### 1.5.2 ImpactStats Component

**Ubicación:** `components/landing/ImpactStats.vue`

**Estructura:**
1. **Sección "La realidad colombiana"** — 4 cards con datos rojos de problemática
2. **Sección "Con TuTurno"** — 4 cards verdes mostrando solución
3. **Quote destacado** — Cita del exMinistro

**Datos implementados:**
```
PROBLEMA:
- 150+ días de espera (El Tiempo)
- 12h en fila para medicamentos (Infobae)
- 75% sin atención el mismo día (La República)
- 34K afectados en Rionegro (La FM)

SOLUCIÓN:
- 85% menos tiempo de espera
- <30 minutos para recibir turno
- 100% tiempo real con notificaciones
- 0 filas físicas
```

### 1.5.3 Animaciones

- IntersectionObserver para reveal por card
- Stagger delay de 100ms entre cards
- Transiciones opacity + translateY
- Hover states con border glow

---

## FASE 8 — COMPONENTES POR CONSTRUIR/MEJORAR

### 8.1 Nuevos componentes

| Componente | Propósito |
|------------|-----------|
| `PhoneMockup.vue` | Mockup interactivo del teléfono |
| `TurnProgressLive.vue` | Progress bar animada del turno |
| `NotificationBubble.vue` | Notificaciones simuladas |
| `MetricCard.vue` | Card de métrica con animación |
| `TestimonialCard.vue` | Card de testimonio |
| `SplitScreenLayout.vue` | Layout split para auth |
| `TabInterface.vue` | Tabs interactivos |

### 8.2 Componentes a mejorar

| Componente | Mejora |
|------------|--------|
| `LandingHeader.vue` | NuxtLink, scroll effect mejorado |
| `LandingFooter.vue` | Animación de entrada staggered |
| `LandingHeroNew.vue` | Eliminar duplicado, mejorar mockup |
| `LandingHowItWorks.vue` | IntersectionObserver reveal |
| `LoginForm.vue` | Split layout + microinteracciones |
| `RegisterForm.vue` | Multi-step progress + validation UX |

---

## FASE 9 — ANIMACIONES DEL MOCKUP TELEFÓNICO

### 9.1 Simulación de cola de turnos

**Loop principal (8 segundos):**

```
0s    → Estado inicial: Turno "B-047", Posición #3, "~12 min"
2s    → Actualización: Posición #2, "~8 min" (progress bar avanza)
4s    → Notificación: "Te quedan 2 turnos" (slide-in desde derecha)
6s    → Highlight: Turno llamado "B-046" (amber glow)
8s    → Loop restart
```

**Implementación:**
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentStep = ref(0)
const turnPosition = ref(3)
const estimatedTime = ref(12)
const showNotification = ref(false)
const notificationText = ref('')

const steps = [
  { position: 3, time: 12 },
  { position: 2, time: 8 },
  { position: 2, time: 8, notification: 'Te quedan 2 turnos' },
  { position: 2, time: 8, highlight: 'B-046' },
]

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % steps.length
    const step = steps[currentStep.value]
    turnPosition.value = step.position
    estimatedTime.value = step.time

    if (step.notification) {
      notificationText.value = step.notification
      showNotification.value = true
      setTimeout(() => { showNotification.value = false }, 1500)
    }
  }, 2000)
})

onUnmounted(() => clearInterval(interval))
</script>
```

### 9.2 Animaciones CSS del mockup

```css
/* Progress bar */
.progress-bar {
  animation: progress-fill 2s ease-out forwards;
}

/* Notification bubble */
.notification-enter {
  animation: notify-slide 0.3s var(--ease-out) forwards;
}

.notification-exit {
  animation: notify-slide 0.2s ease-in reverse forwards;
}

/* Turn number change */
.turn-update {
  animation: flip-in 0.4s var(--ease-bounce);
}

/* Pulse glow for "your turn" */
.glow-pulse-active {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

---

## FASE 10 — CHECKLIST DE IMPLEMENTACIÓN

### Antes de cada commit:
- [ ] `npm run typecheck` — Sin errores TypeScript
- [ ] `npm run lint` — Sin warnings
- [ ] No `console.log` en producción
- [ ] No tipos `any` nuevos
- [ ] Animaciones respetan `prefers-reduced-motion`
- [ ] Responsive en 320px, 768px, 1440px
- [ ] Skeleton loaders en estados de carga
- [ ] Microinteracciones en botones (scale 0.97 on :active)

### Criteria de calidad:
- [ ] TuTurno visible y memorable en header
- [ ] Logo con personality (no solo texto)
- [ ] Scroll animations fluidas (no jitter)
- [ ] Phone mockup completamente funcional
- [ ] Tabs de Soluciones con contenido real
- [ ] Auth pages con split layout
- [ ] Performance: Lighthouse > 90

---

## REFERENCIAS VISUALES

### Inspiraciones:
- **Linear** — Dark mode, gradients sutiles, motion
- **Vercel** — Minimalismo técnico, espaciado generoso
- **Raycast** — Microinteracciones, speed, precision
- **Apple** — Proporcion, tipografía, transiciones
- **Loom** — Onboarding animations, walkthrough

### Anti-patrones a evitar (AI slop):
- ❌ Gradiente violeta/azul genérico
- ❌ "Sin registro previo" como hero benefit
- ❌ Cards 3 columnas idénticas
- ❌ Spinner circular de loading
- ❌ Inter para texto
- ❌ Blanco puro #FFFFFF
- ❌ ease-in en animaciones UI

---

*Documento generado con inteligencia y taste de frontend de alto nivel*
*Skills aplicadas: design-taste-frontend + impeccable + emil-design-eng*
