import { db, services } from '../../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../../utils/auth.utils'
import { success, apiError } from '../../../utils/response.utils'
import { servicePauseSchema } from '../../../../schemas/turn.schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }
  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, servicePauseSchema.parse)

  const service = db.select().from(services).where(eq(services.id, id)).get()
  if (!service) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  db.update(services)
    .set({ isPaused: body.isPaused })
    .where(eq(services.id, id))
    .run()

  const updatedService = db.select().from(services).where(eq(services.id, id)).get()

  return success({
    ...updatedService,
    message: body.isPaused ? 'Servicio pausado' : 'Servicio reanudado',
  })
})
