# TuTurno — Módulo Entidad (Admin de Entidad): Documento Maestro de Requisitos

> **Versión:** 1.0 | **Fecha:** Mayo 2026 | **Proyecto:** TuTurno - Sistema de Turnos Digitales
> **Propósito:** Consolidar requisitos para administradores de entidad (no es admin global del sistema).
> **Skills aplicadas:** design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation

---

## 1. CONTEXTO Y VISIÓN

### 1.1 Propuesta de Valor

El **Admin de Entidad** es el representante de la EPS, banco u oficina que gestiona su propia instancia en TuTurno:

1. **Configurar servicios** disponibles en su entidad
2. **Asignar operadores** a servicios específicos
3. **Ver métricas y reportes** de atención de su entidad
4. **Gestionar horarios** de atención

**No confundir con:** El Admin global del sistema (maneja todas las entidades).

### 1.2 Diferencia de Roles

| Rol | Alcance |
|-----|---------|
| **Admin Global** | Todo el sistema, todas las entidades |
| **Admin Entidad** | Solo su entidad, sus servicios y operadores |
| **Operador** | Solo su servicio específico, gestión de cola |

### 1.3 Principios de Diseño

| Principio | Aplicación |
|-----------|------------|
| **Control total** | Puede ver y configurar todo de su entidad |
| **Visibilidad** | Dashboard con métricas en tiempo real |
| **Delegación** | Puede asignar operadores, no hace todo él |
| **Reportes** | Datos históricos para mejorar servicio |

---

## 1.4 Theme System — Modo Claro y Oscuro

### 1.4.1 Overview

El Admin de Entidad trabaja principalmente desde una computadora de escritorio, usualmente en oficina. El tema claro es más natural para uso prolongado en desktop, pero el tema oscuro sigue siendo soportado.

**Default:** Sistema sigue la preferencia del admin global o del navegador.

### 1.4.2 CSS Variables Compartidas

```css
/* Usa las mismas variables CSS que el módulo ciudadano */
:root {
  /* Todos los tokens definidos en CITIZEN-MODULE-REQUIREMENTS */
}

/* Entity Admin puede también definir tokens específicos para dashboards */
[data-theme="dark"] {
  /* Dashboard specific */
  --dashboard-bg: oklch(16% 0.015 285);
  --chart-line: oklch(72% 0.16 285);
  --chart-grid: oklch(100% 0 0 / 0.06);
}

[data-theme="light"] {
  /* Dashboard specific */
  --dashboard-bg: oklch(97% 0 0);
  --chart-line: oklch(50% 0.18 285);
  --chart-grid: oklch(0% 0 0 / 0.06);
}
```

### 1.4.3 Theme Toggle Location

En el sidebar del Entity Admin:

```vue
<!-- layouts/entity.vue -->
<template>
  <aside class="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 p-4">
    <!-- Logo + Entity name -->

    <!-- Theme toggle al final del sidebar -->
    <div class="absolute bottom-20 left-4 right-4 pt-4 border-t border-white/5">
      <div class="flex items-center justify-between">
        <span class="text-sm text-white/50">Tema</span>
        <button
          class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
          @click="toggleTheme"
        >
          <Icon :name="theme === 'dark' ? 'sun' : 'moon'" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- User section -->
    <div class="absolute bottom-4 left-4 right-4">
      <!-- User info -->
    </div>
  </aside>
</template>
```

### 1.4.4 Charts adaptation

Gráficos (reportes) deben adaptarse al tema:

```css
/* Chart.js - configuración de tema */
[data-theme="dark"] {
  --chart-bg: transparent;
  --chart-text: oklch(75% 0 0);
  --chart-grid: oklch(100% 0 0 / 0.06);
}

[data-theme="light"] {
  --chart-bg: transparent;
  --chart-text: oklch(45% 0 0);
  --chart-grid: oklch(0% 0 0 / 0.08);
}
```

### 1.4.5 Tables en Light Mode

```css
[data-theme="light"] .glass {
  background: oklch(100% 0 0 / 0.90);
  border-color: oklch(0% 0 0 / 0.08);
}

[data-theme="light"] table {
  --row-hover: oklch(95% 0 0);
}

[data-theme="light"] th {
  background: oklch(98% 0 0);
  border-bottom-color: oklch(0% 0 0 / 0.08);
}
```

---

## 2. ESTRUCTURA DE MENÚ

```
/entity (Dashboard de entidad)
├── Resumen (métricas generales)
├── Servicios
│   ├── Listado de servicios
│   ├── Crear/Editar servicio
│   └── Configurar horarios
├── Operadores
│   ├── Listado de operadores
│   ├── Asignar a servicios
│   └── Estadísticas por operador
├── Reportes
│   ├── Turnos por día
│   ├── Tiempo de espera promedio
│   ├── Tasa de no-show
│   └── Operador con mejor/atrás
└── Configuración
    ├── Datos de entidad
    └── Horarios de atención
```

---

## 3. DASHBOARD — ENTITY ADMIN

### 3.1 Página Principal

```
┌─────────────────────────────────────────────────────────────────────┐
│  ENTITY ADMIN DASHBOARD                                             │
│                                                                      │
│  EPS Sura - Montería                           [Config] [Mi cuenta] │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  RESUMEN HOY                                                     │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │ │
│  │  │  127   │ │   89   │ │  12min │ │   7%   │                   │ │
│  │  │turnos  │ │atendidos│ │espera  │ │no-show │                   │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ESTADO DE SERVICIOS                                            │ │
│  │                                                                │ │
│  │  Afiliaciones          Activo    23 turnos  [Ver cola]        │ │
│  │  Atención al cliente    Pausado    0 turnos  [Reanudar]       │ │
│  │  Radicación docs        Activo    45 turnos  [Ver cola]        │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  TURNOS EN TIEMPO REAL                                          │ │
│  │                                                                │ │
│  │  ● B-047  María González    Afiliaciones    Called            │ │
│  │  ● B-048  Carlos Rodríguez  Afiliaciones    Waiting #2        │ │
│  │  ● C-012  Ana Martínez      Radicación       Waiting #1       │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 API Contract - Dashboard

```typescript
// GET /api/entity/dashboard

interface EntityDashboardResponse {
  success: true
  data: {
    entity: Entity
    todayStats: {
      totalTurns: number
      attended: number
      noShow: number
      avgWaitTime: number
      avgAttentionTime: number
    }
    services: ServiceWithStats[]
    activeTurns: ActiveTurn[]
  }
}

interface ServiceWithStats {
  service: Service
  isPaused: boolean
  activeTurns: number
  waitingTurns: number
}
```

---

## 4. GESTIÓN DE SERVICIOS

### 4.1 Listado de Servicios

```vue
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Servicios</h1>
      <UiButton variant="primary" @click="showCreateModal = true">
        <Icon name="plus" class="w-5 h-5 mr-2" />
        Nuevo servicio
      </UiButton>
    </div>

    <!-- Services list -->
    <div class="space-y-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="glass rounded-2xl p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Icon :name="service.icon || 'briefcase'" class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">{{ service.name }}</h3>
              <p class="text-white/50 text-sm">{{ service.description }}</p>

              <div class="flex items-center gap-4 mt-3 text-sm">
                <span class="text-white/50">
                  <Icon name="clock" class="w-4 h-4 inline mr-1" />
                  {{ service.openTime }} - {{ service.closeTime }}
                </span>
                <span class="text-white/50">
                  <Icon name="timer" class="w-4 h-4 inline mr-1" />
                  ~{{ service.avgAttentionTime }} min/turno
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs"
                  :class="service.isPaused ? 'bg-amber/20 text-amber' : 'bg-green/20 text-green'"
                >
                  {{ service.isPaused ? 'Pausado' : 'Activo' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UiButton variant="ghost" size="sm" @click="editService(service)">
              <Icon name="edit" class="w-4 h-4" />
            </UiButton>
            <UiButton variant="ghost" size="sm" @click="togglePause(service)">
              <Icon :name="service.isPaused ? 'play' : 'pause'" class="w-4 h-4" />
            </UiButton>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-white/50">Turnos hoy</span>
            <p class="text-xl font-semibold text-white">{{ service.stats.totalToday }}</p>
          </div>
          <div>
            <span class="text-white/50">En espera</span>
            <p class="text-xl font-semibold text-white">{{ service.stats.waiting }}</p>
          </div>
          <div>
            <span class="text-white/50">Tiempo avg</span>
            <p class="text-xl font-semibold text-white">{{ service.stats.avgTime }}min</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 4.2 Crear/Editar Servicio

```vue
<!-- components/entity/ServiceForm.vue -->
<template>
  <UiModal v-model="open" title="Nuevo Servicio">
    <form @submit.prevent="save" class="space-y-4">
      <UiInput
        v-model="form.name"
        label="Nombre del servicio"
        placeholder="Ej: Afiliaciones"
        required
      />

      <UiInput
        v-model="form.description"
        label="Descripción"
        placeholder="Ej: Afiliaciones y beneficios"
      />

      <div class="grid grid-cols-2 gap-4">
        <UiInput
          v-model="form.openTime"
          label="Hora apertura"
          type="time"
          required
        />
        <UiInput
          v-model="form.closeTime"
          label="Hora cierre"
          type="time"
          required
        />
      </div>

      <UiInput
        v-model="form.avgAttentionTime"
        label="Tiempo promedio atención (min)"
        type="number"
        min="1"
        max="120"
        required
      />

      <UiInput
        v-model="form.prefix"
        label="Prefijo turno"
        placeholder="Ej: A"
        maxlength="1"
        class="w-20"
      />

      <div class="flex justify-end gap-3 pt-4">
        <UiButton variant="ghost" type="button" @click="open = false">
          Cancelar
        </UiButton>
        <UiButton variant="primary" type="submit" :loading="saving">
          Guardar
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
```

---

## 5. GESTIÓN DE OPERADORES

### 5.1 Listado de Operadores

```vue
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Operadores</h1>
      <UiButton variant="primary" @click="showInviteModal = true">
        <Icon name="user-plus" class="w-5 h-5 mr-2" />
        Agregar operador
      </UiButton>
    </div>

    <!-- Operators table -->
    <div class="glass rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left p-4 text-white/50 text-sm font-medium">Operador</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Servicios</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Turnos hoy</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Rendimiento</th>
            <th class="text-right p-4 text-white/50 text-sm font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="operator in operators"
            :key="operator.id"
            class="border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="font-semibold text-primary">{{ operator.initials }}</span>
                </div>
                <div>
                  <p class="text-white font-medium">{{ operator.fullName }}</p>
                  <p class="text-white/50 text-sm">{{ operator.email }}</p>
                </div>
              </div>
            </td>
            <td class="p-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="service in operator.services"
                  :key="service.id"
                  class="text-xs px-2 py-1 rounded-full bg-white/5 text-white/70"
                >
                  {{ service.name }}
                </span>
              </div>
            </td>
            <td class="p-4 text-white">{{ operator.stats.totalToday }}</td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <div class="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full"
                    :style="{ width: `${operator.stats.efficiency}%` }"
                  />
                </div>
                <span class="text-sm text-white/50">{{ operator.stats.efficiency }}%</span>
              </div>
            </td>
            <td class="p-4 text-right">
              <UiButton variant="ghost" size="sm" @click="editOperator(operator)">
                <Icon name="edit" class="w-4 h-4" />
              </UiButton>
              <UiButton variant="ghost" size="sm" @click="removeOperator(operator)">
                <Icon name="trash" class="w-4 h-4 text-red-400" />
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
```

### 5.2 Asignar Operador a Servicio

```vue
<!-- components/entity/OperatorAssignment.vue -->
<template>
  <UiModal v-model="open" title="Asignar a servicios">
    <div class="space-y-4">
      <div
        v-for="service in allServices"
        :key="service.id"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5"
      >
        <div class="flex items-center gap-3">
          <UiCheckbox
            :modelValue="isAssigned(service.id)"
            @update:modelValue="toggleAssignment(service.id)"
          />
          <span class="text-white">{{ service.name }}</span>
        </div>
        <span class="text-sm text-white/50">
          {{ getAssignedOperatorCount(service.id) }} operador(es)
        </span>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
      <UiButton variant="primary" @click="saveAssignments">Guardar</UiButton>
    </div>
  </UiModal>
</template>
```

---

## 6. REPORTES

### 6.1 Tipos de Reportes

| Reporte | Descripción | Filtros |
|---------|-------------|---------|
| **Turnos por día** | Cantidad de turnos solicitados vs atendidos | Fecha, servicio |
| **Tiempo de espera** | Promedio de espera por día | Fecha, servicio |
| **Tasa de no-show** | % de turnos que no fueron atendidos | Fecha, servicio |
| **Rendimiento operador** | Turnos atendidos por operador | Fecha |
| **Horas pico** | Distribución de turnos por hora | Fecha |

### 6.2 Gráficos

```vue
<!-- components/entity/ReportsChart.vue -->
<template>
  <div class="glass rounded-2xl p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">{{ title }}</h3>

      <div class="flex items-center gap-2">
        <select
          v-model="selectedPeriod"
          class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
        >
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="custom">Personalizado</option>
        </select>

        <select
          v-if="showServiceFilter"
          v-model="selectedService"
          class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
        >
          <option value="">Todos los servicios</option>
          <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
    </div>

    <!-- Chart placeholder - usar Chart.js o similar -->
    <div class="h-64 flex items-center justify-center text-white/30">
      [Gráfico aquí]
    </div>

    <!-- Summary stats -->
    <div class="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-center text-sm">
      <div>
        <p class="text-white/50">Total</p>
        <p class="text-2xl font-bold text-white">{{ summary.total }}</p>
      </div>
      <div>
        <p class="text-white/50">Promedio</p>
        <p class="text-2xl font-bold text-white">{{ summary.avg }}</p>
      </div>
      <div>
        <p class="text-white/50">Variación</p>
        <p class="text-2xl font-bold" :class="summary.variation >= 0 ? 'text-green' : 'text-red'">
          {{ summary.variation }}%
        </p>
      </div>
    </div>
  </div>
</template>
```

---

## 7. API CONTRACTS

### 7.1 Gestión de Servicios

```typescript
// POST /api/entity/services
interface CreateServiceRequest {
  name: string
  description?: string
  openTime: string      // "08:00"
  closeTime: string      // "17:00"
  avgAttentionTime: number  // minutos
  prefix: string         // "A"
}

// PATCH /api/entity/services/[id]
interface UpdateServiceRequest {
  name?: string
  description?: string
  openTime?: string
  closeTime?: string
  avgAttentionTime?: number
  isPaused?: boolean
}

// POST /api/entity/services/[id]/pause
interface PauseServiceRequest {
  paused: boolean
}
```

### 7.2 Gestión de Operadores

```typescript
// POST /api/entity/operators/invite
interface InviteOperatorRequest {
  email: string
  serviceIds: string[]
}

// GET /api/entity/operators
// Retorna lista de operadores con stats

// DELETE /api/entity/operators/[id]
// Remueve operador (no elimina usuario, solo la relación)
```

### 7.3 Reportes

```typescript
// GET /api/entity/reports/turns?period=week&serviceId=xxx
interface TurnsReportResponse {
  success: true
  data: {
    labels: string[]         // fechas
    requested: number[]     // turnos solicitados
    attended: number[]      // turnos atendidos
    noShow: number[]         // no-shows
  }
}

// GET /api/entity/reports/wait-time?period=week
interface WaitTimeReportResponse {
  success: true
  data: {
    labels: string[]
    avgWaitTime: number[]
    avgAttentionTime: number[]
  }
}

// GET /api/entity/reports/operator-performance?period=week
interface OperatorPerformanceResponse {
  success: true
  data: {
    operators: {
      id: string
      name: string
      turnsAttended: number
      avgAttentionTime: number
      noShowRate: number
    }[]
  }
}
```

---

## 8. LAYOUT — ENTITY ADMIN

```vue
<!-- layouts/entity.vue -->
<template>
  <div class="min-h-screen bg-bg-base">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 p-4">
      <div class="mb-6">
        <UiLogo />
        <p class="text-white/50 text-sm mt-1">{{ entityName }}</p>
      </div>

      <nav class="space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive(item.to) ? 'bg-primary/20 text-primary' : 'text-white/70 hover:bg-white/5'"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto px-2 py-0.5 rounded-full text-xs bg-primary/30"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- User menu -->
      <div class="absolute bottom-4 left-4 right-4">
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="font-semibold text-primary">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium truncate">{{ userName }}</p>
            <p class="text-white/50 text-sm truncate">{{ userRole }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="ml-64 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const menuItems = [
  { to: '/entity', label: 'Dashboard', icon: 'view-dashboard' },
  { to: '/entity/services', label: 'Servicios', icon: 'briefcase', badge: '3' },
  { to: '/entity/operators', label: 'Operadores', icon: 'users' },
  { to: '/entity/reports', label: 'Reportes', icon: 'chart-bar' },
  { to: '/entity/settings', label: 'Configuración', icon: 'cog' },
]
</script>
```

---

## 9. RESPONSIVE — ENTITY ADMIN

### Desktop (>= 1024px)
- [ ] Sidebar visible
- [ ] Tables con muchas columnas visibles
- [ ] Gráficos lado a lado

### Tablet (768px - 1023px)
- [ ] Sidebar colapsable
- [ ] Tables con scroll horizontal
- [ ] Gráficos apilados

### Mobile (< 768px)
- [ ] Bottom navigation reemplaza sidebar
- [ ] Cards para cada métrica en vez de tabla
- [ ] Gráficos de una columna
- [ ] Formularios full-width

---

## 10. PERMISOS Y ROLES

### 10.1 Permisos del Admin de Entidad

| Permiso | Descripción |
|---------|-------------|
| `entity:read` | Ver dashboard y métricas |
| `entity:services:manage` | Crear, editar, pausar servicios |
| `entity:operators:manage` | Agregar, remover operadores |
| `entity:operators:assign` | Asignar operadores a servicios |
| `entity:reports:view` | Ver todos los reportes |
| `entity:settings:manage` | Editar configuración de entidad |

### 10.2 Implementación

```typescript
// middleware/entity.ts
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // Verificar que el usuario es admin de alguna entidad
  if (!auth.user?.entityId) {
    return createError({
      statusCode: 403,
      message: 'No tienes permisos de administrador de entidad',
    })
  }
})
```

---

## 11. PREGUNTAS PARA CONFIRMAR

1. **Multi-entidad:** ¿Un admin puede gestionar varias entidades (ej: una cadena de bancos)?
2. **Operadores compartidos:** ¿Un operador puede trabajar en múltiples servicios de la misma entidad?
3. **Horarios especiales:** ¿Se permiten horarios diferentes por día (lunes vs viernes)?
4. **Turnos Online vs Presencial:** ¿Se puede limitar turnos online para mantener algunos para atención presencial?
5. **Exportar datos:** ¿Se pueden exportar reportes a Excel/CSV?

---

*Documento generado: Mayo 2026*
*Skills aplicadas: design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation*