# Sistema de Diseño — TuTurno

> **Base:** Sistema de diseño basado en tokens CSS con glassmorphism. El tema usa CSS custom properties para mantener consistencia y permitir theming futuro.

---

## 1. Paleta de Colores

### Colores Primarios

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| Primary | `#6C3AE8` | 108, 58, 232 | Botones principales, estados activos, CTAs |
| Primary Light | `#A78BFA` | 167, 139, 250 | Hover states, acentos, borders |
| Primary Dark | `#4C1D95` | 76, 29, 149 | Sombras, elementos presionados |
| Accent | `#818CF8` | 129, 140, 248 | Links, elementos destacados secundarios |

### Fondos (Dark Mode Base)

| Nombre | Hex | Uso |
|--------|-----|-----|
| Base | `#0D0D14` | Fondo principal de la app |
| Surface | `#13131F` | Cards, componentes elevados |
| Elevated | `#1A1A2E` | Overlays, tooltips, dropdowns, modals |
| Overlay | `#1F1F35` | Backdrops de modales, sidebars |

### Texto

| Nombre | Hex | Ratio contraste WCAG | Uso |
|--------|-----|---------------------|-----|
| Primary | `#FFFFFF` | 21:1 (AAA) | Texto principal sobre fondo oscuro |
| Secondary | `#A1A1AA` | 7:1 (AAA) | Texto secundario, labels, subtitles |
| Muted | `#52525B` | 3:1 (AA Large) | Placeholder, texto decorativo (no para contenido legible) |
| Accent | `#A78BFA` | — | Links, highlights, badges |

> **Accesibilidad:** Verificar que todo texto tenga ratio de contraste mínimo 4.5:1 para contenido normal, 3:1 para texto grande (18px+ o 14px bold+).

### Estados de Turno

| Estado | Hex | RGB | Badge Color | Descripción |
|--------|-----|-----|-------------|-------------|
| Waiting | `#6C3AE8` | 108, 58, 232 | violeta | Turnos en cola esperando |
| Called | `#F59E0B` | 245, 158, 11 | ámbar | Turno siendo llamado por operador |
| Attending | `#3B82F6` | 59, 130, 246 | azul | Turno en atención actualmente |
| Completed | `#10B981` | 16, 185, 129 | verde | Turno completado exitosamente |
| No Show | `#EF4444` | 239, 68, 68 | rojo | Ciudadano no se presentó |
| Cancelled | `#6B7280` | 107, 114, 128 | gris | Turno cancelado por el ciudadano |

---

## 2. Tipografía

### Fuentes

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&display=swap')
```

| Familia | Uso | weights | Font Stack |
|---------|-----|---------|------------|
| Geist | Títulos, display, números de turno, headings | 400, 500, 600, 700 | `'Geist', system-ui, sans-serif` |
| DM Sans | Cuerpo de texto, labels, inputs, paragraphs | 400, 500, 600, 700 | `'DM Sans', system-ui, sans-serif` |
| Geist Mono | Código, timestamps, debug info | 400, 500 | `'Geist Mono', 'SF Mono', monospace` |

### Escala Tipográfica

| Token | Tamaño | Line Height | Uso |
|-------|--------|-------------|-----|
| `text-xs` | 12px | 16px (1.33) | Labels pequeños, timestamps, helper text |
| `text-sm` | 14px | 20px (1.43) | Texto secundario, captions |
| `text-base` | 16px | 24px (1.5) | Cuerpo de texto principal |
| `text-lg` | 18px | 28px (1.56) | Subtítulos, labels destacados |
| `text-xl` | 20px | 28px (1.4) | Títulos de sección, h3 |
| `text-2xl` | 24px | 32px (1.33) | Títulos de página, h2 |
| `text-3xl` | 30px | 38px (1.27) | Headlines grandes, h1 |
| `text-4xl` | 36px | 44px (1.22) | Display en hero, números grandes |
| `text-5xl` | 48px | 56px (1.17) | Números de turno (TurnCounterDisplay) |

---

## 3. Espaciado

### Sistema de 4px

| Token | px | rem | Uso |
|-------|-----|-----|-----|
| `space-1` | 4px | 0.25rem | Separación mínima, gaps inline |
| `space-2` | 8px | 0.5rem | Entre elementos relacionados |
| `space-3` | 12px | 0.75rem | Padding interno pequeño |
| `space-4` | 16px | 1rem | Padding base, gaps entre componentes |
| `space-5` | 20px | 1.25rem | Separación entre secciones related |
| `space-6` | 24px | 1.5rem | Separación entre secciones |
| `space-8` | 32px | 2rem | Márgenes grandes, secciones |
| `space-10` | 40px | 2.5rem | Containers grandes |
| `space-12` | 48px | 3rem | Separación entre secciones mayores |
| `space-16` | 64px | 4rem | Márgenes de página, hero spacing |

---

## 4. Bordes y Radios

### Radios (Border Radius)

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Botones pequeños, inputs, badges pequeños |
| `radius-md` | 8px | Botones, inputs, small cards |
| `radius-lg` | 12px | Cards, modales, dropdowns |
| `radius-xl` | 16px | Modales grandes, containers |
| `radius-2xl` | 24px | Paneles, secciones especiales |
| `radius-full` | 9999px | Pills, avatares circulares, toggles |

### Bordes

```css
--border-default: 1px solid rgba(255, 255, 255, 0.10);
--border-hover: 1px solid rgba(255, 255, 255, 0.20);
--border-focus: 2px solid var(--color-primary);
```

---

## 5. Sombras y Efectos

### Glassmorphism (Clase Principal)

```css
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow:
    0 8px 32px rgba(108, 58, 232, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-hover {
  transition:
    background 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}
.glass-hover:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow:
    0 8px 40px rgba(108, 58, 232, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
  transform: translateY(-2px);
}
```

### Glow para Estados Activos

```css
.glow-active {
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow:
      0 0 20px rgba(108, 58, 232, 0.4),
      0 0 40px rgba(108, 58, 232, 0.2);
  }
  50% {
    box-shadow:
      0 0 40px rgba(108, 58, 232, 0.8),
      0 0 60px rgba(108, 58, 232, 0.4);
  }
}
```

### Sombras Discretas

| Clase | Valor | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)` | Elementos sutiles |
| `shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.4)` | Cards, elementos elevados |
| `shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.5)` | Modales, dropdowns |
| `shadow-glow` | `0 0 20px rgba(108, 58, 232, 0.3)` | Estados activos |

---

## 6. Animaciones

### Keyframes

| Nombre | Descripción | Uso | Duración |
|--------|-------------|-----|----------|
| `flip-in` | Rotación en X de 90° a 0° con opacity | Números de turno (TurnCounterDisplay) | 400ms |
| `slide-up-fade` | Traslada Y de 24px a 0 + fade | Entrada de elementos, stagger animations | 500ms |
| `shimmer` | Brillo que pasa por un elemento | Skeleton loaders | 1.5s |
| `glow-pulse` | Pulsación de glow violeta | Estado activo, "tu turno" | 2s infinite |
| `spin` | Rotación continua 360° | Spinners, loaders | 1s |
| `bounce` | Rebote suave | Notificaciones, toasts | 500ms |
| `fade-in` | Opacity 0 a 1 | Modals, tooltips | 200ms |
| `fade-out` | Opacity 1 a 0 | Modals closing, toasts | 200ms |

### Tiempos de Transición (Timing Functions)

| Token | Valor | Uso |
|-------|-------|-----|
| `transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Hover, estados, micro-interactions |
| `transition-base` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` | Transiciones estándar, toggles |
| `transition-slow` | `400ms cubic-bezier(0.4, 0, 0.2, 1)` | Modales, overlays,panels |
| `transition-bounce` | `500ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Animaciones con spring, notifications |

### Clases de Animación

```html
<!-- Entrada con stagger -->
<div class="animate-enter animate-enter-1">...</div>
<div class="animate-enter animate-enter-2">Delay 80ms</div>
<div class="animate-enter animate-enter-3">Delay 160ms</div>

<!-- Flip para números -->
<div class="turn-flip">047</div>

<!-- Skeleton shimmer -->
<div class="skeleton"></div>
```

### Animaciones CSS (assets/css/animations.css)

```css
/* Flip para números de turno */
@keyframes flip-in {
  0% { transform: rotateX(90deg); opacity: 0; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
.turn-flip {
  animation: flip-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center top;
  backface-visibility: hidden;
}

/* Entrada con stagger */
@keyframes slide-up-fade {
  0% { transform: translateY(24px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-enter {
  animation: slide-up-fade 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
.animate-enter-1 { animation-delay: 0ms; }
.animate-enter-2 { animation-delay: 80ms; }
.animate-enter-3 { animation-delay: 160ms; }
.animate-enter-4 { animation-delay: 240ms; }

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
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

/* Glow pulsante */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(108, 58, 232, 0.4); }
  50% { box-shadow: 0 0 40px rgba(108, 58, 232, 0.8); }
}
.glow-active { animation: glow-pulse 2s ease-in-out infinite; }
```

---

## 7. Iconografía

**Librería:** [Lucide Vue Next](https://lucide.dev/)

> **Alternativa:** Si `@nuxt/icon` no está disponible, usar `lucide-vue-next` directamente.

| Ícono | Uso | Categoría |
|-------|-----|----------|
| `Search` | Búsqueda, filtros | UI |
| `Ticket` | Turno, ticket | Domain |
| `Clock` | Tiempo espera, horarios | UI |
| `MapPin` | Ubicación, dirección | Domain |
| `Phone` | Contacto, teléfono | UI |
| `User` | Perfil, persona | UI |
| `Users` | Operadores, múltiples usuarios | Domain |
| `BarChart` | Estadísticas, reportes | Admin |
| `Settings` | Configuración | UI |
| `LogOut` | Cerrar sesión | Auth |
| `ChevronRight` | Navegación, breadcrumbs | UI |
| `ChevronDown` | Expandir, dropdown | UI |
| `X` | Cerrar, cancelar | UI |
| `Check` | Completado, success | UI |
| `AlertCircle` | Error, warning | UI |
| `Bell` | Notificaciones | UI |
| `QrCode` | QR, código | Domain |
| `Calendar` | Fecha,日程 | UI |
| `Home` | Inicio | Navigation |
| `ArrowLeft` | Volver, atrás | Navigation |
| `Plus` | Crear, agregar | Actions |
| `Edit` | Editar | Actions |
| `Trash` | Eliminar | Actions |

---

## 8. Estados de Componentes

### Botón Primary

| Estado | Background | Border | Text | Box Shadow |
|--------|------------|--------|------|------------|
| Default | `#6C3AE8` | none | white | none |
| Hover | `#7C4AF8` | none | white | `0 4px 12px rgba(108, 58, 232, 0.3)` |
| Active | `#4C1D95` | none | white | none |
| Disabled | `#6C3AE8` opacity 50% | none | white opacity 50% | none |
| Loading | `#6C3AE8` | none | white + spinner | none |

### Input

| Estado | Border | Background | Text Color |
|--------|--------|------------|------------|
| Default | `rgba(255,255,255,0.10)` | transparent | `#FFFFFF` |
| Focus | `#6C3AE8` | transparent | `#FFFFFF` |
| Error | `#EF4444` | transparent | `#FFFFFF` |
| Disabled | `rgba(255,255,255,0.05)` | transparent | `#A1A1AA` |

> **Focus Ring:** Todos los inputs deben tener `focus-visible:outline` con color primary.

### Card (Glass)

| Estado | Background | Border | Shadow | Transform |
|--------|------------|--------|--------|-----------|
| Default | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.10)` | `0 8px 32px rgba(108,58,232,0.15)` | none |
| Hover | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.15)` | `0 8px 40px rgba(108,58,232,0.25)` | translateY(-2px) |

### Badge Variants

| Variant | Background | Text Color | Border |
|---------|------------|------------|--------|
| default | `rgba(255,255,255,0.10)` | `#A1A1AA` | none |
| success | `rgba(16,185,129,0.15)` | `#10B981` | none |
| warning | `rgba(245,158,11,0.15)` | `#F59E0B` | none |
| danger | `rgba(239,68,68,0.15)` | `#EF4444` | none |
| info | `rgba(59,130,246,0.15)` | `#3B82F6` | none |
