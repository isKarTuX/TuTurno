import { db, turns, entities, services } from '../../db'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { success, apiError } from '../../utils/response.utils'
import { checkRateLimit, getRateLimitKey } from '../../utils/rate-limit.utils'

const querySchema = z.object({
  documentId: z.string().min(5).max(20),
  turnNumber: z.string().min(3).max(10),
})

export default defineEventHandler(async (event) => {
  const rateLimitKey = getRateLimitKey(event)
  const { allowed } = checkRateLimit(rateLimitKey, 20, 60000)

  if (!allowed) {
    throw apiError('RATE_LIMITED', 'Demasiadas solicitudes. Intenta de nuevo en un momento', 429)
  }

  const query = getQuery(event)
  const result = querySchema.safeParse(query)

  if (!result.success) {
    throw apiError('VALIDATION_ERROR', 'Parámetros inválidos', 400)
  }

  const { documentId, turnNumber } = result.data

  const turnData = db.select({
    turn: turns,
    entity: entities,
    service: services,
  })
    .from(turns)
    .leftJoin(entities, eq(turns.entityId, entities.id))
    .leftJoin(services, eq(turns.serviceId, services.id))
    .where(
      and(
        eq(turns.documentId, documentId),
        eq(turns.turnNumber, turnNumber.toUpperCase())
      )
    )
    .get()

  if (!turnData) {
    throw apiError('NOT_FOUND', 'Turno no encontrado. Verifica tu número de cédula y turno.', 404)
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
    ...turnData.turn,
    entity: turnData.entity,
    service: turnData.service,
    estimatedWaitMinutes: waitingCount * (turnData.service?.avgAttentionTime || 5),
    positionAhead: waitingCount,
  })
})