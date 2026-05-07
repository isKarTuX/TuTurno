import { db, turns } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }

  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const body = await readBody(event)
  const { turnId } = body as { turnId: string }

  if (!turnId) {
    throw apiError('MISSING_TURN', 'turnId es requerido', 400)
  }

  const turn = db.select().from(turns).where(eq(turns.id, turnId)).get()
  if (!turn) {
    throw apiError('NOT_FOUND', 'Turno no encontrado', 404)
  }

  db.update(turns).set({ status: 'completed', completedAt: new Date() })
    .where(eq(turns.id, turnId))
    .run()

  return success({ message: 'Turno completado' })
})