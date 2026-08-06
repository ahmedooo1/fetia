<script setup lang="ts">
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
    timeline?: TimelineItem[]
  }
  isUnlocked: boolean
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
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center px-6 py-16 text-center">
    <div v-if="loading" class="font-body text-cream/60">Ouverture de la carte...</div>

    <div v-else-if="notFound" class="space-y-4">
      <p class="font-display text-2xl font-bold text-cream">Cette carte n'existe plus</p>
      <NuxtLink to="/" class="font-body text-sm text-gold underline">Retour a l'accueil</NuxtLink>
    </div>

    <div v-else-if="card && !card.isUnlocked" class="space-y-4">
      <p class="font-display text-2xl font-bold text-cream">Cette carte n'a pas encore ete debloquee</p>
      <p class="font-body text-sm text-cream/60">La personne qui l'a creee doit finaliser le paiement.</p>
      <NuxtLink to="/templates" class="font-body text-sm text-gold underline">Creer ma propre carte</NuxtLink>
    </div>

    <div v-else-if="card" class="w-full max-w-sm">
      <MagicReveal
        :accent="(card.data.accent as any) || 'sunset'"
        :title="card.data.title"
        :subtitle="card.data.subtitle"
        :message="card.data.message"
        :date="card.data.date"
        :location="card.data.location"
        :closing="card.data.closing"
        :timeline="card.data.timeline"
      />
      <NuxtLink to="/templates" class="mt-10 inline-block font-body text-sm text-cream/50 underline-offset-4 hover:text-cream hover:underline">
        Creer ma propre carte sur Fetia
      </NuxtLink>
    </div>
  </main>
</template>
