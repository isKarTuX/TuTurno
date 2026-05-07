# Contratos de API — TuTurno

> **Base:** Este documento sigue las mejores prácticas de REST API Design. Todos los endpoints usan convenciones REST, respuestas tipadas, y manejo de errores estandarizado.

---

## Convenciones

### Formato de Respuesta

```typescript
// Éxito
interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
}

// Error
interface ApiError {
  success: false
  error: {
    code: string      // 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | etc.
    message: string
    details?: unknown
  }
}

type ApiResponse<T> = ApiSuccess<T> | ApiError
```

### Códigos de Estado HTTP

| Código | Uso | Ejemplo |
|--------|-----|---------|
| 200 | Éxito normal | GET, PUT, PATCH |
| 201 | Recurso creado | POST register, POST create |
| 400 | Error de validación | Zod fail, business rule violation |
| 401 | No autenticado | Sin token, token expirado |
| 403 | No autorizado | Rol insuficiente |
| 404 | Recurso no encontrado | GET /turns/999 |
| 409 | Conflicto | Email ya existe |
| 429 | Rate limit | Demasiados intentos |
| 500 | Error interno | Excepción no manejada |

### Autenticación

- **Auth requerida: Sí** → Requiere access token en header `Authorization: Bearer <token>` o cookie httpOnly
- **Auth requerida: No** → Endpoint público
- **Roles permitidos** → Lista de roles que pueden acceder

---

## Auth

### POST /api/auth/register

**Auth requerida:** No
**Roles permitidos:** —

**Request body:**
```typescript
{
  fullName: string,      // min 2 chars
  documentId: string,    // Cédula, 6-12 dígitos
  email: string,         // Email válido
  phone: string,         // Teléfono colombiano
  password: string       // min 8 chars
}
```

**Response 201:**
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      fullName: string,
      email: string,
      role: 'citizen'
    },
    accessToken: string,
    refreshToken: string
  }
}
```

**Response 400:**
```typescript
{
  success: false,
  error: { code: 'VALIDATION_ERROR', message: '...', details: ZodError }
}
```

**Response 409:**
```typescript
{
  success: false,
  error: { code: 'EMAIL_EXISTS', message: 'El email ya está registrado' }
}
```

---

### POST /api/auth/login

**Auth requerida:** No
**Roles permitidos:** —

**Request body:**
```typescript
{
  email: string,
  password: string
}
```

**Response 200:**
```typescript
{
  success: true,
  data: {
    user: User,
    accessToken: string,
    refreshToken: string
  }
}
```

**Response 401:**
```typescript
{
  success: false,
  error: { code: 'INVALID_CREDENTIALS', message: 'Email o contraseña incorrectos' }
}
```

---

### POST /api/auth/refresh

**Auth requerida:** No (solo requiere cookie refresh_token)
**Roles permitidos:** —

**Request body:** `{}` (vacío)

**Response 200:**
```typescript
{
  success: true,
  data: {
    accessToken: string,
    refreshToken: string  // Nuevo (rotación)
  }
}
```

**Response 401:**
```typescript
{
  success: false,
  error: { code: 'SESSION_EXPIRED', message: 'La sesión ha expirado' }
}
```

---

### POST /api/auth/logout

**Auth requerida:** Sí
**Roles permitidos:** citizen, operator, admin

**Request body:** `{}` (vacío)

**Response 200:**
```typescript
{
  success: true,
  data: { message: 'Sesión cerrada' }
}
```

---

### GET /api/auth/me

**Auth requerida:** Sí
**Roles permitidos:** citizen, operator, admin

**Response 200:**
```typescript
{
  success: true,
  data: { user: User }
}
```

**Response 401:**
```typescript
{
  success: false,
  error: { code: 'UNAUTHORIZED', message: 'No autenticado' }
}
```

---

## Turnos

### POST /api/turns

**Auth requerida:** Sí
**Roles permitidos:** citizen

**Request body:**
```typescript
{
  serviceId: string
}
```

**Response 201:**
```typescript
{
  success: true,
  data: {
    turn: Turn,
    estimatedWaitMinutes: number,
    queuePosition: number
  }
}
```

**Response 400:**
```typescript
{
  success: false,
  error: { code: 'MAX_TURNS_EXCEEDED', message: 'Máximo 3 turnos activos' }
}
// ó
{
  success: false,
  error: { code: 'SERVICE_CLOSED', message: 'El servicio no está en horario de atención' }
}
// ó
{
  success: false,
  error: { code: 'SERVICE_PAUSED', message: 'El servicio está pausado' }
}
```

---

### GET /api/turns

**Auth requerida:** Sí
**Roles permitidos:** citizen (sus turnos), operator/admin (todos)

**Query params:**
```typescript
{
  status?: TurnStatus | TurnStatus[],
  entityId?: string,
  serviceId?: string
}
```

**Response 200:**
```typescript
{
  success: true,
  data: Turn[]
}
```

---

### GET /api/turns/:id

**Auth requerida:** Sí
**Roles permitidos:** citizen (dueño), operator, admin

**Response 200:**
```typescript
{
  success: true,
  data: Turn & {
    entity: Entity,
    service: Service,
    estimatedWaitMinutes: number
  }
}
```

**Response 404:**
```typescript
{
  success: false,
  error: { code: 'NOT_FOUND', message: 'Turno no encontrado' }
}
```

---

### DELETE /api/turns/:id

**Auth requerida:** Sí
**Roles permitidos:** citizen (dueño)

**Response 200:**
```typescript
{
  success: true,
  data: { message: 'Turno cancelado' }
}
```

**Response 400:**
```typescript
{
  success: false,
  error: { code: 'CANNOT_CANCEL', message: 'Solo se pueden cancelar turnos en espera' }
}
```

**Response 403:**
```typescript
{
  success: false,
  error: { code: 'FORBIDDEN', message: 'No eres el dueño de este turno' }
}
```

---

## Entidades

### GET /api/entities

**Auth requerida:** No

**Query params:**
```typescript
{
  page?: number,      // default 1
  perPage?: number,   // default 20
  search?: string,
  type?: 'eps' | 'bank' | 'public_office' | 'other'
}
```

**Response 200:**
```typescript
{
  success: true,
  data: Entity[],
  meta: { total: number, page: number, perPage: number }
}
```

---

### GET /api/entities/:id

**Auth requerida:** No

**Response 200:**
```typescript
{
  success: true,
  data: Entity & { services: Service[] }
}
```

**Response 404:**
```typescript
{
  success: false,
  error: { code: 'NOT_FOUND', message: 'Entidad no encontrada' }
}
```

---

### POST /api/entities

**Auth requerida:** Sí
**Roles permitidos:** admin

**Request body:**
```typescript
{
  name: string,
  type: 'eps' | 'bank' | 'public_office' | 'other',
  address: string,
  city: string,
  latitude?: number,
  longitude?: number,
  phone?: string,
  email?: string,
  logoUrl?: string
}
```

**Response 201:**
```typescript
{
  success: true,
  data: Entity
}
```

---

### PATCH /api/entities/:id

**Auth requerida:** Sí
**Roles permitidos:** admin

**Request body:** (parcial)
```typescript
{
  name?: string,
  address?: string,
  isActive?: boolean,
  // ... cualquier campo
}
```

**Response 200:**
```typescript
{
  success: true,
  data: Entity
}
```

---

## Servicios

### GET /api/services

**Auth requerida:** No

**Query params:**
```typescript
{
  entityId?: string,
  isActive?: boolean
}
```

**Response 200:**
```typescript
{
  success: true,
  data: Service[]
}
```

---

### GET /api/services/:id

**Auth requerida:** No

**Response 200:**
```typescript
{
  success: true,
  data: Service & { entity: Entity }
}
```

---

### GET /api/services/:id/queue

**Auth requerida:** No

**Response 200:**
```typescript
{
  success: true,
  data: {
    service: Service,
    currentTurn: Turn | null,
    queue: Turn[],
    waitingCount: number,
    avgAttentionTime: number,
    estimatedWaitMinutes: number
  }
}
```

---

### POST /api/services

**Auth requerida:** Sí
**Roles permitidos:** admin

**Request body:**
```typescript
{
  entityId: string,
  name: string,
  description?: string,
  avgAttentionTime?: number,  // default 5
  openTime?: string,         // default '08:00'
  closeTime?: string         // default '17:00'
}
```

**Response 201:**
```typescript
{
  success: true,
  data: Service
}
```

---

### PATCH /api/services/:id

**Auth requerida:** Sí
**Roles permitidos:** admin

**Request body:** (parcial)
```typescript
{
  name?: string,
  isPaused?: boolean,
  isActive?: boolean,
  avgAttentionTime?: number
}
```

**Response 200:**
```typescript
{
  success: true,
  data: Service
}
```

---

## Operador

### GET /api/operator/queue

**Auth requerida:** Sí
**Roles permitidos:** operator, admin

**Response 200:**
```typescript
{
  success: true,
  data: {
    service: Service,
    currentTurn: Turn | null,
    waitingQueue: Turn[],
    stats: {
      waitingCount: number,
      avgWaitMinutes: number
    }
  }
}
```

---

### POST /api/operator/call-next

**Auth requerida:** Sí
**Roles permitidos:** operator, admin

**Request body:**
```typescript
{
  serviceId: string
}
```

**Response 200:**
```typescript
{
  success: true,
  data: {
    turn: Turn,
    queue: Turn[]
  }
}
```

---

### POST /api/operator/complete

**Auth requerida:** Sí
**Roles permitidos:** operator, admin

**Request body:**
```typescript
{
  turnId: string
}
```

**Response 200:**
```typescript
{
  success: true,
  data: {
    turn: Turn,
    nextTurn: Turn | null
  }
}
```

---

### POST /api/operator/no-show

**Auth requerida:** Sí
**Roles permitidos:** operator, admin

**Request body:**
```typescript
{
  turnId: string
}
```

**Response 200:**
```typescript
{
  success: true,
  data: { message: 'Turno marcado como no presentado' }
}
```

---

## Admin

### GET /api/admin/metrics

**Auth requerida:** Sí
**Roles permitidos:** admin

**Query params:**
```typescript
{
  from?: string,  // ISO date
  to?: string     // ISO date
}
```

**Response 200:**
```typescript
{
  success: true,
  data: {
    today: {
      turnsCreated: number,
      turnsCompleted: number,
      turnsCancelled: number,
      avgWaitMinutes: number
    },
    totalEntities: number,
    totalServices: number,
    totalOperators: number,
    totalCitizens: number
  }
}
```

---

### GET /api/admin/operators

**Auth requerida:** Sí
**Roles permitidos:** admin

**Response 200:**
```typescript
{
  success: true,
  data: (Operator & { user: User, service: Service, entity: Entity })[]
}
```

---

### POST /api/admin/operators

**Auth requerida:** Sí
**Roles permitidos:** admin

**Request body:**
```typescript
{
  userId: string,
  entityId: string,
  serviceId: string
}
```

**Response 201:**
```typescript
{
  success: true,
  data: Operator
}
```

---

## Notificaciones

### POST /api/notifications/subscribe

**Auth requerida:** Sí
**Roles permitidos:** citizen, operator, admin

**Request body:**
```typescript
{
  endpoint: string,
  p256dh: string,
  auth: string
}
```

**Response 200:**
```typescript
{
  success: true,
  data: { message: 'Suscripción guardada' }
}
```

---

### DELETE /api/notifications/subscribe

**Auth requerida:** Sí
**Roles permitidos:** citizen, operator, admin

**Response 200:**
```typescript
{
  success: true,
  data: { message: 'Suscripción eliminada' }
}
```

---

## Tipos Compartidos

```typescript
type TurnStatus = 'waiting' | 'called' | 'attending' | 'completed' | 'no_show' | 'cancelled'

interface User {
  id: string
  fullName: string
  email: string
  role: 'citizen' | 'operator' | 'admin'
  isActive: boolean
  createdAt: Date
}

interface Entity {
  id: string
  name: string
  type: 'eps' | 'bank' | 'public_office' | 'other'
  address: string
  city: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  logoUrl?: string
  isActive: boolean
  createdAt: Date
}

interface Service {
  id: string
  entityId: string
  name: string
  description?: string
  avgAttentionTime: number
  openTime: string
  closeTime: string
  isActive: boolean
  isPaused: boolean
}

interface Turn {
  id: string
  turnNumber: string
  citizenId: string
  serviceId: string
  entityId: string
  status: TurnStatus
  queuePosition: number
  notifiedAt?: Date
  calledAt?: Date
  completedAt?: Date
  createdAt: Date
}
```
