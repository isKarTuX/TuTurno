import { db, turns } from '../../db'
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

  if (turn.status !== 'waiting') {
    throw apiError('INVALID_STATUS', 'Solo se pueden cancelar turnos en espera', 400)
  }

  db.update(turns).set({ status: 'cancelled' }).where(eq(turns.id, id)).run()

  return success({ message: 'Turno cancelado exitosamente' })
})