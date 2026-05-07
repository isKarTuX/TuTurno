import { db, users } from '../../db'
import { eq } from 'drizzle-orm'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body as { email?: string }

  if (!email) {
    throw apiError('VALIDATION_ERROR', 'Email es requerido', 400)
  }

  const user = db.select().from(users).where(eq(users.email, email)).get()

  if (!user) {
    return success({ message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' })
  }

  return success({ message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' })
})