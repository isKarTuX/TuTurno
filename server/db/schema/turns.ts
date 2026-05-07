import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { services } from './services'
import { entities } from './entities'

export const turns = sqliteTable('turns', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turnNumber: text('turn_number').notNull(),
  citizenId: text('citizen_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  status: text('status', {
    enum: ['waiting', 'called', 'attending', 'completed', 'no_show', 'cancelled']
  }).notNull().default('waiting'),
  queuePosition: integer('queue_position').notNull(),
  notifiedAt: integer('notified_at', { mode: 'timestamp' }),
  calledAt: integer('called_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})