# Catálogo de Componentes — TuTurno

---

## UI Base

### UiButton

```typescript
interface Props {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}
```

**Uso:**
```vue
<UiButton variant="primary" size="md" :loading="isSubmitting" @click="handleSubmit">
  <template #icon-left>
    <Icon name="Search" />
  </template>
  Buscar
</UiButton>
```

**Variantes:**
- `primary`: Fondo violeta con glow sutil
- `outline`: Borde semitransparente, fondo transparente
- `ghost`: Sin borde, fondo transparente

**Estados:** default, hover, active, disabled, loading

---

### UiInput

```typescript
interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}
```

**Uso:**
```vue
<UiInput
  v-model="email"
  type="email"
  label="Email"
  placeholder="tu@email.com"
  :error="errors.email"
  required
/>
```

**Estados:** default, focus, error, disabled

---

### UiCard

```typescript
interface Props {
  variant?: 'default' | 'glass' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}
```

**Uso:**
```vue
<UiCard variant="glass" padding="md" hoverable>
  <template #header>
    <h3>Título</h3>
  </template>
  Contenido
</UiCard>
```

---

### UiBadge

```typescript
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean   // Muestra un punto en lugar de texto
}
```

**Uso:**
```vue
<UiBadge variant="success" size="md">
  Activo
</UiBadge>
```

---

### UiModal

```typescript
interface Props {
  modelValue: boolean  // v-model
  title?: string
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}
```

**Uso:**
```vue
<UiModal v-model="showModal" title="Confirmar acción" size="md">
  ¿Estás seguro de continuar?
  <template #footer>
    <UiButton variant="ghost" @click="showModal = false">Cancelar</UiButton>
    <UiButton variant="primary" @click="confirm">Confirmar</UiButton>
  </template>
</UiModal>
```

**Estados:** closed, opening (animation), open, closing (animation)

---

### UiSkeleton

```typescript
interface Props {
  variant?: 'text' | 'rect' | 'circle'
  width?: string
  height?: string
  lines?: number  // Para variant='text'
}
```

**Uso:**
```vue
<UiSkeleton variant="rect" width="100%" height="200px" />
<UiSkeleton variant="text" :lines="3" />
<UiSkeleton variant="circle" width="48px" height="48px" />
```

---

### UiSpinner

```typescript
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
```

---

### UiProgressBar

```typescript
interface Props {
  value: number      // 0-100
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  showLabel?: boolean
}
```

---

## Layout

### AppNavbar

Navbar principal de la app (no landing).

```typescript
interface Props {
  showMenu?: boolean
}
```

**Estados:**
- Logged out: solo logo + links públicos
- Citizen: logo + nav citizen + avatar
- Operator: logo + nav operator + avatar
- Admin: logo + nav admin + avatar

---

### AppSidebar

Sidebar para panels operator y admin.

```typescript
interface Props {
  collapsed?: boolean
}
```

---

### AppMobileNav

Bottom navigation para móvil (layout citizen).

```typescript
interface Props {
  activeRoute?: string
}
```

**Rutas:** Inicio, Turnos, Entidades, Perfil

---

## Turno

### TurnCard

```typescript
interface Props {
  turn: Turn & { entity: Entity, service: Service }
  showActions?: boolean
}

interface Emits {
  (e: 'cancel', turnId: string): void
}
```

**Uso:**
```vue
<TurnCard :turn="turn" show-actions @cancel="handleCancel" />
```

**Estados visuales por status:**
- `waiting`: borde violeta, badge violeta
- `called`: borde ámbar, badge ámbar, glow
- `attending`: borde azul, badge azul
- `completed`: borde verde, badge verde
- `no_show`: borde rojo, badge rojo
- `cancelled`: borde gris, badge gris

---

### TurnTicket

```typescript
interface Props {
  turn: Turn
  showQR?: boolean  // default true
}
```

**Contenido:**
- Número de turno grande (flip animation)
- Nombre del servicio
- Entidad
- Fecha y hora
- QR code
- Posición en cola
- Estado actual

---

### TurnStatusBadge

```typescript
interface Props {
  status: 'waiting' | 'called' | 'attending' | 'completed' | 'no_show' | 'cancelled'
  size?: 'sm' | 'md' | 'lg'
}
```

**Colores:** waiting=violeta, called=ámbar, attending=azul, completed=verde, no_show=rojo, cancelled=gris

---

### TurnTracker

Widget de seguimiento en tiempo real.

```typescript
interface Props {
  turn: Turn
}

interface Emits {
  (e: 'called'): void
  (e: 'attending'): void
}
```

**Estados animados:**
- `waiting`: número con glow violeta pulsante
- `called`: transición a ámbar + toast
- `attending`: transición a azul
- `completed`: check verde

---

### TurnProgressBar

```typescript
interface Props {
  currentPosition: number
  totalWaiting: number
  avgAttentionTime: number
}
```

**Cálculos:**
- `% = ((totalWaiting - currentPosition + 1) / totalWaiting) * 100`
- `estimatedMinutes = currentPosition * avgAttentionTime`

---

### TurnCounterDisplay

```typescript
interface Props {
  number: string   // "A-047"
  size?: 'md' | 'lg' | 'xl'
}
```

**Animación:** flip-in al cambiar el número

---

### TurnHistoryItem

```typescript
interface Props {
  turn: Turn
}
```

**Para timeline de estados.**

---

## Entidad

### EntityCard

```typescript
interface Props {
  entity: Entity
  showServices?: boolean
}
```

---

### EntitySearchBar

```typescript
interface Props {
  modelValue: { search?: string, type?: string }
}

interface Emits {
  (e: 'update:modelValue', value: { search?: string, type?: string }): void
  (e: 'search'): void
}
```

---

### EntityServiceList

```typescript
interface Props {
  services: Service[]
  entityId: string
}
```

---

### EntityMap

```typescript
interface Props {
  latitude: number
  longitude: number
  zoom?: number
}
```

**Usa Leaflet o similar lightweight.**

---

## Operador

### OperatorQueue

```typescript
interface Props {
  serviceId: string
}
```

**Lista de turnos waiting con acciones.**

---

### OperatorCurrentTurn

```typescript
interface Props {
  turn: Turn | null
}
```

**Turno activo en grande con controles.**

---

### OperatorControls

```typescript
interface Props {
  turn: Turn
  isFirst?: boolean
}

interface Emits {
  (e: 'call-next'): void
  (e: 'complete'): void
  (e: 'no-show'): void
}
```

**Botones:** "Llamar siguiente", "Atender", "No se presentó"

---

### OperatorStats

```typescript
interface Props {
  serviceId: string
}
```

**Métricas en tiempo real.**

---

## Admin

### AdminMetricCard

```typescript
interface Props {
  title: string
  value: number | string
  change?: number      // % change
  icon?: LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'danger'
}
```

---

### AdminEntityForm

```typescript
interface Props {
  entity?: Entity
  mode: 'create' | 'edit'
}
```

---

### AdminServiceForm

```typescript
interface Props {
  service?: Service
  entityId: string
  mode: 'create' | 'edit'
}
```

---

### AdminOperatorAssign

```typescript
interface Props {
  operator?: Operator
}
```

---

### AdminReportsChart

```typescript
interface Props {
  type: 'bar' | 'doughnut' | 'line'
  data: ChartData
  title?: string
}
```

---

## Landing

### LandingHero

### LandingHowItWorks

### LandingForEntities

### LandingRealTime

### LandingMetrics

### LandingCTA
