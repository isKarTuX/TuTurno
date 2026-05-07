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
  { value: '', label: 'Todos los tipos' },
  { value: 'eps', label: 'EPS' },
  { value: 'bank', label: 'Banco' },
  { value: 'public_office', label: 'Oficina Pública' },
  { value: 'other', label: 'Otro' },
]

function emitUpdate() {
  emit('update:modelValue', {
    search: localSearch.value,
    type: localType.value,
  })
}

function handleSearch() {
  emitUpdate()
  emit('search')
}
</script>

<template>
  <div class="flex gap-3 mb-6">
    <input
      v-model="localSearch"
      type="text"
      placeholder="Buscar entidad..."
      class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[--text-muted] focus:border-[--color-primary] focus:outline-none transition-colors"
      @keyup.enter="handleSearch"
    />

    <select
      v-model="localType"
      class="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[--color-primary] focus:outline-none transition-colors"
    >
      <option v-for="t in types" :key="t.value" :value="t.value">
        {{ t.label }}
      </option>
    </select>

    <button
      @click="handleSearch"
      class="px-6 py-3 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white font-semibold rounded-lg transition-colors"
    >
      Buscar
    </button>
  </div>
</template>