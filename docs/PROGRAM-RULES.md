# Reglas del Programa — TuTurno

> **Versión:** 1.0 | **Fecha:** Mayo 2026 | **Proyecto:** TuTurno
> **Propósito:** Documentar las reglas de negocio, limitaciones y restricciones del sistema.

---

## 1. Límites de Turnos

### 1.1 Turnos Activos por Ciudadano

| Límite | Valor | Descripción |
|--------|-------|-------------|
| Turnos activos máximo | **3** | Un ciudadano puede tener máximo 3 turnos simultáneamente |
| Estados considerados activos | `waiting`, `called`, `attending` | Estos estados cuentan para el límite |
| Estados no considerados | `completed`, `no_show`, `cancelled` | No cuentan para el límite |

**Implementación:**
```typescript
const MAX_ACTIVE_TURNS = 3

const activeTurns = db.select().from(turns)
  .where(and(
    eq(turns.citizenId, authUser.sub),
    sql`${turns.status} IN ('waiting', 'called', 'attending')`
  ))
  .all()

if (activeTurns.length >= MAX_ACTIVE_TURNS) {
  throw apiError('MAX_TURNS_EXCEEDED', `Máximo ${MAX_ACTIVE_TURNS} turnos activos`, 400)
}
```

**Códigos de error:**
| Código | HTTP | Descripción |
|--------|------|-------------|
| `MAX_TURNS_EXCEEDED` | 400 | El ciudadano ya tiene 3 turnos activos |

---

## 2. Ciclo de Vida del Turno

### 2.1 Estados

```
┌─────────┐    ┌────────┐    ┌───────────┐    ┌───────────┐
│ waiting │───▶│ called │───▶│ attending │───▶│ completed│
└─────────┘    └────────┘    └───────────┘    └───────────┘
     │              │
     │              │
     ▼              ▼
┌───────────┐  ┌──────────┐
│ cancelled │  │ no_show  │
└───────────┘  └──────────┘
```

### 2.2 Transiciones

| Desde | Hacia | Acción que dispara |
|-------|-------|-------------------|
| waiting | called | Operador llama el turno |
| waiting | cancelled | Ciudadano cancela |
| called | attending | Ciudadano llega al módulo |
| called | no_show | Operador marca como no presentado |
| called | cancelled | Operador cancela (edge case) |
| attending | completed | Operador completa atención |

### 2.3 Reglas de Transición

| Transición | Restricciones |
|------------|---------------|
| waiting → cancelled | Solo el dueño del turno o un admin pueden cancelar |
| waiting → called | Solo operadores o admins pueden ejecutar |
| called → attending | Automático cuando el ciudadano confirma llegada |
| called → no_show | Solo operadores o admins |
| attending → completed | Solo operadores o admins |

---

## 3. Numeración de Turnos

### 3.1 Formato

```
[PREFIX]-[SECUENCIAL-3-DÍGITOS]
Ejemplo: A-001, B-047, C-123
```

- **Prefijo (PREFIX):** Primera letra del nombre del servicio en mayúscula
- **Secuencial:** Número de 3 dígitos, starts at 001

### 3.2 Reset Diario

| Aspecto | Detalle |
|---------|---------|
| Momento de reset | 00:00 UTC-5 (hora de Colombia) |
| Alcance del reset | Por servicio, no global |
| Comportamiento | El contador se reinicia a 0, primera cita del día es 001 |

**Implementación:**
```typescript
function getColombiaDate() {
  const now = new Date()
  const colombiaOffset = -5 * 60
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (colombiaOffset * 60000))
}

function getStartOfDayColombia() {
  const colombiaDate = getColombiaDate()
  colombiaDate.setHours(0, 0, 0, 0)
  return colombiaDate
}

const todayStart = getStartOfDayColombia()
const todayStartTimestamp = Math.floor(todayStart.getTime() / 1000)

const lastTurn = db.select().from(turns)
  .where(and(
    eq(turns.serviceId, serviceId),
    gte(turns.createdAt, todayStartTimestamp)
  ))
  .orderBy(sql`queue_position DESC`)
  .limit(1)
  .get()
```

---

## 4. Posición en Cola

### 4.1 Cálculo Inicial

La posición en cola se asigna al momento de crear el turno:
- Turnos creados primero tienen posición menor
- La posición NO se reasigna automáticamente al completar o cancelar turnos anteriores

### 4.2 Recálculo al Cancelar

Cuando un turno en estado `waiting` es cancelado, las posiciones de los turnos restantes en el mismo servicio se decrementan en 1:

```typescript
db.update(turns)
  .set({ status: 'cancelled' })
  .where(eq(turns.id, cancelledTurnId))
  .run()

const affectedTurns = db.select().from(turns)
  .where(and(
    eq(turns.serviceId, cancelledTurn.serviceId),
    eq(turns.status, 'waiting'),
    gt(turns.queuePosition, cancelledTurn.queuePosition)
  ))
  .all()

for (const affectedTurn of affectedTurns) {
  db.update(turns)
    .set({ queuePosition: affectedTurn.queuePosition - 1 })
    .where(eq(turns.id, affectedTurn.id))
    .run()
}
```

### 4.3 Cálculo de Tiempo Estimado

```
Tiempo estimado = Posición en cola × Tiempo promedio de atención del servicio
```

Ejemplo: Posición 5, avgAttentionTime 5 min → 25 minutos estimados

---

## 5. Horarios de Atención

### 5.1 Formato

Los horarios se almacenan en formato `HH:MM` (24 horas):

| Campo | Default | Descripción |
|-------|---------|-------------|
| `openTime` | `08:00` | Hora de inicio de atención |
| `closeTime` | `17:00` | Hora de cierre de atención |

### 5.2 Validación

- Turnos NO pueden solicitarse fuera del horario
- El horario está en UTC-5 (Colombia)
- La validación compara con la hora actual en Colombia

---

## 6. Notificaciones

### 6.1 Tipos de Notificación

| Tipo | Cuándo | Contenido |
|------|--------|-----------|
| YOUR_TURN_SOON | Faltan 3 o menos turnos | "¡Te quedan X turnos!" |
| YOUR_TURN | Es tu turno | "¡Es tu turno! Acércate al módulo" |
| TURN_MISSED | No-show registrado | "No te presentaste a tu turno" |

### 6.2 Canal

- **Push notifications** vía Web Push API
- Requiere suscripción del usuario
- El subscription se almacena en `push_subscriptions`

---

## 7. Autenticación y Sesiones

### 7.1 Tokens

| Token | Tipo | Duración | Almacenamiento |
|-------|------|---------|---------------|
| Access Token | JWT (HS256) | 15 minutos | Cookie httpOnly |
| Refresh Token | UUID opaco | 7 días | Cookie httpOnly |

### 7.2 Rotación de Refresh Token

- Cada refresh invalida el token anterior
- Se genera un nuevo par de tokens
- Previene ataques de replay

### 7.3 Límite de Sesiones

- Un usuario puede tener múltiples sesiones activas (diferentes dispositivos)
- Cada logout invalida solo esa sesión

---

## 8. Roles y Permisos

### 8.1 Roles del Sistema

| Rol | Descripción | Alcance |
|-----|-------------|---------|
| `citizen` | Ciudadano común | Solo sus propios turnos |
| `operator` | Operador de atención | El servicio asignado |
| `admin` | Administrador | Todo el sistema |

### 8.2 Permisos por Rol

| Acción | Citizen | Operator | Admin |
|--------|---------|----------|-------|
| Crear turno | ✓ | ✗ | ✗ |
| Cancelar turno propio | ✓ | ✗ | ✗ |
| Ver cola | ✓ (su turno) | ✓ | ✓ |
| Llamar siguiente turno | ✗ | ✓ | ✓ |
| Completar turno | ✗ | ✓ | ✓ |
| Marcar no-show | ✗ | ✓ | ✓ |
| Pausar servicio | ✗ | ✗ | ✓ |
| Gestionar entidades | ✗ | ✗ | ✓ |

---

## 9. Índices de Base de Datos

### 9.1 Índices Requeridos

```sql
-- users: login rápido por email
CREATE INDEX idx_users_email ON users(email);

-- users: búsqueda por cédula
CREATE INDEX idx_users_document_id ON users(document_id);

-- refresh_sessions: búsqueda por token
CREATE INDEX idx_refresh_token ON refresh_sessions(token);

-- turns: cola de un servicio
CREATE INDEX idx_turns_service_queue ON turns(service_id, status);

-- turns: turnos de un ciudadano
CREATE INDEX idx_turns_citizen ON turns(citizen_id, status);

-- turns: búsqueda por fecha
CREATE INDEX idx_turns_created ON turns(created_at);
```

### 9.2 Implementación Drizzle

Los índices se definen en el segundo parámetro de `sqliteTable`:

```typescript
export const users = sqliteTable('users', {
  // ... columns
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_document_id').on(table.documentId),
])
```

---

## 10. Códigos de Error

### 10.1 Códigos de Turnos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `MAX_TURNS_EXCEEDED` | 400 | Máximo de turnos activos alcanzado |
| `SERVICE_UNAVAILABLE` | 400 | Servicio pausado o inactivo |
| `SERVICE_CLOSED` | 400 | outside horario de atención |
| `INVALID_STATUS` | 400 | Transición de estado inválida |
| `INVALID_DATE` | 400 | Fecha solicitada inválida |
| `NOT_FOUND` | 404 | Turno no encontrado |
| `FORBIDDEN` | 403 | No tienes acceso a este turno |

### 10.2 Códigos de Autenticación

| Código | HTTP | Descripción |
|--------|------|-------------|
| `UNAUTHORIZED` | 401 | Token requerido |
| `TOKEN_INVALID` | 401 | Token inválido o expirado |
| `SESSION_EXPIRED` | 401 | Refresh token expirado |
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `EMAIL_EXISTS` | 409 | Email ya registrado |
| `DOCUMENT_EXISTS` | 409 | Cédula ya registrada |

---

## 11. Variables de Configuración

| Variable | Default | Descripción |
|----------|---------|-------------|
| `MAX_ACTIVE_TURNS` | 3 | Turnos activos máximo por ciudadano |
| `NOTIFICATION_THRESHOLD` | 3 | Notificar cuando faltan X turnos |
| `TOKEN_EXPIRY` | 15m | Duración del access token |
| `REFRESH_TOKEN_EXPIRY` | 7d | Duración del refresh token |

---

*Documento creado: Mayo 2026*
*Proyecto TuTurno - Universidad de Córdoba*
