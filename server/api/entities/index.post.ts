import { db, entities } from '../../db'
import { eq } from 'drizzle-orm'
import { createEntitySchema } from '../../../schemas/entity.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Solo administradores pueden crear entidades', 403)
  }

  const body = await readValidatedBody(event, createEntitySchema.parse)

  const entityId = crypto.randomUUID()
  db.insert(entities).values({
    id: entityId,
    name: body.name,
    type: body.type,
    address: body.address,
    city: body.city,
    latitude: body.latitude,
    longitude: body.longitude,
    phone: body.phone,
    email: body.email,
    logoUrl: body.logoUrl,
  }).run()

  const entity = db.select().from(entities).where(eq(entities.id, entityId)).get()

  return success(entity)
})