import webpush from 'web-push'
import { db, pushSubscriptions } from '../db'
import { eq } from 'drizzle-orm'

export function initWebPush() {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
  const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@tuturno.co'

  if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
  }
}

export async function sendPushNotification(userId: string, title: string, body: string, data?: Record<string, unknown>) {
  const subscriptions = db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId)).all()

  if (subscriptions.length === 0) {
    return { sent: 0, errors: [] }
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: '/app/turns',
      ...data,
    },
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      )
    )
  )

  const errors: string[] = []
  let sent = 0

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      sent++
    } else {
      errors.push(`Subscription ${index}: ${result.reason}`)
    }
  })

  return { sent, errors }
}

export async function notifyTurnCalled(userId: string, turnNumber: string, serviceName: string) {
  return sendPushNotification(userId, '¡Tu turno está siendo llamado!', `Turno ${turnNumber} - ${serviceName}`, {
    type: 'TURN_CALLED',
    turnNumber,
  })
}

export async function notifyTurnSoon(userId: string, turnsAhead: number, turnNumber: string) {
  return sendPushNotification(
    userId,
    'Te quedan pocos turnos',
    `Turno ${turnNumber} - Te faltan ${turnsAhead} turnos`,
    {
      type: 'TURN_SOON',
      turnsAhead,
    }
  )
}