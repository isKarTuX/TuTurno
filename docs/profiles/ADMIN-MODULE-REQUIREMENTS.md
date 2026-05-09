# TuTurno — Módulo Admin Global: Documento Maestro de Requisitos

> **Versión:** 1.0 | **Fecha:** Mayo 2026 | **Proyecto:** TuTurno - Sistema de Turnos Digitales
> **Propósito:** Consolidar requisitos para el administrador global del sistema TuTurno.
> **Skills aplicadas:** design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation

---

## 1. CONTEXTO Y VISIÓN

### 1.1 Propuesta de Valor

El **Admin Global** es el superadministrador del sistema TuTurno. Maneja:

1. **Todas las entidades** registradas en la plataforma
2. **Usuarios admins de cada entidad** (asignación y revocación)
3. **Configuración global** del sistema
4. **Métricas platform-wide** y reportes ejecutivos

### 1.2 Diferencia de Alcance

| Rol | Alcance |
|-----|---------|
| **Admin Global** | Sistema completo, todas las entidades, configuración |
| **Admin Entidad** | Solo su entidad, sus servicios y operadores |
| **Operador** | Solo su servicio, gestión de cola |

### 1.3 Principios de Diseño

| Principio | Aplicación |
|-----------|------------|
| **Overview** | Dashboard con métricas de toda la plataforma |
| **Control** | Acceso total a todas las entidades y configuraciones |
| **Auditoría** | Logs de todas las acciones importantes |
| **Escalabilidad** | UI que maneje muchas entidades sin perder rendimiento |

---

## 1.4 Theme System — Modo Claro y Oscuro

### 1.4.1 Admin Global Theme Strategy

El Admin Global puede necesitar ver dashboards tanto en oficina (luz brillante) como en condiciones oscuras. Soporta ambos temas con **preferencia del sistema como default**.

### 1.4.2 System-Level Theme Configuration

El Admin Global puede establecer el **tema default para toda la plataforma**:

```vue
<!-- En /admin/config -->
<div class="space-y-4">
  <h4 class="text-sm font-medium text-white/50 uppercase tracking-wider">Tema predeterminado</h4>

  <div class="flex items-center justify-between p-4 glass rounded-xl">
    <div>
      <p class="text-white font-medium">Usar tema del sistema</p>
      <p class="text-sm text-white/50">Detecta automáticamente la preferencia del dispositivo</p>
    </div>
    <UiToggle v-model="config.useSystemTheme" @change="saveConfig" />
  </div>

  <div v-if="!config.useSystemTheme" class="flex gap-4">
    <button
      class="flex-1 p-4 rounded-xl glass"
      :class="config.defaultTheme === 'dark' ? 'border-primary' : ''"
      @click="setDefaultTheme('dark')"
    >
      <Icon name="moon" class="w-6 h-6 mx-auto mb-2" />
      <p class="text-center text-white/70">Oscuro</p>
    </button>
    <button
      class="flex-1 p-4 rounded-xl glass"
      :class="config.defaultTheme === 'light' ? 'border-primary' : ''"
      @click="setDefaultTheme('light')"
    >
      <Icon name="sun" class="w-6 h-6 mx-auto mb-2" />
      <p class="text-center text-white/70">Claro</p>
    </button>
  </div>
</div>
```

### 1.4.3 CSS Variables for Admin Dashboard

```css
/* Admin dashboard específico */
:root {
  /* Shared tokens from citizen module */
  --color-primary: oklch(55% 0.18 285);
  --bg-base: oklch(13% 0.015 285);
  --text-primary: oklch(100% 0 0);
}

/* Admin-specific dashboard tokens */
[data-theme="dark"] {
  --admin-sidebar: oklch(16% 0.015 285);
  --admin-topbar: oklch(13% 0.015 285);
  --admin-card: oklch(16% 0.015 285);
  --admin-table-header: oklch(20% 0.015 285);
  --admin-chart-bg: oklch(13% 0.015 285);
}

[data-theme="light"] {
  --admin-sidebar: oklch(98% 0 0);
  --admin-topbar: oklch(100% 0 0);
  --admin-card: oklch(100% 0 0);
  --admin-table-header: oklch(97% 0 0);
  --admin-chart-bg: oklch(98% 0 0);
}
```

### 1.4.4 Implementation in Admin Layout

```vue
<!-- layouts/admin.vue -->
<template>
  <div :data-theme="theme" class="min-h-screen transition-colors duration-200">
    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 bottom-0 w-64 transition-colors"
      :style="{ backgroundColor: 'var(--admin-sidebar)' }"
    >
      <!-- Sidebar content -->
    </aside>

    <!-- Main content uses CSS variables automatically -->
    <main class="ml-64 pt-16 p-6">
      <slot />
    </main>
  </div>
</template>
```

### 1.4.5 Platform-Wide Theme Setting

```typescript
// API para configurar tema default de la plataforma
// PATCH /api/admin/config

interface UpdateConfigRequest {
  // ... otras configs
  useSystemTheme: boolean        // true = detectar del sistema
  defaultTheme: 'dark' | 'light' // si useSystemTheme es false
  allowUserThemeSelection: boolean // si true, usuarios pueden elegir
}
```

### 1.4.6 Entity Theme Inheritance

Cada entidad puede heredar el tema de la plataforma o definir el suyo:

```typescript
interface Entity {
  // ... otros campos
  themeOverride?: 'dark' | 'light' | null // null = heredar de plataforma
}
```

### 1.4.7 Theme Consistency Across All Admin Sections

```css
/* Admin tables */
[data-theme="dark"] table th {
  background: oklch(20% 0.015 285);
  border-bottom: 1px solid oklch(100% 0 0 / 0.10);
}

[data-theme="light"] table th {
  background: oklch(97% 0 0);
  border-bottom: 1px solid oklch(0% 0 0 / 0.08);
}

/* Admin modals */
[data-theme="dark"] .modal-backdrop {
  background: oklch(0% 0 0 / 0.60);
}

[data-theme="light"] .modal-backdrop {
  background: oklch(0% 0 0 / 0.40);
}

/* Admin charts - Chart.js config */
const chartConfig = {
  dark: {
    backgroundColor: 'transparent',
    textColor: 'rgba(255,255,255,0.75)',
    gridColor: 'rgba(255,255,255,0.06)',
  },
  light: {
    backgroundColor: 'transparent',
    textColor: 'rgba(0,0,0,0.65)',
    gridColor: 'rgba(0,0,0,0.06)',
  },
}
```

---

## 2. ESTRUCTURA DE MENÚ

```
/admin (Dashboard global)
├── Overview (métricas platform)
├── Entidades
│   ├── Listado de entidades
│   ├── Crear nueva entidad
│   └── Detalle/editar entidad
├── Usuarios
│   ├── Admin de entidades
│   └── Operadores (lista global)
├── Configuración
│   ├── Variables de sistema
│   ├── Horarios globales
│   └── Notificaciones
├── Logs / Auditoría
└── Reportes globales
```

---

## 3. DASHBOARD — ADMIN GLOBAL

### 3.1 Página Principal (Overview)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ADMIN GLOBAL - TU TURNO PLATFORM                                    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  PLATFORM STATS                          [Este mes] [Semana]  │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │ │
│  │  │  1,247   │ │    892    │ │   18min   │ │    92%    │       │ │
│  │  │  turnos  │ │atendidos  │ │ espera    │ │tasa comp  │       │ │
│  │  │este mes  │ │este mes   │ │ promedio  │ │           │       │ │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐    │
│  │  ENTIDADES TOP             │ │  VELOCIDAD COLA            │    │
│  │                             │ │                             │    │
│  │  1. EPS Sura        456    │ │  [████████░░] 78%         │    │
│  │  2. Bancolombia     312    │ │                             │    │
│  │  3. Claro           198    │ │  Tiempo real de atención   │    │
│  │  4. Secretaría      134    │ │  vs demanda                │    │
│  │                             │ │                             │    │
│  │  [Ver todas las 12 →]      │ │  [Ver análisis completo]   │    │
│  └─────────────────────────────┘ └─────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ACTIVIDAD RECIENTE                                            │ │
│  │                                                               │ │
│  │  ● EPS Sura agregó operador "María López"        Hace 5 min   │ │
│  │  ● Bancolombia pausó servicio "Créditos"          Hace 12 min │ │
│  │  ● Nuevo usuario registrado "Carlos González"    Hace 34 min  │ │
│  │  ● EPS Sura: 25 turnos atendidos                Hace 1h      │ │
│  │                                                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 API Contract - Admin Dashboard

```typescript
// GET /api/admin/dashboard

interface AdminDashboardResponse {
  success: true
  data: {
    platformStats: {
      totalTurnsThisMonth: number
      attendedThisMonth: number
      avgWaitTime: number
      completionRate: number
      totalEntities: number
      totalUsers: number
    }
    topEntities: {
      id: string
      name: string
      turnsThisMonth: number
    }[]
    queueVelocity: {
      currentLoad: number
      avgAttentionTime: number
    }
    recentActivity: {
      type: 'operator_added' | 'service_paused' | 'user_registered' | 'turns_completed'
      entityId?: string
      entityName?: string
      description: string
      timestamp: string
    }[]
  }
}
```

---

## 4. GESTIÓN DE ENTIDADES

### 4.1 Listado de Entidades

```vue
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Entidades</h1>
        <p class="text-white/50 text-sm">12 entidades activas en la plataforma</p>
      </div>
      <UiButton variant="primary" @click="showCreateModal = true">
        <Icon name="plus" class="w-5 h-5 mr-2" />
        Nueva entidad
      </UiButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <UiInput
        v-model="searchQuery"
        placeholder="Buscar entidad..."
        class="max-w-xs"
      />

      <select
        v-model="typeFilter"
        class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
      >
        <option value="">Todos los tipos</option>
        <option value="eps">EPS</option>
        <option value="bank">Banco</option>
        <option value="public_office">Oficina pública</option>
        <option value="other">Otro</option>
      </select>

      <select
        v-model="statusFilter"
        class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
      >
        <option value="">Todos los estados</option>
        <option value="active">Activas</option>
        <option value="inactive">Inactivas</option>
      </select>
    </div>

    <!-- Entities table -->
    <div class="glass rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left p-4 text-white/50 text-sm font-medium">Entidad</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Tipo</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Ciudad</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Servicios</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Turnos (mes)</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Admin</th>
            <th class="text-right p-4 text-white/50 text-sm font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entity in entities"
            :key="entity.id"
            class="border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name="building" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="text-white font-medium">{{ entity.name }}</p>
                  <p class="text-white/50 text-sm">{{ entity.email }}</p>
                </div>
              </div>
            </td>
            <td class="p-4">
              <span class="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">
                {{ entity.typeLabel }}
              </span>
            </td>
            <td class="p-4 text-white/70">{{ entity.city }}</td>
            <td class="p-4 text-white">{{ entity.servicesCount }}</td>
            <td class="p-4 text-white">{{ entity.turnsThisMonth }}</td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span class="text-xs text-white/70">{{ entity.adminInitials }}</span>
                </div>
                <span class="text-white/70 text-sm">{{ entity.adminName }}</span>
              </div>
            </td>
            <td class="p-4 text-right">
              <NuxtLink :to="`/admin/entities/${entity.id}`">
                <UiButton variant="ghost" size="sm">
                  <Icon name="eye" class="w-4 h-4" />
                </UiButton>
              </NuxtLink>
              <UiButton variant="ghost" size="sm" @click="editEntity(entity)">
                <Icon name="edit" class="w-4 h-4" />
              </UiButton>
              <UiButton variant="ghost" size="sm" @click="confirmDelete(entity)">
                <Icon name="trash" class="w-4 h-4 text-red-400" />
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="p-4 border-t border-white/5 flex items-center justify-between">
        <p class="text-white/50 text-sm">
          Mostrando {{ pagination.from }} - {{ pagination.to }} de {{ pagination.total }}
        </p>
        <div class="flex items-center gap-2">
          <UiButton variant="outline" size="sm" :disabled="!pagination.hasPrev">
            Anterior
          </UiButton>
          <UiButton variant="outline" size="sm" :disabled="!pagination.hasNext">
            Siguiente
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 4.2 Crear/Editar Entidad

```vue
<!-- components/admin/EntityForm.vue -->
<template>
  <UiModal v-model="open" :title="isEditing ? 'Editar Entidad' : 'Nueva Entidad'" size="lg">
    <form @submit.prevent="save" class="space-y-6">
      <!-- Basic info -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-white/50 uppercase tracking-wider">Información básica</h4>

        <UiInput
          v-model="form.name"
          label="Nombre de la entidad"
          placeholder="Ej: EPS Sura"
          required
        />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-white/70 mb-2">Tipo</label>
            <select
              v-model="form.type"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <option value="eps">EPS</option>
              <option value="bank">Banco</option>
              <option value="public_office">Oficina pública</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <UiInput
            v-model="form.city"
            label="Ciudad"
            placeholder="Ej: Montería"
            required
          />
        </div>

        <UiInput
          v-model="form.address"
          label="Dirección"
          placeholder="Ej: Calle 50 #23-45"
          required
        />
      </div>

      <!-- Contact -->
      <div class="space-y-4 pt-4 border-t border-white/5">
        <h4 class="text-sm font-medium text-white/50 uppercase tracking-wider">Contacto</h4>

        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="contacto@eps-sura.com"
          />
          <UiInput
            v-model="form.phone"
            label="Teléfono"
            type="tel"
            placeholder="+57 604 555 1234"
          />
        </div>
      </div>

      <!-- Location -->
      <div class="space-y-4 pt-4 border-t border-white/5">
        <h4 class="text-sm font-medium text-white/50 uppercase tracking-wider">Ubicación</h4>

        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="form.latitude"
            label="Latitud"
            type="number"
            step="any"
            placeholder="8.7495"
          />
          <UiInput
            v-model="form.longitude"
            label="Longitud"
            type="number"
            step="any"
            placeholder="-75.8812"
          />
        </div>

        <!-- Map preview placeholder -->
        <div class="h-40 bg-white/5 rounded-xl flex items-center justify-center text-white/30">
          [Mapa interactivo]
        </div>
      </div>

      <!-- Admin assignment -->
      <div class="space-y-4 pt-4 border-t border-white/5">
        <h4 class="text-sm font-medium text-white/50 uppercase tracking-wider">Administrador</h4>

        <UiInput
          v-model="form.adminEmail"
          label="Email del admin (se creará usuario)"
          type="email"
          placeholder="admin@eps-sura.com"
        />

        <UiInput
          v-model="form.adminName"
          label="Nombre completo del admin"
          placeholder="Juan Pérez"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <UiButton variant="ghost" type="button" @click="open = false">
          Cancelar
        </UiButton>
        <UiButton variant="primary" type="submit" :loading="saving">
          {{ isEditing ? 'Guardar cambios' : 'Crear entidad' }}
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
```

---

## 5. GESTIÓN DE USUARIOS

### 5.1 Listado de Usuarios

```vue
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Usuarios</h1>

      <div class="flex items-center gap-2">
        <UiButton variant="outline" @click="exportUsers">
          <Icon name="download" class="w-4 h-4 mr-2" />
          Exportar CSV
        </UiButton>
        <UiButton variant="primary" @click="showCreateModal = true">
          <Icon name="user-plus" class="w-5 h-5 mr-2" />
          Nuevo usuario
        </UiButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 flex-wrap">
      <UiInput
        v-model="searchQuery"
        placeholder="Buscar por nombre, email o cédula..."
        class="max-w-xs"
      />

      <select
        v-model="roleFilter"
        class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
      >
        <option value="">Todos los roles</option>
        <option value="admin">Admin entidad</option>
        <option value="operator">Operador</option>
        <option value="citizen">Ciudadano</option>
      </select>

      <select
        v-model="entityFilter"
        class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
      >
        <option value="">Todas las entidades</option>
        <option v-for="e in entities" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>

      <UiToggle v-model="activeFilter" label="Solo activos" />
    </div>

    <!-- Users table -->
    <div class="glass rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left p-4 text-white/50 text-sm font-medium">Usuario</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Cédula</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Rol</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Entidad</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Último acceso</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Estado</th>
            <th class="text-right p-4 text-white/50 text-sm font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-white/5 hover:bg-white/5"
          >
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="font-semibold text-primary">{{ user.initials }}</span>
                </div>
                <div>
                  <p class="text-white font-medium">{{ user.fullName }}</p>
                  <p class="text-white/50 text-sm">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="p-4 text-white/70 font-mono text-sm">{{ user.documentId }}</td>
            <td class="p-4">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-purple/20 text-purple': user.role === 'admin',
                  'bg-blue/20 text-blue': user.role === 'operator',
                  'bg-green/20 text-green': user.role === 'citizen',
                }"
              >
                {{ user.roleLabel }}
              </span>
            </td>
            <td class="p-4 text-white/70">{{ user.entityName || '—' }}</td>
            <td class="p-4 text-white/70">
              {{ user.lastAccess ? formatRelativeTime(user.lastAccess) : 'Nunca' }}
            </td>
            <td class="p-4">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="user.isActive ? 'bg-green/20 text-green' : 'bg-red/20 text-red'"
              >
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="p-4 text-right">
              <UiButton variant="ghost" size="sm" @click="editUser(user)">
                <Icon name="edit" class="w-4 h-4" />
              </UiButton>
              <UiButton variant="ghost" size="sm" @click="toggleActive(user)">
                <Icon :name="user.isActive ? 'ban' : 'check'" class="w-4 h-4" />
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <!-- ... -->
    </div>
  </div>
</template>
```

---

## 6. CONFIGURACIÓN GLOBAL

### 6.1 Variables del Sistema

```vue
<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Configuración del sistema</h1>

    <!-- System variables -->
    <div class="glass rounded-2xl p-6 space-y-6">
      <h3 class="text-lg font-semibold text-white">Variables generales</h3>

      <div class="grid grid-cols-2 gap-6">
        <UiInput
          v-model="config.maxTurnsPerDay"
          label="Máximo turnos por ciudadano/día"
          type="number"
          min="1"
          max="10"
        />

        <UiInput
          v-model="config.defaultWaitTime"
          label="Tiempo espera estimado por defecto (min)"
          type="number"
        />

        <UiInput
          v-model="config.notificationThreshold"
          label="Notificar cuando faltan X turnos"
          type="number"
          min="1"
          max="10"
        />

        <UiInput
          v-model="config.sessionDuration"
          label="Duración sesión (horas)"
          type="number"
        />
      </div>
    </div>

    <!-- Scheduling -->
    <div class="glass rounded-2xl p-6 space-y-6">
      <h3 class="text-lg font-semibold text-white">Horarios globales</h3>

      <div class="flex items-center gap-4">
        <label class="text-white/70">Hora inicio atención:</label>
        <UiInput v-model="config.globalOpenTime" type="time" class="w-32" />

        <label class="text-white/70 ml-6">Hora cierre:</label>
        <UiInput v-model="config.globalCloseTime" type="time" class="w-32" />
      </div>

      <p class="text-sm text-white/40">
        Estos son los valores por defecto. Cada entidad puede tener horarios específicos.
      </p>
    </div>

    <!-- Feature flags -->
    <div class="glass rounded-2xl p-6 space-y-4">
      <h3 class="text-lg font-semibold text-white">Features</h3>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">Geo-localización</p>
            <p class="text-sm text-white/50">Permitir búsqueda de entidades cercanas</p>
          </div>
          <UiToggle v-model="config.geoEnabled" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">Notificaciones push</p>
            <p class="text-sm text-white/50">Enviar push cuando sea tu turno</p>
          </div>
          <UiToggle v-model="config.pushEnabled" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">Registro público</p>
            <p class="text-sm text-white/50">Permitir que cualquiera cree cuenta</p>
          </div>
          <UiToggle v-model="config.publicRegistration" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">Turnos priorizados</p>
            <p class="text-sm text-white/50">Permitir turnos con prioridad especial</p>
          </div>
          <UiToggle v-model="config.priorityTurnsEnabled" />
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <UiButton variant="primary" @click="saveConfig" :loading="saving">
        Guardar configuración
      </UiButton>
    </div>
  </div>
</template>
```

---

## 7. LOGS / AUDITORÍA

### 7.1 Registro de Acciones

```vue
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Logs de auditoría</h1>

      <div class="flex items-center gap-2">
        <UiButton variant="outline" size="sm" @click="exportLogs">
          <Icon name="download" class="w-4 h-4 mr-2" />
          Exportar
        </UiButton>
        <select
          v-model="dateRange"
          class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
        >
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="90days">90 días</option>
        </select>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 flex-wrap">
      <select
        v-model="actionFilter"
        class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
      >
        <option value="">Todas las acciones</option>
        <option value="user_created">Usuario creado</option>
        <option value="entity_created">Entidad creada</option>
        <option value="service_paused">Servicio pausado</option>
        <option value="service_resumed">Servicio reanudado</option>
        <option value="operator_added">Operador agregado</option>
        <option value="config_changed">Configuración cambiada</option>
      </select>

      <UiInput
        v-model="entitySearch"
        placeholder="Filtrar por entidad..."
        class="max-w-xs"
      />
    </div>

    <!-- Logs table -->
    <div class="glass rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left p-4 text-white/50 text-sm font-medium">Timestamp</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Acción</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Usuario</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Entidad</th>
            <th class="text-left p-4 text-white/50 text-sm font-medium">Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in logs"
            :key="log.id"
            class="border-b border-white/5 hover:bg-white/5"
          >
            <td class="p-4 text-white/70 font-mono text-sm">
              {{ formatTimestamp(log.timestamp) }}
            </td>
            <td class="p-4">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="getActionClass(log.action)"
              >
                {{ log.actionLabel }}
              </span>
            </td>
            <td class="p-4 text-white">{{ log.userName }}</td>
            <td class="p-4 text-white/70">{{ log.entityName || '—' }}</td>
            <td class="p-4 text-white/50 text-sm">{{ log.details }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <!-- ... -->
    </div>
  </div>
</template>
```

---

## 8. API CONTRACTS

### 8.1 Entidades

```typescript
// GET /api/admin/entities
interface EntityListResponse {
  success: true
  data: Entity[]
  meta: { total: number; page: number; perPage: number }
}

// POST /api/admin/entities
interface CreateEntityRequest {
  name: string
  type: 'eps' | 'bank' | 'public_office' | 'other'
  address: string
  city: string
  email?: string
  phone?: string
  latitude?: number
  longitude?: number
  adminEmail: string
  adminName: string
}

// PATCH /api/admin/entities/[id]
interface UpdateEntityRequest {
  name?: string
  address?: string
  city?: string
  email?: string
  phone?: string
  latitude?: number
  longitude?: number
  isActive?: boolean
}

// DELETE /api/admin/entities/[id]
```

### 8.2 Usuarios

```typescript
// GET /api/admin/users
interface UserListResponse {
  success: true
  data: UserWithEntity[]
  meta: { total: number; page: number; perPage: number }
}

// POST /api/admin/users
interface CreateUserRequest {
  fullName: string
  documentId: string
  email: string
  password: string
  role: 'admin' | 'operator' | 'citizen'
  entityId?: string
  serviceIds?: string[]
}

// PATCH /api/admin/users/[id]
interface UpdateUserRequest {
  fullName?: string
  email?: string
  role?: string
  isActive?: boolean
}

// POST /api/admin/users/[id]/reset-password
```

### 8.3 Configuración

```typescript
// GET /api/admin/config
interface ConfigResponse {
  success: true
  data: SystemConfig
}

// PATCH /api/admin/config
interface UpdateConfigRequest {
  maxTurnsPerDay?: number
  defaultWaitTime?: number
  notificationThreshold?: number
  sessionDuration?: number
  globalOpenTime?: string
  globalCloseTime?: string
  geoEnabled?: boolean
  pushEnabled?: boolean
  publicRegistration?: boolean
  priorityTurnsEnabled?: boolean
}
```

### 8.4 Logs

```typescript
// GET /api/admin/logs
interface LogsResponse {
  success: true
  data: AuditLog[]
  meta: { total: number; page: number; perPage: number }
}
```

---

## 9. LAYOUT — ADMIN GLOBAL

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-bg-base">
    <!-- Top bar -->
    <header class="fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 px-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UiLogo />
        <span class="text-white/50 text-sm">Admin</span>
      </div>

      <div class="flex items-center gap-4">
        <button class="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <Icon name="bell" class="w-5 h-5 text-white/70" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span class="text-sm font-semibold text-white">AD</span>
          </div>
          <span class="text-white text-sm">Admin</span>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="fixed top-16 left-0 bottom-0 w-64 glass border-r border-white/5 p-4 overflow-y-auto">
      <nav class="space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm"
          :class="isActive(item.to) ? 'bg-primary/20 text-primary' : 'text-white/70 hover:bg-white/5'"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="ml-64 pt-16 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: 'view-dashboard' },
  { to: '/admin/entities', label: 'Entidades', icon: 'building' },
  { to: '/admin/users', label: 'Usuarios', icon: 'users' },
  { to: '/admin/config', label: 'Configuración', icon: 'cog' },
  { to: '/admin/logs', label: 'Auditoría', icon: 'clipboard-list' },
  { to: '/admin/reports', label: 'Reportes', icon: 'chart-bar' },
]
</script>
```

---

## 10. RESPONSIVE — ADMIN

### Desktop (>= 1280px)
- [ ] Sidebar visible
- [ ] Tables con todas las columnas
- [ ] Dashboard con 4 métricas por row

### Tablet (768px - 1279px)
- [ ] Sidebar colapsable
- [ ] Tables con scroll horizontal
- [ ] Cards en vez de tabla para entidades

### Mobile (< 768px)
- [ ] Bottom navigation
- [ ] Cards apiladas en vez de tablas
- [ ] Gráficos simplificados
- [ ] Formularios full-width

---

## 11. PERMISOS

### 11.1 Permisos del Admin Global

| Permiso | Descripción |
|---------|-------------|
| `admin:read` | Ver dashboard y métricas |
| `admin:entities:manage` | Crear, editar, eliminar entidades |
| `admin:entities:assign` | Asignar admins de entidad |
| `admin:users:manage` | Crear, editar usuarios |
| `admin:config:manage` | Cambiar configuración global |
| `admin:logs:view` | Ver logs de auditoría |

---

## 12. PREGUNTAS PARA CONFIRMAR

1. **Super-admin único:** ¿Hay un solo admin global, o puede haber múltiples con diferentes permisos?
2. **Delegación:** ¿Un admin de entidad puede crear otros admins de su misma entidad?
3. **Eliminación en cascada:** Si se elimina una entidad, ¿qué pasa con sus turnos históricos? ¿Se eliminan o se mantienen como "archivados"?
4. **Impersonation:** ¿El admin global puede "iniciar sesión como" un admin de entidad para troubleshooting?
5. **API keys:** ¿Se proveen API keys para que las entidades integren TuTurno en sus sistemas propios?

---

*Documento generado: Mayo 2026*
*Skills aplicadas: design-taste-frontend, impeccable, emil-design-eng, nuxt, vue-best-practices, responsive-design, real-time-features, websocket-implementation*