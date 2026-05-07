# Arquitectura WebSocket — TuTurno

> **Arquitectura:** Nuxt Nitro usa `crossws` para WebSockets, proporcionando una implementación ligera sobre el estándar WebSocket. El servidor mantiene rooms para broadcast groupcast y conexiones individuales para private messaging.

---

## 1. Diagrama de Rooms y Subscriptions

```
                           ┌─────────────────────────────────────────┐
                           │          Nitro Server (crossws)          │
                           │                                         │
                           │   Peer A (Operador Sura - service:eps)  │
                           │   Peer B (Ciudadano 1 - service:eps)     │
                           │   Peer C (Ciudadano 2 - service:eps)     │
                           │   Peer D (Operador Bancolombia)         │
                           │   Peer E (Ciudadano 3 - service:bank)   │
                           │                                         │
                           │   ┌─────────────────────────────────┐   │
                           │   │  Subscriptions:                  │   │
                           │   │                                  │   │
                           │   │  service:eps                     │   │
                           │   │    ├── Peer A                    │   │
                           │   │    ├── Peer B                    │   │
                           │   │    └── Peer C                    │   │
                           │   │                                  │   │
                           │   │  service:bank                    │   │
                           │   │    ├── Peer D                    │   │
                           │   │    └── Peer E                    │   │
                           │   │                                  │   │
                           │   │  user:uuid-1  (Ciudadano 1)       │   │
                           │   │    └── Peer B (private)           │   │
                           │   │                                  │   │
                           │   │  user:uuid-2  (Ciudadano 2)       │   │
                           │   │    └── Peer C (private)          │   │
                           │   │                                  │   │
                           │   │  user:uuid-3  (Ciudadano 3)       │   │
                           │   │    └── Peer E (private)          │   │
                           │   │                                  │   │
                           │   └─────────────────────────────────┘   │
                           └─────────────────────────────────────────┘
```

### Room Architecture

| Room Type | Pattern | Purpose | Subscribers |
|-----------|---------|---------|-------------|
| Service Room | `service:{serviceId}` | Broadcast cola del servicio | Operadores + Cidadanos viendo la cola |
| User Room | `user:{userId}` | Notificaciones privadas | Solo el ciudadano específico |
| Entity Room | `entity:{entityId}` | Broadcast a toda la entidad | Admin dashboard |

---

## 2. Contrato de Eventos

### Server → Client (broadcast)

| Evento | Room destino | Payload | Descripción |
|--------|--------------|---------|-------------|
| `QUEUE_UPDATED` | `service:{serviceId}` | `{ queue: Turn[], waitingCount: number }` | La cola cambió (nuevo turno, cancel, atención) |
| `TURN_CALLED` | `service:{serviceId}` + `user:{citizenId}` | `{ turn: Turn, position: number }` | Un turno fue llamado |
| `YOUR_TURN_SOON` | `user:{citizenId}` | `{ turnId: string, position: number }` | Faltan 3 turnos para ti |
| `YOUR_TURN` | `user:{citizenId}` | `{ turn: Turn }` | Es tu turno ahora |
| `SERVICE_PAUSED` | `service:{serviceId}` | `{ serviceId: string }` | El servicio fue pausado |
| `SERVICE_RESUMED` | `service:{serviceId}` | `{ serviceId: string }` | El servicio volvió |

### Client → Server

| Evento | Remitente | Payload | Descripción |
|--------|-----------|---------|-------------|
| `OPERATOR_ACTION` | Operador | `{ action: 'call_next' \| 'complete' \| 'no_show', turnId?: string, serviceId: string }` | Acción del operador |

### Message Protocol (TypeScript)

```typescript
// Tipos para los mensajes WebSocket

interface WSMessage {
  type: WS_EVENTS
  payload: unknown
  timestamp?: number
}

interface QueueUpdatedPayload {
  queue: Turn[]
  waitingCount: number
  avgAttentionTime: number
}

interface TurnCalledPayload {
  turn: Turn
  queuePosition: number
}

interface YourTurnSoonPayload {
  turnId: string
  position: number
  serviceName: string
}

interface YourTurnPayload {
  turn: Turn
  entityName: string
  serviceName: string
}

interface ServicePausedPayload {
  serviceId: string
  reason?: string
}

interface OperatorActionPayload {
  action: 'call_next' | 'complete' | 'no_show'
  turnId?: string
  serviceId: string
}

// Enum de eventos
enum WS_EVENTS {
  QUEUE_UPDATED = 'QUEUE_UPDATED',
  TURN_CALLED = 'TURN_CALLED',
  YOUR_TURN_SOON = 'YOUR_TURN_SOON',
  YOUR_TURN = 'YOUR_TURN',
  SERVICE_PAUSED = 'SERVICE_PAUSED',
  SERVICE_RESUMED = 'SERVICE_RESUMED',
  OPERATOR_ACTION = 'OPERATOR_ACTION',
}
```

---

## 3. Ciclo de Vida de una Conexión

### Connect

```typescript
// Client - composables/useWebSocket.ts
const wsUrl = useRuntimeConfig().public.wsUrl

export function useWebSocket(options: {
  serviceId?: Ref<string>
  userId?: Ref<string>
}) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)

  function connect() {
    const params = new URLSearchParams()
    if (options.serviceId.value) params.set('serviceId', options.serviceId.value)
    if (options.userId.value) params.set('userId', options.userId.value)

    const url = `${wsUrl}/_ws?${params.toString()}`
    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
    }

    ws.value.onclose = () => {
      isConnected.value = false
      scheduleReconnect()
    }

    ws.value.onerror = (error) => {
      console.error('WS error:', error)
    }
  }

  return { isConnected, connect, disconnect: () => ws.value?.close() }
}
```

```typescript
// Server (server/routes/_ws/turns.ts)
export default defineWebSocketHandler({
  open(peer) {
    const url = new URL(peer.request.url)
    const serviceId = url.searchParams.get('serviceId')
    const userId = url.searchParams.get('userId')

    if (serviceId) peer.subscribe(`service:${serviceId}`)
    if (userId) peer.subscribe(`user:${userId}`)

    console.log(`Peer connected: ${peer.id}, serviceId: ${serviceId}, userId: ${userId}`)
  }
})
```

### Message (Operador llama siguiente)

```typescript
// Client (operador)
ws.send(JSON.stringify({
  type: 'OPERATOR_ACTION',
  action: 'call_next',
  serviceId: 'uuid-del-servicio'
}))

// Server recibe
export default defineWebSocketHandler({
  async message(peer, message) {
    try {
      const data = JSON.parse(message.text())

      if (data.type === 'OPERATOR_ACTION') {
        const { action, serviceId, turnId } = data

        if (action === 'call_next') {
          // 1. Buscar siguiente turno waiting
          const turn = await getNextTurn(serviceId)
          if (!turn) return // No hay turnos en espera

          // 2. Actualizar DB: status='called', calledAt=now()
          await db.update(turns)
            .set({ status: 'called', calledAt: new Date() })
            .where(eq(turns.id, turn.id))

          // 3. Obtener cola actualizada
          const queue = await getWaitingQueue(serviceId)
          const waitingCount = queue.length

          // 4. Broadcast a todos en service:{serviceId}
          peer.publish(`service:${serviceId}`, JSON.stringify({
            type: 'QUEUE_UPDATED',
            payload: { queue, waitingCount }
          }))

          // 5. Notificar al ciudadano específico
          peer.publish(`user:${turn.citizenId}`, JSON.stringify({
            type: 'YOUR_TURN',
            payload: {
              turn,
              entityName: turn.entity.name,
              serviceName: turn.service.name
            }
          }))

          // 6. Enviar push notification si tiene suscripción
          if (turn.pushSubscription) {
            await sendPushNotification(turn.citizenId, {
              title: '¡Es tu turno!',
              body: `Acércate al módulo de atención. Turno ${turn.turnNumber}`,
              tag: 'your-turn',
              data: { turnId: turn.id }
            })
          }
        }

        if (action === 'complete') {
          // Similar: update status, broadcast, notify
        }
      }
    } catch (err) {
      console.error('WS message error:', err)
      peer.send(JSON.stringify({ type: 'ERROR', payload: { message: 'Invalid message format' } }))
    }
  }
})
```

### Heartbeat (Connection Health)

```typescript
// Ping/pong para mantener conexiones vivas y detectar clientes desconectados
const HEARTBEAT_INTERVAL = 30000 // 30 segundos

export default defineWebSocketHandler({
  open(peer) {
    // Setup heartbeat
    const heartbeat = setInterval(() => {
      peer.send(JSON.stringify({ type: 'PING' }))
    }, HEARTBEAT_INTERVAL)

    peer.on('close', () => clearInterval(heartbeat))
  },

  message(peer, message) {
    const data = JSON.parse(message.text())
    if (data.type === 'PONG') {
      // Connection alive
    }
  }
})
```

### Close (desconexión)

```typescript
// Server
export default defineWebSocketHandler({
  close(peer) {
    // crossws hace cleanup automático de subscriptions
    // No necesitamos hacer nada manualmente
    console.log('Peer disconnected:', peer.id)
  },

  error(peer, error) {
    console.error('WS error for peer:', peer.id, error)
  }
})
```

---

## 4. Estrategia de Reconexión

```typescript
// composables/useWebSocket.ts

const MAX_RECONNECT_ATTEMPTS = 5
const BASE_DELAY = 1000 // 1 segundo

function getReconnectDelay(attempt: number): number {
  return Math.min(BASE_DELAY * Math.pow(2, attempt), 16000)
}

async function scheduleReconnect() {
  if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
    console.error('WS: Max reconnection attempts reached')
    return
  }

  const delay = getReconnectDelay(reconnectAttempts.value)
  reconnectAttempts.value++

  await new Promise(r => setTimeout(r, delay))
  connect() // retry
}

// Backoff: 1s → 2s → 4s → 8s → 16s (máximo)
```

### Estados de la Conexión

| Estado | UI | Significado |
|--------|----|-------------|
| `connecting` | Spinner | Intentando conectar |
| `connected` | Normal | Conectado y recibiendo eventos |
| `reconnecting` | Banner "Reconectando..." | Conexión perdida, reintentando |
| `disconnected` | Banner "Sin conexión" | No se pudo conectar después de N intentos |
| `error` | Banner "Error de conexión" | Error específico (ej: servidor caído) |

---

## 5. Estados de la Conexión

| Estado | UI | Significado |
|--------|----|-------------|
| `connecting` | Spinner | Intentando conectar |
| `connected` | Normal | Conectado y recibiendo eventos |
| `reconnecting` | Banner "Reconectando..." | Conexión perdida, reintentando |
| `disconnected` | Banner "Sin conexión" | No se pudo conectar después de N intentos |
| `error` | Banner "Error de conexión" | Error específico (ej: servidor caído) |

### UI de Reconexión

```vue
<!-- TurnTracker.vue -->
<template>
  <div class="connection-status">
    <template v-if="wsState === 'reconnecting'">
      <UiSpinner size="sm" />
      <span>Reconectando...</span>
    </template>
    <template v-else-if="wsState === 'disconnected'">
      <Icon name="AlertCircle" class="text-red-500" />
      <span>Sin conexión</span>
      <UiButton size="sm" @click="reconnect">Reintentar</UiButton>
    </template>
  </div>
</template>
```

---

## 6. Ejemplo: Flujo Completo de Llamar Turno

```
1. Operador abre /operator/
   → WS conecta con ?serviceId=uuid&userId=operadorUuid

2. Ciudadano abre /app/turns/[id]
   → WS conecta con ?serviceId=uuid&userId=ciudadanoUuid

3. Operador presiona "Llamar siguiente"
   → ws.send({ type: 'OPERATOR_ACTION', action: 'call_next', serviceId })

4. Server procesa:
   a. SELECT * FROM turns WHERE serviceId=? AND status='waiting' ORDER BY queue_position LIMIT 1
   b. UPDATE turns SET status='called', calledAt=NOW() WHERE id=?
   c. Recalcular waitingCount
   d. Broadcast a service:uuid

5. Server broadcast a service:uuid:
   {
     type: 'QUEUE_UPDATED',
     payload: {
       queue: [turns actualizados],
       waitingCount: 5
     }
   }

6. Todos los clientes en service:uuid reciben QUEUE_UPDATED
   → OperatorQueue muestra turno como "called" (ámbar)
   → TurnTracker del ciudadano actualiza estado

7. Server envía notificación privada:
   peer.publish(`user:${ciudadanoUuid}`, {
     type: 'YOUR_TURN',
     payload: {
       turn: {...},
       entityName: 'EPS Sura',
       serviceName: 'Afiliaciones'
     }
   })

8. Cliente del ciudadano recibe YOUR_TURN
   → Vibración del teléfono (navigator.vibrate)
   → Toast "¡Es tu turno! Acércate al módulo."
```

---

## 7. Casos Edge y Manejo

### WS cae mientras se procesa una acción

- El servidor procesa la acción completa antes de cualquier respuesta
- Si el cliente se reconecta, recibirá el QUEUE_UPDATED en el proximo broadcast
- No hay problema de consistencia porque el estado está en la DB

### Operador llama turno pero el ciudadano tiene 2 tabs

- Ambas tabs están suscritas a user:{citizenId}
- Ambas reciben YOUR_TURN
- Ambas muestran "¡Es tu turno!"
- El primero en marcar "Comenzar atención" gana (debounce en el operador)

### Turno cancelado mientras alguien lo está viendo

- El QUEUE_UPDATED se envía a todos los subscribers
- Si el ciudadano tenía abierto ese turno específico, debe mostrar "Turno cancelado"

### Más de 100 conexiones simultáneas en el mismo servicio

- crossws + Nitro maneja esto nativamente
- No se requiere configuración adicional
- Si hay problemas de scale, considerar Redis adapter para múltiples instancias

### Service Worker en segundo plano (móvil)

- Cuando la app está en segundo plano, el Service Worker puede recibir mensajes push
- El WS puede estar desconectado, pero el Service Worker mantiene la conexión push
- Al reopen la app, recibiría el estado actualizado por WS

---

## 8. Monitoreo y Debugging

### Endpoints de Salud

```typescript
// server/api/ws/health.get.ts
export default defineEventHandler(() => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString()
  }
})

// server/api/ws/stats.get.ts (solo admin)
export default defineEventHandler(async (event) => {
  // const user = event.context.user
  // if (user?.role !== 'admin') throw createError({ statusCode: 403 })

  return {
    activeConnections: /* count from crossws peer manager */,
    rooms: [...io.sockets.adapter.rooms.keys()],
  }
})
```

### Logging

```typescript
// En producción, usar structured logging
console.log(JSON.stringify({
  event: 'ws_message',
  peerId: peer.id,
  type: data.type,
  timestamp: new Date().toISOString()
}))
```
