<script setup lang="ts">
interface Rsvp {
  id: string
  name: string
  attending: boolean
  guests: number
  message: string | null
  createdAt: string
}

interface RsvpResponse {
  rsvps: Rsvp[]
  stats: { total: number; attending: number; declined: number; totalGuests: number }
}

const route = useRoute()
const router = useRouter()
const { request } = useApi()
const auth = useAuthStore()

const data = ref<RsvpResponse | null>(null)
const loading = ref(true)

onMounted(async () => {
  auth.restore()
  if (!auth.user) {
    router.push('/login?redirect=/dashboard')
    return
  }
  try {
    data.value = await request<RsvpResponse>(`/cards/${route.params.id}/rsvps`, { auth: true })
  } finally {
    loading.value = false
  }
})

function exportCsv() {
  if (!data.value?.rsvps.length) return
  const header = ['Nom', 'Reponse', 'Personnes', 'Message', 'Date']
  const rows = data.value.rsvps.map((r) => [
    r.name,
    r.attending ? 'Present' : 'Absent',
    r.attending ? String(r.guests || 1) : '0',
    r.message || '',
    new Date(r.createdAt).toLocaleDateString('fr-FR'),
  ])
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
  // BOM UTF-8 + separateur ; pour Excel francais
  const csv = '\ufeff' + [header, ...rows].map((row) => row.map(escape).join(';')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reponses-invites.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-14">
    <NuxtLink to="/dashboard" class="font-body text-sm text-cream/50 hover:text-cream">&larr; Retour a mes cartes</NuxtLink>
    <div class="mt-3 flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-display text-3xl font-bold text-cream">Reponses des invites</h1>
      <button
        v-if="data?.rsvps.length"
        class="focus-ring rounded-full bg-white/5 px-5 py-2.5 font-body text-sm text-cream/80 ring-1 ring-white/10 transition hover:bg-white/10"
        @click="exportCsv"
      >
        Exporter pour Excel (.csv)
      </button>
    </div>

    <div v-if="loading" class="mt-8 font-body text-cream/60">Chargement...</div>

    <template v-else-if="data">
      <!-- STATS -->
      <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p class="font-display text-3xl font-extrabold text-cream">{{ data.stats.attending }}</p>
          <p class="mt-1 font-body text-xs text-cream/50">Presents</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p class="font-display text-3xl font-extrabold text-gold">{{ data.stats.totalGuests }}</p>
          <p class="mt-1 font-body text-xs text-cream/50">Personnes au total</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p class="font-display text-3xl font-extrabold text-cream/60">{{ data.stats.declined }}</p>
          <p class="mt-1 font-body text-xs text-cream/50">Absents</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p class="font-display text-3xl font-extrabold text-cream/60">{{ data.stats.total }}</p>
          <p class="mt-1 font-body text-xs text-cream/50">Reponses</p>
        </div>
      </div>

      <!-- LISTE -->
      <div v-if="!data.rsvps.length" class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
        <p class="font-body text-cream/60">Aucune reponse pour le moment.</p>
        <p class="mt-2 font-body text-xs text-cream/40">Partage le lien de ta carte, les reponses arriveront ici.</p>
      </div>

      <div v-else class="mt-10 divide-y divide-white/10 rounded-3xl border border-white/10">
        <div v-for="r in data.rsvps" :key="r.id" class="flex items-start gap-4 px-6 py-5">
          <span
            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            :class="r.attending ? 'bg-gold/15 text-gold' : 'bg-white/5 text-cream/40'"
          >
            <svg v-if="r.attending" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <p class="font-body font-semibold text-cream">{{ r.name }}</p>
              <p class="font-body text-[11px] text-cream/35">{{ new Date(r.createdAt).toLocaleDateString('fr-FR') }}</p>
            </div>
            <p class="font-body text-xs text-cream/50">
              {{ r.attending ? (r.guests > 1 ? `Vient avec ${r.guests - 1} accompagnant(s)` : 'Vient seul(e)') : 'Ne peut pas venir' }}
            </p>
            <p v-if="r.message" class="mt-2 rounded-xl bg-white/5 px-3 py-2 font-body text-sm italic text-cream/70">
              "{{ r.message }}"
            </p>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
