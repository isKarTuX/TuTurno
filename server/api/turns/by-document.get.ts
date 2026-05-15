import { db, turns, entities, services } from '../../db'
import { eq, and, desc, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { success, apiError } from '../../utils/response.utils'
import { checkRateLimit, getRateLimitKey } from '../../utils/rate-limit.utils'

const querySchema = z.object({
  documentId: z.string().min(5).max(20),
})

export default defineEventHandler(async (event) => {
  const rateLimitKey = getRateLimitKey(event)
  const { allowed } = checkRateLimit(rateLimitKey, 10, 60000)

  if (!allowed) {
    throw apiError('RATE_LIMITED', 'Demasiadas solicitudes. Intenta de nuevo en un momento', 429)
  }

  const query = getQuery(event)

  const result = querySchema.safeParse(query)
  if (!result.success) {
    throw apiError('VALIDATION_ERROR', 'Número de cédula inválido', 400)
  }

  const { documentId } = result.data

  const activeStatuses = ['waiting', 'called', 'attending'] as const

  const userTurns = db.select({
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
        inArray(turns.status, [...activeStatuses])
      )
    )
    .orderBy(desc(turns.createdAt))
    .all()
    .map(row => ({
      ...row.turn,
      entity: row.entity,
      service: row.service,
    }))

  return success({
    documentId,
    turns: userTurns,
  })
})