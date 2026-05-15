# Auditoría Performance & Optimización - TuTurno

## Resumen Ejecutivo

El proyecto TuTurno presenta una arquitectura sólida con Nuxt 3 y buenas prácticas generales. Se identificaron **3 issues críticos** que afectan el rendimiento, **7 issues menores** y varias oportunidades de optimización. La base es buena pero hay áreas que requieren atención inmediata.

**Puntuación General: 7/10**

---

## Hallazgos Positivos

### Bundle & Configuración
- ✅ Route rules correctamente configurados: Landing pages en prerender, app/operator/admin en SSR false
- ✅ Lazy loading de componentes en `pages/index.vue` (`<LazyLandingTestimonials />`, `<LazyLandingFeatures />`)
- ✅ Tree-shaking habilitado por defecto en Vite
- ✅ CSS custom properties (variables) correctamente usadas para theming
- ✅ Fonts configuradas con `@nuxt/fonts` (google fonts)

### CSS & Animaciones
- ✅ Duplicación de keyframes/animation classes en `main.css` y `animations.css` (glass.css podría eliminarse)
- ✅ `prefers-reduced-motion` respetado en animaciones
- ✅ Skeleton loaders implementados correctamente
- ✅ oklch color space usado correctamente

### JavaScript
- ✅ Composables `useLazyLoad` y `useScrollReveal` con IntersectionObserver
- ✅ WebSocket con exponential backoff para reconexión
- ✅ Computed properties usadas para estado derivado en stores
- ✅ Pinia con setup stores (Composition API style)

### Vue/Reactivity
- ✅ Stores con computed properties para derivados (`activeTurns`, `completedTurns`, `waitingCount`)
- ✅ `useAsyncData` con key para deduplicación en `pages/operator/index.vue`

---

## Issues Críticos

### [Issue #1] Duplicación de CSS y Animaciones (glass.css)

**Severidad:** Alta | **Tipo:** Bundle Size

**Archivo:** `assets/css/glass.css`

El archivo `glass.css` contiene las mismas clases que ya están en `assets/css/main.css` líneas 171-189. Esto duplica ~200 líneas de CSS.

**Impacto:** CSS no minificadoduplicado innecesariamente. El archivo `glass.css` debería eliminarse.

**Solución:** Eliminar `assets/css/glass.css` de `nuxt.config.ts` línea 34.

---

### [Issue #2] Animaciones Duplicadas en Tailwind + CSS Custom

**Severidad:** Alta | **Tipo:** Bundle Size | **Acum:** ~400 líneas duplicadas

**Archivos:**
- `tailwind.config.ts` líneas 67-157 (keyframes)
- `assets/css/animations.css` (todas las animaciones)
- `assets/css/main.css` líneas 452-648 (keyframes duplicados)

Las animaciones están definidas en 3 lugares:
1. `tailwind.config.ts` → usado con clases Tailwind como `animate-flip`
2. `assets/css/animations.css` → clases como `.turn-flip`, `.animate-enter`
3. `assets/css/main.css` → define `@keyframes` y clases `.animate-*`

**Problema:** Los `@keyframes` en `main.css` y `animations.css` son casi idénticos. Las clases Tailwind (`animate-flip`, `animate-float`) también duplican las clases CSS personalizadas (`.turn-flip`, `.animate-float`).

**Impacto:** ~400 líneas de CSS duplicado que incrementa el bundle.

**Solución:** Consolidar en un solo lugar:
- Opción A: Mantener solo Tailwind animations, eliminar archivos CSS personalizados
- Opción B: Mantener solo CSS custom, remover de Tailwind config

---

### [Issue #3] useTurnRealtime tiene Memory Leak Potencial

**Severidad:** Crítica | **Tipo:** Memory Leak

**Archivo:** `composables/useTurnRealtime.ts`

```typescript
// Línea 12: Timeout reference almacenado
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

// Líneas 57-67: scheduleReconnect crea timeout sin limpiar completamente
function scheduleReconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout)  // Solo limpia timeout, no WS
  // ...
}
```

**Problemas:**
1. El `watch` en líneas 120-123 causa disconnect/connect循环 que puede acumular timeouts
2. No hay limpieza del WebSocket en todos los path de desconexión
3. `reconnectTimeout` puede acumular múltiples timeouts si `connect()` falla rápidamente

**Impacto:** Memory leak en componentes que usan este composable. Con el tiempo causa degradación de performance.

**Solución:**
```typescript
watch([turnId, serviceId], (oldVals, newVals) => {
  if (oldVals[0] !== newVals[0] || oldVals[1] !== newVals[1]) {
    disconnect()
    if (turnId.value && serviceId.value) {
      connect()
    }
  }
})
```

---

## Issues Menores

### [Issue #4] WebSocket Doble Implementación

**Severidad:** Media | **Tipo:** Code Duplication

**Archivos:**
- `composables/useWebSocket.ts` (88 líneas)
- `composables/useTurnRealtime.ts` (130 líneas)

Ambas implementan WebSocket con reconexión. `useTurnRealtime` es más específica pero `useWebSocket` es más genérica. Deberían unificarse o `useTurnRealtime` debería usar `useWebSocket`.

**Recomendación:** `useTurnRealtime` debería usar `useWebSocket` internamente.

---

### [Issue #5] No Virtual Scrolling para Listas Largas

**Severidad:** Media | **Tipo:** Runtime Performance

**Archivos:** `pages/operator/index.vue` (línea 101-109)

```vue
<div v-for="(turn, index) in queue" :key="turn.id">
```

Si la cola tiene 100+ turnos, se renderizan 100+ elementos DOM. No hay virtualización.

**Impacto:** En turnos con colas grandes, degrade performance en móviles.

**Recomendación:** Implementar virtual scrolling con `@vueuse/core` o biblioteca dedicada para listas > 50 items.

---

### [Issue #6] NuxtImg Registrado pero No Usado Consistentemente

**Severidad:** Baja | **Tipo:** Assets

**Archivo:** `components/entity/EntityCard.vue`, `pages/app/entities/[id]/index.vue`

`@nuxt/image` está en dependencies y configurado, pero muchas imágenes usan `<img>` raw en lugar de `<NuxtImg>`.

**Impacto:** No se benefician de:
- Lazy loading automático
- Conversión a WebP
- Responsive srcset
- Placeholder blur

**Recomendación:** Reemplazar `<img>` con `<NuxtImg>` en todos los componentes visuales.

---

### [Issue #7] No Font Display Swap en Configuración

**Severidad:** Baja | **Tipo:** CLS (Layout Shift)

**Archivo:** `nuxt.config.ts` líneas 16-23

```typescript
fonts: {
  families: [
    { name: 'Geist', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
    // ...
  ],
}
```

Font display por defecto es `auto`. Para CLS óptimo debería ser `swap`.

**Recomendación:**
```typescript
fonts: {
  families: [
    { name: 'Geist', provider: 'google', weights: [400, 500, 600, 700, 800, 900], display: 'swap' },
  ],
}
```

---

### [Issue #8] Sin will-change en Animaciones Permanentes

**Severidad:** Baja | **Tipo:** GPU Composition

**Archivos:** `assets/css/animations.css` líneas 46-53, 137-144

```css
.glow-active {
  animation: glow-pulse 2s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

Estas animaciones son permanentes (infinite) pero no tienen `will-change: transform` para hintear al navegador.

**Recomendación:** Añadir `will-change: transform` a elementos con animaciones infinitas.

---

### [Issue #9] No HTTP Cache Headers en API Routes

**Severidad:** Media | **Tipo:** Network

**Archivo:** `server/routes/_ws/turns.ts` y otros

Los API endpoints no tienen headers de cache explícitos. Para datos que cambian frecuentemente esto está bien, pero para endpoints de métricas/estáticas deberían tener cache headers.

**Recomendación:** Implementar cache headers en route handlers apropiados.

---

### [Issue #10] useScrollReveal Usa classList.add en Runtime

**Severidad:** Baja | **Tipo:** Reactivity

**Archivo:** `composables/useScrollReveal.ts` línea 18

```typescript
entry.target.classList.add('in-view')
```

Manipula classList directamente en lugar de usar estado reactivo de Vue. Esto绕过 Vue's reactivity system.

**Impacto:** Pequeño - el componente ya no es "Vue-reactive" para esos cambios de clase. Puede causar problemas con SSR.

**Recomendación:** Usar refs o estado reactivo para trackear visibility.

---

## Bundle Analysis

### Imports Potencialmente No Usados

| Paquete | Tamaño Aproximado | Estado |
|---------|-------------------|--------|
| `@vueuse/motion` | ~50KB | En package.json pero no verificado uso |
| `qrcode` | ~25KB | Solo para tickets, verificar lazy load |
| `bcryptjs` | ~100KB | Solo server-side, OK |
| `better-sqlite3` | ~500KB | Solo server-side, OK |

### Vendor Chunk Size
El vendor chunk de Nuxt puede crecer con los módulos. Monitorear con:
```bash
npm run build -- --analyze
```

### Page Component Lazy Loading
✅ Buena implementación en `pages/index.vue`:
- `LandingHeader` - sync (above fold)
- `LandingHeroNew` - sync (above fold)
- `LandingHowItWorks` - sync (above fold)
- `LazyLandingTestimonials` - lazy
- `LazyLandingFeatures` - lazy
- `LazyLandingCTA` - lazy

---

## Runtime Performance

### Computed Properties
✅ Bien implementadas en stores:
- `activeTurns` - filtra turnos activos
- `completedTurns` - filtra turnos completados
- `waitingCount` - computado de queue.length
- `hasQueue` - boolean computado

### Watch Efficiency
⚠️ `pages/operator/index.vue` línea 120-123 en useTurnRealtime:
El watch puede causar reconexión innecesaria si solo uno de los valores cambia.

### Memory Leaks
Ver Issue #3 (crítico).

---

## Network Performance

### WebSocket Message Efficiency
⚠️ **No verificado** si se envían deltas o estado completo.

En `composables/useTurnRealtime.ts` línea 80-87:
```typescript
case WS_EVENTS.QUEUE_UPDATED: {
  if (payload.queue) {
    queueStore.setQueue(payload.queue as Turn[])
  }
```

Si `payload.queue` es el estado completo y no un delta, esto puede causar tráfico innecesario con colas grandes.

**Recomendación:** El server debería enviar solo cambios (deltas) cuando sea posible.

### Request Deduplication
✅ `useAsyncData` con keys fijos en `pages/operator/index.vue` previene requests duplicados.

### Gzip/Brotli Compression
Nuxt/Vercel manejan esto automáticamente. Verificar en deployment.

---

## SSR Performance

### Prerender Configuration
✅ Correcto en `nuxt.config.ts` líneas 63-77:
- Landing page `/` prerender
- Páginas estáticas prerender
- App routes con `ssr: false`

### Hydration Optimization
⚠️ No se usa `useLazyHydration` o técnicas similares.

Las páginas con `ssr: false` cargan como SPA completo, lo cual está bien.

### Critical Path
✅ No recursos bloqueantes detectados.

---

## Recommendations

### Prioridad Alta (Resolver Inmediatamente)

1. **Eliminar `assets/css/glass.css`** - Duplicación con `main.css`
2. **Corregir memory leak en `useTurnRealtime.ts`** - Cleanup de timeouts y WebSocket
3. **Consolidar animaciones CSS** - Eliminar duplicación entre tailwind.config.ts, main.css y animations.css

### Prioridad Media (Resolver en Sprint)

4. **Implementar virtual scrolling** para `pages/operator/index.vue` cuando cola > 20 items
5. **Unificar WebSocket implementations** - `useWebSocket` y `useTurnRealtime`
6. **Añadir font-display: swap** a configuración de fonts

### Prioridad Baja (Tech Debt)

7. **Reemplazar `<img>` con `<NuxtImg>`** en componentes visuales
8. **Añadir `will-change`** a animaciones infinite
9. **Implementar cache headers** en API routes apropiados
10. **Refactorizar `useScrollReveal`** para usar estado reactivo en lugar de classList

---

## Checklist de Implementación

- [ ] Eliminar `assets/css/glass.css` de nuxt.config.ts
- [ ] Fix memory leak en useTurnRealtime.ts
- [ ] Consolidar animaciones CSS (elegir Tailwind o CSS custom, no ambos)
- [ ] Implementar virtual scrolling para cola de operador
- [ ] Unificar useWebSocket y useTurnRealtime
- [ ] Añadir font-display: swap
- [ ] Reemplazar img con NuxtImg donde aplique
- [ ] Añadir will-change a animaciones infinite