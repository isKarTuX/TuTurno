import { db, turns } from '../../db'
import { eq, and, asc } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }

  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw createError({ statusCode: 403, data: { success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado' } } })
  }

  const query = getQuery(event)
  const serviceId = query.serviceId as string | undefined

  if (!serviceId) {
    throw createError({ statusCode: 400, data: { success: false, error: { code: 'MISSING_SERVICE', message: 'serviceId es requerido' } } })
  }

  const queue = db.select().from(turns)
    .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'waiting')))
    .orderBy(asc(turns.queuePosition))
    .all()

  const calledTurn = db.select().from(turns)
    .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'called')))
    .get()

  const attendingTurn = db.select().from(turns)
    .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'attending')))
    .get()

  return success({
    queue,
    calledTurn,
    attendingTurn,
    waitingCount: queue.length,
  })
})