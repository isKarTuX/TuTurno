import { db, turns, services, entities } from '../../db'
import { eq, sql } from 'drizzle-orm'
import { createTurnPublicSchema } from '../../../schemas/turn.schema'
import { success, apiError } from '../../utils/response.utils'
import { checkRateLimit, getRateLimitKey } from '../../utils/rate-limit.utils'

export default defineEventHandler(async (event) => {
  const rateLimitKey = getRateLimitKey(event)
  const { allowed } = checkRateLimit(rateLimitKey, 20, 60000)

  if (!allowed) {
    throw apiError('RATE_LIMITED', 'Demasiadas solicitudes. Intenta de nuevo en un momento', 429)
  }

  const body = await readValidatedBody(event, createTurnPublicSchema.parse)

  const service = db.select().from(services).where(eq(services.id, body.serviceId)).get()
  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  if (!service.isActive || service.isPaused) {
    throw apiError('SERVICE_UNAVAILABLE', 'El servicio no está disponible actualmente', 400)
  }

  const entity = db.select().from(entities).where(eq(entities.id, service.entityId)).get()
  if (!entity) {
    throw apiError('NOT_FOUND', 'Entidad no encontrada', 404)
  }

  const lastTurn = db.select().from(turns)
    .where(eq(turns.serviceId, body.serviceId))
    .orderBy(sql`queue_position DESC`)
    .limit(1)
    .get()

  const lastNumber = lastTurn ? parseInt(lastTurn.turnNumber.split('-')[1]) : 0
  const newNumber = lastNumber + 1
  const prefix = service.name.charAt(0).toUpperCase()
  const turnNumber = `${prefix}-${String(newNumber).padStart(3, '0')}`

  const turnId = crypto.randomUUID()

  db.insert(turns).values({
    id: turnId,
    turnNumber,
    citizenId: null,
    serviceId: body.serviceId,
    entityId: service.entityId,
    documentId: body.documentId,
    status: 'waiting',
    queuePosition: newNumber,
  }).run()

  const newTurn = db.select().from(turns).where(eq(turns.id, turnId)).get()

  const waitingCount = db.select().from(turns)
    .where(eq(turns.serviceId, body.serviceId))
    .all()
    .filter(t => t.status === 'waiting')
    .length

  const estimatedWait = waitingCount * service.avgAttentionTime

  return success({
    ...newTurn,
    entity,
    service,
    estimatedWaitMinutes: estimatedWait,
  })
})