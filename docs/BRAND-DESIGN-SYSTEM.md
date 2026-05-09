# TuTurno — Master Design System & Brand Guide

## Visión de Marca

**TuTurno** no es "una página de turnos más". Es **el sistema de gestión de turnos digital** que hace que las personas se sientan valoradas. El nombre debe transmitirse con **confianza, innovación y calidez humana**.

### Brand Attributes

| Atributo | Descripción | Aplicación |
|----------|-------------|------------|
| **Invitador** | Accesible, no intimidante | Colores cálidos, microcopy amigable |
| **Tecnológico** | Moderno, eficiente | Glassmorphism, animaciones fluidas |
| **Confiable** | Seguro, profesional | Buenos errores, estados claros |
| **Humano** | No corporativo, cercano | Lenguaje natural, iconografía suave |
| **Veloz** | Rápido, eficiente | Performance optimization, loading states |

### Brand Voice

- **Tono:** Cercano pero profesional
- **Idioma:** Español colombiano
- **Perspectiva:** Segunda persona (tú, tu)
- **Verbos:** Acciones claras y directas
- **Evitar:** Jerga técnica innecesaria, tono机器人

**Ejemplos de copy:**
- ❌ "Su turno ha sido registrado exitosamente"
- ✅ "¡Listo! Tu turno está confirmado"
- ❌ "El usuario no tiene turnos activos"
- ✅ "Aún no tienes turnos. ¡Solicita tu primero!"
- ❌ "Error de autenticación"
- ✅ "No reconocemos estos datos. ¿Quieres intentar de nuevo?"

---

## 1. Design Language System

### 1.1 Color Palette — OKLCH

**Por qué OKLCH:** Los colores.OKLCH son más intuitivos para humanos. El tercer parámetro (H) es el hue, lo que facilita crear variaciones armónicas.

```css
/* ============================================
   TuTurno Color System — OKLCH
   ============================================ */

/* Primary — El violeta TuTurno */
--color-primary:        oklch(55% 0.18 285);     /* #6C3AE8 - Principal */
--color-primary-light:  oklch(72% 0.16 285);     /* #A78BFA - Hover, énfasis */
--color-primary-dark:   oklch(40% 0.15 285);     /* #4C1D95 - Pressed */
--color-primary-glow:   oklch(55% 0.25 285 / 0.4); /* Glow effects */

/* Accent — Para highlights específicos */
--color-accent:         oklch(75% 0.14 235);     /* #818CF8 - Indigo suave */

/* Neutrals — Zinc con tinte violeta */
--color-bg-base:        oklch(13% 0.015 285);    /* #0D0D14 - Fondo app */
--color-bg-surface:     oklch(16% 0.015 285);    /* #13131F - Cards */
--color-bg-elevated:    oklch(20% 0.015 285);    /* #1A1A2E - Modals */
--color-bg-overlay:     oklch(24% 0.015 285);    /* #1F1F35 - Overlays */

--color-text-primary:   oklch(100% 0 0 / 0.95);  /* Texto principal */
--color-text-secondary: oklch(100% 0 0 / 0.60); /* Texto secundario */
--color-text-muted:     oklch(100% 0 0 / 0.30);  /* Texto terciario */
--color-text-accent:    oklch(72% 0.16 285);     /* Texto con color primary */

--color-border:         oklch(100% 0 0 / 0.08);  /* Bordes sutiles */
--color-border-strong:  oklch(100% 0 0 / 0.15);  /* Bordes más visibles */

/* Turn Status Colors — Informativos, no interactivos */
--color-turn-waiting:   oklch(55% 0.18 285);     /* Violeta — en espera */
--color-turn-called:   oklch(75% 0.16 45);       /* Ámbar — llamado */
--color-turn-attending: oklch(65% 0.15 235);     /* Azul — atendiendo */
--color-turn-completed: oklch(70% 0.15 160);      /* Verde — completado */
--color-turn-no-show:   oklch(60% 0.18 25);       /* Rojo — no asistió */
--color-turn-cancelled: oklch(50% 0.10 0);       /* Gris — cancelado */

/* Semantic */
--color-success:        oklch(70% 0.15 160);
--color-warning:        oklch(75% 0.16 45);
--color-error:          oklch(60% 0.18 25);
--color-info:           oklch(65% 0.15 235);

/* ============================================
   Usage Guide
   ============================================

   Backgrounds:
   - app.vue, páginas:        bg-[--color-bg-base]
   - Cards, componentes:      glass (bg-white/4 + blur)
   - Modals, drawers:        bg-[--color-bg-elevated]

   Text:
   - Títulos, h1-h2:          text-white (default)
   - Body text:              text-white/60
   - Labels, hints:          text-white/40
   - Links, énfasis:         text-primary

   States (Turn Status):
   - waiting:                bg-turn-waiting, text-turn-waiting
   - called:                 bg-turn-called, text-turn-called
   - attending:              bg-turn-attending, text-turn-attending
   - completed:              bg-turn-completed, text-turn-completed
   - no-show:                bg-turn-no-show, text-turn-no-show

   Borders:
   - Separadores sutiles:     border-white/5
   - Cards glass:            border-white/10
   - Inputs focus:          border-primary

*/
```

### 1.2 Typography

```css
/* ============================================
   TuTurno Typography System
   ============================================

   Stack: Geist (display/headings) + DM Sans (body)
   Ya configurado en nuxt.config.ts via @nuxt/fonts

   Scale (clamp for fluid typography):
   ------------------------------------------------
   --text-hero:    clamp(3rem, 8vw + 1rem, 6rem)     /* Landing hero */
   --text-display: clamp(2.5rem, 5vw + 1rem, 4rem)   /* Títulos principales */
   --text-h1:      clamp(2rem, 3vw + 1rem, 3rem)    /* Secciones */
   --text-h2:      clamp(1.5rem, 2vw + 0.5rem, 2rem) /* Subtítulos */
   --text-h3:      1.25rem                            /* Componentes */
   --text-body:    1rem                                /* Texto normal */
   --text-small:   0.875rem                           /* Labels */
   --text-micro:   0.75rem                            /* Badges */

   Weights:
   - Font light:     300
   - Font normal:    400
   - Font medium:    500
   - Font semibold:  600
   - Font bold:      700

   Line Heights:
   --leading-none:     1      /* Headlines */
   --leading-snug:     1.25   /* Subtítulos */
   --leading-normal:   1.5    /* UI elements */
   --leading-relaxed:  1.625 /* Body text */

   Letter Spacing:
   --tracking-tighter: -0.02em  /* Headlines grandes */
   --tracking-tight:   -0.01em  /* Subtítulos */
   --tracking-normal:  0        /* Body */
   --tracking-wide:    0.02em   /* Labels, badges */
   --tracking-widest:  0.05em   /* Tags, categories */

   ============================================
   Usage Guide
   ============================================

   <h1 class="text-[clamp(2rem,3vw+1rem,3rem)] font-semibold tracking-tight leading-none">
     Título de sección
   </h1>

   <p class="text-base text-white/60 leading-relaxed max-w-[65ch]">
     Texto de párrafo...
   </p>

   <span class="text-sm text-white/50 uppercase tracking-widest">
     Label
   </span>

*/
```

### 1.3 Spacing System

```css
/* ============================================
   TuTurno Spacing System — 4px base
   ============================================

   scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

   CSS Custom Properties (en main.css):
   --space-px:  1px
   --space-0:   0
   --space-1:   0.25rem  (4px)
   --space-2:   0.5rem   (8px)
   --space-3:   0.75rem  (12px)
   --space-4:   1rem     (16px)
   --space-5:   1.25rem  (20px)
   --space-6:   1.5rem   (24px)
   --space-8:   2rem     (32px)
   --space-10:  2.5rem   (40px)
   --space-12:  3rem     (48px)
   --space-16:  4rem     (64px)
   --space-20:  5rem     (80px)
   --space-24:  6rem     (96px)

   Safe Areas (mobile):
   --safe-top:    env(safe-area-inset-top)
   --safe-bottom: env(safe-area-inset-bottom)
   --safe-left:   env(safe-area-inset-left)
   --safe-right:  env(safe-area-inset-right)

   ============================================
   Usage
   ============================================

   Page padding:    px-4 (mobile), px-6 (tablet), px-8 (desktop)
   Card padding:    p-4 (mobile), p-6 (desktop)
   Section gaps:    gap-6 to gap-12
   Component gap:   gap-3 to gap-4

*/
```

### 1.4 Border Radius

```css
/* ============================================
   TuTurno Border Radius System
   ============================================

   scale: sm, md, lg, xl, 2xl, 3xl, full

   --radius-sm:   0.5rem    (8px)    - Buttons pequeños, badges
   --radius-md:   0.75rem    (12px)   - Inputs, small cards
   --radius-lg:   1rem       (16px)   - Cards, modals
   --radius-xl:   1.5rem     (24px)   - Large cards, panels
   --radius-2xl:  2rem       (32px)   - Feature cards
   --radius-3xl:  3rem       (48px)   - Hero elements
   --radius-full: 9999px              - Pills, avatars

   ============================================
   Usage Guide
   ============================================

   Buttons:       rounded-xl
   Inputs:        rounded-xl
   Cards:         rounded-2xl (mobile), rounded-3xl (desktop)
   Modals:        rounded-3xl
   Avatars:       rounded-full
   Badges:        rounded-full or rounded-lg
   Turn numbers:  rounded-2xl

*/
```

### 1.5 Shadows

```css
/* ============================================
   TuTurno Shadow System
   ============================================

   --shadow-sm:    0 1px 2px oklch(0% 0 0 / 0.05)
   --shadow-md:    0 4px 6px -1px oklch(0% 0 0 / 0.1), 0 2px 4px -2px oklch(0% 0 0 / 0.1)
   --shadow-lg:    0 10px 15px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -4px oklch(0% 0 0 / 0.1)
   --shadow-xl:    0 20px 25px -5px oklch(0% 0 0 / 0.1), 0 8px 10px -6px oklch(0% 0 0 / 0.1)
   --shadow-glow:  0 0 20px oklch(55% 0.18 285 / 0.4)
   --shadow-glow-lg: 0 0 40px oklch(55% 0.18 285 / 0.5)

   Glass shadows:
   --glass-shadow: 0 8px 32px oklch(55% 0.18 285 / 0.15)

   ============================================
   Usage
   ============================================

   Buttons (pressed):  shadow-sm → none
   Cards hover:        shadow-lg with translateY(-2px)
   Active elements:    shadow-glow
   Turn called badge:  shadow-glow-lg

*/
```

### 1.6 Motion & Animation

```css
/* ============================================
   TuTurno Motion System
   ============================================

   Basado en emil-design-eng principles:
   - Solo animate transform y opacity (GPU accelerated)
   - ease-out para elementos que entran
   - ease-in-out para elementos que se mueven
   - UI animations < 300ms
   - Respetar prefers-reduced-motion

   ============================================
   Easing Curves
   ============================================

   --ease-out:        cubic-bezier(0.23, 1, 0.32, 1)     /* Strong ease-out */
   --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1)      /* Exponential */
   --ease-in-out:     cubic-bezier(0.77, 0, 0.175, 1)    /* Movement */
   --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1)  /* Playful */
   --ease-drawer:     cubic-bezier(0.32, 0.72, 0, 1)      /* iOS-like */

   ============================================
   Durations
   ============================================

   --duration-fast:   150ms    /* Micro-interactions */
   --duration-base:   200ms    /* Standard transitions */
   --duration-slow:   300ms    /* Modals, drawers */
   --duration-slower: 400ms    /* Page transitions */

   ============================================
   Keyframes
   ============================================

   /* Elementos que entran */
   @keyframes fade-in {
     from { opacity: 0; }
     to { opacity: 1; }
   }

   @keyframes slide-up {
     from { opacity: 0; transform: translateY(16px); }
     to { opacity: 1; transform: translateY(0); }
   }

   @keyframes slide-down {
     from { opacity: 0; transform: translateY(-16px); }
     to { opacity: 1; transform: translateY(0); }
   }

   /* Skeleton loading */
   @keyframes shimmer {
     0% { transform: translateX(-100%); }
     100% { transform: translateX(100%); }
   }

   /* Glow para estados activos */
   @keyframes pulse-glow {
     0%, 100% { box-shadow: 0 0 20px oklch(55% 0.18 285 / 0.4); }
     50% { box-shadow: 0 0 40px oklch(55% 0.18 285 / 0.8); }
   }

   /* Float para elementos decorativos */
   @keyframes float {
     0%, 100% { transform: translateY(0); }
     50% { transform: translateY(-8px); }
   }

   /* Flip para números de turno */
   @keyframes flip-in {
     0% { transform: rotateX(90deg); opacity: 0; }
     100% { transform: rotateX(0deg); opacity: 1; }
   }

   /* Logo reveal */
   @keyframes logo-reveal {
     from { clip-path: inset(0 100% 0 0); }
     to { clip-path: inset(0 0 0 0); }
   }

   /* Logo glow pulse */
   @keyframes logo-glow {
     0%, 100% { filter: drop-shadow(0 0 8px oklch(55% 0.18 285 / 0.4)); }
     50% { filter: drop-shadow(0 0 16px oklch(55% 0.18 285 / 0.7)); }
   }

   /* Scroll reveal */
   @keyframes reveal-up {
     from { opacity: 0; transform: translateY(32px); }
     to { opacity: 1; transform: translateY(0); }
   }

   ============================================
   Animation Classes
   ============================================

   .animate-fade-in    { animation: fade-in var(--duration-base) var(--ease-out) both; }
   .animate-slide-up   { animation: slide-up var(--duration-slow) var(--ease-out) both; }
   .animate-slide-down { animation: slide-down var(--duration-slow) var(--ease-out) both; }
   .animate-shimmer    { animation: shimmer 1.5s infinite; }
   .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
   .animate-float      { animation: float 6s ease-in-out infinite; }
   .animate-turn-flip   { animation: flip-in 0.4s var(--ease-spring) both; }
   .animate-logo-reveal { animation: logo-reveal 0.6s var(--ease-out) both; }
   .animate-logo-glow   { animation: logo-glow 3s ease-in-out infinite; }

   /* Scroll reveal — requiere JS para agregar .in-view */
   .reveal { opacity: 0; }
   .reveal.in-view { animation: reveal-up 0.5s var(--ease-out) both; }
   .reveal-left.in-view { animation: slide-up 0.5s var(--ease-out) both; }
   .reveal-right.in-view { animation: slide-up 0.5s var(--ease-out) both; }

   ============================================
   Stagger Delays
   ============================================

   .stagger-1 { animation-delay: 50ms; }
   .stagger-2 { animation-delay: 100ms; }
   .stagger-3 { animation-delay: 150ms; }
   .stagger-4 { animation-delay: 200ms; }
   .stagger-5 { animation-delay: 250ms; }
   .stagger-6 { animation-delay: 300ms; }

   ============================================
   Reduced Motion
   ============================================

   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }

*/
```

---

## 2. Component Guidelines

### 2.1 Glass System

```css
/* ============================================
   Glassmorphism System — refinada
   ============================================

   El glassmorphism en TuTurno NO es decorativo.
   Se usa para:
   - Cards en fondos oscuros
   - Modals, drawers
   - Navigation bars
   - Input backgrounds

   ============================================
   Glass Base
   ============================================

   .glass {
     background: oklch(100% 0 0 / 0.04);
     backdrop-filter: blur(16px);
     -webkit-backdrop-filter: blur(16px);
     border: 1px solid oklch(100% 0 0 / 0.08);
     box-shadow: 0 8px 32px oklch(55% 0.18 285 / 0.15);
   }

   ============================================
   Glass Variants
   ============================================

   .glass-hover {
     transition: background var(--duration-fast) var(--ease-out),
                 box-shadow var(--duration-fast) var(--ease-out),
                 transform var(--duration-fast) var(--ease-out);
   }

   .glass-hover:hover {
     background: oklch(100% 0 0 / 0.07);
     box-shadow: 0 12px 40px oklch(55% 0.18 285 / 0.25);
     transform: translateY(-2px);
   }

   /* Para superficies elevadas (modals) */
   .glass-elevated {
     background: oklch(100% 0 0 / 0.06);
     backdrop-filter: blur(24px);
     box-shadow: 0 24px 48px oklch(0% 0 0 / 0.4);
   }

   /* Para inputs */
   .glass-input {
     background: oklch(100% 0 0 / 0.05);
     border: 1px solid oklch(100% 0 0 / 0.10);
     transition: border-color var(--duration-fast) var(--ease-out),
                 background var(--duration-fast) var(--ease-out);
   }

   .glass-input:focus {
     background: oklch(100% 0 0 / 0.08);
     border-color: var(--color-primary);
   }

   ============================================
   NO Glass Decoration
   ============================================

   Regla (impeccable): Glassmorphism as default es BANNED.
   Solo usar cuando comunica jerarquía visual.

*/
```

### 2.2 Button System

```css
/* ============================================
   Button System
   ============================================

   Variants:
   - primary:  Filled with primary color + glow
   - outline:  Border only, transparent bg
   - ghost:     No border, subtle hover bg
   - danger:    Red variant for destructive actions

   Sizes:
   - sm:        h-8 px-3 text-xs
   - md:        h-10 px-4 text-sm
   - lg:        h-12 px-6 text-base
   - xl:        h-14 px-8 text-lg

   ============================================
   Button Base
   ============================================

   .btn {
     display: inline-flex;
     align-items: center;
     justify-content: center;
     gap: 0.5rem;
     font-weight: 600;
     border-radius: 0.75rem;
     transition: all var(--duration-fast) var(--ease-out);
     cursor: pointer;
     user-select: none;
     white-space: nowrap;
   }

   .btn:focus-visible {
     outline: none;
     box-shadow: 0 0 0 3px oklch(55% 0.18 285 / 0.3);
   }

   /* Press feedback */
   .btn:active:not(:disabled) {
     transform: scale(0.97);
   }

   /* Disabled state */
   .btn:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }

   ============================================
   Button Variants
   ============================================

   .btn-primary {
     background: var(--color-primary);
     color: white;
     box-shadow: 0 0 20px oklch(55% 0.18 285 / 0.3);
   }

   .btn-primary:hover:not(:disabled) {
     background: var(--color-primary-light);
     box-shadow: 0 0 30px oklch(55% 0.18 285 / 0.5);
   }

   .btn-outline {
     background: transparent;
     border: 1px solid oklch(100% 0 0 / 0.15);
     color: white;
   }

   .btn-outline:hover:not(:disabled) {
     background: oklch(100% 0 0 / 0.05);
     border-color: oklch(100% 0 0 / 0.25);
   }

   .btn-ghost {
     background: transparent;
     color: oklch(100% 0 0 / 0.7);
   }

   .btn-ghost:hover:not(:disabled) {
     background: oklch(100% 0 0 / 0.05);
     color: white;
   }

   .btn-danger {
     background: var(--color-error);
     color: white;
   }

   .btn-danger:hover:not(:disabled) {
     background: oklch(60% 0.18 25 / 0.9);
   }

*/
```

### 2.3 Input System

```css
/* ============================================
   Input System
   ============================================

   .input {
     width: 100%;
     padding: 1rem 1rem 1rem 3rem; /* Space for icon */
     background: oklch(100% 0 0 / 0.05);
     border: 1px solid oklch(100% 0 0 / 0.10);
     border-radius: 0.75rem;
     color: white;
     font-size: 1rem;
     transition: all var(--duration-fast) var(--ease-out);
   }

   .input::placeholder {
     color: oklch(100% 0 0 / 0.3);
   }

   .input:focus {
     outline: none;
     background: oklch(100% 0 0 / 0.08);
     border-color: var(--color-primary);
     box-shadow: 0 0 0 3px oklch(55% 0.18 285 / 0.15);
   }

   .input:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }

   .input-error {
     border-color: var(--color-error);
   }

   .input-error:focus {
     border-color: var(--color-error);
     box-shadow: 0 0 0 3px oklch(60% 0.18 25 / 0.2);
   }

   ============================================
   Input With Icon
   ============================================

   .input-wrapper {
     position: relative;
   }

   .input-icon {
     position: absolute;
     left: 1rem;
     top: 50%;
     transform: translateY(-50%);
     color: oklch(100% 0 0 / 0.3);
     pointer-events: none;
   }

   .input-wrapper .input {
     padding-left: 3rem;
   }

   ============================================
   Floating Label Pattern (alternative)
   ============================================

   .input-floating {
     padding: 1.5rem 1rem 0.5rem;
   }

   .input-floating + label {
     position: absolute;
     left: 1rem;
     top: 50%;
     transform: translateY(-50%);
     color: oklch(100% 0 0 / 0.4);
     pointer-events: none;
     transition: all var(--duration-fast) var(--ease-out);
   }

   .input-floating:focus + label,
   .input-floating:not(:placeholder-shown) + label {
     top: 0.75rem;
     transform: translateY(0);
     font-size: 0.75rem;
     color: var(--color-primary);
   }

*/
```

### 2.4 Card System

```css
/* ============================================
   Card System
   ============================================

   Base card — para listas y contenido
   ------------------------------------------------
   .card {
     background: oklch(100% 0 0 / 0.04);
     border: 1px solid oklch(100% 0 0 / 0.08);
     border-radius: 1.5rem;
     padding: 1.5rem;
   }

   Interactive card — con hover
   ------------------------------------------------
   .card-interactive {
     cursor: pointer;
     transition: all var(--duration-base) var(--ease-out);
   }

   .card-interactive:hover {
     background: oklch(100% 0 0 / 0.07);
     border-color: oklch(100% 0 0 / 0.12);
     transform: translateY(-4px);
     box-shadow: 0 12px 40px oklch(55% 0.18 285 / 0.2);
   }

   Card variants por contexto
   ------------------------------------------------
   .card-entity  { border-color: oklch(100% 0 0 / 0.08); }
   .card-turn    { /* Has status color accent */ }
   .card-empty   { text-align: center; padding: 3rem; }

*/
```

### 2.5 Badge System

```css
/* ============================================
   Badge System
   ============================================

   Base badge
   ------------------------------------------------
   .badge {
     display: inline-flex;
     align-items: center;
     gap: 0.25rem;
     padding: 0.25rem 0.75rem;
     font-size: 0.75rem;
     font-weight: 600;
     border-radius: 9999px;
     text-transform: uppercase;
     letter-spacing: 0.02em;
   }

   Badge variants
   ------------------------------------------------
   .badge-waiting {
     background: oklch(55% 0.18 285 / 0.15);
     color: oklch(72% 0.16 285);
   }

   .badge-called {
     background: oklch(75% 0.16 45 / 0.15);
     color: oklch(75% 0.16 45);
   }

   .badge-attending {
     background: oklch(65% 0.15 235 / 0.15);
     color: oklch(65% 0.15 235);
   }

   .badge-completed {
     background: oklch(70% 0.15 160 / 0.15);
     color: oklch(70% 0.15 160);
   }

   .badge-no-show {
     background: oklch(60% 0.18 25 / 0.15);
     color: oklch(60% 0.18 25);
   }

   Badge with dot
   ------------------------------------------------
   .badge::before {
     content: '';
     width: 0.5rem;
     height: 0.5rem;
     border-radius: 50%;
     background: currentColor;
   }

   .badge-pulse::before {
     animation: status-pulse 2s ease-in-out infinite;
   }

*/
```

---

## 3. Layout System

### 3.1 App Shell Structure

```
┌─────────────────────────────────────────────────────┐
│ HEADER (sticky)                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Logo]           [Notifs] [Avatar]              ││
│ └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│                                                     │
│ CONTENT (scrollable)                               │
│ ┌─────────────────────────────────────────────────┐│
│ │                                                 ││
│ │  Page-specific content                          ││
│ │  max-w-4xl mx-auto (mobile: none)              ││
│ │                                                 ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
├─────────────────────────────────────────────────────┤
│ BOTTOM NAV (mobile only, fixed)                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Home] [Turnos] [Entidades] [Perfil]            ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘

Desktop (>1024px): Sidebar layout for operator/admin
Mobile: Bottom nav for citizen
```

### 3.2 Container Strategy

```css
/* Page container */
.page-container {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .page-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .page-container {
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 80rem; /* 1280px */
    margin-left: auto;
    margin-right: auto;
  }
}

/* Content card — para cuando necesitas card centering */
.content-card {
  max-width: 42rem; /* 672px */
  margin-left: auto;
  margin-right: auto;
}
```

### 3.3 Safe Areas

```css
/* iOS notch / home indicator */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Para bottom nav */
.pb-safe {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}
```

---

## 4. Brand Presence — TuTurno Omnipresente

### 4.1 Logo Component

```vue
<!-- components/ui/UiLogo.vue -->
<template>
  <component
    :is="as"
    class="inline-flex items-center gap-2 font-bold tracking-tight group"
    :class="sizeClasses"
  >
    <!-- Icon -->
    <span
      v-if="variant !== 'text-only'"
      class="relative flex items-center justify-center"
      :class="iconSizeClasses"
    >
      <svg viewBox="0 0 32 32" class="w-full h-full">
        <!-- T icon stylized — moderne, minimal -->
        <path
          d="M16 4L6 12V14H26V12L16 4Z"
          fill="currentColor"
          class="text-primary"
        />
        <rect
          x="12"
          y="14"
          width="8"
          height="14"
          rx="2"
          fill="currentColor"
          class="text-primary"
        />
      </svg>

      <!-- Subtle glow on hover -->
      <span
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style="filter: blur(8px); background: oklch(55% 0.18 285 / 0.3);"
      />
    </span>

    <!-- Text with TuTurno stylization -->
    <span class="relative">
      Tu<span class="text-primary">Turno</span>
    </span>
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'icon-only' | 'text-only' | 'icon+text'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  as?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  as: 'div',
})

const sizeClasses = computed(() => ({
  'text-xs': props.size === 'xs',
  'text-sm': props.size === 'sm',
  'text-base': props.size === 'md',
  'text-lg': props.size === 'lg',
  'text-xl': props.size === 'xl',
}))

const iconSizeClasses = computed(() => ({
  'w-4 h-4': props.size === 'xs',
  'w-5 h-5': props.size === 'sm',
  'w-6 h-6': props.size === 'md',
  'w-8 h-8': props.size === 'lg',
  'w-10 h-10': props.size === 'xl',
}))
</script>
```

### 4.2 Logo Usage Guide

| Context | Variant | Size |
|---------|---------|------|
| Navbar (desktop) | icon+text | md |
| Navbar (mobile) | icon-only | sm |
| Footer | icon+text | xs |
| Auth brand side | icon+text | xl |
| Page titles | text-only | lg |
| Turn ticket | icon+text | sm |
| Empty states | icon-only | lg |

### 4.3 Favicon & PWA Icons

```json
// public/manifest.json — icon references
{
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**Icon Design:**
- Background: transparent
- Icon: El T de TuTurno en primary (#6C3AE8)
- Shape: T rounded, memorable at small sizes
- Must work at 16x16 (favicon) and 512x512 (PWA splash)

### 4.4 Wordmark in Copy

**En textos y microcopy, usar:**

```
Correcto:
- "TuTurno te permite..."
- "En TuTurno, tu tiempo vale"
- "Gestionado por TuTurno"

Incorrecto:
- "tuturno" (lowercase)
- "Tu Turno" (espacio)
- "TuTurno™" (símbolo de marca innecesario)
- "TUTURNO" (caps lock)
```

---

## 5. Page Transitions & Navigation

### 5.1 Page Transition System

```css
/* Nuxt page transitions — set in nuxt.config.ts */

/* Default transition */
.page-enter-active,
.page-leave-active {
  transition: all 200ms var(--ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* For authenticated app pages */
.app-page-enter-active,
.app-page-leave-active {
  transition: all 200ms var(--ease-out);
}

.app-page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.app-page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
```

### 5.2 Route-based Transitions

```vue
<!-- In app.vue or layout -->
<template>
  <NuxtPage
    :transition="{
      name: isAuthPage ? 'page' : 'app-page',
      mode: 'out-in',
    }"
  />
</template>
```

### 5.3 Bottom Nav Animation

```css
/* Active indicator slide */
.bottom-nav {
  position: relative;
}

.bottom-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--active-left, 0);
  width: var(--active-width, 0);
  height: 2px;
  background: var(--color-primary);
  border-radius: 0 0 2px 2px;
  transition: left 200ms var(--ease-out),
              width 200ms var(--ease-out);
}
```

---

## 6. Performance Guidelines

### 6.1 Critical CSS

```css
/* Inline critical above-fold CSS */
/* hero, logo, primary buttons */

/* Defer non-critical */
/* animations, shadows, hover effects */
```

### 6.2 Image Optimization

```vue
<!-- Use NuxtImg for all images -->
<NuxtImg
  :src="entity.logoUrl"
  :alt="`Logo de ${entity.name}`"
  width="80"
  height="80"
  format="webp"
  loading="lazy"
  class="w-20 h-20 rounded-xl object-cover"
/>
```

### 6.3 Component Lazy Loading

```vue
<script setup lang="ts">
// Lazy load heavy components
const TurnTrackerAsync = defineAsyncComponent({
  loader: () => import('@/components/turn/TurnTracker.vue'),
  loadingComponent: UiSkeleton,
  delay: 200,
})

const QRCodeAsync = defineAsyncComponent({
  loader: () => import('qrcode'),
  loadingComponent: UiSkeleton,
})
</script>
```

### 6.4 Bundle Optimization

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: process.env.NODE_ENV === 'development',
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },

  routeRules: {
    '/': { prerender: true },
    '/auth/**': { ssr: false },
    '/app/**': { ssr: false },
    '/operator/**': { ssr: false },
    '/admin/**': { ssr: false },
  },
})
```

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 AA Compliance

| Criterion | Implementation |
|-----------|----------------|
| Color contrast | 4.5:1 minimum for text |
| Focus indicators | Visible focus ring on all interactive |
| Touch targets | Minimum 44x44px |
| Screen reader | ARIA labels, live regions |
| Reduced motion | Respect `prefers-reduced-motion` |

### 7.2 Interactive Elements

```vue
<!-- Button focus state -->
<button
  class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
>

<!-- Touch target minimum -->
<button class="min-w-[44px] min-h-[44px]">
```

### 7.3 Screen Reader Support

```vue
<!-- Live region for dynamic updates -->
<div aria-live="polite" class="sr-only">
  {{ statusMessage }}
</div>

<!-- Turn status announcements -->
<span role="status" aria-label="Estado del turno: {{ status }}">
```

---

## 8. Responsive Breakpoints

### 8.1 Breakpoint System

```css
/* Mobile first */

@media (min-width: 384px)  { /* xs - feature phones */ }
@media (min-width: 640px)  { /* sm - large phones */ }
@media (min-width: 768px)  { /* md - tablets */ }
@media (min-width: 1024px) { /* lg - laptops */ }
@media (min-width: 1280px) { /* xl - desktops */ }
@media (min-width: 1536px) { /* 2xl - large screens */ }
```

### 8.2 Responsive Patterns

```vue
<!-- Mobile: Full width, generous padding -->
<!-- Desktop: Constrained width, centered -->

<div class="
  px-4 py-6
  sm:px-6 sm:py-8
  lg:px-8 lg:py-10
  xl:max-w-5xl xl:mx-auto
">
```

```vue
<!-- Cards: 1 column mobile, 2 columns tablet -->
<div class="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:gap-8
">
```

---

## 9. State Handling

### 9.1 Loading States

```vue
<!-- Skeleton over content -->
<div v-if="loading" class="space-y-4">
  <UiSkeleton variant="rectangular" class="w-full h-48 rounded-2xl" />
  <UiSkeleton variant="text" class="w-3/4 h-6" />
  <UiSkeleton variant="text" class="w-1/2 h-4" />
</div>

<!-- Or overlay -->
<div class="relative">
  <ActualContent v-if="!loading" />

  <div
    v-if="loading"
    class="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm flex items-center justify-center"
  >
    <UiSpinner size="lg" />
  </div>
</div>
```

### 9.2 Empty States

```vue
<!-- EmptyState component -->
<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="w-24 h-24 mb-6 rounded-3xl bg-white/5 flex items-center justify-center">
      <component :is="icon" class="w-12 h-12 text-white/20" />
    </div>
    <h3 class="text-xl font-semibold text-white mb-2">{{ title }}</h3>
    <p class="text-white/50 max-w-[280px] mb-6">{{ description }}</p>
    <slot name="action" />
  </div>
</template>
```

### 9.3 Error States

```vue
<!-- Inline error -->
<p class="text-sm text-red-400 flex items-center gap-1">
  <AlertCircleIcon class="w-3 h-3" />
  {{ errorMessage }}
</p>

<!-- Error alert with retry -->
<div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
  <div class="flex items-start gap-3">
    <ExclamationTriangleIcon class="w-5 h-5 text-red-400 shrink-0" />
    <div class="flex-1">
      <p class="font-medium text-red-400">{{ title }}</p>
      <p class="text-sm text-red-400/80 mt-1">{{ message }}</p>
    </div>
    <button
      v-if="retry"
      class="text-sm text-red-400 hover:text-red-300"
      @click="$emit('retry')"
    >
      Reintentar
    </button>
  </div>
</div>
```

---

## 10. Implementation Priority

### Phase 1: Foundation
- [ ] CSS variables en main.css
- [ ] Animation keyframes
- [ ] Glass system
- [ ] Button system
- [ ] Input system
- [ ] UiLogo component

### Phase 2: Core Pages
- [ ] Auth flow (login, register, forgot)
- [ ] Citizen home (/app)
- [ ] Turn tracking pages

### Phase 3: Polish
- [ ] Page transitions
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Micro-interactions

### Phase 4: Performance
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle analysis
- [ ] Accessibility audit

---

## 11. File Structure Reference

```
assets/css/
├── main.css           ← Variables CSS, reset, utilities
├── glass.css         ← Glass system
├── animations.css     ← Keyframes, animation classes

components/
├── ui/
│   ├── UiButton.vue   ← Button system
│   ├── UiInput.vue    ← Input system
│   ├── UiCard.vue     ← Card system
│   ├── UiBadge.vue    ← Badge system
│   ├── UiLogo.vue     ← TuTurno logo
│   ├── UiSkeleton.vue ← Loading skeletons
│   ├── UiSpinner.vue  ← Spinner
│   ├── UiModal.vue    ← Modal
│   └── UiToast.vue    ← Toast notifications

composables/
├── useCountUp.ts      ← Animated counters
├── useScrollReveal.ts ← Intersection observer
├── useShake.ts        ← Error shake
├── useFocusTrap.ts    ← Focus management
└── useLazyLoad.ts     ← Lazy loading

layouts/
├── auth.vue           ← Split layout for auth
├── citizen.vue        ← App shell for citizens
├── operator.vue       ← Sidebar layout for operators
└── admin.vue          ← Sidebar layout for admins
```

---

## 12. Quick Reference

### Colors (Tailwind classes)
```html
<!-- Primary -->
<element class="bg-primary text-white hover:bg-primary-light" />

<!-- Backgrounds -->
<element class="bg-base bg-surface bg-elevated" />

<!-- Text -->
<element class="text-white text-white/60 text-white/40 text-primary" />

<!-- Borders -->
<element class="border-white/5 border-white/10 border-white/15" />

<!-- Status -->
<element class="bg-turn-waiting text-turn-waiting" />
```

### Animations
```html
<element class="animate-fade-in animate-slide-up animate-pulse-glow animate-shimmer" />
<element class="animate-turn-flip" />
```

### Glass
```html
<element class="glass glass-hover" />
```

---

*Documento vivo — actualizar conforme evoluciona el diseño*
* Última actualización: Mayo 2026