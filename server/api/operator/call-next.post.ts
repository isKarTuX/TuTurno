import { db, turns, services } from '../../db'
import { eq, and, asc } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'
import { callNextSchema } from '../../../schemas/turn.schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }

  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const body = await readValidatedBody(event, callNextSchema.parse)

  const service = db.select().from(services).where(eq(services.id, body.serviceId)).get()
  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  const waitingQueue = db.select().from(turns)
    .where(and(eq(turns.serviceId, body.serviceId), eq(turns.status, 'waiting')))
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
