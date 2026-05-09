import { useCookieConsentStore } from '~/stores/cookie-consent.store'

export default defineNuxtPlugin((nuxtApp) => {
  const consentStore = useCookieConsentStore()

  nuxtApp.hook('page:finish', () => {
    consentStore.checkConsent()
  })
})