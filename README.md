# TuTurno

> **Sistema de Gestión de Turnos Digitales** — Elimina las filas físicas en EPS, bancos y oficinas públicas en Colombia.

![Nuxt](https://img.shields.io/badge/Nuxt-3-6C3AE8?style=flat-square&logo=nuxt)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-6C3AE8?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

---

## Qué es TuTurno

Plataforma digital que permite a los ciudadanos colombianos solicitar turnos digitales desde cualquier dispositivo, monitorear su posición en la cola en tiempo real y recibir notificaciones cuando están próximos a ser atendidos.

**Para ciudadanos**: Solicita turnos desde tu casa, evita filas físicas, recibe alertas cuando te falten 3 turnos.

**Para operadores**: Gestiona tu cola de forma eficiente, llama turnos con un click, registra atenciones.

**Para administradores**: Configura entidades y servicios, asigna operadores, consulta reportes en tiempo real.

---

## Características

- **Turnos digitales** — Solicita desde cualquier dispositivo con tu cédula
- **Tiempo real** — Posición en cola actualizada vía WebSocket
- **Notificaciones push** — Alertas cuando faltan 3 turnos para ti
- **Panel de operador** — Llama, completa o marca como no-show
- **Dashboard admin** — Métricas, reportes y gestión de entidades
- **PWA** — Instala en tu móvil para mejor experiencia
- **Diseño dark glassmorphism** — Interfaz moderna y oscura

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Nuxt 3 (SSR + SPA híbrido) |
| Lenguaje | TypeScript strict mode |
| CSS | Tailwind CSS v4 |
| Estado | Pinia |
| Backend | Nitro (H3) |
| Tiempo real | WebSockets (crossws) |
| ORM | Drizzle ORM |
| DB Desarrollo | SQLite |
| DB Producción | Supabase (PostgreSQL) |
| Validación | Zod |
| Auth | JWT + httpOnly cookies |
| PWA | @vite-pwa/nuxt |

---

## Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/isKarTuX/TuTurno.git
cd TuTurno

# Instalar dependencias
npm install

# Copiar entorno y configurar
cp .env.example .env

# Ejecutar migraciones de base de datos
npx drizzle-kit migrate

# Poblar con datos de prueba (EPS Sura, Bancolombia, etc.)
npx tsx server/db/seeds/seed.ts

# Iniciar desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Estructura del Proyecto

```
tuturno/
├── assets/css/           # Estilos globales, variables CSS, animaciones
├── components/           # Componentes Vue
│   ├── ui/               # Design system base (Button, Input, Card...)
│   ├── turn/             # TurnCard, TurnTicket, TurnTracker...
│   ├── entity/           # EntityCard, EntitySearchBar...
│   ├── operator/         # OperatorQueue, OperatorControls...
│   ├── admin/            # AdminMetricCard, AdminEntityForm...
│   └── landing/          # Componentes de landing page
├── composables/          # useAuth, useTurnQueue, useWebSocket...
├── constants/            # Roles, estados de turno, eventos WS
├── layouts/              # default, auth, citizen, operator, admin
├── middleware/           # auth, guest, operator, admin
├── pages/                 # Rutas de la aplicación
│   ├── app/              # Panel ciudadano
│   ├── operator/         # Panel operador
│   ├── admin/            # Panel administrador
│   └── auth/             # Login, register, forgot-password
├── plugins/              # Pinia, WebSocket client
├── schemas/              # Zod schemas para validación
├── server/
│   ├── api/              # Rutas API (auth, turns, entities...)
│   ├── db/
│   │   ├── schema/       # Drizzle schemas
│   │   ├── queries/      # Queries reutilizables
│   │   └── seeds/        # Datos de prueba
│   ├── middleware/       # Auth middleware, rate-limit
│   ├── routes/_ws/       # WebSocket handlers
│   └── utils/            # JWT, hashing, responses
├── stores/               # Pinia stores
├── types/                # Tipos TypeScript globales
└── utils/                # Helpers de fecha, turno, etc.
```

---

## API Routes Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de ciudadano |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/turns/my` | Turnos activos del usuario |
| POST | `/api/turns` | Solicitar nuevo turno |
| DELETE | `/api/turns/[id]` | Cancelar turno |
| GET | `/api/entities` | Listar entidades |
| POST | `/api/operator/call-next` | Operador llama siguiente turno |
| POST | `/api/operator/complete` | Operador marca turno completado |
| GET | `/api/admin/metrics` | Métricas del admin |

---

## Modelo de Datos

- **users** — Citizens, operators, admins
- **entities** — EPS, bancos, oficinas públicas
- **services** — Servicios ofrecidos por cada entidad
- **operators** — Relación usuario ↔ servicio
- **turns** — Turnos con estados: waiting → called → attending → completed
- **refresh_sessions** — Tokens de refresh para auth

---

## Variables de Entorno

```bash
DB_DRIVER=sqlite                    # sqlite | postgres
DATABASE_URL=./tuturno.db

JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_WS_URL=ws://localhost:3000
```

---

## Créditos

**Universidad de Córdoba**
Departamento de Ingeniería de Sistemas y Telecomunicaciones

- **Keyner Ramírez Ramos**
- **Bibiana Herrera Martínez**