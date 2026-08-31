<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
type Accent =
  | 'sunset' | 'candy' | 'gold' | 'sage' | 'sky' | 'neon'
  | 'blush' | 'terracotta' | 'champagne' | 'pearl' | 'navy' | 'burgundy'
  | 'ruby' | 'lavender' | 'noir' | 'emerald' | 'ocean' | 'mint' | 'rose'
  | 'forest' | 'midnight'

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
    rsvpSlug?: string
    photoUrl?: string
    eventAt?: string
    musicUrl?: string
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
    rsvpSlug: '',
    photoUrl: '',
    eventAt: '',
    musicUrl: '',
  },
)

type Layout = 'classic' | 'poster' | 'editorial' | 'pastel' | 'celebration'

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
  layout: Layout
}

// classic = mariage (floral, romantique) · poster = fête (grand format, punchy)
// editorial = invitation (raffine, minimal) · pastel = naissance (doux, arrondi)
// celebration = anniversaire (rayonnant, dramatique)
const themes: Record<Accent, Theme> = {
  gold: {
    layout: 'classic',
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
    layout: 'classic',
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
    layout: 'pastel',
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
    layout: 'celebration',
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
    layout: 'poster',
    bg: 'linear-gradient(175deg, #1E1233 0%, #251741 55%, #1A0F2D 100%)',
    bgSoft: '#251741',
    ink: '#F6EFFF',
    accent: '#E9B8FF',
    accentSoft: '#8B5CF6',
    eyebrow: 'Fête',
    scriptTitle: false,
    particles: '#E9B8FF',
    dark: true,
  },
  neon: {
    layout: 'poster',
    bg: 'linear-gradient(175deg, #12091F 0%, #1B0E2E 55%, #120A21 100%)',
    bgSoft: '#1B0E2E',
    ink: '#FFF3F6',
    accent: '#FF6B8B',
    accentSoft: '#8B5CF6',
    eyebrow: 'Fête',
    scriptTitle: false,
    particles: '#FF9DB3',
    dark: true,
  },
  blush: {
    layout: 'classic',
    bg: 'linear-gradient(175deg, #FDF6F7 0%, #FAEAEC 55%, #F5DDE1 100%)',
    bgSoft: '#FAEAEC',
    ink: '#6E4249',
    accent: '#C4808C',
    accentSoft: '#E3B7BF',
    eyebrow: 'Mariage',
    scriptTitle: true,
    particles: '#D89AA6',
  },
  terracotta: {
    layout: 'classic',
    bg: 'linear-gradient(175deg, #FBF4EE 0%, #F6E7DA 55%, #EFD8C4 100%)',
    bgSoft: '#F6E7DA',
    ink: '#7A4A31',
    accent: '#BC6C46',
    accentSoft: '#DDA382',
    eyebrow: 'Mariage',
    scriptTitle: true,
    particles: '#CE8B64',
  },
  champagne: {
    layout: 'editorial',
    bg: 'linear-gradient(175deg, #FCFAF4 0%, #F7F1E2 55%, #F0E6CD 100%)',
    bgSoft: '#F7F1E2',
    ink: '#6E5F3B',
    accent: '#B9A15C',
    accentSoft: '#DBCB9C',
    eyebrow: 'Fiançailles',
    scriptTitle: true,
    particles: '#CCB672',
  },
  pearl: {
    layout: 'editorial',
    bg: 'linear-gradient(175deg, #FDFDFC 0%, #F6F5F1 55%, #ECEAE3 100%)',
    bgSoft: '#F6F5F1',
    ink: '#5C5A50',
    accent: '#A8A28D',
    accentSoft: '#CFCBBB',
    eyebrow: 'Baptême',
    scriptTitle: true,
    particles: '#BBB6A2',
  },
  navy: {
    layout: 'editorial',
    bg: 'linear-gradient(175deg, #0F1B33 0%, #14233F 55%, #0C1628 100%)',
    bgSoft: '#14233F',
    ink: '#EFE7D2',
    accent: '#C9A85C',
    accentSoft: '#39527A',
    eyebrow: 'Gala',
    scriptTitle: true,
    particles: '#D8BD7B',
    dark: true,
  },
  burgundy: {
    layout: 'editorial',
    bg: 'linear-gradient(175deg, #3B1420 0%, #4A1A28 55%, #2E0F19 100%)',
    bgSoft: '#4A1A28',
    ink: '#F6E4DB',
    accent: '#D69C7E',
    accentSoft: '#7A3548',
    eyebrow: 'Invitation',
    scriptTitle: true,
    particles: '#E0AC8F',
    dark: true,
  },
  ruby: {
    layout: 'editorial',
    bg: 'linear-gradient(175deg, #FDF3F4 0%, #FAE3E6 55%, #F5D0D6 100%)',
    bgSoft: '#FAE3E6',
    ink: '#7C2D3B',
    accent: '#C34F63',
    accentSoft: '#E39EAB',
    eyebrow: 'Avec amour',
    scriptTitle: true,
    particles: '#D47183',
  },
  lavender: {
    layout: 'celebration',
    bg: 'linear-gradient(175deg, #FAF8FD 0%, #F1ECFA 55%, #E5DDF4 100%)',
    bgSoft: '#F1ECFA',
    ink: '#544672',
    accent: '#8E7AB5',
    accentSoft: '#C0B3DC',
    eyebrow: 'Anniversaire',
    scriptTitle: false,
    particles: '#A695C8',
  },
  noir: {
    layout: 'celebration',
    bg: 'linear-gradient(175deg, #131313 0%, #1C1B18 55%, #0E0E0D 100%)',
    bgSoft: '#1C1B18',
    ink: '#F2ECDD',
    accent: '#D4B36A',
    accentSoft: '#3A362B',
    eyebrow: 'Anniversaire',
    scriptTitle: false,
    particles: '#E2C784',
    dark: true,
  },
  emerald: {
    layout: 'poster',
    bg: 'linear-gradient(175deg, #0D2B24 0%, #113830 55%, #0A211C 100%)',
    bgSoft: '#113830',
    ink: '#EAF5EF',
    accent: '#D9BE7F',
    accentSoft: '#2C5C4F',
    eyebrow: 'Reveillon',
    scriptTitle: true,
    particles: '#E5CC93',
    dark: true,
  },
  ocean: {
    layout: 'pastel',
    bg: 'linear-gradient(175deg, #F3FAFC 0%, #E5F2F7 55%, #D4E8F0 100%)',
    bgSoft: '#E5F2F7',
    ink: '#2E566B',
    accent: '#4E8BA8',
    accentSoft: '#9CC4D6',
    eyebrow: 'Naissance',
    scriptTitle: true,
    particles: '#74A9C2',
  },
  mint: {
    layout: 'pastel',
    bg: 'linear-gradient(175deg, #F5FCF9 0%, #E7F6EF 55%, #D6EEE2 100%)',
    bgSoft: '#E7F6EF',
    ink: '#3E6455',
    accent: '#66A388',
    accentSoft: '#A9D2BE',
    eyebrow: 'Baby shower',
    scriptTitle: true,
    particles: '#86BB9F',
  },
  rose: {
    layout: 'pastel',
    bg: 'linear-gradient(175deg, #FEF7F9 0%, #FBEBF0 55%, #F7DCE6 100%)',
    bgSoft: '#FBEBF0',
    ink: '#77465A',
    accent: '#C87D9B',
    accentSoft: '#E5B4C8',
    eyebrow: 'Naissance',
    scriptTitle: true,
    particles: '#D695B0',
  },
  forest: {
    layout: 'poster',
    bg: 'linear-gradient(175deg, #F6FAF3 0%, #EAF3E4 55%, #DCEAD2 100%)',
    bgSoft: '#EAF3E4',
    ink: '#3F5A34',
    accent: '#6C9457',
    accentSoft: '#A9C899',
    eyebrow: 'Garden party',
    scriptTitle: false,
    particles: '#8AAF75',
  },
  midnight: {
    layout: 'poster',
    bg: 'linear-gradient(175deg, #171233 0%, #201A45 55%, #120E28 100%)',
    bgSoft: '#201A45',
    ink: '#EDEAFB',
    accent: '#A99BE8',
    accentSoft: '#3B3270',
    eyebrow: 'Nouvel an',
    scriptTitle: false,
    particles: '#BCB0F0',
    dark: true,
  },
}


const t = computed(() => themes[props.accent] || themes.gold)
const layout = computed(() => t.value.layout)

const frameStyle: Record<Layout, 'floral' | 'minimal' | 'geometric' | 'dashed' | 'rays'> = {
  classic: 'floral',
  poster: 'geometric',
  editorial: 'minimal',
  pastel: 'dashed',
  celebration: 'rays',
}
const dividerStyle: Record<Layout, 'floral' | 'bold' | 'line' | 'dots' | 'rays'> = {
  classic: 'floral',
  poster: 'bold',
  editorial: 'line',
  pastel: 'dots',
  celebration: 'rays',
}
const frame = computed(() => frameStyle[layout.value])
const divider = computed(() => dividerStyle[layout.value])

const titleFontClass = computed(() => {
  switch (layout.value) {
    case 'poster':
      return 'font-poster uppercase tracking-tight'
    case 'editorial':
      return 'font-editorial italic'
    case 'pastel':
      return 'font-playful'
    case 'celebration':
      return 'font-celebration font-bold'
    default:
      return t.value.scriptTitle ? 'font-script' : 'font-serif-display font-semibold'
  }
})
const titleSize = computed(() => {
  switch (layout.value) {
    case 'poster':
      return 'clamp(2.4rem, 10cqw, 4.6rem)'
    case 'editorial':
      return 'clamp(1.8rem, 6cqw, 3.1rem)'
    case 'pastel':
      return 'clamp(2.1rem, 7.5cqw, 3.6rem)'
    case 'celebration':
      return 'clamp(2.3rem, 8cqw, 4rem)'
    default:
      return t.value.scriptTitle ? 'clamp(2.4rem, 9cqw, 4.5rem)' : 'clamp(1.9rem, 7cqw, 3.6rem)'
  }
})
const bodyFontClass = computed(() => (layout.value === 'poster' ? 'font-body' : layout.value === 'pastel' ? 'font-playful' : 'font-serif-display'))
const accentFontClass = computed(() => {
  switch (layout.value) {
    case 'poster':
      return 'font-poster uppercase tracking-tight'
    case 'pastel':
      return 'font-playful'
    default:
      return 'font-script'
  }
})
const eyebrowBadge = computed(() => layout.value === 'poster' || layout.value === 'pastel')
const photoWrapClass = computed(() => {
  switch (layout.value) {
    case 'poster':
      return 'rounded-lg border-[7px] -rotate-3'
    case 'editorial':
      return 'rounded-sm border'
    case 'pastel':
      return 'rounded-full border-4 border-dashed'
    case 'celebration':
      return 'rounded-full border-4'
    default:
      return 'rounded-t-full border-4'
  }
})

function sunburstLines(count: number) {
  let inner = ''
  for (let i = 1; i <= count; i++) {
    const angle = (i * Math.PI) / (count / 2)
    const x2 = 100 + 100 * Math.cos(angle)
    const y2 = 100 + 100 * Math.sin(angle)
    inner += `<line x1="100" y1="100" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1"/>`
  }
  return inner
}
const sunburstHero = computed(() => svgBackgroundUrl(sunburstLines(24), '0 0 200 200', t.value.accent))
const sunburstCover = computed(() => svgBackgroundUrl(sunburstLines(20), '0 0 200 200', t.value.accent))

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
  blush: 'seal',
  terracotta: 'sunrise',
  champagne: 'seal',
  pearl: 'part',
  navy: 'seal',
  burgundy: 'seal',
  ruby: 'bloom',
  lavender: 'bloom',
  noir: 'seal',
  emerald: 'burst',
  ocean: 'part',
  mint: 'part',
  rose: 'bloom',
  forest: 'bloom',
  midnight: 'burst',
}
const variant = computed(() => openStyle[props.accent] || 'seal')
const hasMore = computed(() => Boolean(props.date || props.location || props.closing || props.timeline?.length || props.rsvpSlug))

// ---- RSVP ----
const rsvpName = ref('')
const rsvpGuests = ref(1)
const rsvpMessage = ref('')
const rsvpChoice = ref<null | boolean>(null)
const rsvpSending = ref(false)
const rsvpDone = ref(false)
const rsvpError = ref('')
const rsvpChoiceMissing = ref(false)

async function sendRsvp() {
  if (rsvpChoice.value === null) {
    rsvpChoiceMissing.value = true
    rsvpError.value = 'Merci de preciser si vous serez present avant d\'envoyer.'
    return
  }
  if (!rsvpName.value.trim()) {
    rsvpError.value = 'Merci d\'indiquer votre nom avant d\'envoyer.'
    return
  }
  rsvpSending.value = true
  rsvpError.value = ''
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/cards/public/${props.rsvpSlug}/rsvp`, {
      method: 'POST',
      body: {
        name: rsvpName.value.trim(),
        attending: rsvpChoice.value,
        guests: rsvpChoice.value ? Number(rsvpGuests.value) || 1 : 1,
        message: rsvpMessage.value.trim() || undefined,
      },
    })
    rsvpDone.value = true
  } catch (e) {
    rsvpError.value = "L'envoi a échoué, réessaie."
  } finally {
    rsvpSending.value = false
  }
}

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
  // attempt to start music immediately (user gesture)
  if (props.musicUrl) {
    if (isYouTube.value) {
      youtubeReloadKey.value += 1
      musicPlaying.value = true
      // Unlike the direct <audio> path below, a cross-origin YouTube iframe
      // gives no reliable way to detect whether unmuted autoplay actually
      // started (no play() promise to await) - browsers commonly block it
      // silently for an embed the visitor has no prior engagement with, so
      // this just assumes failure and always offers the manual button
      // rather than risk leaving the visitor with silence and no way out.
      autoplayBlocked.value = true
    } else {
      try {
        const t = new Audio(props.musicUrl)
        t.loop = true
          t.play().then(() => {
            tempAudioRef.value = t
            musicPlaying.value = true
          }).catch(() => {
            autoplayBlocked.value = true
          })
      } catch {}
    }
  }
  window.setTimeout(() => {
    opened.value = true
    opening.value = false
  }, 750)
}

// ---- PHOTO ----
const resolvedPhoto = computed(() => {
  if (!props.photoUrl) return ''
  if (props.photoUrl.startsWith('http')) return props.photoUrl
  const config = useRuntimeConfig()
  const rawOrigin = (config.public.apiBase as string) || ''
  const origin = rawOrigin.replace(/\/api\/?$/, '')

  // Normalize photo path:
  // - '/uploads/xxx' -> keep leading slash
  // - 'uploads/xxx' -> '/uploads/xxx'
  // - 'filename.jpg' -> '/uploads/filename.jpg' (legacy entries)
  let path = props.photoUrl
  if (!path.startsWith('/')) {
    if (path.startsWith('uploads/')) path = `/${path}`
    else path = `/uploads/${path}`
  }

  // If origin is empty, return absolute path so browser requests host/uploads/...
  return origin ? `${origin}${path}` : path
})

// ---- COUNTDOWN ----
const now = ref(Date.now())
let countdownTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  countdownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (tempAudioRef.value) {
    try {
      tempAudioRef.value.pause()
      tempAudioRef.value.src = ''
    } catch {}
    tempAudioRef.value = null
  }
})
const countdown = computed(() => {
  if (!props.eventAt) return null
  const target = new Date(props.eventAt).getTime()
  if (Number.isNaN(target)) return null
  const diff = target - now.value
  if (diff <= 0) return { over: true, d: 0, h: 0, m: 0, s: 0 }
  return {
    over: false,
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
})

// ---- MAPS ----
const mapsUrl = computed(() =>
  props.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.location)}`
    : '',
)

// ---- MUSIQUE ----
const audioRef = ref<HTMLAudioElement | null>(null)
const tempAudioRef = ref<HTMLAudioElement | null>(null)
const youtubeReloadKey = ref(0)
const musicPlaying = ref(false)
const autoplayBlocked = ref(false)

const isYouTube = computed(() => {
  if (!props.musicUrl) return false
  return /youtube\.com|youtu\.be/.test(props.musicUrl)
})

function extractYouTubeId(url: string) {
  try {
    const u = new URL(url)
    // youtu.be short link
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    // youtube.com variants: /watch?v=..., /shorts/ID, /embed/ID
    if (u.hostname.includes('youtube.com') || u.hostname.includes('www.youtube.com')) {
      // /shorts/<id>
      const shortMatch = u.pathname.match(/\/shorts\/([0-9A-Za-z_-]{11})/)
      if (shortMatch) return shortMatch[1]
      // /embed/<id>
      const embedMatch = u.pathname.match(/\/embed\/([0-9A-Za-z_-]{11})/)
      if (embedMatch) return embedMatch[1]
      // standard watch?v=
      const v = u.searchParams.get('v')
      if (v) return v
    }
  } catch {
    // fallback regex
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return m ? m[1] : null
  }
  return null
}

const youtubeEmbedSrc = computed(() => {
  if (!props.musicUrl) return ''
  const id = extractYouTubeId(props.musicUrl)
  if (!id) return ''
  const params = new URLSearchParams({
    autoplay: '1',
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    loop: '1',
    playlist: id,
    mute: '0',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
})

function toggleMusic() {
  if (isYouTube.value) {
    if (musicPlaying.value) {
      musicPlaying.value = false
      return
    }
    youtubeReloadKey.value += 1
    musicPlaying.value = true
    return
  }

  const el = audioRef.value
  if (!el) return
  if (musicPlaying.value) {
    el.pause()
    musicPlaying.value = false
  } else {
    el.play().then(() => {
      musicPlaying.value = true
    }).catch(() => undefined)
  }
}

async function userStartMusic() {
  // Called from a user gesture to (re)start music when autoplay was blocked
  autoplayBlocked.value = false
  if (!props.musicUrl) return
  try {
    if (isYouTube.value) {
      youtubeReloadKey.value += 1
      musicPlaying.value = true
    } else {
      if (!audioRef.value) {
        const a = new Audio(props.musicUrl)
        a.loop = true
        audioRef.value = a
      }
      try {
        await audioRef.value.play()
        musicPlaying.value = true
      } catch {}
    }
  } catch {}
}

const { target: detailsTarget, visible: detailsVisible } = useScrollReveal()
const { target: timelineTarget, visible: timelineVisible } = useScrollReveal()
const { target: closingTarget, visible: closingVisible } = useScrollReveal()
const { target: rsvpTarget, visible: rsvpVisible } = useScrollReveal()
const { target: countdownTarget, visible: countdownVisible } = useScrollReveal()

defineExpose({ open, opened })

// Transfer temporary audio playback to the DOM audio element once opened
watch(
  opened,
  async (val) => {
    if (!val) return
    await nextTick()
    try {
      // transfer temporary audio to DOM audio element if present
      if (tempAudioRef.value && audioRef.value instanceof HTMLAudioElement) {
        const temp = tempAudioRef.value
        const dom = audioRef.value
        try {
          dom.currentTime = temp.currentTime || 0
        } catch {}
        dom.play().then(() => {
          musicPlaying.value = true
        }).catch(() => {})
        try {
          temp.pause()
          temp.src = ''
        } catch {}
        tempAudioRef.value = null
        return
      }

      // if musicUrl provided, ensure playback starts when opened
      if (props.musicUrl && !musicPlaying.value) {
        if (isYouTube.value) {
          youtubeReloadKey.value += 1
          musicPlaying.value = true
        } else {
          try {
            if (audioRef.value instanceof HTMLAudioElement) {
              try {
                await audioRef.value.play()
                musicPlaying.value = true
              } catch {
                autoplayBlocked.value = true
              }
            }
          } catch {}
        }
      }
    } catch {}
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="experience relative w-full overflow-hidden"
    style="container-type: inline-size"
    :class="compact ? 'rounded-3xl' : ''"
    :style="{ background: t.bg, color: t.ink }"
  >
    <AmbientMagic :color="t.particles" :density="opened ? 26 : 12" />

    <!-- ============ HERO ============ -->
    <section
      class="relative flex flex-col items-center justify-center px-6 text-center"
      :class="compact ? 'min-h-[540px] py-14' : 'min-h-[92vh] py-20'"
    >
      <OrnamentFrame v-if="opened" :color="t.accent" :style="frame" style="--frame-inset:2.5rem" />
        
      <!-- ornements du hero, selon le layout -->
      <template v-if="layout === 'classic'">
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
      </template>

      <!-- POSTER : diagonales franches -->
      <div v-else-if="layout === 'poster'" class="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.14]" :style="{ color: t.accent }">
        <div class="absolute -left-1/4 top-0 h-[200%] w-16 -rotate-[18deg]" :style="{ background: 'currentColor' }" />
        <div class="absolute left-1/4 top-0 h-[200%] w-8 -rotate-[18deg]" :style="{ background: 'currentColor' }" />
        <div class="absolute right-0 top-0 h-[200%] w-16 -rotate-[18deg]" :style="{ background: 'currentColor' }" />
      </div>

      <!-- EDITORIAL : filets fins haut/bas, tres sobre -->
      <template v-else-if="layout === 'editorial'">
        <div class="pointer-events-none absolute inset-x-10 top-10 h-px opacity-40" :style="{ background: t.accent }" />
        <div class="pointer-events-none absolute inset-x-10 bottom-10 h-px opacity-40" :style="{ background: t.accent }" />
      </template>

      <!-- PASTEL : bulles floues -->
      <template v-else-if="layout === 'pastel'">
        <div class="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full opacity-40 blur-2xl" :style="{ background: t.accentSoft }" />
        <div class="pointer-events-none absolute -right-6 top-1/3 h-24 w-24 rounded-full opacity-40 blur-2xl" :style="{ background: t.accent }" />
        <div class="pointer-events-none absolute bottom-10 left-1/4 h-28 w-28 rounded-full opacity-30 blur-2xl" :style="{ background: t.accentSoft }" />
      </template>

      <!-- CELEBRATION : rayons depuis le centre -->
      <div
        v-else-if="layout === 'celebration'"
        class="pointer-events-none absolute left-1/2 top-1/2 h-[140cqw] w-[140cqw] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
        :style="{ backgroundImage: sunburstHero, backgroundSize: '100% 100%' }"
      />

      <!-- contenu revele -->
      <div
        class="relative z-10 mx-auto max-w-xl transition-all duration-1000 ease-out"
        :class="opened ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'"
      >
        <div v-if="resolvedPhoto" class="mx-auto mb-7 w-fit">
          <div
            class="overflow-hidden shadow-xl"
            :class="photoWrapClass"
            :style="{ borderColor: t.accentSoft, width: 'clamp(120px, 34cqw, 190px)', height: 'clamp(150px, 44cqw, 245px)' }"
          >
            <img :src="resolvedPhoto" alt="" crossorigin="anonymous" class="h-full w-full object-cover" />
          </div>
        </div>

        <p
          v-if="!eyebrowBadge"
          class="text-[11px] font-semibold uppercase tracking-[0.35em]"
          :style="{ color: t.accent }"
        >
          {{ t.eyebrow }}
        </p>
        <p
          v-else
          class="mx-auto w-fit rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] shadow-sm"
          :style="{ background: t.accent, color: t.dark ? t.bgSoft : '#FFFDF7' }"
        >
          {{ t.eyebrow }}
        </p>

        <OrnamentDivider :color="t.accent" :style="divider" class="mt-4" />

        <h1
          class="mt-6 break-words text-balance leading-[1.1]"
          :class="titleFontClass"
          :style="{ fontSize: titleSize }"
        >
          {{ title }}
        </h1>

        <p v-if="subtitle" class="mt-4 break-words italic opacity-80" :class="bodyFontClass" :style="{ fontSize: 'clamp(1rem, 3.4cqw, 1.5rem)' }">
          {{ subtitle }}
        </p>

        <p v-if="message" class="mx-auto mt-6 max-w-md break-words leading-relaxed opacity-70" :class="bodyFontClass" :style="{ fontSize: 'clamp(0.95rem, 2.6cqw, 1.15rem)' }">
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
        

        <!-- enveloppe (plis) pour le theme gold -->
        <svg v-if="variant === 'seal'" class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,0 100,0 50,46" :fill="t.accentSoft" fill-opacity="0.22" :stroke="t.accent" stroke-opacity="0.3" stroke-width="0.25" vector-effect="non-scaling-stroke" />
          <polygon points="0,100 100,100 50,52" :fill="t.accentSoft" fill-opacity="0.16" :stroke="t.accent" stroke-opacity="0.25" stroke-width="0.25" vector-effect="non-scaling-stroke" />
          <polygon points="0,0 0,100 50,49" :fill="t.accentSoft" fill-opacity="0.12" :stroke="t.accent" stroke-opacity="0.2" stroke-width="0.2" vector-effect="non-scaling-stroke" />
          <polygon points="100,0 100,100 50,49" :fill="t.accentSoft" fill-opacity="0.12" :stroke="t.accent" stroke-opacity="0.2" stroke-width="0.2" vector-effect="non-scaling-stroke" />
        </svg>

        <!-- decor de la cover, selon le layout -->
        <template v-if="layout === 'classic'">
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
        </template>
        <div v-else-if="layout === 'poster'" class="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.16]" :style="{ color: t.accent }">
          <div class="absolute -left-1/4 top-0 h-[200%] w-16 -rotate-[18deg]" :style="{ background: 'currentColor' }" />
          <div class="absolute right-0 top-0 h-[200%] w-16 -rotate-[18deg]" :style="{ background: 'currentColor' }" />
        </div>
        <template v-else-if="layout === 'pastel'">
          <div class="pointer-events-none absolute left-6 top-10 h-24 w-24 rounded-full opacity-40 blur-2xl" :style="{ background: t.accentSoft }" />
          <div class="pointer-events-none absolute bottom-10 right-6 h-24 w-24 rounded-full opacity-40 blur-2xl" :style="{ background: t.accent }" />
        </template>
        <div
          v-else-if="layout === 'celebration'"
          class="pointer-events-none absolute left-1/2 top-1/2 h-[120cqw] w-[120cqw] -translate-x-1/2 -translate-y-1/2 opacity-20"
          :style="{ backgroundImage: sunburstCover, backgroundSize: '100% 100%' }"
        />

        <!-- halo lumineux qui pulse pour inviter au clic -->
        <div
          class="glow-pulse pointer-events-none absolute left-1/2 top-1/2 z-[5] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
          :style="{ background: `radial-gradient(circle, ${t.accent}80, transparent 70%)` }"
        />
        <div
          class="glow-pulse glow-pulse-delay pointer-events-none absolute left-1/2 top-1/2 z-[5] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
          :style="{ background: `radial-gradient(circle, ${t.accent}80, transparent 70%)` }"
        />

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

      <!-- Autoplay blocked fallback: small CTA to let user enable audio -->
      <div v-if="autoplayBlocked" class="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          @click="userStartMusic"
          class="rounded-full bg-gold/95 px-4 py-2 font-body text-sm font-semibold text-night shadow-lg"
        >
          Activer la musique
        </button>
      </div>

      <ConfettiCanvas v-if="variant === 'burst'" ref="confettiRef" class="z-30" />

      <!-- musique de fond -->
      <template v-if="musicUrl && opened">
        <iframe
          v-if="isYouTube && musicPlaying"
          :key="youtubeReloadKey"
          :src="youtubeEmbedSrc"
          class="pointer-events-none"
          style="position:fixed;bottom:0;right:0;width:2px;height:2px;opacity:0.01;overflow:hidden;"
          aria-hidden="true"
          title="YouTube music player"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerpolicy="strict-origin-when-cross-origin"
        />
        <audio v-else ref="audioRef" :src="musicUrl" loop preload="none" />
        <button
          type="button"
          class="focus-ring absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur transition hover:scale-110"
          :style="{ background: t.accent, color: t.dark ? t.bgSoft : '#FFFDF7' }"
          :aria-label="musicPlaying ? 'Couper la musique' : 'Jouer la musique'"
          @click="toggleMusic"
        >
          <svg v-if="!musicPlaying" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18V6l10-2v12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8" />
            <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </button>
      </template>
    </section>

    <!-- ============ SECTIONS ============ -->
    <template v-if="opened && hasMore">
      <!-- COMPTE A REBOURS -->
      <section
        v-if="countdown"
        ref="countdownTarget"
        class="relative px-6 py-16 text-center transition-all duration-1000"
        :class="countdownVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <p class="text-[11px] font-semibold uppercase tracking-[0.35em]" :style="{ color: t.accent }">
          {{ countdown.over ? 'C est aujourd hui' : 'Jour J dans' }}
        </p>
        <div v-if="!countdown.over" class="mx-auto mt-8 flex max-w-md items-stretch justify-center gap-3">
          <div v-for="unit in [[countdown.d, 'jours'], [countdown.h, 'heures'], [countdown.m, 'min'], [countdown.s, 'sec']]" :key="unit[1] as string" class="flex-1">
            <div class="relative flex items-center justify-center rounded-2xl border px-2 py-4" :style="{ borderColor: t.accentSoft }">
              <p class="font-semibold tabular-nums leading-none" :class="bodyFontClass" :style="{ fontSize: 'clamp(1.6rem, 6cqw, 2.6rem)' }">
                {{ String(unit[0]).padStart(2, '0') }}
              </p>
            </div>
            <p class="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60">{{ unit[1] }}</p>
          </div>
        </div>
        <p v-else class="mt-6 text-4xl" :class="accentFontClass" :style="{ color: t.accent }">Le grand jour est arrive</p>
      </section>

      <!-- DETAILS -->
      <section
        v-if="date || location"
        ref="detailsTarget"
        class="relative px-6 py-20 text-center transition-all duration-1000"
        :class="detailsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <OrnamentDivider :color="t.accent" :style="divider" />
        <p class="mt-8 text-[11px] font-semibold uppercase tracking-[0.35em]" :style="{ color: t.accent }">
          Quand &amp; ou
        </p>
        <div class="relative mx-auto mt-8 max-w-md px-10 py-12 lg:px-16 lg:py-16">
          <OrnamentFrame v-if="opened" :color="t.accent" :style="frame" style="--frame-inset:2rem" />
          <p v-if="date" class="break-words font-semibold" :class="bodyFontClass" :style="{ fontSize: 'clamp(1.3rem, 4.5cqw, 1.9rem)' }">{{ date }}</p>
          <p v-if="location" class="mt-3 break-words italic opacity-70" :class="bodyFontClass" :style="{ fontSize: 'clamp(0.95rem, 2.8cqw, 1.15rem)' }">{{ location }}</p>
          <a
            v-if="mapsUrl"
            :href="mapsUrl"
            target="_blank"
            rel="noopener"
            class="focus-ring mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition hover:scale-105"
            :class="bodyFontClass"
            :style="{ borderColor: t.accent, color: t.accent }"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" stroke="currentColor" stroke-width="1.6" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6" />
            </svg>
            Voir le plan d'acces
          </a>
        </div>
      </section>

      <!-- TIMELINE -->
      <section
        v-if="timeline?.length"
        ref="timelineTarget"
        class="relative px-6 py-20 transition-all duration-1000"
        :class="timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <div v-if="layout === 'classic'" class="pointer-events-none absolute right-0 top-10 rotate-[24deg] -scale-x-100">
          <OrnamentFlora :color="t.accent" :opacity="0.2" class="h-28 w-36" />
        </div>
        <p class="text-center text-[11px] font-semibold uppercase tracking-[0.35em]" :style="{ color: t.accent }">
          Le programme
        </p>
        <OrnamentDivider :color="t.accent" :style="divider" class="mt-6" />
        <div class="mx-auto mt-12 max-w-md">
          <div v-for="(item, i) in timeline" :key="i" class="relative flex gap-6 pb-12 last:pb-0">
            <div class="flex flex-col items-center">
              <svg width="14" height="14" viewBox="0 0 14 14" :style="{ color: t.accent }">
                <path d="M7 0l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="currentColor" fill-opacity="0.8" />
              </svg>
              <span v-if="i < timeline.length - 1" class="mt-2 w-px flex-1" :style="{ background: t.accent, opacity: 0.25 }" />
            </div>
            <div class="-mt-0.5">
              <p class="text-xl font-semibold" :class="bodyFontClass" :style="{ color: t.accent }">{{ item.time }}</p>
              <p class="mt-1 text-lg italic opacity-75" :class="bodyFontClass">{{ item.label }}</p>
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
        <div v-if="layout === 'classic'" class="pointer-events-none mx-auto mb-6 flex justify-center">
          <OrnamentFlora :color="t.accent" :opacity="0.4" class="h-20 w-28" />
        </div>
        <p class="mx-auto max-w-md break-words leading-snug" :class="accentFontClass" :style="{ color: t.accent, fontSize: 'clamp(1.8rem, 6cqw, 3rem)' }">
          {{ closing }}
        </p>
        <OrnamentDivider :color="t.accent" :style="divider" class="mt-10" />
      </section>

      <!-- RSVP : exclu du telechargement image (formulaire interactif, inutile sur une image statique) -->
      <section
        v-if="rsvpSlug"
        ref="rsvpTarget"
        data-html2canvas-ignore
        class="relative px-6 pb-28 pt-4 transition-all duration-1000"
        :class="rsvpVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <p class="text-center text-[11px] font-semibold uppercase tracking-[0.35em]" :style="{ color: t.accent }">
          Répondez s'il vous plaît
        </p>
        <OrnamentDivider :color="t.accent" :style="divider" class="mt-6" />

        <div class="relative mx-auto mt-10 max-w-md px-10 py-14 lg:px-16 lg:py-18">
          <OrnamentFrame v-if="opened" :color="t.accent" :style="frame" style="--frame-inset:2.5rem" />

          <div v-if="rsvpDone" class="text-center">
            <p class="text-3xl" :class="accentFontClass" :style="{ color: t.accent }">Merci !</p>
            <p class="mt-3 italic opacity-75" :class="bodyFontClass">Votre réponse a bien été transmise.</p>
          </div>

          <div v-else class="space-y-5">
            <p
              class="text-center text-sm italic opacity-80"
              :class="bodyFontClass"
            >
              Serez-vous présent ?
            </p>
            <div
              class="flex justify-center gap-3 rounded-2xl transition"
              :class="rsvpChoiceMissing ? 'animate-pulse ring-2 ring-offset-2' : ''"
              :style="rsvpChoiceMissing ? { '--tw-ring-color': '#E14D4D', '--tw-ring-offset-color': t.bgSoft } : {}"
            >
              <button
                type="button"
                class="focus-ring rounded-full border px-6 py-2.5 text-base transition"
                :class="bodyFontClass"
                :style="rsvpChoice === true
                  ? { background: t.accent, color: t.dark ? t.bgSoft : '#FFFDF7', borderColor: t.accent }
                  : { borderColor: t.accent, color: 'inherit', opacity: 0.8 }"
                @click="rsvpChoice = true; rsvpChoiceMissing = false"
              >
                Je serai la
              </button>
              <button
                type="button"
                class="focus-ring rounded-full border px-6 py-2.5 text-base transition"
                :class="bodyFontClass"
                :style="rsvpChoice === false
                  ? { background: t.accent, color: t.dark ? t.bgSoft : '#FFFDF7', borderColor: t.accent }
                  : { borderColor: t.accent, color: 'inherit', opacity: 0.8 }"
                @click="rsvpChoice = false; rsvpChoiceMissing = false"
              >
                Je ne peux pas
              </button>
            </div>

            <input
              v-model="rsvpName"
              type="text"
              placeholder="Votre nom"
              class="focus-ring w-full rounded-xl border bg-transparent px-4 py-3 placeholder:opacity-50"
              :class="bodyFontClass"
              :style="{ borderColor: t.accentSoft }"
            />

            <div v-if="rsvpChoice === true" class="flex items-center justify-center gap-3">
              <label class="text-sm italic opacity-70" :class="bodyFontClass">Nous serons</label>
              <select
                v-model="rsvpGuests"
                class="focus-ring rounded-xl border bg-transparent px-3 py-2"
                :class="bodyFontClass"
                :style="{ borderColor: t.accentSoft }"
              >
                <option v-for="n in 8" :key="n" :value="n" :style="{ color: '#333' }">{{ n }}</option>
              </select>
              <span class="text-sm italic opacity-70" :class="bodyFontClass">personne(s)</span>
            </div>

            <textarea
              v-model="rsvpMessage"
              rows="2"
              placeholder="Un petit mot (optionnel)"
              class="focus-ring w-full resize-none rounded-xl border bg-transparent px-4 py-3 placeholder:opacity-50"
              :class="bodyFontClass"
              :style="{ borderColor: t.accentSoft }"
            />

            <p
              v-if="rsvpError"
              class="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center font-body text-sm font-semibold"
              style="background: rgba(225, 77, 77, 0.1); border-color: #E14D4D; color: #E14D4D;"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="shrink-0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                <path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
              {{ rsvpError }}
            </p>

            <button
              type="button"
              :disabled="rsvpSending"
              class="focus-ring w-full rounded-full py-3.5 text-lg font-semibold transition hover:scale-[1.02] disabled:opacity-60"
              :class="bodyFontClass"
              :style="{ background: t.accent, color: t.dark ? t.bgSoft : '#FFFDF7' }"
              @click="sendRsvp"
            >
              {{ rsvpSending ? 'Envoi...' : 'Envoyer ma reponse' }}
            </button>
          </div>
        </div>
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

/* halo lumineux qui pulse pour inviter au clic sur la carte fermee */
.glow-pulse {
  animation: pulseGlow 2.2s ease-out infinite;
}
.glow-pulse-delay {
  animation-delay: 1.1s;
}
@keyframes pulseGlow {
  0% {
    transform: translate(-50%, -50%) scale(0.75);
    opacity: 0.6;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.9);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.9);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cover,
  .seal,
  .petal,
  .sunrise-glow {
    transition-duration: 0.05s;
  }
  .glow-pulse {
    animation: none;
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>
