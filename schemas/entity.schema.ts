import { z } from 'zod'

export const createEntitySchema = z.object({
  name: z.string().min(2),
  type: z.enum(['eps', 'bank', 'public_office', 'other']),
  address: z.string().min(5),
  city: z.string().min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().url().optional(),
})

export const updateEntitySchema = createEntitySchema.partial()

export const createServiceSchema = z.object({
  entityId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  avgAttentionTime: z.number().min(1).max(120).default(5),
  openTime: z.string().regex(/^\d{2}:\d{2}$/).default('08:00'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/).default('17:00'),
})

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  avgAttentionTime: z.number().min(1).max(120).optional(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  isPaused: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export type CreateEntityInput = z.infer<typeof createEntitySchema>
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>