import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(options: {
  threshold?: number
  rootMargin?: string
  once?: boolean
} = {}) {
  const { threshold = 0.1, rootMargin = '-50px', once = true } = options
  const observer = ref<IntersectionObserver | null>(null)

  function setupObserver() {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')

            if (once) {
              observer.value?.unobserve(entry.target)
            }
          } else if (!once) {
            entry.target.classList.remove('in-view')
          }
        })
      },
      { threshold, rootMargin }
    )
  }

  function observe(element: Element | null) {
    if (!element || !observer.value) return
    element.classList.add('reveal')
    observer.value.observe(element)
  }

  function observeAll(selector: string, container: Element | Document = document) {
    const elements = container.querySelectorAll(selector)
    elements.forEach((el) => observe(el))
  }

  function unobserve(element: Element) {
    observer.value?.unobserve(element)
  }

  function disconnect() {
    observer.value?.disconnect()
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    observeAll,
    unobserve,
    disconnect,
    observer,
  }
}

export function useParallax(element: Ref<HTMLElement | null>, speed: number = 0.5) {
  const transform = ref('')

  function update() {
    if (!element.value) return
    const scrolled = window.scrollY
    const rate = scrolled * speed
    transform.value = `translateY(${rate}px)`
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', update)
  })

  return { transform }
}
