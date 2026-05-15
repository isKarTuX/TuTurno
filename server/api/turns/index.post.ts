import { db, turns, services } from '../../db'
import { eq, sql, and } from 'drizzle-orm'
import { createTurnSchema } from '../../../schemas/turn.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

const MAX_ACTIVE_TURNS = 3

function getColombiaDate() {
  const now = new Date()
  const colombiaOffset = -5 * 60
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (colombiaOffset * 60000))
}

function getStartOfDayColombia() {
  const colombiaDate = getColombiaDate()
  colombiaDate.setHours(0, 0, 0, 0)
  return colombiaDate
}

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

  const requestedDate = body.requestedDate ? new Date(body.requestedDate) : getColombiaDate()
  const todayStart = getStartOfDayColombia()

  const requestedDateOnly = new Date(requestedDate)
  requestedDateOnly.setHours(0, 0, 0, 0)

  if (requestedDateOnly < todayStart) {
    throw apiError('INVALID_DATE', 'No puedes solicitar turnos para fechas pasadas', 400)
  }

  const activeTurns = db.select().from(turns)
    .where(and(
      eq(turns.citizenId, authUser.sub),
      sql`${turns.status} IN ('waiting', 'called', 'attending')`
    ))
    .all()

  if (activeTurns.length >= MAX_ACTIVE_TURNS) {
    throw apiError('MAX_TURNS_EXCEEDED', `Máximo ${MAX_ACTIVE_TURNS} turnos activos permitidos`, 400)
  }

  const lastTurn = db.select().from(turns)
    .where(eq(turns.serviceId, body.serviceId))
    .orderBy(sql`${turns.queuePosition} DESC`)
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
    requestedDate: requestedDate,
  }).run()

  const turn = db.select().from(turns).where(eq(turns.id, turnId)).get()

  return success(turn)
})