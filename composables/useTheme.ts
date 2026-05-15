import type { Theme } from '~/types'

export function useTheme() {
  const colorMode = useColorMode()

  const theme = computed<Theme>(() => (colorMode.value === 'dark' || colorMode.value === 'light') 
    ? colorMode.value as Theme 
    : 'dark')

  function setTheme(newTheme: Theme) {
    colorMode.preference = newTheme
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    if (import.meta.server) return

    const savedTheme = localStorage.getItem('tuturno-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      colorMode.preference = savedTheme
      return
    }

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    colorMode.preference = systemPrefersDark ? 'dark' : 'light'
  }

  function watchSystemPreference() {
    if (import.meta.server) return

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('tuturno-theme')) {
        colorMode.preference = e.matches ? 'dark' : 'light'
      }
    })
  }

  onMounted(() => {
    initTheme()
    watchSystemPreference()
  })

  return {
    theme,
    setTheme,
    toggleTheme,
    initTheme,
  }
}