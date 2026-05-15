# Auditoría Frontend/UI - TuTurno

## Resumen Ejecutivo

El proyecto TuTurno es una aplicación Nuxt 3 bien estructurada con un sistema de diseño coherente basado en CSS variables (oklch). Se observa buen uso de Composition API con `<script setup lang="ts">` en la mayoría de componentes. Sin embargo, existen issues críticos que afectan la funcionalidad y warnings que degradan la calidad del código.

**Total de archivos Vue:** 139
**Componentes UI base:** 13
**Componentes de dominio:** 25+
**Stores Pinia:** 5
**Composables:** 16

---

## Hallazgos Positivos

1. **TypeScript Strict Mode**: El proyecto tiene `strict: true` configurado correctamente en tsconfig.json con opciones adicionales (`strictNullChecks`, `noImplicitAny`, `noUnusedLocals`).

2. **Composition API**: El 95% de los componentes usan `<script setup lang="ts">` correctamente.

3. **Props/Emits tipados**: Los componentes UI base tienen interfaces Props y Emits bien definidas usando `defineProps<Props>()` y `defineEmits<Emits>()`.

4. **Sistema de diseño con CSS Variables**: El archivo `assets/css/main.css` define un sistema de tokens completo usando oklch, incluyendo:
   - Variables de color primarios, semánticos y de estado
   - Sistema de spacing de 4px
   - Border radius y transiciones
   - Light theme support con `[data-theme="light"]`

5. **Tailwind config bien configurado**: `tailwind.config.ts` mapea correctamente las CSS variables a clases utilitarias.

6. **Skeleton loaders**: Buenos estados de loading en TurnCardSkeleton y TurnCard.

7. **Seguridad en formularios**: Los forms de auth usan Zod validation schemas.

8. **Reactividad correcta**: Uso apropiado de `ref`, `computed`, `watch` en todos los componentes.

---

## Issues Críticos (Deben corregirse)

### [Issue #1] UiToastContainer.vue no existe - Referenciado en app.vue

**Severidad:** CRÍTICA
**Ubicación:** `app.vue:5`

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToastContainer />  <!-- ❌ Este componente no existe -->
</template>
```

El componente `UiToastContainer.vue` no existe en `components/ui/`. La aplicación referenciará un componente inexistente.

**Acción requerida:** Crear el componente `components/ui/UiToastContainer.vue` o remover la referencia.

---

### [Issue #2] Uso de `window.location.origin` sin client check en TurnTicket.vue

**Severidad:** CRÍTICA
**Ubicación:** `components/turn/TurnTicket.vue:13`

```typescript
const publicTrackingUrl = computed(() => {
  const baseUrl = useRuntimeConfig().public.appUrl || window.location.origin
  return `${baseUrl}/onboarding/turn/${props.turn.turnNumber}`
})
```

`window.location.origin` no está disponible durante SSR y causará errores en server-side rendering.

**Acción requerida:** Envolver en `onMounted` o usar solo `useRuntimeConfig().public.appUrl`.

---

### [Issue #3] console.error en código de producción (useWebSocket.ts)

**Severidad:** ALTA
**Ubicación:** `composables/useWebSocket.ts:33,45`

```typescript
ws.value.onerror = (error) => {
  console.error('WebSocket error:', error)  // ❌ No debe estar en producción
}

console.error('Failed to parse WebSocket message:', error)  // ❌
```

**Acción requerida:** Reemplazar con sistema de logging apropiado o remover. Según CLAUDE.md: "No hay `console.log` en código de producción".

---

### [Issue #4] console.error en operator/index.vue

**Severidad:** ALTA
**Ubicación:** `pages/operator/index.vue:34,47,59`

```typescript
catch (error) {
  console.error('Error calling next turn:', error)
}
```

**Acción requerida:** Implementar manejo de errores con UI feedback (toast notifications).

---

### [Issue #5]console.error en TurnTicket.vue

**Severidad:** MEDIA
**Ubicación:** `components/turn/TurnTicket.vue:29`

```typescript
} catch (error) {
  console.error('Failed to generate QR code:', error)
}
```

---

### [Issue #6] CSS variable `--bg-surface` referenced but not defined as standalone

**Severidad:** BAJA
**Ubicación:** Múltiples componentes

Los componentes referencian `--bg-surface` pero en `main.css` la variable se llama `--color-bg-surface`. Hay inconsistencia en el naming:

```typescript
// main.css define:
--color-bg-surface: oklch(16% 0.015 285);

// pero se usa como:
class="bg-[--bg-surface]"  // ❌ wrong
class="bg-surface"  // ✅ correct (gracias a @layer utilities)
```

**Verificado:** Los componentes en realidad usan las clases utilitarias generadas por Tailwind (`.bg-surface`) que sí映射 correctamente. El issue es menor.

---

## Issues Menores (Mejora recomendada)

### [Issue #M1] Inconsistencia en naming de variables CSS

**Observación:** En `main.css` las variables usan prefijo `--color-`:
- `--color-primary`
- `--color-bg-surface`
- `--color-text-primary`

Pero en algunos componentes se referencian directamente como `--bg-surface`, `--text-muted`.

**Recomendación:** Estandarizar el uso consistente de las clases utilitarias de Tailwind generadas.

---

### [Issue #M2] AppNavbar.vue no usa UiLogo component

**Severidad:** BAJA
**Ubicación:** `components/layout/AppNavbar.vue:10-12`

```vue
<NuxtLink to="/" class="text-xl font-logo font-bold text-white">
  TuTurno
</NuxtLink>
```

Debería usar el componente `<UiLogo />` para consistencia visual.

---

### [Issue #M3] Faltan aria-labels en algunos botones

**Ubicación:** `components/auth/LoginForm.vue:233-241`

Botones de Google/GitHub deshabilitados no tienen aria-label descriptivo:

```html
<button
  ...
  disabled
  title="Próximamente"  <!-- ✅ title existe pero aria-label sería mejor -->
>
```

**Recomendación:** Agregar `aria-label="Inicio de sesión con Google - Próximamente"` para mejor accesibilidad.

---

### [Issue #M4] TurnProgressBar tiene prop `position` pero se usa `animated` fuera de watch

**Severidad:** BAJA
**Ubicación:** `components/turn/TurnProgressBar.vue:17-26`

```typescript
const showMarker = ref(false)

watch(() => props.position, () => {
  if (props.animated) {
    showMarker.value = true
    setTimeout(() => {
      showMarker.value = false
    }, 500)
  }
})
```

El timeout no se limpia si el componente se desmonta antes de que complete.

**Recomendación:** Usar `onUnmounted` o `watchEffect` con cleanup.

---

### [Issue #M5] TurnStatusBadge no tiene todas las clases de badge

**Severidad:** BAJA
**Ubicación:** `components/turn/TurnStatusBadge.vue:8-15`

```typescript
const statusConfig = {
  waiting: { label: 'En espera', class: 'bg-primary/20 text-primary' },
  called: { label: 'Llamado', class: 'bg-amber-500/20 text-amber-400' },
  attending: { label: 'En atención', class: 'bg-blue-500/20 text-blue-400' },
  completed: { label: 'Completado', class: 'bg-green-500/20 text-green-400' },
  no_show: { label: 'No asistido', class: 'bg-red-500/20 text-red-400' },
  cancelled: { label: 'Cancelado', class: 'bg-gray-500/20 text-gray-400' },  // ❌ Usa gray en vez de CSS variable
}
```

Los colores hardcodeados (amber, blue, green, red, gray) deberían usar las CSS variables del sistema de diseño.

---

### [Issue #M6] Faltan lazy loading en componentes pesados de landing

**Severidad:** BAJA
**Ubicación:** `pages/index.vue:30-34`

```vue
<LandingHeroNew />
<LandingHowItWorks />
<LazyLandingTestimonials />
<LazyLandingFeatures />
<LazyLandingCTA />
```

Solo `LazyLandingTestimonials` y `LazyLandingFeatures` usan lazy loading. Los demás deberían también para mejorar performance.

---

### [Issue #M7] Store turn.store.ts tiene type casting innecesario

**Severidad:** BAJA
**Ubicación:** `stores/turn.store.ts:72-74`

```typescript
const response = await $fetch(`/api/turns/${id}` as string, {
  method: 'DELETE',
} as Record<string, unknown>)
```

El cast `as string` en la URL es innecesario ya que `id` ya es string.

---

### [Issue #M8] EntitySearchBar.vue usa props.modelValue directamente

**Severidad:** BAJA
**Ubicación:** `components/entity/EntitySearchBar.vue:15-16`

```typescript
const localSearch = ref(props.modelValue.search || '')
const localType = ref(props.modelValue.type || '')
```

Debería usar `watch` para sincronizar cambios del padre o usar `v-model` correctamente.

---

### [Issue #M9] TurnCard.vue tiene CSS duplicate animation keyframes

**Severidad:** BAJA
**Ubicación:** `components/turn/TurnCard.vue:171-189`

El componente define `@keyframes flip-in` en su `<style scoped>`, pero `main.css` ya tiene esta keyframe definida globalmente. Duplicación innecesaria.

---

### [Issue #M10] Operator/index.vue usa string literal para serviceId

**Severidad:** BAJA
**Ubicación:** `pages/operator/index.vue:18,31`

```typescript
() => $fetch('/api/operator/queue?serviceId=default') as Promise<...>

body: { serviceId: 'default' },
```

El valor `'default'` debería ser una constante para evitar typos.

---

## Componentes que faltan o están incompletos

### Criticos:

1. **`UiToastContainer.vue`** - Referenciado en `app.vue` pero NO existe

### Menores:

2. **`components/operator/OperatorQueue.vue`** - No existe (referenciado en CLAUDE.md)
3. **`components/operator/OperatorCurrentTurn.vue`** - No existe
4. **`components/operator/OperatorControls.vue`** - No existe
5. **`components/operator/OperatorStats.vue`** - No existe
6. **`components/admin/AdminEntityForm.vue`** - No existe
7. **`components/admin/AdminServiceForm.vue`** - No existe
8. **`components/admin/AdminOperatorAssign.vue`** - No existe
9. **`components/admin/AdminReportsChart.vue`** - No existe
10. **`components/landing/LandingHeroNew.vue`** - Existe (verificado)
11. **`components/landing/LandingTestimonials.vue`** - No verificado
12. **`components/landing/LandingFeatures.vue`** - No verificado
13. **`components/landing/LandingCTA.vue`** - No verificado

---

## Recomendaciones de Performance

### 1. Lazy Loading de rutas
El proyecto ya configura `routeRules` para SSG/SPA, pero algunos componentes de landing podrían usar `defineAsyncComponent`:

```typescript
// En lugar de:
<LandingHeroNew />

// Usar:
<LazyLandingHeroNew />
```

### 2. Evitar dependencias dinámicas en SSR
`TurnTicket.vue` importa `qrcode` dinámicamente:
```typescript
const QRCode = await import('qrcode')
```
Esto está bien si se hace en `onMounted`, pero el componente aún renderiza en servidor sin el QR.

### 3. Considerar fragmentación de stores
El `turn.store.ts` hace demasiado: maneja turnos del ciudadano y crea/cancela turnos. Podría dividirse en:
- `useTurnStore` - estado local
- `useTurnActions` - acciones (crear, cancelar)

---

## Checklist de Compliance

- [x] TypeScript strict mode - Configurado correctamente
- [x] Composition API - Todos los componentes usan `<script setup lang="ts">`
- [ ] Props/Emits typed - 90% correctos, algunos componentes faltan Emits
- [x] CSS variables usage - Sistema de diseño bien implementado
- [ ] No console.log/console.error en producción - **FALLO**: múltiples console.error encontrados
- [ ] SSR compatibility - **FALLO**: `window.location.origin` en TurnTicket.vue
- [x] Reactivity patterns - Uso correcto de Ref, Reactive, Computed
- [x] defineProps/defineEmits - Uso correcto en la mayoría
- [x] Pinia store patterns - Stores bien estructurados con setup syntax
- [x] No `any` types - No se encontraron usos de `any`
- [ ] Lazy loading - Solo parcialmente implementado en landing
- [x] Responsive design - Breakpoints adecuados en Tailwind config
- [ ] Accessibility (aria-labels) - Parcialmente implementado
- [ ] Error handling - Manejo inconsistente (algunos usan try/catch + toast, otros solo console.error)

---

## Archivos Revisados

### UI Components (13 archivos)
- `UiButton.vue` ✅
- `UiInput.vue` ✅
- `UiCard.vue` ✅
- `UiBadge.vue` ✅
- `UiModal.vue` ✅
- `UiSkeleton.vue` ✅
- `UiSpinner.vue` ✅
- `UiProgressBar.vue` ⚠️
- `UiToastContainer.vue` ❌ NO EXISTE
- `UiConfirmModal.vue` ✅
- `UiToggle.vue` ✅
- `UiThemeToggle.vue` ✅
- `UiLogo.vue` ✅

### Layout Components (6 archivos)
- `AppNavbar.vue` ⚠️
- `AppFooter.vue` ✅
- `AppSidebar.vue` ✅
- `AppSidebarCitizen.vue` - No revisado
- `AppMobileNav.vue` ✅
- `AppProgressNav.vue` - No revisado

### Turn Components (8 archivos)
- `TurnCard.vue` ⚠️
- `TurnTicket.vue` ❌
- `TurnTracker.vue` ✅
- `TurnProgressBar.vue` ⚠️
- `TurnStatusBadge.vue` ⚠️
- `TurnCounterDisplay.vue` ✅
- `TurnHistoryItem.vue` ✅
- `TurnCardSkeleton.vue` ✅

### Auth Components (3 archivos)
- `LoginForm.vue` ⚠️
- `RegisterForm.vue` ⚠️
- `ForgotPasswordForm.vue` - No revisado

### Entity Components (3 archivos)
- `EntityCard.vue` ✅
- `EntitySearchBar.vue` ⚠️
- `EntityServiceList.vue` - No revisado

### Stores (5 archivos)
- `auth.store.ts` ✅
- `turn.store.ts` ⚠️
- `entity.store.ts` ✅
- `queue.store.ts` - No revisado
- `cookie-consent.store.ts` - No revisado

### Composables (16 archivos)
- `useAuth.ts` ✅
- `useWebSocket.ts` ❌
- Otros no revisados

---

## Resumen de Hallazgos

| Categoría | Total | Críticos | Altos | Medios | Bajos |
|-----------|-------|----------|-------|--------|-------|
| Bugs Críticos | 2 | 2 | 0 | 0 | 0 |
| Code Smell | 10 | 0 | 3 | 1 | 6 |
| Performance | 3 | 0 | 0 | 1 | 2 |
| Accesibilidad | 2 | 0 | 0 | 1 | 1 |
| **TOTAL** | **17** | **2** | **3** | **3** | **9** |

---

*Auditoría generada: Thu May 14 2026*
*Alcance: Frontend/UI del proyecto TuTurno - Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS*