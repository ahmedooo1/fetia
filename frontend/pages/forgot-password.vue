<script setup lang="ts">
const { request } = useApi()

const email = ref('')
const loading = ref(false)
const done = ref(false)
const errorMsg = ref('')

async function submit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await request('/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    done.value = true
  } catch (e) {
    errorMsg.value = "Un probleme est survenu, reessaie dans quelques instants."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Mot de passe oublie</h1>
    <p class="mt-2 font-body text-sm text-cream/60">
      Indique ton email, on t'envoie un lien pour en choisir un nouveau.
    </p>

    <div v-if="done" class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="font-display text-xl font-bold text-cream">Email envoye</p>
      <p class="mt-2 font-body text-sm text-cream/60">
        Si un compte existe avec cet email, tu vas recevoir un lien de reinitialisation.
      </p>
    </div>

    <form v-else class="mt-8 space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block font-body text-sm text-cream/80">Email</label>
        <input v-model="email" type="email" required class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
      </div>
      <p v-if="errorMsg" class="font-body text-sm text-coral">{{ errorMsg }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="focus-ring w-full rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3.5 font-display font-bold text-ink disabled:opacity-60"
      >
        {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
      </button>
    </form>

    <p class="mt-6 text-center font-body text-sm text-cream/60">
      <NuxtLink to="/login" class="text-gold underline">Retour a la connexion</NuxtLink>
    </p>
  </main>
</template>
