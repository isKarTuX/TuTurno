# PROMPT DE INICIO — TuTurno
> Copia y pega esto COMPLETO en Claude Code para arrancar el proyecto.
> No escribas código. Solo lee, planifica y crea la estructura de documentación.

---

## INSTRUCCIÓN PARA CLAUDE CODE

Lee el archivo `CLAUDE.md` que está en la raíz del proyecto.
Léelo completo, de principio a fin, sin saltarte ninguna sección.
Cuando termines de leerlo, confirma que lo entendiste resumiendo en 5 puntos
clave lo que vas a construir y el stack que usarás.

Luego, **sin escribir ninguna línea de código de la aplicación**,
haz lo siguiente:

---

## TAREA 1 — Crear la estructura de carpeta `/docs`

Crea la siguiente estructura de carpetas y archivos vacíos en la raíz del proyecto:

```
docs/
├── README.md                  ← Índice general del proyecto
├── phases/
│   ├── PHASE-01-bootstrap.md
│   ├── PHASE-02-database.md
│   ├── PHASE-03-auth.md
│   ├── PHASE-04-entities.md
│   ├── PHASE-05-turns.md
│   ├── PHASE-06-realtime.md
│   ├── PHASE-07-notifications.md
│   ├── PHASE-08-admin.md
│   ├── PHASE-09-landing.md
│   └── PHASE-10-polish.md
├── architecture/
│   ├── DATABASE.md            ← Schema completo explicado
│   ├── AUTH-FLOW.md           ← Flujo JWT detallado
│   ├── WEBSOCKET.md           ← Arquitectura WS y eventos
│   └── API-CONTRACTS.md       ← Todos los endpoints documentados
├── design/
│   ├── DESIGN-SYSTEM.md       ← Tokens, colores, componentes
│   └── COMPONENTS.md          ← Catálogo de componentes
└── decisions/
    └── ADR-001-stack.md       ← Por qué elegimos Nuxt 3
```

---

## TAREA 2 — Escribir el contenido de cada archivo

### docs/README.md
Escribe el índice general del proyecto con:
- Nombre y descripción de TuTurno (basado en CLAUDE.md sección 0)
- Tabla con links a cada archivo de la carpeta docs/
- Estado actual del proyecto: `🟡 Fase 0 — Documentación inicial`
- Tabla de fases con columnas: Fase | Nombre | Estado | Archivo
  (todas en estado ⬜ Pendiente al inicio)
- Stack resumido en tabla
- Comandos básicos (npm run dev, etc.)

---

### docs/phases/PHASE-01-bootstrap.md
Escribe el documento completo de la Fase 1 con:

**Encabezado:**
```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 1
Depende de: Ninguna
Tiempo estimado: 30 min
```

**Secciones:**
1. **Objetivo** — Qué se logra al terminar esta fase
2. **Dependencias a instalar** — Lista exacta de todos los paquetes npm con versiones
3. **Archivos a crear** — Lista de cada archivo con su propósito
4. **Configuraciones** — nuxt.config.ts, tsconfig.json, tailwind.config.ts, .env.example
   Documenta el contenido EXACTO que debe tener cada uno
5. **Criterios de éxito** — Checklist verificable: qué debe funcionar al terminar
6. **Errores comunes** — Problemas conocidos y cómo resolverlos
7. **Comando de verificación** — El comando exacto para confirmar que la fase pasó

---

### docs/phases/PHASE-02-database.md
Escribe el documento completo de la Fase 2 con:

**Encabezado:**
```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 2
Depende de: PHASE-01
Tiempo estimado: 45 min
```

**Secciones:**
1. **Objetivo**
2. **Schema de cada tabla** — Copia el schema exacto de CLAUDE.md sección 4 y explica
   cada campo: tipo, restricciones, por qué existe
3. **Relaciones entre tablas** — Diagrama en texto (ASCII) mostrando FK entre tablas
4. **Archivos a crear** — Cada archivo del schema, queries, migrations
5. **Configuración de Drizzle** — drizzle.config.ts explicado línea por línea
6. **Datos del seed** — Lista de datos de prueba que debe tener:
   - 3 entidades (EPS Sura Montería, Bancolombia Montería, Secretaría de Hacienda)
   - 2-3 servicios por entidad
   - 1 admin, 2 operadores, 3 ciudadanos de prueba
   - 10 turnos en distintos estados
7. **Criterios de éxito** — Checklist
8. **Comando de verificación**

---

### docs/phases/PHASE-03-auth.md
Escribe el documento completo de la Fase 3 con:

**Encabezado:**
```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 3
Depende de: PHASE-01, PHASE-02
Tiempo estimado: 90 min
```

**Secciones:**
1. **Objetivo**
2. **Flujo completo de autenticación** — Diagrama en texto de:
   - Register → login → uso → refresh → logout
   - Dónde vive cada token
   - Qué pasa cuando expira el access token
3. **Endpoints a implementar** — Para cada uno:
   - Método + ruta
   - Body esperado (con tipos)
   - Respuesta exitosa (con tipos)
   - Posibles errores
   - Guards aplicados
4. **Middleware del servidor** — Qué hace auth.ts de Nitro exactamente
5. **Middleware de cliente** — Qué hace cada guard de ruta Nuxt
6. **Store de auth** — Estado, getters y acciones de auth.store.ts
7. **Composable useAuth** — API pública del composable
8. **Páginas a crear** — Login y Register con descripción de campos y validaciones
9. **Criterios de éxito** — Checklist
10. **Casos de prueba** — Escenarios a probar manualmente

---

### docs/phases/PHASE-04-entities.md
Escribe el documento completo de la Fase 4 con:

**Encabezado:**
```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 4
Depende de: PHASE-01, PHASE-02, PHASE-03
Tiempo estimado: 60 min
```

**Secciones:**
1. **Objetivo**
2. **Endpoints de entidades** — CRUD completo documentado
3. **Endpoints de servicios** — CRUD completo documentado
4. **Guards de acceso** — Quién puede hacer qué (ciudadano/operador/admin)
5. **Componentes a crear** — EntityCard, EntitySearchBar, EntityServiceList
6. **Páginas a crear** — Listado, detalle de entidad, formulario admin
7. **Criterios de éxito**

---

### docs/phases/PHASE-05-turns.md
Escribe el documento completo de la Fase 5 con:

**Encabezado:**
```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 5
Depende de: PHASE-01 al PHASE-04
Tiempo estimado: 75 min
```

**Secciones:**
1. **Objetivo**
2. **Lógica de generación de número de turno** — Algoritmo explicado
   (prefijo por servicio + contador diario + formato A-001)
3. **Reglas de negocio** —
   - Máximo de turnos activos por usuario (configurable)
   - Qué pasa si el usuario no se presenta
   - Cómo se calcula el tiempo estimado de espera
   - Cómo se recalcula la posición en cola al cancelar
4. **Endpoints** — Crear, listar, detalle, cancelar
5. **Componentes** — TurnCard, TurnTicket (con QR), TurnStatusBadge, TurnHistoryItem
6. **Páginas** — Mis Turnos, detalle de turno, solicitar turno
7. **Criterios de éxito**

---

### docs/phases/PHASE-06-realtime.md
Escribe el documento completo de la Fase 6 con:

**Encabezado:**
```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 6
Depende de: PHASE-01 al PHASE-05
Tiempo estimado: 120 min (la más compleja)
```

**Secciones:**
1. **Objetivo**
2. **Arquitectura WebSocket** — Diagrama en texto de:
   - Cómo se conecta el cliente
   - Rooms: service:{id} y user:{id}
   - Quién publica y quién escucha cada evento
3. **Contrato de eventos** — Tabla con cada evento:
   | Evento | Dirección | Payload | Quién lo emite | Quién lo escucha |
4. **Handler del servidor** — Pseudocódigo de server/routes/_ws/turns.ts
5. **Composable useWebSocket** — API: connect(), disconnect(), on(), emit()
6. **Composable useTurnQueue** — Cómo reacciona al estado WS
7. **Store queue.store.ts** — Estado y cómo se actualiza con WS
8. **Panel del operador** — Flujo: ver cola → llamar siguiente → actualizar todos
9. **Widget del ciudadano** — TurnTracker animado
10. **Reconexión automática** — Estrategia de backoff exponencial
11. **Criterios de éxito** — Incluyendo prueba con 2 pestañas abiertas
12. **Casos edge** — Qué pasa si se cae la conexión WS

---

### docs/phases/PHASE-07-notifications.md
Estado: ⬜ Pendiente | Depende de: PHASE-06 | Tiempo estimado: 60 min

Documenta: VAPID setup, Service Worker, registro de suscripción, lógica de envío
(cuándo se activa: 3 turnos antes, en su turno), manejo de permisos del navegador.

---

### docs/phases/PHASE-08-admin.md
Estado: ⬜ Pendiente | Depende de: PHASE-04 al PHASE-07 | Tiempo estimado: 90 min

Documenta: Dashboard de métricas, gestión de entidades/servicios/operadores,
reportes y qué datos muestra cada gráfica.

---

### docs/phases/PHASE-09-landing.md
Estado: ⬜ Pendiente | Depende de: PHASE-01 | Tiempo estimado: 90 min

Documenta: Todas las secciones de la landing, componentes, animaciones con
IntersectionObserver, configuración SSG, meta tags SEO.

---

### docs/phases/PHASE-10-polish.md
Estado: ⬜ Pendiente | Depende de: Todas | Tiempo estimado: 60 min

Documenta: Checklist de responsive, accesibilidad, error boundaries,
skeleton loaders pendientes, pruebas manuales end-to-end.

---

### docs/architecture/DATABASE.md
Documenta el schema completo:
- Diagrama ASCII de todas las tablas y sus relaciones (ERD en texto)
- Descripción de cada tabla y el rol que cumple en el sistema
- Índices recomendados y por qué
- Notas sobre la migración SQLite → Supabase (qué cambia, qué no)

---

### docs/architecture/AUTH-FLOW.md
Documenta el flujo de autenticación:
- Diagrama de secuencia en texto (como un swimlane simple)
- Anatomía del JWT (qué campos lleva el payload)
- Política de cookies (httpOnly, Secure, SameSite)
- Estrategia de refresh y rotación de tokens
- Qué pasa en cada caso de error

---

### docs/architecture/WEBSOCKET.md
Documenta la arquitectura WS:
- Diagrama de rooms y subscripciones
- Todos los eventos con su payload tipado
- Ciclo de vida de una conexión
- Estrategia de reconexión

---

### docs/architecture/API-CONTRACTS.md
Documenta TODOS los endpoints de la API:
Para cada endpoint:
```
### POST /api/auth/login
Auth requerida: No
Roles permitidos: —

Request body:
{ email: string, password: string }

Response 200:
{ success: true, data: { user: User, accessToken: string } }

Response 401:
{ success: false, error: { code: 'INVALID_CREDENTIALS', message: '...' } }
```

---

### docs/design/DESIGN-SYSTEM.md
Documenta el sistema de diseño:
- Paleta de colores con hex codes y uso de cada uno
- Tipografía: fuentes, escalas, pesos
- Espaciado: escala de 4px explicada
- Bordes y radios
- Sombras y efectos glassmorphism (con el CSS exacto)
- Animaciones: lista de keyframes y cuándo usar cada uno
- Estados de turno: color, ícono y label para cada estado

---

### docs/design/COMPONENTS.md
Cataloga todos los componentes del design system:
Para cada componente UI base:
- Props que acepta (con tipos)
- Variantes disponibles
- Ejemplo de uso
- Estados: default, hover, active, disabled, loading

---

### docs/decisions/ADR-001-stack.md
Escribe el Architecture Decision Record del stack:
```
# ADR-001: Elección del Stack Tecnológico

Estado: Aceptado
Fecha: [hoy]
Decisores: Equipo TuTurno

## Contexto
## Opciones consideradas
## Decisión
## Consecuencias positivas
## Consecuencias negativas / trade-offs
## Referencias
```

---

## TAREA 3 — Actualizar el README.md raíz del proyecto

En el `README.md` principal del proyecto (no el de docs/) escribe:
- Nombre y logo ASCII del proyecto
- Descripción de una línea
- Badge de estado: `En desarrollo`
- Sección: Cómo empezar (prerrequisitos, clonar, instalar, correr)
- Sección: Documentación → link a `docs/README.md`
- Sección: Stack (tabla)
- Sección: Estructura del proyecto (árbol simplificado)
- Créditos: Universidad de Córdoba

---

## TAREA 4 — Reporte final

Cuando termines, dame un reporte con:
1. Lista de todos los archivos creados con ✅
2. Confirmación de que ningún archivo de código de la app fue modificado
3. Resumen de las decisiones de diseño documentadas
4. Próximo paso recomendado: qué prompt usar para arrancar la Fase 1

**NO escribas ningún archivo `.ts`, `.vue`, `.js` de la aplicación.**
**Solo archivos `.md` dentro de `/docs/` y el `README.md` raíz.**
