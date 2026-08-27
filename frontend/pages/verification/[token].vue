<script setup lang="ts">
const { request } = useApi()
const route = useRoute()
const status = ref<'loading' | 'ok' | 'error'>('loading')
let fired = false

onMounted(() => {
  if (fired) return
  fired = true
  request('/auth/verify-email', { method: 'POST', body: { token: route.params.token } })
    .then(() => (status.value = 'ok'))
    .catch(() => (status.value = 'error'))
})
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <p v-if="status === 'loading'" class="font-body text-cream/60">Vérification en cours…</p>
      <template v-else-if="status === 'ok'">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-2xl">
          ✓
        </div>
        <h1 class="mt-4 font-display text-xl font-bold text-cream">Email confirmé</h1>
        <p class="mt-2 font-body text-sm text-cream/60">Ton adresse est vérifiée.</p>
        <NuxtLink
          to="/login"
          class="mt-6 inline-block rounded-full bg-gradient-to-r from-coral to-gold px-6 py-2.5 font-display font-bold text-ink"
        >
          Se connecter
        </NuxtLink>
      </template>
      <template v-else>
        <h1 class="font-display text-xl font-bold text-cream">Lien invalide ou expiré</h1>
        <p class="mt-2 font-body text-sm text-cream/60">Reconnecte-toi pour recevoir un nouveau lien.</p>
      </template>
    </div>
  </main>
</template>
