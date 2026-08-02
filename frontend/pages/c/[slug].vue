<script setup lang="ts">
interface CardData {
  id: string
  slug: string
  data: { title?: string; subtitle?: string; message?: string; accent?: string }
  isUnlocked: boolean
  template: { designKey: string; name: string }
}

const route = useRoute()
const { request } = useApi()

const card = ref<CardData | null>(null)
const loading = ref(true)
const notFound = ref(false)
const opened = ref(false)
const confettiRef = ref<{ burst: () => void } | null>(null)

onMounted(async () => {
  try {
    card.value = await request<CardData>(`/cards/public/${route.params.slug}`)
  } catch (e) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

function openCard() {
  opened.value = true
  confettiRef.value?.burst()
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
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

    <div v-else-if="card && card.template.designKey === 'golden-invite'" class="w-full max-w-sm">
      <InvitationEnvelope
        :title="card.data.title"
        :subtitle="card.data.subtitle"
        :message="card.data.message"
      />
      <NuxtLink to="/templates" class="mt-8 inline-block font-body text-sm text-cream/50 underline-offset-4 hover:text-cream hover:underline">
        Creer ma propre carte sur Fetia
      </NuxtLink>
    </div>

    <div v-else-if="card" class="relative w-full max-w-sm" style="perspective: 1200px">
      <p v-if="!opened" class="mb-5 font-body text-sm text-cream/50">Touche la carte pour l'ouvrir</p>
      <button
        type="button"
        class="focus-ring block w-full text-left"
        :style="{ transform: opened ? 'rotateY(-16deg)' : 'rotateY(0deg)', transition: 'transform 0.7s cubic-bezier(.2,.8,.2,1)' }"
        @click="openCard"
      >
        <CardCanvas
          :design-key="card.template.designKey"
          :title="card.data.title"
          :subtitle="card.data.subtitle"
          :message="opened ? card.data.message : ''"
          :accent="(card.data.accent as any) || 'sunset'"
        />
      </button>
      <ConfettiCanvas ref="confettiRef" />

      <NuxtLink to="/templates" class="mt-8 inline-block font-body text-sm text-cream/50 underline-offset-4 hover:text-cream hover:underline">
        Creer ma propre carte sur Fetia
      </NuxtLink>
    </div>
  </main>
</template>
