import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const router = useRouter()
    window.addEventListener('popstate', () => {
      // small async delay to let browser update window.location
      setTimeout(() => {
        try {
          const route = router.currentRoute
          const current = route && route.value ? route.value.fullPath : null
          const href = window.location.pathname + window.location.search + window.location.hash

          // If the router thinks we're already on the same path, force a hard reload
          if (!current || current === href) {
            window.location.reload()
            return
          }

          // Otherwise, navigate programmatically to ensure components/meta update
          router.replace(href).catch(() => {
            // fallback to full reload if router replacement fails
            window.location.reload()
          })
        } catch {
          window.location.reload()
        }
      }, 50)
    })
  }
})
