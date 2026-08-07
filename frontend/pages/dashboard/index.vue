<script setup lang="ts">
interface Card {
  id: string
  slug: string
  isUnlocked: boolean
  rsvpEnabled: boolean
  views: number
  data: { title?: string; accent?: string }
  template: { id?: string; designKey: string; name: string }
  createdAt: string
}

const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const cards = ref<Card[]>([])
const loading = ref(true)
const copiedId = ref('')
const deletingId = ref('')

onMounted(async () => {
  auth.restore()
  if (!auth.user) {
    router.push('/login?redirect=/dashboard')
    return
  }
  await load()
})

async function load() {
  loading.value = true
  try {
    cards.value = await request<Card[]>('/cards/mine', { auth: true })
  } finally {
    loading.value = false
  }
}

function cardUrl(slug: string) {
  return `${window.location.origin}/c/${slug}`
}

function copyLink(c: Card) {
  navigator.clipboard?.writeText(cardUrl(c.slug))
  copiedId.value = c.id
  setTimeout(() => {
    if (copiedId.value === c.id) copiedId.value = ''
  }, 1500)
}

function shareWhatsApp(c: Card) {
  const intro = c.data.title || 'Une surprise pour toi'
  const text = encodeURIComponent(`${intro} 🎉 Voici un petit cadeau pour toi 👉 ${cardUrl(c.slug)}`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

async function removeCard(c: Card) {
  if (!window.confirm(`Supprimer definitivement la carte "${c.data.title || c.template.name}" ? Les reponses RSVP seront perdues.`)) return
  deletingId.value = c.id
  try {
    await request(`/cards/${c.id}`, { method: 'DELETE', auth: true })
    cards.value = cards.value.filter((x) => x.id !== c.id)
  } finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-14">
    <div class="mb-10 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-cream">Mes cartes</h1>
        <p v-if="cards.length" class="mt-1 font-body text-sm text-cream/50">
          {{ cards.length }} carte{{ cards.length > 1 ? 's' : '' }} &middot;
          {{ cards.reduce((s, c) => s + (c.views || 0), 0) }} vues au total
        </p>
      </div>
      <NuxtLink to="/templates" class="rounded-full bg-gradient-to-r from-coral to-gold px-5 py-2.5 font-display text-sm font-bold text-ink">
        + Nouvelle carte
      </NuxtLink>
    </div>

    <div v-if="loading" class="font-body text-cream/60">Chargement...</div>

    <div v-else-if="!cards.length" class="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
      <p class="font-body text-cream/60">Tu n'as pas encore créé de carte.</p>
      <NuxtLink to="/templates" class="mt-3 inline-block font-body text-sm text-gold underline">Parcourir les modèles</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="c in cards" :key="c.id" class="flex flex-col">
        <NuxtLink :to="`/c/${c.slug}`" class="group relative block overflow-hidden rounded-3xl shadow-xl shadow-black/40 ring-1 ring-white/10 transition hover:-translate-y-1">
          <div class="pointer-events-none">
            <MagicExperience
              force-open
              compact
              :accent="(c.data.accent as any) || 'gold'"
              :title="c.data.title"
            />
          </div>
          <div
            v-if="!c.isUnlocked"
            class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70 text-center backdrop-blur-sm"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" class="text-gold">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6" />
              <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" stroke-width="1.6" />
            </svg>
            <p class="font-body text-sm font-medium text-cream/90">À débloquer</p>
          </div>
          <span class="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 font-body text-[11px] font-medium text-cream/90 backdrop-blur">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg>
            {{ c.views || 0 }}
          </span>
        </NuxtLink>

        <div class="mt-3 flex items-center justify-between">
          <p class="font-body text-xs text-cream/50">{{ c.template.name }}</p>
          <p class="font-body text-[11px] text-cream/35">{{ new Date(c.createdAt).toLocaleDateString('fr-FR') }}</p>
        </div>

        <div v-if="c.isUnlocked" class="mt-3 grid grid-cols-2 gap-2">
          <button class="focus-ring rounded-xl bg-white/5 px-3 py-2 font-body text-xs text-cream/80 ring-1 ring-white/10 transition hover:bg-white/10" @click="copyLink(c)">
            {{ copiedId === c.id ? 'Copié !' : 'Copier le lien' }}
          </button>
          <button class="focus-ring rounded-xl bg-white/5 px-3 py-2 font-body text-xs text-cream/80 ring-1 ring-white/10 transition hover:bg-white/10" @click="shareWhatsApp(c)">
            WhatsApp
          </button>
          <NuxtLink
            :to="`/editor/${c.template.id || ''}?card=${c.id}`"
            class="focus-ring rounded-xl bg-white/5 px-3 py-2 text-center font-body text-xs text-cream/80 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Modifier
          </NuxtLink>
          <NuxtLink
            :to="`/cards/${c.id}/rsvps`"
            class="focus-ring rounded-xl bg-gold/15 px-3 py-2 text-center font-body text-xs font-semibold text-gold ring-1 ring-gold/30 transition hover:bg-gold/25"
          >
            Réponses RSVP
          </NuxtLink>
          <button
            class="focus-ring col-span-2 rounded-xl px-3 py-2 font-body text-xs text-coral/70 ring-1 ring-coral/20 transition hover:bg-coral/10 hover:text-coral"
            :disabled="deletingId === c.id"
            @click="removeCard(c)"
          >
            {{ deletingId === c.id ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
