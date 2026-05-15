import { db, users } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event)

  const user = db.select().from(users).where(eq(users.id, authUser.sub)).get()

  if (!user) {
    throw apiError('NOT_FOUND', 'Usuario no encontrado', 404)
  }

  return success({
    user: {
      id: user.id,
      fullName: user.fullName,
      documentId: user.documentId,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: Boolean(user.isActive),
      mustChangePassword: Boolean(user.mustChangePassword),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })
})