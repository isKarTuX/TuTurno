export function useShake(element: Ref<HTMLElement | null>) {
  const shake = () => {
    if (!element.value) return

    element.value.classList.add('animate-shake')
    setTimeout(() => {
      element.value?.classList.remove('animate-shake')
    }, 500)
  }

  return { shake }
}