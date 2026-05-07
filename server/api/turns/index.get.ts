import { db, turns, entities, services } from '../../db'
import { eq, desc, and, sql, type SQL } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'
import type { TurnStatus } from '~/types'

const VALID_STATUSES: TurnStatus[] = ['waiting', 'called', 'attending', 'completed', 'no_show', 'cancelled']

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }
  const query = getQuery(event)

  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20))
  const status = query.status as string | undefined
  const entityId = query.entityId as string | undefined
  const serviceId = query.serviceId as string | undefined

  const conditions: SQL[] = []

  if (authUser.role === 'citizen') {
    conditions.push(eq(turns.citizenId, authUser.sub))
  }

  if (status && VALID_STATUSES.includes(status as TurnStatus)) {
    conditions.push(eq(turns.status, status as TurnStatus))
  }

  if (entityId) {
    conditions.push(eq(turns.entityId, entityId))
  }

  if (serviceId) {
    conditions.push(eq(turns.serviceId, serviceId))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const countResult = db.select({ count: sql<number>`count(*)` }).from(turns).where(whereClause).get()
  const total = countResult?.count ?? 0
  const offset = (page - 1) * perPage

  const paginatedTurns = db.select({
    turn: turns,
    entity: entities,
    service: services,
  })
    .from(turns)
    .leftJoin(entities, eq(turns.entityId, entities.id))
    .leftJoin(services, eq(turns.serviceId, services.id))
    .where(whereClause)
    .orderBy(desc(turns.createdAt))
    .limit(perPage)
    .offset(offset)
    .all()
    .map(row => ({
      ...row.turn,
      entity: row.entity,
      service: row.service,
    }))

  return success(paginatedTurns, { total, page, perPage })
})