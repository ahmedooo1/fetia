<script setup lang="ts">
interface Template {
  id: string
  name: string
  category: string
  designKey: string
  isPremium: boolean
  priceCents: number
  defaultData: any
}

useHead({ title: 'Les modeles - Fetia' })

const route = useRoute()
const { request } = useApi()

const categories = [
  { key: '', label: 'Tous' },
  { key: 'anniversaire', label: 'Anniversaire' },
  { key: 'fete', label: 'Fete' },
  { key: 'invitation', label: 'Invitation' },
  { key: 'mariage', label: 'Mariage' },
  { key: 'naissance', label: 'Naissance' },
]

const active = ref((route.query.category as string) || '')
const templates = ref<Template[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const query = active.value ? `?category=${active.value}` : ''
    templates.value = await request<Template[]>(`/templates${query}`)
  } catch (e) {
    error.value = "Impossible de charger les modeles pour le moment."
  } finally {
    loading.value = false
  }
}

watch(active, load)
watch(
  () => route.query.category,
  (val) => {
    active.value = (val as string) || ''
  },
)
onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-14">
    <div class="mb-10 max-w-xl">
      <h1 class="font-display text-4xl font-extrabold text-cream">Les modeles</h1>
      <p class="mt-3 font-body text-cream/60">
        Chaque design est pense pour une occasion precise. Clique sur un modele pour le personnaliser.
      </p>
    </div>

    <div class="mb-10 flex flex-wrap gap-2.5">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="focus-ring rounded-full border px-4 py-2 font-body text-sm transition"
        :class="active === cat.key
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-white/10 text-cream/70 hover:border-white/20 hover:text-cream'"
        @click="active = cat.key"
      >
        {{ cat.label }}
      </button>
    </div>

    <p v-if="error" class="font-body text-sm text-coral">{{ error }}</p>

    <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="aspect-[3/4] animate-pulse rounded-3xl bg-white/5" />
    </div>

    <div v-else-if="templates.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <TemplateCard v-for="t in templates" :key="t.id" :template="t" />
    </div>

    <div v-else class="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
      <p class="font-body text-cream/60">Aucun modele dans cette categorie pour l'instant.</p>
    </div>
  </main>
</template>
