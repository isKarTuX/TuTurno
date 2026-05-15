import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  documentId: z.string().min(6).max(12).regex(/^\d+$/, 'La cédula debe tener solo números'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10).max(10).regex(/^3\d{9}$/, 'Teléfono colombiano inválido (ej: 3001234567)'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/\d/, 'La contraseña debe tener al menos un número')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export const loginWithDocumentSchema = z.object({
  documentId: z.string().min(5).max(20).regex(/^\d+$/, 'La cédula debe tener solo números'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export const createOperatorSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  serviceId: z.string().uuid('serviceId debe ser un UUID válido'),
  entityId: z.string().uuid('entityId debe ser un UUID válido'),
})

export const createCitizenByOperatorSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  documentId: z.string().min(6).max(12).regex(/^\d+$/, 'La cédula debe tener solo números'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10).max(10).regex(/^3\d{9}$/, 'Teléfono colombiano inválido (ej: 3001234567)'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/\d/, 'La contraseña debe tener al menos un número')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula'),
})

export const resetPasswordSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  newPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/\d/, 'La contraseña debe tener al menos un número')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateOperatorInput = z.infer<typeof createOperatorSchema>
export type CreateCitizenByOperatorInput = z.infer<typeof createCitizenByOperatorSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>