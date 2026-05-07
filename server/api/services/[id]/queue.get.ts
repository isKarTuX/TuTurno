import { db, services, turns } from '../../../db'
import { eq, and, asc } from 'drizzle-orm'
import { success, apiError } from '../../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const service = db.select().from(services).where(eq(services.id, id)).get()

  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  const waitingQueue = db.select().from(turns)
    .where(and(eq(turns.serviceId, id), eq(turns.status, 'waiting')))
    .orderBy(asc(turns.queuePosition))
    .all()

  const calledTurn = db.select().from(turns)
    .where(and(eq(turns.serviceId, id), eq(turns.status, 'called')))
    .get()

  const currentTurn = calledTurn || db.select().from(turns)
    .where(and(eq(turns.serviceId, id), eq(turns.status, 'attending')))
    .get()

  const waitingCount = waitingQueue.length
  const estimatedWaitMinutes = waitingCount * service.avgAttentionTime

  return success({
    service,
    currentTurn: currentTurn || null,
    queue: waitingQueue,
    waitingCount,
    avgAttentionTime: service.avgAttentionTime,
    estimatedWaitMinutes,
  })
})