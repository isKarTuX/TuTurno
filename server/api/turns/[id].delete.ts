import { db, turns } from '../../db'
import { eq, and, gt } from 'drizzle-orm'
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

  if (turn.status !== 'waiting') {
    throw apiError('INVALID_STATUS', 'Solo se pueden cancelar turnos en espera', 400)
  }

  db.update(turns)
    .set({ status: 'cancelled' })
    .where(eq(turns.id, id))
    .run()

  db.update(turns)
    .set({
      queuePosition: turns.queuePosition
    })
    .where(and(
      eq(turns.serviceId, turn.serviceId),
      eq(turns.status, 'waiting'),
      gt(turns.queuePosition, turn.queuePosition)
    ))
    .run()

  const affectedTurns = db.select().from(turns)
    .where(and(
      eq(turns.serviceId, turn.serviceId),
      eq(turns.status, 'waiting'),
      gt(turns.queuePosition, turn.queuePosition)
    ))
    .all()

  for (const affectedTurn of affectedTurns) {
    db.update(turns)
      .set({ queuePosition: affectedTurn.queuePosition - 1 })
      .where(eq(turns.id, affectedTurn.id))
      .run()
  }

  return success({ message: 'Turno cancelado exitosamente' })
})