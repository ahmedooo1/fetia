<script setup lang="ts">
type Accent = 'sunset' | 'candy' | 'gold' | 'sage' | 'sky' | 'neon'

const props = withDefaults(
  defineProps<{
    designKey?: string
    title?: string
    subtitle?: string
    message?: string
    accent?: Accent
    locked?: boolean
  }>(),
  {
    designKey: 'aurora-birthday',
    title: 'Joyeux anniversaire',
    subtitle: '',
    message: '',
    accent: 'sunset',
    locked: false,
  },
)

const gradients: Record<Accent, string> = {
  sunset:
    'radial-gradient(circle at 20% 15%, #FFC857 0%, transparent 45%), radial-gradient(circle at 85% 25%, #FF6B8B 0%, transparent 50%), radial-gradient(circle at 50% 100%, #8B5CF6 0%, transparent 60%)',
  candy:
    'radial-gradient(circle at 15% 20%, #FF6B8B 0%, transparent 45%), radial-gradient(circle at 80% 10%, #8B5CF6 0%, transparent 45%), radial-gradient(circle at 60% 90%, #FFC857 0%, transparent 55%)',
  gold: 'linear-gradient(135deg, #241536 0%, #3a2158 45%, #241536 100%)',
  sage: 'radial-gradient(circle at 20% 10%, #C9E4CB 0%, transparent 50%), radial-gradient(circle at 90% 80%, #7FA588 0%, transparent 55%)',
  sky: 'radial-gradient(circle at 25% 20%, #D9F0FF 0%, transparent 50%), radial-gradient(circle at 80% 90%, #8FCBEB 0%, transparent 55%)',
  neon: 'linear-gradient(160deg, #120A21 0%, #1B0E2E 60%, #120A21 100%)',
}

const textOn: Record<Accent, string> = {
  sunset: 'text-ink',
  candy: 'text-ink',
  gold: 'text-cream',
  sage: 'text-ink',
  sky: 'text-ink',
  neon: 'text-cream',
}

const eyebrow: Record<Accent, string> = {
  sunset: 'Anniversaire',
  candy: 'Fete',
  gold: 'Invitation',
  sage: 'Mariage',
  sky: 'Naissance',
  neon: 'Fete',
}
</script>

<template>
  <div
    class="card-frame grain relative aspect-[3/4] w-full"
    :style="{ background: gradients[accent] }"
  >
    <!-- motifs decoratifs par accent -->
    <svg v-if="accent === 'candy' || accent === 'sunset'" class="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 300 400">
      <circle cx="40" cy="60" r="6" fill="#241536" fill-opacity="0.12" />
      <circle cx="260" cy="90" r="9" fill="#241536" fill-opacity="0.12" />
      <circle cx="220" cy="330" r="5" fill="#241536" fill-opacity="0.12" />
      <circle cx="60" cy="340" r="7" fill="#241536" fill-opacity="0.12" />
      <rect x="30" y="200" width="10" height="10" rx="2" fill="#241536" fill-opacity="0.1" transform="rotate(20 35 205)" />
      <rect x="250" y="220" width="8" height="8" rx="2" fill="#241536" fill-opacity="0.1" transform="rotate(-15 254 224)" />
    </svg>

    <svg v-else-if="accent === 'gold'" class="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 300 400">
      <rect x="20" y="20" width="260" height="360" rx="18" fill="none" stroke="#FFC857" stroke-opacity="0.5" stroke-width="1" />
      <line x1="20" y1="70" x2="280" y2="70" stroke="#FFC857" stroke-opacity="0.35" stroke-width="1" />
      <line x1="20" y1="330" x2="280" y2="330" stroke="#FFC857" stroke-opacity="0.35" stroke-width="1" />
    </svg>

    <svg v-else-if="accent === 'sage'" class="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 300 400">
      <path d="M20 380 C 60 300, 40 220, 70 150" stroke="#4F6B57" stroke-opacity="0.35" stroke-width="2" fill="none" />
      <path d="M280 20 C 240 100, 260 180, 230 250" stroke="#4F6B57" stroke-opacity="0.35" stroke-width="2" fill="none" />
      <circle cx="70" cy="150" r="4" fill="#4F6B57" fill-opacity="0.4" />
      <circle cx="230" cy="250" r="4" fill="#4F6B57" fill-opacity="0.4" />
    </svg>

    <svg v-else-if="accent === 'sky'" class="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 300 400">
      <circle cx="230" cy="60" r="3" fill="#241536" fill-opacity="0.2" />
      <circle cx="250" cy="90" r="2" fill="#241536" fill-opacity="0.2" />
      <circle cx="200" cy="40" r="2" fill="#241536" fill-opacity="0.2" />
      <path d="M40 340 q 15 -30 30 0 q 15 -30 30 0" stroke="#241536" stroke-opacity="0.2" stroke-width="2" fill="none" />
    </svg>

    <svg v-else-if="accent === 'neon'" class="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 300 400">
      <circle cx="150" cy="200" r="90" fill="none" stroke="#8B5CF6" stroke-opacity="0.5" stroke-width="1.5" />
      <circle cx="150" cy="200" r="130" fill="none" stroke="#FF6B8B" stroke-opacity="0.3" stroke-width="1" />
    </svg>

    <div class="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-coral via-gold to-violet" />

    <div
      class="relative flex h-full flex-col justify-between p-7"
      :class="textOn[accent]"
    >
      <span class="w-fit rounded-full border border-current/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
        {{ eyebrow[accent] }}
      </span>

      <div class="space-y-3">
        <h3 class="font-display text-3xl font-extrabold leading-[1.05] text-balance">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="font-display text-base font-medium opacity-80">{{ subtitle }}</p>
        <p v-if="message" class="max-w-[85%] font-body text-sm leading-relaxed opacity-70">
          {{ message }}
        </p>
      </div>
    </div>

    <div
      v-if="locked"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70 text-center backdrop-blur-sm"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="text-gold">
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6" />
        <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" stroke-width="1.6" />
      </svg>
      <p class="font-body text-sm font-medium text-cream/90">Modele premium a debloquer</p>
    </div>
  </div>
</template>
