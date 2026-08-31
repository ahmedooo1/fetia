<script setup lang="ts">
const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMsg = ref(route.query.expired === '1' ? 'Ta session a expiré, reconnecte-toi.' : '')
const loading = ref(false)
const needsVerification = ref(false)
const resendState = ref<'idle' | 'sending' | 'sent'>('idle')

async function submit() {
  loading.value = true
  errorMsg.value = ''
  needsVerification.value = false
  resendState.value = 'idle'
  try {
    const res = await request<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    auth.setSession(res.accessToken, res.user)
    router.push((route.query.redirect as string) || '/dashboard')
  } catch (e: any) {
    if (e?.data?.message === 'EMAIL_NOT_VERIFIED') {
      needsVerification.value = true
    } else {
      errorMsg.value = 'Email ou mot de passe incorrect.'
    }
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  resendState.value = 'sending'
  try {
    await request('/auth/resend-verification', { method: 'POST', body: { email: email.value } })
  } finally {
    resendState.value = 'sent'
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Content de te revoir</h1>
    <p class="mt-2 font-body text-sm text-cream/60">Connecte-toi pour retrouver tes cartes.</p>

    <form class="mt-8 space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block font-body text-sm text-cream/80">Email</label>
        <input v-model="email" type="email" required class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
      </div>
      <div>
        <div class="mb-1.5 flex items-center justify-between">
          <label class="block font-body text-sm text-cream/80">Mot de passe</label>
          <NuxtLink to="/forgot-password" class="font-body text-xs text-gold underline">Oublie ?</NuxtLink>
        </div>
        <input v-model="password" type="password" required class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
      </div>
      <p v-if="errorMsg" class="font-body text-sm text-coral">{{ errorMsg }}</p>
      <div v-if="needsVerification" class="rounded-xl border border-gold/30 bg-gold/10 p-3 font-body text-sm text-cream/80">
        <p>Confirme ton adresse email avant de te connecter (vérifie tes spams).</p>
        <button
          type="button"
          :disabled="resendState !== 'idle'"
          class="mt-1.5 font-medium text-gold underline disabled:no-underline disabled:opacity-60"
          @click="resendVerification"
        >
          {{ resendState === 'sent' ? 'Email renvoyé ✓' : resendState === 'sending' ? 'Envoi…' : "Renvoyer l'email de confirmation" }}
        </button>
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="focus-ring w-full rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3.5 font-display font-bold text-ink disabled:opacity-60"
      >
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p class="mt-6 text-center font-body text-sm text-cream/60">
      Pas encore de compte ?
      <NuxtLink to="/register" class="text-gold underline">Inscris-toi</NuxtLink>
    </p>
  </main>
</template>
