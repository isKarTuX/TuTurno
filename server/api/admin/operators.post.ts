import { db, operators, users, services, entities } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'
import { createOperatorSchema } from '../../../schemas/auth.schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const body = await readValidatedBody(event, createOperatorSchema.parse)

  const existingOperator = db.select().from(operators)
    .where(eq(operators.userId, body.userId))
    .get()

  if (existingOperator) {
    throw apiError('CONFLICT', 'Este usuario ya es operador de este servicio', 409)
  }

  const user = db.select().from(users).where(eq(users.id, body.userId)).get()
  if (!user) {
    throw apiError('NOT_FOUND', 'Usuario no encontrado', 404)
  }

  const service = db.select().from(services).where(eq(services.id, body.serviceId)).get()
  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  const entity = db.select().from(entities).where(eq(entities.id, body.entityId)).get()
  if (!entity) {
    throw apiError('NOT_FOUND', 'Entidad no encontrada', 404)
  }

  const newOperator = db.insert(operators).values({
    userId: body.userId,
    serviceId: body.serviceId,
    entityId: body.entityId,
  }).returning().get()

  return success({
    ...newOperator,
    user,
    service,
    entity,
  })
})
