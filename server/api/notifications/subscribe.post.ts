import { db, pushSubscriptions } from '../../db'
import { eq } from 'drizzle-orm'
import { pushSubscriptionSchema } from '../../../schemas/notification.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }
  const body = await readValidatedBody(event, pushSubscriptionSchema.parse)

  const existing = db.select().from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, body.endpoint))
    .get()

  if (existing) {
    if (existing.userId === authUser.sub) {
      return success({ message: 'Subscription already exists' })
    }
    db.update(pushSubscriptions).set({ userId: authUser.sub }).where(eq(pushSubscriptions.endpoint, body.endpoint)).run()
    return success({ message: 'Subscription updated' })
  }

  const id = crypto.randomUUID()
  db.insert(pushSubscriptions).values({
    id,
    userId: authUser.sub,
    endpoint: body.endpoint,
    p256dh: body.p256dh,
    auth: body.auth,
  }).run()

  return success({ id, message: 'Subscription saved' })
})