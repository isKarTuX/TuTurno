# PHASE-02 — Base de Datos y Schema

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 2
Depende de: PHASE-01
Tiempo estimado: 45 min
```

---

## 1. Objetivo

Crear el schema completo de la base de datos con Drizzle ORM, configurar la conexión dual SQLite/PostgreSQL, generar las migraciones y crear el seed con datos de prueba realistas.

---

## 2. Schema de Cada Tabla

### users

```typescript
export const users = sqliteTable('users', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName:     text('full_name').notNull(),
  documentId:   text('document_id').notNull().unique(),
  email:        text('email').notNull().unique(),
  phone:        text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
  role:         text('role', { enum: ['citizen', 'operator', 'admin'] }).notNull().default('citizen'),
  isActive:     integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt:    integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt:    integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

**Campos explicados:**
- `id`: UUID generado automáticamente
- `fullName`: Nombre completo del usuario
- `documentId`: Cédula de ciudadanía (única, indexada)
- `email`: Email único para login
- `phone`: Teléfono de contacto
- `passwordHash`: Hash bcrypt de la contraseña (nunca guardar en texto plano)
- `role`: Rol en el sistema (ciudadano/operador/admin)
- `isActive`: Para desactivar cuentas sin borrarlas
- `createdAt`/`updatedAt`: Timestamps automáticos

### refresh_sessions

```typescript
export const refreshSessions = sqliteTable('refresh_sessions', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token:     text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

**Campos explicados:**
- `userId`: FK a users (cascade delete)
- `token`: Token opaco UUID para refresh
- `expiresAt`: Cuando expira este refresh token
- `userAgent`: Para tracking de sesiones

### entities

```typescript
export const entities = sqliteTable('entities', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:        text('name').notNull(),
  type:        text('type', { enum: ['eps', 'bank', 'public_office', 'other'] }).notNull(),
  address:     text('address').notNull(),
  city:        text('city').notNull(),
  latitude:    real('latitude'),
  longitude:   real('longitude'),
  phone:       text('phone'),
  email:       text('email'),
  logoUrl:     text('logo_url'),
  isActive:    integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt:   integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

**Campos explicados:**
- `type`: Categoría de entidad (EPS, banco, oficina pública)
- `latitude`/`longitude`: Para mapa de ubicaciones
- `logoUrl`: Logo de la entidad (opcional)

### services

```typescript
export const services = sqliteTable('services', {
  id:               text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityId:         text('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  name:             text('name').notNull(),
  description:      text('description'),
  avgAttentionTime: integer('avg_attention_time').notNull().default(5),
  openTime:         text('open_time').notNull().default('08:00'),
  closeTime:        text('close_time').notNull().default('17:00'),
  isActive:         integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isPaused:         integer('is_paused', { mode: 'boolean' }).notNull().default(false),
})
```

**Campos explicados:**
- `avgAttentionTime`: Tiempo promedio de atención en minutos (para calcular espera)
- `openTime`/`closeTime`: Horario de atención (formato HH:MM)
- `isPaused`: Para pausar un servicio sin desactivarlo

### operators

```typescript
export const operators = sqliteTable('operators', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  entityId:  text('entity_id').notNull().references(() => entities.id),
  isActive:  integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

**Campos explicados:**
- Relación user → service (un operador atiende un servicio)
- `entityId`: redundancy for easier queries

### turns

```typescript
export const turns = sqliteTable('turns', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turnNumber:   text('turn_number').notNull(),
  citizenId:    text('citizen_id').notNull().references(() => users.id),
  serviceId:    text('service_id').notNull().references(() => services.id),
  entityId:     text('entity_id').notNull().references(() => entities.id),
  status:       text('status', {
    enum: ['waiting', 'called', 'attending', 'completed', 'no_show', 'cancelled']
  }).notNull().default('waiting'),
  queuePosition: integer('queue_position').notNull(),
  notifiedAt:   integer('notified_at', { mode: 'timestamp' }),
  calledAt:     integer('called_at', { mode: 'timestamp' }),
  completedAt:  integer('completed_at', { mode: 'timestamp' }),
  createdAt:    integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

**Campos explicados:**
- `turnNumber`: Ej "A-047" (prefijo de servicio + número)
- `status`: Ciclo de vida completo del turno
- `queuePosition`: Posición actual en la cola
- `notifiedAt`: Cuando se envió la notificación push
- `calledAt`: Cuando el operador llamó este turno

### push_subscriptions

```typescript
export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint:     text('endpoint').notNull(),
  p256dh:       text('p256dh').notNull(),
  auth:         text('auth').notNull(),
  createdAt:    integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

---

## 3. Relaciones entre Tablas

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│    users    │───────│    operators     │───────│   services  │
│             │  1:N  │                  │  N:1  │             │
│ (citizen)   │       │ (userId FK)      │       │ (entityId)  │
└─────────────┘       └──────────────────┘       └──────┬──────┘
       │                                              │
       │ 1:N                                    1:N   │
       │                                    ┌────────┴────────┐
┌──────┴──────┐    ┌──────────────────┐    │                │
│   turns    │────│ push_subscriptions│    │    entities    │
│             │ N:1│                  │    │                │
│ (citizenId) │    │ (userId FK)      │    └────────────────┘
│ (serviceId) │
│ (entityId)  │
└─────────────┘

┌───────────────────┐
│ refresh_sessions  │
│                   │
│ (userId FK)       │
└───────────────────┘
```

---

## 4. Archivos a Crear

```
server/db/
├── index.ts                   ← Conexión DB (SQLite/Postgres switch)
├── schema/
│   ├── index.ts                ← Re-export de todo el schema
│   ├── users.ts
│   ├── entities.ts
│   ├── services.ts
│   ├── turns.ts
│   ├── operators.ts
│   ├── notifications.ts
│   └── sessions.ts
├── migrations/
│   └── (auto-generadas)
└── seeds/
    └── seed.ts                 ← Datos de prueba
```

---

## 5. Configuración Drizzle

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite', // Cambiar a 'postgres' para Supabase
  schema: './server/db/schema/index.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || './tuturno.db',
  },
})
```

---

## 6. Datos del Seed

### Entidades

| Nombre | Tipo | Ciudad | Dirección |
|--------|------|--------|------------|
| EPS Sura Montería | eps | Montería | Calle 63 #14-45 |
| Bancolombia Montería | bank | Montería | Carrera 3 #25-48 |
| Secretaría de Hacienda | public_office | Montería | Calle 30 #15-32 |

### Servicios por Entidad

**EPS Sura Montería:**
- Afiliaciones (A)
- Urgencias (U)
- Laboratorio (L)

**Bancolombia Montería:**
- Cuentas y Transfers (C)
- Créditos (R)
- Seguros (S)

**Secretaría de Hacienda:**
- Declaraciones (D)
- Pagos (P)
- Certificados (Ce)

### Usuarios de Prueba

| Email | Contraseña | Rol | Nombre |
|-------|------------|-----|--------|
| admin@tuturno.co | admin123 | admin | Admin TuTurno |
| operador@sura.co | op123456 | operator | Operador Sura |
| operador@bancolombia.co | op123456 | operator | Operador Bancolombia |
| ciudadano1@test.com | ciu123456 | citizen | Juan Pérez |
| ciudadano2@test.com | ciu123456 | citizen | María García |
| ciudadano3@test.com | ciu123456 | citizen | Carlos López |

### Turnos de Prueba

- 10 turnos en estados variados (waiting, called, attending, completed, no_show, cancelled)
- Repartidos entre los servicios de las 3 entidades
- Diferentes posiciones en cola

---

## 7. Criterios de Éxito

- [ ] `npx drizzle-kit generate` genera las migraciones sin errores
- [ ] `npx drizzle-kit migrate` aplica las migraciones y crea las tablas
- [ ] `npx tsx server/db/seeds/seed.ts` inserta los datos de prueba
- [ ] Las foreign keys están correctamente definidas
- [ ] Los índices necesarios existen (email, documentId, turnNumber)
- [ ] La conexión dual SQLite/PostgreSQL funciona con solo cambiar DB_DRIVER

---

## 8. Comando de Verificación

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
npx tsx server/db/seeds/seed.ts
# Verificar que la DB se creó y tiene los datos
```
