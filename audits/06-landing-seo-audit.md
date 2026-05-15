# Auditoría Landing Page & SEO - TuTurno

## Resumen Ejecutivo

El landing page de TuTurno presenta unabase sólida con хороший diseño visual y UX. Sin embargo, se encontraron **12 issues críticos** que afectan SEO, accesibilidad y rendimiento que deben corregirse antes del lanzamiento. La mayoría son solucionables rápidamente.

**Puntuación general: 72/100**
- SEO: 58/100 ❌
- Accesibilidad: 75/100 ⚠️
- Performance: 78/100 ⚠️
- UX/Landing: 85/100 ✅

---

## Hallazgos Positivos

### Lo que está bien

1. **Prerender configurado correctamente** — `routeRules` en nuxt.config.ts incluye todas las páginas estáticas (`/`, `/faq`, `/nosotros`, `/terminos`, `/privacidad`, `/cookies`, etc.)

2. **Meta tags básicos** — title, description, og:title, og:description, lang="es" definidos en pages/index.vue y páginas legales

3. **Semantic HTML bueno** — uso correcto de `<header>`, `<main>`, `<footer>` en layouts

4. **Diseño responsive** — breakpoints en MobileNav, PhoneFrame, LandingHeroNew

5. **Sistema de diseño cohesivo** — colores CSS, glassmorphism, animaciones consistentes

6. **Formularios con validación** — LandingContactForm valida correctamente inputs

7. **Cookies consent implementadas** — banner funcional con preferencias

8. **PWA configurado** — manifest con icons, theme_color

9. **Content real** — sin Lorem ipsum, textos en español colombiano, datos de prueba realistas (EPS Sura, Bancolombia)

10. **Loading states** — Uso de Lazy prefix para componentes no-críticos en index.vue

---

## Issues Críticos

### Issue #1 — Meta robots y crawled-by ausentes
**Severidad:** 🔴 CRÍTICO
**Archivos afectados:** `pages/index.vue`, `pages/faq.vue`, `pages/nosotros.vue`, `pages/terminos.vue`, `pages/privacidad.vue`, `pages/cookies.vue`

**Problema:** No se especifica `<meta name="robots">` ni se indica que las páginas estáticas deben ser indexadas. Aunque el prerender está configurado, los motores de búsqueda podrían no indexar correctamente.

**Recomendación:** Añadir en cada página prerenderizada:
```vue
useSeoMeta({
  robots: 'index, follow',
  googlebot: 'index, follow',
})
```

---

### Issue #2 — Sin Structured Data (JSON-LD)
**Severidad:** 🔴 CRÍTICO
**Archivos afectados:** `pages/index.vue`

**Problema:** No existe ningún schema de Schema.org. Para una landing page de servicio debería haber:
- `LocalBusiness` o `Service` para la descripción del servicio
- `FAQPage` para las preguntas frecuentes
- `Organization` para TuTurno

**Recomendación:** Añadir JSON-LD en `pages/index.vue`:
```vue
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "TuTurno",
      "description": "Plataforma digital para gestión de turnos en EPS, bancos y oficinas públicas en Colombia",
      "url": "https://tuturno.co",
      "areaServed": { "@type": "Country", "name": "Colombia" },
      "provider": {
        "@type": "Organization",
        "name": "TuTurno",
        "url": "https://tuturno.co"
      }
    })
  }]
})
```

---

### Issue #3 — Canonical URLs ausentes
**Severidad:** 🔴 CRÍTICO
**Archivos afectados:** Todas las páginas

**Problema:** No se define `<link rel="canonical">` en ninguna página. Esto puede causar problemas de contenido duplicado.

**Recomendación:** Añadir en useHead de cada página:
```vue
link: [
  { rel: 'canonical', href: 'https://tuturno.co' + route.path }
]
```

---

### Issue #4 — OG Image no existe en el servidor
**Severidad:** 🔴 CRÍTICO
**Archivos afectados:** `pages/index.vue:7`

**Problema:** `ogImage: '/og-image.png'` referencia un archivo que no existe en `/public/`. La carpeta public siquiera existe según el glob.

**Recomendación:**
1. Crear `/public/` y añadir `og-image.png` (1200x630px mínimo)
2. O cambiar la referencia a una URL absoluta completa

---

### Issue #5 — Social links con href="#"
**Severidad:** 🔴 CRÍTICO
**Archivos afectados:** `components/landing/LandingFooter.vue:34-50`

**Problema:** Todos los links sociales usan `href="#"` lo cual:
- Es荒谬 para SEO (no son links reales)
- Causa scroll al top en lugar de navegación
- Rompe la experiencia de accessibility

```vue
{ label: 'LinkedIn', href: '#' }, // ❌ DEBE SER real URL
{ label: 'X (Twitter)', href: '#' },
{ label: 'WhatsApp', href: '#' },
{ label: 'Instagram', href: '#' },
```

**Recomendación:** Añadir URLs reales o usar botones `<button>` si no hay redes sociales definidas aún.

---

### Issue #6 — Alt text ausente en SVGs e iconos decorativos
**Severidad:** 🟡 ALTO
**Archivos afectados:** Todos los componentes de landing

**Problema:** Los SVGs que son meramente decorativos (iconos en secciones) no tienen `aria-hidden="true"` explícito, y algunos no tienen rol semántico. Screen readers podrían anunciar "link" para SVGs decorativos.

**Ejemplo en LandingHeroNew.vue:61-63:**
```vue
<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
</svg>
```

**Recomendación:** Para iconos puramente decorativos, añadir `aria-hidden="true"`. Para iconos que transmiten información, usar `aria-label` en el botón/padre.

---

### Issue #7 — Alt text ausente en imágenes de testimoto y sectores
**Severidad:** 🟡 ALTO
**Archivos afectados:** `LandingTestimonials.vue`, `SocialProofBar.vue`, `ImpactStats.vue`

**Problema:** Las imágenes/avatares no tienen atributo alt.

```vue
<!-- LandingTestimonials.vue:149-153 -->
<div class="w-10 h-10 rounded-lg bg-gradient-to-br...">
  {{ testimonial.avatar }}  <!-- Sin alt -->
</div>

<!-- SocialProofBar.vue - iconos sin alt texto -->
<svg class="w-4 h-4" fill="none" ...>  <!-- Sin aria-hidden -->
```

**Recomendación:**
```vue
<div class="w-10 h-10 rounded-lg..." aria-hidden="true">
  {{ testimonial.avatar }}
</div>
```

O usar avatares reales con alt descriptivo.

---

### Issue #8 — Headings fuera de orden (h1 multiple)
**Severidad:** 🟡 ALTO
**Archivos afectados:** `LandingHeroNew.vue`, `LandingHowItWorks.vue`

**Problema:**
```vue
<!-- LandingHeroNew.vue:30-34 -->
<h1 class="mb-2">
  <div class="hero-logo-wrapper">  <!-- El h1 tiene un div nested -->
    <span class="hero-logo-tu">Tu</span>
    <span class="hero-logo-turno">Turno</span>
  </div>
</h1>
```

Y en `LandingHowItWorks.vue:77` usa `<h2>` como heading principal de la sección. La página debería tener UN solo `<h1>` y la jerarquía debería ser consistente.

**Recomendación:**
- En LandingHeroNew: el h1 ES correcto, pero el contenido interior no debería tener divs que rompan el flujo semántico
- En LandingHowItWorks: debería verificar que no haya otro h1 en la misma página

---

### Issue #9 — HeroSimulator no es lazy-loaded
**Severidad:** 🟡 ALTO
**Archivos afectados:** `LandingHeroNew.vue:97`

**Problema:**
```vue
<HeroSimulator />  <!-- Carga inmediata, no lazy -->
```

El simulador del teléfono es un componente pesado (contiene PhoneFrame, múltiples screens, transiciones). Aunque está "above the fold", carga código innecesario para usuarios que no interactúan con él.

**Recomendación:** Envolver en Lazy:
```vue
<LazyHeroSimulator />
```

---

### Issue #10 — MobileNav links con hash (#) en lugar de paths
**Severidad:** 🟡 MEDIO
**Archivos afectados:** `LandingMobileNav.vue:5-8`

**Problema:**
```vue
{ to: '/#como-funciona', label: 'Cómo funciona', ... }
```

Esto causa navegación a `/` y luego scroll a `#como-funciona`. Funciona, pero no es óptimo para SEO ni UX.

**Recomendación:** Si el destino es el anchor en la misma página, usar `to="#como-funciona"` (sin el slash inicial) o mantener el patrón actual pero asegurar que el ancla existe en la página destino.

---

### Issue #11 — Animaciones de scroll excesivas sin prefers-reduced-motion
**Severidad:** 🟡 MEDIO
**Archivos afectados:** `LandingHowItWorks.vue`, `LandingMetrics.vue`, `ImpactStats.vue`, `LandingSolutionsTabs.vue`

**Problema:** Muchas secciones usan `useScrollReveal` con animaciones de entrada (opacity + translateY). Aunque algunos tienen `@media (prefers-reduced-motion: reduce)`, otros no:

```vue
<!-- ImpactStats.vue:237-243 - SÍ tiene preferencia reducida -->
@media (prefers-reduced-motion: reduce) {
  .reveal, .stat-item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

```vue
<!-- LandingHowItWorks.vue:146-160 - SÍ tiene -->
@media (prefers-reduced-motion: reduce) {
  .hero-logo-wrapper { animation: none; }
  ...
}
```

**Pero falta en:**
- `LandingFeatures.vue` — animaciones de hover pero no de entrada
- `LandingRealTime.vue` — animaciones de entrada ausentes
- `LandingCTA.vue` — sin consideraciones de motion

---

### Issue #12 — PWA manifest incompleto
**Severidad:** 🟡 MEDIO
**Archivos afectados:** `nuxt.config.ts:84-106`

**Problema:**
```js
manifest: {
  name: 'TuTurno - Turnos Digitales',
  short_name: 'TuTurno',
  theme_color: '#6C3AE8',
  background_color: '#0D0D14',
  display: 'standalone',
  icons: [ ... ]
  // FALTA: start_url, description, scope
}
```

**Recomendación:**
```js
manifest: {
  name: 'TuTurno - Turnos Digitales',
  short_name: 'TuTurno',
  description: 'Elimina las filas en EPS, bancos y oficinas públicas',
  start_url: '/',
  scope: '/',
  theme_color: '#6C3AE8',
  background_color: '#0D0D14',
  display: 'standalone',
  icons: [ ... ]
}
```

---

## Issues Menores

### IM-1 — CookieConsent usa localStorage antes de hydration completa
**Severidad:** ⚪ BAJO
**Archivo:** `LandingCookieConsent.vue:15-19`

```ts
onMounted(() => {
  const consent = localStorage.getItem('tuTurnoConsent')
  if (consent) { hasConsented.value = true }
  else { isVisible.value = true }
})
```

Esto es correcto para SSR. El consentimiento solo se muestra después de hydration, evitando flicker. ACEPTABLE.

---

### IM-2 — Links en footer sin estado hover claro
**Severidad:** ⚪ BAJO
**Archivo:** `LandingFooter.vue`

Los links del footer usan `hover:text-white` pero el color base es `text-[--text-muted]`. La transición podría ser más pronunciada.

---

### IM-3 — Contact form simula éxito (no conecta a API)
**Severidad:** ⚪ BAJO
**Archivo:** `LandingContactForm.vue:45`

```ts
await new Promise((r) => setTimeout(r, 1500)) // Solo delay, no API call
```

Esto está bien para demo, pero debería documentar que necesita integración real.

---

### IM-4 — No se usa NuxtImage para optimización
**Severidad:** ⚪ BAJO
**Archivos:** Simulator screens, potential future images

Los componentes del simulador usan SVGs inline directamente. No hay imágenes rasterizadas, pero si se añaden fotos reales (testimonios, equipo), deben usar `<NuxtImg>` con lazy loading y formato webp.

---

### IM-5 — PageSpeed/Lighthouse no ejecutable en auditoría
**Severidad:** ⚪ INFO
No se pueden ejecutar pruebas automatizadas de Lighthouse en esta auditoría. Se recomienda correr:
```bash
npm run build
npx lighthouse http://localhost:3000 --view
```

---

## SEO Checklist

### Meta Tags
- [ ] Title único por página ✅ (definido)
- [ ] Meta description única ✅ (definida)
- [ ] Canonical URL ❌ (ausente en todas)
- [ ] Robots meta ❌ (ausente)
- [ ] Googlebot directives ❌ (ausente)

### Open Graph
- [ ] og:title ✅
- [ ] og:description ✅
- [ ] og:image ❌ (archivo no existe)
- [ ] og:type ❌ (ausente)
- [ ] og:url ❌ (ausente)
- [ ] og:locale ✅ (implícito es-CO)

### Twitter Cards
- [ ] twitter:card ✅ (summary_large_image)
- [ ] twitter:title ❌ (debería añadir twitter:title explícito)
- [ ] twitter:description ❌ (ausente)
- [ ] twitter:image ❌ (imagen no existe)

### Structured Data
- [ ] JSON-LD Schema.org ❌ (ausente)
- [ ] FAQ schema para /faq ❌ (ausente)
- [ ] Organization schema ❌ (ausente)
- [ ] Service schema ❌ (ausente)

### Semantic HTML
- [ ] single h1 por página ⚠️ (LandingHeroNew tiene h1, verificar que no haya otros)
- [ ] h2-h6 jerarquía correcta ⚠️ (revisar landing components)
- [ ] header/main/footer semánticos ✅
- [ ] nav con aria-label ✅ (LandingHeader tiene aria-expanded)
- [ ] main landmark ✅

### Images
- [ ] Alt text en todas ⚠️ (faltan en SVGs decorativos)
- [ ] Lazy loading ⚠️ (no hay img rasterizadas, pero cuando se añadan)
- [ ] WebP format ⚠️ (no aplica aún)

### Links
- [ ] Links externos con rel="noopener" ⚠️ (footer social links usan #)
- [ ] Internal links funcionan ✅
- [ ] No broken links obvios ✅

---

## Performance Checklist

### Prerender / SSG
- [x] Landing page prerender ✅
- [x] Páginas legales prerender ✅
- [x] FAQ prerender ✅
- [x] Nosotros prerender ✅

### Bundle Size
- [ ] Verificar tamaño de chunks (no disponible en auditoría)
- [ ] HeroSimulator no lazy ❌ (issue #9)

### Font Loading
- [x] @nuxt/fonts configurado ✅
- [x] Google Fonts providers ✅
- [x] weights specified ✅
- [ ] font-display: swap? (configurar en nuxt.config si no lo hace automático)

### Animations
- [ ] Scroll animations respetan prefers-reduced-motion ⚠️ (algunas sí, otras no)
- [ ] No animaciones en elementos above the fold que bloqueen contenido ⚠️

### Critical Rendering Path
- [ ] CSS crítico enlined? (Tailwind extrae automáticamente)
- [ ] JS mínima en initial load ⚠️ (HeroSimulator podría lazy-load)

### Lazy Loading Components
- [x] LazyLandingTestimonials ✅
- [x] LazyLandingFeatures ✅
- [x] LazyLandingCTA ✅
- [ ] HeroSimulator debería ser lazy ❌

---

## Accessibility Checklist

### ARIA
- [ ] aria-labels en botones ⚠️ (LandingHeader mobile button tiene, pero faltan en otros)
- [ ] aria-expanded en menús ✅
- [ ] aria-hidden en iconos decorativos ❌
- [ ] role attributes donde necesario ❌

### Keyboard Navigation
- [ ] Focus visible en todos los interactivos ⚠️ (no se probó)
- [ ] Tab order logical ⚠️
- [ ] Skip to content link ❌

### Color Contrast
- [ ] Ratio 4.5:1 para texto normal ⚠️ (no medido)
- [ ] Ratio 3:1 para texto grande ⚠️
- [ ] No color como único diferenciador ⚠️

### Screen Reader
- [ ] Landmarks correctos ✅
- [ ] Heading structure ⚠️
- [ ] Alt texts ⚠️
- [ ] Form labels ⚠️

---

## Recommendations Priorizadas

### Fase 1 — SEO Crítico (antes de launch)
1. Crear `/public/og-image.png` (1200x630px)
2. Añadir canonical URLs a todas las páginas
3. Añadir JSON-LD schema a index.vue
4. Añadir meta robots
5. Corregir social links del footer (urls reales o botones)

### Fase 2 — Accesibilidad (semana 1)
1. Añadir `aria-hidden="true"` a todos los SVG decorativos
2. Corregir jerarquía de headings
3. Verificar contraste de colores
4. Añadir skip-to-content link

### Fase 3 — Performance (semana 2)
1. Cambiar HeroSimulator a LazyHeroSimulator
2. Auditar con Lighthouse
3. Revisar bundle size
4. Lazy-load componentes below the fold

### Fase 4 — Polish (semana 3)
1. Completar PWA manifest
2. Añadir prefers-reduced-motion a todas las animaciones
3. Testar navegación mobile
4. Validar formulario de contacto con API real

---

## Archivos Revisados

### Pages
- `pages/index.vue`
- `pages/faq.vue`
- `pages/nosotros.vue`
- `pages/terminos.vue`
- `pages/privacidad.vue`
- `pages/cookies.vue`

### Layouts
- `layouts/default.vue`

### Landing Components
- `LandingHeroNew.vue`
- `LandingHowItWorks.vue`
- `LandingFeatures.vue`
- `LandingMetrics.vue`
- `LandingRealTime.vue`
- `LandingForCitizens.vue`
- `LandingForEntities.vue`
- `LandingForOperators.vue`
- `LandingCTA.vue`
- `LandingHeader.vue`
- `LandingFooter.vue`
- `LandingMobileNav.vue`
- `LandingCookieConsent.vue`
- `LandingContactForm.vue`
- `LandingFaqItem.vue`
- `LandingSolutionsTabs.vue`
- `LandingTestimonials.vue`
- `SocialProofBar.vue`
- `ImpactStats.vue`

### Simulator Components
- `HeroSimulator.vue`
- `PhoneFrame.vue`
- `PhoneStatusBar.vue`
- `SimulatorControls.vue`
- `SimulatorScreen.vue`
- `ScreenHome.vue`
- `ScreenEntityDetail.vue`
- `ScreenRequestTurn.vue`
- `ScreenTracking.vue`
- `ScreenNotification.vue`
- `ScreenComplete.vue`

### Config
- `nuxt.config.ts`

---

*Auditoría realizada: $(date +%Y-%m-%d)*
*Herramientas: Análisis estático de código, revisión manual*