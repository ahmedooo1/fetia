export function useScrollReveal() {
  const target = ref<HTMLElement | null>(null)
  const visible = ref(false)

  onMounted(() => {
    if (!target.value) {
      visible.value = true
      return
    }
    if (!('IntersectionObserver' in window)) {
      visible.value = true
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.value = true
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(target.value)
  })

  return { target, visible }
}
