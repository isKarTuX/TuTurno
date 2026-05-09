import { defineStore } from 'pinia'

interface CookieConsent {
  necessary: boolean
  functional: boolean
  analytical: boolean
  performance: boolean
}

export const useCookieConsentStore = defineStore('cookieConsent', () => {
  const hasConsented = ref(false)
  const isVisible = ref(false)

  function checkConsent() {
    if (import.meta.client) {
      const consent = localStorage.getItem('tuTurnoConsent')
      hasConsented.value = !!consent
      if (!consent) {
        setTimeout(() => { isVisible.value = true }, 1000)
      }
    }
  }

  function acceptAll() {
    const prefs: CookieConsent = { necessary: true, functional: true, analytical: true, performance: true }
    localStorage.setItem('tuTurnoConsent', JSON.stringify(prefs))
    hasConsented.value = true
    isVisible.value = false
  }

  function rejectAll() {
    const prefs: CookieConsent = { necessary: true, functional: false, analytical: false, performance: false }
    localStorage.setItem('tuTurnoConsent', JSON.stringify(prefs))
    hasConsented.value = true
    isVisible.value = false
  }

  function savePreferences(prefs: CookieConsent) {
    localStorage.setItem('tuTurnoConsent', JSON.stringify(prefs))
    hasConsented.value = true
    isVisible.value = false
  }

  function showBanner() {
    isVisible.value = true
  }

  return { hasConsented, isVisible, checkConsent, acceptAll, rejectAll, savePreferences, showBanner }
})