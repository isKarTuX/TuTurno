import { db, entities } from '../../db'
import { eq } from 'drizzle-orm'
import { updateEntitySchema } from '../../../schemas/entity.schema'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Solo administradores pueden editar entidades', 403)
  }

  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, updateEntitySchema.parse)

  const existing = db.select().from(entities).where(eq(entities.id, id!)).get()
  if (!existing) {
    throw apiError('NOT_FOUND', 'Entidad no encontrada', 404)
  }

  db.update(entities).set(body).where(eq(entities.id, id!)).run()

  const updated = db.select().from(entities).where(eq(entities.id, id!)).get()

  return success(updated)
})