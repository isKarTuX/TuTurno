interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface Toast extends ToastOptions {
  id: string
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function show(options: ToastOptions) {
    const id = crypto.randomUUID()
    const toast: Toast = {
      id,
      type: 'info',
      duration: 3000,
      ...options,
    }

    toasts.value.push(toast)

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, toast.duration)
    }

    return id
  }

  function remove(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number) {
    return show({ message, type: 'success', duration })
  }

  function error(message: string, duration?: number) {
    return show({ message, type: 'error', duration: duration ?? 5000 })
  }

  function warning(message: string, duration?: number) {
    return show({ message, type: 'warning', duration })
  }

  function info(message: string, duration?: number) {
    return show({ message, type: 'info', duration })
  }

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
}