export function usePushNotifications() {
  const notifications = useNotifications()
  const toast = useToast()

  const isEnabled = computed(() => notifications.isSubscribed.value)

  async function requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      toast.error('Tu navegador no soporta notificaciones push')
      return false
    }

    if (Notification.permission === 'denied') {
      toast.error('Notificaciones bloqueadas. Por favor habilita las notificaciones en tu navegador')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      toast.warning('Permiso denegado. No pudimos habilitar las notificaciones')
      return false
    }

    return true
  }

  async function enable(): Promise<boolean> {
    const hasPermission = await requestPermission()
    if (!hasPermission) return false

    const sub = await notifications.subscribe()
    if (sub) {
      toast.success('Notificaciones activadas. Recibirás alertas cuando te llamen')
      return true
    }

    return false
  }

  async function disable(): Promise<void> {
    await notifications.unsubscribe()
    toast.info('Notificaciones desactivadas. Ya no recibirás alertas')
  }

  function showNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/icons/icon-192x192.png',
        tag: 'tuturno-notification',
      })
    }

    toast.info(`${title}: ${body}`)
  }

  return {
    isSupported: notifications.isSupported,
    isSubscribed: notifications.isSubscribed,
    isEnabled,
    requestPermission,
    enable,
    disable,
    showNotification,
  }
}