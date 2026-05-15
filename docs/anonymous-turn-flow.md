# Flujo de Turnos Anónimos - TuTurno

> Documentación del flujo que permite solicitar turnos sin necesidad de registro previo.

---

## 1. Concepto

**Problema:** Los usuarios deben poder solicitar turnos sin crear una cuenta, especialmente personas mayores que les resulta difícil completar procesos de registro digitales.

**Solución:** Flujo anónimo donde el usuario solo ingresa su número de cédula para solicitar turno. La cuenta es opcional y ofrece beneficios adicionales.

---

## 2. Flujo de Usuario

### 2.1 Flujo Anónimo (Sin Cuenta)

```
Landing → "Solicitar mi turno" → Ingresa Cédula → /app/entities → Selecciona Entidad → Selecciona Servicio
 → Solicitar → Recibe Turno → Opción de crear cuenta después
```

**Pasos:**
1. Usuario llega a la landing y oprime "Solicitar mi turno"
1.5 Ingresa Cédula¿
2. Redirige a `/app/entities` para seleccionar entidad
3. Selecciona entidad → ve servicios
4. Selecciona servicio → ve formulario con:
   - botón "Solicitar" lado a lado
   - Validación en tiempo real (5-20 dígitos)
5. Al solicitar → API `/api/turns/public` guarda `documentId` en `turns.documentId`
6. Muestra turno y posición
7. Sugiere crear cuenta para notificaciones

### 2.2 Flujo Autenticado (Con Cuenta)

```
Landing → "Iniciar sesión" → /auth/login → Dashboard
→ Selecciona Entidad → Servicio → Solicitar → Turno asociado a usuario
```

**Diferencias:**
- Turno se asocia a `citizenId` (ID de usuario)
- Puede ver historial completo en `/app/turns`
- Recibe notificaciones push
- No necesita ingresar cédula cada vez

---

## 3. Archivos Involucrados

### 3.1 Schema de Base de Datos

**`server/db/schema/turns.ts`**
- `documentId`: columna opcional (puede ser `null`)
- Permite guardar cédula sin necesidad de cuenta

```typescript
documentId: text('document_id')  // nullable
citizenId: text('citizen_id').references(() => users.id)  // puede ser null
```

### 3.2 API Routes

**`server/api/turns/public.post.ts`** - Crear turno sin auth
- Valida `serviceId` y `documentId`
- Genera número de turno secuencial
- Guarda `citizenId: null` y `documentId` en tabla

**`server/api/turns/by-document.get.ts`** - Buscar turnos por cédula
- Busca por `documentId` directamente
- Retorna turnos activos del usuario anónimo

### 3.3 Páginas

| Archivo | Descripción |
|---------|-------------|
| `pages/app/entities/[id]/[serviceId].vue` | Formulario de solicitud con input + botón |
| `pages/onboarding/request-turn.vue` | Página tutorial para solicitar turno |
| `pages/auth/register.vue` | Registro con cuenta |
| `pages/auth/login.vue` | Login |

### 3.4 Componentes

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `SearchByDocument.vue` | `components/citizen/` | Búsqueda por cédula en landing |
| `TurnResults.vue` | `components/citizen/` | Muestra resultado de búsqueda |

---

## 4. Validación de Cédula

```typescript
// Validación en cliente (service page)
function validateDocument(): boolean {
  const cleanDoc = documentId.value.replace(/\D/g, '')
  if (cleanDoc.length < 5 || cleanDoc.length > 20) {
    documentError.value = 'Ingresa un número de cédula válido (5-20 dígitos)'
    return false
  }
  documentError.value = ''
  return true
}
```

```typescript
// Validación en API (Zod schema)
export const createTurnPublicSchema = z.object({
  serviceId: z.string().uuid(),
  documentId: z.string().min(5, 'Ingresa un número de cédula válido').max(20),
})
```

---

## 5. Estados del Turno

| Estado | Descripción | Color |
|--------|-------------|-------|
| `waiting` | En cola esperando | Violeta |
| `called` | Siendo llamado | Ámbar |
| `attending` | En atención | Azul |
| `completed` | Atendido | Verde |
| `no_show` | No asistió | Rojo |
| `cancelled` | Cancelado | Gris |

---

## 6. WebSocket y Notificaciones

Para turnos anónimos (`citizenId` es `null`):
- **No reciben notificaciones push** (no hay endpoint)
- **Pueden ver estado en tiempo real** desde la página de seguimiento
- **Se muestran en búsqueda por cédula** (`/api/turns/by-document`)

### Notificaciones - Lógica Condicional

```typescript
// server/routes/_ws/turns.ts
if (nextTurn.citizenId) {
  notifyTurnCalled(nextTurn.citizenId, ...)
}
if (turnSoon.citizenId) {
  notifyTurnSoon(turnSoon.citizenId, ...)
}
```

Solo envía push si el turno tiene `citizenId` (usuario autenticado).

---

## 7. UI - Diseño del Formulario

### Servicio Page (Mobile-First)

```
┌─────────────────────────────────┐
│ ← Servicios                     │
│                                 │
│ Afiliaciones                    │
│ Descripción del servicio...     │
│                                 │
│ ┌─────────────────────────────┐  │
│ │ Tiempo promedio: 10 min   │  │
│ │ Horario: 07:00 - 17:00    │  │
│ └─────────────────────────────┘  │
│                                 │
│ Ingresa tu cédula para          │
│ solicitar tu turno              │
│ ┌─────────────┬───────────┐     │
│ │ 12345678    │ Solicitar │     │
│ └─────────────┴───────────┘     │
│                                 │
│ ¿Ya tienes cuenta? Inicia sesión │
└─────────────────────────────────┘
```

### Confirmación de Turno

```
┌─────────────────────────────────┐
│ Tu turno es                     │
│                                 │
│           A-047                  │
│                                 │
│ Posición en cola: #12           │
│                                 │
│ ──────────────────────────────── │
│ Crea una cuenta para recibir    │
│ notificaciones cuando tu turno  │
│ esté cerca                       │
│ ┌─────────────────────────────┐  │
│ │ + Crear cuenta gratis       │  │
│ └─────────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 8. Mejores Prácticas para Adultos Mayores

### 8.1 Diseño Inclusivo

- **Fuente grande** (mínimo 16px para body, 20px+ para labels)
- **Alto contraste** entre texto y fondo
- **Botones grandes** (mínimo 44x44px para elemento táctil)
- **Validación clara** con mensajes simples
- **Sin jerga técnica** - usar "número de cédula" no "documentId"

### 8.2 Texto de Ayuda

```html
<!-- Evitar -->
<label for="documentId">Documento de identidad</label>

<!-- Preferir -->
<label for="documentId">Número de cédula (sin puntos)</label>
<p>Ej: 12345678</p>
```

### 8.3 Asistencia Alternativa

Para usuarios que no pueden registrarse solos:

```
¿Te queda difícil registrarte? Un operador puede ayudarte.
[Contactar a un operador]
```

Esto envía un email a `ayuda@tuturno.co` donde un operador puede:
1. Crear la cuenta por ellos
2. Asociar su cédula a la cuenta
3. Explicar cómo usar el sistema

---

## 9. Migración de Turno Anónimo a Cuenta

Cuando un usuario anónimo decide crear cuenta:

1. El operador recibe el email de solicitud
2. Crea la cuenta con los datos del usuario
3. En el campo `documentId` pone la cédula del turno
4. El turno queda asociado al usuario

**Alternativa futura:** Self-service donde usuario ingresa cédula y se verifica con OTP.

---

## 10. Roadmap

- [ ] Implementar confirmación de turno en página separada
- [ ] Agregar opción de enviar recordatorio por SMS
- [ ] Permitir que operador asocie cédula a cuenta existente
- [ ] Sistema OTP para verificar identidad sin password
- [ ] Historial de turnos para usuarios anónimos (por cédula)

---

## 11. Comandos de Testing

```bash
# Crear turno anónimo
curl -X POST http://localhost:3000/api/turns/public \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "UUID-DEL-SERVICIO", "documentId": "12345678"}'

# Buscar turnos por cédula
curl "http://localhost:3000/api/turns/by-document?documentId=12345678"
```

---

*Documento creado: Mayo 2026*
*Proyecto: TuTurno - Universidad de Córdoba*
