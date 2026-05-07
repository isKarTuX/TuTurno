import { db, services, entities, operators, users } from '../../db'
import { eq } from 'drizzle-orm'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const service = db.select().from(services).where(eq(services.id, id)).get()

  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  const entity = db.select().from(entities).where(eq(entities.id, service.entityId)).get()

  const serviceOperators = db.select().from(operators).where(eq(operators.serviceId, id)).all()
  const operatorUsers = serviceOperators.map((op) => {
    const user = db.select().from(users).where(eq(users.id, op.userId)).get()
    return { ...op, user }
  })

  return success({
    ...service,
    entity,
    operators: operatorUsers,
  })
})