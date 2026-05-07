import { db, entities } from '../../db'
import { eq, like, and, sql, type SQL } from 'drizzle-orm'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20))
  const search = query.search as string | undefined
  const type = query.type as string | undefined

  const conditions: SQL[] = [eq(entities.isActive, true)]

  if (search) {
    conditions.push(like(entities.name, `%${search}%`))
  }

  if (type) {
    conditions.push(eq(entities.type, type as 'eps' | 'bank' | 'public_office' | 'other'))
  }

  const whereClause = and(...conditions)

  const countResult = db.select({ count: sql<number>`count(*)` }).from(entities).where(whereClause).get()
  const total = countResult?.count ?? 0
  const offset = (page - 1) * perPage

  const paginatedEntities = db.select()
    .from(entities)
    .where(whereClause)
    .limit(perPage)
    .offset(offset)
    .all()

  return success(paginatedEntities, { total, page, perPage })
})