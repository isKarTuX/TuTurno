# PHASE-10 — Polish y QA

```
Estado: ⬜ Pendiente (parcialmente completo)
Agente responsable: Claude Code - Sesión 10
Depende de: Todas
Tiempo estimado: 60 min
Notas: Several TypeScript errors exist in pre-existing files. QA completo pendiente.
```

---

## 1. Objetivo

Revisar calidad final: responsive, accesibilidad, estados de carga, errores y testing básico.

---

## 2. Checklist Responsive

### Breakpoints

| Dispositivo | Width | Verificar |
|-------------|-------|-----------|
| Mobile | 320px - 479px | Stack vertical, nav bottom, cards full width |
| Tablet | 480px - 767px | 2 columnas donde aplique |
| Tablet landscape | 768px - 1023px | Sidebar visible |
| Desktop | 1024px - 1439px | Layout completo |
| Large desktop | 1440px+ | Max-width en content |

### Elementos a verificar

- [ ] Touch targets mínimo 44x44px
- [ ] Texto legible sin zoom (mínimo 16px)
- [ ] Imágenes no overflow
- [ ] Cards no se superponen
- [ ] Modal/es responsive
- [ ] Tablas con scroll horizontal en mobile

---

## 3. Accesibilidad

### Contraste

| Elemento | Color | Ratio | Mínimo |
|----------|-------|-------|--------|
| Texto primary | #FFFFFF | 21:1 | ✓ |
| Texto secondary | #A1A1AA | 7:1 | ✓ |
| Texto muted | #52525B | 3:1 | ✗ (solo para decorativo) |
| Botón primary bg | #6C3AE8 | 5:1 | ✓ |
| Estado waiting | #6C3AE8 | 5:1 | ✓ |

### Focus visible

```css
:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}
```

- [ ] Todos los botones tienen focus visible
- [ ] Inputs tienen focus visible
- [ ] Links tienen focus visible

### ARIA labels

- [ ] Icon-only buttons tienen `aria-label`
- [ ] Modales tienen `role="dialog"` y `aria-labelledby`
- [ ] Toast notifications tienen `role="alert"`
- [ ] Imágenes tienen `alt` descriptivo

---

## 4. Estados de Carga

### Skeleton Loaders

Todos los componentes deben tener estado de loading:

| Componente | Skeleton |
|-----------|----------|
| EntityCard | Rectángulo con shimmer |
| TurnCard | Rectángulo con shimmer |
| TurnTicket | Placeholder con shimmer |
| OperatorQueue | Lista de placeholders |
| EntityList | Grid de 6-12 skeleton cards |

### Shimmer animation

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 5. Error Boundaries

### Páginas de error

- [ ] `/error` — Error genérico con botón "Reintentar"
- [ ] `/404` — Página no encontrada con link a home
- [ ] Error de API muestra mensaje user-friendly

### Try/Catch en API routes

```typescript
export default defineEventHandler(async (event) => {
  try {
    // lógica
  } catch (err) {
    console.error('API Error:', err)
    throw createError({
      statusCode: 500,
      data: {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Algo salió mal. Por favor intenta de nuevo.'
        }
      }
    })
  }
})
```

---

## 6. Testing Manual End-to-End

### Flujo ciudadano

1. Register → Login → Buscar entidad → Solicitar turno
2. Ver turno en "Mis Turnos" → Ver QR
3. Operador llama turno → Ver actualización en tiempo real
4. Operador completa turno → Ver en historial

### Flujo operador

1. Login como operador
2. Ver cola de turnos
3. Llamar siguiente → Ver actualización en cliente ciudadano
4. Marcar como atendido → Ver en estadísticas

### Flujo admin

1. Login como admin
2. Ver dashboard de métricas
3. Crear nueva entidad
4. Asignar operador a servicio
5. Ver reportes

### Edge cases

- [ ] Crear 4to turno → Error MAX_TURNS_EXCEEDED
- [ ] Cancelar turno ya llamado → Error CANNOT_CANCEL
- [ ] Login con credenciales incorrectas → Error 401
- [ ] Acceder a /admin sin ser admin → Redirect
- [ ] Token expirado → Refresh automático funciona
- [ ] Refresh token expirado → Redirect a login
- [ ] Sin conexión a internet → Banner de offline
- [ ] WS desconectado → Reconexión automática

---

## 7. Performance

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 500KB (sin analizar)
- [ ] Imágenes con `loading="lazy"`
- [ ] Componentes pesados con `defineAsyncComponent`

---

## 8. Checklist Final

- [ ] TypeScript sin errores (`npm run typecheck`)
- [ ] ESLint sin warnings (`npm run lint`)
- [ ] Responsive en todos los breakpoints
- [ ] Accesibilidad: contraste, focus, aria
- [ ] Skeleton loaders en todos los estados de carga
- [ ] Error boundaries implementados
- [ ] No hay `console.log` en producción
- [ ] No hay `any` types nuevos
- [ ] `.env` no commiteado
- [ ] README.md actualizado
