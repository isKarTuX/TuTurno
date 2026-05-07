import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  documentId: z.string().min(6).max(12).regex(/^\d+$/, 'La cédula debe tener solo números'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10).max(10).regex(/^3\d{9}$/, 'Teléfono colombiano inválido (ej: 3001234567)'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').regex(/\d/, 'La contraseña debe tener al menos un número'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>