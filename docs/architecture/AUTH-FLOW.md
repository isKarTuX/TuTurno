# Flujo de Autenticación — TuTurno

> **Nota de seguridad:** Este documento sigue las mejores prácticas de JWT security. Los tokens usan HS256 con secrets de mínimo 256 bits, tokens de corta duración (15min), y rotación de refresh tokens para detectar ataques.

---

## 1. Diagrama de Flujo Completo

```
┌──────────────────┐                              ┌──────────────────┐
│     Cliente       │                              │      API         │
│   (Browser)      │                              │    (Nitro)       │
└────────┬─────────┘                              └────────┬─────────┘
         │                                                 │
         │  1. POST /api/auth/register                     │
         │  { email, password, fullName, documentId }     │
         ├────────────────────────────────────────────────▶
         │                                                 │
         │                                                 │ 2. Crear user en DB
         │                                                 │ 3. Hash password (bcrypt, cost 12)
         │                                                 │ 4. Generar tokens (jose library)
         │                                                 │
         │  5. Response: { user, accessToken, refreshToken }
         │◀────────────────────────────────────────────────┤
         │                                                 │
         │  6. Guardar user en store (Pinia)                │
         │  7. Guardar accessToken en memory (no localStorage)│
         │  8. Guardar refreshToken en httpOnly cookie       │
         │                                                 │
══════════════════════════════════════════════════════════
                         │
                         │ LOGIN (flujo similar)
                         │ POST /api/auth/login
                         │ 1. Verificar credenciales
                         │ 2. Buscar user en DB
                         │ 3. Verificar password hash (bcrypt)
                         │ 4. Generar tokens
                         │ 5. Guardar refresh session en DB
                         │
══════════════════════════════════════════════════════════
                         │
                         │
         │  ─────────────────────────────────────────────
         │
         │  REQUEST CON ACCESS TOKEN (cada request autenticado)
         │  Cookie: access_token (httpOnly) o Header Authorization
         ├────────────────────────────────────────────────▶
         │                                                 │
         │                                                 │ 1. Server middleware
         │                                                 │ 2. Leer cookie access_token
         │                                                 │ 3. verifyJWT(token) con jose
         │                                                 │ 4. Adjuntar user al context
         │                                                 │
         │  Response (datos protegidos)                    │
         │◀────────────────────────────────────────────────┤
         │
         │
         │  ─────────────────────────────────────────────
         │
         │  ACCESS TOKEN EXPIRA (15 min después)
         │
         │  401 Unauthorized
         │◀────────────────────────────────────────────────┤
         │
         │  REQUEST FALLIDO (401)
         │
         │  DETECTAR 401 Y AUTO-REFRESH
         │  1. $fetch interceptor detecta 401
         │  2. POST /api/auth/refresh (con cookie)
         ├────────────────────────────────────────────────▶
         │                                                 │
         │                                                 │ 1. Leer refresh_token cookie
         │                                                 │ 2. Buscar en DB (refresh_sessions)
         │                                                 │ 3. Verificar expiración
         │                                                 │ 4. Invalidar session viejo
         │                                                 │ 5. Crear nueva session
         │                                                 │ 6. Generar nuevo accessToken
         │                                                 │ 7. Generar nuevo refreshToken (rotación)
         │                                                 │
         │  Response: { accessToken, refreshToken }
         │◀────────────────────────────────────────────────┤
         │
         │  REINTENTAR REQUEST ORIGINAL
         │  1. Guardar nuevo accessToken
         │  2. Reintentar request con nuevo token
         ├────────────────────────────────────────────────▶
         │                                                 │
         │  Response exitosa
         │◀────────────────────────────────────────────────┤
         │
         │
         │  ─────────────────────────────────────────────
         │
         │  REFRESH TOKEN EXPIRA (7 días)
         │
         │  POST /api/auth/refresh → 401
         │
         │  REDIRIGIR A LOGIN
         │  router.push('/auth/login')
         │
══════════════════════════════════════════════════════════
                         │
                         │ LOGOUT
                         │
         │  POST /api/auth/logout (con cookie)
         ├────────────────────────────────────────────────▶
         │                                                 │
         │                                                 │ 1. Eliminar refresh session de DB
         │
         │  2. Limpiar cookies
         │  3. Limpiar store (user = null)
         │  4. Redirect a /auth/login
         │◀────────────────────────────────────────────────┤
```

---

## 2. Anatomía del JWT

### Access Token Payload

```json
{
  "sub": "uuid-del-usuario",
  "role": "citizen",
  "email": "usuario@test.com",
  "iat": 1705000000,
  "exp": 1705000900
}
```

| Campo | Descripción | Seguridad |
|-------|-------------|------------|
| `sub` | Subject: ID del usuario (user.id) | Requerido (estándar JWT) |
| `role` | Rol para control de acceso rápido sin consultar DB | Incluido para evitar query adicional |
| `email` | Para display sin consultar DB | No sensible |
| `iat` | Issued At: timestamp de creación | Requerido (estándar JWT) |
| `exp` | Expiration: iat + 15 minutos | Requerido (estándar JWT) |

> **Nota:** No incluir `passwordHash` ni datos sensibles en el payload JWT.

### Refresh Token (Opaco)

El refresh token es un **UUID opaco** (no JWT), almacenado en la tabla `refresh_sessions`. Esto proporciona:
- Rotación detectable (si un token robado es usado primero, ours fail → alert)
- Revocación simple (borrar de la DB)
- Sin riesgo de información expuesta en el token

---

## 3. Política de Cookies

### Access Token Cookie

```typescript
setCookie(event, 'access_token', accessToken, {
  httpOnly: true,      // No accesible desde JavaScript (XSS protection)
  secure: true,        // Solo HTTPS en producción
  sameSite: 'strict',  // No se envía en requests cross-site
  maxAge: 60 * 15,    // 15 minutos (900 segundos)
  path: '/'            // Disponible en toda la app
})
```

### Refresh Token Cookie

```typescript
setCookie(event, 'refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,        // Solo HTTPS en producción
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7,  // 7 días
  path: '/'           // Disponible en toda la app
})
```

> **Importante:** El `secure: true` requiere HTTPS. En desarrollo local (http://localhost) el navegador aceptará la cookie sin seguro. Para testing local, puede ser necesario deshabilitar temporalmente.

### Alternativa: Header Authorization

Para APIs stateless (ej: móvil nativo), usar header en lugar de cookies:

```typescript
// Cliente
headers: {
  Authorization: `Bearer ${accessToken}`
}

// Server middleware
const authHeader = getHeader(event, 'authorization')
if (authHeader?.startsWith('Bearer ')) {
  token = authHeader.slice(7)
}
```

---

## 4. Estrategia de Refresh y Rotación

### Rotación de Refresh Tokens (Token Rotation)

Cada vez que se hace refresh:
1. Se genera un **NUEVO** access token
2. Se genera un **NUEVO** refresh token (UUID)
3. El refresh token **VIEJO se invalida inmediatamente** (se borra de la DB)

**Beneficio de seguridad:** Si un attacker roba el refresh token y lo usa primero, nuestro refresh fallará. Esto detecta el ataque y permite invalidar todas las sesiones del usuario.

### Diagrama de Refresh

```
Uso normal (legitimate user):
┌──────────┐    refresh     ┌──────────┐
│ Cliente  │ ──────────────▶ │   API    │
│          │ ◀───────────────│          │
└──────────┘ nuevo par       └──────────┘

Ataque (attacker con token robado):
┌──────────┐    refresh     ┌──────────┐
│ Attacker │ ──────────────▶ │   API    │
│          │    ✗ 401       │          │  ← refresh falló (token ya usado)
└──────────┘               └──────────┘
┌──────────┐               ┌──────────┐
│ Legit    │ ──────────────▶ │   API    │
│          │    ✗ 401       │          │  ← Legit también falló
└──────────┘               └──────────┘

→ Detectamos anomalía: forzar logout en todos los devices
```

### Implementación de Rotación

```typescript
// server/api/auth/refresh.post.ts
export default defineEventHandler(async (event) => {
  const oldRefreshToken = getCookie(event, 'refresh_token')
  if (!oldRefreshToken) {
    throw createError({ statusCode: 401, data: { success: false, error: { code: 'SESSION_EXPIRED' } } })
  }

  // 1. Buscar sesión existente
  const session = await db.select()
    .from(refreshSessions)
    .where(eq(refreshSessions.token, oldRefreshToken))
    .limit(1)

  if (!session || session.expiresAt < new Date()) {
    throw createError({ statusCode: 401, data: { success: false, error: { code: 'SESSION_EXPIRED' } } })
  }

  // 2. Eliminar sesión vieja (rotación)
  await db.delete(refreshSessions).where(eq(refreshSessions.id, session.id))

  // 3. Crear nueva sesión
  const newRefreshToken = crypto.randomUUID()
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await db.insert(refreshSessions).values({
    id: crypto.randomUUID(),
    userId: session.userId,
    token: newRefreshToken,
    expiresAt: newExpiresAt,
    createdAt: new Date()
  })

  // 4. Generar nuevo access token
  const user = await getUserById(session.userId)
  const accessToken = await generateAccessToken(user)

  // 5. Guardar nueva cookie
  setCookie(event, 'refresh_token', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 })
  setCookie(event, 'access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 15 })

  return { success: true, data: { accessToken, refreshToken: newRefreshToken } }
})
```

---

## 5. Casos de Error

### Error: Token inválido o expirado

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token requerido"
  }
}
```

**Acción del cliente:** Redirect a /auth/login

### Error: Refresh token no encontrado

```json
{
  "success": false,
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "La sesión ha expirado"
  }
}
```

**Acción del cliente:** Redirect a /auth/login con mensaje "Tu sesión expiró"

### Error: Credenciales inválidas

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contraseña incorrectos"
  }
}
```

**Acción del cliente:** Mostrar error en el formulario (no redirigir)

### Rate Limiting

```typescript
// server/middleware/rateLimit.ts
// Implementar rate limiting en login y register
// Máximo 5 intentos por minuto por IP

const loginAttempts = new Map<string, { count: number, resetTime: number }>()

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event)
  const now = Date.now()

  const attempt = loginAttempts.get(ip)

  if (attempt && attempt.resetTime > now) {
    if (attempt.count >= 5) {
      throw createError({
        statusCode: 429,
        data: { success: false, error: { code: 'RATE_LIMITED', message: 'Demasiados intentos. Intenta en 1 minuto.' } }
      })
    }
    attempt.count++
  } else {
    loginAttempts.set(ip, { count: 1, resetTime: now + 60000 })
  }
})
```

---

## 6. Seguridad Adicional

### Validación de JWT con jose

```typescript
// server/utils/jwt.utils.ts
import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signAccessToken(payload: { sub: string; role: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET)
}

export async function verifyAccessToken(token: string): Promise<{ sub: string; role: string; email: string }> {
  const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] })
  return payload as { sub: string; role: string; email: string }
}
```

### Middleware de Autenticación

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Rutas públicas (sin auth)
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh']
  if (publicPaths.some(p => path.startsWith(p))) {
    return
  }

  // Rutas protegidas
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      data: { success: false, error: { code: 'UNAUTHORIZED', message: 'Token requerido' } }
    })
  }

  try {
    const payload = await verifyAccessToken(accessToken)
    event.context.user = payload
  } catch (err) {
    throw createError({
      statusCode: 401,
      data: { success: false, error: { code: 'TOKEN_INVALID', message: 'Token inválido o expirado' } }
    })
  }
})
```

> **Security Note:** Always whitelist the algorithms you accept. In `jwtVerify`, specify `{ algorithms: ['HS256'] }` to prevent algorithm confusion attacks.
