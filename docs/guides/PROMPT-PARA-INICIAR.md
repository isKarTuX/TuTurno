# PROMPT PARA INICIAR EL PROYECTO — TuTurno

Copia y pega este prompt COMPLETO en una nueva sesión de Claude Code para comenzar a construir el proyecto.

---

## INSTRUCCIÓN PARA CLAUDE CODE

### PASO 1 — Leer toda la documentación

Antes de escribir cualquier línea de código, lee TODOS estos archivos en orden:

```
1. CLAUDE.md                          ← Reglas absolutas del proyecto
2. docs/README.md                     ← Índice general
3. docs/phases/PHASE-01-bootstrap.md ← Primeira fase a implementar
4. docs/architecture/DATABASE.md      ← Schema de base de datos
5. docs/architecture/AUTH-FLOW.md      ← Sistema de autenticación JWT
6. docs/architecture/WEBSOCKET.md      ← Tiempo real con WebSockets
7. docs/architecture/API-CONTRACTS.md ← Contratos de API
8. docs/design/DESIGN-SYSTEM.md       ← Sistema de diseño
9. docs/IMPLEMENTATION-GUIDE.md       ← Guía de implementación técnica
10. PROMPT_INICIO.md                   ← Prompt original de contexto
```

Usa el tool de `read` para cada archivo. Lee completo, sin saltarte ninguna sección.

---

### PASO 2 — Confirmar comprensión

Después de leer todos los documentos, confirma que entendiste el proyecto resumiendo:

```
1. ¿Qué es TuTurno y para quién es?
2. ¿Cuál es el stack tecnológico completo?
3. ¿Cuáles son los 3 tipos de usuario y sus permisos?
4. ¿Cómo funciona el sistema de turnos en tiempo real?
5. ¿Cuál es el flujo de autenticación JWT?
```

---

### PASO 3 — Implementar PHASE-01

Después de confirmar la comprensión, implementa **ÚNICAMENTE** la PHASE-01:

#### Archivos a crear en este orden:

```
1. Inicializar Nuxt: npx nuxi@latest init .
2. Crear package.json con todas las dependencias del PHASE-01
3. Crear nuxt.config.ts
4. Crear tsconfig.json
5. Crear tailwind.config.ts
6. Crear drizzle.config.ts
7. Crear .env.example
8. Crear .gitignore
9. Crear assets/css/main.css
10. Crear assets/css/glass.css
11. Crear assets/css/animations.css
```

#### Reglas absolutas durante PHASE-01:

- **NO** crear lógica de negocio todavía
- **NO** crear componentes Vue (aún no)
- **NO** crear API routes (aún no)
- **SOLO** configurar el proyecto base para que compile sin errores

#### Comandos de verificación después de crear cada archivo:

```bash
# Verificar que todo instala
npm install

# Verificar que TypeScript compila
npm run typecheck

# Verificar que el servidor inicia
npm run dev
```

---

## RESUMEN DEL PROYECTO (para contexto rápido)

### ¿Qué es?
Plataforma digital para eliminar filas físicas en entidades de Colombia (EPS, bancos, oficinas). Los ciudadanos solicitan turnos digitales, monitorean su posición en tiempo real y reciben notificaciones.

### Stack
- **Framework**: Nuxt 3 + Vue 3 + TypeScript strict
- **Backend**: Nitro (API routes) + crossws (WebSockets)
- **DB**: Drizzle ORM (SQLite dev → PostgreSQL/Supabase prod)
- **Auth**: JWT (jose) + httpOnly cookies
- **CSS**: Tailwind v4 + glassmorphism
- **Estado**: Pinia
- **PWA**: @vite-pwa/nuxt + web-push

### Estructura de archivos
```
types/           ← Tipos TypeScript
schemas/         ← Zod schemas
composables/     ← Vue composables
stores/          ← Pinia stores
middleware/      ← Nuxt route middleware
plugins/         ← Nuxt plugins
components/      ← Vue components
layouts/         ← Nuxt layouts
pages/           ← Nuxt pages
server/
├── middleware/  ← Nitro server middleware
├── api/         ← API routes
├── routes/_ws/  ← WebSocket handlers
└── db/
    ├── schema/  ← Drizzle schemas
    ├── queries/ ← DB queries
    └── seeds/   ← Seed data
```

### Tipos de usuario
- **Ciudadano**: Solicita turnos, ve su posición, cancela
- **Operador**: Llama turnos, marca atención, no-show
- **Admin**: Configura entidades, servicios, operadores

### Flujo de turnos
1. Ciudadano selecciona entidad → servicio → solicita turno
2. Sistema genera número (ej: "A-047")
3. Ciudadano ve posición en cola en tiempo real (WebSocket)
4. Operador llama siguiente turno
5. Ciudadano recibe notificación push
6. Turno se marca como attended → completed

### Auth JWT
- Access token: 15 min, httpOnly cookie
- Refresh token: 7 días, rotación, en DB
- Middleware de auth en cada request protegida

---

## CONFIGURACIÓN DE VARIABLES DE ENTORNO

Crea `.env` basado en `.env.example`:

```bash
DB_DRIVER=sqlite
DATABASE_URL=./tuturno.db

JWT_SECRET=tu-super-secret-key-min-32-caracteres-change-this
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@tuturno.co

NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_WS_URL=ws://localhost:3000
NODE_ENV=development
```

---

## CHECKLIST DE PHASE-01

Cuando termines, verifica:

```
□ npx nuxi@latest init . ejecutó sin errores
□ npm install instaló todas las dependencias
□ nuxt.config.ts tiene todos los módulos configurados
□ tsconfig.json tiene strict: true
□ tailwind.config.ts tiene los colores del design system
□ drizzle.config.ts apunta al schema correcto
□ .env.example tiene todas las variables documentadas
□ .gitignore excluye .env, node_modules, *.db
□ assets/css/main.css tiene todas las variables CSS
□ assets/css/glass.css tiene las clases glassmorphism
□ assets/css/animations.css tiene los keyframes
□ npm run dev inicia el servidor sin errores
□ npm run typecheck no muestra errores TypeScript
```

---

## PRÓXIMO PASO

Después de completar PHASE-01 exitosamente, el siguiente prompt será:

> "Implementa PHASE-02: crea el schema completo de la base de datos con Drizzle ORM, las migraciones, y el seeder con datos de prueba de EPS Sura, Bancolombia y Secretaría de Hacienda de Montería."

---

**NO escribas código de la aplicación. Solo código de configuración del proyecto.**
**Cuando termines PHASE-01, reporta qué archivos creaste y qué comandos verificaste.**