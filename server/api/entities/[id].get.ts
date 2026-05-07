import { db, entities, services } from '../../db'
import { eq } from 'drizzle-orm'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const entity = db.select().from(entities).where(eq(entities.id, id!)).get()

  if (!entity) {
    throw apiError('NOT_FOUND', 'Entidad no encontrada', 404)
  }

  const entityServices = db.select().from(services)
    .where(eq(services.entityId, id!))
    .all()

  return success({
    ...entity,
    services: entityServices,
  })
})