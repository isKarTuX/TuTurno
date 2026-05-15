# AUDITORÍA Y PLAN DE MEJORAS — Módulo de Ciudadano TuTurno

> **Proyecto:** TuTurno — Sistema de Gestión de Turnos Digitales
> **Fecha:** Mayo 2026
> **Auditoría:** Módulo de Ciudadano (Registrado + No Registrado)
> **Stack:** Nuxt 3 + Vue 3 + TypeScript + Drizzle ORM + SQLite/Supabase

---

## 1. CONTEXTO DEL PROYECTO

### 1.1 Descripción General

TuTurno es una plataforma digital que elimina las filas físicas en entidades públicas y privadas (EPS, bancos, oficinas administrativas) en Colombia. Los ciudadanos solicitan turnos digitales desde cualquier dispositivo, monitoran su posición en cola en tiempo real y reciben notificaciones push cuando están próximos a ser atendidos.

### 1.2 Tipos de Usuario

| Tipo | Descripción | Acceso |
|------|-------------|--------|
| **Ciudadano Registrado** | Usuario con cuenta completa (email, password, datos completos) | Panel completo, historial, notificaciones |
| **Ciudadano No Registrado** | Solo ingresa con cédula (sin cuenta) | Solo día actual, sin historial, solicitar turnos |
| **Operador** | Gestiona la cola de su punto de atención | Ver ciudadanos incompletos, completar datos |
| **Administrador** | Configura entidades, servicios, operadores | Acceso total |

### 1.3 Flujo Actual del Usuario No Registrado

```
/onboarding/request-turn          → Input: cédula → useTurnSession().setDocument()
  └─> /app/entities               → Lista de entidades
        └─> /app/entities/[id]   → Detalle entidad + servicios
              └─> /app/entities/[id]/[serviceId]
                    └─> ⚠️ PIDE CÉDULA OTRA VEZ (DUPLICADO)
                    └─> POST /api/turns/public
                    └─> turno creado (citizenId: null, documentId: cédula)
                    └─> ❌ NO HAY FORMA DE VER TURNOS POSTERIORES
```

---

## 2. PROBLÉMATICAS CRÍTICAS IDENTIFICADAS

### 2.1 Tabla Resumen de Problemas

| # | Criticidad | Problema | Archivo/Línea | Estado |
|---|------------|----------|---------------|--------|
| 1 | 🔴 CRÍTICO | Duplicación de solicitud de cédula (`/onboarding/request-turn` la pide, luego `[serviceId].vue` la pide otra vez) | `pages/app/entities/[id]/[serviceId].vue:21` | Sin corregir |
| 2 | 🔴 CRÍTICO | Usuario no registrado NO puede ver turnos que solicitó (no existe página pública para ver turnos por cédula) | No existe ruta/pages | Sin corregir |
| 3 | 🔴 CRÍTICO | `pages/app/turns/[id].vue` tiene `middleware: 'auth'` — impide acceso público a turno compartido con QR | `pages/app/turns/[id].vue:5` | Sin corregir |
| 4 | 🔴 CRÍTICO | No hay selector de fecha futura para solicitar turnos (usuarios registrados) | No existe en `[serviceId].vue` | Sin corregir |
| 5 | 🔴 CRÍTICO | `GET /api/turns/by-document` no se usa en ningún cliente — endpoint existe pero huérfano | `server/api/turns/by-document.get.ts` | Sin corregir |
| 6 | 🟡 ALTO | `confirm()` nativo usado para cancelar turno — no es profesional ni consistente con el diseño | `pages/app/turns/[id].vue:47`, `pages/app/turns/index.vue:33` | Sin corregir |
| 7 | 🟡 ALTO | Navbar móvil visible en desktop (>1024px) — debe ocultarse | `layouts/citizen.vue:55`, `AppMobileNav.vue` | Sin corregir |
| 8 | 🟡 ALTO | Sidebar desktop no colapsable, sin perfil expandible ni configuraciones | `components/layout/AppSidebarCitizen.vue` | Sin corregir |
| 9 | 🟡 ALTO | Toast container no tiene auto-dismiss — las notificaciones se quedan "muertas" | `composables/useToast.ts` + `UiToastContainer.vue` | Sin corregir |
| 10 | 🟡 ALTO | EntitySearchBar filter buttons no responden al tema light | `components/entity/EntitySearchBar.vue` | Sin corregir |
| 11 | 🟡 ALTO | Tema toggle (UiThemeToggle) puede no estar funcionando correctamente | `components/ui/UiThemeToggle.vue` + plugin | Sin corregir |
| 12 | 🟡 ALTO | No existe progress bar general / navegación global | No existe componente | Sin corregir |
| 13 | 🟡 ALTO | El operador no puede ver/modificar usuarios creados solo con cédula (incompletos) | Sin endpoint completo | Sin corregir |
| 14 | 🟡 MEDIO | Filtro de entidades "Todas" visible en tema claro con texto oscuro sobre fondo claro | `EntitySearchBar.vue` | Sin corregir |
| 15 | 🟡 MEDIO | Icon set inconsistente — mix de Phosphor (`ph:`) y Lucide (`lucide:`) | Varios componentes | Sin corregir |

---

## 3. ANÁLISIS DETALLADO POR ÁREA

### 3.1 Flujo de Autenticación y Usuarios

#### 3.1.1 Schema de Base de Datos — users

```typescript
// server/db/schema/users.ts
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName: text('full_name').notNull(),           // ❌ Usuario sin cédula NO tiene esto
  documentId: text('document_id').notNull().unique(), // ✅ Lo tiene
  email: text('email').notNull().unique(),         // ❌ Usuario sin cédula NO tiene esto
  phone: text('phone').notNull(),                  // ❌ Usuario sin cédula NO tiene esto
  passwordHash: text('password_hash').notNull(),   // ❌ Usuario sin cédula NO tiene esto
  role: text('role', { enum: ['citizen', 'operator', 'admin'] }).notNull().default('citizen'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  mustChangePassword: integer('must_change_password', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

**Problema:** El schema actual no soporta usuario sin todos los datos. Un usuario "no registrado" con cédula no puede ser representado en la tabla `users` sin violar constraints `NOT NULL`.

**Solución propuesta:** Crear usuario con datos mínimos:
- `fullName = documentId` (temporal)
- `email = documentId + "@pending.tuturno"` (marcado como pendiente)
- `phone = "pending"`
- `passwordHash = null` o hash especial
- `mustChangePassword = true` (fuerza cambio de contraseña al primer login)

#### 3.1.2 Flujo de Login para Usuario Incompleto

```
1. Usuario ingresa con cédula (no tiene cuenta)
2. Sistema verifica si existe user con ese documentId
3. Si existe y mustChangePassword = true:
   └─> Redirigir a /auth/change-password
   └─> Usuario debe crear contraseña
   └─> Completar datos faltantes (fullName, email, phone)
   └─> mustChangePassword = false
4. Si no existe:
   └─> Crear usuario pendiente automáticamente
   └─> Continuar con flujo normal de solicitar turno
```

### 3.2 API Routes — Análisis

| Route | Archivo | Uso Actual | Problema | Prioridad |
|-------|---------|-----------|----------|-----------|
| `POST /api/turns/public` | `server/api/turns/public.post.ts` | ✅ Crear turno sin cuenta | No valida que usuario "pendiente" no exista | ALTA |
| `GET /api/turns/by-document` | `server/api/turns/by-document.get.ts` | ❌ Huérfano (no se usa) | Debería alimentar `/onboarding/my-turns` | CRÍTICA |
| `GET /api/turns/track` | `server/api/turns/track.get.ts` | ❌ No se consume en ningún lugar | Debería alimentar página pública de tracking | CRÍTICA |
| `GET /api/turns/:id` | `server/api/turns/[id].get.ts` | ❌ Con middleware auth | Debe permitir acceso público si se comparte link | CRÍTICA |
| `POST /api/operator/citizens` | `server/api/operator/citizens.post.ts` | ✅ Crear usuario desde operador | No tiene pantalla de uso visible | MEDIA |
| `DELETE /api/turns/:id` | `server/api/turns/[id].delete.ts` | ⚠️ Requiere auth | Usuario no registrado no puede cancelar | ALTA |

### 3.3 Componentes de UI — Problemas de UX/UI

#### 3.3.1 Layout Citizen (`layouts/citizen.vue`)

**Problema 1:** AppMobileNav se muestra en todas las pantallas incluyendo desktop.
```vue
<!-- Línea 55 -->
<AppMobileNav />
```

**Solución:** Aplicar `display: none` en CSS para pantallas `lg` y mayores.

#### 3.3.2 Sidebar Desktop (`AppSidebarCitizen.vue`)

**Problemas:**
- No hay funcionalidad de colapso
- Perfil está en esquina inferior pero no es expandible
- No hay botón de configuración funcional
- Botón de cerrar sesión presente pero sin dropdown menu

**Iconos actuales (Phosphor):**
```typescript
const navItems: NavItem[] = [
  { to: '/app', label: 'Inicio', icon: 'ph:house' },
  { to: '/app/entities', label: 'Entidades', icon: 'ph:buildings' },
  { to: '/app/turns', label: 'Mis Turnos', icon: 'ph:ticket' },
  { to: '/app/profile', label: 'Mi Perfil', icon: 'ph:user' },
  { to: '/app/settings', label: 'Configuración', icon: 'ph:gear' },
]
```

**Cambiar a Lucide:**
```typescript
const navItems: NavItem[] = [
  { to: '/app', label: 'Inicio', icon: 'lucide:home' },
  { to: '/app/entities', label: 'Entidades', icon: 'lucide:building-2' },
  { to: '/app/turns', label: 'Mis Turnos', icon: 'lucide:ticket' },
  { to: '/app/profile', label: 'Mi Perfil', icon: 'lucide:user' },
  { to: '/app/settings', label: 'Configuración', icon: 'lucide:settings' },
]
```

#### 3.3.3 Navbar Móvil (`AppMobileNav.vue`)

**Problemas:**
- Visible en desktop (>1024px)
- Sin iconos (muestra solo texto)
- Posición fija en bottom

**Mejoras:**
- Ocultar en desktop
- Agregar iconos Lucide
- Mantener solo en mobile

#### 3.3.4 EntitySearchBar (`components/entity/EntitySearchBar.vue`)

**Problema:** Los filter chips de tipo no se adaptan al tema light.

```vue
<!-- Línea 18-24 — Colores hardcodeados -->
const types = [
  { value: '', label: 'Todas', gradient: 'from-gray-500/20 to-gray-600/10' },
  { value: 'eps', label: 'EPS', gradient: 'from-rose-500/20 to-pink-500/10' },
  { value: 'bank', label: 'Banco', gradient: 'from-blue-500/20 to-indigo-500/10' },
  { value: 'public_office', label: 'Oficina', gradient: 'from-amber-500/20 to-orange-500/10' },
  { value: 'other', label: 'Otro', gradient: 'from-violet-500/20 to-purple-500/10' },
]
```

**Solución:** Usar variables CSS (`--color-primary`) en lugar de colores hardcodeados.

### 3.4 Sistema de Toast/Notificaciones

#### 3.4.1 useToast (`composables/useToast.ts`)

**Problema:** No hay duración ni auto-dismiss.

```typescript
// Estado actual — sin duration
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])
  
  function add(toast: Omit<Toast, 'id'>) {
    toasts.value.push({ ...toast, id: crypto.randomUUID() })
  }
  
  function remove(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  
  // ❌ Falta: autoRemove con setTimeout
}
```

#### 3.4.2 UiToastContainer (`components/toast/UiToastContainer.vue`)

**Problema:** No hay auto-dismiss, las notificaciones quedan "muertas" en pantalla.

### 3.5 Tema (Light/Dark)

#### 3.5.1 UiThemeToggle

**Problema potencial:** El toggle de tema puede no funcionar correctamente en todas las páginas.

```vue
<!-- components/ui/UiThemeToggle.vue -->
<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
</script>
```

Verificar que el plugin `theme.client.ts` esté configurado correctamente.

---

## 4. SCHEMA DE USUARIO INCOMPLETO (SOLUCIÓN PROPUESTA)

### 4.1 Flujo de Registro Automático de Usuario No Registrado

```
1. Usuario entra a /onboarding/request-turn
2. Ingresa cédula
3. Sistema verifica si existe user con ese documentId
   └─> SI existe:
       └─> ¿mustChangePassword = true?
           └─> SI → Redirigir a /auth/change-password
           └─> NO → Continuar normalmente
   └─> NO existe:
       └─> Crear usuario "pendiente" automáticamente:
           {
             fullName: documentId,
             documentId: cedula,
             email: "${cedula}@pending.tuturno",
             phone: "pending",
             passwordHash: null,
             role: 'citizen',
             mustChangePassword: true
           }
       └─> Guardar en useTurnSession() el userId generado
4. Continuar al flujo normal de solicitud de turnos
```

### 4.2 Cambio de Contraseña Obligatorio

```
1. Usuario con mustChangePassword = true intenta login
2. Sistema detecta flag y redirige a /auth/change-password
3. Página pide nueva contraseña (mín. 8 chars)
4.同时更新用户资料: fullName, email, phone
5. mustChangePassword = false
6. Continuar a /app
```

### 4.3 API Routes a Crear/Modificar

** NUEVA: `POST /api/auth/register-simple`** (para usuarios pendientes)
** MODIFICAR: `POST /api/auth/login`** (detectar mustChangePassword)
** MODIFICAR: `POST /api/turns/public`** (crear usuario pendiente si no existe)

---

## 5. PLAN DE IMPLEMENTACIÓN

### FASE 1: Corrección de Flujo de Cédula Duplicada + Date Picker

**Archivos a modificar:**
- `pages/app/entities/[id]/[serviceId].vue`
- `composables/useTurnSession.ts`

**Cambios:**
1. En `[serviceId].vue`, leer la cédula de `useTurnSession()` como fuente primaria
2. Si `sessionDocumentId` existe, no mostrar el input de cédula
3. Si no existe, mostrar input pero guardar en session para uso posterior
4. Agregar date picker para usuarios autenticados (días posteriores)

---

### FASE 2: Página Pública de Mis Turnos (Sin Cuenta)

**Archivos a crear:**
- `pages/onboarding/my-turns.vue` (nuevo)
- `composables/useDocumentTurns.ts` (nuevo)

**Flujo:**
```
/onboarding/my-turns
  └─> Input: cédula
  └─> GET /api/turns/by-document?documentId=
  └─> Muestra turnos activos (waiting/called/attending)
  └─> Solo día actual — turnos para días posteriores se bloquean
```

**Funcionalidades:**
- Ver turnos activos sin cuenta
- Ver posición en cola
- Botón "Registrarme para más funciones" (CTA)
- Los turnos solo son visibles para el día actual

---

### FASE 3: Página de Seguimiento Público por Documento

**Archivos a crear:**
- `pages/onboarding/track.vue` (nuevo)

**Flujo:**
```
/onboarding/track
  └─> Input: cédula + número de turno (o solo cédula)
  └─> GET /api/turns/track?documentId=&turnNumber=
  └─> Muestra estado actual + posición
```

---

### FASE 4: Acceso Público a Turnos Compartidos (QR)

**Archivos a modificar:**
- `pages/app/turns/[id].vue`
- `server/api/turns/[id].get.ts`
- `server/api/turns/[id].delete.ts`
- `server/middleware/auth.ts`

**Nueva ruta:**
- `pages/onboarding/turn/[turnNumber].vue` — muestra turno por número (sin auth)
- `GET /api/turns/public-turn?turnNumber=&documentId=` — retorna turno público

---

### FASE 5: Selector de Fecha para Días Posteriores

**Archivos a modificar:**
- `pages/app/entities/[id]/[serviceId].vue`
- `server/api/turns/index.post.ts`
- `schemas/turn.schema.ts`

**Cambios:**
1. Agregar `requestedDate` (fecha del turno) al schema Zod
2. En `[serviceId].vue`, agregar date picker para usuarios autenticados
3. No autenticados → solo día actual
4. En API, validar que fecha no sea pasado

---

### FASE 6: Mejora de Navigation — Responsive y Sidebar

**Archivos a modificar:**
- `layouts/citizen.vue`
- `components/layout/AppSidebarCitizen.vue`
- `components/layout/AppMobileNav.vue`

**6.1 AppMobileNav — Ocultar en desktop:**
```css
/* AppMobileNav.vue */
@media (min-width: 1024px) {
  nav { display: none !important; }
}
```

**6.2 AppSidebarCitizen — Completar con iconos + collapse + perfil:**
- Colapsar con animación (width 64px → 260px)
- Iconos Lucide consistentes (reemplazar `ph:` por `lucide:`)
- Perfil expandible en esquina inferior
- Menú: Inicio, Entidades, Turnos, Perfil, Configuración, Cerrar Sesión
- Agregar `isCollapsed` state
- User menu dropdown con: Perfil, Configuración, Cambiar Tema, Cerrar Sesión

---

### FASE 7: Notifications / Toast — Auto-dismiss

**Archivos a modificar:**
- `composables/useToast.ts`
- `components/toast/UiToastContainer.vue`

**Cambios:**
1. Agregar `duration` a cada toast (default: 4000ms)
2. Agregar `autoRemove` con `setTimeout` en `useToast()`
3. Toast container hacer dismiss automático basado en duración
4. Agregar `personalized` flag — si `true`, mostrar con nombre de usuario
5. Notifications de "Bienvenido de nuevo" deben usar `personalized: true`

---

### FASE 8: EntitySearchBar — Adaptación a Tema Light

**Archivos a modificar:**
- `components/entity/EntitySearchBar.vue`

**Cambios:**
1. Los filter chips deben usar variables CSS, no colores hardcodeados
2. En tema light, los botones deben tener texto oscuro legible
3. Aplicar glass classes consistentemente

---

### FASE 9: Progress Bar Global / Navegación

**Archivos a crear:**
- `components/layout/AppProgressNav.vue` (nuevo)

**Diseño:**
- Barra horizontal sutil en la parte superior
- Lila claro (`--color-primary` con opacidad baja)
- Muestra el progreso de pasos en flows multi-página
- Minimalista, no intrusiva
- Se adapta al tema (oscuro/claro)

---

### FASE 10: Modal de Confirmación Personalizado

**Archivos a crear:**
- `components/ui/UiConfirmModal.vue` (nuevo)

**Reemplazos:**
- `pages/app/turns/[id].vue` — `handleCancel`
- `pages/app/turns/index.vue` — `cancelTurn`

**Diseño:**
- Mismo glass aesthetic del app
- Título, mensaje, botones Cancelar/Confirmar
- Animación fade + scale
- backdrop blur

---

### FASE 11: Operador — Gestión de Usuarios Incompletos

**Archivos a modificar:**
- `pages/operator/index.vue` (o crear `pages/operator/citizens.vue`)
- `server/api/operator/citizens.post.ts` (ya existe)
- `server/api/operator/update-citizen.patch.ts` (nuevo)

**Funcionalidades:**
- Operador puede ver lista de ciudadanos incompletos (email pendiente, sin password)
- Operador puede completar/editar datos del usuario
- Operador ve cédula y puede buscar por cédula
- Crear usuario "pendiente" con `mustChangePassword: true`
- El ciudadano recibe notificación para cambiar contraseña

---

### FASE 12: Registro de Usuario desde Operador + Cambio de Contraseña

**Archivos a modificar:**
- `pages/auth/change-password.vue` (verificar que exista y funcione)
- `server/api/auth/change-password.post.ts`

**Flujo:**
1. Operador crea usuario incompleto con cédula
2. Sistema genera contraseña temporal o deja `mustChangePassword: true`
3. Cuando usuario intenta login con esa cédula, se redirige a `/auth/change-password`
4. Debe cambiar contraseña antes de continuar

---

### FASE 13: Icon Set — Unificación a Lucide

**Reemplazos en:**
- `AppSidebarCitizen.vue` — `ph:house` → `lucide:home`
- `AppMobileNav.vue` — `ph:house` → `lucide:home`
- Varios componentes que usan `ph:` deben migrar a `lucide:`

---

## 6. RESUMEN DE ARCHIVOS A MODIFICAR/CREAR

### Archivos a CREAR:

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| `pages/onboarding/my-turns.vue` | Ver turnos activos por cédula (sin cuenta) | CRÍTICA |
| `pages/onboarding/track.vue` | Tracking por número de turno | ALTA |
| `pages/onboarding/turn/[turnNumber].vue` | Seguimiento público por número de turno | ALTA |
| `composables/useDocumentTurns.ts` | Fetch de turnos por documento | CRÍTICA |
| `components/ui/UiConfirmModal.vue` | Modal confirmación custom | ALTA |
| `components/layout/AppProgressNav.vue` | Barra de progreso global | MEDIA |
| `server/api/turns/public-turn.get.ts` | GET turno público por número | ALTA |
| `server/api/operator/update-citizen.patch.ts` | Actualizar ciudadano por operador | MEDIA |
| `pages/operator/citizens.vue` | Panel de gestión de ciudadanos | ALTA |

### Archivos a MODIFICAR:

| Archivo | Cambio | Prioridad |
|---------|--------|-----------|
| `pages/app/entities/[id]/[serviceId].vue` | Eliminar input cédula duplicado, agregar date picker | CRÍTICA |
| `pages/app/turns/[id].vue` | Quitar middleware auth, usar confirm modal | CRÍTICA |
| `pages/app/turns/index.vue` | Usar confirm modal | ALTA |
| `components/layout/AppMobileNav.vue` | Ocultar en lg+, agregar iconos lucide | ALTA |
| `components/layout/AppSidebarCitizen.vue` | Collapse, perfil expandible, iconos lucide | ALTA |
| `components/entity/EntitySearchBar.vue` | Adaptar a tema light | ALTA |
| `components/toast/UiToastContainer.vue` | Auto-dismiss, personalización | MEDIA |
| `composables/useToast.ts` | Duration, autoRemove | MEDIA |
| `composables/useTurnSession.ts` | Agregar métodos necesarios | MEDIA |
| `layouts/citizen.vue` | Fix responsive navbar | MEDIA |
| `server/api/turns/public.post.ts` | Soportar fecha futura | ALTA |
| `server/api/turns/by-document.get.ts` | Asegurar que funciona correctamente | CRÍTICA |
| `schemas/turn.schema.ts` | Agregar `requestedDate` | ALTA |
| `server/api/auth/login.post.ts` | Detectar mustChangePassword | ALTA |
| `pages/auth/login.vue` | Agregar "ingresar con cédula" | CRÍTICA |

---

## 7. ORDEN DE IMPLEMENTACIÓN

```
1. 🔴 FASE 1 (Cédula duplicada) + FASE 5 (Date picker)
   └─> Eliminar duplicación de input cédula
   └─> Agregar selector de fecha futura para usuarios registrados

2. 🔴 FASE 2 (Página mis turnos sin cuenta)
   └─> Crear useDocumentTurns.ts
   └─> Crear pages/onboarding/my-turns.vue

3. 🔴 FASE 4 (Acceso público turnos compartidos)
   └─> Crear GET /api/turns/public-turn
   └─> Crear pages/onboarding/turn/[turnNumber].vue
   └─> Modificar [id].vue para permitir acceso público

4. 🔴 FASE 3 (Tracking público)
   └─> Crear pages/onboarding/track.vue
   └─> Conectar con GET /api/turns/track

5. 🟡 FASE 6 (Navbar responsive + sidebar)
   └─> Fix AppMobileNav en desktop
   └─> Mejorar AppSidebarCitizen con collapse y perfil
   └─> Unificar iconos a Lucide

6. 🟡 FASE 10 (Confirm modal)
   └─> Reemplazar window.confirm() con UiConfirmModal

7. 🟡 FASE 7 (Toast auto-dismiss)
   └─> Agregar duration a useToast
   └─> Implementar auto-dismiss

8. 🟡 FASE 8 (EntitySearchBar tema light)
   └─> Usar variables CSS en lugar de colores hardcodeados

9. 🟡 FASE 9 (Progress bar global)
   └─> Crear AppProgressNav.vue

10. 🟡 FASE 13 (Iconos Lucide)
    └─> Unificar todos los iconos a Lucide

11. 🟡 FASE 11 (Operador gestión usuarios)
    └─> Crear pages/operator/citizens.vue
    └─> Crear PATCH /api/operator/update-citizen

12. 🟡 FASE 12 (Cambio contraseña obligatorio)
    └─> Verificar change-password.vue
    └─> Implementar flujo completo
```

---

## 8. VALIDACIONES REQUERIDAS ANTES DE COMMIT

- [ ] TypeScript sin errores (`npm run typecheck`)
- [ ] ESLint sin warnings (`npm run lint`)
- [ ] No hay `console.log` en código de producción
- [ ] No hay `any` types nuevos
- [ ] Las nuevas rutas de API tienen validación Zod
- [ ] Las nuevas rutas protegidas tienen middleware de auth (donde aplique)
- [ ] Los nuevos componentes están tipados con `defineProps<Props>()`
- [ ] No se commitea el archivo `.env`
- [ ] Las migraciones de DB se generaron después de cambiar el schema
- [ ] Los índices necesarios fueron creados para queries frecuentes
- [ ] Responsive funciona en 320px, 768px, 1024px, 1440px
- [ ] Tema claro/oscuro funciona correctamente en todas las páginas
- [ ] Los toasts tienen auto-dismiss configurado
- [ ] El modal de confirmación se muestra en lugar de `window.confirm()`

---

## 9. CHECKLIST DE PRUEBAS

### 9.1 Pruebas de Usuario No Registrado

- [ ] Puede ingresar con cédula en `/onboarding/request-turn`
- [ ] No se le pide la cédula otra vez en `[serviceId].vue`
- [ ] Puede solicitar turno para día actual
- [ ] Puede ver sus turnos activos en `/onboarding/my-turns`
- [ ] Puede compartir turno vía link/QR
- [ ] Al abrir link compartido, ve el turno sin auth

### 9.2 Pruebas de Usuario Registrado

- [ ] Puede seleccionar fecha futura al solicitar turno
- [ ] Puede ver historial completo en `/app/turns`
- [ ] Puede cancelar turnos propios
- [ ] Al compartir turno, receptor ve info sin login

### 9.3 Pruebas de Operador

- [ ] Ve lista de ciudadanos incompletos
- [ ] Puede buscar ciudadano por cédula
- [ ] Puede completar datos de ciudadano
- [ ] Puede cambiar contraseña de ciudadano

### 9.4 Pruebas de UI/UX

- [ ] Sidebar se colapsa en desktop
- [ ] Navbar móvil no visible en desktop
- [ ] Iconos son consistentes (Lucide)
- [ ] Tema toggle funciona en todas las páginas
- [ ] Toasts se dismiss automáticamente
- [ ] Modal de confirmación es profesional
- [ ] Filtro de entidades funciona en tema claro
- [ ] Progress bar global visible y funcional

---

*Documento generado para el proyecto TuTurno — Universidad de Córdoba*
*Estudiantes: Keyner Ramírez Ramos – Bibiana Herrera Martínez*
*Mayo 2026*
