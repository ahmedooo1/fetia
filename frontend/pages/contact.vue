<script setup lang="ts">
useHead({ title: 'Nous contacter - Fetia' })

const { request } = useApi()

const name = ref('')
const email = ref('')
const message = ref('')
const website = ref('') // honeypot, doit rester vide
const startedAt = ref(0)

const sending = ref(false)
const done = ref(false)
const errorMsg = ref('')

onMounted(() => {
  startedAt.value = Date.now()
})

async function submit() {
  sending.value = true
  errorMsg.value = ''
  try {
    await request('/contact', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        website: website.value,
        startedAt: startedAt.value,
      },
    })
    done.value = true
  } catch (e) {
    errorMsg.value = "L'envoi a echoue, reessaie dans quelques instants."
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Nous contacter</h1>
    <p class="mt-2 font-body text-sm text-cream/60">Une question, une idee, un probleme ? Ecris-nous.</p>

    <div v-if="done" class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="font-display text-xl font-bold text-cream">Message envoye</p>
      <p class="mt-2 font-body text-sm text-cream/60">On te repond au plus vite.</p>
    </div>

    <form v-else class="mt-8 space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block font-body text-sm text-cream/80">Nom</label>
        <input v-model="name" type="text" required maxlength="80" class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
      </div>
      <div>
        <label class="mb-1.5 block font-body text-sm text-cream/80">Email</label>
        <input v-model="email" type="email" required maxlength="160" class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
      </div>
      <div>
        <label class="mb-1.5 block font-body text-sm text-cream/80">Message</label>
        <textarea v-model="message" required minlength="10" maxlength="3000" rows="5" class="focus-ring w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream" />
      </div>

      <!-- honeypot : invisible pour un humain, les bots le remplissent -->
      <div class="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label for="website">Site web</label>
        <input id="website" v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" />
      </div>

      <p v-if="errorMsg" class="font-body text-sm text-coral">{{ errorMsg }}</p>

      <button
        type="submit"
        :disabled="sending"
        class="focus-ring w-full rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3.5 font-display font-bold text-ink disabled:opacity-60"
      >
        {{ sending ? 'Envoi...' : 'Envoyer' }}
      </button>
    </form>
  </main>
</template>
