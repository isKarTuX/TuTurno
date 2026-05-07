# PHASE-03 — Sistema de Autenticación

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 3
Depende de: PHASE-01, PHASE-02
Tiempo estimado: 90 min
```

---

## 1. Objetivo

Implementar el sistema completo de autenticación con JWT: registro, login, logout, refresh automático de tokens, middleware de verificación y guards de ruta.

---

## 2. Flujo Completo de Autenticación

```
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌─────────────┐
│ Cliente │     │   API   │     │    DB       │     │   Cookie    │
└────┬────┘     └────┬────┘     └──────┬──────┘     └──────┬──────┘
     │               │                │                    │
     │─ REGISTER ───▶│                │                    │
     │               │─ INSERT user ─▶│                    │
     │               │◀─ user id ──────│                    │
     │◀─ tokens ────│                │                    │
     │               │                │                    │
     │─ LOGIN ──────▶│                │                    │
     │               │─ verify pass ─▶│                    │
     │               │◀─ user data ────│                    │
     │               │─ create session ─▶│                   │
     │◀─ tokens ────│                │                    │
     │               │                │                    │
     │─ API request ─▶│                │                    │
     │               │─ verify JWT ───▶│                    │
     │               │◀─ user id ──────│                    │
     │◀─ response ───│                │                    │
     │               │                │                    │
     │─ token expira ─▶│                │                    │
     │◀─ 401 ────────│                │                    │
     │               │                │                    │
     │─ REFRESH ─────▶│                │                    │
     │               │─ verify refresh ─▶│                   │
     │               │◀─ session data ──│                   │
     │               │─ delete old sess│                    │
     │               │─ create new sess ─▶│                   │
     │◀─ new tokens ─│                │                    │
     │               │                │                    │
     │─ LOGOUT ──────▶│                │                    │
     │               │─ delete sess ──▶│                    │
     │◀─ 200 ────────│                │                    │
```

---

## 3. Endpoints a Implementar

### POST /api/auth/register

```typescript
// Request
{
  fullName: string,      // min 2 chars
  documentId: string,    // Cédula, 6-12 digits
  email: string,         // valid email
  phone: string,         // Colombian phone format
  password: string       // min 8 chars
}

// Response 201
{
  success: true,
  data: {
    user: User,          // sin passwordHash
    accessToken: string,
    refreshToken: string
  }
}

// Response 400
{
  success: false,
  error: { code: 'VALIDATION_ERROR', message: '...', details: ZodError }
}

// Response 409
{
  success: false,
  error: { code: 'EMAIL_EXISTS', message: 'El email ya está registrado' }
}
```

**Guards:** Ninguno (público)

---

### POST /api/auth/login

```typescript
// Request
{
  email: string,
  password: string
}

// Response 200
{
  success: true,
  data: {
    user: User,
    accessToken: string,   // JWT, 15 min
    refreshToken: string    // opaque UUID, 7 días
  }
}

// Response 401
{
  success: false,
  error: { code: 'INVALID_CREDENTIALS', message: 'Email o contraseña incorrectos' }
}
```

**Guards:** Ninguno (público)

---

### POST /api/auth/refresh

```typescript
// Request (cookie httpOnly refresh_token enviado automáticamente)
{ }  // vacío

// Response 200
{
  success: true,
  data: {
    accessToken: string,
    refreshToken: string   // nuevo, rotación
  }
}

// Response 401
{
  success: false,
  error: { code: 'SESSION_EXPIRED', message: 'La sesión ha expirado' }
}
```

**Guards:** Solo requiere cookie de refresh token

---

### POST /api/auth/logout

```typescript
// Request (cookie httpOnly refresh_token)
{ }  // vacío

// Response 200
{
  success: true,
  data: { message: 'Sesión cerrada' }
}

// Response 401
{
  success: false,
  error: { code: 'UNAUTHORIZED', message: 'No hay sesión activa' }
}
```

**Guards:** Requiere estar autenticado (refresh token válido)

---

### GET /api/auth/me

```typescript
// Response 200
{
  success: true,
  data: { user: User }
}

// Response 401
{
  success: false,
  error: { code: 'UNAUTHORIZED', message: 'No autenticado' }
}
```

**Guards:** Requiere access token válido

---

## 4. Middleware del Servidor

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
    throw createError({ statusCode: 401, data: { success: false, error: { code: 'UNAUTHORIZED', message: 'Token requerido' } } })
  }

  try {
    const payload = await verifyJWT(accessToken)
    event.context.user = payload
  } catch (err) {
    throw createError({ statusCode: 401, data: { success: false, error: { code: 'TOKEN_INVALID', message: 'Token inválido o expirado' } } })
  }
})
```

---

## 5. Middleware de Cliente (Nuxt)

```typescript
// middleware/auth.ts - Requiere cualquier usuario autenticado
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})

// middleware/guest.ts - Solo no autenticados
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (auth.isAuthenticated) {
    return navigateTo('/app')
  }
})

// middleware/operator.ts - Solo operadores y admins
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  if (auth.role !== 'operator' && auth.role !== 'admin') {
    return navigateTo('/app')
  }
})

// middleware/admin.ts - Solo admins
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  if (auth.role !== 'admin') {
    return navigateTo('/app')
  }
})
```

---

## 6. Store de Auth

```typescript
// stores/auth.store.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => user.value?.role)
  const isAdmin = computed(() => role.value === 'admin')
  const isOperator = computed(() => role.value === 'operator' || role.value === 'admin')
  const isCitizen = computed(() => role.value === 'citizen')

  async function login(email: string, password: string) { ... }
  async function register(data: RegisterData) { ... }
  async function logout() { ... }
  async function refresh() { ... }
  async function fetchUser() { ... }

  return { user, accessToken, isAuthenticated, role, isAdmin, isOperator, isCitizen, login, register, logout, refresh, fetchUser }
})
```

---

## 7. Composable useAuth

```typescript
// composables/useAuth.ts
export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  async function loginAndRedirect(email: string, password: string) {
    await store.login(email, password)
    if (store.isAdmin) return router.push('/admin')
    if (store.isOperator) return router.push('/operator')
    return router.push('/app')
  }

  async function registerAndRedirect(data: RegisterData) {
    await store.register(data)
    return router.push('/app')
  }

  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    role: computed(() => store.role),
    isAdmin: computed(() => store.isAdmin),
    isOperator: computed(() => store.isOperator),
    login: store.login,
    register: store.register,
    logout: store.logout,
    loginAndRedirect,
    registerAndRedirect,
  }
}
```

---

## 8. Páginas a Crear

### /auth/login.vue

**Campos:**
- Email (requerido, email válido)
- Contraseña (requerida, min 8 chars)

**Validaciones:**
- Validación en tiempo real con vee-validate
- Mensajes de error específicos
- Botón deshabilitado mientras está submitting

---

### /auth/register.vue

**Campos:**
- Nombre completo (requerido, min 2 chars)
- Cédula (requerido, 6-12 dígitos)
- Email (requerido, email válido)
- Teléfono (requerido, formato colombiano)
- Contraseña (requerida, min 8 chars, debe tener número)
- Confirmar contraseña (debe ser igual a contraseña)

**Validaciones:**
- Todos los campos validados con Zod
- Confirmar contraseña como validación extra
- Verificar que el email no esté registrado ( blur event)

---

## 9. Criterios de Éxito

- [ ] Registro crea usuario y retorna tokens
- [ ] Login retorna tokens y guarda en store
- [ ] Refresh genera nuevos tokens y rota el refresh token
- [ ] Logout invalida la sesión en DB
- [ ] Access token expira en 15 min
- [ ] Refresh token expira en 7 días
- [ ] Middleware rechaza requests sin token válido
- [ ] Guards redirigen correctamente según rol
- [ ] Refresh automático funciona en el cliente

---

## 10. Casos de Prueba

1. **Registro exitoso** → recibe tokens, user en store
2. **Registro con email existente** → error 409
3. **Login con credenciales incorrectas** → error 401
4. **Acceso a ruta protegida sin token** → 401
5. **Token expirado** → refresh automático exitoso
6. **Refresh token expirado** → redirigir a login
7. **Logout** → sesión borrada, redirigir a login
8. **Acceso a /admin con rol citizen** → redirigir a /app
