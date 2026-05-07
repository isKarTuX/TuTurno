# PHASE-01 — Bootstrap del Proyecto

```
Estado: ⬜ Pendiente
Agente responsable: Claude Code - Sesión 1
Depende de: Ninguna
Tiempo estimado: 30 min
```

---

## 1. Objetivo

Crear la estructura base del proyecto TuTurno con Nuxt 3, configurar TypeScript strict mode, instalar todas las dependencias del stack y verificar que el proyecto corre en desarrollo.

---

## 2. Dependencias a Instalar

```bash
# Framework base
npx nuxi@latest init tuturno --template basic

# Core dependencies
npm install vue vue-router

# State management
npm install @pinia/nuxt pinia

# Database
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# Auth
npm install jose bcryptjs
npm install -D @types/bcryptjs

# Validation
npm install zod

# Forms
npm install vee-validate @vee-validate/zod zod
npm install @vee-validate/nuxt

# Icons
npm install @nuxt/icon lucide-vue-next

# Fonts
npm install @nuxt/fonts

# CSS
npm install tailwindcss @tailwindcss/vite

# Utilities
npm install clsx
npm install @vueuse/motion
npm install @vueuse/core

# PWA
npm install @vite-pwa/nuxt workbox-window
```

---

## 3. Archivos a Crear

| Archivo | Propósito |
|---------|-----------|
| `nuxt.config.ts` | Configuración central de Nuxt 3 |
| `tsconfig.json` | TypeScript strict mode |
| `tailwind.config.ts` | Tokens de diseño |
| `drizzle.config.ts` | Configuración Drizzle ORM |
| `.env.example` | Variables de entorno documentadas |
| `.gitignore` | Archivos excluidos |
| `assets/css/main.css` | Variables CSS + base styles |
| `assets/css/glass.css` | Clases glassmorphism |
| `assets/css/animations.css` | Keyframes y transiciones |

---

## 4. Configuraciones

### nuxt.config.ts

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/glass.css',
    '~/assets/css/animations.css',
  ],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    vapidEmail: process.env.VAPID_EMAIL,

    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:3000',
      dbDriver: process.env.DB_DRIVER || 'sqlite',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/auth/**': { ssr: false },
    '/app/**': { ssr: false },
    '/operator/**': { ssr: false },
    '/admin/**': { ssr: false },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'TuTurno',
      short_name: 'TuTurno',
      theme_color: '#6C3AE8',
      background_color: '#0D0D14',
      display: 'standalone',
    },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },
})
```

### tsconfig.json

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "moduleResolution": "bundler",
    "types": ["@types/better-sqlite3"]
  }
}
```

### tailwind.config.ts

```typescript
import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './stores/**/*.ts',
    './plugins/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C3AE8',
          light: '#A78BFA',
          dark: '#4C1D95',
        },
        accent: '#818CF8',
      },
      fontFamily: {
        display: ['Geist', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
})
```

### drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema/index.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: './tuturno.db',
  },
})
```

### .env.example

```bash
# Base de datos
DB_DRIVER=sqlite
DATABASE_URL=./tuturno.db

# Auth / JWT
JWT_SECRET=super-secret-key-min-32-chars-change-this-in-production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# WebPush / Notificaciones
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@tuturno.co

# App
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_WS_URL=ws://localhost:3000
NODE_ENV=development
```

### .gitignore

```
# Dependencies
node_modules
.pnpm

# Build
.output
.nuxt
.nitro
.cache

# Database
*.db
*.db-journal

# Environment
.env
.env.*
!.env.example

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# PWA
public/sw.js
public/workbox-*
```

---

## 5. Variables CSS Requeridas (assets/css/main.css)

```css
:root {
  /* Colores primarios */
  --color-primary: #6C3AE8;
  --color-primary-light: #A78BFA;
  --color-primary-dark: #4C1D95;
  --color-accent: #818CF8;

  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #6C3AE8, #3A8EE8);
  --gradient-hero: radial-gradient(ellipse at 80% 50%, rgba(108,58,232,0.3) 0%, transparent 60%);
  --gradient-glow: radial-gradient(circle, rgba(108,58,232,0.4) 0%, transparent 70%);

  /* Fondos */
  --bg-base: #0D0D14;
  --bg-surface: #13131F;
  --bg-elevated: #1A1A2E;
  --bg-overlay: #1F1F35;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-bg-hover: rgba(255, 255, 255, 0.07);
  --glass-border: rgba(255, 255, 255, 0.10);
  --glass-blur: backdrop-filter: blur(16px);
  --glass-shadow: 0 8px 32px rgba(108, 58, 232, 0.15);

  /* Texto */
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #52525B;
  --text-accent: #A78BFA;

  /* Estados de turno */
  --turn-waiting: #6C3AE8;
  --turn-called: #F59E0B;
  --turn-attending: #3B82F6;
  --turn-completed: #10B981;
  --turn-no-show: #EF4444;
  --turn-cancelled: #6B7280;

  /* Espaciado */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Bordes */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Tipografía */
  --font-display: 'Geist', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Transiciones */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 6. Criterios de Éxito

- [ ] `npm run dev` inicia el servidor de desarrollo sin errores
- [ ] TypeScript compila sin errores en modo strict
- [ ] Las variables CSS están disponibles globalmente
- [ ] El diseño base (fondo oscuro, tipografía) se aplica
- [ ] Los módulos de Nuxt (Pinia, Icon, Fonts, etc.) están cargados
- [ ] PWA genera el service worker correctamente

---

## 7. Errores Comunes

### Error: Cannot find module 'better-sqlite3'

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

### Error: Tailwind v4 no reconoce la config

Verificar que se usa `@tailwindcss/vite` en lugar del plugin PostCSS antiguo.

### Error: Module not found: @pinia/nuxt

Asegurar que Pinia se declara en `nuxt.config.ts` modules.

---

## 8. Comando de Verificación

```bash
npm run dev
# Abrir http://localhost:3000
# Verificar que la página carga sin errores en la consola
```
