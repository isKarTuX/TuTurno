<script setup lang="ts">
interface Props {
  modelValue: {
    search?: string
    type?: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: { search?: string; type?: string }]
  'search': []
}>()

const localSearch = ref(props.modelValue.search || '')
const localType = ref(props.modelValue.type || '')

const types = [
  { value: '', label: 'Todas' },
  { value: 'eps', label: 'EPS' },
  { value: 'bank', label: 'Banco' },
  { value: 'public_office', label: 'Oficina' },
  { value: 'other', label: 'Otro' },
]

function handleSearch() {
  emit('update:modelValue', {
    search: localSearch.value,
    type: localType.value,
  })
  emit('search')
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="relative flex-1">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[--text-muted]">
        <Icon name="lucide:search" class="w-4 h-4" />
      </div>
      <input
        v-model="localSearch"
        type="text"
        placeholder="Buscar por nombre, ciudad o dirección..."
        class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-[--text-muted] focus:border-[--color-primary] focus:bg-white/[0.07] focus:outline-none transition-all duration-200 dark:bg-white/5 dark:border-white/10 dark:text-white"
        @keyup.enter="handleSearch"
      >
    </div>

    <div class="flex items-center gap-2">
      <div class="relative">
        <select
          v-model="localType"
          class="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[--color-primary] focus:outline-none transition-all duration-200 cursor-pointer dark:bg-white/5 dark:border-white/10"
        >
          <option v-for="t in types" :key="t.value" :value="t.value" class="bg-[--bg-elevated]">
            {{ t.label }}
          </option>
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[--text-muted]">
          <Icon name="lucide:chevron-down" class="w-4 h-4" />
        </div>
      </div>

      <button
        class="shrink-0 px-4 py-3 bg-gradient-to-r from-[--color-primary] to-[--color-accent] hover:from-[--color-primary-light] hover:to-[--color-accent] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[--color-primary]/20 hover:shadow-[--color-primary]/40 hover:scale-105 active:scale-95"
        @click="handleSearch"
      >
        <Icon name="lucide:search" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>