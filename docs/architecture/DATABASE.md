# Arquitectura de Base de Datos — TuTurno

> **Nota de migración:** Este schema es compatible tanto con SQLite (desarrollo local) como con PostgreSQL (Supabase producción). Drizzle ORM maneja la portabilidad del dialecto automáticamente.

---

## 1. ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐     │
│  │    users    │     │ refresh_sessions  │     │      entities    │     │
│  │             │     │                   │     │                  │     │
│  │ id (PK)     │◀────│ userId (FK)       │     │ id (PK)         │     │
│  │ fullName    │     │ id (PK)           │     │ name            │     │
│  │ documentId  │     │ token (unique)    │     │ type            │     │
│  │ email       │     │ expiresAt         │     │ address         │     │
│  │ phone       │     │ userAgent         │     │ city            │     │
│  │ passwordHash│     │ createdAt        │     │ latitude        │     │
│  │ role        │     └───────────────────┘     │ longitude       │     │
│  │ isActive    │                               │ phone           │     │
│  │ createdAt   │                               │ email           │     │
│  │ updatedAt   │                               │ logoUrl         │     │
│  └──────────────┘                               │ isActive        │     │
│       │                                         │ createdAt       │     │
│       │ 1:N                                     └──────────────────┘     │
│       │                                               │ 1:N              │
│       ├───────────────────────────────────────────────┤                   │
│       │ 1:N                                         │                    │
│  ┌────┴───────┐     ┌───────────────────┐     ┌─────┴────────┐          │
│  │   turns   │     │ push_subscriptions│     │   services   │          │
│  │            │     │                  │     │              │          │
│  │ id (PK)   │◀────│ userId (FK)       │◀────│ entityId (FK)│          │
│  │ turnNumber│     │ id (PK)          │     │ id (PK)      │          │
│  │ citizenId │     │ endpoint         │     │ name         │          │
│  │ serviceId │     │ p256dh           │     │ description  │          │
│  │ entityId  │     │ auth             │     │ avgAttention │         │
│  │ status    │     │ createdAt        │     │ openTime     │          │
│  │ queuePos  │     └───────────────────┘     │ closeTime    │          │
│  │ notifiedAt│                                 │ isActive     │          │
│  │ calledAt  │                                 │ isPaused     │          │
│  │ completed │                                 └──────────────┘          │
│  │ createdAt │                                       │                     │
│  └──────────┘                                       │ 1:N                 │
│       │                                             │                     │
│       │ 1:N                                         │                     │
│  ┌────┴────────┐     ┌─────────────────┐            │                     │
│  │  operators  │     │   turns         │            │                     │
│  │             │◀────│ serviceId (FK) │            │                     │
│  │ id (PK)    │     │ entityId (FK)   │◀───────────┘                     │
│  │ userId (FK)│     └─────────────────┘                                  │
│  │ serviceId  │                                                            │
│  │ entityId  │                                                            │
│  │ isActive  │                                                            │
│  │ createdAt │                                                            │
│  └───────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Descripción de Tablas

### users

**Propósito:** Almacena todos los usuarios del sistema (ciudadanos, operadores, administradores).

**Comportamiento:**
- Un usuario puede ser ciudadano (crear turnos), operador (atender turnos) o admin (gestionar el sistema)
- El email y documentId son únicos (no hay dos usuarios con el mismo email o cédula)
- `passwordHash` usa bcrypt ( nunca se almacena texto plano)
- `role` determina los permisos de acceso

**Índices:**
- `email` → UNIQUE, para login rápido
- `documentId` → UNIQUE, para verificar identidad
- `role` → INDEX, para filtrar por rol (ej: todos los operadores)

---

### refresh_sessions

**Propósito:** Manejo de sesiones de refresh token para autenticación persistente.

**Comportamiento:**
- Cada login crea un nuevo refresh session
- El refresh token es un UUID opaco (no JWT)
- `expiresAt` típicamente 7 días después de creación
- Cascade delete: si se borra el usuario, se borran sus sesiones
- `userAgent` es opcional pero útil para debugging

**Seguridad:**
- Al hacer logout, se borra el refresh session de la DB
- Refresh token rotation: cada refresh genera un nuevo par de tokens y borra el viejo

---

### entities

**Propósito:** Representa las organizaciones donde los ciudadanos solicitan turnos.

**Comportamiento:**
- `type` categoriza: EPS, banco, oficina pública, otro
- `latitude`/`longitude` son opcionales para mostrar en mapa
- `isActive` permite desactivar una entidad sin borrarla (los turnos históricos se mantienen)

**Índices:**
- `city` → INDEX, para filtrar por ciudad en el seed
- `type` → INDEX, para filtrar por tipo
- `isActive` → INDEX, para excluir entidades inactivas

---

### services

**Propósito:** Los servicios o trámites que ofrece cada entidad.

**Comportamiento:**
- Cada servicio pertenece a una entidad (entityId FK)
- `avgAttentionTime` en minutos, se usa para calcular tiempo estimado de espera
- `openTime`/`closeTime` en formato "HH:MM" (UTC-5 Colombia)
- `isPaused` permite pausar un servicio temporalmente (cola no avanza)
- `isActive` permite desactivar permanentemente

**Relaciones:**
- Una entidad tiene muchos servicios
- Un servicio tiene muchos turnos
- Un servicio tiene muchos operadores asignados

**Índices:**
- `entityId` → INDEX, para buscar servicios de una entidad
- `isActive` → INDEX, para filtrar solo activos

---

### operators

**Propósito:** Relación many-to-many entre usuarios y servicios. Un usuario operador puede atender múltiples servicios en múltiples entidades.

**Comportamiento:**
- `userId` → FK a users (el usuario que es operador)
- `serviceId` → FK a services (el servicio que atiende)
- `entityId` → Redundante pero útil para queries directas sin JOIN

**Notas:**
- Un mismo usuario puede ser operador de múltiples servicios
- Un servicio puede tener múltiples operadores
- `isActive` permite desactivar un operador temporalmente

**Índices:**
- `userId` → INDEX
- `serviceId` → INDEX

---

### turns

**Propósito:** El turno solicitado por un ciudadano para un servicio específico.

**Comportamiento:**
- `turnNumber` es único por día (formato: "A-001")
- `status` define el ciclo de vida: waiting → called → attending → completed
- `queuePosition` se actualiza cuando alguien cancela o es atendido
- `notifiedAt` se setea cuando se envía la notificación push
- `calledAt` se setea cuando el operador llama este turno

**Ciclo de vida:**
```
waiting ──(operador llama)──▶ called ──(ciudadano es atendido)──▶ attending ──(operador completa)──▶ completed
   │                           │                                      │
   │                           │                                      │
   └────(ciudadano cancela)─────┘                                      │
                                                                         │
                           ◀──(no show)──┘
```

**Índices:**
- `citizenId` → INDEX, para "mis turnos"
- `serviceId` → INDEX, para la cola del servicio
- `entityId` → INDEX, para reportes por entidad
- `status` → INDEX, para filtrar por estado
- `createdAt` → INDEX, para reportes por fecha

**Restricciones:**
- CHECK: `status IN ('waiting', 'called', 'attending', 'completed', 'no_show', 'cancelled')`
- CHECK: `queuePosition > 0`

---

### push_subscriptions

**Propósito:** Almacena las suscripciones de Web Push para enviar notificaciones.

**Comportamiento:**
- `endpoint` es la URL del PushManager del navegador
- `p256dh` y `auth` son las claves del subscription
- Un usuario puede tener múltiples dispositivos suscritos

**Notas:**
- Chrome, Firefox, Safari tienen sus propios PushManager
- Si el subscription expira o es inválido, el servidor recibe error 410 y debe eliminarlo

**Índices:**
- `userId` → INDEX
- `endpoint` → UNIQUE

---

## 3. Migración SQLite → Supabase

### Qué cambia

| Aspecto | SQLite | PostgreSQL (Supabase) |
|---------|--------|------------------------|
| Dialect | `sqlite` | `postgresql` |
| Driver | `better-sqlite3` | `postgres-js` |
| URL connection | Path `./tuturno.db` | `postgresql://...` |
| JSON storage | Text (manual parse) | JSONB nativo |
| Full-text search | FTS5 (opcional) | native `tsvector` |
| Timestamp handling | Unix integer | `TIMESTAMPTZ` |

### Qué NO cambia

- Todo el schema Drizzle es portable
- Queries en `/server/db/queries/` funcionan igual
- Las migraciones generadas por drizzle-kit son compatibles

### Configuración dual en Drizzle

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema/index.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

```typescript
// server/db/index.ts
import { drizzle } from 'drizzle-orm/d1'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'

const driver = process.env.DB_DRIVER ?? 'sqlite'

export const db = driver === 'postgres'
  ? drizzlePostgres(process.env.DATABASE_URL!, { schema })
  : drizzle(new Database('./tuturno.db'), { schema })
```

### Cómo migrar

```bash
# 1. Exportar datos de SQLite (si hay datos existentes)
# 2. Crear proyecto en Supabase
# 3. Obtener connection string de Supabase Dashboard
# 4. Cambiar .env:
DB_DRIVER=postgres
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# 5. Generar migraciones para Postgres
npx drizzle-kit generate

# 6. Aplicar en Supabase (usar Supabase Dashboard SQL Editor o drizzle-kit migrate)
npx drizzle-kit migrate
```

### Notas para PostgreSQL/Supabase

- Usar `TIMESTAMPTZ` para timestamps con zona horaria
- Para búsqueda de texto completo, usar `tsvector` y `ts_rank`
- Los índices parciales son útiles para filtrado frecuente (ej: turnos activos)
- JSONB para metadatos flexibles si se necesita

---

## 4. Índices Recomendados

> **Best Practice (Postgres):** Crear índices para columnas que aparecen frecuentemente en WHERE, ORDER BY y JOIN. Los índices compuestos deben seguir el orden deselectividad.

```sql
-- users: login rápido por email (consulta más frecuente)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- users: búsqueda por cédula
CREATE UNIQUE INDEX idx_users_document_id ON users(document_id);

-- users: filtrar por rol (admin queries)
CREATE INDEX idx_users_role ON users(role) WHERE is_active = true;

-- refresh_sessions: búsqueda por token (logout/refresh)
CREATE UNIQUE INDEX idx_refresh_token ON refresh_sessions(token);

-- refresh_sessions:cleanup de sesiones expiradas
CREATE INDEX idx_refresh_expires ON refresh_sessions(expires_at);

-- entities: búsqueda por ciudad/tipo
CREATE INDEX idx_entities_city ON entities(city);
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_active ON entities(is_active) WHERE is_active = true;

-- services: servicios de una entidad
CREATE INDEX idx_services_entity ON services(entity_id) WHERE is_active = true;

-- turns: cola de un servicio (ORDER BY más común)
CREATE INDEX idx_turns_service_queue ON turns(service_id, status, queue_position)
  WHERE status = 'waiting';

-- turns: turnos de un ciudadano
CREATE INDEX idx_turns_citizen ON turns(citizen_id, status);

-- turns: turnos por fecha (reportes)
CREATE INDEX idx_turns_created ON turns(created_at DESC);

-- turns: dashboard admin (turnos recientes)
CREATE INDEX idx_turns_recent ON turns(created_at DESC) WHERE status IN ('waiting', 'called', 'attending');

-- push_subscriptions: búsqueda por usuario
CREATE INDEX idx_push_user ON push_subscriptions(user_id);
CREATE UNIQUE INDEX idx_push_endpoint ON push_subscriptions(endpoint);
```

### Índices Condicionales (PostgreSQL)

```sql
-- Solo turnos en espera para optimización de cola
CREATE INDEX idx_turns_waiting ON turns(service_id, queue_position)
  WHERE status = 'waiting';

-- Solo usuarios activos para queries de operadores
CREATE INDEX idx_operators_active ON operators(user_id, service_id)
  WHERE is_active = true;
```

---

## 5. foreign_keys y Relaciones

Drizzle define las foreign keys en el schema. Para PostgreSQL, considerar:

```sql
-- Ejemplo de constraint explícita (opcional, Drizzle lo hace automático)
ALTER TABLE turns
  ADD CONSTRAINT fk_turns_citizen
  FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE turns
  ADD CONSTRAINT fk_turns_service
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;
```

> **Nota:** Para Supabase, usar Row Level Security (RLS) en conjunto con foreign keys para seguridad adicional.
