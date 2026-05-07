# PHASE-07 — Notificaciones Push

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 7
Depende de: PHASE-06
Tiempo estimado: 60 min
```

---

## 1. Objetivo

Implementar el sistema de notificaciones push para alertar al ciudadano cuando su turno está próximo (3 turnos antes) y cuando es su turno.

---

## 2. Flujo de Implementación

```
┌────────────┐     ┌──────────────┐     ┌────────────┐     ┌─────────────┐
│  Cliente   │     │  Service     │     │   Server   │     │   Browser   │
│  (App)     │     │  Worker      │     │  (Push)    │     │  (Push API) │
└─────┬──────┘     └──────┬───────┘     └─────┬──────┘     └──────┬──────┘
      │                   │                   │                   │
      │─ Solicitar        │                   │                   │
      │  permiso ─────────▶                   │                   │
      │◀─ Permission      │                   │                   │
      │    granted        │                   │                   │
      │                   │                   │                   │
      │─ POST /api/        │                   │                   │
      │  notifications/    │                   │                   │
      │  subscribe         │                   │                   │
      │───────────────────▶                   │                   │
      │                   │                   │                   │
      │                   │  subscribe         │                   │
      │                   │◀───────────────────│                   │
      │                   │                   │                   │
      │  Turnos antes     │                   │                   │
      │◀──────────────────│                   │                   │
      │  (YOUR_TURN_SOON) │                   │                   │
      │                   │                   │                   │
      │                   │  ┌──────────────────────────────────────┘
      │                   │  │ web-push.sendNotification()
      │                   │  │ Push API (Chrome, Firefox)
      │                   │  ▼
      │                   │  Notificación del sistema
```

---

## 3. Configuración VAPID

```bash
# Generar claves VAPID
npx web-push generate-vapid-keys

# Resultado:
# Public Key: BEl2i2F6yF4E7qKqLGb5xDqKzJ2l6... (largo, para usar en cliente)
# Private Key: GJy8F0... (secreto, solo para server)
```

**Variables de entorno necesarias:**
```bash
VAPID_PUBLIC_KEY=BEl2i2F6yF4E7qKqLGb5xDqKzJ2l6...
VAPID_PRIVATE_KEY=GJy8F0...
VAPID_EMAIL=mailto:admin@tuturno.co
```

---

## 4. Service Worker

```typescript
// public/sw.js (auto-generado por @vite-pwa/nuxt)

// En la registration del Service Worker
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}

  const options = {
    body: data.body || 'Tienes un turno pendiente',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'tuturno-notification',
    data: {
      url: data.url || '/app/turns'
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TuTurno', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
```

---

## 5. Registro de Suscripción

### POST /api/notifications/subscribe

```typescript
// Request body
{
  endpoint: string,   // URL del PushManager
  p256dh: string,     // Clave pública del navegador
  auth: string        // Token de autenticación
}

// Response 200
{
  success: true,
  data: { message: 'Suscripción guardada' }
}

// Response 400
{
  success: false,
  error: { code: 'INVALID_SUBSCRIPTION', message: '...' }
}
```

**Auth requerida:** Sí (citizen)

---

### DELETE /api/notifications/subscribe

```typescript
// Response 200
{
  success: true,
  data: { message: 'Suscripción eliminada' }
}
```

---

## 6. Lógica de Envío

```typescript
// server/utils/push.utils.ts
import webpush from 'web-push'

// Configurar VAPID
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function sendPushNotification(userId: string, payload: PushPayload) {
  const subscriptions = await db.select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId))

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }, JSON.stringify(payload))
    } catch (err) {
      // Si el subscription expiró o es inválido, eliminarlo
      if (err.statusCode === 410 || err.statusCode === 404) {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id))
      }
    }
  }
}
```

### Cuándo se envía cada notificación

| Condición | Evento | Título | Body |
|-----------|--------|--------|------|
| Faltan 3 turnos | `YOUR_TURN_SOON` | "¡Te quedan 3 turnos!" | "Prepárate, eres casi tu turno en {servicio}" |
| Es tu turno | `YOUR_TURN` | "¡Es tu turno!" | "Acércate al módulo de atención. Turno {numero}" |
| Turno no_show | `TURN_MISSED` | "Turno perdido" | "No te presentaste a tu turno {numero}" |

---

## 7. Manejo de Permisos

```typescript
// composables/useNotifications.ts
export function useNotifications() {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')

  onMounted(() => {
    isSupported.value = 'Notification' in window
    if (isSupported.value) {
      permission.value = Notification.permission
    }
  })

  async function requestPermission(): Promise<boolean> {
    if (!isSupported.value) return false
    const result = await Notification.requestPermission()
    permission.value = result
    return result === 'granted'
  }

  async function subscribe(): Promise<void> {
    if (permission.value !== 'granted') {
      const granted = await requestPermission()
      if (!granted) throw new Error('Permission denied')
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VAPID_PUBLIC_KEY)
    })

    await $fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: subscription.toJSON()
    })
  }

  return { isSupported, permission, requestPermission, subscribe }
}
```

---

## 8. Criterios de Éxito

- [ ] Browser solicita permiso al intentar suscribirse
- [ ] Si el permiso es denegado, mostrar mensaje explicativo
- [ ] La suscripción se guarda en la DB correctamente
- [ ] Cuando faltan 3 turnos, se envía push "YOUR_TURN_SOON"
- [ ] Cuando es tu turno, se envía push "YOUR_TURN"
- [ ] Al hacer clic en la notificación, abre la app en el turno
- [ ] Las notificaciones funcionan en Chrome Android
- [ ] Si el subscription expira, se elimina de la DB

---

## 9. Errores Comunes

### Error: VAPID public key invalid

Verificar que `VAPID_PUBLIC_KEY` en el cliente coincide con el del server.

### Error: 410 Gone en push

El subscription ya no es válido (el usuario lo eliminó o el browser lo expiró). Eliminar de la DB.

### Permiso denegado permanentemente

No se puede volver a pedir. El usuario debe ir a configuración del navegador.
