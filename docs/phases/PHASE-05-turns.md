# PHASE-05 — Sistema de Turnos

```
Estado: ✅ Completo
Agente responsable: Claude Code - Sesión 5
Depende de: PHASE-01 al PHASE-04
Tiempo estimado: 75 min
Completado: 2025-01-13
```

---

## 1. Objetivo

Implementar la creación, seguimiento y cancelación de turnos, incluyendo la lógica de numeración, posición en cola y generación de QR.

---

## 2. Lógica de Generación de Número de Turno

```typescript
// Algoritmo actual (simplificado sin daily reset)
function generateTurnNumber(service: Service): string {
  // 1. Obtener prefijo del servicio (primera letra del nombre en mayúscula)
  const prefix = service.name.charAt(0).toUpperCase()

  // 2. Contador global del servicio (se resetea diariamente en el código)
  // Repository: turns.queries.ts - getLastTurnByService(serviceId)
  const lastTurn = await getLastTurnByService(service.id)
  const lastSeq = lastTurn ? parseInt(lastTurn.turnNumber.split('-')[1]) : 0

  // 3. Formato: [Prefijo]-[Número-3-dígitos]
  const sequence = String(lastSeq + 1).padStart(3, '0')
  return `${prefix}-${sequence}`
  // Ejemplo: "A-001", "C-047", "L-123"
}

// Reset diario: Verificar en cada creación si el último turno fue ayer
// Si fue ayer, el secuencial se reinicia. Ver server/db/queries/turns.queries.ts
```

**Reset diario:** Se verifica la fecha del último turno creado. Si es un día nuevo, el secuencial se reinicia a 1. El contador no persiste entre días (no hay tabla `daily_counters` aún).

---

## 3. Reglas de Negocio

### Máximo de turnos activos por usuario

- Un ciudadano puede tener máximo **3 turnos activos** simultáneamente
- Turnos activos = status: `waiting` | `called` | `attending`
- Al intentar crear un 4to turno, retornar error `MAX_TURNS_EXCEEDED`
- **Implementado:** Validación en `server/api/turns/index.post.ts`

### Tiempo estimado de espera

```typescript
function estimateWaitTime(queuePosition: number, avgAttentionTime: number): number {
  return queuePosition * avgAttentionTime
}
// Ejemplo: posición 5, avg 5 min → 25 minutos estimados
```

### Qué pasa si el usuario no se presenta (no_show)

- Cuando un operador marca un turno como `no_show`:
  - El turno cambia a `no_show`
  - Se notifica al ciudadano
  - El turno permanece en historial para reportes

### Cancelación de turno

- Solo el dueño del turno puede cancelarlo
- Solo turnos en estado `waiting` pueden cancelarse
- Al cancelar, recalcular posiciones de los turnos restantes en cola
- **Implementado:** `server/api/turns/[id].delete.ts` - usa loop iterative, NO batch SQL

```typescript
// Implementación actual (iterativa, no batch):
// Al cancelar turno en posición X
// Iterar sobre todos los turnos waiting con position > X y decrementar en 1
const turnsToUpdate = await db.select().from(turns)
  .where(and(
    eq(turns.serviceId, cancelledTurn.serviceId),
    eq(turns.status, 'waiting'),
    gt(turns.queuePosition, cancelledTurn.queuePosition)
  ))

for (const turn of turnsToUpdate) {
  await db.update(turns)
    .set({ queuePosition: turn.queuePosition - 1 })
    .where(eq(turns.id, turn.id))
}
```

**Nota:** Drizzle 0.36.4 no soporta `$inc()` ni expresiones SQL en `.set()` con el segundo parámetro. Por eso se usa el loop.

---

## 4. Endpoints

### POST /api/turns

```typescript
// Request body
{
  serviceId: string
}

// Response 201
{
  success: true,
  data: {
    turn: Turn,
    estimatedWaitMinutes: number,
    queuePosition: number
  }
}

// Response 400
{
  success: false,
  error: { code: 'MAX_TURNS_EXCEEDED', message: 'Máximo 3 turnos activos' }
}

// Response 400
{
  success: false,
  error: { code: 'SERVICE_CLOSED', message: 'El servicio no está en horario de atención' }
}
```

**Auth requerida:** Sí (citizen)

---

### GET /api/turns

```typescript
// Query params
{
  status?: TurnStatus | TurnStatus[],  // filtrar por estado
  entityId?: string,
  serviceId?: string
}

// Response 200
{
  success: true,
  data: Turn[]
}
```

**Auth requerida:** Sí (citizen = solo los propios, admin/operator = todos)

---

### GET /api/turns/[id]

```typescript
// Response 200
{
  success: true,
  data: Turn & {
    entity: Entity,
    service: Service,
    estimatedWaitMinutes: number
  }
}
```

**Auth requerida:** Sí (dueño del turno, operator, admin)

---

### DELETE /api/turns/[id]

```typescript
// Response 200
{
  success: true,
  data: { message: 'Turno cancelado' }
}

// Response 400
{
  success: false,
  error: { code: 'CANNOT_CANCEL', message: 'Solo se pueden cancelar turnos en espera' }
}

// Response 403
{
  success: false,
  error: { code: 'FORBIDDEN', message: 'No eres el dueño de este turno' }
}
```

**Auth requerida:** Sí (dueño del turno)

---

## 5. Componentes

### TurnCard.vue

```typescript
interface Props {
  turn: Turn & { entity: Entity, service: Service }
  showActions?: boolean
}

interface Emits {
  (e: 'cancel', turnId: string): void
}
```

**Estados:** waiting (violeta), called (ámbar), attending (azul), completed (verde), no_show (rojo), cancelled (gris)

---

### TurnTicket.vue

```typescript
interface Props {
  turn: Turn
  showQR?: boolean   // default true
}
```

**Características:**
- Número grande con flip animation
- Nombre del servicio y entidad
- Fecha y hora de creación
- QR con turnId codificado
- Estado actual del turno
- Posición en cola (si aplica)

---

### TurnStatusBadge.vue

```typescript
type TurnStatus = 'waiting' | 'called' | 'attending' | 'completed' | 'no_show' | 'cancelled'

interface Props {
  status: TurnStatus,
  size?: 'sm' | 'md' | 'lg'
}
```

**Colores por estado:**
| Estado | Color | Label |
|--------|-------|-------|
| waiting | #6C3AE8 (violeta) | En espera |
| called | #F59E0B (ámbar) | Te están llamando |
| attending | #3B82F6 (azul) | En atención |
| completed | #10B981 (verde) | Atendido |
| no_show | #EF4444 (rojo) | No se presentó |
| cancelled | #6B7280 (gris) | Cancelado |

---

### TurnProgressBar.vue

```typescript
interface Props {
  currentPosition: number,
  totalWaiting: number,
  avgAttentionTime: number
}
```

**Características:**
- Barra de progreso animada
- Muestra "Turno X de Y"
- Tiempo estimado restante

---

## 6. Páginas

### /app/turns/index.vue

- Lista de turnos activos del ciudadano
- Filtros por estado
- TurnCards con acciones (cancelar)
- Estado vacío: "No tienes turnos activos"

### /app/turns/[id].vue

- TurnTicket completo con QR
- TurnProgressBar en tiempo real
- Historial de estados (timeline)
- Botón cancelar (si aplica)

### /app/entities/[id]/[serviceId].vue

- Selección de servicio
- Botón "Solicitar turno"
- Confirmación modal
- Redirigir a /app/turns/[id] al crear

---

## 7. Criterios de Éxito

- [ ] Crear turno genera número único (A-001, B-047, etc.)
- [ ] Posición en cola se calcula correctamente
- [ ] Tiempo estimado se calcula con avgAttentionTime
- [ ] Máximo 3 turnos activos por ciudadano
- [ ] Cancelar turno recalcula posiciones
- [ ] QR contiene turnId y es escaneable
- [ ] TurnStatusBadge muestra el color correcto
- [ ] Cancelar solo funciona para turnos en espera
