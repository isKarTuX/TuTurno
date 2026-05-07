import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const dbDriver = process.env.DB_DRIVER || 'sqlite'

let db: BetterSQLite3Database<typeof schema>

if (dbDriver === 'postgres') {
  throw new Error('PostgreSQL driver not configured. Set DB_DRIVER=postgres and install drizzle-orm/postgres-js')
}

const sqlite = new Database(process.env.DATABASE_URL || './tuturno.db')
db = drizzle(sqlite, { schema })

export { db }
export * from './schema'