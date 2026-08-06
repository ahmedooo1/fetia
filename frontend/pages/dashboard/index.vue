<script setup lang="ts">
interface Card {
  id: string
  slug: string
  isUnlocked: boolean
  data: { title?: string; accent?: string }
  template: { designKey: string; name: string }
  createdAt: string
}

const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const cards = ref<Card[]>([])
const loading = ref(true)

onMounted(async () => {
  auth.restore()
  if (!auth.user) {
    router.push('/login?redirect=/dashboard')
    return
  }
  try {
    cards.value = await request<Card[]>('/cards/mine', { auth: true })
  } finally {
    loading.value = false
  }
})

function copyLink(slug: string) {
  const url = `${window.location.origin}/c/${slug}`
  navigator.clipboard?.writeText(url)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-14">
    <div class="mb-10 flex items-center justify-between">
      <h1 class="font-display text-3xl font-bold text-cream">Mes cartes</h1>
      <NuxtLink to="/templates" class="rounded-full bg-gradient-to-r from-coral to-gold px-5 py-2.5 font-display text-sm font-bold text-ink">
        + Nouvelle carte
      </NuxtLink>
    </div>

    <div v-if="loading" class="font-body text-cream/60">Chargement...</div>

    <div v-else-if="!cards.length" class="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
      <p class="font-body text-cream/60">Tu n'as pas encore cree de carte.</p>
      <NuxtLink to="/templates" class="mt-3 inline-block font-body text-sm text-gold underline">Parcourir les modeles</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="c in cards" :key="c.id">
        <div class="relative overflow-hidden rounded-3xl shadow-xl shadow-black/40 ring-1 ring-white/10">
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
            <p class="font-body text-sm font-medium text-cream/90">A debloquer</p>
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <p class="font-body text-xs text-cream/50">{{ c.template.name }}</p>
          <button v-if="c.isUnlocked" class="font-body text-xs text-gold underline" @click="copyLink(c.slug)">
            Copier le lien
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
