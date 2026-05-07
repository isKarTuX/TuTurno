# IMPLEMENTATION-GUIDE.md — Guía de Implementación TuTurno

> Guía técnica detallada para implementar características específicas del proyecto.
> Complementa CLAUDE.md y los documentos de fases.
> Código ejemplo para las partes más complejas del sistema.

---

## TABLA DE CONTENIDOS

1. [Plugin de Auto-Refresh JWT con ofetch](#1-plugin-de-auto-refresh-jwt)
2. [Manejo de Errores Completo](#2-manejo-de-errores)
3. [RLS Policies de Supabase](#3-rls-policies-de-supabase)
4. [Patrones de Testing](#4-patrones-de-testing)
5. [Configuración PWA Completa](#5-configuración-pwa)
6. [Estructura de Plugins y Middleware](#6-estructura-de-plugins-y-middleware)
7. [Patrones de Composables](#7-patrones-de-composables)
8. [Zod Schemas Completos](#8-zod-schemas)

---

## 1. PLUGIN DE AUTO-REFRESH JWT

### Arquitectura del Interceptor

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                       │
├─────────────────────────────────────────────────────────────────┤
│  $fetch (ofetch global)                                         │
│       │                                                          │
│       ├──► Interceptor onRequest                                │
│       │      Agrega accessToken de cookie httpOnly              │
│       │                                                          │
│       ├──► Request al API Server                                │
│       │                                                          │
│       ├──◄► Response 200                                        │
│       │      Pasa normalmente                                    │
│       │                                                          │
│       └──► Response 401                                         │
│              ┌─────────────────────────────────────────┐        │
│              │ onResponseError:                        │        │
│              │ 1. Detectar 401                         │        │
│              │ 2. Verificar si es /api/auth/refresh    │        │
│              │ 3. Si no → llamar /api/auth/refresh     │        │
│              │ 4. Si refresh exitoso → reintentar      │        │
│              │ 5. Si refresh falla → logout + login   │        │
│              └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Implementación del Plugin

```typescript
// plugins/auth-fetch.client.ts
// Intercepta TODAS las llamadas $fetch en el cliente para auto-refresh

import { ofetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  let isRefreshing = false
  let refreshPromise: Promise<string | null> | null = null

  async function getAccessToken(): Promise<string | null> {
    const token = useCookie('access_token').value
    return token ?? null
  }

  async function refreshAccessToken(): Promise<string | null> {
    if (isRefreshing && refreshPromise) {
      return refreshPromise
    }

    isRefreshing = true
    refreshPromise = performRefresh()
    
    try {
      const newToken = await refreshPromise
      return newToken
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  }

  async function performRefresh(): Promise<string | null> {
    try {
      const response = await $fetch<{ 
        success: boolean
        data?: { accessToken: string }
        error?: { code: string; message: string }
      }>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.success && response.data?.accessToken) {
        const cookie = useCookie('access_token', {
          maxAge: 60 * 15,
          secure: true,
          sameSite: 'strict',
        })
        cookie.value = response.data.accessToken
        return response.data.accessToken
      }
      
      return null
    } catch {
      return null
    }
  }

  async function logoutAndRedirect() {
    const authStore = useAuthStore()
    await authStore.logout()
    await navigateTo('/auth/login')
  }

  const originalFetch = globalThis.$fetch

  globalThis.$fetch = ofetch.create({
    interceptors: {
      request: async (options) => {
        const token = await getAccessToken()
        
        if (token && options.url && !options.url.includes('/api/auth/')) {
          options.headers = options.headers || {}
          if (options.headers instanceof Headers) {
            options.headers.set('Authorization', `Bearer ${token}`)
          } else {
            options.headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        return options
      },

      response: {
        onResponseError: async ({ response, options }) => {
          if (response.status === 401) {
            const url = typeof options === 'object' && 'url' in options 
              ? (options as { url: string }).url 
              : String(options)

            if (url.includes('/api/auth/refresh')) {
              await logoutAndRedirect()
              throw new Error('Session expired')
            }

            const newToken = await refreshAccessToken()
            
            if (newToken) {
              const retryResponse = await originalFetch(url, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${newToken}`,
                },
              })
              return retryResponse
            }

            await logoutAndRedirect()
            throw new Error('Token refresh failed')
          }

          if (response.status === 403) {
            const authStore = useAuthStore()
            if (!authStore.hasRole('admin') && !authStore.hasRole('operator')) {
              throw createError({
                statusCode: 403,
                statusMessage: 'No tienes permisos para acceder a este recurso',
              })
            }
          }

          const errorData = response._data
          throw createError({
            statusCode: response.status,
            statusMessage: errorData?.error?.message || 'Error en la solicitud',
            data: errorData,
          })
        },
      },
    },
  }) as typeof originalFetch

  return {
    provide: {
      authFetch: globalThis.$fetch,
    },
  }
}
```

### Uso en Componentes

```vue
<script setup lang="ts">
const { $authFetch } = useNuxtApp()

async function loadTurns() {
  const { data } = await useAsyncData('turns', () => 
    $authFetch<Turn[]>('/api/turns')
  )
  return data
}

async function createTurn(serviceId: string) {
  return await $authFetch<Turn>('/api/turns', {
    method: 'POST',
    body: { serviceId },
  })
}
</script>
```

---

## 2. MANEJO DE ERRORES

### 2.1 Páginas de Error de Nuxt

```
error.vue
├── 401.vue (Unauthorized)
├── 403.vue (Forbidden)
├── 404.vue (Not Found)
└── 500.vue (Internal Server Error)
```

### error.vue (Layout de error global)

```vue
<script setup lang="ts">
interface Props {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    data?: unknown
  }
}

const props = defineProps<Props>()

const errorConfig = computed(() => {
  const code = props.error.statusCode
  if (code === 401) {
    return {
      title: 'Sesión Expirada',
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      icon: 'ph-sign-out',
      action: { label: 'Ir a Login', to: '/auth/login' },
      gradient: 'from-amber-500/20 to-orange-500/20',
    }
  }
  if (code === 403) {
    return {
      title: 'Acceso Denegado',
      message: 'No tienes permisos para acceder a esta página.',
      icon: 'ph-shield-warning',
      action: { label: 'Volver al Inicio', to: '/' },
      gradient: 'from-red-500/20 to-pink-500/20',
    }
  }
  if (code === 404) {
    return {
      title: 'Página No Encontrada',
      message: 'La página que buscas no existe o fue movida.',
      icon: 'ph-map-trifold',
      action: { label: 'Ir al Inicio', to: '/' },
      gradient: 'from-violet-500/20 to-purple-500/20',
    }
  }
  return {
    title: 'Error Inesperado',
    message: props.error.message || 'Algo salió mal. Por favor, intenta de nuevo.',
    icon: 'ph-warning-circle',
    action: { label: 'Recargar Página', to: '' },
    gradient: 'from-gray-500/20 to-slate-500/20',
  }
})

const handleError = useError()

async function clearErrorAndNavigate() {
  await clearError({ redirect: errorConfig.value.action.to || '/' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div 
      class="glass-card max-w-md w-full p-8 text-center"
      :class="`bg-gradient-to-br ${errorConfig.gradient}`"
    >
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
        <Icon :name="errorConfig.icon" size="40" class="text-white" />
      </div>
      
      <h1 class="text-2xl font-display font-bold text-white mb-2">
        {{ errorConfig.title }}
      </h1>
      
      <p class="text-gray-300 mb-6">
        {{ errorConfig.message }}
      </p>

      <div class="flex gap-3 justify-center">
        <button 
          v-if="errorConfig.action.to"
          @click="clearErrorAndNavigate"
          class="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
        >
          {{ errorConfig.action.label }}
        </button>
        <button 
          @click="handleError.value = null; window.location.reload()"
          class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
        >
          Recargar
        </button>
      </div>

      <p class="text-xs text-gray-500 mt-6">
        Código de error: {{ error.statusCode }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}
</style>
```

### 2.2 Wrapper de Error para API Routes

```typescript
// server/utils/error.utils.ts

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const Errors = {
  unauthorized: (message = 'No autenticado') => 
    new ApiError(401, 'UNAUTHORIZED', message),
  
  forbidden: (message = 'No tienes permisos para esta acción') => 
    new ApiError(403, 'FORBIDDEN', message),
  
  notFound: (resource = 'Recurso') => 
    new ApiError(404, 'NOT_FOUND', `${resource} no encontrado`),
  
  validation: (details: unknown) => 
    new ApiError(400, 'VALIDATION_ERROR', 'Error de validación', details),
  
  conflict: (message: string) => 
    new ApiError(409, 'CONFLICT', message),
  
  rateLimit: (message = 'Demasiadas solicitudes. Intenta más tarde.') => 
    new ApiError(429, 'RATE_LIMIT', message),
  
  internal: (message = 'Error interno del servidor') => 
    new ApiError(500, 'INTERNAL_ERROR', message),
} as const

// server/utils/response.utils.ts

import type { H3Event } from 'h3'

export function success<T>(data: T, event?: H3Event) {
  return {
    success: true as const,
    data,
  }
}

export function errorHandler(event: H3Event, error: unknown) {
  if (error instanceof ApiError) {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.message,
      data: {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    })
  }

  if (error instanceof SyntaxError) {
    throw createError({
      statusCode: 400,
      statusMessage: 'JSON inválido',
      data: {
        success: false as const,
        error: { code: 'INVALID_JSON', message: 'El cuerpo de la solicitud no es JSON válido' },
      },
    })
  }

  console.error('[Server Error]', error)
  
  throw createError({
    statusCode: 500,
    statusMessage: 'Error interno',
    data: {
      success: false as const,
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    },
  })
}
```

### 2.3 Uso en API Routes

```typescript
// server/api/turns/index.post.ts

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    
    const body = await readValidatedBody(event, TurnCreateSchema.parse)
    
    if (body.serviceId) {
      const service = await getServiceById(body.serviceId)
      if (!service) {
        throw Errors.notFound('Servicio')
      }
      if (!service.isActive || service.isPaused) {
        throw Errors.conflict('El servicio no está disponible actualmente')
      }
    }

    const turn = await createTurn({ ...body, citizenId: user.id })
    
    return success(turn, event)
  } catch (error) {
    errorHandler(event, error)
  }
})
```

### 2.4 Error Boundary Component

```vue
<script setup lang="ts">
interface Props {
  fallback?: {
    title?: string
    message?: string
    showRetry?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  fallback: () => ({
    title: 'Algo salió mal',
    message: 'No pudimos cargar este contenido',
    showRetry: true,
  }),
})

const hasError = ref(false)
const errorMessage = ref('')

function handleError(error: Error) {
  hasError.value = true
  errorMessage.value = error.message
}

function retry() {
  hasError.value = false
  errorMessage.value = ''
  emit('retry')
}

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <slot v-if="!hasError" />

  <div 
    v-else
    class="error-boundary p-6 text-center glass rounded-xl"
    role="alert"
  >
    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
      <Icon name="ph-warning-circle" size="24" class="text-red-400" />
    </div>
    
    <h3 class="text-lg font-semibold text-white mb-2">
      {{ props.fallback.title }}
    </h3>
    
    <p class="text-sm text-gray-400 mb-4">
      {{ errorMessage || props.fallback.message }}
    </p>
    
    <button
      v-if="props.fallback.showRetry"
      @click="retry"
      class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
    >
      Reintentar
    </button>
  </div>
</template>
```

### 2.5 Logging Estructurado

```typescript
// server/utils/logger.utils.ts
import { pino } from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  base: {
    service: 'tuturno-api',
    version: process.env.npm_package_version || '1.0.0',
  },
  redact: {
    paths: ['req.headers.authorization', 'password', 'token'],
    remove: true,
  },
})

export function logRequest(event: H3Event, responseTime: number) {
  const method = event.method
  const path = event.path
  const status = event.statusCode || 0
  
  if (status >= 500) {
    logger.error({ method, path, status, responseTime }, 'Request failed')
  } else if (status >= 400) {
    logger.warn({ method, path, status, responseTime }, 'Request warning')
  } else {
    logger.info({ method, path, status, responseTime }, 'Request completed')
  }
}

export function logAuth(userId: string, action: string, success: boolean) {
  if (success) {
    logger.info({ userId, action }, 'Auth action succeeded')
  } else {
    logger.warn({ userId, action }, 'Auth action failed')
  }
}
```

---

## 3. RLS POLICIES DE SUPABASE

### 3.1 Tabla: users

```sql
-- Todos pueden ver su propio perfil
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (
    auth.uid() = id
  );

-- Admin puede ver todos los usuarios
CREATE POLICY "users_select_all_for_admin" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM operators 
      WHERE operators.user_id = auth.uid() 
      AND operators.entity_id IN (
        SELECT id FROM entities WHERE id = operators.entity_id
      )
    )
    OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins pueden insertar usuarios (registro va por API separada)
CREATE POLICY "users_insert_admin_only" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Usuarios pueden actualizar solo su propio perfil
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (
    auth.uid() = id
  ) WITH CHECK (
    auth.uid() = id
  );

-- Solo admins pueden eliminar usuarios
CREATE POLICY "users_delete_admin_only" ON users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.2 Tabla: entities

```sql
-- Cualquiera puede ver entidades activas (para ciudadanos)
CREATE POLICY "entities_select_public" ON entities
  FOR SELECT USING (
    is_active = true
  );

-- Solo admins pueden insertar entidades
CREATE POLICY "entities_insert_admin_only" ON entities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins o operadores de la entidad pueden actualizar
CREATE POLICY "entities_update_admin_or_operator" ON entities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM operators 
      WHERE operators.user_id = auth.uid() 
      AND operators.entity_id = entities.id
    )
  );

-- Solo admins pueden eliminar
CREATE POLICY "entities_delete_admin_only" ON entities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.3 Tabla: services

```sql
-- Cualquiera puede ver servicios activos de entidades activas
CREATE POLICY "services_select_public" ON services
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM entities 
      WHERE entities.id = services.entity_id 
      AND entities.is_active = true
    )
  );

-- Solo admins pueden insertar servicios
CREATE POLICY "services_insert_admin_only" ON services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins o operadores del servicio pueden actualizar
CREATE POLICY "services_update_admin_or_operator" ON services
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM operators 
      WHERE operators.user_id = auth.uid() 
      AND operators.service_id = services.id
    )
  );

-- Solo admins pueden eliminar
CREATE POLICY "services_delete_admin_only" ON services
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.4 Tabla: turns

```sql
-- Citizens pueden ver sus propios turnos
CREATE POLICY "turns_select_own" ON turns
  FOR SELECT USING (
    auth.uid() = citizen_id
  );

-- Operadores pueden ver turnos de su servicio
CREATE POLICY "turns_select_operator_service" ON turns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM operators 
      WHERE operators.user_id = auth.uid() 
      AND operators.service_id = turns.service_id
    )
  );

-- Admin puede ver todos los turnos
CREATE POLICY "turns_select_admin" ON turns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Citizens pueden crear turnos para sí mismos
CREATE POLICY "turns_insert_citizen" ON turns
  FOR INSERT WITH CHECK (
    auth.uid() = citizen_id
  );

-- Citizens pueden cancelar sus propios turnos waiting
CREATE POLICY "turns_cancel_own" ON turns
  FOR UPDATE USING (
    auth.uid() = citizen_id
    AND status = 'waiting'
  ) WITH CHECK (
    auth.uid() = citizen_id
    AND status = 'waiting'
  );

-- Operadores pueden actualizar turnos de su servicio (llamar, completar, no_show)
CREATE POLICY "turns_update_operator_service" ON turns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM operators 
      WHERE operators.user_id = auth.uid() 
      AND operators.service_id = turns.service_id
    )
  );

-- Admin puede eliminar turnos
CREATE POLICY "turns_delete_admin_only" ON turns
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.5 Tabla: operators

```sql
-- Todos pueden ver sus propias asignaciones
CREATE POLICY "operators_select_own" ON operators
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Admin puede ver todas las asignaciones
CREATE POLICY "operators_select_admin" ON operators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin puede crear asignaciones
CREATE POLICY "operators_insert_admin_only" ON operators
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin puede actualizar asignaciones
CREATE POLICY "operators_update_admin_only" ON operators
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin puede eliminar asignaciones
CREATE POLICY "operators_delete_admin_only" ON operators
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3.6 Tabla: push_subscriptions

```sql
-- Usuarios ven solo sus propias suscripciones
CREATE POLICY "push_subscriptions_select_own" ON push_subscriptions
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Usuarios crean solo sus propias suscripciones
CREATE POLICY "push_subscriptions_insert_own" ON push_subscriptions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Usuarios eliminan solo sus propias suscripciones
CREATE POLICY "push_subscriptions_delete_own" ON push_subscriptions
  FOR DELETE USING (
    auth.uid() = user_id
  );
```

### 3.7 Tabla: refresh_sessions

```sql
-- Usuarios ven solo sus propias sesiones
CREATE POLICY "refresh_sessions_select_own" ON refresh_sessions
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Solo el servidor puede manipular sesiones ( policies con SECURITY DEFINER )
-- El API de auth se encarga de esto
```

### 3.8 Resumen de Permisos por Rol

| Tabla | Citizen | Operator | Admin |
|-------|---------|----------|-------|
| users | SELECT own, UPDATE own | SELECT own, UPDATE own | ALL |
| entities | SELECT active | SELECT | ALL |
| services | SELECT active | SELECT service | ALL |
| turns | SELECT own, INSERT, CANCEL own | SELECT service, UPDATE turn | ALL |
| operators | SELECT own | SELECT own | ALL |
| push_subscriptions | ALL own | ALL own | ALL |
| refresh_sessions | — | — | — |

---

## 4. PATRONES DE TESTING

### 4.1 Estructura de Tests

```
tests/
├── unit/                      # Tests unitarios
│   ├── composables/
│   │   ├── useAuth.test.ts
│   │   ├── useTurnQueue.test.ts
│   │   └── useWebSocket.test.ts
│   ├── stores/
│   │   ├── auth.store.test.ts
│   │   └── turn.store.test.ts
│   ├── utils/
│   │   ├── turn.utils.test.ts
│   │   └── time.utils.test.ts
│   └── server/
│       ├── queries/
│       │   └── turns.queries.test.ts
│       └── utils/
│           └── jwt.utils.test.ts
│
├── e2e/                       # Tests E2E
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   ├── turns/
│   │   ├── create-turn.spec.ts
│   │   ├── cancel-turn.spec.ts
│   │   └── track-turn.spec.ts
│   └── operator/
│       ├── call-next.spec.ts
│       └── complete-turn.spec.ts
│
├── fixtures/                  # Datos de prueba
│   ├── users.ts
│   ├── entities.ts
│   └── turns.ts
│
└── support/                   # Helpers
    ├── auth.ts
    ├── db.ts
    └── api.ts
```

### 4.2 Tests Unitarios con Vitest

```typescript
// tests/unit/composables/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $api: mockApi,
    $authFetch: mockAuthFetch,
  }),
  useCookie: vi.fn((name: string) => ({
    value: mockTokens[name] || null,
  })),
  navigateTo: vi.fn(),
}))

const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
}

const mockAuthFetch = {
  post: vi.fn(),
  get: vi.fn(),
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('debe iniciar sesión con credenciales válidas', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'test@tuturno.co',
        fullName: 'Test User',
        role: 'citizen',
      }

      mockApi.post.mockResolvedValue({
        success: true,
        data: { user: mockUser, accessToken: 'mock-token' },
      })

      const { login } = useAuth()
      const result = await login('test@tuturno.co', 'password123')

      expect(result.success).toBe(true)
      expect(result.data?.user.email).toBe('test@tuturno.co')
      expect(mockApi.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@tuturno.co',
        password: 'password123',
      })
    })

    it('debe fallar con credenciales inválidas', async () => {
      mockApi.post.mockRejectedValue(
        createError({
          statusCode: 401,
          data: {
            success: false,
            error: { code: 'INVALID_CREDENTIALS', message: 'Credenciales incorrectas' },
          },
        })
      )

      const { login } = useAuth()
      const result = await login('wrong@tuturno.co', 'wrongpass')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('INVALID_CREDENTIALS')
    })

    it('no debe hacer login si el email no está verificado', async () => {
      mockApi.post.mockResolvedValue({
        success: false,
        error: { code: 'EMAIL_NOT_VERIFIED', message: 'Email no verificado' },
      })

      const { login } = useAuth()
      const result = await login('unverified@tuturno.co', 'password')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('EMAIL_NOT_VERIFIED')
    })
  })

  describe('logout', () => {
    it('debe limpiar el estado y redirigir', async () => {
      const { logout } = useAuth()
      await logout()

      expect(mockApi.post).toHaveBeenCalledWith('/api/auth/logout')
      expect(useNuxtApp().$router.push).toHaveBeenCalledWith('/auth/login')
    })
  })

  describe('hasRole', () => {
    it('debe retornar true para rol correcto', () => {
      const { hasRole } = useAuth()
      const authStore = useAuthStore()
      authStore.user = { ...authStore.user, role: 'admin' }

      expect(hasRole('admin')).toBe(true)
      expect(hasRole('citizen')).toBe(false)
    })

    it('debe aceptar múltiples roles', () => {
      const { hasRole } = useAuth()
      const authStore = useAuthStore()
      authStore.user = { ...authStore.user, role: 'operator' }

      expect(hasRole('operator', 'admin')).toBe(true)
      expect(hasRole('citizen', 'admin')).toBe(false)
    })
  })
})
```

```typescript
// tests/unit/server/utils/jwt.utils.test.ts
import { describe, it, expect } from 'vitest'
import { signAccessToken, verifyAccessToken } from '~/server/utils/jwt.utils'

describe('JWT Utils', () => {
  const testPayload = {
    sub: 'user-123',
    role: 'citizen',
    email: 'test@tuturno.co',
  }

  describe('signAccessToken', () => {
    it('debe crear un token válido', async () => {
      const token = await signAccessToken(testPayload)
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('debe incluir los claims correctos', async () => {
      const token = await signAccessToken(testPayload)
      const decoded = JSON.parse(atob(token.split('.')[1]))
      
      expect(decoded.sub).toBe(testPayload.sub)
      expect(decoded.role).toBe(testPayload.role)
      expect(decoded.email).toBe(testPayload.email)
    })

    it('debe establecer fecha de expiración', async () => {
      const token = await signAccessToken(testPayload)
      const decoded = JSON.parse(atob(token.split('.')[1]))
      
      expect(decoded.exp).toBeDefined()
      expect(decoded.exp).toBeGreaterThan(decoded.iat)
    })
  })

  describe('verifyAccessToken', () => {
    it('debe verificar un token válido', async () => {
      const token = await signAccessToken(testPayload)
      const decoded = await verifyAccessToken(token)
      
      expect(decoded.sub).toBe(testPayload.sub)
      expect(decoded.role).toBe(testPayload.role)
    })

    it('debe lanzar error con token expirado', async () => {
      const expiredToken = await signAccessToken({ ...testPayload })
      
      vi.useFakeTimers()
      vi.setSystemTime(Date.now() + 16 * 60 * 1000)

      await expect(verifyAccessToken(expiredToken)).rejects.toThrow()
      
      vi.useRealTimers()
    })

    it('debe lanzar error con token manipulado', async () => {
      const token = await signAccessToken(testPayload)
      const tamperedToken = `${token.slice(0, -5)}xxxxx`

      await expect(verifyAccessToken(tamperedToken)).rejects.toThrow()
    })
  })
})
```

### 4.3 Tests E2E con Playwright

```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Autenticación - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('debe mostrar formulario de login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible()
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('debe iniciar sesión con credenciales válidas', async ({ page }) => {
    await page.getByLabel(/correo electrónico/i).fill('ciudadano@tuturno.co')
    await page.getByLabel(/contraseña/i).fill('password123')
    
    await page.getByRole('button', { name: /entrar/i }).click()
    
    await expect(page).toHaveURL('/app')
    await expect(page.getByText(/bienvenido/i)).toBeVisible({ timeout: 5000 })
  })

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.getByLabel(/correo electrónico/i).fill('wrong@tuturno.co')
    await page.getByLabel(/contraseña/i).fill('wrongpass')
    
    await page.getByRole('button', { name: /entrar/i }).click()
    
    await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible()
    await expect(page).toHaveURL('/auth/login')
  })

  test('debe validar formato de email', async ({ page }) => {
    await page.getByLabel(/correo electrónico/i).fill('not-an-email')
    await page.getByLabel(/contraseña/i).fill('password123')
    
    await page.getByRole('button', { name: /entrar/i }).click()
    
    await expect(page.getByText(/correo electrónico inválido/i)).toBeVisible()
  })

  test('debe tener link a registro', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /crear una cuenta/i })
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL('/auth/register')
  })
})
```

```typescript
// tests/e2e/turns/create-turn.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsCiudadano, loginAsOperador } from 'tests/support/auth'

test.describe('Gestión de Turnos', () => {
  test('ciudadano puede solicitar un turno', async ({ page }) => {
    await loginAsCiudadano(page)
    await page.goto('/app/entities')
    
    await page.getByTestId('entity-card').first().click()
    await page.getByTestId('service-item').first().click()
    
    await expect(page.getByRole('heading', { name: /solicitar turno/i })).toBeVisible()
    
    await page.getByRole('button', { name: /solicitar turno/i }).click()
    
    await expect(page.getByTestId('turn-ticket')).toBeVisible({ timeout: 5000 })
    await expect(page.getByTestId('turn-number')).toBeVisible()
  })

  test('ciudadano puede cancelar su turno en espera', async ({ page }) => {
    await loginAsCiudadano(page)
    await page.goto('/app/turns')
    
    const turnCard = page.getByTestId('turn-card').first()
    await expect(turnCard).toBeVisible()
    
    await turnCard.getByRole('button', { name: /cancelar/i }).click()
    await page.getByRole('button', { name: /confirmar/i }).click()
    
    await expect(page.getByText(/turno cancelado/i)).toBeVisible()
  })

  test('operador puede llamar siguiente turno', async ({ page, context }) => {
    const citizenPage = await context.newPage()
    const operatorPage = await context.newPage()
    
    await loginAsCiudadano(citizenPage)
    await citizenPage.goto('/app/entities/eps-sura/service-general')
    await citizenPage.getByRole('button', { name: /solicitar turno/i }).click()
    
    await loginAsOperador(operatorPage)
    await operatorPage.goto('/operator')
    
    const callButton = operatorPage.getByRole('button', { name: /llamar siguiente/i })
    await expect(callButton).toBeEnabled()
    await callButton.click()
    
    await expect(operatorPage.getByTestId('current-turn-display')).toBeVisible()
  })
})
```

### 4.4 Helpers de Testing

```typescript
// tests/support/auth.ts
import type { Page } from '@playwright/test'

export async function loginAsCiudadano(page: Page): Promise<void> {
  await page.goto('/auth/login')
  await page.getByLabel(/correo electrónico/i).fill('ciudadano@tuturno.co')
  await page.getByLabel(/contraseña/i).fill('password123')
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL('/app')
}

export async function loginAsOperador(page: Page): Promise<void> {
  await page.goto('/auth/login')
  await page.getByLabel(/correo electrónico/i).fill('operador@tuturno.co')
  await page.getByLabel(/contraseña/i).fill('password123')
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL('/operator')
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/auth/login')
  await page.getByLabel(/correo electrónico/i).fill('admin@tuturno.co')
  await page.getByLabel(/contraseña/i).fill('password123')
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL('/admin')
}
```

```typescript
// tests/support/db.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '~/server/db/schema'

const testDb = drizzle(':memory:', { schema })

export { testDb }

export async function seedTestData() {
  // Clean existing data
  await testDb.delete(schema.turns)
  await testDb.delete(schema.operators)
  await testDb.delete(schema.services)
  await testDb.delete(schema.entities)
  await testDb.delete(schema.users)
  
  // Seed test data
  // ...
}
```

### 4.5 Comandos de Testing

```bash
# package.json scripts
{
  "test": "vitest",
  "test:unit": "vitest run tests/unit",
  "test:e2e": "playwright test",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## 5. CONFIGURACIÓN PWA

### 5.1 manifest.json

```json
{
  "name": "TuTurno - Turnos Digitales",
  "short_name": "TuTurno",
  "description": "Sistema de gestión de turnos digitales para entidades en Colombia",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D14",
  "theme_color": "#6C3AE8",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "es-CO",
  "categories": ["productivity", "government"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-home.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Pantalla principal del ciudadano"
    },
    {
      "src": "/screenshots/mobile-turn.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Seguimiento de turno"
    }
  ],
  "shortcuts": [
    {
      "name": "Mis Turnos",
      "short_name": "Turnos",
      "url": "/app/turns",
      "description": "Ver mis turnos activos"
    },
    {
      "name": "Buscar Entidades",
      "short_name": "Buscar",
      "url": "/app/entities",
      "description": "Buscar entidades de atención"
    }
  ],
  "related_applications": [],
  "prefer_related_applications": false
}
```

### 5.2 Service Worker Completo

```typescript
// public/sw.js
const CACHE_NAME = 'tuturno-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

const API_CACHE_NAME = 'tuturno-api-v1'
const API_CACHE_URLS = [
  '/api/entities',
  '/api/services',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') {
    return
  }

  if (url.pathname.startsWith('/api/')) {
    if (API_CACHE_URLS.some((path) => url.pathname.startsWith(path))) {
      event.respondWith(staleWhileRevalidate(request, API_CACHE_NAME))
    } else {
      event.respondWith(networkFirst(request, API_CACHE_NAME))
    }
    return
  }

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request, CACHE_NAME))
  } else {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME))
  }
})

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    return new Response(JSON.stringify({ 
      success: false, 
      error: { code: 'OFFLINE', message: 'Sin conexión' } 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)

  return cached || fetchPromise
}

self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      turnId: data.turnId,
    },
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    tag: data.tag || 'tuturno-notification',
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    })
  )
})

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag)
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data?.type === 'GET_SUBSCRIPTION') {
    event.waitUntil(
      self.registration.pushManager.getSubscription().then((sub) => {
        event.ports[0].postMessage({ subscription: sub })
      })
    )
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-turns') {
    event.waitUntil(syncTurns())
  }
})

async function syncTurns() {
  const db = await openDatabase()
  const pendingTurns = await db.getAll('pending_turn_sync')
  
  for (const turn of pendingTurns) {
    try {
      await fetch('/api/turns', {
        method: 'POST',
        body: JSON.stringify(turn),
        headers: { 'Content-Type': 'application/json' },
      })
      await db.delete('pending_turn_sync', turn.id)
    } catch (e) {
      console.error('Sync failed for turn:', turn.id)
    }
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tuturno-db', 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
```

### 5.3 nuxt.config.ts PWA Configuration

```typescript
// nuxt.config.ts (sección PWA)
export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt',
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: false,
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /\/api\/entities/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-entities-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60,
            },
          },
        },
        {
          urlPattern: /\/api\/services/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-services-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 30,
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})
```

### 5.4 Notificaciones Push - Suscripción

```typescript
// composables/useNotifications.ts
export function useNotifications() {
  const isSupported = ref(false)
  const subscription = ref<PushSubscription | null>(null)
  const isLoading = ref(false)

  async function checkSupport() {
    if (!import.meta.client) return false
    isSupported.value = 'Notification' in window && 'serviceWorker' in navigator
    return isSupported.value
  }

  async function requestPermission(): Promise<NotificationPermission> {
    if (!isSupported.value) {
      throw new Error('Notifications not supported')
    }
    return await Notification.requestPermission()
  }

  async function subscribe(): Promise<PushSubscription | null> {
    if (!isSupported.value) return null
    
    const permission = await requestPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission denied')
    }

    isLoading.value = true
    try {
      const registration = await navigator.serviceWorker.ready
      
      const existingSub = await registration.pushManager.getSubscription()
      if (existingSub) {
        subscription.value = existingSub
        return existingSub
      }

      const vapidKey = useRuntimeConfig().public.vapidPublicKey
      
      const newSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      await $fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: {
          endpoint: newSub.endpoint,
          p256dh: arrayBufferToBase64(newSub.getKey('p256dh')!),
          auth: arrayBufferToBase64(newSub.getKey('auth')!),
        },
      })

      subscription.value = newSub
      return newSub
    } finally {
      isLoading.value = false
    }
  }

  async function unsubscribe() {
    if (!subscription.value) return

    await subscription.value.unsubscribe()
    await $fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      body: { endpoint: subscription.value.endpoint },
    })
    subscription.value = null
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  return {
    isSupported,
    subscription,
    isLoading,
    checkSupport,
    subscribe,
    unsubscribe,
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

---

## 6. ESTRUCTURA DE PLUGINS Y MIDDLEWARE

### 6.1 Plugins

```
plugins/
├── auth.client.ts              # Interceptor $fetch + auto-refresh
├── ws.client.ts                # WebSocket connection manager
├── pinia.ts                    # Pinia configuration
└── toast.client.ts             # Toast notification system
```

### auth.client.ts

```typescript
// Ver sección 1 para implementación completa
```

### ws.client.ts

```typescript
// plugins/ws.client.ts
import { useWebSocket } from '~/composables/useWebSocket'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const wsUrl = useRuntimeConfig().public.wsUrl

  let ws: ReturnType<typeof useWebSocket> | null = null

  function initWebSocket() {
    if (!authStore.isAuthenticated) return

    ws = useWebSocket({
      userId: computed(() => authStore.user?.id),
    })

    ws.connect()
  }

  function closeWebSocket() {
    if (ws) {
      ws.disconnect()
      ws = null
    }
  }

  nuxtApp.hook('app:mounted', () => {
    if (authStore.isAuthenticated) {
      initWebSocket()
    }
  })

  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
      initWebSocket()
    } else {
      closeWebSocket()
    }
  })

  nuxtApp.vueApp.provide('ws', {
    get ws() { return ws },
    reconnect: () => {
      closeWebSocket()
      initWebSocket()
    },
  })
})
```

### pinia.ts

```typescript
// plugins/pinia.ts
import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  
  if (import.meta.client) {
    pinia.use(({ store }) => {
      if (store.$id === 'auth') {
        const cookie = useCookie('access_token')
        if (cookie.value) {
          store.initFromToken(cookie.value)
        }
      }
    })
  }

  nuxtApp.vueApp.use(pinia)
})
```

### toast.client.ts

```typescript
// plugins/toast.client.ts
import Toast, { POSITION, TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 4000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
    transitions: {
      enter: 'toast-enter',
      exit: 'toast-exit',
    },
  }

  nuxtApp.vueApp.use(Toast, options)

  const toast = {
    success: (message: string, options?: object) => 
      nuxtApp.$toast.success(message, { type: TYPE.SUCCESS, ...options }),
    error: (message: string, options?: object) => 
      nuxtApp.$toast.error(message, { type: TYPE.ERROR, ...options }),
    warning: (message: string, options?: object) => 
      nuxtApp.$toast.warning(message, { type: TYPE.WARNING, ...options }),
    info: (message: string, options?: object) => 
      nuxtApp.$toast.info(message, { type: TYPE.INFO, ...options }),
    loading: (message: string) => 
      nuxtApp.$toast.loading(message, { type: TYPE.INFO, isLoading: true }),
  }

  nuxtApp.provide('toast', toast)
})
```

### 6.2 Middleware de Ruta

```
middleware/
├── auth.ts          # Requiere autenticación
├── guest.ts         # Solo para no autenticados
├── operator.ts      # Operador o Admin
└── admin.ts         # Solo Admin
```

### auth.ts

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (authStore.isTokenExpired) {
    try {
      await authStore.refreshToken()
    } catch {
      await authStore.logout()
      return navigateTo('/auth/login')
    }
  }
})
```

### guest.ts

```typescript
// middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    if (authStore.hasRole('admin')) {
      return navigateTo('/admin')
    }
    if (authStore.hasRole('operator')) {
      return navigateTo('/operator')
    }
    return navigateTo('/app')
  }
})
```

### operator.ts

```typescript
// middleware/operator.ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authStore.hasRole('operator', 'admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acceso solo para operadores',
    })
  }
})
```

### admin.ts

```typescript
// middleware/admin.ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authStore.hasRole('admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acceso solo para administradores',
    })
  }
})
```

### 6.3 Server Middleware

```
server/
├── middleware/
│   ├── auth.ts       # Verifica JWT en cada request
│   └── cors.ts       # Headers CORS
```

### server/middleware/auth.ts

```typescript
// server/middleware/auth.ts
import { verifyAccessToken } from '../utils/jwt.utils'

export default defineEventHandler(async (event) => {
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/entities',
    '/api/services',
  ]

  const path = getRequestURL(event).pathname
  
  if (!path.startsWith('/api/')) return
  if (publicPaths.some(p => path.startsWith(p))) return

  const authHeader = getHeader(event, 'authorization')
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const payload = await verifyAccessToken(token)
      event.context.user = payload
    } catch {
      // Token inválido o expirado
      // El API route individual decide qué hacer
    }
  }
})
```

---

## 7. PATRONES DE COMPOSABLES

### 7.1 Lista Completa de Composables

| Composable | Propósito | SSR-Safe | Auto-import |
|------------|-----------|----------|-------------|
| `useAuth` | Login, logout, estado de sesión, roles | ✅ | ✅ |
| `useTurnQueue` | Seguimiento de cola en tiempo real | ❌ | ✅ |
| `useWebSocket` | Conexión WebSocket, rooms, eventos | ❌ | ✅ |
| `useNotifications` | Push notifications, suscripción | ❌ | ✅ |
| `useEntities` | CRUD de entidades, búsqueda | ✅ | ✅ |
| `useTurns` | Mis turnos, crear, cancelar | ✅ | ✅ |
| `useToast` | Notificaciones UI | ❌ | ✅ |
| `useTimer` | Countdown, intervalos | ❌ | ✅ |
| `useOnline` | Estado de conexión | ❌ | ✅ |
| `useClipboard` | Copiar al portapapeles | ❌ | ✅ |

### 7.2 Patrones Generales

```typescript
// REGLA 1: Nomenclatura
// ✅ use + PascalCase + Nombre descriptivo
// ❌ useAuthenticate, useUserLogin, getUserData

// REGLA 2: Tipado estricto
export function useAuth() {
  interface User {
    id: string
    email: string
    fullName: string
    role: 'citizen' | 'operator' | 'admin'
  }
  
  // ...
}

// REGLA 3: SSR-Safe cuando sea posible
export function useEntities() {
  const config = useRuntimeConfig()
  
  async function fetchEntities() {
    // Para useFetch: server: false si usa cookies/auth
    return await useFetch<Entity[]>('/api/entities', {
      server: false,
      credentials: 'include',
    })
  }
}

// REGLA 4: Cleanup en onUnmounted
export function useTimer(callback: () => void, interval: number) {
  let timerId: ReturnType<typeof setInterval> | null = null
  
  function start() {
    timerId = setInterval(callback, interval)
  }
  
  function stop() {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }
  
  onUnmounted(stop)
  
  return { start, stop }
}

// REGLA 5: Probar el composable primero
export function useAuthFetch<T = unknown>(
  url: string,
  options?: ofetch.Options
) {
  const { $authFetch } = useNuxtApp()
  return $authFetch<T>(url, options)
}
```

### 7.3 Ejemplo Completo: useTurnQueue

```typescript
// composables/useTurnQueue.ts
export interface QueuePosition {
  position: number
  estimatedWait: number
  totalWaiting: number
  yourTurn: boolean
  turn: Turn
}

export function useTurnQueue(serviceId: Ref<string> | string) {
  const ws = useWs()
  const queueStore = useQueueStore()

  const serviceIdRef = computed(() => 
    typeof serviceId === 'string' ? serviceId : serviceId.value
  )

  const currentPosition = computed<QueuePosition | null>(() => {
    const queue = queueStore.getQueue(serviceIdRef.value)
    const myTurn = queue?.turns.find(t => t.citizenId === authStore.user?.id)
    
    if (!myTurn) return null
    
    const position = queue?.turns
      .filter(t => t.status === 'waiting')
      .findIndex(t => t.id === myTurn.id) ?? -1
    
    return {
      position: position + 1,
      estimatedWait: (position + 1) * (queue?.avgAttentionTime ?? 5),
      totalWaiting: queue?.turns.filter(t => t.status === 'waiting').length ?? 0,
      yourTurn: myTurn.status === 'called',
      turn: myTurn,
    }
  })

  function connect() {
    if (!serviceIdRef.value) return
    
    ws.subscribe(`service:${serviceIdRef.value}`)
    
    ws.on('QUEUE_UPDATED', (data) => {
      if (data.serviceId === serviceIdRef.value) {
        queueStore.updateQueue(serviceIdRef.value, data.queue)
      }
    })

    ws.on('YOUR_TURN', (data) => {
      if (data.turnId === currentPosition.value?.turn.id) {
        queueStore.setTurnCalled(serviceIdRef.value, data.turnId)
        
        if (import.meta.client) {
          navigator.serviceWorker.ready.then(sw => {
            sw.showNotification('¡Es tu turno!', {
              body: `Turno ${data.turnNumber} - Por favor dirígete al módulo`,
              tag: 'your-turn',
            })
          })
        }
      }
    })
  }

  function disconnect() {
    if (serviceIdRef.value) {
      ws.unsubscribe(`service:${serviceIdRef.value}`)
    }
  }

  onMounted(connect)
  onUnmounted(disconnect)
  watch(serviceIdRef, (newId, oldId) => {
    if (oldId) ws.unsubscribe(`service:${oldId}`)
    if (newId) ws.subscribe(`service:${newId}`)
  })

  return {
    currentPosition,
    queue: computed(() => queueStore.getQueue(serviceIdRef.value)),
    isConnected: ws.isConnected,
  }
}
```

### 7.4 Ejemplo: useNotifications

```typescript
// composables/useNotifications.ts
export function useNotifications() {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const subscription = ref<PushSubscription | null>(null)
  const isLoading= ref(false)

  async function init() {
    if (!import.meta.client) return
    
    isSupported.value = 'Notification' in window && 'serviceWorker' in navigator
    if (isSupported.value) {
      permission.value = Notification.permission
    }
  }

  async function requestPermission(): Promise<boolean> {
    if (!isSupported.value) return false
    
    const result = await Notification.requestPermission()
    permission.value = result
    return result === 'granted'
  }

  async function subscribe(): Promise<boolean> {
    if (permission.value !== 'granted') {
      const granted = await requestPermission()
      if (!granted) return false
    }

    isLoading.value = true
    try {
      const registration = await navigator.serviceWorker.ready
      const existing = await registration.pushManager.getSubscription()
      
      if (existing) {
        subscription.value = existing
        return true
      }

      const vapidKey = useRuntimeConfig().public.vapidPublicKey
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: createVapidKey(vapidKey),
      })

      await $fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: {
          endpoint: sub.endpoint,
          p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
          auth: arrayBufferToBase64(sub.getKey('auth')!),
        },
      })

      subscription.value = sub
      return true
    } catch (e) {
      console.error('Push subscription failed:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function unsubscribe(): Promise<void> {
    if (!subscription.value) return

    await subscription.value.unsubscribe()
    await $fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      body: { endpoint: subscription.value.endpoint },
    })
    subscription.value = null
  }

  function createVapidKey(base64: string): Uint8Array {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(b64)
    const arr = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; i++) {
      arr[i] = raw.charCodeAt(i)
    }
    return arr
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  init()

  return {
    isSupported: readonly(isSupported),
    permission: readonly(permission),
    subscription: readonly(subscription),
    isLoading: readonly(isLoading),
    requestPermission,
    subscribe,
    unsubscribe,
  }
}
```

---

## 8. ZOD SCHEMAS

### 8.1 Auth Schemas

```typescript
// schemas/auth.schema.ts
import { z } from 'zod'

// ─── Reusable Types ─────────────────────────────────────────────────────
export const EmailSchema = z.string().email('Correo electrónico inválido')

export const PasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')

export const DocumentIdSchema = z
  .string()
  .min(5, 'Cédula inválida')
  .max(15, 'Cédula inválida')
  .regex(/^[0-9]+$/, 'La cédula solo debe contener números')

export const PhoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'Teléfono inválido')

export const UuidSchema = z.string().uuid('ID inválido')

// ─── Register ──────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .trim(),
  documentId: DocumentIdSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  password: PasswordSchema,
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm'],
})

export type RegisterInput = z.infer<typeof RegisterSchema>

// ─── Login ─────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Contraseña requerida'),
})

export type LoginInput = z.infer<typeof LoginSchema>

// ─── Refresh ────────────────────────────────────────────────────────────
export const RefreshSchema = z.object({
  refreshToken: z.string().optional(),
})

// ─── Forgot Password ────────────────────────────────────────────────────
export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
})

// ─── Reset Password ────────────────────────────────────────────────────
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: PasswordSchema,
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm'],
})
```

### 8.2 User Schemas

```typescript
// schemas/user.schema.ts
import { z } from 'zod'
import { EmailSchema, DocumentIdSchema, PhoneSchema, UuidSchema } from './auth.schema'

export const UserRoleSchema = z.enum(['citizen', 'operator', 'admin'])

export const UserSchema = z.object({
  id: UuidSchema,
  fullName: z.string().min(2).max(100),
  documentId: DocumentIdSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  role: UserRoleSchema,
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>

export const UserUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: PhoneSchema.optional(),
})

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>

export const OperatorAssignSchema = z.object({
  userId: UuidSchema,
  serviceId: UuidSchema,
  entityId: UuidSchema,
})

export type OperatorAssignInput = z.infer<typeof OperatorAssignSchema>
```

### 8.3 Entity Schemas

```typescript
// schemas/entity.schema.ts
import { z } from 'zod'
import { UuidSchema } from './auth.schema'

export const EntityTypeSchema = z.enum(['eps', 'bank', 'public_office', 'other'])

export const EntitySchema = z.object({
  id: UuidSchema,
  name: z.string().min(2).max(200),
  type: EntityTypeSchema,
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
})

export type Entity = z.infer<typeof EntitySchema>

export const EntityCreateSchema = z.object({
  name: z.string().min(2).max(200),
  type: EntityTypeSchema,
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().url().optional(),
})

export type EntityCreateInput = z.infer<typeof EntityCreateSchema>

export const EntityUpdateSchema = EntityCreateSchema.partial()

export type EntityUpdateInput = z.infer<typeof EntityUpdateSchema>

export const EntitySearchSchema = z.object({
  query: z.string().optional(),
  type: EntityTypeSchema.optional(),
  city: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().optional(),
})

export type EntitySearchInput = z.infer<typeof EntitySearchSchema>
```

### 8.4 Service Schemas

```typescript
// schemas/service.schema.ts
import { z } from 'zod'
import { UuidSchema } from './auth.schema'

export const ServiceSchema = z.object({
  id: UuidSchema,
  entityId: UuidSchema,
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  avgAttentionTime: z.number().int().positive(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
  isActive: z.boolean(),
  isPaused: z.boolean(),
})

export type Service = z.infer<typeof ServiceSchema>

export const ServiceCreateSchema = z.object({
  entityId: UuidSchema,
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  avgAttentionTime: z.number().int().positive().default(5),
  openTime: z.string().regex(/^\d{2}:\d{2}$/).default('08:00'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/).default('17:00'),
})

export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>

export const ServiceUpdateSchema = ServiceCreateSchema.partial()

export type ServiceUpdateInput = z.infer<typeof ServiceUpdateSchema>

export const ServiceWithEntitySchema = ServiceSchema.extend({
  entity: z.object({
    id: UuidSchema,
    name: z.string(),
    type: z.string(),
    address: z.string(),
  }),
})

export type ServiceWithEntity = z.infer<typeof ServiceWithEntitySchema>
```

### 8.5 Turn Schemas

```typescript
// schemas/turn.schema.ts
import { z } from 'zod'
import { UuidSchema } from './auth.schema'

export const TurnStatusSchema = z.enum([
  'waiting',
  'called',
  'attending',
  'completed',
  'no_show',
  'cancelled',
])

export const TurnSchema = z.object({
  id: UuidSchema,
  turnNumber: z.string().regex(/^[A-Z]-\d{3}$/),
  citizenId: UuidSchema,
  serviceId: UuidSchema,
  entityId: UuidSchema,
  status: TurnStatusSchema,
  queuePosition: z.number().int().positive(),
  notifiedAt: z.string().datetime().nullable(),
  calledAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

export type Turn = z.infer<typeof TurnSchema>

export const TurnCreateSchema = z.object({
  serviceId: UuidSchema,
})

export type TurnCreateInput = z.infer<typeof TurnCreateSchema>

export const TurnResponseSchema = TurnSchema.extend({
  service: z.object({
    id: UuidSchema,
    name: z.string(),
    avgAttentionTime: z.number(),
  }),
  entity: z.object({
    id: UuidSchema,
    name: z.string(),
    address: z.string(),
  }),
})

export type TurnResponse = z.infer<typeof TurnResponseSchema>

export const QueueStateSchema = z.object({
  serviceId: UuidSchema,
  waitingCount: z.number().int().nonnegative(),
  avgAttentionTime: z.number().int().positive(),
  turns: z.array(TurnSchema),
  yourPosition: z.number().int().positive().nullable(),
  yourTurnId: UuidSchema.nullable(),
})

export type QueueState = z.infer<typeof QueueStateSchema>
```

### 8.6 API Response Schemas

```typescript
// schemas/api.schema.ts
import { z } from 'zod'

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z
      .object({
        total: z.number().int().optional(),
        page: z.number().int().optional(),
        perPage: z.number().int().optional(),
      })
      .optional(),
  })

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    meta: z.object({
      total: z.number().int(),
      page: z.number().int(),
      perPage: z.number().int(),
      totalPages: z.number().int(),
    }),
  })

export type ApiSuccess<T> = z.infer<ReturnType<typeof ApiSuccessSchema<T>>>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<T>>>
```

### 8.7 Notification Schemas

```typescript
// schemas/notification.schema.ts
import { z } from 'zod'
import { UuidSchema } from './auth.schema'

export const PushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
})

export type PushSubscriptionInput = z.infer<typeof PushSubscriptionSchema>

export const NotificationPreferencesSchema = z.object({
  turnCalled: z.boolean().default(true),
  turnUpcoming: z.boolean().default(true),
  turnCompleted: z.boolean().default(true),
  promotions: z.boolean().default(false),
})

export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>
```

### 8.8 Validation Middleware Helper

```typescript
// server/utils/validate.utils.ts
import { z } from 'zod'
import type { H3Event } from 'h3'
import { ApiError } from './error.utils'

type ZodSchema = z.ZodType<unknown>

export async function validateBody<T>(
  event: H3Event,
  schema: ZodSchema
): Promise<T> {
  const body = await readBody(event)
  
  const result = schema.safeParse(body)
  
  if (!result.success) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      'Error de validación',
      result.error.flatten()
    )
  }
  
  return result.data as T
}

export function validateQuery<T>(
  query: Record<string, unknown>,
  schema: ZodSchema
): T {
  const result = schema.safeParse(query)
  
  if (!result.success) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      'Parámetros de consulta inválidos',
      result.error.flatten()
    )
  }
  
  return result.data as T
}
```

---

## CHECKLIST DE IMPLEMENTACIÓN

- [ ] Plugin `plugins/auth.client.ts` con interceptor ofetch
- [ ] Páginas de error `error.vue` + 401/403/404/500
- [ ] Wrapper de errores en `server/utils/error.utils.ts`
- [ ] Logger en `server/utils/logger.utils.ts`
- [ ] Error boundary component `ErrorBoundary.vue`
- [ ] RLS policies aplicadas en Supabase
- [ ] Tests unitarios para composables críticos
- [ ] Tests E2E para flujos principales
- [ ] Configuración PWA en `nuxt.config.ts`
- [ ] Service Worker completo en `public/sw.js`
- [ ] manifest.json con todos los iconos
- [ ] Composables `useAuth`, `useTurnQueue`, `useWebSocket`, `useNotifications`
- [ ] Middleware `auth.ts`, `guest.ts`, `operator.ts`, `admin.ts`
- [ ] Schemas Zod para auth, user, entity, service, turn
- [ ] Helper de validación `validateBody` en server/utils

---

*Documento creado para TuTurno — Universidad de Córdoba*