import { db, turns, services } from '../../db'
import { eq, and, asc } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }

  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const body = await readBody(event)
  const { serviceId } = body as { serviceId: string }

  if (!serviceId) {
    throw apiError('MISSING_SERVICE', 'serviceId es requerido', 400)
  }

  const service = db.select().from(services).where(eq(services.id, serviceId)).get()
  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  const waitingQueue = db.select().from(turns)
    .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'waiting')))
    .orderBy(asc(turns.queuePosition))
    .all()

  if (waitingQueue.length === 0) {
    return success({ calledTurn: null, message: 'No hay turnos en espera' })
  }

  const nextTurn = waitingQueue[0]

  db.update(turns).set({ status: 'called', calledAt: new Date() })
    .where(eq(turns.id, nextTurn.id))
    .run()

  const calledTurn = db.select().from(turns).where(eq(turns.id, nextTurn.id)).get()

  return success(calledTurn)
})