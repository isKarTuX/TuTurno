# ADR-001: Elección del Stack Tecnológico

**Estado:** Aceptado
**Fecha:** 2026-05-03
**Decisores:** Equipo TuTurno — Universidad de Córdoba

---

## 1. Contexto

Necesitamos elegir el stack tecnológico para un sistema de gestión de turnos digitales que funcione en Colombia. El proyecto es para la Universidad de Córdoba (departamento de Ingeniería de Sistemas y Telecomunicaciones).

### Requisitos funcionales críticos

- Sistema de turnos con cola en tiempo real
- Notificaciones push cuando el turno está próximo
- Panel para operadores llamar turnos
- Panel admin con métricas
- Multi-tenant: múltiples entidades (EPS, bancos, oficinas)
- Mobile-first, accesible desde cualquier dispositivo

### Restricciones

- Presupuesto académico (sin costs significativos)
- Tiempo de desarrollo finito
- El código debe ser ejemplary limpio (propósito académico)
- Necesidad de migrar de desarrollo local a producción

---

## 2. Opciones Consideradas

### Opción A: Next.js + Supabase (Full-stack)

| Aspecto | Evaluación |
|--------|-------------|
| WebSockets | Supabase Realtime (gestión de rooms manual) |
| Auth | Supabase Auth (cerrado, poco control) |
| Database | Postgres de Supabase |
| SSR | Muy bueno |
| Learning curve | Media |

### Opción B: Nuxt 3 + Drizzle ORM + Supabase

| Aspecto | Evaluación |
|--------|-------------|
| WebSockets | crossws nativo en Nitro ✅ |
| Auth | JWT custom con jose ✅ |
| Database | Drizzle (SQLite local → Postgres producción) ✅ |
| SSR | Híbrido SSG/SPA ✅ |
| Learning curve | Baja (Vue familiar) |
| Full-stack | Nitro como API ✅ |

### Opción C: React + Express + Prisma

| Aspecto | Evaluación |
|--------|-------------|
| WebSockets | Socket.io (bueno) |
| Auth | JWT custom (bueno) |
| Database | Prisma (bueno) |
| SSR | Next.js (mejor) |
| Learning curve | Media-alta |

### Opción D: Next.js + Firebase

| Aspecto | Evaluación |
|--------|-------------|
| WebSockets | Firebase Realtime Database |
| Auth | Firebase Auth (cerrado) |
| Database | Firestore |
| Learning curve | Baja |
| Vendor lock-in | Alto ❌ |

---

## 3. Decisión

**Elegimos: Nuxt 3 + Drizzle ORM + SQLite (desarrollo) → Supabase PostgreSQL (producción)**

### Justificación técnica

**Nuxt 3 con Nitro:**
- Server-side rendering híbrido: landing SSG para SEO, app SPA para UX
- WebSockets nativos con `crossws` (experimental pero estable en Nitro)
- API routes integradas en el mismo repo (full-stack)
- Deploy a múltiples proveedores (Vercel, Netlify, self-hosted)

**Drizzle ORM:**
- Queries tipadas con TypeScript
- Migraciones generadas, versionadas en git
- Cambio SQLite → PostgreSQL con cambiar una línea de conexión
- Mejor que Prisma para casos de uso simples (menos overhead)

**SQLite en desarrollo:**
- Zero setup, funciona out-of-the-box
- Perfecto para prototyping
- Se migra a Supabase Postgres cambiando `DB_DRIVER`

**JWT Custom con jose:**
- Control completo sobre tokens
- Compatible con cualquier auth flow
- Refresh token rotation implemented

**crossws para WebSockets:**
- Implementación liviana sobre WebSockets estándar
- Rooms/subscriptions nativos
- Integración directa con Nitro

---

## 4. Consecuencias Positivas

1. **Full-stack en un repo:** Un único repositorio para frontend, backend, DB
2. **WebSockets sin configuración extra:** crossws viene con Nitro
3. **Migración DB trivial:** Drizzle + variable de entorno
4. **TypeScript strict:** Código más mantenible
5. **SSR para landing:** SEO instantánea
6. **Learning curve baja:** Vue 3 + Composition API es conocido

---

## 5. Consecuencias Negativas / Trade-offs

1. **Debugging WebSockets:** crossws experimental puede requerir trabajo extra
2. **Ecosistema Supabase:** No aprovechamos features avanzados de Supabase (Auth manejado por nosotros)
3. **SQLite en desarrollo:** Pequeñas diferencias de sintaxis vs PostgreSQL (Drizzle las maneja)
4. **No realtime database nativo:** Implementamos our own pub/sub con WS

---

## 6. Referencias

- [Nuxt 3](https://nuxt.com/)
- [Nitro Server](https://nitro.build/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [crossws](https://github.com/unjs/crossws)
- [jose (JWT)](https://github.com/panva/jose)
- [Supabase](https://supabase.com/)
