<script setup lang="ts">
type Accent = 'sunset' | 'candy' | 'gold' | 'sage' | 'sky' | 'neon'

interface TimelineItem {
  time?: string
  label?: string
}

const props = withDefaults(
  defineProps<{
    accent?: Accent
    title?: string
    subtitle?: string
    message?: string
    date?: string
    location?: string
    closing?: string
    timeline?: TimelineItem[]
    forceOpen?: boolean
    compact?: boolean
  }>(),
  {
    accent: 'gold',
    title: '',
    subtitle: '',
    message: '',
    date: '',
    location: '',
    closing: '',
    timeline: () => [],
    forceOpen: false,
    compact: false,
  },
)

interface Theme {
  bg: string
  bgSoft: string
  ink: string
  accent: string
  accentSoft: string
  eyebrow: string
  scriptTitle: boolean
  particles: string
  dark?: boolean
}

const themes: Record<Accent, Theme> = {
  gold: {
    bg: 'linear-gradient(175deg, #FDF8EE 0%, #F8EFDD 55%, #F3E7CC 100%)',
    bgSoft: '#F8EFDD',
    ink: '#5C4A22',
    accent: '#B08D3E',
    accentSoft: '#D9C08A',
    eyebrow: 'Invitation',
    scriptTitle: true,
    particles: '#C9A85C',
  },
  sage: {
    bg: 'linear-gradient(175deg, #F9FBF6 0%, #F0F5EB 55%, #E5EEDF 100%)',
    bgSoft: '#F0F5EB',
    ink: '#44553F',
    accent: '#6F8B76',
    accentSoft: '#A9C2AC',
    eyebrow: 'Mariage',
    scriptTitle: true,
    particles: '#8FAF94',
  },
  sky: {
    bg: 'linear-gradient(175deg, #F7FBFF 0%, #EDF5FC 55%, #E1EEF8 100%)',
    bgSoft: '#EDF5FC',
    ink: '#3D5468',
    accent: '#7FA8C9',
    accentSoft: '#B4CFE4',
    eyebrow: 'Naissance',
    scriptTitle: true,
    particles: '#9DBFDA',
  },
  sunset: {
    bg: 'linear-gradient(175deg, #FFF9F0 0%, #FDEEDC 55%, #FAE3C8 100%)',
    bgSoft: '#FDEEDC',
    ink: '#6B4A2B',
    accent: '#C98A4B',
    accentSoft: '#E5BE93',
    eyebrow: 'Anniversaire',
    scriptTitle: false,
    particles: '#E0A96A',
  },
  candy: {
    bg: 'linear-gradient(175deg, #1E1233 0%, #251741 55%, #1A0F2D 100%)',
    bgSoft: '#251741',
    ink: '#F6EFFF',
    accent: '#E9B8FF',
    accentSoft: '#8B5CF6',
    eyebrow: 'Fete',
    scriptTitle: false,
    particles: '#E9B8FF',
    dark: true,
  },
  neon: {
    bg: 'linear-gradient(175deg, #12091F 0%, #1B0E2E 55%, #120A21 100%)',
    bgSoft: '#1B0E2E',
    ink: '#FFF3F6',
    accent: '#FF6B8B',
    accentSoft: '#8B5CF6',
    eyebrow: 'Fete',
    scriptTitle: false,
    particles: '#FF9DB3',
    dark: true,
  },
}

const t = computed(() => themes[props.accent])

const opened = ref(props.forceOpen)
const opening = ref(false)
const confettiRef = ref<{ burst: () => void } | null>(null)

const openStyle: Record<Accent, 'seal' | 'burst' | 'sunrise' | 'bloom' | 'part'> = {
  sunset: 'sunrise',
  candy: 'burst',
  gold: 'seal',
  sage: 'bloom',
  sky: 'part',
  neon: 'burst',
}
const variant = computed(() => openStyle[props.accent])
const hasMore = computed(() => Boolean(props.date || props.location || props.closing || props.timeline?.length))

const monogram = computed(() => {
  const words = (props.title || '').replace(/[^\p{L}\s&]/gu, '').split(/\s+/).filter(Boolean)
  const majors = words.filter((w) => w.length > 2)
  if (majors.length >= 2) return `${majors[0][0]}${majors[majors.length - 1][0]}`.toUpperCase()
  if (words.length) return words[0][0].toUpperCase()
  return '&'
})

function open() {
  if (opened.value || opening.value) return
  opening.value = true
  if (variant.value === 'burst') confettiRef.value?.burst()
  window.setTimeout(() => {
    opened.value = true
    opening.value = false
  }, 750)
}

const { target: detailsTarget, visible: detailsVisible } = useScrollReveal()
const { target: timelineTarget, visible: timelineVisible } = useScrollReveal()
const { target: closingTarget, visible: closingVisible } = useScrollReveal()
</script>

<template>
  <div
    class="experience relative w-full overflow-hidden"
    :class="compact ? 'rounded-3xl' : ''"
    :style="{ background: t.bg, color: t.ink }"
  >
    <AmbientMagic :color="t.particles" :density="opened ? 26 : 12" />

    <!-- ============ HERO ============ -->
    <section
      class="relative flex flex-col items-center justify-center px-6 text-center"
      :class="compact ? 'min-h-[540px] py-14' : 'min-h-[92vh] py-20'"
    >
      <OrnamentFrame :color="t.accent" />

      <!-- ornements floraux du hero -->
      <div class="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
        <OrnamentFlora :color="t.accent" :opacity="0.55" class="h-28 w-40" />
      </div>
      <div class="pointer-events-none absolute -left-8 top-1/3 -rotate-[30deg]">
        <OrnamentFlora :color="t.accent" :opacity="0.28" class="h-24 w-32" />
      </div>
      <div class="pointer-events-none absolute -right-8 top-1/2 rotate-[30deg] -scale-x-100">
        <OrnamentFlora :color="t.accent" :opacity="0.28" class="h-24 w-32" />
      </div>
      <div class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center -scale-y-100">
        <OrnamentFlora :color="t.accent" :opacity="0.4" class="h-24 w-36" />
      </div>

      <!-- contenu revele -->
      <div
        class="relative z-10 mx-auto max-w-xl transition-all duration-1000 ease-out"
        :class="opened ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'"
      >
        <p
          class="text-[11px] font-semibold uppercase tracking-[0.35em]"
          :style="{ color: t.accent }"
        >
          {{ t.eyebrow }}
        </p>

        <OrnamentDivider :color="t.accent" class="mt-4" />

        <h1
          class="mt-6 text-balance leading-[1.08]"
          :class="t.scriptTitle ? 'font-script text-6xl md:text-7xl' : 'font-serif-display text-5xl font-semibold md:text-6xl'"
        >
          {{ title }}
        </h1>

        <p v-if="subtitle" class="font-serif-display mt-4 text-xl italic opacity-80 md:text-2xl">
          {{ subtitle }}
        </p>

        <p v-if="message" class="mx-auto mt-6 max-w-md font-serif-display text-lg leading-relaxed opacity-70">
          {{ message }}
        </p>

        <div v-if="hasMore" class="mt-10 flex flex-col items-center gap-2 opacity-60">
          <p class="text-[10px] font-semibold uppercase tracking-[0.3em]">Faites defiler</p>
          <svg class="animate-bounce" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- ============ COVER (avant ouverture) ============ -->
      <button
        v-if="!opened"
        type="button"
        class="cover focus-ring absolute inset-0 z-20 flex flex-col items-center justify-center"
        :class="opening ? `cover-${variant}-open` : ''"
        :style="{ background: t.bg }"
        :disabled="opening"
        aria-label="Ouvrir la carte"
        @click="open"
      >
        <OrnamentFrame :color="t.accent" />

        <!-- enveloppe (plis) pour le theme gold -->
        <svg v-if="variant === 'seal'" class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,0 100,0 50,46" :fill="t.accentSoft" fill-opacity="0.22" :stroke="t.accent" stroke-opacity="0.3" stroke-width="0.25" vector-effect="non-scaling-stroke" />
          <polygon points="0,100 100,100 50,52" :fill="t.accentSoft" fill-opacity="0.16" :stroke="t.accent" stroke-opacity="0.25" stroke-width="0.25" vector-effect="non-scaling-stroke" />
          <polygon points="0,0 0,100 50,49" :fill="t.accentSoft" fill-opacity="0.12" :stroke="t.accent" stroke-opacity="0.2" stroke-width="0.2" vector-effect="non-scaling-stroke" />
          <polygon points="100,0 100,100 50,49" :fill="t.accentSoft" fill-opacity="0.12" :stroke="t.accent" stroke-opacity="0.2" stroke-width="0.2" vector-effect="non-scaling-stroke" />
        </svg>

        <!-- florals sur la cover, disposition symetrique riche -->
        <div class="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
          <OrnamentFlora :color="t.accent" :opacity="0.6" class="h-32 w-44" />
        </div>
        <div class="pointer-events-none absolute left-4 top-1/4 -rotate-[24deg]">
          <OrnamentFlora :color="t.accent" :opacity="0.3" class="h-20 w-28" />
        </div>
        <div class="pointer-events-none absolute right-4 top-1/4 rotate-[24deg] -scale-x-100">
          <OrnamentFlora :color="t.accent" :opacity="0.3" class="h-20 w-28" />
        </div>
        <div class="pointer-events-none absolute bottom-8 left-8 rotate-[12deg]">
          <OrnamentFlora :color="t.accent" :opacity="0.35" class="h-24 w-32" />
        </div>
        <div class="pointer-events-none absolute bottom-8 right-8 -rotate-[12deg] -scale-x-100">
          <OrnamentFlora :color="t.accent" :opacity="0.35" class="h-24 w-32" />
        </div>

        <!-- SEAL -->
        <template v-if="variant === 'seal'">
          <div class="seal relative z-10 flex h-24 w-24 items-center justify-center rounded-full" :style="{ background: `radial-gradient(circle at 35% 30%, ${t.accentSoft}, ${t.accent} 75%)` }">
            <svg class="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)]" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#FFFDF7" stroke-opacity="0.6" stroke-width="0.8" stroke-dasharray="1.5 2" />
            </svg>
            <span class="font-serif-display text-2xl font-semibold tracking-wide text-[#FFFDF7]">{{ monogram }}</span>
          </div>
        </template>

        <!-- BLOOM -->
        <template v-else-if="variant === 'bloom'">
          <div class="relative z-10 h-24 w-24">
            <div v-for="i in 6" :key="i" class="petal absolute left-1/2 top-1/2" :style="{ transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-16px)`, background: `radial-gradient(circle at 40% 30%, ${t.accentSoft}, ${t.accent})` }" />
            <div class="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full" :style="{ background: t.accent }" />
          </div>
        </template>

        <!-- PART -->
        <template v-else-if="variant === 'part'">
          <div class="relative z-10 flex h-24 items-center justify-center">
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none" :style="{ color: t.accent }">
              <path d="M20 44 a12 12 0 0 1 2-24 a16 16 0 0 1 30-4 a12 12 0 0 1 8 22 z" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity="0.12" />
              <path d="M52 14 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2 z" fill="currentColor" fill-opacity="0.55" />
              <circle cx="66" cy="12" r="1.6" fill="currentColor" fill-opacity="0.5" />
              <circle cx="12" cy="16" r="1.3" fill="currentColor" fill-opacity="0.5" />
            </svg>
          </div>
        </template>

        <!-- SUNRISE -->
        <template v-else-if="variant === 'sunrise'">
          <div class="sunrise-glow absolute inset-x-0 bottom-0 h-1/2" :style="{ background: `radial-gradient(ellipse at 50% 100%, ${t.accentSoft}AA, transparent 65%)` }" />
          <svg class="relative z-10" width="72" height="72" viewBox="0 0 72 72" fill="none" :style="{ color: t.accent }">
            <circle cx="36" cy="36" r="12" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity="0.16" />
            <g stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
              <path d="M36 12v8M36 52v8M12 36h8M52 36h8M19 19l5.5 5.5M47.5 47.5L53 53M53 19l-5.5 5.5M24.5 47.5L19 53" />
            </g>
          </svg>
        </template>

        <!-- BURST -->
        <template v-else>
          <svg class="relative z-10" width="64" height="64" viewBox="0 0 64 64" fill="none" :style="{ color: t.accent }">
            <path d="M32 8l5.9 14.2L52 28l-14.1 5.8L32 48l-5.9-14.2L12 28l14.1-5.8z" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity="0.18" />
            <circle cx="52" cy="12" r="2" fill="currentColor" fill-opacity="0.6" />
            <circle cx="12" cy="50" r="1.6" fill="currentColor" fill-opacity="0.6" />
          </svg>
        </template>

        <p class="absolute bottom-10 z-10 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
          Touchez pour ouvrir
        </p>
      </button>

      <ConfettiCanvas v-if="variant === 'burst'" ref="confettiRef" class="z-30" />
    </section>

    <!-- ============ SECTIONS ============ -->
    <template v-if="opened && hasMore">
      <!-- DETAILS -->
      <section
        v-if="date || location"
        ref="detailsTarget"
        class="relative px-6 py-20 text-center transition-all duration-1000"
        :class="detailsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <OrnamentDivider :color="t.accent" />
        <p class="mt-8 text-[11px] font-semibold uppercase tracking-[0.35em]" :style="{ color: t.accent }">
          Quand &amp; ou
        </p>
        <div class="relative mx-auto mt-8 max-w-md px-10 py-12">
          <OrnamentFrame :color="t.accent" />
          <p v-if="date" class="font-serif-display text-3xl font-semibold">{{ date }}</p>
          <p v-if="location" class="font-serif-display mt-3 text-lg italic opacity-70">{{ location }}</p>
        </div>
      </section>

      <!-- TIMELINE -->
      <section
        v-if="timeline?.length"
        ref="timelineTarget"
        class="relative px-6 py-20 transition-all duration-1000"
        :class="timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <div class="pointer-events-none absolute right-0 top-10 rotate-[24deg] -scale-x-100">
          <OrnamentFlora :color="t.accent" :opacity="0.2" class="h-28 w-36" />
        </div>
        <p class="text-center text-[11px] font-semibold uppercase tracking-[0.35em]" :style="{ color: t.accent }">
          Le programme
        </p>
        <OrnamentDivider :color="t.accent" class="mt-6" />
        <div class="mx-auto mt-12 max-w-md">
          <div v-for="(item, i) in timeline" :key="i" class="relative flex gap-6 pb-12 last:pb-0">
            <div class="flex flex-col items-center">
              <svg width="14" height="14" viewBox="0 0 14 14" :style="{ color: t.accent }">
                <path d="M7 0l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="currentColor" fill-opacity="0.8" />
              </svg>
              <span v-if="i < timeline.length - 1" class="mt-2 w-px flex-1" :style="{ background: t.accent, opacity: 0.25 }" />
            </div>
            <div class="-mt-0.5">
              <p class="font-serif-display text-xl font-semibold" :style="{ color: t.accent }">{{ item.time }}</p>
              <p class="font-serif-display mt-1 text-lg italic opacity-75">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CLOSING -->
      <section
        v-if="closing"
        ref="closingTarget"
        class="relative px-6 pb-24 pt-16 text-center transition-all duration-1000"
        :class="closingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <div class="pointer-events-none mx-auto mb-6 flex justify-center">
          <OrnamentFlora :color="t.accent" :opacity="0.4" class="h-20 w-28" />
        </div>
        <p class="font-script mx-auto max-w-md text-4xl leading-snug md:text-5xl" :style="{ color: t.accent }">
          {{ closing }}
        </p>
        <OrnamentDivider :color="t.accent" class="mt-10" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.cover {
  transition: opacity 0.6s ease 0.15s, transform 0.6s ease;
}

/* SEAL : le sceau grossit et fond, la cover s'estompe */
.seal {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22), inset 0 1px 3px rgba(255, 255, 255, 0.4);
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.45s ease;
}
.cover-seal-open {
  opacity: 0;
}
.cover-seal-open .seal {
  transform: scale(1.5) rotate(14deg);
  opacity: 0;
}

/* BLOOM : les petales s'ecartent */
.petal {
  width: 34px;
  height: 46px;
  border-radius: 50% 50% 50% 0;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease;
}
.cover-bloom-open {
  opacity: 0;
}
.cover-bloom-open .petal {
  opacity: 0;
}

/* PART / SUNRISE / BURST : fondu global */
.cover-part-open,
.cover-sunrise-open,
.cover-burst-open {
  opacity: 0;
}
.cover-burst-open {
  transform: scale(0.92);
}

.sunrise-glow {
  transition: transform 0.7s ease, opacity 0.6s ease;
}
.cover-sunrise-open .sunrise-glow {
  transform: scale(2.2);
}

@media (prefers-reduced-motion: reduce) {
  .cover,
  .seal,
  .petal,
  .sunrise-glow {
    transition-duration: 0.05s;
  }
}
</style>
