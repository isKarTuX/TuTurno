# PROMPT: Implementar Módulo Admin Global — TuTurno

## Contexto

**Proyecto:** TuTurno - Sistema de Turnos Digitales
**Stack:** Nuxt 3 + Vue 3 Composition API + TypeScript + Tailwind CSS v4
**Archivos de referencia:**
- `CLAUDE.md` — Reglas de código
- `docs/profiles/ADMIN-MODULE-REQUIREMENTS.md` — **DOCUMENTO MAESTRO**
- `docs/profiles/ENTITY-MODULE-REQUIREMENTS.md` — Referencia para entidad

---

## Objetivo

Implementar COMPLETAMENTE el módulo admin global siguiendo los documentos.

---

## Pasos Obligatorios

### FASE 1: Lectura

**1.1** Leer COMPLETAMENTE:
1. `docs/profiles/ADMIN-MODULE-REQUIREMENTS.md`
2. `docs/profiles/ENTITY-MODULE-REQUIREMENTS.md` (para referencia)
3. `CLAUDE.md`

**1.2** Resumir:
- Alcance: TODO el sistema, todas las entidades
- Estructura de menú (Overview, Entidades, Usuarios, Config, Logs, Reportes)
- Permisos de admin global
- Configuración global del sistema

---

### FASE 2: Inventario

**2.1** Ver existente en `/components/admin/`

**2.2** Ver API routes existentes en `/server/api/admin/`

**2.3** Ver layouts existentes (`/layouts/admin.vue`)

---

### FASE 3: Implementación

### 3.1 Páginas Admin Global

1. **`pages/admin/index.vue`** — Dashboard Overview
   - Platform stats (turnos mes, atendidos, espera avg, tasa completion)
   - Top entidades por turnos
   - Queue velocity chart
   - Actividad reciente (logs)
   - definePageMeta({ middleware: 'admin', layout: 'admin' })

2. **`pages/admin/entities/index.vue`** — Gestión de Entidades
   - Tabla con todas las entidades
   - Filtros: búsqueda, tipo, estado
   - Columns: nombre, tipo, ciudad, servicios, admin, turnos/mes
   - Pagination
   - Acciones: ver, editar, eliminar

3. **`pages/admin/entities/new.vue`** — Crear Entidad
   - Formulario completo: nombre, tipo, dirección, ciudad, contacto, coordenadas
   - Asignar admin inicial (email, nombre)
   - Mapa para ubicación (opcional)

4. **`pages/admin/entities/[id].vue`** — Editar/Ver Entidad
   - Detalle completo
   - Estadísticas
   - Lista de admins y operadores
   - Servicios

5. **`pages/admin/users/index.vue`** — Gestión de Usuarios
   - Tabla con todos los usuarios del sistema
   - Filtros: búsqueda, rol, entidad, estado
   - Columns: nombre, cédula, email, rol, entidad, último acceso, estado
   - Acciones: editar, activar/desactivar, reset password

6. **`pages/admin/users/new.vue`** — Crear Usuario
   - Formulario: nombre, cédula, email, password, rol, entidad(s), servicios

7. **`pages/admin/config/index.vue`** — Configuración Global
   - Variables del sistema (maxTurnsPerDay, defaultWaitTime, etc.)
   - Horarios globales (open/close)
   - Feature flags (geo, push, registro público, priority turns)
   - Tema default (dark/light/system)

8. **`pages/admin/logs/index.vue`** — Auditoría
   - Tabla de logs con filtros
   - Columns: timestamp, acción, usuario, entidad, detalles
   - Filtros: período, tipo de acción, entidad
   - Exportar a CSV

9. **`pages/admin/reports/index.vue`** — Reportes Globales
   - Turnos por entidad (comparativo)
   - Tiempo de espera promedio por entidad
   - Tasa de no-show por entidad
   - Registros por día
   - Crecimiento de usuarios

### 3.2 Componentes

1. **`components/admin/EntityTable.vue`**
   - Tabla completa con acciones
   - Sorting por columnas
   - Pagination
   - Row hover states

2. **`components/admin/EntityForm.vue`**
   - Formulario crear/editar entidad
   - Validación Zod completa
   - Mapa interactivo (si hay coords)

3. **`components/admin/UserTable.vue`**
   - Tabla usuarios con filtros
   - Bulk actions (activar/desactivar)
   - Exportar

4. **`components/admin/UserForm.vue`**
   - Formulario crear/editar usuario
   - Selector de rol con descripción
   - Selector de entidad (solo si role !== 'citizen')
   - Selector de servicios (si operador)

5. **`components/admin/ConfigForm.vue`**
   - Formulario de configuración del sistema
   - Feature toggles
   - Theme selector visual

6. **`components/admin/LogsTable.vue`**
   - Tabla con logs
   - Filtrado por acción
   - Timestamp formatting
   - Paginación

7. **`components/admin/PlatformStats.vue`**
   - Grid de métricas grandes
   - Variación vs período anterior

8. **`components/admin/TopEntitiesChart.vue`**
   - Bar chart horizontal
   - Top 5 entidades por turnos

9. **`components/admin/QueueVelocityChart.vue`**
   - Line chart de carga vs capacidad

### 3.3 Layout

1. **`layouts/admin.vue`**
   - Sidebar con menú completo (Overview, Entidades, Usuarios, Config, Logs, Reportes)
   - Top bar con notificaciones y usuario admin
   - Theme toggle
   - Breadcrumbs en content

### 3.4 API Routes

1. **`server/api/admin/dashboard.get.ts`**
   - Stats platform-wide
   - Top entidades
   - Actividad reciente

2. **`server/api/admin/entities/index.get.ts`**
   - Lista todas las entidades con stats
   - Filtros y paginación

3. **`server/api/admin/entities/index.post.ts`**
   - Crear entidad (solo admin global)
   - Crear usuario admin de la entidad

4. **`server/api/admin/entities/[id].patch.ts`**
   - Editar entidad

5. **`server/api/admin/entities/[id].delete.ts`**
   - Eliminar entidad (soft delete? hard delete? definir en docs)

6. **`server/api/admin/users/index.get.ts`**
   - Lista todos los usuarios
   - Filtros: rol, entidad, estado

7. **`server/api/admin/users/index.post.ts`**
   - Crear usuario

8. **`server/api/admin/users/[id].patch.ts`**
   - Editar usuario

9. **`server/api/admin/users/[id].delete.ts`**
   - Eliminar usuario

10. **`server/api/admin/users/[id]/reset-password.post.ts`**
    - Reset password de usuario (envía email?)

11. **`server/api/admin/config.get.ts`**
    - Obtener config global

12. **`server/api/admin/config.patch.ts`**
    - Actualizar config global

13. **`server/api/admin/logs.get.ts`**
    - Lista de logs con filtros y paginación

14. **`server/api/admin/reports/platform.get.ts`**
    - Reporte comparativo de entidades

15. **`server/api/admin/reports/users.get.ts`**
    - Crecimiento de usuarios

### 3.5 Middleware

1. **`middleware/admin.ts`**
   - Verificar user.role === 'admin'
   - Solo admin global puede acceder
   - Redirect a / si no es admin

---

### FASE 4: Verificación

**4.1** TypeScript check
**4.2** Probar CRUD de entidades
**4.3** Probar gestión de usuarios
**4.4** Probar configuración global
**4.5** Probar logs de auditoría
**4.6** Theme toggle en todos los componentes
**4.7** Charts adapt to theme

---

## Reglas ABSOLUTAS

1. TypeScript strict, sin `any`
2. Admin global tiene acceso a TODO — seguridad crítica
3. Logs de auditoría para todas las acciones importantes
4. Charts responsivos y adapt to theme
5. Tables con muchas columnas — scroll horizontal en mobile

---

## Skills a Usar

- `nuxt` — layouts, server routes, middleware
- `vue-best-practices` — componentes Vue
- `design-taste-frontend` — dashboards enterprise-grade
- `responsive-design` — tables responsivos

---

*Prompt generado: Mayo 2026*