<template>
  <div class="min-h-screen bg-[--bg-base] flex flex-col">
    <LayoutAppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
    <LayoutAppMobileNav />
  </div>
</template>