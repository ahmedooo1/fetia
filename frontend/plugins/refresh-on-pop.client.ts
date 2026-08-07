import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const router = useRouter()
    window.addEventListener('popstate', () => {
      const route = router.currentRoute
      if (route && route.value) {
        router.replace(route.value.fullPath).catch(() => undefined)
      }
    })
  }
})
