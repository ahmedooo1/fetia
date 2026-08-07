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
    photoUrl?: string
    eventAt?: string
    musicUrl?: string
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
  photoUrl: '',
  eventAt: '',
  musicUrl: '',
  timeline: [] as TimelineItem[],
})

const uploadingPhoto = ref(false)

const previewRef = ref()
const { downloading, downloadError, downloadImage } = useCardDownload(previewRef)

async function onPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingPhoto.value = true
  errorMsg.value = ''
  try {
    const config = useRuntimeConfig()
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>(`${config.public.apiBase}/uploads`, {
      method: 'POST',
      body: fd,
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    })
    form.photoUrl = res.url
  } catch (err) {
    errorMsg.value = "L'upload de la photo a échoué (jpg, png ou webp, 20 Mo max)."
  } finally {
    uploadingPhoto.value = false
    input.value = ''
  }
}

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
    form.photoUrl = d?.photoUrl || ''
    form.eventAt = d?.eventAt || ''
    form.musicUrl = d?.musicUrl || ''
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
    errorMsg.value = "L'enregistrement a échoué. Réessaie dans un instant."
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
        <p class="mt-2 font-body text-sm text-cream/60">Modèle &laquo; {{ template.name }} &raquo;</p>

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
              placeholder="On célèbre Lina !"
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
                placeholder="Salle des fêtes, Elbeuf"
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
            <p class="mb-3 font-body text-sm font-medium text-cream/80">Photo (optionnelle)</p>
            <div class="flex items-center gap-4">
              <div v-if="form.photoUrl" class="h-20 w-16 overflow-hidden rounded-t-full border-2 border-gold/40">
                <img :src="form.photoUrl.startsWith('http') ? form.photoUrl : `${$config.public.apiBase.replace(/\/api\/?$/, '')}${form.photoUrl}`" alt="" class="h-full w-full object-cover" />
              </div>
              <div class="flex-1 space-y-2">
                <label class="focus-ring inline-block cursor-pointer rounded-full bg-white/10 px-4 py-2 font-body text-xs text-cream/80 transition hover:bg-white/15">
                  {{ uploadingPhoto ? 'Envoi...' : form.photoUrl ? 'Changer la photo' : 'Ajouter une photo' }}
                  <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" :disabled="uploadingPhoto" @change="onPhotoSelected" />
                </label>
                <button v-if="form.photoUrl" type="button" class="block font-body text-xs text-coral/70 underline" @click="form.photoUrl = ''">
                  Retirer
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Jour J (compte a rebours)</label>
              <input
                v-model="form.eventAt"
                type="datetime-local"
                class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream [color-scheme:dark]"
              />
            </div>
            <div>
              <label class="mb-1.5 block font-body text-sm font-medium text-cream/80">Musique (URL mp3, optionnel)</label>
              <input
                v-model="form.musicUrl"
                type="url"
                placeholder="https://.../musique.mp3"
                class="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-cream placeholder:text-cream/30"
              />
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <label class="flex items-center gap-2 font-body text-sm font-medium text-cream/80">
              <input v-model="showTimeline" type="checkbox" class="accent-gold" />
              Ajouter un programme (déroulé de la journée)
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
                + Ajouter une étape
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
          {{ saving ? 'Un instant...' : editingCardId ? 'Enregistrer les modifications' : template.isPremium ? `Débloquer pour ${(template.priceCents / 100).toFixed(2)} €` : 'Obtenir mon lien' }}
        </button>
      </div>

      <div class="mx-auto w-full max-w-sm md:sticky md:top-28 md:self-start">
        <div class="overflow-hidden rounded-3xl shadow-xl ring-1 ring-white/10">
          <MagicExperience
            ref="previewRef"
            force-open
            compact
            :accent="(template.defaultData?.accent as any) || 'gold'"
            :title="form.title"
            :subtitle="form.subtitle"
            :message="form.message"
            :date="form.date"
            :location="form.location"
            :closing="form.closing"
            :photo-url="form.photoUrl"
            :event-at="form.eventAt"
            :timeline="showTimeline ? form.timeline : []"
          />
        </div>
        <div class="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            :disabled="downloading"
            class="focus-ring rounded-full bg-white/5 px-4 py-2 font-body text-xs font-semibold text-cream/80 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-60"
            @click="downloadImage(form.title)"
          >
            {{ downloading ? 'Préparation...' : 'Télécharger l\'image' }}
          </button>
        </div>
        <p v-if="downloadError" class="mt-2 text-center font-body text-xs text-coral">{{ downloadError }}</p>
      </div>
    </div>
  </main>
</template>
