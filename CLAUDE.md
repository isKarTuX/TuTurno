# CLAUDE.md — TuTurno: Sistema de Gestión de Turnos Digitales
> Documento maestro de reglas, arquitectura y contexto para Claude Code.
> Lee este archivo completo antes de escribir cualquier línea de código.
> Toda decisión técnica, de diseño y de estructura debe alinearse con estas reglas.

---

## 0. CONTEXTO DEL PROYECTO

**TuTurno** es una plataforma digital que elimina las filas físicas en entidades públicas y privadas (EPS, bancos, oficinas administrativas) en Colombia. Los ciudadanos solicitan turnos digitales desde cualquier dispositivo, monitoran su posición en cola en tiempo real y reciben notificaciones push cuando están próximos a ser atendidos.

**Tres tipos de usuario:**
- **Ciudadano**: Solicita, monitorea y cancela turnos desde cualquier dispositivo.
- **Operador**: Gestiona la cola de su punto de atención, llama turnos y registra atenciones.
- **Administrador**: Configura entidades, servicios, operadores y accede a reportes globales.

**Propósito académico**: Proyecto de la Universidad de Córdoba — Departamento de Ingeniería de Sistemas y Telecomunicaciones. El código debe ser ejemplar, limpio y documentado.

---

## 1. STACK TECNOLÓGICO DEFINITIVO

### Por qué este stack

Se elige **Nuxt 3** como framework principal por las siguientes razones técnicas objetivas para este proyecto:
- Full-stack en un solo repositorio: el servidor **Nitro** expone las API routes sin necesidad de un backend separado.
- Soporte nativo de **WebSockets** a través de Nitro + `crossws`, exactamente lo que necesita el tiempo real de TuTurno.
- **Drizzle ORM** soporta SQLite Y PostgreSQL con el mismo código — migrar de SQLite a Supabase es cambiar una línea de configuración.
- **Vue 3 + Composition API + TypeScript** = código reactivo, tipado y mantenible.
- SSR híbrido: las páginas públicas (landing) son SSG, las privadas son SPA. Mejor SEO + mejor UX.

### Stack completo

```
CAPA                  TECNOLOGÍA                          VERSIÓN
─────────────────────────────────────────────────────────────────
Framework             Nuxt 3                              ^3.13+
Lenguaje              TypeScript                          strict mode
Runtime CSS           Tailwind CSS v4                     ^4.0+
Animaciones           @vueuse/motion + CSS nativo         latest
Estado global         Pinia                               ^2.x
HTTP cliente          $fetch (nativo Nuxt) + ofetch       nativo
Validación            Zod                                 ^3.x
Formularios           vee-validate + Zod                  ^4.x
─────────────────────────────────────────────────────────────────
Backend (API)         Nuxt Nitro (H3)                     nativo
WebSockets            crossws (Nitro nativo)              nativo
Auth                  JWT custom (jose) + httpOnly cookies
Hashing               bcryptjs                            ^2.x
─────────────────────────────────────────────────────────────────
ORM                   Drizzle ORM                         ^0.36+
DB Desarrollo         SQLite (better-sqlite3)             local
DB Producción         Supabase (PostgreSQL)               hosted
Migraciones           drizzle-kit                         ^0.27+
─────────────────────────────────────────────────────────────────
Notificaciones Push   web-push (VAPID)                    ^3.x
Service Worker        Nuxt PWA module                     latest
─────────────────────────────────────────────────────────────────
Testing               Vitest (unit) + Playwright (e2e)   latest
Linting               ESLint + @nuxt/eslint               latest
Formato               Prettier                            ^3.x
─────────────────────────────────────────────────────────────────
Íconos                @nuxt/icon + Lucide                 latest
Fuentes               Nuxt Fonts (Geist + DM Sans)        latest
```

---

## 2. REGLAS ABSOLUTAS DE CÓDIGO (NO NEGOCIABLES)

### 2.1 TypeScript — Reglas estrictas

```typescript
// ❌ NUNCA hacer esto
const user: any = getUser()
let data = await fetch('/api/turns') // sin tipo
function doSomething(id) { ... } // sin tipos en parámetros

// ✅ SIEMPRE hacer esto
const user: User = await getUser()
const data: TurnResponse = await $fetch<TurnResponse>('/api/turns')
function getTurnById(id: string): Promise<Turn | null> { ... }
```

- `strict: true` en `tsconfig.json`. Sin excepciones.
- Todos los tipos de dominio en `/types/index.ts` o archivos específicos en `/types/`.
- Nunca usar `any`. Si no sabes el tipo, usar `unknown` y hacer type narrowing.
- Interfaces para objetos de dominio, `type` para unions y aliases.

- Usar utility types de TypeScript cuando correspondan (Partial, Pick, Omit, etc.)

### 2.2 Estructura de archivos — Reglas de ubicación

```
ARCHIVO                          REGLA
─────────────────────────────────────────────────────────────────────
Tipos de dominio                 /types/[domain].types.ts
Schemas Zod                      /schemas/[domain].schema.ts
Composables Vue                  /composables/use[Name].ts
Stores Pinia                     /stores/[name].store.ts
Utils puros (sin Vue)            /utils/[name].utils.ts
Constantes                       /constants/[name].constants.ts
Middleware Nuxt                  /middleware/[name].ts
Server middleware Nitro          /server/middleware/[name].ts
API routes                       /server/api/[recurso]/[acción].ts
WebSocket handlers               /server/routes/_ws/[name].ts
Modelos Drizzle                  /server/db/schema/[entity].ts
Queries reutilizables            /server/db/queries/[entity].queries.ts
Migraciones                      /server/db/migrations/
Seeders                          /server/db/seeds/
```

### 2.3 Naming conventions

```
ELEMENTO                         CONVENCIÓN              EJEMPLO
─────────────────────────────────────────────────────────────────────
Componentes Vue                  PascalCase              TurnCard.vue
Composables                      camelCase prefijo use   useTurnQueue.ts
Stores Pinia                     camelCase               useTurnStore.ts
API routes (archivos)            kebab-case              [id].get.ts
Variables/funciones              camelCase               currentTurn
Constantes                       UPPER_SNAKE             MAX_TURNS_PER_USER
Tipos/Interfaces                 PascalCase              TurnStatus
Enums                            PascalCase + values     TurnStatus.ACTIVE
CSS classes (Tailwind)           kebab-case              turn-card
CSS variables                    --kebab-case            --color-primary
```

### 2.4 Componentes Vue — Reglas

- **Siempre** usar `<script setup lang="ts">` (no Options API, nunca).
- **Siempre** tipar props con `defineProps<Props>()` usando interfaz.
- **Siempre** tipar emits con `defineEmits<Emits>()`.
- Un componente = una responsabilidad. Si tiene más de 200 líneas, dividir.
- No lógica de negocio en componentes. La lógica va en composables o stores.
- Props: solo datos. No pasar stores completos como props.

```vue
<!-- ✅ Ejemplo correcto de componente -->
<script setup lang="ts">
interface Props {
  turn: Turn
  isActive?: boolean
}

interface Emits {
  (e: 'call', turnId: string): void
  (e: 'complete', turnId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
```

### 2.5 API Routes Nitro — Reglas

- Un archivo = un método HTTP. `turns.get.ts`, `turns.post.ts`, `[id].delete.ts`.
- **Siempre** validar el body con Zod antes de tocar la DB.
- **Siempre** usar `defineEventHandler` y manejar errores con `createError`.
- **Siempre** verificar autenticación con el middleware de auth en rutas protegidas.
- Nunca lógica de negocio directamente en el handler. Llamar funciones de `/server/db/queries/`.

```typescript
// ✅ Ejemplo correcto de API route
export default defineEventHandler(async (event) => {
  // 1. Auth check
  const user = await requireAuth(event) // lanza 401 si no autenticado

  // 2. Validar input
  const body = await readValidatedBody(event, TurnCreateSchema.parse)

  // 3. Lógica de negocio (en queries, no aquí)
  const turn = await createTurn(body, user.id)

  // 4. Respuesta tipada
  return { success: true, data: turn } satisfies ApiResponse<Turn>
})
```

### 2.6 Base de datos — Reglas Drizzle

- **Nunca** SQL crudo. Todo a través de Drizzle query builder.
- **Siempre** definir relaciones en el schema con `relations()`.
- **Siempre** usar transacciones para operaciones que afectan múltiples tablas.
- Las queries reutilizables van en `/server/db/queries/[entity].queries.ts`.
- Nombrar tablas en `snake_case` plural: `users`, `turns`, `entities`, `services`.
- Nunca hacer migraciones manuales. Siempre `drizzle-kit generate` → `drizzle-kit migrate`.
- **Crear índices** para columnas usadas frecuentemente en WHERE, ORDER BY y JOIN.
- Usar **índices condicionales** para filtrado frecuente (ej: `WHERE status = 'waiting'`).

---

## 3. ARQUITECTURA DEL PROYECTO

### 3.1 Estructura de directorios completa

```
tuturno/
├── CLAUDE.md                          ← Este archivo. Leerlo siempre.
├── .env.example                       ← Variables de entorno documentadas
├── .env                               ← NO commitear. En .gitignore
├── nuxt.config.ts                     ← Configuración central de Nuxt
├── tailwind.config.ts                 ← Tokens de diseño
├── drizzle.config.ts                  ← Config de Drizzle ORM
├── tsconfig.json                      ← TypeScript strict
│
├── types/                             ← Tipos TypeScript globales
│   ├── index.ts                       ← Re-exports
│   ├── auth.types.ts
│   ├── turn.types.ts
│   ├── entity.types.ts
│   ├── service.types.ts
│   ├── user.types.ts
│   └── api.types.ts                   ← Tipos de respuesta de API
│
├── schemas/                           ← Schemas de validación Zod
│   ├── auth.schema.ts
│   ├── turn.schema.ts
│   ├── entity.schema.ts
│   └── user.schema.ts
│
├── constants/
│   ├── turn.constants.ts              ← TURN_STATUS, MAX_TURNS, etc.
│   ├── roles.constants.ts             ← USER_ROLES
│   └── ws.constants.ts               ← Eventos WebSocket
│
├── composables/
│   ├── useAuth.ts                     ← Login, logout, estado de sesión
│   ├── useTurnQueue.ts                ← Seguimiento de cola en tiempo real
│   ├── useWebSocket.ts                ← Conexión WS genérica
│   ├── useNotifications.ts            ← Push notifications
│   ├── useEntities.ts                 ← CRUD de entidades
│   └── useToast.ts                    ← Notificaciones UI
│
├── stores/
│   ├── auth.store.ts                  ← Estado de autenticación global
│   ├── turn.store.ts                  ← Turnos activos del ciudadano
│   ├── queue.store.ts                 ← Estado de cola por servicio
│   └── entity.store.ts               ← Datos de entidades
│
├── utils/
│   ├── turn.utils.ts                  ← Formatear números, estados
│   ├── time.utils.ts                  ← Formatear tiempos, estimaciones
│   ├── date.utils.ts                  ← Fechas en español colombiano
│   └── cn.utils.ts                    ← clsx helper para Tailwind
│
├── middleware/                        ← Middleware de rutas Nuxt (cliente)
│   ├── auth.ts                        ← Redirige si no autenticado
│   ├── guest.ts                       ← Redirige si ya autenticado
│   ├── operator.ts                    ← Solo operadores
│   └── admin.ts                       ← Solo administradores
│
├── plugins/
│   ├── pinia.ts                       ← Configuración Pinia
│   └── ws.client.ts                   ← Init WebSocket en cliente
│
├── assets/
│   ├── css/
│   │   ├── main.css                   ← Variables CSS + base styles
│   │   ├── animations.css             ← Keyframes y utilidades
│   │   └── glass.css                  ← Clases glassmorphism
│   └── fonts/                         ← Fuentes locales si aplica
│
├── public/
│   ├── icons/                         ← PWA icons
│   ├── sw.js                          ← Service Worker (auto-generado)
│   └── manifest.json                  ← PWA manifest
│
├── components/
│   ├── ui/                            ← Componentes base del design system
│   │   ├── UiButton.vue
│   │   ├── UiInput.vue
│   │   ├── UiCard.vue                 ← Card glassmorphism base
│   │   ├── UiBadge.vue
│   │   ├── UiModal.vue
│   │   ├── UiSkeleton.vue
│   │   ├── UiToast.vue
│   │   ├── UiSpinner.vue
│   │   └── UiProgressBar.vue
│   │
│   ├── layout/
│   │   ├── AppNavbar.vue
│   │   ├── AppSidebar.vue             ← Para admin/operador
│   │   ├── AppFooter.vue
│   │   └── AppMobileNav.vue           ← Bottom nav para móvil
│   │
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   ├── RegisterForm.vue
│   │   └── ForgotPasswordForm.vue
│   │
│   ├── turn/
│   │   ├── TurnCard.vue               ← Card de un turno activo
│   │   ├── TurnTicket.vue             ← Ticket con QR
│   │   ├── TurnTracker.vue            ← Widget seguimiento en tiempo real
│   │   ├── TurnProgressBar.vue        ← Barra de posición en cola
│   │   ├── TurnCounterDisplay.vue     ← Número con flip animation
│   │   ├── TurnStatusBadge.vue        ← Badge de estado
│   │   └── TurnHistoryItem.vue        ← Item de historial
│   │
│   ├── entity/
│   │   ├── EntityCard.vue
│   │   ├── EntitySearchBar.vue
│   │   ├── EntityMap.vue              ← Mapa con ubicaciones
│   │   └── EntityServiceList.vue
│   │
│   ├── operator/
│   │   ├── OperatorQueue.vue          ← Cola de turnos del operador
│   │   ├── OperatorCurrentTurn.vue    ← Turno activo en grande
│   │   ├── OperatorControls.vue       ← Botones: Llamar, Atendido, etc.
│   │   └── OperatorStats.vue         ← Métricas en vivo
│   │
│   ├── admin/
│   │   ├── AdminMetricCard.vue
│   │   ├── AdminEntityForm.vue
│   │   ├── AdminServiceForm.vue
│   │   ├── AdminOperatorAssign.vue
│   │   └── AdminReportsChart.vue
│   │
│   └── landing/
│       ├── LandingHero.vue
│       ├── LandingHowItWorks.vue
│       ├── LandingForEntities.vue
│       ├── LandingRealTime.vue
│       ├── LandingMetrics.vue
│       └── LandingCTA.vue
│
├── layouts/
│   ├── default.vue                    ← Landing y páginas públicas
│   ├── auth.vue                       ← Login/Register (sin nav)
│   ├── citizen.vue                    ← App ciudadano (con bottom nav móvil)
│   ├── operator.vue                   ← Panel operador (sidebar)
│   └── admin.vue                      ← Panel admin (sidebar completo)
│
├── pages/
│   ├── index.vue                      ← Landing page (SSG)
│   ├── auth/
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── forgot-password.vue
│   ├── app/                           ← Ciudadano (layout: citizen)
│   │   ├── index.vue                  ← Home: búsqueda de entidades
│   │   ├── turns/
│   │   │   ├── index.vue              ← Mis Turnos
│   │   │   └── [id].vue              ← Seguimiento de turno específico
│   │   ├── entities/
│   │   │   ├── index.vue              ← Listado de entidades
│   │   │   └── [id]/
│   │   │       ├── index.vue          ← Detalle de entidad + servicios
│   │   │       └── [serviceId].vue   ← Solicitar turno para servicio
│   │   └── profile.vue
│   ├── operator/                      ← Panel operador (layout: operator)
│   │   ├── index.vue                  ← Cola de turnos en vivo
│   │   └── stats.vue                  ← Estadísticas del día
│   └── admin/                         ← Panel admin (layout: admin)
│       ├── index.vue                  ← Dashboard con métricas
│       ├── entities/
│       │   ├── index.vue
│       │   ├── new.vue
│       │   └── [id].vue
│       ├── operators/
│       │   └── index.vue
│       └── reports/
│           └── index.vue
│
└── server/
    ├── middleware/
    │   ├── auth.ts                    ← Verifica JWT en cada request
    │   └── cors.ts                    ← Headers CORS
    │
    ├── utils/
    │   ├── auth.utils.ts              ← requireAuth(), generateTokens()
    │   ├── jwt.utils.ts               ← sign, verify, refresh
    │   ├── hash.utils.ts              ← bcrypt helpers
    │   ├── response.utils.ts          ← success(), error() helpers
    │   └── ws.utils.ts                ← broadcast helpers
    │
    ├── routes/
    │   └── _ws/
    │       └── turns.ts               ← WebSocket handler principal
    │
    ├── api/
    │   ├── auth/
    │   │   ├── login.post.ts
    │   │   ├── register.post.ts
    │   │   ├── logout.post.ts
    │   │   ├── refresh.post.ts
    │   │   └── me.get.ts
    │   ├── turns/
    │   │   ├── index.get.ts           ← Mis turnos activos
    │   │   ├── index.post.ts          ← Crear turno
    │   │   ├── [id].get.ts            ← Detalle de turno
    │   │   └── [id].delete.ts         ← Cancelar turno
    │   ├── entities/
    │   │   ├── index.get.ts
    │   │   ├── index.post.ts          ← Solo admin
    │   │   ├── [id].get.ts
    │   │   └── [id].patch.ts          ← Solo admin
    │   ├── services/
    │   │   ├── index.get.ts
    │   │   ├── index.post.ts
    │   │   └── [id]/
    │   │       ├── queue.get.ts       ← Estado actual de la cola
    │   │       └── queue.post.ts      ← Acción de operador
    │   ├── operator/
    │   │   ├── queue.get.ts
    │   │   ├── call-next.post.ts
    │   │   ├── complete.post.ts
    │   │   └── no-show.post.ts
    │   ├── admin/
    │   │   ├── metrics.get.ts
    │   │   ├── operators.get.ts
    │   │   ├── operators.post.ts
    │   │   └── reports.get.ts
    │   └── notifications/
    │       └── subscribe.post.ts      ← Registro de push subscription
    │
    └── db/
        ├── index.ts                   ← Instancia de DB (SQLite/Postgres)
        ├── schema/
        │   ├── index.ts               ← Re-export de todo el schema
        │   ├── users.ts
        │   ├── entities.ts
        │   ├── services.ts
        │   ├── turns.ts
        │   ├── operators.ts
        │   ├── notifications.ts
        │   └── sessions.ts
        ├── queries/
        │   ├── users.queries.ts
        │   ├── turns.queries.ts
        │   ├── entities.queries.ts
        │   ├── services.queries.ts
        │   └── queue.queries.ts
        ├── migrations/                ← Auto-generadas por drizzle-kit
        └── seeds/
            └── seed.ts                ← Datos de prueba
```

---

## 4. BASE DE DATOS — SCHEMA COMPLETO

### 4.1 Configuración dual SQLite → Supabase

```typescript
// server/db/index.ts
// Cambiar DB_DRIVER=sqlite a DB_DRIVER=postgres en .env para cambiar

import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

const driver = process.env.DB_DRIVER ?? 'sqlite'

export const db = driver === 'postgres'
  ? drizzlePostgres(process.env.DATABASE_URL!, { schema })
  : drizzleSQLite('./tuturno.db', { schema })
```

### 4.2 Schema de tablas

```typescript
// ─── users ───────────────────────────────────────────────────────────
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

// ─── refresh_sessions ────────────────────────────────────────────────
export const refreshSessions = sqliteTable('refresh_sessions', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token:     text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// ─── entities ────────────────────────────────────────────────────────
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

// ─── services ────────────────────────────────────────────────────────
export const services = sqliteTable('services', {
  id:               text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityId:         text('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  name:             text('name').notNull(),
  description:      text('description'),
  avgAttentionTime: integer('avg_attention_time').notNull().default(5), // minutos
  openTime:         text('open_time').notNull().default('08:00'),
  closeTime:        text('close_time').notNull().default('17:00'),
  isActive:         integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isPaused:         integer('is_paused', { mode: 'boolean' }).notNull().default(false),
})

// ─── operators (asignación user → service) ───────────────────────────
export const operators = sqliteTable('operators', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  entityId:  text('entity_id').notNull().references(() => entities.id),
  isActive:  integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// ─── turns ───────────────────────────────────────────────────────────
export const turns = sqliteTable('turns', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turnNumber:   text('turn_number').notNull(),       // Ej: "B-047"
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

// ─── push_subscriptions ──────────────────────────────────────────────
export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint:     text('endpoint').notNull(),
  p256dh:       text('p256dh').notNull(),
  auth:         text('auth').notNull(),
  createdAt:    integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

### 4.3 Índices requeridos (PostgreSQL best practices)

```sql
-- users: login rápido por email (consulta más frecuente)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- users: búsqueda por cédula
CREATE UNIQUE INDEX idx_users_document_id ON users(document_id);

-- refresh_sessions: búsqueda por token (logout/refresh)
CREATE UNIQUE INDEX idx_refresh_token ON refresh_sessions(token);

-- turns: cola de un servicio (ORDER BY más común)
CREATE INDEX idx_turns_service_queue ON turns(service_id, status, queue_position)
  WHERE status = 'waiting';

-- turns: turnos de un ciudadano
CREATE INDEX idx_turns_citizen ON turns(citizen_id, status);

-- push_subscriptions: búsqueda por usuario
CREATE INDEX idx_push_user ON push_subscriptions(user_id);
```

---

## 5. AUTENTICACIÓN — SISTEMA COMPLETO JWT

### 5.1 Flujo de tokens

```
LOGIN EXITOSO
     │
     ├── Access Token (JWT HS256)
     │   ├── Duración: 15 minutos
     │   ├── Payload: { sub: userId, role, email, iat, exp }
     │   └── Almacenamiento: httpOnly cookie "access_token" + Pinia store
     │
     └── Refresh Token (opaco, UUID)
         ├── Duración: 7 días
         ├── Almacenado en DB tabla refresh_sessions
         └── Almacenamiento: httpOnly cookie "refresh_token" (Secure, SameSite=Strict)

CADA REQUEST A API PROTEGIDA
     │
     ├── Middleware server lee cookie "access_token"
     ├── Verifica firma y expiración con jose (algoritmo HS256 whitelisted)
     ├── Si válido: adjunta user al event context → event.context.user
     └── Si expirado: retorna 401 → cliente hace refresh automático

REFRESH AUTOMÁTICO (cliente)
     │
     ├── Interceptor en $fetch detecta 401
     ├── Llama /api/auth/refresh con cookie
     ├── Server valida refresh token en DB
     ├── Genera nuevo access token + nuevo refresh token (rotación)
     ├── Actualiza cookies
     └── Reintenta el request original

ROTACIÓN DE REFRESH TOKEN
     │
     ├── El refresh token viejo se invalida inmediatamente (se borra de DB)
     ├── Si un attacker roba el token y lo usa primero → nuestro refresh falla
     └── Esto detecta el ataque y permite invalidar todas las sesiones
```

### 5.2 Implementación de JWT con jose

```typescript
// server/utils/jwt.utils.ts
import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-min-32-chars')

export async function signAccessToken(payload: { sub: string; role: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET)
}

export async function verifyAccessToken(token: string): Promise<{ sub: string; role: string; email: string }> {
  const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] })
  return payload as { sub: string; role: string; email: string }
}
```
LOGIN EXITOSO
     │
     ├── Access Token (JWT)
     │   ├── Duración: 15 minutos
     │   ├── Payload: { sub: userId, role, email, iat, exp }
     │   └── Almacenamiento: httpOnly cookie "access_token" + Pinia store
     │
     └── Refresh Token (opaco, UUID)
         ├── Duración: 7 días
         ├── Almacenado en DB tabla refresh_sessions
         └── Almacenamiento: httpOnly cookie "refresh_token" (Secure, SameSite=Strict)

CADA REQUEST A API PROTEGIDA
     │
     ├── Middleware server lee cookie "access_token"
     ├── Verifica firma y expiración con jose
     ├── Si válido: adjunta user al event context → event.context.user
     └── Si expirado: retorna 401 → cliente hace refresh automático

REFRESH AUTOMÁTICO (cliente)
     │
     ├── Interceptor en $fetch detecta 401
     ├── Llama /api/auth/refresh con cookie "refresh_token"
     ├── Server valida refresh token en DB
     ├── Genera nuevo access token + nuevo refresh token (rotación)
     ├── Actualiza cookies
     └── Reintenta el request original
```

### 5.2 Guards de rutas (middleware Nuxt)

```typescript
// middleware/auth.ts — Requiere cualquier usuario autenticado
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})

// middleware/operator.ts — Solo operadores y admins
// middleware/admin.ts — Solo admins
// middleware/guest.ts — Solo no autenticados (login/register)
```

### 5.3 Aplicación de middleware en páginas

```typescript
// pages/app/turns/index.vue
definePageMeta({
  middleware: 'auth',
  layout: 'citizen'
})

// pages/operator/index.vue
definePageMeta({
  middleware: 'operator', // verifica role === 'operator' || 'admin'
  layout: 'operator'
})

// pages/admin/index.vue
definePageMeta({
  middleware: 'admin', // verifica role === 'admin'
  layout: 'admin'
})
```

---

## 6. WEBSOCKETS — TIEMPO REAL

### 6.1 Arquitectura del servidor WS

```typescript
// server/routes/_ws/turns.ts
// Nuxt/Nitro maneja el upgrade HTTP→WS automáticamente en esta ruta

export default defineWebSocketHandler({
  open(peer) {
    // El cliente se conecta y se une a un "room" (serviceId)
    const serviceId = peer.request.url?.searchParams.get('serviceId')
    if (serviceId) peer.subscribe(`service:${serviceId}`)

    // Room personal para notificaciones al ciudadano
    const userId = peer.request.url?.searchParams.get('userId')
    if (userId) peer.subscribe(`user:${userId}`)
  },

  message(peer, message) {
    // Mensajes del operador → broadcast a todos en el room del servicio
    const data = JSON.parse(message.text())

    if (data.type === 'OPERATOR_ACTION') {
      const { action, serviceId, turnId } = data

      if (action === 'call_next') {
        const turn = await getNextTurn(serviceId)
        if (!turn) return

        await db.update(turns)
          .set({ status: 'called', calledAt: new Date() })
          .where(eq(turns.id, turn.id))

        peer.publish(`service:${serviceId}`, JSON.stringify({
          type: 'QUEUE_UPDATED',
          payload: { queue: await getWaitingQueue(serviceId), waitingCount }
        }))

        peer.publish(`user:${turn.citizenId}`, JSON.stringify({
          type: 'YOUR_TURN',
          payload: { turn }
        }))
      }
    }
  },

  close(peer) {
    // Cleanup automático de subscripciones
  }
})
```

### 6.2 Eventos WebSocket (contratos)

```typescript
// constants/ws.constants.ts
export const WS_EVENTS = {
  // Server → Client
  QUEUE_UPDATED:    'QUEUE_UPDATED',    // Estado de la cola cambió
  TURN_CALLED:      'TURN_CALLED',      // Un turno fue llamado
  YOUR_TURN_SOON:   'YOUR_TURN_SOON',   // Faltan 3 turnos para ti
  YOUR_TURN:        'YOUR_TURN',        // Es tu turno ahora
  SERVICE_PAUSED:   'SERVICE_PAUSED',   // El servicio fue pausado
  SERVICE_RESUMED:  'SERVICE_RESUMED',

  // Client → Server (operador)
  OPERATOR_ACTION:  'OPERATOR_ACTION',  // call_next | complete | no_show
} as const
```

### 6.3 Composable del cliente

```typescript
// composables/useWebSocket.ts
export function useWebSocket(options: {
  serviceId?: Ref<string>
  userId?: Ref<string>
}) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)

  function connect() {
    const params = new URLSearchParams()
    if (options.serviceId?.value) params.set('serviceId', options.serviceId.value)
    if (options.userId?.value) params.set('userId', options.userId.value)

    ws.value = new WebSocket(`${useRuntimeConfig().public.wsUrl}/_ws?${params}`)

    ws.value.onopen = () => { isConnected.value = true; reconnectAttempts.value = 0 }
    ws.value.onclose = () => { isConnected.value = false; scheduleReconnect() }
  }

  function scheduleReconnect() {
    if (reconnectAttempts.value >= 5) return
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 16000)
    reconnectAttempts.value++
    setTimeout(connect, delay)
  }

  return { isConnected, connect, disconnect: () => ws.value?.close() }
}
```

---

## 7. SISTEMA DE DISEÑO — TOKENS Y REGLAS VISUALES

### 7.1 Variables CSS (en assets/css/main.css)

```css
:root {
  /* ── Colores primarios ──────────────────────────────── */
  --color-primary:       #6C3AE8;
  --color-primary-light: #A78BFA;
  --color-primary-dark:  #4C1D95;
  --color-accent:        #818CF8;

  /* ── Gradientes ────────────────────────────────────── */
  --gradient-primary: linear-gradient(135deg, #6C3AE8, #3A8EE8);
  --gradient-hero:    radial-gradient(ellipse at 80% 50%, rgba(108,58,232,0.3) 0%, transparent 60%);
  --gradient-glow:    radial-gradient(circle, rgba(108,58,232,0.4) 0%, transparent 70%);

  /* ── Fondos ─────────────────────────────────────────── */
  --bg-base:      #0D0D14;
  --bg-surface:   #13131F;
  --bg-elevated:  #1A1A2E;
  --bg-overlay:   #1F1F35;

  /* ── Glassmorphism ──────────────────────────────────── */
  --glass-bg:      rgba(255, 255, 255, 0.04);
  --glass-bg-hover: rgba(255, 255, 255, 0.07);
  --glass-border:  rgba(255, 255, 255, 0.10);
  --glass-blur:    backdrop-filter: blur(16px);
  --glass-shadow:  0 8px 32px rgba(108, 58, 232, 0.15);

  /* ── Texto ──────────────────────────────────────────── */
  --text-primary:   #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted:     #52525B;
  --text-accent:    #A78BFA;

  /* ── Estados de turno ───────────────────────────────── */
  --turn-waiting:   #6C3AE8;   /* violeta */
  --turn-called:    #F59E0B;   /* ámbar */
  --turn-attending: #3B82F6;   /* azul */
  --turn-completed: #10B981;   /* verde */
  --turn-no-show:   #EF4444;   /* rojo */
  --turn-cancelled: #6B7280;   /* gris */

  /* ── Espaciado (sistema de 4px) ─────────────────────── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── Bordes ─────────────────────────────────────────── */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  /* ── Tipografía ─────────────────────────────────────── */
  --font-display: 'Geist', system-ui, sans-serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'Geist Mono', monospace;

  /* ── Transiciones ───────────────────────────────────── */
  --transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base:   250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 7.2 Clase glassmorphism base (assets/css/glass.css)

```css
.glass {
  background:      var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border:          1px solid var(--glass-border);
  box-shadow:      var(--glass-shadow);
}

.glass-hover {
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
}
.glass-hover:hover {
  background:  var(--glass-bg-hover);
  box-shadow:  0 8px 40px rgba(108, 58, 232, 0.25);
  transform:   translateY(-2px);
}
```

### 7.3 Animaciones clave (assets/css/animations.css)

```css
/* Flip de número de turno */
@keyframes flip-in {
  0%   { transform: rotateX(90deg); opacity: 0; }
  100% { transform: rotateX(0deg);  opacity: 1; }
}
.turn-flip {
  animation: flip-in 0.4s var(--transition-bounce);
  transform-origin: center top;
}

/* Entrada con stagger */
@keyframes slide-up-fade {
  0%   { transform: translateY(24px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}
.animate-enter { animation: slide-up-fade 0.5s var(--transition-base) both; }
.animate-enter-1 { animation-delay: 0ms; }
.animate-enter-2 { animation-delay: 80ms; }
.animate-enter-3 { animation-delay: 160ms; }
.animate-enter-4 { animation-delay: 240ms; }

/* Glow pulsante para estado activo */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(108, 58, 232, 0.4); }
  50%      { box-shadow: 0 0 40px rgba(108, 58, 232, 0.8); }
}
.glow-active { animation: glow-pulse 2s ease-in-out infinite; }
```

### 7.4 Reglas del design system

- **Nunca** hardcodear colores en componentes. Siempre usar variables CSS.
- **Siempre** usar la clase `.glass` para cards de contenido.
- Los botones tienen 3 variantes: `primary` (relleno violeta + glow), `outline` (borde semitransparente), `ghost` (sin borde).
- Skeleton loaders para **todos** los estados de carga. No spinners.
- Tamaño mínimo de elemento táctil: 44×44px.
- El número de turno en `TurnCounterDisplay.vue` SIEMPRE usa la animación `flip-in`.

---

## 8. VARIABLES DE ENTORNO

```bash
# .env.example

# ── Base de datos ────────────────────────────
DB_DRIVER=sqlite                          # sqlite | postgres
DATABASE_URL=./tuturno.db                 # SQLite: path | Postgres: connection string

# ── Supabase (producción) ────────────────────
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# ── Auth / JWT ───────────────────────────────
JWT_SECRET=super-secret-key-min-32-chars-change-this
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# ── WebPush / Notificaciones ─────────────────
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@tuturno.co

# ── App ──────────────────────────────────────
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_WS_URL=ws://localhost:3000
NODE_ENV=development
```

---

## 9. ORDEN DE CONSTRUCCIÓN (Phases)

Claude Code debe construir el proyecto **en este orden exacto**. No saltar fases.

### FASE 1 — Bootstrap del proyecto

```bash
1. npx nuxi@latest init tuturno --template basic
2. Instalar todas las dependencias del stack
3. Configurar tsconfig.json (strict mode)
4. Configurar nuxt.config.ts completo
5. Configurar tailwind.config.ts con design tokens
6. Crear variables CSS en assets/css/main.css
7. Crear .env.example y .gitignore
8. Verificar que `npm run dev` funciona
```

### FASE 2 — Base de datos y schema

```bash
1. Instalar drizzle-orm, better-sqlite3, drizzle-kit
2. Crear server/db/index.ts con switch SQLite/Postgres
3. Crear todos los schemas en server/db/schema/
4. Crear drizzle.config.ts
5. Correr `npx drizzle-kit generate` y `npx drizzle-kit migrate`
6. Crear seed.ts con datos de prueba realistas (EPS Sura, Bancolombia, etc.)
7. Verificar que la DB se crea correctamente
```

### FASE 3 — Autenticación completa

```bash
1. Instalar jose, bcryptjs
2. Crear server/utils/jwt.utils.ts y hash.utils.ts
3. Crear API routes: login, register, logout, refresh, me
4. Crear server/middleware/auth.ts (verifica token en cada request)
5. Crear stores/auth.store.ts en el cliente
6. Crear composables/useAuth.ts
7. Crear middleware de ruta: auth.ts, guest.ts, operator.ts, admin.ts
8. Implementar refresh automático en plugin
9. Crear páginas login.vue y register.vue con UI glassmorphism
10. Probar flujo completo: register → login → refresh → logout
```

### FASE 4 — Entidades y servicios (CRUD)

```bash
1. API routes para entities (CRUD completo con guards de admin)
2. API routes para services
3. Páginas de listado y detalle de entidad
4. Formularios de admin para crear/editar
5. Seed con entidades realistas colombianas
```

### FASE 5 — Sistema de turnos

```bash
1. Lógica de generación de número de turno (prefijo por servicio + secuencial)
2. API route POST /api/turns (crear turno)
3. API route GET /api/turns (mis turnos)
4. API route DELETE /api/turns/[id] (cancelar)
5. Componente TurnTicket.vue con QR (qrcode.vue o similar)
6. Página "Mis Turnos" del ciudadano
7. Lógica de posición en cola y tiempo estimado
```

### FASE 6 — Tiempo real (WebSockets)

```bash
1. Crear server/routes/_ws/turns.ts
2. Definir contrato de eventos en constants/ws.constants.ts
3. Crear composables/useWebSocket.ts con reconexión automática
4. Crear stores/queue.store.ts que reacciona a eventos WS
5. Componente TurnTracker.vue (seguimiento en tiempo real)
6. TurnCounterDisplay.vue con flip animation
7. TurnProgressBar.vue animada
8. Panel de operador: OperatorQueue.vue con acciones
9. Integrar acciones del operador → broadcast WS → update ciudadano
10. Probar con 2 tabs: operador + ciudadano en tiempo real
```

### FASE 7 — Notificaciones Push

```bash
1. Instalar web-push, generar VAPID keys
2. Service Worker para PWA
3. API POST /api/notifications/subscribe
4. Lógica en servidor: enviar push cuando faltan 3 turnos
5. Probar en móvil (Chrome + Android)
```

### FASE 8 — Panel admin y reportes

```bash
1. Dashboard con métricas globales
2. Gestión de entidades, servicios y operadores
3. Reportes básicos (estadísticas del día)
4. Charts con chart.js o similar ligero
```

### FASE 9 — Landing page

```bash
1. Componentes de landing en components/landing/
2. Animaciones con IntersectionObserver para scroll
3. Mockup animado del tracker en tiempo real (simulado)
4. Optimizar para SSG (nuxt generate)
5. SEO meta tags
```

### FASE 10 — Polish y QA

```bash
1. Revisar responsive en 320px, 768px, 1440px
2. Skeleton loaders en todos los estados de carga
3. Error boundaries y páginas de error
4. Tests básicos con Vitest
5. Revisar accesibilidad (contraste, aria-labels, focus visible)
```

---

## 10. REGLAS DE RESPUESTA DE API

### Siempre usar este formato de respuesta

```typescript
// types/api.types.ts

// Respuesta exitosa
interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
}

// Respuesta de error
interface ApiError {
  success: false
  error: {
    code: string        // 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | etc.
    message: string     // Mensaje legible para el usuario
    details?: unknown   // Detalles adicionales (ej: errores de Zod)
  }
}

type ApiResponse<T> = ApiSuccess<T> | ApiError

// Helpers en server/utils/response.utils.ts
export const success = <T>(data: T, meta?: ApiSuccess<T>['meta']): ApiSuccess<T> =>
  ({ success: true, data, meta })

export const apiError = (code: string, message: string, statusCode = 400) =>
  createError({ statusCode, data: { success: false, error: { code, message } } })
```

### Códigos de estado HTTP estándar

| Código | Uso |
|--------|-----|
| 200 | Éxito normal (GET, PUT, PATCH) |
| 201 | Recurso creado (POST register, create) |
| 400 | Error de validación (Zod fail, business rule) |
| 401 | No autenticado |
| 403 | No autorizado (rol insuficiente) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (email ya existe) |
| 429 | Rate limit |
| 500 | Error interno |

---

## 11. REGLAS DE SEGURIDAD

- **Nunca** exponer el `passwordHash` en ninguna respuesta de API.
- **Nunca** loggear tokens JWT o refresh tokens.
- Todos los inputs del servidor validados con Zod antes de llegar a la DB.
- Rate limiting en `/api/auth/login` y `/api/auth/register` (máximo 5 intentos/minuto por IP).
- Los refresh tokens se invalidan al hacer logout (borrar de DB).
- Rotación de refresh tokens: cada refresh genera un nuevo par de tokens.
- CORS configurado solo para el dominio propio.
- Headers de seguridad en `nuxt.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- JWT: usar `algorithms: ['HS256']` en jose verify para prevenir algorithm confusion attacks.
- El campo `documentId` (cédula) puede indexarse pero no exponer en logs.

---

## 12. REGLAS DE PERFORMANCE

- Las páginas públicas (landing, login) se sirven como **SSG** (`routeRules: { '/': { prerender: true } }`).
- Las páginas de app son **SPA** (`routeRules: { '/app/**': { ssr: false } }`).
- **Lazy loading** de componentes pesados: `defineAsyncComponent(() => import('./HeavyComponent.vue'))`.
- Las imágenes usan `<NuxtImg>` con `loading="lazy"` y formato `webp`.
- El bundle se analiza con `nuxt-bundle-analyzer` si supera 500KB.
- Las queries de DB que retornan listas tienen paginación (`limit`, `offset`). Nunca SELECT * sin límite.
- WebSocket: no enviar el estado completo de la cola en cada mensaje, solo el delta (qué cambió).

---

## 13. COMANDOS DE DESARROLLO

```bash
# Instalar dependencias
npm install

# Desarrollo (con HMR)
npm run dev

# Generar migración después de cambiar schema
npx drizzle-kit generate

# Aplicar migraciones
npx drizzle-kit migrate

# Seed de datos de prueba
npx tsx server/db/seeds/seed.ts

# Build de producción
npm run build

# Preview de producción
npm run preview

# Tests
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright

# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix
```

---

## 14. CONTEXTO DE DOMINIO COLOMBIANO

- Los números de turno siguen el formato `[Letra]-[Número]`: `A-001`, `B-047`, `C-123`. La letra corresponde al tipo de servicio.
- Las entidades predefinidas en el seed deben ser: **EPS Sura**, **Bancolombia**, **Claro Colombia**, **Secretaría de Hacienda de Montería**.
- Los horarios de atención son en UTC-5 (hora de Colombia).
- Los campos de documento usan **Cédula de Ciudadanía** como tipo principal.
- El idioma de toda la UI es **Español colombiano**. Tono cercano pero profesional.
- La ciudad base del seed es **Montería, Córdoba**.

---

## 15. CHECKLIST ANTES DE CADA COMMIT

- [ ] TypeScript sin errores (`npm run typecheck`)
- [ ] ESLint sin warnings (`npm run lint`)
- [ ] No hay `console.log` en código de producción (solo en seeds/scripts)
- [ ] No hay `any` types nuevos
- [ ] Las nuevas rutas de API tienen validación Zod
- [ ] Las nuevas rutas protegidas tienen middleware de auth
- [ ] Los nuevos componentes están tipados con `defineProps<Props>()`
- [ ] No se commitea el archivo `.env`
- [ ] Las migraciones de DB se generaron después de cambiar el schema
- [ ] Los índices necesarios fueron creados para queries frecuentes

---

*Documento generado para el proyecto TuTurno — Universidad de Córdoba*
*Estudiantes: Keyner Ramírez Ramos – Bibiana Herrera Martínez*
