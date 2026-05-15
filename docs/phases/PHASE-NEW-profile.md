# PHASE-NEW — Perfil de Usuario y Configuración

```
Estado: ✅ Completo
Agente responsable: Claude Code
Depende de: PHASE-03 (Auth)
Tiempo estimado: 45 min
Completado: 2025-01-13
```

---

## 1. Objetivo

Implementar la gestión de perfil del ciudadano (actualizar datos, cambiar contraseña) y la configuración de notificaciones push.

---

## 2. Páginas

### /app/profile

- Muestra información del usuario (nombre, email, cédula, teléfono)
- Botón para editar campos editables
- Enlace a configuración avanzada
- Botón de cerrar sesión

### /app/settings

- Selector de tema (light/dark/system) - preparado para futuro
- Configuración de notificaciones push
- Preferencias de idioma (preparado para i18n)

---

## 3. Componentes

### ProfileCard.vue

```typescript
interface Props {
  user: User   // del auth store
}

interface Emits {
  (e: 'update', field: string, value: string): void
}
```

**Funcionalidades:**
- Muestra avatar (iniciales del nombre)
- Muestra nombre, email, cédula, teléfono
- Campos editables con inline edit o modal
- Usa `PATCH /api/users/profile` para actualizar

### NotificationSettings.vue

```typescript
// Estados del permiso de notificaciones
const permission = ref<NotificationPermission>('default')

// Funcionalidades:
const { isSupported, permission, requestPermission, subscribe } = useNotifications()
```

**Funcionalidades:**
- Muestra estado actual de permiso
- Botón para solicitar permiso (si no ha sido denegado)
- Muestra si ya está suscrito
- Botón para darse de baja de notificaciones

---

## 4. Endpoints

### PATCH /api/users/profile

```typescript
// Request body (parcial)
{
  fullName?: string,
  phone?: string
}

// Response 200
{
  success: true,
  data: { user: User }
}
```

**Auth requerida:** Sí (ciudadano - solo sus propios datos)

---

## 5. Criterios de Éxito

- [ ] Usuario puede ver su información de perfil
- [ ] Usuario puede actualizar nombre y teléfono
- [ ] Notificaciones pueden activarse/desactivarse
- [ ] Logout funciona correctamente
- [ ] Solo el propio usuario puede modificar su perfil

---

## 6. Notas de Implementación

- La página /app/profile existe en `pages/app/profile.vue`
- Los componentes ProfileCard y NotificationSettings existen en `components/profile/`
- El endpoint PATCH `/api/users/profile` está implementado en `server/api/users/profile.patch.ts`
- El logout llama a `POST /api/auth/logout` y limpia el store