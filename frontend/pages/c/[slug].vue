<script setup lang="ts">
definePageMeta({ layout: false })

interface TimelineItem {
  time?: string
  label?: string
}

interface CardData {
  id: string
  slug: string
  data: {
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
  isUnlocked: boolean
  rsvpEnabled: boolean
  template: { designKey: string; name: string }
}

const route = useRoute()
const { request } = useApi()

const card = ref<CardData | null>(null)
const loading = ref(true)
const notFound = ref(false)

onMounted(async () => {
  try {
    card.value = await request<CardData>(`/cards/public/${route.params.slug}`)
  } catch (e) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

const magicRef = ref()
const { downloading, downloadError, downloadImage, downloadPdf } = useCardDownload(magicRef)
const downloadName = computed(() => card.value?.data.title || 'ma-carte')
</script>

<template>
  <div>
    <div v-if="loading" class="flex min-h-screen items-center justify-center bg-night font-body text-cream/60">
      Ouverture de la carte...
    </div>

    <div v-else-if="notFound" class="flex min-h-screen flex-col items-center justify-center gap-4 bg-night text-center">
      <p class="font-display text-2xl font-bold text-cream">Cette carte n'existe plus</p>
      <NuxtLink to="/" class="font-body text-sm text-gold underline">Retour a l'accueil</NuxtLink>
    </div>

    <div v-else-if="card && !card.isUnlocked" class="flex min-h-screen flex-col items-center justify-center gap-4 bg-night px-6 text-center">
      <p class="font-display text-2xl font-bold text-cream">Cette carte n'a pas encore ete debloquee</p>
      <p class="font-body text-sm text-cream/60">La personne qui l'a creee doit finaliser le paiement.</p>
      <NuxtLink to="/templates" class="font-body text-sm text-gold underline">Creer ma propre carte</NuxtLink>
    </div>

    <template v-else-if="card">
      <MagicExperience
        ref="magicRef"
        :accent="(card.data.accent as any) || 'gold'"
        :title="card.data.title"
        :subtitle="card.data.subtitle"
        :message="card.data.message"
        :date="card.data.date"
        :location="card.data.location"
        :closing="card.data.closing"
        :timeline="card.data.timeline"
        :photo-url="card.data.photoUrl"
        :event-at="card.data.eventAt"
        :music-url="card.data.musicUrl"
        :rsvp-slug="card.rsvpEnabled ? card.slug : ''"
      />
      <div class="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
        <p v-if="downloadError" class="rounded-full bg-coral/90 px-4 py-1.5 font-body text-xs font-semibold text-white shadow-lg">{{ downloadError }}</p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="!!downloading"
            class="rounded-full bg-night/85 px-4 py-2.5 font-body text-xs font-semibold text-cream/90 shadow-2xl backdrop-blur transition hover:scale-105 disabled:opacity-60"
            @click="downloadImage(downloadName)"
          >
            {{ downloading === 'image' ? 'Preparation...' : 'Telecharger l\'image' }}
          </button>
          <button
            type="button"
            :disabled="!!downloading"
            class="rounded-full bg-night/85 px-4 py-2.5 font-body text-xs font-semibold text-cream/90 shadow-2xl backdrop-blur transition hover:scale-105 disabled:opacity-60"
            @click="downloadPdf(downloadName)"
          >
            {{ downloading === 'pdf' ? 'Preparation...' : 'Telecharger en PDF' }}
          </button>
          <NuxtLink
            to="/templates"
            class="rounded-full bg-night/85 px-5 py-2.5 font-body text-xs font-semibold text-cream/90 shadow-2xl backdrop-blur transition hover:scale-105"
          >
            Creee avec Fetia
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
