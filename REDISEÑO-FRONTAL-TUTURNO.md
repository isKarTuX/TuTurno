# TUTURNO — PLAN DE REDISEÑO FRONTAL
## Documento Maestro de Diseño y Mejora de UX/UI

**Proyecto:** TuTurno - Sistema de Gestión de Turnos Digitales
**Fecha:** Mayo 2026
**Versión:** 1.0
**Alcance:** Landing Page, Login, Register, Sistema de Diseño, Animaciones

---

## PARTE 1: FILOSOFÍA Y PRINCIPIOS DE DISEÑO

### 1.1 Visión del Proyecto

TuTurno no es "una página de turnos más". Es una **plataforma invertadora** que transforma la experiencia de gestión de colas en Colombia. La marca debe sentirse:

- **Moderna y tecnológica** — Como una startup fintech colombiana de nivel mundial
- **Confiable y acessível** — Para todo tipo de ciudadanos colombianos (no solo tech-savvy)
- **Premium pero inclusiva** — Diseño de alto nivel sin exclusiones
- **Con identidad local** — Colombiana, específicamente de Montería, pero con alcance nacional

### 1.2 Principios de Diseño (traducidos de las Skills)

**Design Taste Frontend (Antifu):**
- DESIGN_VARIANCE: 7 (equilibrio entre arte y usabilidad)
- MOTION_INTENSITY: 6 (fluid CSS con animaciones de scroll)
- VISUAL_DENSITY: 4 (limpio pero con carácter)

**Impeccable:**
- Color strategy: COMMITTED (violeta como acento principal con 30-40% de superficie)
- Dark mode OBLIGATORIO (contexto: usuarios en exteriores de EPS/bancos)
- Sin purple/blue neon aesthetic — paleta más refinada
- Typography con OKLCH para consistencia

**Emil Design Engineering:**
- Animaciones UI < 300ms
- Easing: ease-out para entradas, ease-in-out para movimiento
- Spring physics para interacciones de drag
- Transiciones preferidas sobre keyframes para UI dinámica

---

## PARTE 2: SISTEMA DE DISEÑO MEJORADO

### 2.1 Paleta de Colores Refinada

```
/* ============================================
   TUTURNO COLOR SYSTEM — OKLCH BASED
   ============================================ */

:root {
  /* ── Brand Violets (refined, less saturated) ── */
  --color-primary:       oklch(55% 0.15 280);      /* #6C3AE8 - Main brand */
  --color-primary-light: oklch(70% 0.12 280);      /* #A78BFA - Lighter variant */
  --color-primary-dark:  oklch(40% 0.18 280);      /* #4C1D95 - Dark variant */
  --color-accent:        oklch(72% 0.10 270);      /* #818CF8 - Accent */

  /* ── Semantic Status ── */
  --color-success:       oklch(65% 0.18 155);       /* #10B981 - Verde */
  --color-warning:       oklch(75% 0.16 75);        /* #F59E0B - Ámbar */
  --color-error:         oklch(60% 0.20 25);        /* #EF4444 - Rojo */

  /* ── Backgrounds (zinc/gray neutral) ── */
  --bg-base:             oklch(8% 0.01 280);         /* #09090B - Casi negro */
  --bg-surface:          oklch(12% 0.02 280);        /* #18181B - Surface */
  --bg-elevated:         oklch(18% 0.02 280);        /* #27272A - Elevated */
  --bg-overlay:          oklch(25% 0.02 280);        /* #3F3F46 - Overlay */

  /* ── Text ── */
  --text-primary:        oklch(98% 0.01 280);        /* #FAFAFA - Blanco cálido */
  --text-secondary:      oklch(72% 0.02 280);        /* #A1A1AA - Gris claro */
  --text-muted:          oklch(50% 0.02 280);        /* #71717A - Gris medio */

  /* ── Glassmorphism ── */
  --glass-bg:            oklch(100% 0 0 / 0.04);
  --glass-border:        oklch(100% 0 0 / 0.08);
  --glass-shadow:        0 8px 32px oklch(55% 0.15 280 / 0.12);

  /* ── Turn Status Colors ── */
  --turn-waiting:        oklch(55% 0.15 280);        /* Violeta */
  --turn-called:        oklch(75% 0.16 75);          /* Ámbar */
  --turn-attending:      oklch(60% 0.12 220);         /* Azul */
  --turn-completed:     oklch(65% 0.18 155);         /* Verde */
  --turn-no-show:        oklch(60% 0.20 25);          /* Rojo */
  --turn-cancelled:     oklch(50% 0.02 280);          /* Gris */
}
```

### 2.2 Tipografía Premium

```
/* ============================================
   TUTURNO TYPOGRAPHY SYSTEM
   ============================================ */

/* Display: Unbounded — Headers impactantes */
--font-display: 'Unbounded', system-ui, sans-serif;

/* Body: Geist — Legibilidad óptima */
--font-body: 'Geist', system-ui, sans-serif;

/* Mono: Para números de turno y datos */
--font-mono: 'Geist Mono', monospace;

/* Logo: Dela Gothic One — Para el nombre de marca */
/* NOTA: Reemplazar por fuente hand-lettering style */

/* Scale (ratio 1.25 — Major Third) */
--text-xs:    0.75rem;    /* 12px */
--text-sm:    0.875rem;   /* 14px */
--text-base:  1rem;       /* 16px */
--text-lg:    1.125rem;   /* 18px */
--text-xl:    1.25rem;    /* 20px */
--text-2xl:   1.5rem;     /* 24px */
--text-3xl:   1.875rem;   /* 30px */
--text-4xl:   2.25rem;    /* 36px */
--text-5xl:   3rem;       /* 48px */
--text-6xl:   3.75rem;    /* 60px */
--text-7xl:   4.5rem;     /* 72px */
```

### 2.3 Espaciado y Layout

```
/* Sistema de 4px */
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;

/* Container */
--max-width: 1400px;
--container-padding: 24px; /* Mobile: 16px */
```

---

## PARTE 3: LANDING PAGE — REDISEÑO COMPLETO

### 3.1 Header/Navbar

**Estado Actual:**
- Navbar fijo con glass effect
- Logo a la izquierda
- Links de navegación centrados
- CTAs a la derecha

**MEJORAS PLANIFICADAS:**

| Aspecto | Mejora | Prioridad |
|---------|--------|-----------|
| Logo | Lettering hand-drawn style para "TuTurno" | ALTA |
| sticky behavior | glass más pronunciado con blur de 24px | MEDIA |
| Mobile menu | Slide-in desde derecha con stagger animation | ALTA |
| Active state | Dot indicator más visible | BAJA |
| Brand mark | Icono de reloj/ticket más distintivo | ALTA |

**Detalle técnico:**
```
/* Glass enhancement */
.header-glass {
  background: oklch(8% 0.01 280 / 0.85);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid oklch(100% 0 0 / 0.06);
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.3);
}
```

### 3.2 Hero Section — EL CORAZÓN DEL PROYECTO

**Estado Actual:**
- Título "TuTurno" en grande con "Eliminar las filas para siempre"
- Badge trust con 3 puntos
- CTAs (Comenzar ahora + Ver cómo funciona)
- Simulator de iPhone a la derecha

**NUEVA ESTRUCTURA PLANIFICADA:**

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (logo + nav + auth)                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │                          │  │                          │ │
│  │   TuTurno (lettering)    │  │    PHONE SIMULATOR       │ │
│  │                          │  │                          │ │
│  │   [Subtítulo mejorado]  │  │   ┌─────────────────┐   │ │
│  │                          │  │   │  Status Bar     │   │ │
│  │   [Descripción corta]   │  │   ├─────────────────┤   │ │
│  │                          │  │   │                 │   │ │
│  │   [BADGES DE CONFIANZA] │  │   │   APP SCREENS   │   │ │
│  │   ✓ Sin registro previo │  │   │   (animated)    │   │ │
│  │   ✓ Notificaciones real │  │   │                 │   │ │
│  │   ✓ Gratis para todos   │  │   └─────────────────┘   │ │
│  │                          │  │                          │ │
│  │   [CTA PRINCIPAL]        │  │   [CONTROLS]             │ │
│  │   [CTA SECUNDARIO]       │  │   ▶️ ⏮️ ▶️ Auto         │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**MEJORAS CLAVE:**

#### A. Lettering "TuTurno" Estilo Hand-drawn/Canvas

**PROBLEMA:** La fuente Dela Gothic One es genérica. No transmite la personalidad invertadora.

**SOLUCIÓN:** Implementar una fuente con estilo handwriting como **"Caveat"**, **"Pacifico"**, o **"Dancing Script"** mezclada con sans-serif para crear un efecto de presentación.

```
/* Opción 1: Font combo para TuTurno */
/* Usar "Unbounded" bold para "Tu" y "Dancing Script" para "Turno" */
.logo-text {
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 900;
  background: linear-gradient(
    135deg,
    oklch(98% 0.01 280) 0%,
    oklch(70% 0.12 280) 50%,
    oklch(98% 0.01 280) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  /* Efecto de escritura manual con clip-path animation */
}

.logo-turno {
  font-family: 'Dancing Script', cursive;
  font-weight: 700;
  /* O usar variable font para ajustar peso */
}
```

**ALTERNATIVA CSS PURO (más control):**
```
.logo-text {
  font-family: 'Unbounded', sans-serif;
  font-weight: 900;
  letter-spacing: -0.02em;
  position: relative;
}

.logo-text::after {
  content: 'Tu';
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(...);
  -webkit-background-clip: text;
}

.logo-script {
  font-family: 'Caveat', cursive;
  font-weight: 600;
  /* Para el "Turno" con efecto handwriting */
}
```

#### B. Phone Simulator — Más Interactivo

**MEJORAS PLANIFICADAS:**

| Feature | Mejora | Estado |
|---------|--------|--------|
| Animación automática | Los turnos avanzan solos cada 3-5s | NUEVO |
| Glow effect | El teléfono tiene shadow que pulsa | MEJORAR |
| Screen content | Más realista, con datos reales colombianos | REDISEÑAR |
| Controles | Play/Pause, Step forward/back, Reset | MEJORAR |
| Progress indicator | Dots mostrando progreso del flujo | NUEVO |

**Datos reales para simulación:**
```
Entidad: EPS SURARIA (nombre ficticio inspirado en EPS reales de Colombia)
Dirección: Cra 46 #56-56, Montería
Servicios: Afiliaciones, Cotizaciones, Entrega de carnets
Turno mostrado: "A-047"
Ciudadano: María del Pilar Gómez (nombre realista colombiano)
```

#### C. Descripción del Hero — copy mejorado

**ACTUAL:**
> "Solicita tu turno digital desde cualquier dispositivo. Recibe actualizaciones en tiempo real y presenta tu código cuando te llamen."

**NUEVO (más directo y con voz de startup):**
> "Deja de esperar en filas. Solicita tu turno desde el celular y recibe alerts cuando casi sea tu turno — sin registro, sin complicaciones."

### 3.3 Sección "Cómo Funciona" — 4 Pasos

**MEJORAS PLANIFICADAS:**

| Elemento | Mejora | Prioridad |
|---------|--------|-----------|
| Layout | Mantener 4 columnas en desktop, stack en mobile | KEEP |
| Animación | Stagger reveal al hacer scroll (IntersectionObserver) | ALTA |
| Iconos | Más distintivos, estilo Lucide con stroke 1.5 | ALTA |
| Números | Badge con efecto glow sutil | MEDIA |
| Línea conectora | Gradient line entre steps (desktop) | BAJA |
| Mobile | Indicadores de progreso horizontales | NUEVO |

**Detalle de copy mejorado:**

| Step | Título Actual | Título Mejorado |
|------|-------------|-----------------|
| 01 | Busca la entidad | Encuentra tu EPS, banco u oficina |
| 02 | Solicita tu turno | Recibe tu número al instante |
| 03 | Monitorea en tiempo real | Mira cuánto falta desde tu celular |
| 04 | Preséntate con tu código | Muestra tu QR cuando te llamen |

**Descripción mejorada:**

```
Step 01:
  ACTUAL: "Encuentra la EPS, banco u oficina donde necesitas atención. Filtra por ciudad y tipo de servicio."
  NUEVO:  "Busca por nombre o ubicación. Encontramos más de 500 entidades en toda Colombia."

Step 02:
  ACTUAL: "Selecciona el servicio y recibe tu número al instante. Sin registro, sin complicaciones."
  NUEVO:  "Elige el trámite que necesitas. En menos de 30 segundos tienes tu turno."

Step 03:
  ACTUAL: "Recibe actualizaciones sobre tu posición en la cola. Sabrás exactamente cuándo presentarte."
  NUEVO:  "Recibe alertas cuando queden 3 turnos antes del tuyo. No pierdas tiempo en la espera."

Step 04:
  ACTUAL: "Cuando sea tu turno, muestra el código QR. El operador te llamará automáticamente."
  NUEVO:  "Llega tranquilo. El operador recibe tu llamado y te atiende en minutos."
```

### 3.4 Sección "Para Entidades" (Soluciones)

**PESTAÑAS PLANIFICADAS:**

```
┌─────────────────────────────────────────────────────────────┐
│  [Ciudadanos]  [Entidades]  [Operadores]    ← Tabs          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Contenido según tab seleccionado                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**CONTENIDO POR TAB:**

#### Tab 1: Para Ciudadanos (ciudadanos)
```
TÍTULO: "Tu turno, desde tu bolsillo"
SUBTÍTULO: "Sin filas. Sin esperar. Sin apps que instalar."

FEATURES:
1. Sin registro previo
   "Solo tu número de cédula. Sin crear cuenta, sin记住了 contraseñas."

2. Notificaciones push
   "Te avisamos cuando queden 3 turnos. Llega justo a tiempo."

3. Código QR
   "Tu turno se verifica al instante. Sin papeles, sin perder tickets."

4. Tiempo estimado
   "Calculamos tu espera real basándonos en datos históricos."

[CTA]: "Solicitar mi turno gratis"
```

#### Tab 2: Para Entidades (empresas)
```
TÍTULO: "Digitaliza tu sala de espera"
SUBTÍTULO: "Optimiza el flujo de pacientes y clientes. Sinfrastructure costs."

BENEFICIOS:
1. Dashboard en tiempo real
   "Ve cuántos turnos esperan, tiempos promedio y métricas clave."

2. Integración simple
   "Conecta con tus sistemas existentes. API文档 completa."

3. Mejora la satisfacción
   "Clientes felices = mejores evaluaciones = más ingresos."

4. Analytics profundos
   "Reports detallado de flujo de atención. Datos para mejores decisions."

[CTA]: "Solicitar demo personalizada"
[CTA SECUNDARIO]: "Ver casos de éxito"
```

#### Tab 3: Para Operadores
```
TÍTULO: "Llama turnos sin esfuerzo"
SUBTÍTULO: "Interfaz simple para que te concentres en atender, no en administrar."

FUNCIONALIDADES:
1. Un-click para llamar
   "Botón grande para llamar siguiente turno. Sin confusiones."

2. Gestión de no-shows
   "Marqué ciudadanos que no se presenten. Se llama al siguiente."

3. Panel de control
   "Pausar cola, cambiar servicio, actualizar tiempos."

4. Historial de atenciones
   "Registro automático de cada turno atendido."

[CTA]: "Solicitar acceso de operador"
```

### 3.5 Sección Impacto/Estadísticas

**DATOS REALES DE COLOMBIA (investigación requerida):**

| Métrica | Dato hipotético | Fuente necesaria |
|---------|-----------------|------------------|
| Tiempo promedio en fila EPS | 47 minutos | Datos reales EPS monitoreadas |
| % de personas que pierden turno | 23% | Estudio interno o externo |
| Turnos digitales procesados | 150,000+ | TuTurno (cuando tenga datos) |
| Entidades activas | [DATO TU] | Cantidad actual en plataforma |
| Satisfacción promedio | 4.6/5 | Basado en ratings reales |

**ESTRUCTURA VISUAL PROPUESTA:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│    │   47 min   │  │    23%     │  │  150,000  │           │
│    │ tiempo     │  │ sin turno  │  │  turnos   │           │
│    │ espera     │  │ perdidos   │  │ digitales │           │
│    └────────────┘  └────────────┘  └────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**ANIMACIONES:**
- Números con count-up animation al entrar en viewport
- Stagger de 150ms entre cards
- Subtle glow en hover

### 3.6 Sección Footer

**MEJORAS:**

| Elemento | Mejora | Prioridad |
|---------|--------|-----------|
| Logo | Mantener pero integrar tagline | MEDIA |
| Contacto | Actualizar con datos reales TuTurno | ALTA |
| Links | Verificar que todas las rutas existan | MEDIA |
| Social links | Twitter → X, agregar WhatsApp Business | MEDIA |
| Legal | Agregar links reales o quitar si no existen | BAJA |
| Copyright | Mantener "Universidad de Córdoba" | KEEP |

**Información de contacto propuesta:**
```
Teléfono: [NÚMERO REAL TUTURNO]
Email: hola@tuturno.co
WhatsApp: +57 300 123 4567
Dirección: Montería, Córdoba, Colombia
```

---

## PARTE 4: AUTENTICACIÓN — LOGIN & REGISTER

### 4.1 Layout Auth Split Screen

**ESTADO ACTUAL:**
- Split 50/50: Brand side (stats) + Form side
- Brand side con logo animado, 3 stats de confianza
- Form side centrado con formulario

**MEJORAS PLANIFICADAS:**

| Aspecto | Mejora | Prioridad |
|---------|--------|-----------|
| Brand side | Más interactivo, no solo stats | ALTA |
| Phone mockup | Simulador corriendo en brand side | NUEVO |
| Stats | Con datos más realistas y verificables | MEDIA |
| Form side | Mejor espaciado, más воздух | ALTA |
| Responsive | En mobile: stack vertical (hero arriba, form abajo) | ALTA |

**NUEVA ESTRUCTURA:**

```
MOBILE (< lg):
┌─────────────────────────────┐
│  HEADER simplificado        │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │   Phone Simulator    │  │
│  │   (compact, 200px)   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   LOGIN / REGISTER    │  │
│  │   FORM                │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘

DESKTOP (lg+):
┌────────────────────────────┬────────────────────────────┐
│                            │                            │
│   BRAND SIDE (40%)         │   FORM SIDE (60%)         │
│                            │                            │
│   ┌──────────────────┐    │   ┌──────────────────┐    │
│   │  Logo + Tagline   │    │   │                  │    │
│   │                  │    │   │  FORM            │    │
│   │  Phone Simulator │    │   │                  │    │
│   │  (animated)      │    │   │                  │    │
│   │                  │    │   │                  │    │
│   │  Trust badges    │    │   │                  │    │
│   │                  │    │   └──────────────────┘    │
│   └──────────────────┘    │                            │
│                            │                            │
└────────────────────────────┴────────────────────────────┘
```

### 4.2 Login Page — Detalle de Mejoras

**INPUTS MEJORADOS:**

| Campo | Mejora | Detalle |
|-------|--------|---------|
| Email | Usar componente UiInput | Ya existe, solo usar |
| Password | Toggle visibility mejorado | Icono más claro |
| Error states | Mensajes inline más claros | Español natural |
| Loading state | Spinner + texto "Iniciando sesión..." | Ya existe |
| Success | Redirect con mensaje toast | Integrar useToast |

**FLUJO MEJORADO:**
```
1. User entra email
   → Validación en tiempo real (después de blur)
   → Check verde si válido

2. User entra password
   → Toggle visibility con icono claro
   → Indicador de fortaleza (si aplica)

3. Submit
   → Button muestra loading state
   → Deshabilitado durante submission
   → Error: mensaje inline + shake animation
   → Success: toast "Bienvenido de vuelta" + redirect
```

**COPY MEJORADO:**
```
TÍTULO: "Bienvenido de nuevo"
SUBTÍTULO: "Ingresa a tu cuenta para gestionar tus turnos"

LABEL EMAIL: "Correo electrónico"
PLACEHOLDER EMAIL: "tu@email.com"

LABEL PASSWORD: "Contraseña"
PLACEHOLDER PASSWORD: "••••••••"

LINK: "¿Olvidaste tu contraseña?" → "/auth/forgot-password"

BUTTON: "Entrar"

FOOTER: "¿No tienes cuenta?"
LINK: "Crea una gratis" → "/auth/register"
```

### 4.3 Register Page — Detalle de Mejoras

**CAMPOS MEJORADOS:**

| Campo | Validación | Mensaje de error mejorado |
|-------|------------|---------------------------|
| Nombre | Min 2 chars | "Ingresa tu nombre completo" |
| Cédula | 6-12 dígitos | "La cédula debe tener entre 6 y 10 números" |
| Email | Formato válido | "Ingresa un correo electrónico válido" |
| Teléfono | 10 dígitos (3XX) | "El teléfono debe empezar con 3XX y tener 10 dígitos" |
| Password | 8+ chars, 1 número, 1 mayúscula | Ver checklist visual |

**PASSWORD REQUIREMENTS — VISUAL CHECKLIST:**

```
┌─────────────────────────────────────────┐
│  Contraseña                             │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ✓ Mínimo 8 caracteres                  │
│  ✓ Al menos un número                   │
│  ✗ Al menos una mayúscula               │
│                                         │
└─────────────────────────────────────────┘
```

**COPY MEJORADO:**
```
TÍTULO: "Crea tu cuenta"
SUBTÍTULO: "En segundos puedes solicitar tu primer turno"

LABEL NOMBRE: "Nombre completo"
PLACEHOLDER NOMBRE: "María del Pilar Gómez"

LABEL CÉDULA: "Cédula de ciudadanía"
PLACEHOLDER CÉDULA: "1234567890"

LABEL EMAIL: "Correo electrónico"
PLACEHOLDER EMAIL: "maria@email.com"

LABEL TELÉFONO: "Celular"
PLACEHOLDER TELÉFONO: "300 123 4567"

LABEL PASSWORD: "Contraseña segura"
PLACEHOLDER PASSWORD: "Crea una contraseña segura"

BUTTON: "Crear cuenta gratis"

FOOTER: "¿Ya tienes cuenta?"
LINK: "Inicia sesión" → "/auth/login"

LEGAL: "Al crear cuenta aceptas nuestros términos y política de privacidad"
LINK: "[Leer más]" → "/terminos"
```

### 4.4 Forgot Password Page

**FLUJO PLANIFICADO:**
```
1. Input email
2. Botón "Recuperar contraseña"
3. Loading state
4. Success: "Te enviamos un correo para resetear"
5. Email real enviado (future: integrate email service)
```

---

## PARTE 5: ANIMACIONES — FRAMEWORK COMPLETO

### 5.1 Principios Base (según Emil Design Engineering)

```
┌────────────────────────────────────────────────────────────┐
│  1. DURACIÓN                                              │
│     UI animations: 150-300ms                              │
│     Marketing/explanations: 400-800ms                      │
│     NO keyframes > 1s para UI                             │
├────────────────────────────────────────────────────────────┤
│  2. EASING                                                │
│     Entradas: ease-out (cubic-bezier 0.23, 1, 0.32, 1)   │
│     Movimientos: ease-in-out                              │
│     Hover/color: ease                                     │
│     NO ease-in para UI                                     │
├────────────────────────────────────────────────────────────┤
│  3. PROPIEDADES                                           │
│     Solo animate: transform, opacity                      │
│     NO animate: top, left, width, height                  │
│     Usar will-change: transform con precaución            │
├────────────────────────────────────────────────────────────┤
│  4. INTERRUPTIBILITY                                      │
│     Preferir transiciones sobre keyframes                 │
│     Para elementos dinámicos (toasts, modals)              │
└────────────────────────────────────────────────────────────┘
```

### 5.2 CSS Variables para Animaciones

```css
:root {
  /* ── Easings personalizados ── */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

  /* ── Duraciones ── */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --duration-bounce: 500ms;

  /* ── Transiciones base ── */
  --transition-fast: var(--duration-fast) var(--ease-out);
  --transition-base: var(--duration-base) var(--ease-out);
  --transition-slow: var(--duration-slow) var(--ease-out);
}
```

### 5.3 Animaciones por Componente

#### HEADER/NAVBAR
```css
/* Mobile menu slide-in */
.mobile-menu-enter { animation: slideDown 300ms var(--ease-out) forwards; }
.mobile-menu-leave { animation: slideUp 200ms var(--ease-out) forwards; }

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Sticky header enhancement */
.header-scrolled {
  animation: headerCompact 200ms var(--ease-out) forwards;
}

@keyframes headerCompact {
  from { padding-top: 1rem; }
  to { padding-top: 0.5rem; }
}
```

#### HERO SECTION
```css
/* Title reveal con blur */
.hero-title {
  animation: titleReveal 800ms var(--ease-out) forwards;
  animation-delay: 100ms;
  opacity: 0;
  filter: blur(4px);
}

@keyframes titleReveal {
  to { opacity: 1; filter: blur(0); }
}

/* Staggered fade-in para elementos hijos */
.hero-badge { animation-delay: 400ms; }
.hero-cta { animation-delay: 550ms; }
.hero-trust { animation-delay: 700ms; }
```

#### SCROLL REVEAL
```css
/* Reveal on scroll (IntersectionObserver) */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
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
```

#### PHONE SIMULATOR
```css
/* Screen transitions */
.screen-slide-enter { animation: screenSlideIn 300ms var(--ease-out); }
.screen-slide-leave { animation: screenSlideOut 200ms var(--ease-out); }

@keyframes screenSlideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Phone float (parabolic) */
.phone-float {
  animation: phoneFloat 5s var(--ease-in-out) infinite;
}

@keyframes phoneFloat {
  0%, 100% { transform: translateY(0px) rotate(0.3deg); }
  50% { transform: translateY(-12px) rotate(0.5deg); }
}
```

#### NUMBER COUNT-UP
```css
/* Para estadísticas */
.stat-number {
  font-variant-numeric: tabular-nums;
  transition: transform 100ms var(--ease-out);
}

/* Count-up animation con JavaScript */
.count-up {
  animation: countPulse 200ms var(--ease-out);
}
```

#### BUTTON STATES
```css
/* Press feedback */
.btn-press:active {
  transform: scale(0.97);
  transition: transform 100ms var(--ease-out);
}

/* Hover lift */
.btn-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow-color);
}
```

#### SKELETON LOADING (emil-design-engine)
```css
/* Shimmer effect */
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
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
```

### 5.4 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .phone-float,
  .hero-title,
  .reveal {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## PARTE 6: RESPONSIVE DESIGN — TODAS LAS PANTALLAS

### 6.1 Breakpoints

```
/* Mobile first breakpoints */
/* sm:  640px  - Large phones */
/* md:  768px  - Tablets */
/* lg:  1024px - Laptops */
/* xl:  1280px - Desktops */
/* 2xl: 1536px - Large desktops */
```

### 6.2 Layout Strategy

```css
/* Mobile: Single column, full-width */
.container {
  width: 100%;
  max-width: 100%;
  padding-left: 16px;
  padding-right: 16px;
}

/* Tablet+: Centered container */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* Desktop: Max width constrained */
@media (min-width: 1024px) {
  .container {
    max-width: 1280px;
    padding-left: 32px;
    padding-right: 32px;
  }
}

/* Large screens: Prevent over-wide */
@media (min-width: 1536px) {
  .container {
    max-width: 1400px;
  }
}
```

### 6.3 Component Responsive Specs

#### HEADER
| State | Width | Layout |
|-------|-------|--------|
| Mobile | <1024px | Logo + hamburger menu |
| Desktop | ≥1024px | Logo + nav links + CTAs |

#### HERO
| State | Width | Layout |
|-------|-------|--------|
| Mobile | <768px | Stack: text above, phone below |
| Tablet | 768-1023px | Side by side, phone scaled down |
| Desktop | ≥1024px | Full layout, phone at full size |

#### HOW IT WORKS
| State | Width | Layout |
|-------|-------|--------|
| Mobile | <1024px | Vertical stack, numbered list |
| Desktop | ≥1024px | 4 columns with connecting line |

#### FEATURES
| State | Width | Layout |
|-------|-------|--------|
| Mobile | <768px | 1 column |
| Tablet | 768-1023px | 2 columns |
| Desktop | ≥1024px | 4 columns |

#### FOOTER
| State | Width | Layout |
|-------|-------|--------|
| Mobile | <768px | Stack vertical, sections collapsed |
| Tablet | 768-1023px | 2x2 grid |
| Desktop | ≥1024px | Brand left, links right |

### 6.4 Touch vs Hover

```css
/* Solo hover en dispositivos que soportan hover */
@media (hover: hover) and (pointer: fine) {
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: var(--glass-shadow-hover);
  }

  .button-hover:hover {
    background: var(--color-primary-hover);
  }
}

/* Botones más grandes en touch */
@media (pointer: coarse) {
  .btn-touch {
    min-height: 48px;
    min-width: 48px;
  }
}
```

---

## PARTE 7: COPYWRITING MEJORADO

### 7.1 Principios de Voz y Tono

```
VOZ TUTURNO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Directa          → Decir las cosas como son, sin rodeos
✓ Cercana          → Como hablar con un amigo que te ayuda
✓ Confiada         → Seguro pero no arrogante
✓ Inclusiva        → Para todos los colombianos, no solo tech-savvy
✓ Optimista        → Enfocada en soluciones, no en problemas

✗ Evitar:
  - Jerga técnica innecesaria
  - Tonoformal exagerado ("Estimado usuario")
  - Promesas unrealistas
  - Comparaciones con la competencia
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7.2 Guía de Copy por Sección

#### LANDING — HERO

| Elemento | Copy Actual | Copy Mejorado |
|----------|-------------|---------------|
| Título | TuTurno | TuTurno |
| Subtítulo | Elimina las filas para siempre | Elimina las filas para siempre |
| Descripción | Solicita tu turno digital desde cualquier dispositivo. Recibe actualizaciones en tiempo real y presenta tu código cuando te llamen. | Deja de esperar en filas. Solicita tu turno desde el celular y te avisamos cuando casi sea tu turno — sin registro, sin complicaciones. |
| CTA Principal | Comenzar ahora | Solicitar mi turno |
| CTA Secundario | Ver cómo funciona | Conoce cómo funciona |

#### LANDING — CÓMO FUNCIONA

| Step | Título Actual | Título Mejorado |
|------|-------------|-----------------|
| 01 | Busca la entidad | Encuentra tu lugar |
| 02 | Solicita tu turno | Recibe tu número |
| 03 | Monitorea en tiempo real | Mira cuánto falta |
| 04 | Preséntate con tu código | Llega y muestra tu QR |

#### LANDING — FEATURES (Para ciudadanos)

| Feature | Título Actual | Título Mejorado |
|---------|---------------|-----------------|
| 1 | Sin registro previo | Tu cédula es tu usuario |
| 2 | Notificaciones push | Te avisamos a tiempo |
| 3 | Código QR | Tu turno en un código |
| 4 | Tiempo estimado | Sabes cuándo llegar |

#### LANDING — PARA ENTIDADES (Tab solutions)

| Aspecto | Copy Mejorado |
|---------|---------------|
| Título sección | Soluciones para tu entidad |
| Subtítulo | Digitaliza cómo atientes a tus clientes |
| Benefit 1 | Reduce tiempos de espera |
| Benefit 2 | Mejora la satisfacción |
| Benefit 3 | Reports y analytics |
| Benefit 4 | Integración simple |

#### LANDING — CTA FINAL

| Elemento | Copy Actual | Copy Mejorado |
|----------|-------------|---------------|
| Pregunta | ¿Listo para eliminar las filas? | ¿Listo para dejar de esperar? |
| Descripción | Regístrate gratis y solicita tu turno digital desde cualquier dispositivo. Sin filas, sin esperar. | Crea tu cuenta en 30 segundos. Sin costo, sin compromiso. |

#### LOGIN

| Elemento | Copy Actual | Copy Mejorado |
|----------|-------------|---------------|
| Título | Iniciar Sesión | Bienvenido de nuevo |
| Subtítulo | Accede a tu cuenta para gestionar tus turnos | Ingresa para ver tus turnos activos |
| Placeholder email | tu@email.com | maria@email.com |
| Placeholder password | •••••••• | •••••••• |
| Link forgot | ¿Olvidaste tu contraseña? | ¿Olvidaste tu contraseña? |
| Button | Iniciar sesión | Entrar |
| Footer | ¿No tienes cuenta? Crea una cuenta | ¿Primera vez? Crea tu cuenta gratis |

#### REGISTER

| Elemento | Copy Actual | Copy Mejorado |
|----------|-------------|---------------|
| Título | Crear Cuenta | Crea tu cuenta gratis |
| Subtítulo | Completa tus datos para registrarte | En 30 segundos puedes pedir tu primer turno |
| Label nombre | Nombre completo | Tu nombre |
| Label cédula | Cédula de ciudadanía | Número de cédula |
| Label email | Correo electrónico | Tu correo |
| Label teléfono | Teléfono | Celular |
| Label password | Contraseña | Crea una contraseña |
| Button | Crear cuenta | Crear mi cuenta |
| Footer | ¿Ya tienes cuenta? Inicia sesión | ¿Ya tienes cuenta? Inicia sesión |

### 7.3 Microcopy y Labels

```
CAMPO      | LABEL MEJORADO         | PLACEHOLDER MEJORADO
-----------|------------------------|------------------------
Email      | Correo electrónico     | tu@email.com
Password   | Contraseña             | Escribe tu contraseña
Full Name  | Tu nombre completo      | María del Pilar Gómez
Document   | Tu cédula              | 1234567890
Phone      | Celular               | 300 123 4567

ERROR STATES:
- Email vacío: "Ingresa tu correo electrónico"
- Email inválido: "El correo no parece válido"
- Password vacío: "Ingresa tu contraseña"
- Login failed: "Correo o contraseña incorrectos"

SUCCESS STATES:
- Login success: "Iniciando sesión..."
- Register success: "Creando tu cuenta..."
- Redirect: Redirect automático
```

---

## PARTE 8: DATOS REALES COLOMBIA — INVESTIGACIÓN

### 8.1 Datos Necesarios (Placeholder para que el usuario llene)

```
┌─────────────────────────────────────────────────────────────┐
│  DATOS PARA INVESTIGACIÓN Y VERIFICACIÓN                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TIEMPOS DE ESPERA (datos reales EPS Colombia):            │
│  ─────────────────────────────────────────────────────     │
│  □ Tiempo promedio en fila EPS Suria (Montería): [X min]  │
│  □ Tiempo promedio en fila Bancolombia: [X min]           │
│  □ Tiempo promedio en fila代理机构 gobierno: [X min]     │
│                                                             │
│  ESTADÍSTICAS NACIONALES:                                  │
│  ─────────────────────────────────────────────────────     │
│  □ % personas que pierden turno por esperar mucho: [X%]   │
│  □ Número de turnos emitidos anual Colombia: [X millones] │
│  □ Satisfacción con sistemas de turnos digitales: [X/5]   │
│                                                             │
│  DATOS TUTURNO (usar cuando estén disponibles):            │
│  ─────────────────────────────────────────────────────     │
│  □ Turnos procesados hasta la fecha: [NÚMERO]             │
│  □ Entidades activas: [NÚMERO]                              │
│  □ Tiempo promedio de espera (dato interno): [X min]       │
│  □ Satisfacción promedio usuarios: [X/5]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Entidades de Ejemplo para Simulador

```
ENTIDAD: "EPS Saludar" (nombre ficticio basado en EPS reales)
TIPO: EPS
DIRECCIÓN: Cra 46 #56-56, Montería
SERVICIOS:
  - Afiliaciones y novedades
  - Entrega de carnets
  - Cotización y手术后
  - radicación de incapacidades

NOTA: Usar nombres realistas pero ficticios para evitar problemas.
```

---

## PARTE 9: COMPONENTES A MEJORAR

### 9.1 UiLogo — Lettering Hand-drawn

**MEJORA:** Agregar opción para usar fuente handwritten para "Turno" mientras "Tu" permanece en Unbounded bold.

```
INTERFACE Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  animated?: boolean
  variant?: 'default' | 'handwritten'  // NUEVO
}

VARIANTS:
- default: Todo en Unbounded bold
- handwritten: "Tu" en Unbounded + "Turno" en Caveat/Dancing Script
```

### 9.2 UiButton — Estados Mejorados

```
MEJORAS:
1. Press state: scale(0.97) con transition 100ms
2. Loading state: Spinner + texto configurable
3. Disabled state: opacity reducida, cursor not-allowed
4. Glow effect opcional para primary variant
5. Focus ring visible (accessibility)
```

### 9.3 UiInput — Validación Visual

```
MEJORAS:
1. Iconos lebih besar dan jelas (stroke 1.5)
2. Error state: border merah + mensaje
3. Success state: border hijau + checkmark
4. Focus state: ring dengan color primary
5. Label animation: floating label option
```

### 9.4 Skeleton Components

```
SKELETON VARIANTS PARA:
1. Text line (ancho variable)
2. Avatar (circular)
3. Card (rectangular con padding)
4. Image (aspect ratio preservado)
5. Button (rounded sesuai button real)

ANIMATION: Shimmer de izquierda a derecha
```

---

## PARTE 10: PERFORMANCE OPTIMIZATION

### 10.1 Carga Diferida (Lazy Loading)

```typescript
// Nuxt async components para páginas pesadas
defineAsyncComponent(() => import('./HeavyComponent.vue'))

// O con lazy loading automatique
const HeavyComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: SkeletonLoader,
  delay: 200,
  timeout: 3000
})
```

### 10.2 Imágenes Optimizadas

```
STRATEGY:
1. Usar NuxtImg con formato WebP
2. Lazy loading con placeholder blur
3. Responsive srcset para cada breakpoint
4. Preload para imágenes above the fold
```

### 10.3 Font Loading

```typescript
// nuxt.config.ts
fonts: {
  families: [
    { name: 'Unbounded', provider: 'google', weights: [400, 700, 900] },
    { name: 'Geist', provider: 'google', weights: [400, 500, 600] },
    { name: 'Caveat', provider: 'google', weights: [400, 700] }, // Para handwritten
  ],
  display: 'swap', // Para mejor performance
  preload: true, // Para fonts críticos
}
```

### 10.4 Bundle Analysis

```bash
# Para analizar tamaño de bundle
npm run build -- --analyze

# Verificar que no hay módulos innecesarios
```

---

## PARTE 11: CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Sistema de Diseño
- [ ] Actualizar variables CSS con OKLCH
- [ ] Agregar fuente Caveat/Dancing Script para handwritten
- [ ] Actualizar tailwind.config.ts
- [ ] Crear componentes de animación base

### FASE 2: Landing Page
- [ ] Rediseñar Header con glass mejorado
- [ ] Implementar lettering "TuTurno" con handwritten
- [ ] Mejorar Hero con copy refinado
- [ ] Expandir Phone Simulator con más interactividad
- [ ] Rediseñar "Cómo Funciona" con mejor copy
- [ ] Implementar tabs para soluciones (ciudadanos/entidades/operadores)
- [ ] Mejorar stats con count-up animation
- [ ] Rediseñar CTA final
- [ ] Actualizar Footer con datos reales

### FASE 3: Autenticación
- [ ] Rediseñar layout auth (40/60 split)
- [ ] Agregar Phone Simulator al brand side
- [ ] Mejorar inputs con UiInput component
- [ ] Refinar copy de login/register
- [ ] Implementar forgot password flow
- [ ] Agregar toast notifications

### FASE 4: Animaciones y Polish
- [ ] Implementar scroll reveal con IntersectionObserver
- [ ] Agregar stagger animations
- [ ] Implementar reduced motion support
- [ ] Optimizar performance (lazy loading)
- [ ] Testing en múltiples dispositivos

### FASE 5: Content
- [ ] Investigar datos reales Colombia
- [ ] Llenar datos de stats con números reales
- [ ] Actualizar copy con voz refinada
- [ ] Traducir textos pendientes

---

## PARTE 12: ARCHIVOS A MODIFICAR

### Archivos a Crear:
```
components/landing/sections/
  ├── LandingSolutionsTabs.vue     (nuevo - tabs para soluciones)
  ├── LandingImpactSection.vue    (nuevo - stats con count-up)
  └── LandingEntityFeatures.vue   (nuevo - features para entidades)

components/landing/simulator/
  ├── ScreenHome.vue             (mejoras de copy)
  ├── ScreenEntityDetail.vue     (mejoras de copy)
  ├── ScreenRequestTurn.vue      (mejoras de copy)
  ├── ScreenTracking.vue         (mejoras con datos realistas)
  ├── ScreenNotification.vue     (mejoras)
  └── ScreenComplete.vue         (mejoras)

composables/
  └── useCountUp.ts              (nuevo - animación de números)
```

### Archivos a Modificar:
```
assets/css/main.css              (actualizar variables CSS)
tailwind.config.ts              (actualizar config)
nuxt.config.ts                  (font loading mejorado)
components/ui/UiLogo.vue         (agregar variant handwritten)
components/landing/LandingHeader.vue
components/landing/LandingHeroNew.vue
components/landing/LandingHowItWorks.vue
components/landing/LandingFeatures.vue
components/landing/LandingCTA.vue
components/landing/LandingFooter.vue
layouts/auth.vue
pages/auth/login.vue
pages/auth/register.vue
pages/auth/forgot-password.vue
```

---

## RESUMEN EJECUTIVO

Este documento establece un plan completo para transformar TuTurno en una plataforma con diseño de nivel startup tecnológica. Las principales áreas de mejora son:

1. **Sistema de diseño refinado** — Colores OKLCH, tipografía mejorada, espaciado consistente
2. **Hero interactivo** — Phone simulator más realista con letterings hand-drawn para la marca
3. **Contenido mejorado** — Copy más directo, voz de startup, datos reales de Colombia
4. **Animaciones sofisticadas** — Scroll reveals, stagger, count-up animations, reduced motion support
5. **Responsive total** — Optimizado para todas las pantallas (320px hasta 4K)
6. **Tabs de soluciones** — Para ciudadanos, entidades y operadores con contenido diferenciado
7. **Autenticación pulida** — Phone mockup en brand side, inputs mejorados, microcopy refinado

**Próximos pasos:**
1. Investigar y llenar datos reales de Colombia
2. Comenzar implementación de Fase 1 (Sistema de diseño)
3. Continuar con las demás fases en orden

---

*Documento creado para TuTurno — Universidad de Córdoba*
*Mayo 2026*
