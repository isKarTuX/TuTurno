import { db, services } from '../../db'
import { eq, and } from 'drizzle-orm'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  let whereClause = eq(services.isActive, true)

  if (query.entityId) {
    whereClause = and(whereClause, eq(services.entityId, query.entityId as string)) as typeof whereClause
  }

  const allServices = db.select().from(services).where(whereClause).all()

  return success(allServices)
})