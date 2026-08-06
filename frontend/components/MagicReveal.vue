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
  }>(),
  {
    accent: 'sunset',
    title: '',
    subtitle: '',
    message: '',
    date: '',
    location: '',
    closing: '',
    timeline: () => [],
    forceOpen: false,
  },
)

const opened = ref(props.forceOpen)
const opening = ref(false)
const confettiRef = ref<{ burst: () => void } | null>(null)

const gradients: Record<Accent, string> = {
  sunset:
    'radial-gradient(circle at 20% 15%, #FFC857 0%, transparent 45%), radial-gradient(circle at 85% 25%, #FF6B8B 0%, transparent 50%), radial-gradient(circle at 50% 100%, #8B5CF6 0%, transparent 60%)',
  candy:
    'radial-gradient(circle at 15% 20%, #FF6B8B 0%, transparent 45%), radial-gradient(circle at 80% 10%, #8B5CF6 0%, transparent 45%), radial-gradient(circle at 60% 90%, #FFC857 0%, transparent 55%)',
  gold: '#FBF3E7',
  sage: 'radial-gradient(circle at 20% 10%, #E4F1E6 0%, transparent 50%), radial-gradient(circle at 90% 80%, #BFDCC4 0%, transparent 55%)',
  sky: 'radial-gradient(circle at 25% 20%, #E4F5FF 0%, transparent 50%), radial-gradient(circle at 80% 90%, #C9E9FA 0%, transparent 55%)',
  neon: 'linear-gradient(160deg, #120A21 0%, #1B0E2E 60%, #120A21 100%)',
}

const textOn: Record<Accent, string> = {
  sunset: 'text-ink',
  candy: 'text-ink',
  gold: 'text-ink',
  sage: 'text-ink',
  sky: 'text-ink',
  neon: 'text-cream',
}

const eyebrowLabel: Record<Accent, string> = {
  sunset: 'Anniversaire',
  candy: 'Fete',
  gold: 'Invitation',
  sage: 'Mariage',
  sky: 'Naissance',
  neon: 'Fete',
}

const openStyle: Record<Accent, 'seal' | 'burst' | 'sunrise' | 'bloom' | 'part'> = {
  sunset: 'sunrise',
  candy: 'burst',
  gold: 'seal',
  sage: 'bloom',
  sky: 'part',
  neon: 'burst',
}

const particleColor: Record<Accent, string> = {
  sunset: '#FFC857',
  candy: '#FF6B8B',
  gold: '#C9A227',
  sage: '#9CC2A2',
  sky: '#8FCBEB',
  neon: '#8B5CF6',
}

const variant = computed(() => openStyle[props.accent])
const hasMore = computed(() => Boolean(props.date || props.location || props.closing || props.timeline?.length))

function open() {
  if (opened.value || opening.value) return
  opening.value = true
  if (variant.value === 'burst') confettiRef.value?.burst()
  window.setTimeout(() => {
    opened.value = true
    opening.value = false
  }, 700)
}

const { target: detailsTarget, visible: detailsVisible } = useScrollReveal()
const { target: timelineTarget, visible: timelineVisible } = useScrollReveal()
const { target: closingTarget, visible: closingVisible } = useScrollReveal()
</script>

<template>
  <div class="w-full">
    <!-- HERO CARD -->
    <div
      class="card-frame grain relative aspect-[3/4] w-full overflow-hidden"
      :style="{ background: gradients[accent] }"
    >
      <AmbientMagic :color="particleColor[accent]" :density="opened ? 22 : 9" />

      <div class="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-coral via-gold to-violet" />

      <div
        class="relative flex h-full flex-col justify-between p-7 transition-all duration-700 ease-out"
        :class="[textOn[accent], opened ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none']"
      >
        <span class="w-fit rounded-full border border-current/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
          {{ eyebrowLabel[accent] }}
        </span>

        <div class="space-y-3">
          <h3 class="shimmer-text font-display text-3xl font-extrabold leading-[1.05] text-balance">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="font-display text-base font-medium opacity-80">{{ subtitle }}</p>
          <p v-if="message" class="max-w-[85%] font-body text-sm leading-relaxed opacity-70">
            {{ message }}
          </p>

          <div v-if="opened && hasMore" class="pt-2 opacity-60">
            <svg class="animate-bounce" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <!-- COVER (ouverture) -->
      <button
        v-if="!opened"
        type="button"
        class="cover focus-ring absolute inset-0 flex flex-col items-center justify-center"
        :class="opening ? `cover-${variant}-open` : ''"
        :disabled="opening"
        aria-label="Ouvrir la carte"
        @click="open"
      >
        <!-- decor commun : motifs legers -->
        <svg v-if="accent === 'candy' || accent === 'sunset'" class="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 300 400">
          <circle cx="40" cy="60" r="6" fill="#241536" fill-opacity="0.12" />
          <circle cx="260" cy="90" r="9" fill="#241536" fill-opacity="0.12" />
          <circle cx="220" cy="330" r="5" fill="#241536" fill-opacity="0.12" />
          <circle cx="60" cy="340" r="7" fill="#241536" fill-opacity="0.12" />
        </svg>
        <svg v-else-if="accent === 'neon'" class="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 300 400">
          <circle cx="150" cy="200" r="90" fill="none" stroke="#8B5CF6" stroke-opacity="0.5" stroke-width="1.5" />
          <circle cx="150" cy="200" r="130" fill="none" stroke="#FF6B8B" stroke-opacity="0.3" stroke-width="1" />
        </svg>

        <!-- SEAL (gold / invitation) -->
        <template v-if="variant === 'seal'">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 300 400" preserveAspectRatio="none">
            <polygon points="0,0 300,0 150,190" fill="#F1E4CC" fill-opacity="0.7" stroke="#C9A227" stroke-opacity="0.35" stroke-width="1" />
            <polygon points="0,400 300,400 150,210" fill="#F1E4CC" fill-opacity="0.5" stroke="#C9A227" stroke-opacity="0.3" stroke-width="1" />
            <polygon points="0,0 0,400 150,200" fill="#EFE0C4" fill-opacity="0.5" stroke="#C9A227" stroke-opacity="0.25" stroke-width="1" />
            <polygon points="300,0 300,400 150,200" fill="#EFE0C4" fill-opacity="0.5" stroke="#C9A227" stroke-opacity="0.25" stroke-width="1" />
          </svg>
          <div class="seal relative flex h-20 w-20 items-center justify-center rounded-full">
            <span class="font-display text-2xl italic text-[#FBF3E7]">&amp;</span>
          </div>
          <div class="seal-crack-left" />
          <div class="seal-crack-right" />
        </template>

        <!-- BLOOM (sage / mariage) -->
        <template v-else-if="variant === 'bloom'">
          <div class="petal petal-1" />
          <div class="petal petal-2" />
          <div class="petal petal-3" />
          <div class="petal petal-4" />
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" class="relative text-[#4F6B57]">
            <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.5" />
          </svg>
        </template>

        <!-- PART (sky / naissance) -->
        <template v-else-if="variant === 'part'">
          <div class="cloud cloud-left" />
          <div class="cloud cloud-right" />
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" class="relative text-[#241536]">
            <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" fill="currentColor" fill-opacity="0.6" />
          </svg>
        </template>

        <!-- SUNRISE (sunset / anniversaire) -->
        <template v-else-if="variant === 'sunrise'">
          <div class="sunrise-glow" />
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" class="relative text-ink">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" fill-opacity="0.55" />
          </svg>
        </template>

        <!-- BURST (candy / fete / neon) -->
        <template v-else>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" class="relative" :class="textOn[accent]">
            <path d="M12 2l2.2 5.3 5.8.5-4.4 3.8 1.4 5.7L12 14.3 6.9 17.3l1.4-5.7-4.4-3.8 5.8-.5z" fill="currentColor" fill-opacity="0.55" />
          </svg>
        </template>

        <p class="absolute bottom-8 font-body text-xs font-medium uppercase tracking-[0.15em]" :class="textOn[accent]" style="opacity: 0.5">
          Touche pour ouvrir
        </p>
      </button>

      <ConfettiCanvas v-if="variant === 'burst'" ref="confettiRef" />
    </div>

    <!-- SECTIONS SUPPLEMENTAIRES -->
    <div v-if="opened && hasMore" class="mt-12 space-y-16">
      <section
        v-if="date || location"
        ref="detailsTarget"
        class="mx-auto max-w-md text-center transition-all duration-700"
        :class="detailsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <p class="font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream/40">Details</p>
        <div class="mt-4 space-y-2">
          <p v-if="date" class="font-display text-2xl font-bold text-cream">{{ date }}</p>
          <p v-if="location" class="font-body text-sm text-cream/60">{{ location }}</p>
        </div>
      </section>

      <section
        v-if="timeline?.length"
        ref="timelineTarget"
        class="mx-auto max-w-md transition-all duration-700"
        :class="timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <p class="text-center font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream/40">Programme</p>
        <div class="mt-6 space-y-0">
          <div v-for="(item, i) in timeline" :key="i" class="relative flex gap-4 pb-8 last:pb-0">
            <div class="flex flex-col items-center">
              <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
              <span v-if="i < timeline.length - 1" class="mt-1 w-px flex-1 bg-cream/15" />
            </div>
            <div class="-mt-1">
              <p class="font-mono text-xs uppercase tracking-wide text-gold/80">{{ item.time }}</p>
              <p class="mt-0.5 font-body text-sm text-cream/80">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="closing"
        ref="closingTarget"
        class="mx-auto max-w-md text-center transition-all duration-700"
        :class="closingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <p class="font-display text-xl italic text-cream/80 text-balance">{{ closing }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cover {
  transition: opacity 0.5s ease 0.2s;
}

.shimmer-text {
  background: linear-gradient(100deg, currentColor 40%, #ffc857 50%, currentColor 60%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shimmerSweep 5s ease-in-out infinite;
}
@keyframes shimmerSweep {
  0%,
  40% {
    background-position: 200% 0;
  }
  60%,
  100% {
    background-position: -100% 0;
  }
}

/* SEAL */
.seal {
  background: radial-gradient(circle at 35% 30%, #d9b34c, #a9791f 70%);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.35);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}
.cover-seal-open .seal {
  transform: scale(1.3) rotate(12deg);
  opacity: 0;
}
.seal-crack-left,
.seal-crack-right {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 80px;
  margin-top: -40px;
  background: radial-gradient(circle at 70% 30%, #d9b34c, #a9791f 70%);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.seal-crack-left {
  margin-left: -40px;
  border-radius: 40px 0 0 40px;
}
.seal-crack-right {
  border-radius: 0 40px 40px 0;
}
.cover-seal-open .seal-crack-left {
  opacity: 1;
  transform: translateX(-14px) rotate(-10deg);
}
.cover-seal-open .seal-crack-right {
  opacity: 1;
  transform: translateX(14px) rotate(10deg);
}

/* BLOOM */
.petal {
  position: absolute;
  width: 70px;
  height: 90px;
  background: radial-gradient(circle at 30% 30%, #d8ead9, #9cc2a2 75%);
  border-radius: 50% 50% 50% 0;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease;
}
.petal-1 { transform: rotate(0deg) translateY(-6px); }
.petal-2 { transform: rotate(90deg) translateY(-6px); }
.petal-3 { transform: rotate(180deg) translateY(-6px); }
.petal-4 { transform: rotate(270deg) translateY(-6px); }
.cover-bloom-open .petal-1 { transform: rotate(-25deg) translate(-90px, -110px); opacity: 0; }
.cover-bloom-open .petal-2 { transform: rotate(115deg) translate(90px, -110px); opacity: 0; }
.cover-bloom-open .petal-3 { transform: rotate(205deg) translate(90px, 110px); opacity: 0; }
.cover-bloom-open .petal-4 { transform: rotate(295deg) translate(-90px, 110px); opacity: 0; }

/* PART */
.cloud {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  filter: blur(2px);
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease;
}
.cloud-left { transform: translateX(-40px); }
.cloud-right { transform: translateX(40px); }
.cover-part-open .cloud-left { transform: translateX(-220px); opacity: 0; }
.cover-part-open .cloud-right { transform: translateX(220px); opacity: 0; }

/* SUNRISE */
.sunrise-glow {
  position: absolute;
  bottom: -30%;
  left: 50%;
  width: 260px;
  height: 260px;
  margin-left: -130px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 87, 0.9), rgba(255, 107, 139, 0.2) 60%, transparent 75%);
  transition: transform 0.7s ease, opacity 0.6s ease;
}
.cover-sunrise-open .sunrise-glow {
  transform: scale(2.6) translateY(-10%);
  opacity: 0;
}

/* BURST */
.cover-burst-open {
  transform: scale(0.85);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

@media (prefers-reduced-motion: reduce) {
  .shimmer-text,
  .petal,
  .cloud,
  .sunrise-glow,
  .seal,
  .seal-crack-left,
  .seal-crack-right {
    animation: none;
    transition-duration: 0.05s;
  }
}
</style>
