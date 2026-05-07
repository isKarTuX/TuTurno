import type { UserRole } from '~/constants/roles.constants'

export type TurnStatus = 'waiting' | 'called' | 'attending' | 'completed' | 'no_show' | 'cancelled'

export interface User {
  id: string
  fullName: string
  documentId: string
  email: string
  phone: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse {
  id: string
  fullName: string
  documentId: string
  email: string
  phone: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Entity {
  id: string
  name: string
  type: 'eps' | 'bank' | 'public_office' | 'other'
  address: string
  city: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  logoUrl?: string
  isActive: boolean
  createdAt: Date
}

export interface Service {
  id: string
  entityId: string
  name: string
  description?: string
  avgAttentionTime: number
  openTime: string
  closeTime: string
  isActive: boolean
  isPaused: boolean
}

export interface Turn {
  id: string
  turnNumber: string
  citizenId: string
  serviceId: string
  entityId: string
  status: TurnStatus
  queuePosition: number
  notifiedAt?: Date
  calledAt?: Date
  completedAt?: Date
  createdAt: Date
  entity?: Entity
  service?: Service
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    fullName: user.fullName,
    documentId: user.documentId,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}