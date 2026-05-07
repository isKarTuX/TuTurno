const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIopO0g8HEqHFpIzBj6aplDdCmyAxLKZ1vY9YXaVRGQ3Q2J_LCoreYYi-40MEikFV4wmIUTT1Y5M'

export function useNotifications() {
  const isSupported = ref(false)
  const isSubscribed = ref(false)
  const subscription = ref<PushSubscription | null>(null)

  async function checkSupport() {
    if (import.meta.server) {
      isSupported.value = false
      return false
    }
    isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window
    return isSupported.value
  }

  async function subscribe() {
    if (!isSupported.value) {
      console.warn('Push notifications not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready

      const existingSub = await registration.pushManager.getSubscription()
      if (existingSub) {
        subscription.value = existingSub
        isSubscribed.value = true
        return existingSub
      }

      const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      const newSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey as BufferSource,
      })

      subscription.value = newSub
      isSubscribed.value = true

      await saveSubscription(newSub)

      return newSub
    } catch (error) {
      console.error('Failed to subscribe:', error)
      return null
    }
  }

  async function unsubscribe() {
    if (!subscription.value) return

    try {
      await subscription.value.unsubscribe()
      subscription.value = null
      isSubscribed.value = false
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
  }

  async function saveSubscription(sub: PushSubscription) {
    const json = sub.toJSON()
    await $fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: {
        endpoint: json.endpoint,
        p256dh: json.keys?.p256dh,
        auth: json.keys?.auth,
      },
    })
  }

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return {
    isSupported,
    isSubscribed,
    subscription,
    checkSupport,
    subscribe,
    unsubscribe,
  }
}