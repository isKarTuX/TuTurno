import { db, operators, users, services, entities } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string }
  if (authUser.role !== 'admin') {
    throw createError({ statusCode: 403, data: { success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado' } } })
  }

  const allOperators = db.select().from(operators).all()

  const operatorsWithDetails = allOperators.map((op) => {
    const user = db.select().from(users).where(eq(users.id, op.userId)).get()
    const service = db.select().from(services).where(eq(services.id, op.serviceId)).get()
    const entity = db.select().from(entities).where(eq(entities.id, op.entityId)).get()
    return {
      ...op,
      user,
      service,
      entity,
    }
  })

  return success(operatorsWithDetails)
})