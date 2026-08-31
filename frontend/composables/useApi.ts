export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function request<T>(
    path: string,
    options: { method?: string; body?: unknown; auth?: boolean } = {},
  ): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (options.auth && auth.token) {
      headers.Authorization = `Bearer ${auth.token}`
    }
    try {
      return await $fetch<T>(`${config.public.apiBase}${path}`, {
        method: (options.method as any) || 'GET',
        body: options.body as any,
        headers,
      })
    } catch (err: any) {
      // An expired/invalid token on an authenticated request looks like any
      // other failure to the caller (generic error, no redirect), leaving
      // the user stuck retrying a save that can never succeed. Clear the
      // dead session and send them to log back in instead.
      if (options.auth && err?.response?.status === 401) {
        auth.logout()
        const router = useRouter()
        const route = useRoute()
        router.push({ path: '/login', query: { expired: '1', redirect: route.fullPath } })
      }
      throw err
    }
  }

  return { request }
}
