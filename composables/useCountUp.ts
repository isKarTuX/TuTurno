import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useCountUp(
  target: Ref<number>,
  duration: number = 1500,
) {
  const current = ref(0)
  const isAnimating = ref(false)
  let animationFrame: number | null = null

  function animate() {
    const startTime = performance.now()
    const startValue = current.value
    const endValue = target.value

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)

      current.value = Math.round(startValue + (endValue - startValue) * eased)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update)
      } else {
        isAnimating.value = false
      }
    }

    isAnimating.value = true
    animationFrame = requestAnimationFrame(update)
  }

  function stop() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
    isAnimating.value = false
  }

  onUnmounted(() => {
    stop()
  })

  return { current, animate, isAnimating, stop }
}

export function useCountUpObserver(
  elements: NodeListOf<Element> | Element[],
  options: {
    threshold?: number
    duration?: number
  } = {}
) {
  const { threshold = 0.3, duration = 1500 } = options
  let observer: IntersectionObserver | null = null

  function startCountUp(element: Element) {
    const targetEl = element as HTMLElement
    const targetValue = parseInt(targetEl.dataset.target || '0', 10)

    if (isNaN(targetValue)) return

    const counter = { value: 0 }
    const increment = targetValue / (duration / 16)

    function update() {
      counter.value += increment
      if (counter.value >= targetValue) {
        targetEl.textContent = targetValue.toLocaleString('es-CO')
        return
      }
      targetEl.textContent = Math.round(counter.value).toLocaleString('es-CO')
      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCountUp(entry.target)
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    elements.forEach((el) => observer?.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}