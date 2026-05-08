<template>
  <div class="min-h-screen bg-[--bg-base] flex flex-col">
    <LandingHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LandingFooter />
    <LandingMobileNav />
  </div>
</template>