import { db, users } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'
import { createCitizenByOperatorSchema } from '../../../schemas/auth.schema'
import { hashPassword } from '../../utils/hash.utils'

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string; sub: string }
  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const body = await readValidatedBody(event, createCitizenByOperatorSchema.parse)

  const existingEmail = db.select().from(users).where(eq(users.email, body.email)).get()
  if (existingEmail) {
    throw apiError('EMAIL_EXISTS', 'El email ya está registrado', 409)
  }

  const existingDocument = db.select().from(users).where(eq(users.documentId, body.documentId)).get()
  if (existingDocument) {
    throw apiError('DOCUMENT_EXISTS', 'La cédula ya está registrada', 409)
  }

  const tempPassword = generateTempPassword()
  const passwordHash = await hashPassword(tempPassword)

  const userId = crypto.randomUUID()
  db.insert(users).values({
    id: userId,
    fullName: body.fullName,
    documentId: body.documentId,
    email: body.email,
    phone: body.phone,
    passwordHash,
    role: 'citizen',
    mustChangePassword: true,
  }).run()

  const user = db.select().from(users).where(eq(users.id, userId)).get()

  return success({
    user: {
      id: user!.id,
      fullName: user!.fullName,
      documentId: user!.documentId,
      email: user!.email,
      phone: user!.phone,
      role: user!.role,
      isActive: Boolean(user!.isActive),
      mustChangePassword: Boolean(user!.mustChangePassword),
      createdAt: user!.createdAt,
      updatedAt: user!.updatedAt,
    },
    tempPassword,
  })
})