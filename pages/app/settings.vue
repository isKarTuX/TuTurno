<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'citizen',
})

const { theme, toggleTheme } = useTheme()

interface SettingsItem {
  label: string
  description: string
  icon: string
  action: string
  toggle?: boolean
  value?: boolean
}

interface SettingsSection {
  title: string
  items: SettingsItem[]
}

const settingsSections: SettingsSection[] = [
  {
    title: 'Apariencia',
    items: [
      {
        label: 'Tema',
        description: theme.value === 'dark' ? 'Oscuro' : 'Claro',
        icon: theme.value === 'dark' ? 'lucide:moon' : 'lucide:sun',
        action: 'theme',
      },
    ],
  },
  {
    title: 'Notificaciones',
    items: [
      {
        label: 'Notificaciones push',
        description: 'Alertas cuando tu turno esté cerca',
        icon: 'lucide:bell',
        action: 'push',
        toggle: true,
        value: false,
      },
      {
        label: 'Correo electrónico',
        description: 'Resumen diario de turnos',
        icon: 'lucide:mail',
        action: 'email',
        toggle: true,
        value: false,
      },
    ],
  },
  {
    title: 'Aplicación',
    items: [
      {
        label: 'Versión',
        description: '1.0.0',
        icon: 'lucide:info',
        action: 'version',
      },
    ],
  },
]

function handleAction(action: string) {
  if (action === 'theme') {
    toggleTheme()
  }
}
</script>

<template>
  <div class="space-y-6 pb-24 lg:pb-6">
    <header class="flex items-center gap-4">
      <NuxtLink
        to="/app/profile"
        class="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Icon name="lucide:arrow-left" class="w-5 h-5 text-white/70" />
      </NuxtLink>
      <h1 class="text-2xl font-display font-bold text-white">Configuración</h1>
    </header>

    <div class="space-y-6">
      <div
        v-for="section in settingsSections"
        :key="section.title"
        class="glass rounded-2xl p-6"
      >
        <h2 class="text-sm font-semibold uppercase tracking-[0.15em] text-[--text-muted] mb-4">
          {{ section.title }}
        </h2>
        <div class="space-y-2">
          <div
            v-for="item in section.items"
            :key="item.label"
            class="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            @click="handleAction(item.action)"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon :name="item.icon" class="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p class="font-medium text-white">{{ item.label }}</p>
                <p class="text-sm text-white/50">{{ item.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UiToggle
                v-if="item.toggle"
                :model-value="item.value ?? false"
                @click.stop
              />
              <Icon
                v-else
                name="lucide:chevron-right"
                class="w-5 h-5 text-white/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center py-8">
      <p class="text-sm text-[--text-muted]">TuTurno</p>
      <p class="text-xs text-[--text-muted] mt-1">Hecho en Colombia</p>
    </div>
  </div>
</template>