import { db, turns, entities, services, operators, users } from '../../db'
import { eq, gte } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw createError({ statusCode: 403, data: { success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado' } } })
  }

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalEntities = db.select().from(entities).where(eq(entities.isActive, true)).all().length
  const totalServices = db.select().from(services).where(eq(services.isActive, true)).all().length
  const totalOperators = db.select().from(operators).where(eq(operators.isActive, true)).all().length
  const totalCitizens = db.select().from(users).where(eq(users.role, 'citizen')).all().length

  const turnsToday = db.select().from(turns).where(gte(turns.createdAt, startOfDay)).all()
  const turnsThisWeek = db.select().from(turns).where(gte(turns.createdAt, startOfWeek)).all()
  const turnsThisMonth = db.select().from(turns).where(gte(turns.createdAt, startOfMonth)).all()

  const waitingToday = turnsToday.filter((t) => t.status === 'waiting').length
  const calledToday = turnsToday.filter((t) => t.status === 'called').length
  const completedToday = turnsToday.filter((t) => t.status === 'completed').length
  const noShowToday = turnsToday.filter((t) => t.status === 'no_show').length

  const avgAttentionTime = db.select().from(services).all().reduce((acc, s) => acc + s.avgAttentionTime, 0) / Math.max(totalServices, 1)

  const serviceMetrics = db.select().from(services).all().map((service) => {
    const serviceTurns = turnsThisMonth.filter((t) => t.serviceId === service.id)
    return {
      id: service.id,
      name: service.name,
      totalTurns: serviceTurns.length,
      completed: serviceTurns.filter((t) => t.status === 'completed').length,
      noShow: serviceTurns.filter((t) => t.status === 'no_show').length,
    }
  })

  const entityMetrics = db.select().from(entities).all().map((entity) => {
    const entityTurns = turnsThisMonth.filter((t) => t.entityId === entity.id)
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      totalTurns: entityTurns.length,
      completed: entityTurns.filter((t) => t.status === 'completed').length,
    }
  })

  return success({
    summary: {
      totalEntities,
      totalServices,
      totalOperators,
      totalCitizens,
    },
    today: {
      total: turnsToday.length,
      waiting: waitingToday,
      called: calledToday,
      completed: completedToday,
      noShow: noShowToday,
    },
    weekly: {
      total: turnsThisWeek.length,
    },
    monthly: {
      total: turnsThisMonth.length,
    },
    avgAttentionTime: Math.round(avgAttentionTime),
    serviceMetrics,
    entityMetrics,
  })
})