<script setup lang="ts">
interface TimelineItem {
  time: string
  label: string
}

interface Template {
  id: string
  name: string
  category: string
  designKey: string
  isPremium: boolean
  priceCents: number
  defaultData: {
    title?: string
    subtitle?: string
    message?: string
    accent?: string
    date?: string
    location?: string
    closing?: string
    timeline?: TimelineItem[]
  }
}

const route = useRoute()
const router = useRouter()
const { request } = useApi()
const auth = useAuthStore()

const template = ref<Template | null>(null)
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const showTimeline = ref(false)
const editingCardId = computed(() => (route.query.card as string) || '')

const form = reactive({
  title: '',
  subtitle: '',
  message: '',
  date: '',
  location: '',
  closing: '',
  timeline: [] as TimelineItem[],
})

onMounted(async () => {
  try {
    template.value = await request<Template>(`/templates/${route.params.id}`)
    let d: any = template.value?.defaultData
    if (editingCardId.value) {
      auth.restore()
      const existing = await request<{ data: any }>(`/cards/${editingCardId.value}`, { auth: true })
      d = existing.data
    }
    form.title = d?.title || ''
    form.subtitle = d?.subtitle || ''
    form.message = d?.message || ''
    form.date = d?.date || ''
    form.location = d?.location || ''
    form.closing = d?.closing || ''
    form.timeline = d?.timeline ? d.timeline.map((t: TimelineItem) => ({ ...t })) : []
    showTimeline.value = Boolean(d?.timeline?.length)
  } catch (e) {
    errorMsg.value = 'Ce modele est introuvable.'
  } finally {
    loading.value = false
  }
})

function addTimelineStep() {
  form.timeline.push({ time: '', label: '' })
}
function removeTimelineStep(i: number) {
  form.timeline.splice(i, 1)
}

async function saveCard() {
  if (!template.value) return
  if (!auth.user) {
    router.push(`/login?redirect=/editor/${template.value.id}`)
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    const payloadData = {
      ...form,
      timeline: showTimeline.value ? form.timeline.filter((t) => t.time || t.label) : [],
      accent: template.value.defaultData?.accent,
    }

    if (editingCardId.value) {
      const updated = await request<{ slug: string }>(`/cards/${editingCardId.value}`, {
        method: 'PATCH',
        auth: true,
        body: { data: payloadData },
      })
      router.push(`/c/${updated.slug}`)
      return
    }

    const card = await request<{ id: string; slug: string }>('/cards', {
      method: 'POST',
      auth: true,
      body: {
        templateId: template.value.id,
        data: payloadData,
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
        <h1 class="font-display text-3xl font-bold text-cream">{{ editingCardId ? 'Modifie ta carte' : 'Personnalise ta carte' }}</h1>
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
              rows="3"
              class="focus-ring w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
              placeholder="Ecris ton message ici..."
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Date</label>
              <input
                v-model="form.date"
                type="text"
                class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
                placeholder="14 juin 2026"
              />
            </div>
            <div>
              <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Lieu</label>
              <input
                v-model="form.location"
                type="text"
                class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
                placeholder="Salle des fetes, Elbeuf"
              />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Mot de fin</label>
            <input
              v-model="form.closing"
              type="text"
              class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
              placeholder="On a hate de te voir !"
            />
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <label class="flex items-center gap-2 font-body text-sm font-medium text-cream/80">
              <input v-model="showTimeline" type="checkbox" class="accent-gold" />
              Ajouter un programme (deroule de la journee)
            </label>

            <div v-if="showTimeline" class="mt-4 space-y-3">
              <div v-for="(step, i) in form.timeline" :key="i" class="flex items-center gap-2">
                <input
                  v-model="step.time"
                  type="text"
                  placeholder="18h00"
                  class="focus-ring w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-cream placeholder:text-cream/30"
                />
                <input
                  v-model="step.label"
                  type="text"
                  placeholder="Cocktail"
                  class="focus-ring flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream placeholder:text-cream/30"
                />
                <button type="button" class="focus-ring shrink-0 text-cream/40 hover:text-coral" aria-label="Supprimer" @click="removeTimelineStep(i)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                </button>
              </div>
              <button type="button" class="focus-ring font-body text-xs font-medium text-gold underline" @click="addTimelineStep">
                + Ajouter une etape
              </button>
            </div>
          </div>
        </div>

        <p v-if="errorMsg" class="mt-4 font-body text-sm text-coral">{{ errorMsg }}</p>

        <button
          class="focus-ring mt-8 w-full rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3.5 font-display font-bold text-ink shadow-lg shadow-coral/20 transition hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
          :disabled="saving"
          @click="saveCard"
        >
          {{ saving ? 'Un instant...' : editingCardId ? 'Enregistrer les modifications' : template.isPremium ? `Debloquer pour ${(template.priceCents / 100).toFixed(2)} €` : 'Obtenir mon lien' }}
        </button>
      </div>

      <div class="mx-auto w-full max-w-sm md:sticky md:top-28 md:self-start">
        <div class="overflow-hidden rounded-3xl shadow-xl ring-1 ring-white/10">
          <MagicExperience
            force-open
            compact
            :accent="(template.defaultData?.accent as any) || 'gold'"
            :title="form.title"
            :subtitle="form.subtitle"
            :message="form.message"
            :date="form.date"
            :location="form.location"
            :closing="form.closing"
            :timeline="showTimeline ? form.timeline : []"
          />
        </div>
      </div>
    </div>
  </main>
</template>
