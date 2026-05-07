import { db, turns, services, entities } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }
  const id = getRouterParam(event, 'id')!

  const turn = db.select().from(turns).where(eq(turns.id, id)).get()

  if (!turn) {
    throw apiError('NOT_FOUND', 'Turno no encontrado', 404)
  }

  if (turn.citizenId !== authUser.sub && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'No tienes acceso a este turno', 403)
  }

  const service = db.select().from(services).where(eq(services.id, turn.serviceId)).get()
  const entity = db.select().from(entities).where(eq(entities.id, turn.entityId)).get()

  return success({
    ...turn,
    service,
    entity,
  })
})