# PHASE-08 — Panel Admin y Reportes

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 8
Depende de: PHASE-04 al PHASE-07
Tiempo estimado: 90 min
```

---

## 1. Objetivo

Crear el panel de administración con métricas globales, gestión de entidades/servicios/operadores y reportes básicos.

---

## 2. Dashboard de Métricas

### GET /api/admin/metrics

```typescript
// Response 200
{
  success: true,
  data: {
    today: {
      turnsCreated: number,
      turnsCompleted: number,
      turnsCancelled: number,
      avgWaitMinutes: number,
      avgAttentionMinutes: number
    },
    thisWeek: { ... },
    thisMonth: { ... },
    totalEntities: number,
    totalServices: number,
    totalOperators: number,
    totalCitizens: number
  }
}
```

### Cards del Dashboard

| Card | Métrica | Descripción |
|------|---------|-------------|
| Turnos hoy | `{turnsCreated}` | Turnos creados hoy |
| Atendidos hoy | `{turnsCompleted}` | Turnos completados hoy |
| En espera ahora | `{waitingNow}` | Personas en cola ahora mismo |
| Tiempo promedio espera | `{avgWaitMinutes}` | Minutos promedio en espera |

### Gráficas

**Turnos por hora (hoy):**
- Bar chart con turnos creados vs completados por hora
- Rango: 8am - 6pm
- Fuente: `turns.createdAt` agrupado por hora

**Estado de turnos (semana):**
- Doughnut chart con distribución de estados
- waiting | called | attending | completed | no_show | cancelled

**Actividad por entidad (semana):**
- Horizontal bar chart
- Top 5 entidades por volumen de turnos

---

## 3. Gestión de Entidades

### /admin/entities/index.vue

- Tabla con todas las entidades
- Columnas: Nombre, Tipo, Ciudad, Servicios, Estado
- Acciones: Editar, Activar/Desactivar, Ver turnos

### /admin/entities/new.vue y [id].vue

- Formulario completo de entidad
- Campos: nombre, tipo, dirección, ciudad, lat/lng, teléfono, email, logo
- Validación Zod
- Preview del logo

---

## 4. Gestión de Servicios

### /admin/entities/[id]/services/

- Lista de servicios de la entidad
- Indicador de pausa (ícono)
- Tiempo promedio de atención
- Horario de atención

### /admin/services/[id].vue

- Editar servicio
- Campos: nombre, descripción, avgAttentionTime, openTime, closeTime
- Toggle: isActive, isPaused

---

## 5. Gestión de Operadores

### /admin/operators/

- Tabla con todos los operadores
- Columnas: Nombre, Email, Entidad, Servicio, Estado
- Acciones: Asignar servicio, Activar/Desactivar

### Asignar operador

```typescript
// POST /api/admin/operators
{
  userId: string,
  entityId: string,
  serviceId: string
}

// Response 201
{
  success: true,
  data: { operator: Operator }
}
```

---

## 6. Reportes

### /admin/reports/

**Reporte por entidad:**
- Selector de entidad y rango de fechas
- Métricas: turnos creados, completados, cancelled, no_show
- Tiempo promedio de espera
- Distribución por servicio

**Reporte por operador:**
- Selector de operador
- Turnos atendidos por día
- Tiempo promedio de atención
- Tasa de no_show

**Exportar:**
- Botón "Exportar CSV"
- Genera archivo con los datos filtrados

---

## 7. Componentes

### AdminMetricCard.vue

```typescript
interface Props {
  title: string
  value: number | string
  change?: number        // % change from last period
  icon?: string         // lucide icon name
  variant?: 'default' | 'success' | 'warning' | 'danger'
}
```

### AdminReportsChart.vue

```typescript
interface Props {
  type: 'bar' | 'doughnut' | 'line'
  data: ChartData
  title?: string
}
```

**Librería sugerida:** Chart.js (ligero, buena integración con Vue)

---

## 8. Criterios de Éxito

- [ ] Dashboard muestra métricas en tiempo real
- [ ] Gráficos se actualizan al cambiar filtro de fechas
- [ ] CRUD de entidades funciona correctamente
- [ ] CRUD de servicios con pause/resume
- [ ] Asignación de operadores a servicios
- [ ] Reporte exportable a CSV
- [ ] Solo admin tiene acceso a /admin/**
