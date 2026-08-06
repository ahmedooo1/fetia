<script setup lang="ts">
const { request } = useApi()
const route = useRoute()
const router = useRouter()

const token = (route.query.token as string) || ''
const password = ref('')
const loading = ref(false)
const done = ref(false)
const errorMsg = ref('')

async function submit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await request('/auth/reset-password', { method: 'POST', body: { token, password: password.value } })
    done.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Ce lien est invalide ou a expire, redemande un nouveau lien.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Nouveau mot de passe</h1>

    <div v-if="!token" class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="font-body text-sm text-cream/60">Lien invalide.</p>
      <NuxtLink to="/forgot-password" class="mt-3 inline-block text-sm text-gold underline">Redemander un lien</NuxtLink>
    </div>

    <div v-else-if="done" class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="font-display text-xl font-bold text-cream">Mot de passe mis a jour</p>
      <p class="mt-2 font-body text-sm text-cream/60">Redirection vers la connexion...</p>
    </div>

    <form v-else class="mt-8 space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block font-body text-sm text-cream/80">Nouveau mot de passe</label>
        <input v-model="password" type="password" required minlength="8" class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
        <p class="mt-1.5 font-body text-xs text-cream/40">Au moins 8 caracteres, une lettre et un chiffre.</p>
      </div>
      <p v-if="errorMsg" class="font-body text-sm text-coral">{{ errorMsg }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="focus-ring w-full rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3.5 font-display font-bold text-ink disabled:opacity-60"
      >
        {{ loading ? 'Enregistrement...' : 'Changer le mot de passe' }}
      </button>
    </form>
  </main>
</template>
