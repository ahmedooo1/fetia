import { defineStore } from 'pinia'

interface PublicUser {
  id: string
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as PublicUser | null,
  }),
  actions: {
    setSession(token: string, user: PublicUser) {
      this.token = token
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('fetia_token', token)
        localStorage.setItem('fetia_user', JSON.stringify(user))
      }
    },
    restore() {
      if (import.meta.client) {
        const token = localStorage.getItem('fetia_token')
        const user = localStorage.getItem('fetia_user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    },
    logout() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('fetia_token')
        localStorage.removeItem('fetia_user')
      }
    },
  },
})
