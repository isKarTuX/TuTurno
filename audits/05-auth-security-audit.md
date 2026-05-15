# Auditoría Auth & Security - TuTurno

**Fecha:** 14 de mayo de 2026
**Auditor:** Security Team
**Proyecto:** TuTurno - Sistema de Gestión de Turnos Digitales
**Stack:** Nuxt 3 + Custom JWT (jose) + bcryptjs + Drizzle ORM

---

## Resumen Ejecutivo

El sistema de autenticación de TuTurno está implementado siguiendo las mejores prácticas de la industria en varios aspectos críticos: almacenamiento seguro de contraseñas con bcrypt, tokens en cookies httpOnly, y rotación de refresh tokens. Sin embargo, se identificaron varios issues que requieren atención, particularmente la ausencia de headers de seguridad HTTP y el uso de secrets por defecto en ambiente de desarrollo.

**Score General:** 7.5/10

---

## Hallazgos Positivos

### 1. JWT Implementation ✅
- **Algoritmo HS256** correctamente configurado en `jwt.utils.ts:13`
- **Verificación con whitelist** `{ algorithms: ['HS256'] }` en `jwt.utils.ts:20` - previene algorithm confusion attacks
- **Expiry 15 minutos** configurado en `jwt.utils.ts:15` - cumple con spec
- **Secret desde env** `process.env.JWT_SECRET` en `jwt.utils.ts:3`

### 2. Refresh Token Rotation ✅
- Refresh tokens almacenados en DB tabla `refresh_sessions`
- **Rotación implementada** en `refresh.post.ts:31-41` - token viejo invalidado antes de crear nuevo
- **Expiry 7 días** correctamente configurado
- Cada refresh genera nuevo par de tokens

### 3. Cookie Security ✅
```typescript
// login.post.ts:51-65 - Configuración correcta
{
  httpOnly: true,          // ✅ Previene XSS access
  secure: process.env.NODE_ENV === 'production',  // ✅ HTTPS only en prod
  sameSite: 'strict',      // ✅ CSRF protection
  maxAge: 60 * 15,         // ✅ 15 minutos para access
}
```

### 4. Password Security ✅
- **bcrypt con 12 rondas** en `hash.utils.ts:3`
- **Nunca se expone passwordHash** en respuestas de API (users table query excluye el campo)
- Cambio de contraseña requiere password actual (`change-password.post.ts:18-20`)

### 5. Rate Limiting ✅
- Implementado en `server/middleware/rate-limit.ts`
- **5 requests por minuto** por IP en endpoints de login/register
- Headers X-RateLimit-* retornados al cliente
- Retry-After header en respuestas 429

### 6. Middleware de Ruta (Cliente) ✅
- `middleware/auth.ts` redirige si no autenticado
- `middleware/operator.ts` permite operator Y admin
- `middleware/admin.ts` solo admin
- `middleware/guest.ts` previene acceso a autenticados

### 7. Server Middleware Auth ✅
- `server/middleware/auth.ts` valida JWT en cada request a `/api/*`
- Paths públicos correctamente excluded
- Payload adjuntado a `event.context.user`

---

## Issues Críticos

### [Issue #1] Headers de Seguridad HTTP No Configurados
**Severidad:** CRÍTICA
**Archivo:** `nuxt.config.ts`

Los headers de seguridad especificados en CLAUDE.md sección 11 no están configurados:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`

Estos headers previenen ataques de clickjacking, MIME sniffing, y fugas de referrer.

**Recomendación:** Añadir en `nuxt.config.ts`:
```typescript
app: {
  head: {
    handler: '<script>...</script>',
  },
},
// O usar nitro headers config
nitro: {
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },
},
```

---

### [Issue #2] JWT Secret Con Fallback Inseguro
**Severidad:** ALTA
**Archivo:** `server/utils/jwt.utils.ts:3`

```typescript
const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-min-32-chars-change-this')
```

Si `JWT_SECRET` no está configurado, el sistema usa un secret hardcodeado. En producción esto es crítico porque todos los JWT firmarían con el mismo secreto conocido.

**Impacto:** Si un attacker obtiene el código fuente, puede firmar tokens válidos.

**Recomendación:**
```typescript
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
}
```

---

### [Issue #3] Rate Limiting In-Memory (No Distribuido)
**Severidad:** MEDIA
**Archivo:** `server/utils/rate-limit.utils.ts:8`

```typescript
const rateLimitStore = new Map<string, RateLimitEntry>()
```

El store de rate limiting es en memoria RAM. En deployments con múltiples instancias/servidores, cada servidor tiene su propio contador independiente, permitiendo a un atacante evadir rate limits saltando entre instancias.

**Recomendación:** Para producción, usar Redis o similar para store centralizado:
```typescript
// Ejemplo conceptual
const rateLimitStore = await redis.createClient()
```

---

## Issues Menores

### [Issue #4] forgot-password No Envía Email
**Severidad:** MEDIA
**Archivo:** `server/api/auth/forgot-password.post.ts`

La implementación actual retorna success sin enviar email real:
```typescript
// Line 16-17: Retorna success sin enviar email
return success({ message: 'Si el email existe, recibirás instrucciones...' })
```

Esto es problemático porque:
1. No hace lo que promete al usuario
2. Un atacante puede enumerar emails válidos (distinguir usuarios existentes vs no existentes por timing)

**Recomendación:** Implementar envío real de email o al menos logging del flujo en desarrollo.

---

### [Issue #5] Ausencia de Opción "Recordarme" para Login Documento
**Severidad:** BAJA
**Archivo:** `server/api/auth/login-document.post.ts`

Ciudadanos que usan login con cédula no tienen opción de persistir sesión más allá del token de acceso de 15 min. Refresh token dura 7 días pero el flujo de refresh automático del plugin solo activa cuando hay access_token vigente (`plugins/auth-fetch.client.ts:26`).

**Recomendación:** Considerar checkbox "Recordarme" que extienda el refresh token o permita re-autenticación automática.

---

### [Issue #6] Missing iss/aud Claims en JWT
**Severidad:** BAJA
**Archivos:** `server/utils/jwt.utils.ts`

Los JWT no incluyen claims `iss` (issuer) ni `aud` (audience), recomendados por la especificación JWT para prevenir ataques de confusión de tokens entre servicios.

**Recomendación:** Añadir:
```typescript
.setIssuer('tuturno-api')
.setAudience('tuturno-app')
```

---

### [Issue #7] No Revocación Masiva de Sessions
**Severidad:** BAJA
**Archivo:** `server/api/auth/logout.post.ts`

Logout actual solo invalida el refresh token actual. No hay endpoint para que un usuario invalide TODAS sus sesiones (ej: después de cambiar contraseña).

**Recomendación:** Añadir `DELETE /api/auth/sessions` que borre todos los refresh_tokens del usuario.

---

### [Issue #8] El Campo userAgent en refresh_sessions No Se Usa
**Severidad:** BAJA
**Archivo:** `server/db/schema/sessions.ts`

El schema define `userAgent` pero ningún endpoint lo captura o usa para auditoría.

**Recomendación:** Capturar y almacenar para auditoría de seguridad.

---

## JWT Security Checklist

```
✅ HS256 algorithm
   - jwt.utils.ts:13 setProtectedHeader({ alg: 'HS256' })
   - jwt.utils.ts:20 verifyAccessToken usa { algorithms: ['HS256'] }

✅ 15m access token expiry
   - jwt.utils.ts:15 .setExpirationTime('15m')

✅ Refresh token rotation
   - refresh.post.ts:31-41 old token deleted before new one created

✅ Secret from env (with fallback issue - see #2)
   - jwt.utils.ts:3 process.env.JWT_SECRET

✅ Algorithm confusion prevention
   - jose configured with explicit algorithm whitelist

✅ No localStorage (XSS vulnerable)
   - Tokens only in httpOnly cookies

✅ jti claim no presente (recomendado)
   - No crítico pero recomendado para revocación

✅ iss/aud claims missing (recomendado)
   - See Issue #6
```

---

## Cookie Security

```
✅ httpOnly: true - Todas las cookies de auth son httpOnly
✅ secure: process.env.NODE_ENV === 'production' - Solo HTTPS en prod
✅ sameSite: 'strict' - CSRF protection
✅ path: '/' - Configurado correctamente
✅ maxAge: Configurado (15m access, 7d refresh)
⚠️  SameSite=Lax sería más UX-friendly manteniendo seguridad
```

---

## Password Security

```
✅ bcrypt con 12 rondas (SALT_ROUNDS = 12)
✅ Password nunca expuesto en responses
✅ Cambio requiere password actual
⚠️  No validación de requisitos mínimos de password en schema
```

---

## Rate Limiting

```
✅ Implementado en login y register
✅ 5 requests/minuto/IP
✅ Headers X-RateLimit-* enviados
✅ 429 con Retry-After para excedidos
⚠️  In-memory (no distribuidos) - Ver Issue #3
```

---

## Recommendations

### Prioridad Alta
1. **Configurar headers de seguridad HTTP** en `nuxt.config.ts`
2. **Remover fallback de JWT_SECRET** - lanzar error si no está configurado

### Prioridad Media
3. **Implementar rate limiting centralizado** (Redis) para producción
4. **Implementar envío real de forgot-password** o almacenar flag para auditoría

### Prioridad Baja
5. Añadir claims `iss` y `aud` a JWT
6. Implementar revocación masiva de sesiones
7. Añadir campo "Recordarme" para login con documento
8. Capturar y usar `userAgent` en refresh_sessions

---

## Test de Penetration Checklist

- [ ] Verificar que tokens no pueden ser forjados sin secret
- [ ] Verificar rate limit evitado con múltiples IPs
- [ ] Verificar que cookies son inaccesibles via JavaScript
- [ ] Verificar redirect a login en rutas protegidas sin token
- [ ] Verificar algorithm confusion con token HS256 modificado a RS256
- [ ] Verificar logout invalida session
- [ ] Verificar refresh token rotation funciona
- [ ] Verificar acceso negado a admin routes con rol citizen

---

## Conclusión

El sistema de autenticación de TuTurno está bien estructurado y sigue las mejores prácticas en varios aspectos. Los issues identificados son solucionables sin cambios arquitectónicos mayores. La mayor urgencia es configurar los headers de seguridad HTTP y remediar el fallback del JWT secret.