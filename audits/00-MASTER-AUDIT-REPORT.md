# 🔍 AUDITORÍA COMPLETA TuTurno - Reporte Maestro

> **Fecha:** Mayo 2026
> **Auditoría:** Múltiples agentes especializados
> **Alcance:** Frontend, Backend, Base de Datos, WebSockets, Auth, Landing, Performance

---

## 📊 Resumen Ejecutivo

| Módulo | Puntuación | Estado | Issues Críticos |
|--------|-----------|--------|-----------------|
| Frontend/UI | 75/100 | ⚠️ Requiere atención | 2 |
| Backend/API | 60/100 | 🔴 Crítico | 12 |
| Base de Datos | 70/100 | ⚠️ Requiere atención | 5 (SQLite local) |
| WebSockets/RealTime | 40/100 | 🔴 Crítico | 6 |
| Auth/Security | 70/100 | ⚠️ Requiere atención | 2 |
| Landing/SEO | 72/100 | ⚠️ Requiere atención | 5 |
| Performance | 65/100 | ⚠️ Requiere atención | 3 |

**Puntuación General: 62/100** - El proyecto funciona pero tiene Issues críticos que deben resolverse antes de producción/escalamiento.

---

## 🚨 PRIORIDAD 1: Issues Críticos (Deben resolverse INMEDIATAMENTE)

### 1. [CRÍTICO] WebSockets Desconectados del Flujo Principal
**Archivo:** `server/routes/_ws/turns.ts`, `server/api/operator/*.ts`
**Severidad:** 🔴 Crítica
**Descripción:** Cuando el operador llama un turno via REST API, NO se envía mensaje WebSocket a los ciudadanos. El broadcast nunca ocurre.

```typescript
// ACTUAL: El flujo se corta aquí
// server/api/operator/call-next.post.ts
await db.update(turns).set({ status: 'called' }).where(...)
// FIN - No hay broadcast WS
```

**Solución requerida:**
- Integrar `broadcastToService()` en `server/api/operator/call-next.post.ts`
- Integrar `broadcastToUser()` en todos los endpoints que modifican estado de turno
- O mejor: crear un servicio de eventos centralizado

### 2. [CRÍTICO] Autorización Operador→Servicio Faltante
**Archivos:** `server/api/operator/*.ts`
**Severidad:** 🔴 Crítica
**Descripción:** Cualquier operador puede manipular turnos de CUALQUIER servicio. No hay verificación de que el operador está asignado al servicio.

```typescript
// PROBLEMA: No hay verificación
export default defineEventHandler(async (event) => {
  const operator = await requireAuth(event) // Solo verifica login
  const body = await readBody(event)
  // Falta: verificar que operator.serviceId === body.serviceId
})
```

### 3. [CRÍTICO] Schema SQLite - Correcciones Requeridas (NO Supabase)
**Archivos:** `server/db/schema/*.ts`
**Severidad:** 🔴 Crítica (contexto SQLite local)
**Descripción:** El proyecto mantiene SQLite local. Issues identificados en schema:

**Hallazgos DB:**
- 5 tablas sin columna `updatedAt` (entities, services, operators, turns)
- `citizenId` en turns es nullable (debe ser NOT NULL)
- Sin relaciones Drizzle (`relations()`) - opcional para SQLite

**Decisión:** Mantener SQLite local, NO desplegar a Supabase por ahora.

**Solución requerida:**
- Agregar `updatedAt` a entities, services, operators, turns
- Hacer `citizenId` NOT NULL
- Las relaciones Drizzle son opcionales para SQLite

### 4. [CRÍTICO] Rate Limiting en Memoria
**Archivo:** `server/utils/rate-limit.utils.ts`
**Severidad:** 🔴 Crítica
**Descripción:** El rate limiter usa `Map` en memoria. En deploy con múltiples instancias, el rate limit es ineficaz (cada instancia tiene su propio Map).

```typescript
// PROBLEMA: No escala horizontalmente
const attempts = new Map<string, { count: number; resetAt: number }>()
```

### 5. [CRÍTICO] JWT Secret con Fallback Inseguro
**Archivos:** `server/utils/jwt.utils.ts`, `.env.example`
**Severidad:** 🔴 Crítica
**Descripción:** Si `JWT_SECRET` no está configurado, usa un valor hardcodeado que está en el código fuente.

```typescript
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-min-32-chars-change-this')
```

### 6. [CRÍTICO] Security Headers No Configurados
**Archivo:** `nuxt.config.ts`
**Severidad:** 🔴 Crítica
**Descripción:** No se configuran headers de seguridad HTTP en nitro.

**Faltan:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

---

## 🚨 PRIORIDAD 2: Issues Altos

### 7. [ALTO] Componente UiToastContainer No Existe
**Archivo:** `app.vue:5`
**Severidad:** ⚠️ Alta
```vue
<UiToastContainer /> <!-- Referencia componente que no existe -->
```

### 8. [ALTO] window.location.origin Sin Client Check
**Archivo:** `components/turn/TurnTicket.vue:13`
**Severidad:** ⚠️ Alta
```typescript
const baseUrl = window.location.origin // Rompe SSR
```
**Solución:** Usar `useRequestURL()` o `useRuntimeConfig()`.

### 9. [ALTO] ws.utils.ts Definido Pero Nunca Usado
**Archivos:** `server/utils/ws.utils.ts`
**Severidad:** ⚠️ Alta
Las funciones `broadcastToService` y `broadcastToUser` están definidas pero nunca son llamadas desde ningún endpoint.

### 10. [ALTO] TuTurno Schema Desconectado de Supabase
**Severidad:** ⚠️ Alta
**Descripción:** El schema de TuTurno nunca se desplegó. Supabase "CampoApp" tiene un schema diferente (agrícola).

---

## 🚨 PRIORIDAD 3: Issues Medios

### 11. [MEDIO] 3 Clientes WebSocket Duplicados
**Archivos:** `plugins/ws.client.ts`, `composables/useWebSocket.ts`, `composables/useTurnRealtime.ts`
**Severidad:** ⚠️ Media
Descripción: 3 implementaciones diferentes de WebSocket que pueden causar race conditions en queueStore.

### 12. [MEDIO] YOUR_TURN_SOON No Enviado por WS
**Archivo:** `server/routes/_ws/turns.ts`
**Severidad:** ⚠️ Media
Solo se envía como push notification, no como mensaje WebSocket al ciudadano.

### 13. [MEDIO] CSS Duplicado
**Archivos:** `assets/css/glass.css`, `assets/css/main.css`
**Severidad:** ⚠️ Media
Glassmorphism definido dos veces. Duplicación de ~50+ líneas.

### 14. [MEDIO] Keyframes Duplicados
**Archivos:** `tailwind.config.ts`, `main.css`, `animations.css`
**Severidad:** ⚠️ Media
~400 líneas de keyframes duplicados en 3 lugares.

### 15. [MEDIO] Sin JSON-LD Schema
**Archivo:** `pages/index.vue`
**Severidad:** ⚠️ Media
No hay structured data para SEO.

---

## ℹ️ PRIORIDAD 4: Issues Menores

| # | Issue | Archivo | Tipo |
|---|-------|---------|------|
| 1 | console.error en producción | Múltiples | Code Quality |
| 2 | Social links con href="#" | LandingHeroNew.vue | UX |
| 3 | OG image no existe | nuxt.config.ts | SEO |
| 4 | Sin canonical URLs | pages/*.vue | SEO |
| 5 | No virtual scrolling | pages/operator/index.vue | Performance |
| 6 | NuxtImg no usado consistentemente | components/* | Performance |
| 7 | useScrollReveal usa classList directamente | composables/useScrollReveal.ts | Anti-pattern |
| 8 | Memory leak en useTurnRealtime.ts | composables/useTurnRealtime.ts | Memory |
| 9 | close() handler con wildcards inválidos | server/routes/_ws/turns.ts | WS Bug |
| 10 | Sin auth en WebSocket | server/routes/_ws/turns.ts | Security |

---

## ✅ HALLAZGOS POSITIVOS

### Lo que está bien implementado:

1. **TypeScript Strict Mode** ✅
   - Sin uso de `any` types
   - Props/Emits correctamente tipados

2. **Composition API** ✅
   - Todo el código usa `<script setup lang="ts">`
   - No hay Options API

3. **Sistema de Diseño** ✅
   - CSS variables para colores (no hardcoded)
   - Glassmorphism base implementado
   - Tokens de diseño centralizados

4. **Auth JWT** ✅
   - HS256 con whitelist (previene algorithm confusion)
   - Tokens en cookies httpOnly + secure + sameSite
   - Refresh token rotation implementado
   - bcrypt 12 rondas
   - Rate limiting 5/min en login/register

5. **Route Rules** ✅
   - Prerender para páginas estáticas
   - ssr:false para rutas de app/operator/admin

6. **WebSocket Reconnection** ✅
   - Exponential backoff implementado
   - Reconexión automática

7. **Lazy Loading** ✅
   - Componentes pesados con defineAsyncComponent
   - Buena separación de chunks

---

## 📋 CHECKLIST DE COMPLIANCE

### TypeScript
- [x] strict: true en tsconfig
- [ ] No console.log en producción (hay console.error)
- [x] Props/Emits tipados
- [ ] No any types (verificado limpio)

### Vue 3
- [x] Composition API
- [x] <script setup lang="ts">
- [ ] SSR-safe (window/document checks)
- [ ] Error boundaries

### Supabase/DB (SQLite Local)
- [x] Schema local completo
- [ ] `updatedAt` en todas las tablas (falta en 4 tablas)
- [ ] `citizenId` NOT NULL en turns
- [ ] Relaciones Drizzle (opcional para SQLite)
- [ ] Switch SQLite→Postgres preparado para futuro

### Security
- [x] JWT HS256
- [ ] Security headers
- [x] httpOnly cookies
- [ ] Rate limiting (en memoria, no escala)
- [ ] JWT secret sin fallback

### Performance
- [ ] Bundle size auditado
- [ ] CSS purgado
- [ ] Images optimizadas (NuxtImg)
- [ ] Virtual scrolling para listas largas

---

## 🎯 PLAN DE ACCIÓN PRIORIZADO

### Fase 1: Criticos (Semana 1)
1. ⬜ Integrar WebSocket broadcast en operator API
2. ⬜ Agregar verificación autorización operador→servicio
3. ⬜ Corregir schema SQLite: agregar `updatedAt` a 4 tablas
4. ⬜ Hacer `citizenId` NOT NULL en turns
5. ⬜ Configurar security headers
6. ⬜ Remover fallback JWT_SECRET
7. ⬜ Implementar rate limiting con Redis (o mantener en memoria para SQLite)

### Fase 2: Altos (Semana 2)
1. ⬜ Crear UiToastContainer.vue
2. ⬜ Fix window.location.origin en TurnTicket.vue
3. ⬜ Unificar/clasificar clientes WebSocket
4. ⬜ Desplegar relaciones Drizzle

### Fase 3: Medianos (Semana 3)
1. ⬜ Agregar JSON-LD schema
2. ⬜ Crear OG image
3. ⬜ Canonical URLs
4. ⬜ Eliminar duplicación CSS/keyframes

### Fase 4: Menores (Semana 4)
1. ⬜ Eliminar console.error de producción
2. ⬜ Fix social links href="#"
3. ⬜ Implementar virtual scrolling
4. ⬜ NuxtImg consistente

---

## 📁 Archivos de Auditoría Individuales

| Archivo | Descripción |
|---------|-------------|
| `audits/01-frontend-ui-audit.md` | Auditoría completa de componentes y UI |
| `audits/02-backend-api-audit.md` | Auditoría de API routes y validación |
| `audits/03-database-audit.md` | Auditoría de schema y Supabase |
| `audits/04-websockets-realtime-audit.md` | Auditoría de WebSocket y tiempo real |
| `audits/05-auth-security-audit.md` | Auditoría de auth y seguridad |
| `audits/06-landing-seo-audit.md` | Auditoría de landing y SEO |
| `audits/07-performance-audit.md` | Auditoría de performance |

---

## 🔗 Recursos y Referencias

- CLAUDE.md - Especificación completa del proyecto
- Skills cargados: nuxt, vue, supabase, jwt-security, accessibility, tailwind-design-system, websocket-implementation, real-time-features

---

*Reporte generado automáticamente por agentes de auditoría de Claude Code*