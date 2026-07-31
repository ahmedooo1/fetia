<script setup lang="ts">
interface Template {
  id: string
  name: string
  category: string
  designKey: string
  isPremium: boolean
  priceCents: number
  defaultData: { title?: string; subtitle?: string; message?: string; accent?: string }
}

const route = useRoute()
const router = useRouter()
const { request } = useApi()
const auth = useAuthStore()

const template = ref<Template | null>(null)
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')

const form = reactive({
  title: '',
  subtitle: '',
  message: '',
})

onMounted(async () => {
  try {
    template.value = await request<Template>(`/templates/${route.params.id}`)
    form.title = template.value?.defaultData?.title || ''
    form.subtitle = template.value?.defaultData?.subtitle || ''
    form.message = template.value?.defaultData?.message || ''
  } catch (e) {
    errorMsg.value = 'Ce modele est introuvable.'
  } finally {
    loading.value = false
  }
})

async function saveCard() {
  if (!template.value) return
  if (!auth.user) {
    router.push(`/login?redirect=/editor/${template.value.id}`)
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    const card = await request<{ id: string; slug: string }>('/cards', {
      method: 'POST',
      auth: true,
      body: {
        templateId: template.value.id,
        data: { ...form, accent: template.value.defaultData?.accent },
      },
    })

    if (template.value.isPremium) {
      const session = await request<{ url: string }>('/payments/checkout-session', {
        method: 'POST',
        auth: true,
        body: { cardId: card.id },
      })
      if (session.url) {
        window.location.href = session.url
        return
      }
    }
    router.push(`/c/${card.slug}`)
  } catch (e) {
    errorMsg.value = "L'enregistrement a echoue. Reessaie dans un instant."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-14">
    <div v-if="loading" class="font-body text-cream/60">Chargement du modele...</div>

    <div v-else-if="!template" class="font-body text-coral">{{ errorMsg }}</div>

    <div v-else class="grid gap-12 md:grid-cols-2">
      <div>
        <h1 class="font-display text-3xl font-bold text-cream">Personnalise ta carte</h1>
        <p class="mt-2 font-body text-sm text-cream/60">Modele &laquo; {{ template.name }} &raquo;</p>

        <div class="mt-8 space-y-5">
          <div>
            <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Titre</label>
            <input
              v-model="form.title"
              type="text"
              class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
              placeholder="Joyeux anniversaire"
            />
          </div>
          <div>
            <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Sous-titre</label>
            <input
              v-model="form.subtitle"
              type="text"
              class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
              placeholder="On celebre Lina !"
            />
          </div>
          <div>
            <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Message</label>
            <textarea
              v-model="form.message"
              rows="4"
              class="focus-ring w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
              placeholder="Ecris ton message ici..."
            />
          </div>
        </div>

        <p v-if="errorMsg" class="mt-4 font-body text-sm text-coral">{{ errorMsg }}</p>

        <button
          class="focus-ring mt-8 w-full rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3.5 font-display font-bold text-ink shadow-lg shadow-coral/20 transition hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
          :disabled="saving"
          @click="saveCard"
        >
          {{ saving ? 'Un instant...' : template.isPremium ? `Debloquer pour ${(template.priceCents / 100).toFixed(2)} €` : 'Obtenir mon lien' }}
        </button>
      </div>

      <div class="mx-auto w-full max-w-sm md:sticky md:top-28 md:self-start">
        <CardCanvas
          :design-key="template.designKey"
          :title="form.title"
          :subtitle="form.subtitle"
          :message="form.message"
          :accent="(template.defaultData?.accent as any) || 'sunset'"
        />
      </div>
    </div>
  </main>
</template>
