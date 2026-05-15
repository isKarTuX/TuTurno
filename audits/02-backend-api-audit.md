# Auditoría Backend/API - TuTurno

## Resumen Ejecutivo

El backend de TuTurno está construido sobre Nuxt 3 + Nitro (H3) con Drizzle ORM. Se encontraron **12 issues críticos** que deben corregirse, **8 issues menores**, y varias inconsistencias en el manejo de errores y validación. La arquitectura general es sólida pero hay brechas de seguridad importantes.

---

## Hallazgos Positivos

1. **JWT Implementation** - Usan HS256 con algoritmo whitelisted (`server/utils/jwt.utils.ts:20`) y firma correcta
2. **Password Hashing** - bcryptjs con 12 salt rounds (`server/utils/hash.utils.ts:3`) - industry standard
3. **Token Storage** - httpOnly cookies con sameSite='strict' y secure en producción
4. **Refresh Token Rotation** - Cada refresh genera nuevos tokens y elimina los anteriores (`server/api/auth/refresh.post.ts:31`)
5. **Zod Validation** - Schemas bien definidos en `/schemas/` con validaciones estrictas (email, phone colombiano regex, password strength)
6. **Drizzle ORM** - Todas las queries usan el query builder, sin SQL crudo - seguro contra SQL injection
7. **Rate Limiting** - Implementado en auth endpoints (`/api/auth/login`, `/api/auth/register`)
8. **Consistent Response Format** - Helper functions `success()` y `apiError()` en `server/utils/response.utils.ts`
9. **Role-based Access Control** - Admin/operator checks en endpoints protegidos
10. **Service Pause Functionality** - Bien implementado con validación Zod
11. **Password Requirements** - Mínimo 8 caracteres, 1 número, 1 mayúscula (auth.schema.ts)

---

## Issues Críticos (Deben corregirse)

### [Issue #1] No authorization check for operator-service assignment
**Archivo**: `server/api/operator/call-next.post.ts:18`
```typescript
const service = db.select().from(services).where(eq(services.id, body.serviceId)).get()
```
Un operador puede llamar turnos de **cualquier servicio**, no solo de los que está asignado. No se verifica que `authUser.sub` tenga un registro en `operators` para `body.serviceId`.

**Fix**: Verificar asignación del operador al servicio antes de permitir acciones.

---

### [Issue #2] No authorization check in operator queue.get
**Archivo**: `server/api/operator/queue.get.ts:18`
```typescript
const serviceId = query.serviceId as string | undefined
if (!serviceId) { ... }
```
Cualquier operador puede ver la cola de **cualquier servicio** sin verificación de asignación.

---

### [Issue #3] Missing operator-service authorization in complete/no-show
**Archivos**: `server/api/operator/complete.post.ts`, `server/api/operator/no-show.post.ts`
Neither verifies the operator is assigned to the service of the turn they're trying to complete/mark-no-show.

---

### [Issue #4] Inconsistent error handling - uses createError instead of apiError
**Archivos**:
- `server/api/admin/metrics.get.ts:11` - uses `createError` directly
- `server/api/admin/operators.get.ts:11` - uses `createError` directly  
- `server/api/admin/reports.get.ts:11` - uses `createError` directly
- `server/api/operator/queue.get.ts:12` - uses `createError` directly
- `server/api/operator/queue.get.ts:19` - uses `createError` directly

Esto rompe la consistencia de la respuesta API. Deberían usar `apiError()` helper.

---

### [Issue #5] No pagination on citizens list - N+1 and memory issues
**Archivo**: `server/api/operator/citizens.get.ts`
```typescript
let allCitizens = db.select().from(users).where(eq(users.role, 'citizen')).all()
```
Carga TODOS los ciudadanos en memoria y filtra después. Si hay 100,000+ usuarios, esto causa memory issues. No hay paginación.

---

### [Issue #6] Missing input sanitization on LIKE queries
**Archivo**: `server/api/entities/index.get.ts:16`
```typescript
conditions.push(like(entities.name, `%${search}%`))
```
Aunque Drizzle usa parameterized queries, el LIKE pattern con `%${search}%` podría permitir timing attacks o información de la DB si el search contiene caracteres especiales.

**Fix**: Escapar caracteres especiales en el search string o sanitizar.

---

### [Issue #7] No rate limiting on operator actions
**Archivos**: 
- `server/api/operator/call-next.post.ts`
- `server/api/operator/complete.post.ts`
- `server/api/operator/no-show.post.ts`
- `server/api/operator/citizens.post.ts`

Estas son operaciones sensibles que deberían tener rate limiting para prevenir abuse.

---

### [Issue #8] Missing security headers
**Archivo**: `nuxt.config.ts`
No se configuran headers de seguridad:
- `X-Frame-Options`
- `X-Content-Type-Options`  
- `Referrer-Policy`

Esto está especificado en CLAUDE.md sección 11 pero no implementado.

---

### [Issue #9] Rate limit store is in-memory (won't scale)
**Archivo**: `server/utils/rate-limit.utils.ts:8`
```typescript
const rateLimitStore = new Map<string, RateLimitEntry>()
```
En un escenario de múltiples instancias/workers, este store no se comparte. Requests desde diferentes instancias no comparten el rate limit state.

---

### [Issue #10] citizens.get.ts has inefficient email check
**Archivo**: `server/api/operator/citizens.get.ts:67`
```typescript
isIncomplete: c.email.endsWith('@pending.tuturno') || c.mustChangePassword === true,
```
Este hack de `@pending.tuturno` debería ser un flag en la DB, no una convención de email.

---

### [Issue #11] EntityService cascade doesn't validate entity exists
**Archivo**: `server/api/services/index.post.ts:17-19`
```typescript
const entity = db.select().from(entities).where(eq(entities.id, body.entityId)).get()
if (!entity) {
  throw apiError('NOT_FOUND', 'Entidad no encontrada', 404)
}
```
Solo verifica que la entidad existe, pero no verifica si el usuario tiene permisos de admin sobre esa entidad.

---

### [Issue #12] reports.get.ts doesn't use indexes efficiently
**Archivo**: `server/api/admin/reports.get.ts:35-44`
```typescript
const turnsQuery = db.select().from(turns).where(gte(turns.createdAt, startDate))
const allTurns = turnsQuery.all()
let filteredTurns = allTurns
if (entityId) {
  filteredTurns = filteredTurns.filter((t) => t.entityId === entityId)
}
```
Carga todos los turnos del período en memoria y filtra en aplicación. Debería filtrar en la DB con condiciones AND.

---

## Issues Menores (Mejora recomendada)

### [Issue #13] me.get.ts - createdAt/updatedAt may be undefined
**Archivo**: `server/api/auth/me.get.ts:25-26`
```typescript
createdAt: user.createdAt,
updatedAt: user.updatedAt,
```
El schema users define `createdAt` y `updatedAt` con `$defaultFn` pero no `notNull()`. Pueden ser undefined.

---

### [Issue #14] Refresh token expiration check uses gt instead of gte
**Archivo**: `server/api/auth/refresh.post.ts:16`
```typescript
gt(refreshSessions.expiresAt, new Date())
```
Debería usar `gte` para incluir tokens que expiran exactamente en el momento de la consulta.

---

### [Issue #15] register-simple.post.ts has redundant queries
**Archivo**: `server/api/auth/register-simple.post.ts:46-60`
Después de crear el usuario, hace un query complejo de turns con left joins innecesarios. Podría optimizarse.

---

### [Issue #16] Missing DELETE endpoint for services
**Archivo**: No existe `server/api/services/[id].delete.ts`
Según el spec, debería existir un endpoint para eliminar servicios (soft delete o hard delete).

---

### [Issue #17] Missing DELETE endpoint for entities  
**Archivo**: No existe `server/api/entities/[id].delete.ts`
Según el spec, debería existir un endpoint para eliminar entidades.

---

### [Issue #18] Missing PATCH for operator assignment status
**Archivo**: No existe `server/api/admin/operators/[id].patch.ts`
Para activar/desactivar un operador de un servicio.

---

### [Issue #19] No CORS configuration
**Archivo**: `nuxt.config.ts`
No hay configuración CORS. Para API pública como `/api/entities` y `/api/services` podría ser necesario configurar origins permitidos.

---

### [Issue #20] forgot-password.post.ts has manual body parsing
**Archivo**: `server/api/auth/forgot-password.post.ts:6-7`
```typescript
const body = await readBody(event)
const { email } = body as { email?: string }
```
Debería usar un schema Zod para validar el body, igual que los demás endpoints.

---

## Endpoints que faltan

Según CLAUDE.md sección 3.1, los siguientes endpoints deberían existir:

| Método | Ruta | Estado | Notas |
|--------|------|--------|-------|
| GET | /api/services (lista) | ✅ Existe | |
| GET | /api/services/[id] | ✅ Existe | |
| POST | /api/services | ✅ Existe | |
| PATCH | /api/services/[id] | ✅ Existe | |
| DELETE | /api/services/[id] | ❌ Falta | Soft delete recomendado |
| GET | /api/services/[id]/queue | ✅ Existe | |
| POST | /api/services/[id]/queue | ✅ Existe | |
| GET | /api/entities | ✅ Existe | |
| GET | /api/entities/[id] | ✅ Existe | |
| POST | /api/entities | ✅ Existe | Admin only |
| PATCH | /api/entities/[id] | ✅ Existe | Admin only |
| DELETE | /api/entities/[id] | ❌ Falta | Soft delete recomendado |
| POST | /api/operator/citizens | ✅ Existe | |
| GET | /api/operator/citizens | ✅ Existe | |
| PATCH | /api/operator/citizens/[id] | ✅ Existe | |
| GET | /api/admin/operators | ✅ Existe | |
| POST | /api/admin/operators | ✅ Existe | |
| PATCH | /api/admin/operators/[id] | ❌ Falta | |
| DELETE | /api/admin/operators/[id] | ❌ Falta | |

---

## Security Checklist

- [x] **Zod validation** - Todos los endpoints de escritura tienen schemas Zod
  - ❌ `/api/auth/forgot-password.post.ts` - No usa schema
  - ❌ `/api/turns/my.get.ts` - No necesita (solo lectura)
- [x] **Auth middleware** - Implementado en `server/middleware/auth.ts`
- [x] **Password hashing** - bcryptjs 12 rounds
- [x] **JWT security** - HS256, algorithm whitelist, 15min expiration
- [x] **Rate limiting** - Implementado para auth endpoints
- [x] **SQL injection prevention** - Drizzle ORM con parameterized queries
- [ ] **Authorization checks (role-based)** - Parcial, falta verificar operator→service
- [ ] **CORS configuration** - No implementada
- [ ] **Security headers** - No implementados (X-Frame-Options, etc)
- [x] **Refresh token rotation** - Funciona correctamente
- [x] **No secrets in responses** - passwordHash nunca expuesto
- [ ] **Input sanitization** - LIKE queries con search sin sanitizar
- [x] **HttpOnly cookies** -正确配置
- [x] **SameSite=strict** -正确配置
- [ ] **Secure flag in production** -正确配置 pero verificar env

---

## Detalle de Validación Zod

### Auth Schemas (✅ Completo)
- `registerSchema` - ✅
- `loginSchema` - ✅
- `loginWithDocumentSchema` - ✅
- `createOperatorSchema` - ✅
- `createCitizenByOperatorSchema` - ✅
- `changePasswordSchema` - ✅

### Turn Schemas (✅ Completo)
- `createTurnSchema` - ✅
- `createTurnPublicSchema` - ✅
- `updateTurnSchema` - ✅
- `callNextSchema` - ✅
- `operatorActionSchema` - ✅
- `servicePauseSchema` - ✅

### Entity Schemas (✅ Completo)
- `createEntitySchema` - ✅
- `updateEntitySchema` - ✅
- `createServiceSchema` - ✅
- `updateServiceSchema` - ✅

### Notification Schemas (✅ Completo)
- `pushSubscriptionSchema` - ✅

---

## Recomendaciones Prioritarias

### Alta Prioridad (Security)
1. Implementar operator→service authorization check en todos los endpoints de operador
2. Agregar security headers en nuxt.config.ts
3. Configurar CORS para API pública
4. Implementar rate limiting en operator actions

### Media Prioridad (Performance/Reliability)
5. Implementar paginación en citizens.get.ts
6. Mover rate limit store a Redis o similar para escalar
7. Optimizar reports.get.ts para filtrar en DB
8. Sanitizar inputs en LIKE queries

### Baja Prioridad (Code Quality)
9. Unificar uso de `apiError()` en lugar de `createError()` directo
10. Crear endpoints DELETE para entities y services
11. Crear PATCH/DELETE para operator assignments
12. Remover hack de `@pending.tuturno` email convention

---

## Archivos Revisados

```
server/
├── db/
│   ├── index.ts                    ✅
│   └── schema/
│       ├── index.ts                ✅
│       ├── users.ts               ✅
│       ├── turns.ts               ✅
│       ├── entities.ts            ✅
│       ├── services.ts            ✅
│       ├── operators.ts           ✅
│       ├── notifications.ts       ✅
│       └── sessions.ts             ✅
├── middleware/
│   ├── auth.ts                    ✅
│   └── rate-limit.ts              ⚠️ In-memory store
├── utils/
│   ├── auth.utils.ts              ✅
│   ├── jwt.utils.ts               ✅
│   ├── hash.utils.ts              ✅
│   ├── response.utils.ts          ✅
│   ├── rate-limit.utils.ts        ⚠️ In-memory
│   ├── ws.utils.ts                ✅
│   └── push.utils.ts              ✅
├── api/
│   ├── auth/
│   │   ├── login.post.ts          ✅
│   │   ├── login-document.post.ts ✅
│   │   ├── register.post.ts       ✅
│   │   ├── register-simple.post.ts ⚠️
│   │   ├── logout.post.ts         ✅
│   │   ├── refresh.post.ts        ✅
│   │   ├── me.get.ts              ⚠️
│   │   ├── change-password.post.ts ✅
│   │   └── forgot-password.post.ts ⚠️
│   ├── turns/
│   │   ├── index.get.ts           ✅
│   │   ├── index.post.ts          ✅
│   │   ├── my.get.ts              ⚠️ No pagination
│   │   ├── [id].get.ts            ✅
│   │   ├── [id].delete.ts         ✅
│   │   ├── public.post.ts         ✅
│   │   ├── public-turn.get.ts     ✅
│   │   ├── track.get.ts           ✅
│   │   └── by-document.get.ts     ✅
│   ├── entities/
│   │   ├── index.get.ts           ⚠️ LIKE sanitization
│   │   ├── index.post.ts          ✅
│   │   ├── [id].get.ts            ✅
│   │   └── [id].patch.ts          ✅
│   ├── services/
│   │   ├── index.get.ts           ✅
│   │   ├── index.post.ts          ✅
│   │   ├── [id].get.ts            ✅
│   │   ├── [id].patch.ts          ✅
│   │   └── [id]/
│   │       ├── queue.get.ts       ✅
│   │       └── queue.post.ts      ✅
│   ├── operator/
│   │   ├── queue.get.ts           ⚠️ No service auth
│   │   ├── call-next.post.ts      ⚠️ No service auth
│   │   ├── complete.post.ts       ⚠️ No service auth
│   │   ├── no-show.post.ts        ⚠️ No service auth
│   │   ├── citizens.post.ts       ✅
│   │   ├── citizens.get.ts        ⚠️ No pagination
│   │   └── update-citizen.patch.ts ✅
│   ├── admin/
│   │   ├── metrics.get.ts         ⚠️ createError
│   │   ├── operators.get.ts       ⚠️ createError
│   │   ├── operators.post.ts      ✅
│   │   └── reports.get.ts          ⚠️ In-memory filter
│   └── notifications/
│       └── subscribe.post.ts      ✅
```

---

*Auditoría realizada: 2025-05-14*
*Alcance: Backend/API - Nuxt 3 + Nitro + Drizzle ORM*