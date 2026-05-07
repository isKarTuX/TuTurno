# TuTurno

```
████████╗██████╗  █████╗ ███╗   ███╗███████╗██████╗ ██╗ ██████╗ ███╗   ██╗
╚══██╔══╝██╔══██╗██╔══██╗████╗ ████║██╔════╝██╔══██╗██║██╔═══██╗████╗  ██║
   ██║   ██████╔╝███████║██╔████╔██║█████╗  ██████╔╝██║██║   ██║██╔██╗ ██║
   ██║   ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗██║██║   ██║██║╚██╗██║
   ██║   ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗██║  ██║██║╚██████╔╝██║ ╚████║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

> **Sistema de Gestión de Turnos Digitales**
> Elimina las filas físicas en entidades públicas y privadas en Colombia.

---

## Estado del Proyecto

**En desarrollo** — Fase 0 completada (documentación)

---

## Cómo Empezar

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd tuturno

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Documentación

📁 **[docs/README.md](./docs/README.md)** — Índice general del proyecto

### Fases

| Fase | Descripción |
|------|-------------|
| [PHASE-01](./docs/phases/PHASE-01-bootstrap.md) | Bootstrap del proyecto |
| [PHASE-02](./docs/phases/PHASE-02-database.md) | Base de datos y schema |
| [PHASE-03](./docs/phases/PHASE-03-auth.md) | Sistema de autenticación |
| [PHASE-04](./docs/phases/PHASE-04-entities.md) | Entidades y servicios |
| [PHASE-05](./docs/phases/PHASE-05-turns.md) | Sistema de turnos |
| [PHASE-06](./docs/phases/PHASE-06-realtime.md) | Tiempo real (WebSockets) |
| [PHASE-07](./docs/phases/PHASE-07-notifications.md) | Notificaciones push |
| [PHASE-08](./docs/phases/PHASE-08-admin.md) | Panel admin y reportes |
| [PHASE-09](./docs/phases/PHASE-09-landing.md) | Landing page |
| [PHASE-10](./docs/phases/PHASE-10-polish.md) | Polish y QA |

### Arquitectura

| Documento | Descripción |
|----------|-------------|
| [DATABASE](./docs/architecture/DATABASE.md) | Schema de la base de datos |
| [AUTH-FLOW](./docs/architecture/AUTH-FLOW.md) | Flujo JWT y auth |
| [WEBSOCKET](./docs/architecture/WEBSOCKET.md) | Arquitectura tiempo real |
| [API-CONTRACTS](./docs/architecture/API-CONTRACTS.md) | Contratos de API |

### Diseño

| Documento | Descripción |
|----------|-------------|
| [DESIGN-SYSTEM](./docs/design/DESIGN-SYSTEM.md) | Tokens, colores, tipografía |
| [COMPONENTS](./docs/design/COMPONENTS.md) | Catálogo de componentes |

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-------------|
| Framework | Nuxt 3 |
| Lenguaje | TypeScript (strict) |
| Runtime CSS | Tailwind CSS v4 |
| Estado | Pinia |
| API | Nitro (H3) |
| WebSockets | crossws |
| ORM | Drizzle ORM |
| DB Desarrollo | SQLite (better-sqlite3) |
| DB Producción | Supabase (PostgreSQL) |
| Validación | Zod |
| Auth | JWT (jose) |

---

## Estructura del Proyecto

```
tuturno/
├── docs/                    # Documentación
│   ├── phases/              # Fases de desarrollo
│   ├── architecture/       # Documentos de arquitectura
│   ├── design/              # Sistema de diseño
│   └── decisions/           # ADRs
├── assets/                  # CSS, fuentes
├── components/              # Componentes Vue
├── composables/             # Composables Vue
├── constants/               # Constantes
├── layouts/                 # Layouts Nuxt
├── middleware/              # Middleware de rutas
├── pages/                   # Páginas Nuxt
├── plugins/                 # Plugins Nuxt
├── public/                  # Archivos estáticos
├── server/                  # API y backend
│   ├── api/                 # Rutas de API
│   ├── db/                  # Schema, queries, seeds
│   ├── middleware/          # Middleware de servidor
│   ├── routes/              # Rutas especiales (_ws)
│   └── utils/               # Utilidades del servidor
├── stores/                  # Stores Pinia
├── types/                   # Tipos TypeScript
├── schemas/                 # Schemas Zod
└── utils/                   # Utilidades puras
```

---

## Créditos

**Universidad de Córdoba**
Departamento de Ingeniería de Sistemas y Telecomunicaciones

Desarrollado por:
- **Keyner Ramírez Ramos**
- **Bibiana Herrera Martínez**
