<script setup lang="ts">
const { isAuthenticated, user } = useAuth()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Inicio', exact: true },
  { to: '/entidades', label: 'Para Entidades', exact: false },
  { to: '/problema', label: 'El Problema', exact: false },
  { to: '/nosotros', label: 'Nosotros', exact: false },
]

const route = useRoute()

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function isActiveLink(path: string, exact: boolean) {
  if (exact) {
    return route.path === path
  }
  return route.path.startsWith(path)
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled
        ? 'bg-[--bg-base]/85 backdrop-blur-[32px] -webkit-backdrop-blur-[32px] border-b border-white/[0.03] shadow-lg shadow-black/30'
        : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">

        <UiLogo size="md" variant="handwritten" />

        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative px-4 py-2 text-sm rounded-lg transition-all duration-200"
            :class="[
              isActiveLink(link.to, link.exact)
                ? 'text-white bg-white/[0.08]'
                : 'text-[--text-secondary] hover:text-white hover:bg-white/[0.05]'
            ]"
          >
            {{ link.label }}
            <span
              v-if="isActiveLink(link.to, link.exact)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[--color-primary]"
            />
          </NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center gap-3">
          <template v-if="isAuthenticated">
            <NuxtLink
              to="/app"
              class="px-4 py-2 text-sm text-[--text-secondary] hover:text-white transition-colors"
            >
              Mi cuenta
            </NuxtLink>
            <span class="px-3 py-1.5 text-xs text-[--color-primary-light] font-medium bg-[--color-primary]/10 rounded-full">{{ user?.fullName }}</span>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="px-4 py-2 text-sm text-[--text-secondary] hover:text-white transition-colors"
            >
              Iniciar sesión
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="group relative px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:translate-y-[-1px] btn-press"
            >
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-[--color-primary] to-[--color-primary-light] shadow-lg shadow-[--color-primary]/30 group-hover:shadow-[--color-primary]/50 group-hover:translate-y-[-1px] transition-all duration-200"/>
              <span class="relative">Registrarse</span>
            </NuxtLink>
          </template>
        </div>

        <button
          class="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-200"
          :aria-label="isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          :aria-expanded="isMobileMenuOpen"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="mobile-menu-enter-active"
      leave-active-class="mobile-menu-leave-active"
      enter-from-class="mobile-menu-enter-from"
      leave-to-class="mobile-menu-leave-to"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden bg-[--bg-surface]/95 backdrop-blur-[24px] -webkit-backdrop-blur-[24px] border-b border-white/[0.03]"
      >
        <div class="px-4 py-5 space-y-1">
          <div
            v-for="(link, index) in navLinks"
            :key="link.to"
            class="nav-link"
            :style="{ '--index': index }"
          >
            <NuxtLink
              :to="link.to"
              class="flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200"
              :class="[
                isActiveLink(link.to, link.exact)
                  ? 'text-white bg-white/[0.08]'
                  : 'text-[--text-secondary] hover:text-white hover:bg-white/[0.05]'
              ]"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <div class="pt-4 mt-4 border-t border-white/[0.08] space-y-3">
            <template v-if="isAuthenticated">
              <NuxtLink
                to="/app"
                class="flex items-center gap-3 px-4 py-3 text-sm text-[--text-secondary] hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                @click="closeMobileMenu"
              >
                Mi cuenta
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="flex items-center gap-3 px-4 py-3 text-sm text-[--text-secondary] hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                @click="closeMobileMenu"
              >
                Iniciar sesión
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-br from-[--color-primary] to-[--color-primary-light] rounded-xl shadow-lg shadow-[--color-primary]/20 transition-all duration-200 hover:shadow-[--color-primary]/30 btn-press"
                @click="closeMobileMenu"
              >
                Registrarse
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-menu-enter-active {
  animation: mobileMenuSlideIn 300ms var(--ease-out) forwards;
}

.mobile-menu-leave-active {
  animation: mobileMenuSlideOut 200ms var(--ease-out) forwards;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes mobileMenuSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes mobileMenuSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.nav-link {
  animation: navLinkFadeIn 200ms var(--ease-out) forwards;
  animation-delay: calc(var(--index) * 50ms);
  opacity: 0;
}

@keyframes navLinkFadeIn {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active,
  .nav-link {
    animation: none;
    opacity: 1;
  }
}
</style>