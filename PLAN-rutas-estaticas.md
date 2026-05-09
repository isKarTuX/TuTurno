# Plan: Rutas Estáticas de TuTurno

## Contexto

El footer (`LandingFooter.vue`) tiene enlaces a 11 rutas que no existen, causando warnings de Vue Router:

```
/docs           → Documentación técnica
/api-docs       → Documentación de API
/soporte        → Centro de soporte
/faq            → Preguntas frecuentes
/about          → Sobre nosotros (alias: /nosotros ya existe)
/contacto       → Formulario de contacto
/blog           → Blog de noticias
/prensa         → Sala de prensa
/terminos       → Términos de uso
/privacidad     → Política de privacidad
/cookies        → Política de cookies
```

**Estado actual:**
- `/nosotros` → existe como `pages/nosotros.vue`
- `/problema`, `/entidades` → existen

## Arquitectura

Todas las rutas son **estáticas/públicas** con las mismas características:
- Layout: `none` (sin navbar/footer del layout, header/footer manual)
- Rendering: SSG (`routeRules: { '/{docs,api-docs,soporte,faq,contacto,blog,prensa,terminos,privacidad,cookies}': { prerender: true } }`)
- Estilo visual: mismo glassmorphism del proyecto
- Componentes existentes a reutilizar: `LandingHeader`, `LandingFooter`

## Estructura de archivos a crear

```
pages/
├── docs.vue           # Documentación técnica (integraciones, SDK)
/api-docs.vue          # Referencia API REST
├── soporte.vue        # Centro de soporte (guías, tutoriales)
/faq.vue               # FAQ interactivo (acordeón)
/contacto.vue          # Formulario de contacto
├── blog.vue           # Blog/lista de artículos
├── prensa.vue         # Sala de prensa (comunicados, logos)
/terminos.vue          # Términos y condiciones
├── privacidad.vue     # Política de privacidad
└── cookies.vue        # Política de cookies
```

## Componentes a crear

### 1. `components/landing/LandingDocsNav.vue`
Navegación lateral para documentación.
- Estado: sticky en desktop, accordion en mobile
- Props: `sections: NavSection[]`

### 2. `components/landing/LandingFaqItem.vue`
Item de FAQ con acordeón.
- Props: `question: string`, `answer: string`, `isOpen: boolean`
- Emit: `toggle`

### 3. `components/landing/LandingContactForm.vue`
Formulario de contacto con validación Zod.
- Campos: nombre, email, asunto (select), mensaje
- Estados: idle, submitting, success, error

### 4. `components/landing/LandingCookieConsent.vue`
Banner de cookies para todas las páginas (plugin global).
- Aceptar/Aceptar solo esenciales/Rechazar
- Guardar preferencia en localStorage

## Contenido de cada página

### `/docs` - Documentación
- Instalación y configuración
- Integración con widgets
- API del sistema de turnos
- Webhooks disponibles
- SDKs y librerías

### `/api-docs` - API REST
- Autenticación (JWT)
- Endpoints: turnos, entidades, servicios, operadores
- Formato de requests/responses
- Códigos de error
- Rate limiting

### `/soporte` - Centro de Soporte
- Guía de inicio rápido
- Videos tutoriales
- Chat en vivo (placeholder)
- Base de conocimiento
- Reportar bug

### `/faq` - Preguntas Frecuentes
- Categorías: Ciudadanoss, Entidades, Operadores
- Acordeón con ~15 preguntas comunes
- Búsqueda por palabra clave

### `/contacto` - Contacto
- Formulario de contacto
- Datos de contacto directo
- Mapa de ubicación (Montería)
- Redes sociales

### `/blog` - Blog
- Lista de artículos (mock data inicialmente)
- Cards con imagen, título, fecha, excerpt
- Categorías: anuncios, tips, casos de éxito

### `/prensa` - Sala de Prensa
- Comunicados de prensa
- Logo y recursos de marca
- Estadísticas para medios
- Contacto de prensa

### `/terminos` - Términos de Uso
- Aceptación de términos
- Licencia de uso
- Limitaciones de responsabilidad
- Jurisdicción (Colombia)

### `/privacidad` - Política de Privacidad
- Datos recolectados
- Uso de datos
- Protección de datos (Ley 1581 de 2012 - Habeas Data Colombia)
- Cookies

### `/cookies` - Política de Cookies
- Qué son las cookies
- Tipos utilizadas
- Cómo controlarlas
- Cookies de terceros

## Fases de implementación

### Fase 1: Estructura base y componentes compartidos
- [ ] Crear `pages/docs.vue` con estructura básica
- [ ] Crear `pages/api-docs.vue`
- [ ] Crear `pages/soporte.vue`
- [ ] Crear `LandingFaqItem.vue`
- [ ] Crear `pages/faq.vue`

### Fase 2: Páginas de contenido
- [ ] Crear `pages/contacto.vue` con formulario
- [ ] Crear `LandingContactForm.vue`
- [ ] Crear `pages/blog.vue`
- [ ] Crear `pages/prensa.vue`

### Fase 3: Páginas legales
- [ ] Crear `pages/terminos.vue`
- [ ] Crear `pages/privacidad.vue`
- [ ] Crear `pages/cookies.vue`

### Fase 4: Componente CookieConsent y SEO
- [ ] Crear `LandingCookieConsent.vue`
- [ ] Crear plugin para mostrar cookie consent
- [ ] Agregar meta tags SEO a todas las páginas
- [ ] Configurar routeRules para prerender

### Fase 5: Actualizar footer y header
- [ ] Actualizar `LandingFooter.vue` para usar rutas existentes
- [ ] Actualizar `LandingHeader.vue` con enlaces a nuevas rutas (si aplica)

## Diseño visual

Seguir el sistema de diseño existente:
- CSS variables de `assets/css/main.css`
- Glassmorphism con `.glass` y `.glass-hover`
- Tipografía: Geist (display), DM Sans (body)
- Animaciones de scroll reveal existentes
- Colores: primary violet (#6C3AE8), accent, backgrounds oscuros

## Validación

```bash
npm run typecheck
npm run lint
```

Verificar en browser:
- http://localhost:3000/docs
- http://localhost:3000/soporte
- http://localhost:3000/faq
- http://localhost:3000/contacto
- http://localhost:3000/terminos
```