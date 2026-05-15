import { db, turns, entities, services } from '../../db'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { success, apiError } from '../../utils/response.utils'
import { checkRateLimit, getRateLimitKey } from '../../utils/rate-limit.utils'

const querySchema = z.object({
  turnNumber: z.string().min(3).max(10),
})

export default defineEventHandler(async (event) => {
  const rateLimitKey = getRateLimitKey(event)
  const { allowed } = checkRateLimit(rateLimitKey, 30, 60000)

  if (!allowed) {
    throw apiError('RATE_LIMITED', 'Demasiadas solicitudes. Intenta de nuevo en un momento', 429)
  }

  const query = getQuery(event)
  const result = querySchema.safeParse(query)

  if (!result.success) {
    throw apiError('VALIDATION_ERROR', 'Parámetros inválidos', 400)
  }

  const { turnNumber } = result.data

  const turnData = db.select({
    turn: turns,
    entity: entities,
    service: services,
  })
    .from(turns)
    .leftJoin(entities, eq(turns.entityId, entities.id))
    .leftJoin(services, eq(turns.serviceId, services.id))
    .where(eq(turns.turnNumber, turnNumber.toUpperCase()))
    .get()

  if (!turnData) {
    throw apiError('NOT_FOUND', 'Turno no encontrado', 404)
  }

  const activeStatuses = ['waiting', 'called', 'attending'] as const
  if (!activeStatuses.includes(turnData.turn.status as typeof activeStatuses[number])) {
    throw apiError('NOT_FOUND', 'Este turno ya no está activo', 404)
  }

  const waitingCount = db.select().from(turns)
    .where(
      and(
        eq(turns.serviceId, turnData.turn.serviceId),
        eq(turns.status, 'waiting')
      )
    )
    .all()
    .length

  return success({
    turnNumber: turnData.turn.turnNumber,
    status: turnData.turn.status,
    queuePosition: turnData.turn.queuePosition,
    entityName: turnData.entity?.name,
    serviceName: turnData.service?.name,
    estimatedWaitMinutes: waitingCount * (turnData.service?.avgAttentionTime || 5),
    positionAhead: waitingCount,
    calledAt: turnData.turn.calledAt,
    createdAt: turnData.turn.createdAt,
  })
})