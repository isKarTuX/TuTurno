<script setup lang="ts">
interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { name: string; email: string; subject: string; message: string }]
}>()

const form = reactive({
  name: props.name ?? '',
  email: props.email ?? '',
  subject: props.subject ?? '',
  message: props.message ?? '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const error = ref('')

const subjects = [
  { value: 'general', label: 'Consulta general' },
  { value: 'soporte', label: 'Soporte técnico' },
  { value: 'ventas', label: 'Quiero implementar TuTurno en mi entidad' },
  { value: 'prensa', label: 'Contacto de prensa' },
  { value: 'bug', label: 'Reportar un bug' },
  { value: 'otro', label: 'Otro' },
]

async function handleSubmit() {
  error.value = ''

  if (!form.name.trim()) { error.value = 'El nombre es requerido'; return }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { error.value = 'Email válido requerido'; return }
  if (!form.subject) { error.value = 'Selecciona un asunto'; return }
  if (!form.message.trim() || form.message.length < 10) { error.value = 'Mensaje muy corto (mínimo 10 caracteres)'; return }

  isSubmitting.value = true

  await new Promise((r) => setTimeout(r, 1500))

  isSubmitting.value = false
  isSuccess.value = true
  emit('submit', { ...form })

  Object.assign(form, { name: '', email: '', subject: '', message: '' })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">Nombre completo</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="María García López"
          class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 transition-all"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">Correo electrónico</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="maria@ejemplo.com"
          class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 transition-all"
        >
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-2">Asunto</label>
      <select
        v-model="form.subject"
        class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 transition-all appearance-none cursor-pointer"
      >
        <option value="" disabled class="bg-[--bg-surface]">Selecciona un asunto</option>
        <option v-for="s in subjects" :key="s.value" :value="s.value" class="bg-[--bg-surface]">
          {{ s.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-2">Mensaje</label>
      <textarea
        v-model="form.message"
        rows="5"
        placeholder="Cuéntanos en qué podemos ayudarte..."
        class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 transition-all resize-none"
      />
    </div>

    <p v-if="error" class="text-sm text-rose-400 flex items-center gap-2">
      <Icon name="lucide:alert-circle" class="w-4 h-4" />
      {{ error }}
    </p>

    <!-- Success state -->
    <div v-if="isSuccess" class="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
      <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
      <div>
        <p class="font-medium text-emerald-300">¡Mensaje enviado!</p>
        <p class="text-sm text-emerald-400/70 mt-0.5">Te responderemos en menos de 24 horas.</p>
      </div>
    </div>

    <button
      v-else
      type="submit"
      :disabled="isSubmitting"
      class="w-full btn btn-primary py-4 text-base"
    >
      <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
      <template v-else>
        <Icon name="lucide:send" class="w-4 h-4" />
        Enviar mensaje
      </template>
    </button>
  </form>
</template>