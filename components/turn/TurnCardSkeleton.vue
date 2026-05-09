<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 1,
})
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="glass rounded-3xl p-6"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/5 animate-pulse" />
          <div class="space-y-2">
            <div class="h-4 w-32 bg-white/5 rounded animate-pulse" />
            <div class="h-3 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div class="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
      </div>

      <div class="mb-4">
        <div class="h-10 w-24 bg-white/5 rounded animate-pulse" />
      </div>

      <div class="mb-4">
        <div class="h-2 w-full bg-white/5 rounded-full animate-pulse" />
        <div class="h-3 w-32 mt-2 bg-white/5 rounded animate-pulse" />
      </div>

      <div class="flex gap-2 pt-4 border-t border-white/5">
        <div class="w-20 h-8 bg-white/5 rounded-lg animate-pulse" />
        <div class="flex-1 h-8 bg-white/5 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
</template>