import { db, services, entities } from '../../db'
import { eq } from 'drizzle-orm'
import { createServiceSchema } from '../../../schemas/entity.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Solo administradores pueden crear servicios', 403)
  }

  const body = await readValidatedBody(event, createServiceSchema.parse)

  const entity = db.select().from(entities).where(eq(entities.id, body.entityId)).get()
  if (!entity) {
    throw apiError('NOT_FOUND', 'Entidad no encontrada', 404)
  }

  const serviceId = crypto.randomUUID()
  db.insert(services).values({
    id: serviceId,
    entityId: body.entityId,
    name: body.name,
    description: body.description,
    avgAttentionTime: body.avgAttentionTime,
    openTime: body.openTime,
    closeTime: body.closeTime,
  }).run()

  const service = db.select().from(services).where(eq(services.id, serviceId)).get()

  return success(service)
})