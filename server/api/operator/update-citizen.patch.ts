import { db, users } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'
import { z } from 'zod'

const updateCitizenSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(10).regex(/^3\d{9}$/).optional(),
  isActive: z.boolean().optional(),
  mustChangePassword: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string; sub: string }
  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const body = await readValidatedBody(event, updateCitizenSchema.parse)
  const citizenId = getRouterParam(event, 'id')

  if (!citizenId) {
    throw apiError('VALIDATION_ERROR', 'ID de ciudadano requerido', 400)
  }

  const citizen = db.select().from(users).where(eq(users.id, citizenId)).get()
  if (!citizen) {
    throw apiError('NOT_FOUND', 'Ciudadano no encontrado', 404)
  }

  if (body.email && body.email !== citizen.email) {
    const existingEmail = db.select().from(users).where(eq(users.email, body.email)).get()
    if (existingEmail && existingEmail.id !== citizenId) {
      throw apiError('EMAIL_EXISTS', 'El email ya está registrado', 409)
    }
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (body.fullName !== undefined) updateData.fullName = body.fullName
  if (body.email !== undefined) updateData.email = body.email
  if (body.phone !== undefined) updateData.phone = body.phone
  if (body.isActive !== undefined) updateData.isActive = body.isActive
  if (body.mustChangePassword !== undefined) updateData.mustChangePassword = body.mustChangePassword

  db.update(users).set(updateData).where(eq(users.id, citizenId)).run()

  const updatedCitizen = db.select().from(users).where(eq(users.id, citizenId)).get()

  return success({
    citizen: {
      id: updatedCitizen!.id,
      fullName: updatedCitizen!.fullName,
      documentId: updatedCitizen!.documentId,
      email: updatedCitizen!.email,
      phone: updatedCitizen!.phone,
      role: updatedCitizen!.role,
      isActive: Boolean(updatedCitizen!.isActive),
      mustChangePassword: Boolean(updatedCitizen!.mustChangePassword),
    },
  })
})