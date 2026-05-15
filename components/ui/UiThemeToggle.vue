<script setup lang="ts">
const { theme, toggleTheme } = useTheme()

const label = computed(() =>
  theme.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
)
</script>

<template>
  <button
    type="button"
    class="relative w-11 h-11 rounded-xl glass border border-white/10 hover:bg-white/5 transition-all duration-200 flex items-center justify-center group"
    :aria-label="label"
    @click="toggleTheme"
  >
    <div class="relative w-5 h-5 overflow-hidden">
      <Transition name="icon-fade" mode="out-in">
        <Icon
          v-if="theme === 'dark'"
          name="sun"
          class="w-5 h-5 text-amber-400 absolute inset-0 transition-all duration-300"
        />
        <Icon
          v-else
          name="moon"
          class="w-5 h-5 text-slate-600 absolute inset-0 transition-all duration-300"
        />
      </Transition>
    </div>
  </button>
</template>

<style scoped>
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 200ms var(--ease-out);
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.7);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.7);
}
</style>