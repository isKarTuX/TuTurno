import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { entities } from './entities'

export const services = sqliteTable('services', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityId: text('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  avgAttentionTime: integer('avg_attention_time').notNull().default(5),
  openTime: text('open_time').notNull().default('08:00'),
  closeTime: text('close_time').notNull().default('17:00'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isPaused: integer('is_paused', { mode: 'boolean' }).notNull().default(false),
})