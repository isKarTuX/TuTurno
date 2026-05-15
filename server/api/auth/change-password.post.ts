import { db, users } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { changePasswordSchema } from '../../../schemas/auth.schema'
import { verifyPassword, hashPassword } from '../../utils/hash.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event)

  const body = await readValidatedBody(event, changePasswordSchema.parse)

  const user = db.select().from(users).where(eq(users.id, authUser.sub)).get()
  if (!user) {
    throw apiError('NOT_FOUND', 'Usuario no encontrado', 404)
  }

  const isValidPassword = await verifyPassword(body.currentPassword, user.passwordHash)
  if (!isValidPassword) {
    throw apiError('INVALID_CREDENTIALS', 'Contraseña actual incorrecta', 401)
  }

  const newPasswordHash = await hashPassword(body.newPassword)

  db.update(users)
    .set({
      passwordHash: newPasswordHash,
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .run()

  return success({ message: 'Contraseña actualizada correctamente' })
})