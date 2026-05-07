import { db, services } from '../../db'
import { eq } from 'drizzle-orm'
import { updateServiceSchema } from '../../../schemas/entity.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Solo administradores pueden editar servicios', 403)
  }

  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, updateServiceSchema.parse)

  const existing = db.select().from(services).where(eq(services.id, id)).get()
  if (!existing) {
    throw apiError('NOT_FOUND', 'Servicio no encontrado', 404)
  }

  db.update(services).set(body).where(eq(services.id, id)).run()

  const updated = db.select().from(services).where(eq(services.id, id)).get()

  return success(updated)
})