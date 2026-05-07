# TuTurno — Sistema de Gestión de Turnos Digitales

> Elimina las filas físicas en entidades públicas y privadas en Colombia.

---

## Índice General

### Fases del Proyecto

| Fase | Nombre | Estado | Archivo |
|------|--------|--------|---------|
| 1 | Bootstrap del proyecto | ⬜ Pendiente | [PHASE-01-bootstrap.md](./phases/PHASE-01-bootstrap.md) |
| 2 | Base de datos y schema | ⬜ Pendiente | [PHASE-02-database.md](./phases/PHASE-02-database.md) |
| 3 | Sistema de autenticación | ⬜ Pendiente | [PHASE-03-auth.md](./phases/PHASE-03-auth.md) |
| 4 | Entidades y servicios | ⬜ Pendiente | [PHASE-04-entities.md](./phases/PHASE-04-entities.md) |
| 5 | Sistema de turnos | ⬜ Pendiente | [PHASE-05-turns.md](./phases/PHASE-05-turns.md) |
| 6 | Tiempo real (WebSockets) | ⬜ Pendiente | [PHASE-06-realtime.md](./phases/PHASE-06-realtime.md) |
| 7 | Notificaciones Push | ⬜ Pendiente | [PHASE-07-notifications.md](./phases/PHASE-07-notifications.md) |
| 8 | Panel admin y reportes | ⬜ Pendiente | [PHASE-08-admin.md](./phases/PHASE-08-admin.md) |
| 9 | Landing page | ⬜ Pendiente | [PHASE-09-landing.md](./phases/PHASE-09-landing.md) |
| 10 | Polish y QA | ⬜ Pendiente | [PHASE-10-polish.md](./phases/PHASE-10-polish.md) |

### Arquitectura

| Documento | Descripción |
|-----------|-------------|
| [DATABASE.md](./architecture/DATABASE.md) | Schema completo de la base de datos |
| [AUTH-FLOW.md](./architecture/AUTH-FLOW.md) | Flujo JWT y autenticación |
| [WEBSOCKET.md](./architecture/WEBSOCKET.md) | Arquitectura de tiempo real |
| [API-CONTRACTS.md](./architecture/API-CONTRACTS.md) | Contratos de todos los endpoints |

### Guías de Implementación

| Documento | Descripción |
|-----------|-------------|
| [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) | Código ejemplo para auto-refresh, errores, RLS, tests, PWA, plugins, composables, Zod |

### Diseño

| Documento | Descripción |
|-----------|-------------|
| [DESIGN-SYSTEM.md](./design/DESIGN-SYSTEM.md) | Tokens, colores, tipografía |
| [COMPONENTS.md](./design/COMPONENTS.md) | Catálogo de componentes UI |

### Decisiones

| Documento | Descripción |
|-----------|-------------|
| [ADR-001-stack.md](./decisions/ADR-001-stack.md) | Por qué elegimos Nuxt 3 |

---

## Estado Actual

**🟡 Fase 0 — Documentación inicial**

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Nuxt 3 | ^3.13+ |
| Lenguaje | TypeScript | strict mode |
| Runtime CSS | Tailwind CSS v4 | ^4.0+ |
| Estado | Pinia | ^2.x |
| Backend API | Nitro (H3) | nativo |
| WebSockets | crossws | nativo |
| ORM | Drizzle ORM | ^0.36+ |
| DB Desarrollo | SQLite (better-sqlite3) | local |
| DB Producción | Supabase (PostgreSQL) | hosted |
| Validación | Zod | ^3.x |
| Auth | JWT (jose) | latest |

---

## Comandos Básicos

```bash
# Instalar dependencias
npm install

# Desarrollo (con HMR)
npm run dev

# Generar migración
npx drizzle-kit generate

# Aplicar migraciones
npx drizzle-kit migrate

# Seed de datos de prueba
npx tsx server/db/seeds/seed.ts

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Créditos

**Universidad de Córdoba** — Departamento de Ingeniería de Sistemas y Telecomunicaciones

Estudiantes: Keyner Ramírez Ramos – Bibiana Herrera Martínez
