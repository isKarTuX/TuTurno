import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const entities = sqliteTable('entities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  type: text('type', { enum: ['eps', 'bank', 'public_office', 'other'] }).notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  phone: text('phone'),
  email: text('email'),
  logoUrl: text('logo_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})