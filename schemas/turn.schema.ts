import { z } from 'zod'

export const createTurnSchema = z.object({
  serviceId: z.string().uuid(),
  requestedDate: z.string().optional(),
})

export const createTurnPublicSchema = z.object({
  serviceId: z.string().uuid(),
  documentId: z.string().min(5, 'Ingresa un número de cédula válido').max(20),
})

export const updateTurnSchema = z.object({
  status: z.enum(['waiting', 'called', 'attending', 'completed', 'no_show', 'cancelled']).optional(),
})

export const callNextSchema = z.object({
  serviceId: z.string().uuid('serviceId debe ser un UUID válido'),
})

export const operatorActionSchema = z.object({
  turnId: z.string().uuid('turnId debe ser un UUID válido'),
})

export const servicePauseSchema = z.object({
  isPaused: z.boolean(),
})

export type CreateTurnInput = z.infer<typeof createTurnSchema>
export type CreateTurnPublicInput = z.infer<typeof createTurnPublicSchema>
export type UpdateTurnInput = z.infer<typeof updateTurnSchema>
export type CallNextInput = z.infer<typeof callNextSchema>
export type OperatorActionInput = z.infer<typeof operatorActionSchema>
export type ServicePauseInput = z.infer<typeof servicePauseSchema>