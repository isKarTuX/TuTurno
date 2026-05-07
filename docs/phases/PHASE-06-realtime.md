# PHASE-06 — Tiempo Real (WebSockets)

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 6
Depende de: PHASE-01 al PHASE-05
Tiempo estimado: 120 min (la más compleja)
```

---

## 1. Objetivo

Implementar el sistema de tiempo real con WebSockets para actualizar la cola de turnos instantáneamente cuando un operador llama, atiende o completa un turno.

---

## 2. Arquitectura WebSocket

```
┌──────────────┐                    ┌──────────────────────┐
│   Cliente    │                    │   Nitro Server       │
│  (Browser)   │◀═══ WS ════════════│   (crossws)          │
│              │                    │                      │
│  useWebSocket│                    │ server/routes/_ws/  │
│              │                    │   turns.ts          │
└──────────────┘                    └──────────┬───────────┘
                                                 │
                           ┌─────────────────────┼─────────────────────┐
                           │                     │                     │
                    ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐
                    │ service:eps  │       │ service:bank│       │ user:uuid1  │
                    │  (room)      │       │  (room)     │       │  (room)     │
                    └──────────────┘       └─────────────┘       └─────────────┘
```

**Rooms disponibles:**
- `service:{serviceId}` — Para operadores y ciudadanos viendo esa cola
- `user:{userId}` — Para notificaciones privadas al ciudadano

---

## 3. Contrato de Eventos

| Evento | Dirección | Payload | Emisor | Receptor |
|--------|-----------|---------|--------|----------|
| `QUEUE_UPDATED` | Server→Client | `{ queue: Turn[], waitingCount: number }` | Server | Todos en `service:{}` |
| `TURN_CALLED` | Server→Client | `{ turn: Turn, queuePosition: number }` | Server | Todos en `service:{}` + `user:{}` del ciudadano |
| `YOUR_TURN_SOON` | Server→Client | `{ turnId: string, position: number }` | Server | `user:{citizenId}` |
| `YOUR_TURN` | Server→Client | `{ turn: Turn }` | Server | `user:{citizenId}` |
| `SERVICE_PAUSED` | Server→Client | `{ serviceId: string }` | Server | Todos en `service:{}` |
| `SERVICE_RESUMED` | Server→Client | `{ serviceId: string }` | Server | Todos en `service:{}` |
| `OPERATOR_ACTION` | Client→Server | `{ action: 'call_next' | 'complete' | 'no_show', turnId: string }` | Operador | Server |

---

## 4. Handler del Servidor

```typescript
// server/routes/_ws/turns.ts
export default defineWebSocketHandler({
  open(peer) {
    const url = new URL(peer.request.url)
    const serviceId = url.searchParams.get('serviceId')
    const userId = url.searchParams.get('userId')

    if (serviceId) {
      peer.subscribe(`service:${serviceId}`)
    }
    if (userId) {
      peer.subscribe(`user:${userId}`)
    }
  },

  message(peer, message) {
    const data = JSON.parse(message.text())

    if (data.type === 'OPERATOR_ACTION') {
      // Validar que el peer es un operador
      // Ejecutar la acción (call_next, complete, no_show)
      // Broadcast a todos los interesados
    }
  },

  close(peer) {
    // Cleanup automático de subscriptions
  },

  error(peer, error) {
    console.error('WS error:', error)
  }
})
```

---

## 5. Composable useWebSocket

```typescript
// composables/useWebSocket.ts
interface UseWebSocketOptions {
  serviceId?: Ref<string>
  userId?: Ref<string>
  onQueueUpdated?: (data: QueueData) => void
  onTurnCalled?: (data: TurnCalledData) => void
  onYourTurnSoon?: (data: YourTurnSoonData) => void
  onYourTurn?: (data: YourTurnData) => void
}

export function useWebSocket(options: UseWebSocketOptions) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)

  function connect() { ... }
  function disconnect() { ... }
  function send(data: WSMessage) { ... }
  function on(event: string, handler: (data: any) => void) { ... }
  function off(event: string) { ... }

  // Reconexión con backoff exponencial
  // Máx 5 intentos, delay: 1s, 2s, 4s, 8s, 16s

  return { isConnected, connect, disconnect, send, on, off }
}
```

---

## 6. Composable useTurnQueue

```typescript
// composables/useTurnQueue.ts
export function useTurnQueue(serviceId: string) {
  const queue = ref<Turn[]>([])
  const currentTurn = ref<Turn | null>(null)
  const waitingCount = computed(() =>
    queue.value.filter(t => t.status === 'waiting').length
  )

  const ws = useWebSocket({
    serviceId: ref(serviceId),
    onQueueUpdated: (data) => {
      queue.value = data.queue
    },
    onTurnCalled: (data) => {
      currentTurn.value = data.turn
      queue.value = queue.value.map(t =>
        t.id === data.turn.id ? data.turn : t
      )
    },
    onYourTurn: () => {
      // Vibrar si es móvil
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    }
  })

  onMounted(() => ws.connect())
  onUnmounted(() => ws.disconnect())

  return { queue, currentTurn, waitingCount, isConnected: ws.isConnected }
}
```

---

## 7. Store queue.store.ts

```typescript
// stores/queue.store.ts
export const useQueueStore = defineStore('queue', () => {
  const queues = ref<Map<string, Turn[]>>(new Map())
  const currentTurns = ref<Map<string, Turn | null>>(new Map())

  function updateQueue(serviceId: string, turns: Turn[]) {
    queues.value.set(serviceId, turns)
  }

  function setCurrentTurn(serviceId: string, turn: Turn | null) {
    currentTurns.value.set(serviceId, turn)
  }

  function getQueue(serviceId: string) {
    return computed(() => queues.value.get(serviceId) ?? [])
  }

  function getCurrentTurn(serviceId: string) {
    return computed(() => currentTurns.value.get(serviceId) ?? null)
  }

  return { queues, currentTurns, updateQueue, setCurrentTurn, getQueue, getCurrentTurn }
})
```

---

## 8. Panel del Operador

### Flujo: Llamar siguiente turno

```
1. Operador presiona "Llamar siguiente"
2. Client envía: { type: 'OPERATOR_ACTION', action: 'call_next', serviceId }
3. Server:
   a. Busca siguiente turno en espera (ORDER BY queue_position ASC LIMIT 1)
   b. Actualiza status a 'called', calledAt = now()
   c. Publica TURN_CALLED a service:{serviceId}
   d. Publica YOUR_TURN a user:{citizenId} (si existe push subscription)
4. Todos los clientes en service:{} reciben QUEUE_UPDATED
5. El ciudadano llamado recibe YOUR_TURN
```

---

## 9. Widget del Ciudadano (TurnTracker)

```typescript
interface Props {
  turn: Turn
}

interface Emits {
  (e: 'called'): void
  (e: 'attending'): void
}
```

**Características:**
- Número de turno con flip animation cuando cambia
- Posición actual en la cola
- Barra de progreso animada
- Contador de personas adelante
- Tiempo estimado
- Estados visuales: esperando (violeta pulsante), llamado (ámbar), siendo atentido (azul)
- Animación de glow cuando es tu turno

---

## 10. Reconexión Automática

```typescript
// Backoff exponencial
const MAX_RECONNECT_ATTEMPTS = 5
const BASE_DELAY = 1000 // 1 segundo

function getReconnectDelay(attempt: number): number {
  return Math.min(BASE_DELAY * Math.pow(2, attempt), 16000)
}

// Estrategia:
// 1. Conexión perdida → esperar 1s → reconnect
// 2. Si falla → esperar 2s → reconnect
// 3. Si falla → esperar 4s → reconnect
// 4. Si falla → esperar 8s → reconnect
// 5. Si falla → esperar 16s → reconnect
// 6. Si falla → mostrar error "Conexión perdida. Recarga la página."
```

---

## 11. Criterios de Éxito

- [ ] Cliente se conecta al WS al entrar a la cola
- [ ] Al llamar turno, todos los clientes ven la actualización en < 500ms
- [ ] El ciudadano llamado recibe notificación específica
- [ ] TurnTracker actualiza la posición en tiempo real
- [ ] Reconexión automática funciona al perder conexión
- [ ] No hay memory leaks al cerrar el componente
- [ ] **Prueba con 2 pestañas:** operador en una, ciudadano en otra

---

## 12. Casos Edge

### Conexión WS cae

- **Síntoma:** `isConnected` se vuelve `false`
- **Acción:** UI muestra banner "Reconectando..." con spinner
- **Resolución:** Backoff exponencial hasta 5 intentos
- **Si todos fallan:** Mostrar "Conexión perdida. Recarga la página."

### Operador llama pero ciudadano tiene 2 tabs abiertas

- Ambos reciben `YOUR_TURN`
- La primera tab que marca "Comenzar atención" gana
- La segunda tab recibe actualización de que ya fue llamado

### Turno completado mientras el ciudadano está en otra pestaña

- El store se actualiza globalmente (Pinia)
- Al regresar a la pestaña, el estado ya refleja el cambio
