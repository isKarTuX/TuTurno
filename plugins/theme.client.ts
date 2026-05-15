export default defineNuxtPlugin(() => {
  const savedTheme = localStorage.getItem('tuturno-theme')

  if (!savedTheme) {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    useColorMode().preference = systemPrefersDark ? 'dark' : 'light'
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('tuturno-theme')) {
      useColorMode().preference = e.matches ? 'dark' : 'light'
    }
  })
})