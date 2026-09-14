import type { Ref } from 'vue'

/** Enhance below-the-fold content only; server-rendered content stays visible. */
export function useScrollReveal(root: Ref<HTMLElement | null>): void {
  let observer: IntersectionObserver | undefined
  let preference: MediaQueryList | undefined
  const pending = new Set<HTMLElement>()

  function reset(): void {
    observer?.disconnect()
    for (const element of pending) element.classList.remove('reveal-pending')
    pending.clear()
  }

  function setup(): void {
    reset()
    if (!preference?.matches || !root.value || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const element = entry.target as HTMLElement
        element.classList.remove('reveal-pending')
        pending.delete(element)
        observer?.unobserve(element)
      }
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' })
    for (const section of root.value.children) {
      if (!(section instanceof HTMLElement) || section.classList.contains('hero')) continue
      const element = section.querySelector<HTMLElement>('.container') ?? section
      if (element.getBoundingClientRect().top < window.innerHeight) continue
      element.classList.add('scroll-reveal', 'reveal-pending')
      pending.add(element)
      observer.observe(element)
    }
  }

  onMounted(() => {
    preference = window.matchMedia('(min-width: 64rem) and (prefers-reduced-motion: no-preference)')
    preference.addEventListener('change', setup)
    setup()
  })
  onBeforeUnmount(() => {
    preference?.removeEventListener('change', setup)
    reset()
  })
}
