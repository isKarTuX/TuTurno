# TuTurno — Redesign Plan: Auth Flow & Brand Presence

## Contexto y Visión

**IMPECCABLE_PREFLIGHT:** context=pass product=pass command_reference=pass shape=not_required image_gate=skipped mutation=pending

El auth flow es el **primer contacto real** del usuario con TuTurno después de la landing. Debe transmitir:
- Profesionalismo y seguridad (estás confiando tus datos)
- La misma estética premium de la landing
- Claridad total en el proceso (cualquier persona puede usarlo)
- Feedback inmediato en cada interacción

La marca **TuTurno** debe sentirse **invitadora y tecnológica** — no una página de turnos genérica. El nombre debe ser memorable y estar presente pero elegante.

---

## 1. Design Language para Auth

### 1.1 Color & Visual Strategy

**Basado en el landing page existente pero refinado:**

```css
/* Auth-specific overrides - más cálida, menos técnica */
--auth-bg: oklch(13% 0.015 285);           /* Fondo principal - mismo que landing */
--auth-surface: oklch(16% 0.015 285);       /* Cards - mismo que landing */
--auth-border: oklch(100% 0 0 / 0.08);      /* Bordes sutiles */
--auth-highlight: oklch(55% 0.18 285);      /* Primary - mismo violeta */

/* Glassmorphism refinado para auth */
--auth-glass-bg: oklch(100% 0 0 / 0.03);
--auth-glass-border: oklch(100% 0 0 / 0.08);
--auth-glass-shadow: 0 8px 40px oklch(0% 0 0 / 0.3);
```

### 1.2 Typography en Auth

```css
/* Headlines de sección */
--auth-heading: clamp(1.75rem, 3vw + 1rem, 2.5rem) font-semibold tracking-tight;

/* Subtext */
--auth-subtext: text-base text-white/60 leading-relaxed;

/* Form labels */
--auth-label: text-sm font-medium text-white/80;

/* Input text */
--auth-input: text-base text-white;

/* Botones */
--auth-button: text-sm font-semibold tracking-wide;
```

### 1.3 Motion Philosophy

**Filosofía:** Transiciones suaves pero rápidas (200-300ms). Sin animaciones largas que retrasen el proceso de autenticación.

```css
/* Easing para auth */
--ease-auth: cubic-bezier(0.23, 1, 0.32, 1);  /* ease-out strong */
--ease-auth-fast: cubic-bezier(0.4, 0, 0.2, 1); /* default */
```

**Animaciones permitidas en auth:**
1. Transiciones de input (focus, error, success)
2. Shake en error de validación
3. Fade de estado (loading → success → redirect)
4. Slide de tabs (login ↔ register)
5. Press feedback en botones

**Animaciones prohibidas en auth:**
- Entrada staggered de elementos (el usuario quiere hacer login rápido)
- Animaciones largas de celebración
- Parallax o efectos de scroll

---

## 2. Layout Architecture

### 2.1 Current Auth Layout

**Estado actual (`layouts/auth.vue`):**
- Split layout: 40% brand side + 60% form side
- Brand side tiene gradient blobs, logo, mini simulator
- Form side tiene glass card centrado

### 2.2 Redesigned Auth Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPLIT LAYOUT                             │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│   BRAND SIDE (40%)           │   FORM SIDE (60%)                │
│                              │                                  │
│   ┌──────────────────────┐   │   ┌────────────────────────────┐ │
│   │  Logo TuTurno        │   │   │                            │ │
│   │  (animado)           │   │   │   Auth Card (glass)        │ │
│   │                      │   │   │                            │ │
│   │  Tagline             │   │   │   Tabs: Login | Register   │ │
│   │  "Tu turno,          │   │   │                            │ │
│   │   sin esperar"       │   │   │   Form Fields              │ │
│   │                      │   │   │                            │ │
│   │  Phone Simulator    │   │   │   Remember me / Forgot     │ │
│   │  (mini, animado)     │   │   │                            │ │
│   │                      │   │   │   Submit Button            │ │
│   │  Social Proof       │   │   │                            │ │
│   │  "10K+ turnos"      │   │   │   Divider                  │ │
│   │                      │   │   │                            │ │
│   └──────────────────────┘   │   │   SSO Options (futuro)    │ │
│                              │   │                            │ │
│   Mobile: hidden             │   └────────────────────────────┘ │
│                              │                                  │
├──────────────────────────────┴──────────────────────────────────┤
│                                                                 │
│   MOBILE: Brand colapsado a header compacto                     │
│   + Form full width con padding Generoso                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Mobile Adaptation

**Mobile-first approach:**

```vue
<!-- Mobile: solo form visible, header compacto arriba -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Compact header para mobile -->
    <header class="px-4 py-4 border-b border-white/5">
      <UiLogo variant="icon+text" size="sm" />
    </header>

    <!-- Form content -->
    <main class="flex-1 flex flex-col justify-center px-4 py-8">
      <!-- Auth card con tabs -->
      <AuthCard />
    </main>

    <!-- Footer sutil -->
    <footer class="px-4 py-6 text-center">
      <p class="text-xs text-white/30">
        Al continuar, aceptas nuestros
        <a href="/terminos" class="text-white/50 hover:text-white">Términos</a>
        y
        <a href="/privacidad" class="text-white/50 hover:text-white">Política de Privacidad</a>
      </p>
    </footer>
  </div>
</template>
```

---

## 3. Auth Card Redesign

### 3.1 LoginForm — Rediseño Completo

```vue
<!-- components/auth/LoginForm.vue -->
<template>
  <div class="w-full max-w-[400px] mx-auto">
    <!-- Tabs -->
    <div class="flex gap-1 p-1 mb-8 rounded-2xl bg-white/5">
      <button
        class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === 'login' ? 'bg-white text-bg-base' : 'text-white/60 hover:text-white'"
        @click="activeTab = 'login'"
      >
        Iniciar sesión
      </button>
      <button
        class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === 'register' ? 'bg-white text-bg-base' : 'text-white/60 hover:text-white'"
        @click="activeTab = 'register'"
      >
        Crear cuenta
      </button>
    </div>

    <!-- Form Container -->
    <div class="relative">
      <!-- Error Alert -->
      <Transition name="alert">
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <ExclamationCircleIcon class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-red-400">Error de autenticación</p>
            <p class="text-sm text-red-400/80">{{ errorMessage }}</p>
          </div>
          <button
            class="ml-auto -mr-1 -mt-1 p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            @click="errorMessage = ''"
          >
            <XIcon class="w-4 h-4 text-red-400" />
          </button>
        </div>
      </Transition>

      <!-- Login Form -->
      <Transition name="tab" mode="out-in">
        <form
          v-if="activeTab === 'login'"
          key="login"
          class="space-y-5"
          @submit.prevent="handleLogin"
        >
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-white/80">
              Correo electrónico
            </label>
            <div class="relative">
              <MailIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
              />
            </div>
            <Transition name="error">
              <p v-if="errors.email" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.email }}
              </p>
            </Transition>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-white/80">
                Contraseña
              </label>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-xs text-primary hover:text-primary-light transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </NuxtLink>
            </div>
            <div class="relative">
              <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <Transition name="error">
              <p v-if="errors.password" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.password }}
              </p>
            </Transition>
          </div>

          <!-- Remember me -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              role="checkbox"
              :aria-checked="rememberMe"
              class="relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              :class="rememberMe ? 'bg-primary' : 'bg-white/10'"
              @click="rememberMe = !rememberMe"
            >
              <span
                class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                :class="rememberMe ? 'translate-x-4' : 'translate-x-0'"
              />
            </button>
            <span class="text-sm text-white/60">Recordarme por 7 días</span>
          </div>

          <!-- Submit Button -->
          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </UiButton>

          <!-- Divider -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10" />
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 text-xs text-white/30 bg-transparent">o continúa con</span>
            </div>
          </div>

          <!-- SSO placeholder -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              disabled
              title="Próximamente"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              <span class="text-sm text-white/60">Google</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              disabled
              title="Próximamente"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              <span class="text-sm text-white/60">GitHub</span>
            </button>
          </div>
        </form>
      </Transition>
    </div>

    <!-- Footer text -->
    <p class="mt-8 text-center text-sm text-white/40">
      ¿No tienes cuenta?
      <button
        type="button"
        class="text-primary hover:text-primary-light transition-colors font-medium"
        @click="activeTab = 'register'"
      >
        Regístrate gratis
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  redirectTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: '/app',
})

const { loginAndRedirect } = useAuth()

const activeTab = ref<'login' | 'register'>('login')
const loginForm = reactive({
  email: '',
  password: '',
})
const errors = reactive({
  email: '',
  password: '',
})
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

// Validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleLogin = async () => {
  errors.email = ''
  errors.password = ''
  errorMessage.value = ''

  // Validate
  if (!loginForm.email) {
    errors.email = 'El correo es requerido'
    return
  }
  if (!validateEmail(loginForm.email)) {
    errors.email = 'Ingresa un correo válido'
    return
  }
  if (!loginForm.password) {
    errors.password = 'La contraseña es requerida'
    return
  }

  loading.value = true

  try {
    await loginAndRedirect(loginForm.email, loginForm.password, props.redirectTo)
  } catch (error: any) {
    errorMessage.value = error.message || 'Credenciales incorrectas. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tab transitions */
.tab-enter-active,
.tab-leave-active {
  transition: all 200ms ease-out;
}
.tab-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Alert transitions */
.alert-enter-active,
.alert-leave-active {
  transition: all 200ms ease-out;
}
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Error transitions */
.error-enter-active,
.error-leave-active {
  transition: all 150ms ease-out;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Button press */
button[type="submit"]:active {
  transform: scale(0.98);
}
</style>
```

### 3.2 RegisterForm — Rediseño Completo

```vue
<!-- components/auth/RegisterForm.vue -->
<template>
  <div class="w-full max-w-[400px] mx-auto">
    <!-- Tabs -->
    <div class="flex gap-1 p-1 mb-8 rounded-2xl bg-white/5">
      <button
        class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === 'login' ? 'bg-white text-bg-base' : 'text-white/60 hover:text-white'"
        @click="activeTab = 'login'"
      >
        Iniciar sesión
      </button>
      <button
        class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === 'register' ? 'bg-white text-bg-base' : 'text-white/60 hover:text-white'"
        @click="activeTab = 'register'"
      >
        Crear cuenta
      </button>
    </div>

    <!-- Form Container -->
    <div class="relative">
      <!-- Success Alert -->
      <Transition name="alert">
        <div
          v-if="successMessage"
          class="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-3"
        >
          <CheckCircleIcon class="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-green-400">¡Cuenta creada!</p>
            <p class="text-sm text-green-400/80">{{ successMessage }}</p>
          </div>
        </div>
      </Transition>

      <!-- Error Alert -->
      <Transition name="alert">
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <ExclamationCircleIcon class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-red-400">Error</p>
            <p class="text-sm text-red-400/80">{{ errorMessage }}</p>
          </div>
          <button
            class="ml-auto -mr-1 -mt-1 p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            @click="errorMessage = ''"
          >
            <XIcon class="w-4 h-4 text-red-400" />
          </button>
        </div>
      </Transition>

      <!-- Register Form -->
      <Transition name="tab" mode="out-in">
        <form
          v-if="activeTab === 'register'"
          key="register"
          class="space-y-5"
          @submit.prevent="handleRegister"
        >
          <!-- Full Name -->
          <div class="space-y-2">
            <label for="fullName" class="block text-sm font-medium text-white/80">
              Nombre completo
            </label>
            <div class="relative">
              <UserIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="fullName"
                v-model="registerForm.fullName"
                type="text"
                placeholder="Como aparece en tu cédula"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
              />
            </div>
            <Transition name="error">
              <p v-if="errors.fullName" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.fullName }}
              </p>
            </Transition>
          </div>

          <!-- Document ID -->
          <div class="space-y-2">
            <label for="documentId" class="block text-sm font-medium text-white/80">
              Cédula de ciudadanía
            </label>
            <div class="relative">
              <CreditCardIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="documentId"
                v-model="registerForm.documentId"
                type="text"
                placeholder="1XXXXXXXX"
                maxlength="12"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.documentId ? 'border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
                @input="formatDocumentId"
              />
            </div>
            <Transition name="error">
              <p v-if="errors.documentId" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.documentId }}
              </p>
            </Transition>
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-white/80">
              Celular (con WhatsApp)
            </label>
            <div class="relative">
              <PhoneIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="phone"
                v-model="registerForm.phone"
                type="tel"
                placeholder="300 123 4567"
                maxlength="13"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.phone ? 'border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
                @input="formatPhone"
              />
            </div>
            <Transition name="error">
              <p v-if="errors.phone" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.phone }}
              </p>
            </Transition>
            <p class="text-xs text-white/40">Ejemplo: 300 123 4567</p>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label for="reg-email" class="block text-sm font-medium text-white/80">
              Correo electrónico
            </label>
            <div class="relative">
              <MailIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="reg-email"
                v-model="registerForm.email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.email ? 'border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
              />
            </div>
            <Transition name="error">
              <p v-if="errors.email" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.email }}
              </p>
            </Transition>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="reg-password" class="block text-sm font-medium text-white/80">
              Contraseña
            </label>
            <div class="relative">
              <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="reg-password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                class="w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none"
                :class="errors.password ? 'border-red-500' : 'border-white/10 focus:border-primary'"
                :disabled="loading"
                @input="checkPasswordStrength"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>

            <!-- Password strength indicator -->
            <div v-if="registerForm.password" class="space-y-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="passwordStrength >= i ? strengthColors[passwordStrength - 1] : 'bg-white/10'"
                />
              </div>
              <p class="text-xs" :class="strengthTexts[passwordStrength - 1]">
                {{ strengthLabels[passwordStrength - 1] }}
              </p>
            </div>

            <Transition name="error">
              <p v-if="errors.password" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ errors.password }}
              </p>
            </Transition>
          </div>

          <!-- Password requirements -->
          <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5">
            <div
              v-for="req in passwordRequirements"
              :key="req.id"
              class="flex items-center gap-2 text-xs"
              :class="req.met ? 'text-green-400' : 'text-white/30'"
            >
              <CheckCircleIcon v-if="req.met" class="w-3 h-3" />
              <CircleIcon v-else class="w-3 h-3" />
              {{ req.label }}
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              :aria-checked="acceptTerms"
              class="relative mt-0.5 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center shrink-0"
              :class="acceptTerms ? 'bg-primary border-primary' : 'border-white/30 hover:border-white/50'"
              @click="acceptTerms = !acceptTerms"
            >
              <CheckIcon v-if="acceptTerms" class="w-3 h-3 text-white" />
            </button>
            <span class="text-sm text-white/60">
              Acepto los
              <a href="/terminos" class="text-primary hover:text-primary-light">Términos de servicio</a>
              y la
              <a href="/privacidad" class="text-primary hover:text-primary-light">Política de privacidad</a>
            </span>
          </div>
          <Transition name="error">
            <p v-if="errors.terms" class="text-xs text-red-400 flex items-center gap-1">
              <AlertCircleIcon class="w-3 h-3" />
              {{ errors.terms }}
            </p>
          </Transition>

          <!-- Submit Button -->
          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading || !acceptTerms"
          >
            {{ loading ? 'Creando cuenta...' : 'Crear mi cuenta' }}
          </UiButton>
        </form>
      </Transition>
    </div>

    <!-- Footer text -->
    <p class="mt-8 text-center text-sm text-white/40">
      ¿Ya tienes cuenta?
      <button
        type="button"
        class="text-primary hover:text-primary-light transition-colors font-medium"
        @click="activeTab = 'login'"
      >
        Inicia sesión
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
const { registerAndRedirect } = useAuth()

const activeTab = ref<'login' | 'register'>('register')
const registerForm = reactive({
  fullName: '',
  documentId: '',
  phone: '',
  email: '',
  password: '',
})
const errors = reactive({
  fullName: '',
  documentId: '',
  phone: '',
  email: '',
  password: '',
  terms: '',
})
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const acceptTerms = ref(false)
const passwordStrength = ref(0)

const strengthLabels = [
  'Muy débil',
  'Débil',
  'Aceptable',
  'Fuerte',
]

const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
]

const strengthTexts = [
  'text-red-400',
  'text-orange-400',
  'text-yellow-400',
  'text-green-400',
]

const passwordRequirements = ref([
  { id: 'length', label: 'Mínimo 8 caracteres', met: false },
  { id: 'number', label: 'Al menos un número', met: false },
  { id: 'upper', label: 'Una mayúscula', met: false },
  { id: 'special', label: 'Un carácter especial', met: false },
])

const checkPasswordStrength = () => {
  const pwd = registerForm.password
  let strength = 0

  // Length
  passwordRequirements.value[0].met = pwd.length >= 8
  if (pwd.length >= 8) strength++

  // Number
  passwordRequirements.value[1].met = /\d/.test(pwd)
  if (/\d/.test(pwd)) strength++

  // Uppercase
  passwordRequirements.value[2].met = /[A-Z]/.test(pwd)
  if (/[A-Z]/.test(pwd)) strength++

  // Special
  passwordRequirements.value[3].met = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++

  passwordStrength.value = strength
}

const formatDocumentId = (e: Event) => {
  const input = e.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '').slice(0, 12)
  registerForm.documentId = input.value
}

const formatPhone = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 10)

  if (value.length > 0) {
    value = value.match(/.{1,3}/g)?.join(' ') || value
  }

  registerForm.phone = value
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleRegister = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
  errorMessage.value = ''

  // Validate
  if (!registerForm.fullName.trim()) {
    errors.fullName = 'El nombre es requerido'
    return
  }
  if (registerForm.fullName.trim().length < 3) {
    errors.fullName = 'Ingresa tu nombre completo'
    return
  }
  if (!registerForm.documentId || registerForm.documentId.length < 6) {
    errors.documentId = 'Ingresa un número de cédula válido'
    return
  }
  if (!registerForm.phone || registerForm.phone.length < 10) {
    errors.phone = 'Ingresa un número de celular válido'
    return
  }
  if (!registerForm.email || !validateEmail(registerForm.email)) {
    errors.email = 'Ingresa un correo válido'
    return
  }
  if (registerForm.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  if (passwordStrength.value < 3) {
    errors.password = 'La contraseña debe ser más fuerte'
    return
  }
  if (!acceptTerms.value) {
    errors.terms = 'Debes aceptar los términos para continuar'
    return
  }

  loading.value = true

  try {
    await registerAndRedirect(registerForm)
    successMessage.value = 'Redirigiendo a tu cuenta...'
  } catch (error: any) {
    errorMessage.value = error.message || 'No se pudo crear la cuenta. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Same transitions as LoginForm */
.tab-enter-active,
.tab-leave-active {
  transition: all 200ms ease-out;
}
.tab-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.alert-enter-active,
.alert-leave-active {
  transition: all 200ms ease-out;
}
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.error-enter-active,
.error-leave-active {
  transition: all 150ms ease-out;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
```

---

## 4. Auth Layout Enhancement

### 4.1 Redesigned Auth Layout

```vue
<!-- layouts/auth.vue -->
<template>
  <div class="min-h-screen flex">
    <!-- Brand Side (Desktop only) -->
    <div
      class="hidden lg:flex lg:w-2/5 relative overflow-hidden"
      :style="{
        background: 'linear-gradient(135deg, oklch(13% 0.015 285) 0%, oklch(16% 0.015 285) 100%)'
      }"
    >
      <!-- Decorative gradient blobs -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Blob 1 -->
        <div
          class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30"
          style="background: radial-gradient(circle, oklch(55% 0.18 285 / 0.4), transparent 70%); filter: blur(60px);"
        />
        <!-- Blob 2 -->
        <div
          class="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-20"
          style="background: radial-gradient(circle, oklch(72% 0.16 285 / 0.4), transparent 70%); filter: blur(80px);"
        />
        <!-- Grid pattern -->
        <div
          class="absolute inset-0 opacity-[0.02]"
          style="background-image: linear-gradient(oklch(100% 0 0 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(100% 0 0 / 0.5) 1px, transparent 1px); background-size: 40px 40px;"
        />
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between w-full p-12">
        <!-- Logo -->
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg viewBox="0 0 32 32" class="w-6 h-6">
                <path d="M16 4L6 12V14H26V12L16 4Z" fill="currentColor" class="text-white" />
                <rect x="12" y="14" width="8" height="14" rx="2" fill="currentColor" class="text-white" />
              </svg>
            </div>
            <span class="text-2xl font-bold tracking-tight">
              Tu<span class="text-primary">Turno</span>
            </span>
          </NuxtLink>
        </div>

        <!-- Center content -->
        <div class="space-y-8">
          <!-- Tagline -->
          <div class="space-y-4">
            <h1 class="text-4xl font-bold text-white leading-tight tracking-tight">
              Tu turno,<br />
              <span class="text-primary">sin esperar</span>
            </h1>
            <p class="text-lg text-white/60 max-w-md">
              Olvídate de las filas. Solicita tu turno desde cualquier lugar y llega justo a tiempo.
            </p>
          </div>

          <!-- Mini simulator preview -->
          <div class="relative">
            <div class="glass rounded-3xl p-6 max-w-[280px]">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <TicketIcon class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="font-medium text-white text-sm">EPS Sura</p>
                  <p class="text-xs text-white/50">Consultas generales</p>
                </div>
              </div>
              <div class="text-center py-4">
                <p class="text-4xl font-bold text-white mb-1">B-047</p>
                <p class="text-sm text-white/50">Posición #3</p>
              </div>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </div>

            <!-- Floating notification -->
            <div class="absolute -right-4 top-4 glass rounded-xl p-3 animate-float">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BellIcon class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p class="text-xs text-white/50">Te quedan</p>
                  <p class="text-sm font-semibold text-white">2 turnos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-white">10K+</p>
            <p class="text-xs text-white/50">Turnos gestionados</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">85%</p>
            <p class="text-xs text-white/50">Menos tiempo de espera</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">&lt;30min</p>
            <p class="text-xs text-white/50">Tiempo promedio</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Side -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Mobile Header (only on mobile) -->
      <header class="lg:hidden px-4 py-4 border-b border-white/5">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg viewBox="0 0 32 32" class="w-5 h-5">
              <path d="M16 4L6 12V14H26V12L16 4Z" fill="currentColor" class="text-white" />
              <rect x="12" y="14" width="8" height="14" rx="2" fill="currentColor" class="text-white" />
            </svg>
          </div>
          <span class="font-bold tracking-tight">
            Tu<span class="text-primary">Turno</span>
          </span>
        </NuxtLink>
      </header>

      <!-- Form Content -->
      <main class="flex-1 flex flex-col justify-center px-4 py-8 lg:px-12">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="px-4 py-6 text-center border-t border-white/5">
        <p class="text-xs text-white/30">
          Al continuar, aceptas nuestros
          <a href="/terminos" class="text-white/40 hover:text-white transition-colors">Términos</a>
          y
          <a href="/privacidad" class="text-white/40 hover:text-white transition-colors">Política de Privacidad</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
```

---

## 5. Forgot Password Flow

### 5.1 ForgotPasswordForm

```vue
<!-- components/auth/ForgotPasswordForm.vue -->
<template>
  <div class="w-full max-w-[400px] mx-auto">
    <!-- Back link -->
    <NuxtLink
      to="/auth/login"
      class="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
    >
      <ArrowLeftIcon class="w-4 h-4" />
      Volver a iniciar sesión
    </NuxtLink>

    <!-- Success State -->
    <Transition name="fade" mode="out-in">
      <div v-if="success" key="success" class="text-center py-8">
        <div class="w-20 h-20 mx-auto mb-6 rounded-3xl bg-green-500/10 flex items-center justify-center">
          <MailIcon class="w-10 h-10 text-green-400" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Revisa tu correo</h1>
        <p class="text-white/60 mb-8">
          Enviamos un enlace de recuperación a<br />
          <span class="text-white font-medium">{{ submittedEmail }}</span>
        </p>
        <p class="text-sm text-white/40">
          ¿No recibiste el correo?
          <button
            class="text-primary hover:text-primary-light transition-colors"
            @click="resendEmail"
          >
            Reenviar
          </button>
        </p>
      </div>

      <!-- Form State -->
      <div v-else key="form">
        <h1 class="text-2xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h1>
        <p class="text-white/60 mb-8">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div class="space-y-2">
            <label for="reset-email" class="block text-sm font-medium text-white/80">
              Correo electrónico
            </label>
            <div class="relative">
              <MailIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                id="reset-email"
                v-model="email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-primary"
                :class="error ? 'border-red-500' : 'border-white/10'"
                :disabled="loading"
              />
            </div>
            <Transition name="error">
              <p v-if="error" class="text-xs text-red-400 flex items-center gap-1">
                <AlertCircleIcon class="w-3 h-3" />
                {{ error }}
              </p>
            </Transition>
          </div>

          <!-- Submit -->
          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="loading"
          >
            {{ loading ? 'Enviando...' : 'Enviar enlace' }}
          </UiButton>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { requestPasswordReset } = useAuth()

const email = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)
const submittedEmail = ref('')

const handleSubmit = async () => {
  error.value = ''

  if (!email.value) {
    error.value = 'El correo es requerido'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Ingresa un correo válido'
    return
  }

  loading.value = true

  try {
    await requestPasswordReset(email.value)
    submittedEmail.value = email.value
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'No pudimos enviar el correo. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  loading.value = true
  try {
    await requestPasswordReset(submittedEmail.value)
  } catch (e: any) {
    error.value = e.message || 'No pudimos reenviar el correo. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 200ms ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.error-enter-active,
.error-leave-active {
  transition: all 150ms ease-out;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
```

---

## 6. Page-level Auth Pages

### 6.1 Login Page

```vue
<!-- pages/auth/login.vue -->
<template>
  <div>
    <AuthLoginForm :redirect-to="redirectTo" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const route = useRoute()
const redirectTo = computed(() => {
  return (route.query.redirect as string) || '/app'
})
</script>
```

### 6.2 Register Page

```vue
<!-- pages/auth/register.vue -->
<template>
  <div>
    <AuthRegisterForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})
</script>
```

### 6.3 Forgot Password Page

```vue
<!-- pages/auth/forgot-password.vue -->
<template>
  <div>
    <AuthForgotPasswordForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})
</script>
```

---

## 7. Input Component Enhancement

### 7.1 UiInput for Auth

```vue
<!-- components/ui/UiInput.vue -->
<template>
  <div class="space-y-2">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium"
      :class="error ? 'text-red-400' : 'text-white/80'"
    >
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Leading icon -->
      <div
        v-if="$slots.leading"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
      >
        <slot name="leading" />
      </div>

      <!-- Input -->
      <input
        :id="id"
        v-bind="$attrs"
        :value="modelValue"
        :type="computedType"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full bg-white/5 border rounded-xl text-white placeholder:text-white/30 transition-all focus:outline-none',
          $slots.leading ? 'pl-12' : 'pl-4',
          $slots.trailing || type === 'password' ? 'pr-12' : 'pr-4',
          'py-4',
          error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary',
          disabled && 'opacity-50 cursor-not-allowed',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- Trailing icon / action -->
      <div
        v-if="$slots.trailing"
        class="absolute right-4 top-1/2 -translate-y-1/2"
      >
        <slot name="trailing" />
      </div>

      <!-- Password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors"
        @click="$emit('toggle-password')"
      >
        <EyeIcon v-if="!showPassword" class="w-5 h-5" />
        <EyeOffIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Helper / Error text -->
    <Transition name="slide">
      <p
        v-if="error"
        class="text-xs text-red-400 flex items-center gap-1"
      >
        <AlertCircleIcon class="w-3 h-3" />
        {{ error }}
      </p>
      <p
        v-else-if="hint"
        class="text-xs text-white/40"
      >
        {{ hint }}
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
  showPassword?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
  id: () => `input-${Math.random().toString(36).slice(2, 9)}`,
  showPassword: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  'toggle-password': []
}>()

const computedType = computed(() => {
  if (props.type === 'password' && props.showPassword) {
    return 'text'
  }
  return props.type
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 150ms ease-out;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
```

---

## 8. UX Micro-interactions

### 8.1 Input Focus Animation

```css
/* Focus ring animation */
input:focus {
  box-shadow: 0 0 0 3px oklch(55% 0.18 285 / 0.15);
}
```

### 8.2 Tab Switch Animation

```css
/* Smooth tab indicator slide */
.tab-indicator {
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

### 8.3 Error Shake

```typescript
// composables/useShake.ts
export function useShake(element: Ref<HTMLElement | null>) {
  const shake = () => {
    if (!element.value) return

    element.value.classList.add('animate-shake')
    setTimeout(() => {
      element.value?.classList.remove('animate-shake')
    }, 500)
  }

  return { shake }
}
```

```css
/* Add to animations.css */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
```

### 8.4 Loading Button State

```vue
<!-- In UiButton - enhance with loading state -->
<template>
  <button
    :class="[
      'relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
    ]"
    :disabled="disabled || loading"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="absolute w-5 h-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Content -->
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>
```

---

## 9. Validation & Error States

### 9.1 Zod Schema Enhancement

```typescript
// schemas/auth.schema.ts
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
})

export const RegisterSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Ingresa tu nombre completo')
    .max(100, 'El nombre es muy largo'),
  documentId: z
    .string()
    .min(6, 'Ingresa un número de cédula válido')
    .max(12, 'La cédula no puede tener más de 12 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),
  phone: z
    .string()
    .min(10, 'Ingresa un número de celular válido')
    .max(13, 'El número no puede tener más de 13 caracteres')
    .regex(/^[\d\s]+$/, 'El celular solo debe contener números'),
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/\d/, 'La contraseña debe tener al menos un número')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe tener al menos un carácter especial'),
})

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
})
```

### 9.2 Real-time Validation

```vue
<!-- Debounced validation while typing -->
<script setup lang="ts">
const email = ref('')
const emailError = ref('')
const emailTouched = ref(false)

// Debounced validation
const validateEmail = useDebounceFn(() => {
  if (!email.value) {
    emailError.value = ''
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Ingresa un correo válido'
  } else {
    emailError.value = ''
  }
}, 500)

watch(email, () => {
  if (emailTouched.value) {
    validateEmail()
  }
})

const handleBlur = () => {
  emailTouched.value = true
  validateEmail()
}
</script>
```

---

## 10. Accessibility

### 10.1 ARIA Labels

```vue
<!-- Password visibility toggle -->
<button
  type="button"
  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
  :aria-pressed="showPassword"
>
```

### 10.2 Error Announcements

```vue
<!-- Live region for screen readers -->
<div aria-live="polite" class="sr-only">
  <p v-if="errorMessage">{{ errorMessage }}</p>
</div>
```

### 10.3 Focus Management

```typescript
// composables/useFocusTrap.ts
export function useFocusTrap(container: Ref<HTMLElement | null>) {
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !container.value) return

    const focusable = container.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleTab)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleTab)
  })
}
```

---

## 11. Implementation Priority

### Phase 1: Core Auth (Day 1)
- [ ] Redesign `LoginForm.vue`
- [ ] Redesign `RegisterForm.vue`
- [ ] Enhance `layouts/auth.vue`
- [ ] Add password strength indicator
- [ ] Add phone formatting
- [ ] Add document ID formatting

### Phase 2: UX Enhancement (Day 2)
- [ ] Redesign `ForgotPasswordForm.vue`
- [ ] Add input shake on error
- [ ] Add loading states to buttons
- [ ] Add success animations
- [ ] Enhance error messages
- [ ] Add live validation

### Phase 3: Polish (Day 3)
- [ ] Accessibility audit
- [ ] Mobile responsiveness test
- [ ] Animation performance check
- [ ] Focus management
- [ ] Screen reader testing

---

## 12. Verification Checklist

- [ ] `npm run typecheck` pasa
- [ ] `npm run lint` pasa
- [ ] Form validation works for all fields
- [ ] Password strength indicator updates in real-time
- [ ] Phone formats as user types (300 XXX XXXX)
- [ ] Document ID only accepts numbers
- [ ] Error states show inline with icons
- [ ] Loading states disable button and show spinner
- [ ] Tab switching is smooth (200ms)
- [ ] Success state shows checkmark animation
- [ ] All touch targets are 44x44px minimum
- [ ] Focus states are visible
- [ ] Reduced motion is respected
- [ ] Works on mobile (320px width minimum)