export function useLazyLoad(options: {
  threshold?: number
  rootMargin?: string
} = {}) {
  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    if (!el.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.disconnect()
          }
        })
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '100px',
      }
    )

    observer.observe(el.value)

    onUnmounted(() => observer.disconnect())
  })

  return { el, isVisible }
}