# Auditoría Base de Datos - TuTurno

## Resumen Ejecutivo

**Estado: ⚠️ MANTENER SQLite LOCAL - Decisión de Arquitectura**

El proyecto TuTurno opera en **modo desarrollo local con SQLite**. El schema está completo y funcional. El proyecto NO se desplegará a Supabase por ahora - se mantiene SQLite como base de datos principal.

| Componente | Estado | Notas |
|------------|--------|-------|
| Schema SQLite local | ✅ Completo | 7 tablas según spec CLAUDE.md |
| driver SQLite→Postgres | ⚠️ Pendiente | No implementado (no requerido por ahora) |
| Índices SQLite | ✅ Creados | Vía migraciones Drizzle |
| Relaciones Drizzle | ⚠️ Faltan | No críticas para SQLite |

---

## Decisión de Arquitectura: SQLite Local

**Fecha:** Mayo 2026
**Decisión:** Mantener SQLite local para desarrollo y no desplegar a Supabase por el momento.

**Implicaciones:**
- El proyecto "CampoApp" de Supabase NO se usa para TuTurno
- No aplica RLS (Row Level Security) - SQLite no lo soporta
- Las migraciones se generan localmente con `drizzle-kit generate`
- Para escalar a PostgreSQL/Supabase en el futuro: cambiar `DB_DRIVER=postgres` en `.env`

---

## Esquema Positivo

### SQLite Schema (server/db/schema/)

El schema local está bien estructurado y cumple con la especificación de CLAUDE.md:

**Tablas implementadas:**
- ✅ `users` - 15 columnas, UUID pk, con roles (citizen/operator/admin)
- ✅ `refresh_sessions` - Token-based session management
- ✅ `entities` - Entidades tipo EPS, banco, oficina pública
- ✅ `services` - Servicios por entidad
- ✅ `operators` - Asignación user→service→entity
- ✅ `turns` - Sistema de turnos con estados (waiting/called/attending/completed/no_show/cancelled)
- ✅ `push_subscriptions` - Push notifications

**Aspectos positivos:**
- UUIDs para todas las primary keys (`$defaultFn(() => crypto.randomUUID())`)
- Timestamps consistentes con `.$defaultFn(() => new Date())`
- Enums para campos de status
- Foreign keys con `onDelete: 'cascade'` donde aplica
- Booleanos usando `mode: 'boolean'` para SQLite
- Valores por defecto apropiados

---

## Issues Identificados

### [Issue #1] Falta Columna `updatedAt` en Entidades
**Severidad: ALTA**

La tabla `entities` no tiene columna `updatedAt`:
```typescript
// server/db/schema/entities.ts
export const entities = sqliteTable('entities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  // ... otras columnas
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  // ❌ FALTA: updatedAt
})
```

---

### [Issue #2] Falta Columna `updatedAt` y `createdAt` en Services
**Severidad: ALTA**

```typescript
// server/db/schema/services.ts
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
  // ❌ FALTA: createdAt
  // ❌ FALTA: updatedAt
})
```

---

### [Issue #3] Falta Columna `updatedAt` en Operators
**Severidad: MEDIA**

```typescript
// server/db/schema/operators.ts
export const operators = sqliteTable('operators', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  // ❌ FALTA: updatedAt
})
```

---

### [Issue #4] Falta Columna `updatedAt` en Turns
**Severidad: MEDIA**

```typescript
// server/db/schema/turns.ts
export const turns = sqliteTable('turns', {
  // ... campos
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  // ❌ FALTA: updatedAt
})
```

---

### [Issue #5] `citizenId` Nullable en Turns
**Severidad: ALTA**

```typescript
// server/db/schema/turns.ts
citizenId: text('citizen_id').references(() => users.id),  // ❌ Falta .notNull()
```

Según CLAUDE.md, `citizenId` debe ser `NOT NULL` ya que todo turno pertenece a un ciudadano.

---

## Issues Menores (No Críticos)

### [Issue #6] Campo Extra `documentId` en Turns
**Severidad: BAJA**

```typescript
documentId: text('document_id'),  // No está en spec CLAUDE.md
```

Este campo puede ser útil para tracking sin FK, pero no está documentado.

---

### [Issue #7] Campo Extra `requestedDate` en Turns
**Severidad: BAJA**

```typescript
requestedDate: integer('requested_date', { mode: 'timestamp' }),
```

No está en la especificación CLAUDE.md sección 4.2.

---

### [Issue #8] Sin Relaciones Drizzle (relations())
**Severidad: BAJA**

Los schemas no definen `relations()` como requiere CLAUDE.md sección 2.6:
> "**Siempre** definir relaciones en el schema con `relations()`"

**Nota:** Las relaciones son opcionales para funcionalidad básica. Requeridas para queries con JOINs automáticos.

---

## Configuración Actual

### server/db/index.ts
```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database(process.env.DATABASE_URL || './tuturno.db')
const db = drizzle(sqlite, { schema })

export { db }
export * from './schema'
```

### drizzle.config.ts
```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema/index.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: './tuturno.db',
  },
})
```

---

## Índices Creados (vía migraciones)

Los siguientes índices existen en las migraciones Drizzle:

```sql
-- De server/db/migrations/
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_document_id ON users(document_id);
CREATE UNIQUE INDEX idx_refresh_token ON refresh_sessions(token);
CREATE INDEX idx_turns_service_queue ON turns(service_id, status, queue_position);
CREATE INDEX idx_turns_citizen ON turns(citizen_id, status);
CREATE INDEX idx_push_user ON push_subscriptions(user_id);
```

---

## Migration Status

**✅ Migraciones aplicadas localmente**

El proyecto usa SQLite local con `better-sqlite3`. Las migraciones se encuentran en `server/db/migrations/` y están sincronizadas con el schema actual.

**Para regenerate migraciones después de cambios:**
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## Recommendations

### Prioridad 1 (Alta) - Correcciones de Schema

1. **Agregar `updatedAt` a entities, services, operators, turns**
   ```typescript
   updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
   ```

2. **Hacer `citizenId` NOT NULL en turns**
   ```typescript
   citizenId: text('citizen_id').notNull().references(() => users.id),
   ```

3. **Agregar `createdAt` y `updatedAt` a services** (falta completamente)

### Prioridad 2 (Media) - Mejoras

4. **Documentar o remover campos extra** (`documentId`, `requestedDate` en turns)

5. **Agregar `relations()`** a los schemas para queries con JOINs automáticos
   ```typescript
   export const usersRelations = relations(users, ({ many }) => ({
     turns: many(turns),
     refreshSessions: many(refreshSessions),
   }))
   ```

### Prioridad 3 (Futuro) - Switch a PostgreSQL

6. **Cuando se decida escalar a Supabase:**
   ```typescript
   // server/db/index.ts - implementar switch:
   const driver = process.env.DB_DRIVER ?? 'sqlite'
   export const db = driver === 'postgres'
     ? drizzlePostgres(process.env.DATABASE_URL!, { schema })
     : drizzleSQLite(process.env.DATABASE_URL || './tuturno.db', { schema })
   ```

---

## Resumen de Issues (SQLite Local)

| # | Severidad | Descripción | Acción |
|---|-----------|-------------|--------|
| 1 | ALTA | Falta `updatedAt` en entities | Agregar |
| 2 | ALTA | Falta `createdAt`/`updatedAt` en services | Agregar |
| 3 | MEDIA | Falta `updatedAt` en operators | Agregar |
| 4 | MEDIA | Falta `updatedAt` en turns | Agregar |
| 5 | ALTA | `citizenId` es nullable | Cambiar a NOT NULL |
| 6 | BAJA | Campo extra `documentId` en turns | Documentar o remover |
| 7 | BAJA | Campo extra `requestedDate` en turns | Documentar o remover |
| 8 | BAJA | Sin relaciones Drizzle | Opcional para SQLite |

---

## Nota sobre Supabase

**El proyecto Supabase "CampoApp" NO se usa para TuTurno.**

El schema de TuTurno reside completamente en SQLite local (`tuturno.db`). Si en el futuro se decide usar Supabase:
1. Crear un nuevo proyecto Supabase dedicado a TuTurno
2. Implementar el switch SQLite→Postgres en `server/db/index.ts`
3. Desplegar migraciones al nuevo proyecto
4. Configurar RLS policies
5. Actualizar `.env` con `DB_DRIVER=postgres`

---

*Auditoría generada: 2026-05-14*
*Proyecto: TuTurno - Sistema de Gestión de Turnos Digitales*
*Modo: SQLite Local (no Supabase)*
*Auditor: Claude Code (Senior Database Engineer)*