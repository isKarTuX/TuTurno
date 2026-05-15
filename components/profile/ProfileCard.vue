<script setup lang="ts">
import type { User } from '~/types'

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update', field: string, value: string): void
}>()

const initials = computed(() => {
  const names = props.user.fullName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return names[0].slice(0, 2).toUpperCase()
})

const editingField = ref<string | null>(null)
const editValue = ref('')

function startEdit(field: string, value: string) {
  editingField.value = field
  editValue.value = value
}

function cancelEdit() {
  editingField.value = null
  editValue.value = ''
}

function saveEdit() {
  if (editingField.value) {
    emit('update', editingField.value, editValue.value)
  }
  cancelEdit()
}

const fields = computed(() => [
  {
    key: 'fullName',
    label: 'Nombre completo',
    value: props.user.fullName,
    editable: true,
  },
  {
    key: 'email',
    label: 'Correo electrónico',
    value: props.user.email,
    editable: false,
  },
  {
    key: 'phone',
    label: 'Teléfono',
    value: props.user.phone,
    editable: true,
  },
  {
    key: 'documentId',
    label: 'Número de cédula',
    value: props.user.documentId,
    editable: false,
  },
])
</script>

<template>
  <div class="glass rounded-2xl p-6">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
        <span class="text-2xl font-bold text-primary">{{ initials }}</span>
      </div>
      <div>
        <h2 class="text-xl font-semibold text-white">{{ user.fullName }}</h2>
        <p class="text-white/50">{{ user.email }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="field in fields"
        :key="field.key"
        class="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
      >
        <div>
          <p class="text-sm text-white/50">{{ field.label }}</p>
          <p v-if="editingField !== field.key" class="text-white">
            {{ field.value }}
          </p>
          <input
            v-else
            v-model="editValue"
            type="text"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
          />
        </div>

        <div class="flex items-center gap-2">
          <template v-if="editingField === field.key">
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              @click="cancelEdit"
            >
              <Icon name="x" class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
              @click="saveEdit"
            >
              <Icon name="check" class="w-4 h-4" />
            </button>
          </template>

          <button
            v-else-if="field.editable"
            type="button"
            class="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
            @click="startEdit(field.key, field.value)"
          >
            <Icon name="pencil" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>