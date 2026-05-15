# Auditoría WebSockets/Real-Time - TuTurno

## Resumen Ejecutivo

El sistema WebSocket de TuTurno tiene una **arquitectura incompleta** con problemas críticos que causan desconexión entre las acciones del operador y las notificaciones al ciudadano. Existen múltiples capas de WebSocket client que no comparten estado, utility functions definidas pero nunca usadas, y un flujo de turn completo que no está correctamente implementado.

**Veredicto:** El sistema WebSocket necesita una refactorización significativa antes de producción.

---

## Arquitectura Positiva

### 1. Estructura de Rooms Bien Diseñada
El concepto de rooms (`service:${serviceId}` y `user:${userId}`) es correcto y escalable. Permite broadcast selectivo a ciudadanos específicos o a toda la cola de un servicio.

### 2. Contratos de Eventos Completos
`constants/ws.constants.ts` define todos los eventos necesarios:
- `QUEUE_UPDATED` - Estado de cola cambió
- `TURN_CALLED` - Turno fue llamado
- `YOUR_TURN_SOON` / `YOUR_TURN` - Notificaciones proactivas
- `SERVICE_PAUSED` / `SERVICE_RESUMED` - Control de servicio
- `OPERATOR_ACTION` - Acción de operador

### 3. Reconnection Logic en Cliente
Los composables implementan backoff exponencial (1s, 2s, 4s, 8s, 16s) con máximo 5 intentos, lo cual es apropiado.

### 4. Tipado Correcto
Los types e interfaces en `ws.constants.ts` están bien definidos (excepto `OperatorActionPayload` que no cubre `pause`/`resume`).

---

## Issues Críticos

### [Issue #1] OPERATOR API NO USA WEBSOCKET - Desconexión Total

**Severidad:** CRÍTICA  
**Archivo:** `server/api/operator/call-next.post.ts`, `complete.post.ts`, `no-show.post.ts`

**Descripción:**
Cuando el operador hace clic en "Llamar Siguiente" en `pages/operator/index.vue`, llama al API REST `/api/operator/call-next`. Este endpoint actualiza la base de datos pero **NO envía ningún mensaje WebSocket**. Los ciudadanos NUNCA reciben actualización en tiempo real.

```typescript
// server/api/operator/call-next.post.ts (Línea 34-40)
// Actualiza DB pero NO comunica via WS
db.update(turns).set({ status: 'called', calledAt: new Date() })
  .where(eq(turns.id, nextTurn.id))
  .run()

return success(calledTurn)  // Solo retorna HTTP response
```

El único lugar que SÍ envía mensajes WS es `server/routes/_ws/turns.ts`, pero **nadie lo llama** cuando se usa el API REST del operador.

**Flujo actual (roto):**
```
Operador click → HTTP POST /api/operator/call-next → DB update → HTTP 200 → FIN
                                          ↓
                              (No hay WS broadcast!)
                                          ↓
                         Ciudadano nunca se entera del cambio
```

**Flujo esperado:**
```
Operador click → HTTP POST /api/operator/call-next → DB update → WS broadcast → HTTP 200
                                              ↓
                              peer.publish(`service:${serviceId}`, ...)
                                              ↓
                         Ciudadano recibe QUEUE_UPDATED
```

**Impacto:** 100% del tiempo real está roto. El ciudadano debe hacer polling o refresh manual.

---

### [Issue #2] ws.utils.ts FUNCIONES DEFINIDAS PERO NUNCA USADAS

**Severidad:** CRÍTICA  
**Archivo:** `server/utils/ws.utils.ts`

**Descripción:**
Las funciones `broadcastToService`, `broadcastToUser`, y `broadcastToAll` están definidas con interfaces `Peer` personalizadas, pero **nunca son llamadas** en ningún lugar del codebase. El handler WS usa `peer.publish()` directamente.

```typescript
// server/utils/ws.utils.ts (Línea 7-13)
// ESTAS FUNCIONES NUNCA SE USAN
export function broadcastToService(peers: Map<string, Peer>, serviceId: string, message: object) {
  const room = `service:${serviceId}`
  // ...
}
```

Además, la interfaz `Peer` en `ws.utils.ts` es diferente del tipo real del peer en `defineWebSocketHandler`:
```typescript
// Esto es una interfaz custom que no existe en crossws
interface Peer {
  subscribe: (room: string) => void
  unsubscribe: (room: string) => void
  publish: (room: string, message: string) => void
}
```

El peer real de crossws tiene la misma interfaz, pero la conversión de `Map<string, Peer>` no se usa porque el handler no tiene acceso a un Map de peers.

---

### [Issue #3] ws.utils.ts USA Map DE PEERS PERO EL HANDLER NO TIENE ACCESO A EL

**Severidad:** CRÍTICA  
**Archivo:** `server/routes/_ws/turns.ts`

**Descripción:**
`ws.utils.ts` espera un `Map<string, Peer>` para hacer broadcast, pero `defineWebSocketHandler` no proporciona acceso a la lista de peers conectados. Cada peer es independiente y se comunica via `peer.publish()` a rooms.

```typescript
// server/utils/ws.utils.ts
export function broadcastToService(peers: Map<string, Peer>, serviceId: string, message: object) {
  peers.forEach((peer) => {
    peer.publish(room, messageStr)  // Iterando sobre todos los peers
  })
}
```

El modelo de crossws es pub/sub por rooms, no broadcast a todos los peers. La función `broadcastToAll` con `'*'` room tampoco tiene sentido en este modelo.

---

### [Issue #4] TRES WEBSOCKET CLIENTS INDEPENDIENTES - Confusión de Estado

**Severidad:** ALTA  
**Archivos:** `plugins/ws.client.ts`, `composables/useWebSocket.ts`, `composables/useTurnQueue.ts`, `composables/useTurnRealtime.ts`

**Descripción:**
Existen múltiples implementaciones de WebSocket client que crean conexiones independientes y manejan eventos independientemente:

1. **`plugins/ws.client.ts`** - Crea WS, conecta a rooms, pero solo maneja `QUEUE_UPDATED` y `TURN_CALLED`
2. **`composables/useWebSocket.ts`** - Composable genérico con `on/off/send`, pero NO se usa actualmente
3. **`composables/useTurnQueue.ts`** - Usa `useWebSocket()` internamente, sus propios handlers
4. **`composables/useTurnRealtime.ts`** - Implementación duplicada completa con su propio WS

**Problema:** Si un componente usa `useTurnRealtime` Y el plugin `ws.client` está activo, hay DOS conexiones WebSocket escuchando los mismos eventos. Ambas intentan actualizar `queueStore`, causando posibles race conditions.

```typescript
// plugins/ws.client.ts - HandleMessage
case WS_EVENTS.QUEUE_UPDATED:
  if (payload.queue) queueStore.setQueue(payload.queue)  // Modifica store

// composables/useTurnRealtime.ts - HandleMessage  
case WS_EVENTS.QUEUE_UPDATED:
  if (payload.queue) {
    queueStore.setQueue(payload.queue as Turn[])  // Mismo store!
  }
```

---

### [Issue #5] YOUR_TURN_SOON NUNCA SE ENVÍA POR WEBSOCKET

**Severidad:** ALTA  
**Archivo:** `server/routes/_ws/turns.ts` (Línea 87-92)

**Descripción:**
El handler tiene código para detectar cuando quedan ≤3 turnos y llama a `notifyTurnSoon()`, pero **no envía ningún mensaje WebSocket al ciudadano**. Solo envía push notification.

```typescript
// server/routes/_ws/turns.ts (Línea 87-92)
if (newQueue.length > 0 && newQueue.length <= 3) {
  const turnSoon = newQueue[0]
  if (turnSoon.citizenId) {
    notifyTurnSoon(turnSoon.citizenId, newQueue.length, turnSoon.turnNumber)
    // ❌ FALTA: peer.publish(`user:${turnSoon.citizenId}`, JSON.stringify({
    //   type: WS_EVENTS.YOUR_TURN_SOON,
    //   payload: { turn: turnSoon, position: newQueue.length }
    // }))
  }
}
```

Los eventos `YOUR_TURN_SOON` y `YOUR_TURN` nunca son emitidos por WebSocket, solo existen en el contrato de `ws.constants.ts`.

---

### [Issue #6] OPERATOR_ACTION NO TIENE VALIDACIÓN DE ESQUEMA

**Severidad:** MEDIA  
**Archivo:** `server/routes/_ws/turns.ts` (Línea 20-30)

**Descripción:**
Los mensajes WS del cliente se parsean con `JSON.parse()` pero nunca se validan con Zod. Un cliente malicioso o mal configurado podría enviar mensajes con estructura incorrecta.

```typescript
// server/routes/_ws/turns.ts (Línea 20-30)
message(peer, message) {
  try {
    const data = JSON.parse(message.text())
    const { type, payload } = data
    // ❌ No hay validación de payload

    if (type === WS_EVENTS.OPERATOR_ACTION) {
      handleOperatorAction(peer, payload)  // payload puede ser cualquier cosa
    }
  } catch (error) {
    console.error('WebSocket message error:', error)
  }
}
```

---

### [Issue #7] close() HANDLER USA WILDCARD INVALIDO

**Severidad:** MEDIA  
**Archivo:** `server/routes/_ws/turns.ts` (Línea 33-36)

**Descripción:**
El handler intenta hacer `peer.unsubscribe('service:*')` con wildcard, pero no está claro si crossws soporta esta sintaxis. Debería unsubscribe de las rooms específicas a las que se suscribió.

```typescript
// server/routes/_ws/turns.ts (Línea 33-36)
close(peer) {
  peer.unsubscribe('service:*')    // ❌ Wildcard puede no funcionar
  peer.unsubscribe('user:*')       // ❌ Wildcard puede no funcionar
}
```

**Fix correcto:** Guardar las rooms a las que se subscribe en `open()` y unsubscribe de esas específicas en `close()`.

---

### [Issue #8] NO HAY AUTH EN WEBSOCKET

**Severidad:** MEDIA  
**Archivos:** `server/routes/_ws/turns.ts`, `plugins/ws.client.ts`

**Descripción:**
El WebSocket accepta conexiones sin validar autenticación. Cualquier persona puede conectarse y suscribirse a cualquier `serviceId` o `userId`.

```typescript
// server/routes/_ws/turns.ts - open()
export default defineWebSocketHandler({
  open(peer) {
    const serviceId = new URL(url, 'http://localhost').searchParams.get('serviceId')
    // ❌ No hay verificación de auth token o session
    if (serviceId) {
      peer.subscribe(`service:${serviceId}`)
    }
```

Un atacante podría suscribirse a `user:{victimUserId}` y recibir notificaciones de cuando le llaman a la víctima.

---

### [Issue #9] HANDLERS NO SE REMUEVEN EN useWebSocket - MEMORY LEAK

**Severidad:** MEDIA  
**Archivo:** `composables/useWebSocket.ts` (Línea 63-72)

**Descripción:**
El `eventHandlers` Map crece indefinidamente si los componentes no llaman `off()`. Vue componentes que hacen `ws.on(...)` en `onMounted` pero olvidan llamar `ws.off()` en `onBeforeUnmount` causan memory leaks.

```typescript
// composables/useWebSocket.ts
function on<T = unknown>(event: string, handler: (data: T) => void) {
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Set())
  }
  eventHandlers.get(event)!.add(handler as (data: unknown) => void)
  // ❌ No hay forma de saber qué handlers pertenecen a qué componente
}

function off<T = unknown>(event: string, handler: (data: T) => void) {
  eventHandlers.get(event)?.delete(handler as (data: unknown) => void)
  // Si el componente olvida llamar off() → handler se queda para siempre
}
```

---

## Issues Menores

### [Issue #10] Operator Page Usa serviceId Hardcodeado
**Archivo:** `pages/operator/index.vue` (Línea 18)
```typescript
() => $fetch('/api/operator/queue?serviceId=default')
```
El `serviceId: 'default'` está hardcodeado, lo cual no refleja el diseño del sistema.

### [Issue #11] useTurnRealtime Hace connect() en onMounted Sin Verificar
**Archivo:** `composables/useTurnRealtime.ts` (Línea 112-118)
```typescript
onMounted(() => {
  connect()  // Si el componente se monta en SSR, esto falla silenciosamente
})
```
`import.meta.server` check existe en `connect()` pero si el componente se hidrata en el cliente, hay una race condition.

### [Issue #12] No Hayheartbeat/ping Para Detectar Conexiones Muertas
El servidor no envía pings periódicos para detectar si los clientes siguen vivos. Si un cliente pierde conexión sin enviar close frame, el servidor no se entera hasta que intente publicar.

### [Issue #13] ws.client Plugin Proporciona isConnected Pero No Refleja Estado Real
**Archivo:** `plugins/ws.client.ts` (Línea 110)
```typescript
isConnected: () => ws.value?.readyState === WebSocket.OPEN
```
Esto es una función, no una ref. Los componentes que usan `const { isConnected } = useWS()` obtienen una función, no un valor reactivo.

---

## Event Contracts

### Análisis del Flujo Completo de un Turno

```
1. CIUDADANO SOLICITA TURNO
   POST /api/turns
   → Crea turno con status='waiting', queuePosition=N
   → Retorna turno al ciudadano
   ✅ Flujo correcto (REST)

2. CIUDADANO ESPERA (no hay WS subscribed aún)
   Citizen abre TurnTracker.vue
   → Ve posición actual (de la respuesta del API)
   → NO hay conexión WS todavía
   
3. OPERADOR LLAMA SIGUIENTE
   Opción A: Via HTTP API (pages/operator/index.vue)
   → POST /api/operator/call-next
   → DB update: status='called'
   → ❌ NO hay WS broadcast
   → Ciudadano NO se entera
   
   Opción B: Via WS (si alguien lo implementara)
   → WS message { type: 'OPERATOR_ACTION', action: 'call_next' }
   → server/routes/_ws/turns.ts recibe mensaje
   → DB update: status='called'
   → peer.publish(`service:${serviceId}`, QUEUE_UPDATED)
   → peer.publish(`user:${citizenId}`, TURN_CALLED)
   → notifyTurnCalled() - push notification
   ✅ Flujo correcto (WS)

4. CUANDO QUEDAN 3 TURNOS
   → Server detecta newQueue.length <= 3
   → notifyTurnSoon() - push notification
   → ❌ NO hay WS mensaje YOUR_TURN_SOON

5. CIUDADANO CANCELA
   DELETE /api/turns/[id]
   → DB update: status='cancelled'
   → ❌ NO hay WS broadcast a la cola
   → Otros ciudadanos ven posición incorrecta

6. OPERADOR COMPLETA TURNO
   POST /api/operator/complete
   → DB update: status='completed'
   → ❌ NO hay WS broadcast
```

### Gap Analysis de Eventos

| Evento | Contract | Server WS Handler | Operator API | Cliente Recibe |
|--------|----------|-------------------|--------------|----------------|
| QUEUE_UPDATED | ✅ | ✅ | ❌ | ✅ (partial) |
| TURN_CALLED | ✅ | ✅ | ❌ | ✅ |
| YOUR_TURN_SOON | ✅ | ❌ (solo push) | N/A | ❌ |
| YOUR_TURN | ✅ | ❌ | N/A | ❌ |
| SERVICE_PAUSED | ✅ | ✅ | N/A | ❌ |
| SERVICE_RESUMED | ✅ | ✅ | N/A | ❌ |
| OPERATOR_ACTION | ✅ | ✅ | N/A | N/A |

---

## Client Implementation

### Composable `useWebSocket.ts` (Genérico)
- ✅ Bien diseñado como API genérica
- ✅ Métodos `on/off/send` bien definidos
- ❌ `eventHandlers` Map no se limpia nunca
- ❌ No se usa en ningún lugar actualmente

### Composable `useTurnQueue.ts`
- ✅ Suscribe a WS con serviceId y userId
- ✅ Registra handlers para QUEUE_UPDATED, TURN_CALLED, YOUR_TURN
- ❌ Crea SU PROPIA conexión WS (duplica con plugin ws.client)
- ❌ No hace unsubscribe de handlers al cleanup

### Composable `useTurnRealtime.ts`
- Duplicado completo de funcionalidad
- Implementa su propio WS client
- No comparte estado con otros WS clients

### Plugin `ws.client.ts`
- ❌ Solo maneja algunos eventos (falta YOUR_TURN_SOON, SERVICE_PAUSED/RESUMED)
- ❌ No provee forma de desconectar/exponer handlers
- ❌ `isConnected` es una función, no ref

### TurnTracker.vue
- ✅ Muestra wsConnected state
- ✅ UI reacciona a cambios de estado
- ❌ No usa ningún composable de WS directamente (recibe `wsConnected` como prop)

### TurnProgressBar.vue
- ✅ Animaciones correctas
- ✅ No tiene lógica de WS (solo UI)

### pages/operator/index.vue
- ❌ Solo usa REST API, no WS
- ❌ Llama `refresh()` después de cada acción (polling en vez de real-time)
- ❌ No recibe actualizaciones de cola automáticamente

### pages/onboarding/track.vue
- ❌ No usa WebSocket en absoluto
- ❌ Solo polling via API `/api/turns/track`

---

## Edge Cases

### 1. Cliente Desconecta Mid-Session
**Escenario:** Ciudadano tiene WS conectado, pierde conexión (móvil entra túnel)
- ✅ Reconnect logic existe (exponential backoff)
- ✅ Máximo 5 intentos
- ❌ Después de 5 intentos, el usuario queda sin saber que perdió conexión
- ❌ No hay indicador claro de "desconectado permanentemente"

### 2. Server Restart
**Escenario:** Se reinicia el servidor Nitro
- ✅ Clientes detectan close event
- ✅ Reconnect logic se activa
- ⚠️ Pueden perder mensajes si el servidor no tiene persistencia de estado de rooms

### 3. Múltiples Operadores Mismo Servicio
**Escenario:** Dos operadores atienden el mismo serviceId
- ⚠️ Ambos ven la misma cola via REST API
- ⚠️ Si ambos llaman `call_next` casi simultáneamente, puede haber race condition en la DB
- ❌ No hay mecanismo de "lock" o "claim" de turno
- ❌ WS broadcast va a todos los operadores, no solo al que hizo la acción

### 4. Cancelación de Turno Propagation
**Escenario:** Ciudadano cancela su turno
- ✅ DB se actualiza correctamente
- ❌ No hay WS broadcast a `service:${serviceId}` para actualizar colas de otros
- ❌ Otros ciudadanos ven posiciones desactualizadas

### 5. Race Conditions en Queue Position
**Escenario:** Turnos se cancelan/completan simultáneamente
```typescript
// server/routes/_ws/turns.ts - handleOperatorAction
const waitingQueue = db.select().from(turns)...  // Lee queue
const nextTurn = waitingQueue[0]                  // Toma primero
// ❌ Gap entre lectura y update
db.update(turns).set({ status: 'called' })...     // Actualiza
```
Si dos operadores llaman `call_next` al mismo tiempo, ambos podrían obtener el mismo `nextTurn`.

### 6. Turn Creado Mientras Service Paused
**Escenario:** Operador pausa servicio, ciudadano crea turno
- ⚠️ No hay validación de `isPaused` en creación de turno
- ⚠️ WS handler permite `call_next` en servicio pausado (la pausa solo previene crear turnos, no llamar)

---

## Recommendations

### Prioridad 1 (Crítico - Rompe Funcionalidad)

1. **Conectar Operator API con WebSocket Broadcast**
   - Crear un módulo de broadcast que el operator API pueda llamar
   - Después de cada DB update, emitir el evento WS correspondiente
   - O desacoplar completamente: el operador usa WS para todo

2. **Eliminar ws.utils.ts o Implementar Correctamente**
   - Si crossws soporta rooms nativamente via `peer.subscribe()`, no necesitamos `Map<Peer>`
   - Las funciones `broadcastTo*` deberían ser wrappers alrededor de `peer.publish()`

3. **Unificar Clientes WebSocket**
   - Decidir: ¿plugin global O composables?
   - Si plugin global: que maneje TODOS los eventos
   - Si composables: eliminar el plugin, no duplicar conexiones

### Prioridad 2 (Alto - Calidad)

4. **Implementar YOUR_TURN_SOON WebSocket Message**
   - Agregar `peer.publish(\`user:${turnSoon.citizenId}\`, ...)` en handler

5. **Agregar Validación de Mensajes WS con Zod**
   - Validar `OperatorActionPayload` con schema Zod antes de procesar

6. **Fix close() Handler - Unsubscribe Específico**
   - Guardar rooms en `peer` o en un Map<peer, rooms[]>
   - Unsubscribe de rooms específicas

7. **Agregar Auth al WebSocket**
   - Validar JWT token en query params o headers al conectar
   - Rechazar conexiones no autenticadas

### Prioridad 3 (Medium - Robustez)

8. **Implementar Heartbeat/Ping**
   - Server envía ping cada 30s
   - Cliente responde con pong
   - Detect dead connections

9. **Agregar Indicador de Desconexión Permanente**
   - Después de 5 intentos fallidos, mostrar UI clara
   - Ofrecer opción de "Reintentar ahora"

10. **Proteger Contra Race Conditions**
    - Usar transacciones de DB para `call_next`
    - O usar `SELECT FOR UPDATE`

11. **Agregar Cancelación Broadcast**
    - Cuando se cancela turno, publicar `QUEUE_UPDATED` a la room del servicio

12. **Unificar `isConnected` como Ref**
    - En `ws.client.ts`, cambiar de función a `ref<boolean>`

---

## Conclusión

El sistema WebSocket de TuTurno tiene una **arquitectura parcialmente implementada**. Los componentes básicos existen (handler, composables, plugin, types) pero están **desconectados entre sí**. La integración más crítica (Operator API → WebSocket Broadcast) está completamente ausente.

**Para que el sistema funcione en producción:**
1. Conectar Operator REST API con WebSocket broadcast
2. Unificar los múltiples clientes WS en uno solo
3. Completar la implementación de eventos (YOUR_TURN_SOON, SERVICE_PAUSED/RESUMED en cliente)
4. Agregar validación y auth

El sistema actual puede compilar y运行, pero el tiempo real **no funciona** si el operador usa la interfaz web. Solo funcionaría si alguien enviara mensajes WS manualmente con la estructura correcta.

---

*Auditoría generada: 2026-05-14*  
*Alcance: WebSockets/Real-Time - TuTurno*  
*Archivos analizados: 17*