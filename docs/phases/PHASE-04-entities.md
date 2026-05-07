# PHASE-04 — Entidades y Servicios

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 4
Depende de: PHASE-01, PHASE-02, PHASE-03
Tiempo estimado: 60 min
```

---

## 1. Objetivo

Implementar el CRUD completo de entidades y servicios, con paginación, búsqueda y control de acceso por roles.

---

## 2. Endpoints de Entidades

### GET /api/entities

```typescript
// Query params
{
  page?: number,      // default 1
  perPage?: number,   // default 20
  search?: string,    // búsqueda por nombre
  type?: 'eps' | 'bank' | 'public_office' | 'other'
}

// Response 200
{
  success: true,
  data: Entity[],
  meta: { total: number, page: number, perPage: number }
}
```

**Auth requerida:** No (público)

---

### GET /api/entities/[id]

```typescript
// Response 200
{
  success: true,
  data: Entity & { services: Service[] }
}

// Response 404
{
  success: false,
  error: { code: 'NOT_FOUND', message: 'Entidad no encontrada' }
}
```

**Auth requerida:** No (público)

---

### POST /api/entities

```typescript
// Request body
{
  name: string,
  type: 'eps' | 'bank' | 'public_office' | 'other',
  address: string,
  city: string,
  latitude?: number,
  longitude?: number,
  phone?: string,
  email?: string,
  logoUrl?: string
}

// Response 201
{
  success: true,
  data: Entity
}
```

**Auth requerida:** Sí (admin)

---

### PATCH /api/entities/[id]

```typescript
// Request body (parcial)
{
  name?: string,
  address?: string,
  isActive?: boolean,
  // ... cualquier campo actualizable
}

// Response 200
{
  success: true,
  data: Entity
}
```

**Auth requerida:** Sí (admin)

---

## 3. Endpoints de Servicios

### GET /api/services

```typescript
// Query params
{
  entityId?: string,
  isActive?: boolean
}

// Response 200
{
  success: true,
  data: Service[]
}
```

**Auth requerida:** No (público)

---

### GET /api/services/[id]

```typescript
// Response 200
{
  success: true,
  data: Service & { entity: Entity, operators: Operator[] }
}
```

**Auth requerida:** No (público)

---

### GET /api/services/[id]/queue

```typescript
// Response 200
{
  success: true,
  data: {
    service: Service,
    currentTurn: Turn | null,
    queue: Turn[],
    waitingCount: number,
    avgAttentionTime: number,
    estimatedWaitMinutes: number
  }
}
```

**Auth requerida:** No (público)

---

### POST /api/services

```typescript
// Request body
{
  entityId: string,
  name: string,
  description?: string,
  avgAttentionTime?: number,   // default 5
  openTime?: string,           // default '08:00'
  closeTime?: string           // default '17:00'
}

// Response 201
{
  success: true,
  data: Service
}
```

**Auth requerida:** Sí (admin)

---

### PATCH /api/services/[id]

```typescript
// Request body (parcial)
{
  name?: string,
  isPaused?: boolean,
  isActive?: boolean,
  avgAttentionTime?: number,
  openTime?: string,
  closeTime?: string
}

// Response 200
{
  success: true,
  data: Service
}
```

**Auth requerida:** Sí (admin)

---

## 4. Guards de Acceso

| Recurso | Citizen | Operator | Admin |
|---------|---------|----------|-------|
| Listar entidades | ✓ | ✓ | ✓ |
| Ver entidad | ✓ | ✓ | ✓ |
| Crear entidad | ✗ | ✗ | ✓ |
| Editar entidad | ✗ | ✗ | ✓ |
| Listar servicios | ✓ | ✓ | ✓ |
| Ver cola | ✓ | ✓ | ✓ |
| Pausar servicio | ✗ | ✗ | ✓ |
| Crear/editar servicio | ✗ | ✗ | ✓ |

---

## 5. Componentes a Crear

### EntityCard.vue

```typescript
interface Props {
  entity: Entity
  showServices?: boolean   // default false
}
```

**Estados:** default, hover (glass-hover)

---

### EntitySearchBar.vue

```typescript
interface Props {
  modelValue: { search?: string, type?: string }
}

interface Emits {
  (e: 'update:modelValue', value: { search?: string, type?: string }): void
  (e: 'search'): void
}
```

**Características:**
- Input de búsqueda con debounce 300ms
- Select de tipo de entidad
- Botón de buscar

---

### EntityServiceList.vue

```typescript
interface Props {
  services: Service[]
  currentTurnId?: string   // para resaltar el turno activo
}
```

**Estados:** vacío, loading (skeleton), con datos

---

## 6. Páginas a Crear

### /app/entities/index.vue

- Lista de entidades con paginación
- SearchBar integrado
- EntityCards en grid responsive
- Estado vacío con ilustración

### /app/entities/[id]/index.vue

- Header con logo, nombre, dirección
- Mapa con ubicación (si hay lat/lng)
- EntityServiceList con horarios
- Botón "Solicitar turno" por cada servicio

### /admin/entities/index.vue

- Tabla con todas las entidades
- Acciones: editar, activar/desactivar
- Botón "Nueva entidad"

### /admin/entities/new.vue y /admin/entities/[id].vue

- Formulario completo de entidad
- Validación Zod
- Preview del logo

---

## 7. Criterios de Éxito

- [ ] Entidades son consultables sin autenticación
- [ ] Búsqueda por nombre funciona con debounce
- [ ] Filtro por tipo funciona
- [ ] Detalle de entidad muestra servicios relacionados
- [ ] Solo admin puede crear/editar entidades
- [ ] Servicios incluyen horarios y tiempo promedio de atención
- [ ] La cola en tiempo real se actualiza (Phase 6)
