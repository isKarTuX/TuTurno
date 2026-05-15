# PROMPT: Implementar Módulo Entidad (Admin) — TuTurno

## Contexto

**Proyecto:** TuTurno - Sistema de Turnos Digitales
**Stack:** Nuxt 3 + Vue 3 Composition API + TypeScript + Tailwind CSS v4
**Archivos de referencia:**
- `CLAUDE.md` — Reglas de código
- `docs/profiles/ENTITY-MODULE-REQUIREMENTS.md` — **DOCUMENTO MAESTRO**
- `docs/profiles/CITIZEN-MODULE-REQUIREMENTS.md` — Theme system y componentes compartidos

---

## Objetivo

Implementar COMPLETAMENTE el módulo admin de entidad siguiendo los documentos.

---

## Pasos Obligatorios

### FASE 1: Lectura

**1.1** Leer COMPLETAMENTE:
1. `docs/profiles/ENTITY-MODULE-REQUIREMENTS.md`
2. Sección 1.6 de CITIZEN-MODULE-REQUIREMENTS.md (Theme)
3. `CLAUDE.md`

**1.2** Resumir:
- Diferencia entre Admin Entidad vs Admin Global
- Menú y estructura de páginas
- CRUD de servicios y operadores
- Reportes y gráficos

---

### FASE 2: Inventario

**2.1** Ver existente en `/components/entity/` y `/components/admin/`

**2.2** Ver API routes existentes en `/server/api/entity/`

**2.3** Ver layouts existentes

---

### FASE 3: Implementación

### 3.1 Páginas Entity Admin

1. **`pages/entity/index.vue`** — Dashboard
   - Metrics cards (turnos hoy, atendidos, espera avg, no-show %)
   - Servicios con estado (activo/pausado)
   - Turnos en tiempo real
   - definePageMeta({ middleware: 'entity', layout: 'entity' })

2. **`pages/entity/services/index.vue`** — Lista de servicios
   - Card por servicio con stats
   - Botón crear nuevo servicio
   - Toggle pausar/reanudar

3. **`pages/entity/services/[id]/edit.vue`** — Editar servicio
   - Formulario con horarios, tiempo avg
   - Validación Zod

4. **`pages/entity/operators/index.vue`** — Operadores
   - Tabla con nombre, email, servicios asignados, stats
   - Botón agregar operador
   - Modal para asignar a servicios

5. **`pages/entity/reports/index.vue`** — Reportes
   - Selector de período (hoy/semana/mes/custom)
   - Selector de servicio
   - Gráficos: turnos por día, tiempo espera, tasa no-show
   - Chart.js o similar

6. **`pages/entity/settings/index.vue`** — Configuración
   - Datos de entidad (dirección, contacto)
   - Logo upload
   - Horarios globales

### 3.2 Componentes

1. **`components/entity/ServiceCard.vue`**
   - Info servicio con icon
   - Stats (turnos hoy, en espera, tiempo avg)
   - Toggle pause/resume
   - Botones editar/ver cola

2. **`components/entity/ServiceForm.vue`**
   - Modal o página completa
   - Campos: nombre, descripción, horarios, tiempo avg, prefijo
   - Validación

3. **`components/entity/OperatorList.vue`**
   - Tabla con operadores
   - Servicios asignados como badges
   - Stats de rendimiento
   - Acciones: editar, remover

4. **`components/entity/OperatorAssignment.vue`**
   - Modal para asignar operador a servicios
   - Checkboxes por servicio
   - Lista de operadores ya asignados

5. **`components/entity/ReportsChart.vue`**
   - Chart.js line/bar chart
   - Responsive
   - Tema adaptativo (light/dark)

6. **`components/entity/MetricsCard.vue`**
   - Número grande con label
   - Variación % vs período anterior
   - Color según métrica (green/amber/red)

### 3.3 Layout

1. **`layouts/entity.vue`**
   - Sidebar con menú completo
   - Logo + nombre entidad
   - User section al final
   - Theme toggle
   - Mobile: bottom nav

### 3.4 API Routes

1. **`server/api/entity/dashboard.get.ts`**
   - Stats de la entidad
   - Servicios con sus stats
   - Turnos activos en tiempo real

2. **`server/api/entity/services/index.get.ts`**
   - Lista de servicios de la entidad

3. **`server/api/entity/services/index.post.ts`**
   - Crear servicio (Zod validation)

4. **`server/api/entity/services/[id].patch.ts`**
   - Editar servicio

5. **`server/api/entity/services/[id]/pause.post.ts`**
   - Pausar/reanudar servicio

6. **`server/api/entity/operators/index.get.ts`**
   - Lista de operadores de la entidad

7. **`server/api/entity/operators/invite.post.ts`**
   - Invitar operador (crear usuario + asignar)

8. **`server/api/entity/operators/[id]/assign.post.ts`**
   - Asignar operador a servicios

9. **`server/api/entity/operators/[id].delete.ts`**
   - Remover operador (soft delete relación)

10. **`server/api/entity/reports/turns.get.ts`**
    - Reporte de turnos (labels, requested, attended, noShow)

11. **`server/api/entity/reports/wait-time.get.ts`**
    - Tiempo de espera promedio por período

12. **`server/api/entity/reports/operator-performance.get.ts`**
    - Stats por operador

### 3.5 Middleware

1. **`middleware/entity.ts`**
   - Verificar user.role === 'admin' Y user.entityId existe
   - Redirect si no tiene permisos de entidad

---

### FASE 4: Verificación

**4.1** TypeScript check
**4.2** Probar CRUD de servicios
**4.3** Probar gestión de operadores
**4.4** Probar reportes con gráficos
**4.5** Theme toggle en light/dark
**4.6** Responsive en tablet/mobile

---

## Reglas ABSOLUTAS

1. TypeScript strict, sin `any`
2. Charts adapt to theme (dark/light)
3. Tables con hover states
4. Forms con validación inline
5. Loading skeletons en datos async

---

## Skills a Usar

- `nuxt` — layouts, server routes, middleware
- `vue-best-practices` — componentes Vue
- `design-taste-frontend` — tablas y dashboards premium
- `responsive-design` — charts responsivos

---

*Prompt generado: Mayo 2026*