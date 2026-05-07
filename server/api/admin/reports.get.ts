import { db, turns, services, entities } from '../../db'
import { eq, gte } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw createError({ statusCode: 403, data: { success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado' } } })
  }

  const query = getQuery(event)
  const period = (query.period as string) || 'today'
  const entityId = query.entityId as string | undefined
  const serviceId = query.serviceId as string | undefined

  const now = new Date()
  let startDate: Date

  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'today':
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
  }

  let turnsQuery = db.select().from(turns).where(gte(turns.createdAt, startDate))

  const allTurns = turnsQuery.all()

  let filteredTurns = allTurns
  if (entityId) {
    filteredTurns = filteredTurns.filter((t) => t.entityId === entityId)
  }
  if (serviceId) {
    filteredTurns = filteredTurns.filter((t) => t.serviceId === serviceId)
  }

  const byDate: Record<string, number> = {}
  const byService: Record<string, { name: string; total: number; completed: number; noShow: number }> = {}
  const byEntity: Record<string, { name: string; type: string; total: number; completed: number }> = {}
  const byStatus: Record<string, number> = {}

  filteredTurns.forEach((turn) => {
    const dateKey = turn.createdAt ? new Date(turn.createdAt).toISOString().split('T')[0] : 'unknown'
    byDate[dateKey] = (byDate[dateKey] || 0) + 1

    byStatus[turn.status] = (byStatus[turn.status] || 0) + 1

    const service = db.select().from(services).where(eq(services.id, turn.serviceId)).get()
    if (service) {
      if (!byService[service.id]) {
        byService[service.id] = { name: service.name, total: 0, completed: 0, noShow: 0 }
      }
      byService[service.id].total++
      if (turn.status === 'completed') byService[service.id].completed++
      if (turn.status === 'no_show') byService[service.id].noShow++
    }

    const entity = db.select().from(entities).where(eq(entities.id, turn.entityId)).get()
    if (entity) {
      if (!byEntity[entity.id]) {
        byEntity[entity.id] = { name: entity.name, type: entity.type, total: 0, completed: 0 }
      }
      byEntity[entity.id].total++
      if (turn.status === 'completed') byEntity[entity.id].completed++
    }
  })

  const topServices = Object.entries(byService)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const topEntities = Object.entries(byEntity)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return success({
    period,
    total: filteredTurns.length,
    byDate: Object.entries(byDate).map(([date, count]) => ({ date, count })),
    byStatus,
    topServices,
    topEntities,
  })
})