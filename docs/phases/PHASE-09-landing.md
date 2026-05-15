# PHASE-09 — Landing Page

```
Estado: ✅ Completo
Agente responsable: Claude Code - Sesión 9
Depende de: PHASE-01
Tiempo estimado: 90 min
Completado: 2025-01-13
```

---

## 1. Objetivo

Crear una landing page atractiva con información del producto, testimonios (simulados), mockup del tracker en tiempo real y CTAs para registrarse.

---

## 2. Secciones de la Landing

### 1. Hero

**Título:** "Dile adiós a las filas"
**Subtítulo:** "TuTurno te permite solicitar turnos digitales desde tu celular y monitorear tu posición en cola en tiempo real."
**CTA Principal:** "Comenzar ahora" → /auth/register
**CTA Secundario:** "Saber más" → scroll a #como-funciona

**Animación:**
- Fondo con `--gradient-hero` (radial gradient violeta)
- Partículas flotantes (CSS animation, 3-5 elementos)
- Teléfono mockup con TurnTracker visible

### 2. Cómo funciona

**Título:** "En 3 simples pasos"

| Paso | Ícono | Texto |
|------|-------|-------|
| 1. Busca | Search | "Busca la entidad donde necesitas atención" |
| 2. Solicita | Ticket | "Solicita tu turno digital en segundos" |
| 3. Espera | Clock | "Monitorea tu posición desde cualquier dispositivo" |

**Animación:** Cada card entra con stagger animation (slide-up-fade) al hacer scroll

### 3. Para entidades

**Título:** "好处 para tu organización"
**Features:**
- Eliminación de filas físicas
- Dashboard en tiempo real
- Notificaciones push automáticas
- Reportes y métricas
- Integración simple

**CTA:** "Contactar ventas" → (mailto o link placeholder)

### 4. Tiempo real (mockup interactivo)

**Título:** "Siempre sabes cuándo es tu turno"

**Mockup del tracker:**
- Teléfono con TurnTracker mostrando "B-047"
- Posición: 3 de 12
- Tiempo estimado: 15 min
- Animación de glow pulsante

**Video/demo:** (placeholder para futuro video real)

### 5. Métricas

**Números grandes:**
| Métrica | Valor |
|---------|-------|
| Entidades registradas | 50+ |
| Turnos generados | 10,000+ |
| Tiempo promedio de espera reducido | 65% |
| Satisfacción | 4.8/5 |

**Animación:** Contador animado al hacer scroll (count-up effect)

### 6. CTA Final

**Título:** "¿Listo para terminar con las filas?"
**CTA:** "Regístrate gratis" → /auth/register

---

## 3. Componentes

### LandingHero.vue

- Full viewport height
- Background con gradient + particles
- Headline + subheadline centrados
- 2 botones CTA
- Teléfono mockup a la derecha (solo desktop)

### LandingHowItWorks.vue

- Grid de 3 cards
- Íconos de Lucide
- Stagger animation on scroll

### LandingForEntities.vue

- 2 columnas: texto + lista de features
- Imagen placeholder (mockup de dashboard)

### LandingRealTime.vue

- Mockup del TurnTracker
- Animación del número cambiando
- Glow effect

### LandingMetrics.vue

- 4 cards con números grandes
- Counter animation on scroll

### LandingCTA.vue

- Background con gradient
- Headline + CTA button
- Centrado

---

## 4. Animaciones con IntersectionObserver

```typescript
// composables/useIntersectionObserver.ts
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const observe = (el: HTMLElement, onIntersect: () => void) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect()
        observer.unobserve(el)
      }
    }, options)

    observer.observe(el)
    return () => observer.disconnect()
  }

  return { observe }
}

// Uso en componente
const { observe } = useIntersectionObserver({ threshold: 0.3 })

onMounted(() => {
  observe(card.value!, () => {
    card.value!.classList.add('animate-enter')
  })
})
```

---

## 5. Configuración SSG

```typescript
// nuxt.config.ts
routeRules: {
  '/': { prerender: true }
}
```

**Verificación:**
```bash
npm run generate
# Verificar que /index.html existe en .output/public/
```

---

## 6. Meta Tags SEO

```typescript
// app.vue o pages/index.vue
useHead({
  title: 'TuTurno — Sistema de Gestión de Turnos Digitales',
  meta: [
    { name: 'description', content: 'Deja de hacer filas. Solicita turnos digitales y monitorea tu posición en tiempo real con TuTurno.' },
    { property: 'og:title', content: 'TuTurno — Sistema de Gestión de Turnos Digitales' },
    { property: 'og:description', content: 'Deja de hacer filas. Solicita turnos digitales y monitorea tu posición en tiempo real.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://tuturno.co' }
  ]
})
```

---

## 7. Criterios de Éxito

- [ ] Landing carga en < 2s (prerendered)
- [ ] Todas las secciones son visibles con scroll
- [ ] Animaciones stagger funcionan al hacer scroll
- [ ] El mockup del tracker tiene la animación de glow
- [ ] Los contadores animados funcionan
- [ ] SEO meta tags están correctos
- [ ] Responsive en mobile (320px+)
- [ ] Botones CTA funcionan y redirigen a /auth/register
