import { z } from 'zod'

export const createTurnSchema = z.object({
  serviceId: z.string().uuid(),
})

export const updateTurnSchema = z.object({
  status: z.enum(['waiting', 'called', 'attending', 'completed', 'no_show', 'cancelled']).optional(),
})

export type CreateTurnInput = z.infer<typeof createTurnSchema>
export type UpdateTurnInput = z.infer<typeof updateTurnSchema>