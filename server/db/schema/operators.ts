import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { services } from './services'
import { entities } from './entities'

export const operators = sqliteTable('operators', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})