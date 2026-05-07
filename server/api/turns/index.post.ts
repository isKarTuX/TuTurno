import { db, turns, services } from '../../db'
import { eq, sql } from 'drizzle-orm'
import { createTurnSchema } from '../../../schemas/turn.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }

  const body = await readValidatedBody(event, createTurnSchema.parse)

  const service = db.select().from(services).where(eq(services.id, body.serviceId)).get()
  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  if (!service.isActive || service.isPaused) {
    throw apiError('SERVICE_UNAVAILABLE', 'El servicio no está disponible', 400)
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
    citizenId: authUser.sub,
    serviceId: body.serviceId,
    entityId: service.entityId,
    status: 'waiting',
    queuePosition: newNumber,
  }).run()

  const turn = db.select().from(turns).where(eq(turns.id, turnId)).get()

  return success(turn)
})