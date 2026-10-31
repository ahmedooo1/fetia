<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, useId } from 'vue'

// Enveloppe plein cadre posee sur la carte fermee : sceau de cire, rabat, carte qui sort.
// Les couleurs viennent du theme de la carte, la broderie et la cire captent la lumiere du doigt.

interface EnvelopeTheme {
  bg: string
  bgSoft: string
  ink: string
  accent: string
  accentSoft: string
  dark?: boolean
}

const props = withDefaults(defineProps<{ theme: EnvelopeTheme; monogram?: string; compact?: boolean }>(), {
  monogram: '&',
  compact: false,
})
const emit = defineEmits<{ seal: []; filled: []; done: [] }>()

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const id = (name: string) => `env${uid}-${name}`
const url = (name: string) => `url(#${id(name)})`

// ---- couleurs ----
function rgb(h: string) {
  const n = parseInt(h.replace('#', '').slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function mix(a: string, b: string, t: number) {
  const A = rgb(a)
  const B = rgb(b)
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

const c = computed(() => {
  const { bgSoft, ink, accent, accentSoft, dark } = props.theme
  return {
    paper: dark ? mix(bgSoft, '#ffffff', 0.06) : bgSoft,
    liner: dark ? accent : mix(accent, '#161616', 0.62),
    linerInk: dark ? bgSoft : accentSoft,
    ink,
    shade: dark ? 0.22 : 0.12,
    edge: dark ? mix(bgSoft, '#ffffff', 0.25) : '#FFFAF0',
    waxHi: mix(accent, '#ffffff', 0.42),
    wax: accent,
    waxLo: mix(accent, '#000000', 0.42),
    shadow: mix(ink, '#000000', 0.35),
  }
})

const linerPattern = computed(() => {
  const col = encodeURIComponent(c.value.linerInk)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 34 34'><g fill='none' stroke='${col}' stroke-width='.8' opacity='.7'><path d='M17 6c3 3 3 7 0 10c-3-3-3-7 0-10z'/><path d='M17 28c-3-3-3-7 0-10c3 3 3 7 0 10z'/><path d='M6 17c3-3 7-3 10 0c-3 3-7 3-10 0z'/><path d='M28 17c-3 3-7 3-10 0c3-3 7-3 10 0z'/></g><circle cx='17' cy='17' r='1.4' fill='${col}' opacity='.8'/><g fill='${col}' opacity='.5'><circle r='1'/><circle cx='34' cy='34' r='1'/><circle cx='34' r='1'/><circle cy='34' r='1'/></g></svg>`
  return `url("data:image/svg+xml,${svg}")`
})

// ---- hasard deterministe (meme rendu serveur et client) ----
let seed = 7
const rnd = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)]

// ---- broderie : guirlande au point lance sous le sceau ----
type P = [number, number]
const bez = (p: P[], t: number): P => {
  const u = 1 - t
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ]
}
const tan = (p: P[], t: number): P => {
  const a = bez(p, Math.max(0, t - 0.01))
  const b = bez(p, Math.min(1, t + 0.01))
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
}

const embroidery = computed(() => {
  seed = 7
  const { accent, accentSoft } = props.theme
  const T = {
    leafA: ['#6F8C5E', '#7E9A6B', '#88A574'],
    leafB: ['#55704A', '#5F7B52', '#4E6943'],
    stem: ['#5A6E3E', '#64794A'],
    petal: [accent, mix(accent, '#ffffff', 0.25), mix(accent, '#000000', 0.12)],
    petal2: [mix(accentSoft, '#ffffff', 0.45), mix(accentSoft, '#ffffff', 0.3)],
    knot: ['#C9A24B', '#D8B565', '#B68F3D'],
  }
  const o: string[] = []
  const line = (x1: number, y1: number, x2: number, y2: number, col: string, w: number) =>
    o.push(`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`)
  const knot = (x: number, y: number, r = 2) => o.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${pick(T.knot)}"/>`)
  const stem = (p: P[], n = 46) => {
    for (let i = 0; i < n; i++) {
      const a = bez(p, i / n)
      const b = bez(p, Math.min(1, (i + 1.7) / n))
      line(a[0], a[1] + 0.5, b[0], b[1] - 0.5, pick(T.stem), 2.1)
    }
  }
  const leaf = (x: number, y: number, ang: number, L: number, W: number, cols: string[][]) => {
    const dx = Math.cos(ang)
    const dy = Math.sin(ang)
    const nx = -dy
    const ny = dx
    const N = Math.round(L / 1.05)
    const hwAt = (t: number) => (W / 2) * Math.pow(Math.sin(Math.PI * Math.min(t, 0.985)), 0.7) * (1 - 0.12 * t)
    for (let k = 1; k <= N; k++) {
      const t = k / N
      const hw = hwAt(t)
      for (const s of [-1, 1]) {
        const mt = Math.min(1, t + 0.09)
        line(x + dx * L * mt, y + dy * L * mt, x + dx * L * t + nx * hw * s, y + dy * L * t + ny * hw * s, s < 0 ? pick(cols[0]) : pick(cols[1]), 1.9)
      }
    }
    for (const s of [-1, 1]) {
      let px = x
      let py = y
      for (let k = 1; k <= 14; k++) {
        const t = k / 14
        const hw = hwAt(t)
        const qx = x + dx * L * t + nx * hw * s
        const qy = y + dy * L * t + ny * hw * s
        line(px, py, qx, qy, '#3F5634', 1.05)
        px = qx
        py = qy
      }
    }
  }
  const flower = (cx: number, cy: number, r: number, rot: number) => {
    for (let k = 0; k < 5; k++) {
      const a = rot + (k * Math.PI * 2) / 5
      const N = Math.round(r * 1.6)
      for (let i = 0; i <= N; i++) {
        const s = (i / N - 0.5) * 1.05
        const ea = a + s * 0.9
        const len = r * (1 - Math.abs(s) * 0.55)
        line(cx + Math.cos(a) * r * 0.18, cy + Math.sin(a) * r * 0.18, cx + Math.cos(ea) * len, cy + Math.sin(ea) * len, i % 3 ? pick(T.petal) : pick(T.petal2), 1.5)
      }
    }
    for (let k = 0; k < 7; k++) {
      const a = rnd() * Math.PI * 2
      const d = rnd() * r * 0.22
      knot(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.9)
    }
  }
  const branch = (p: P[], flip: boolean, n: number, L0: number, W0: number) => {
    stem(p)
    for (let i = 0; i < n; i++) {
      const t = 0.06 + i * (0.86 / (n - 1))
      const [x, y] = bez(p, t)
      const [tx, ty] = tan(p, t)
      const side = i % 2 ? 1 : -1
      leaf(x, y, Math.atan2(ty, tx) + side * (0.62 + rnd() * 0.18), L0 - t * L0 * 0.4, W0 - t * W0 * 0.25, side > 0 ? [T.leafA, T.leafB] : [T.leafB, T.leafA])
    }
    const e = bez(p, 1)
    flower(e[0], e[1], 8, flip ? 0.3 : 0.9)
    for (let i = 0; i < 4; i++) {
      const t = 0.18 + i * 0.2
      const [x, y] = bez(p, t)
      const [tx, ty] = tan(p, t)
      const s = flip ? -1 : 1
      knot(x + ty * 11 * s, y - tx * 11 * s)
    }
  }
  branch([[150, 18], [118, 40], [64, 42], [16, 22]], false, 8, 20, 10)
  branch([[150, 18], [182, 40], [236, 42], [284, 22]], true, 8, 20, 10)
  flower(150, 20, 11, 0.6)
  flower(132, 26, 7, 1.2)
  flower(168, 26, 7, 0.1)
  return o.join('')
})

// ---- contour irregulier de la goutte de cire ----
const waxOutline = computed(() => {
  seed = 11
  const pts: P[] = []
  const p1 = rnd() * 6
  const p2 = rnd() * 6
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const r = 54 * (1 + 0.045 * Math.sin(5 * a + p1) + 0.03 * Math.sin(11 * a + p2) + (rnd() - 0.5) * 0.025)
    pts.push([Math.cos(a) * r, Math.sin(a) * r])
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`
  for (let i = 0; i < 72; i++) {
    const a = pts[(i + 71) % 72]
    const b = pts[i]
    const q = pts[(i + 1) % 72]
    const e = pts[(i + 2) % 72]
    d += ` C${(b[0] + (q[0] - a[0]) / 6).toFixed(2)},${(b[1] + (q[1] - a[1]) / 6).toFixed(2)} ${(q[0] - (e[0] - b[0]) / 6).toFixed(2)},${(q[1] - (e[1] - b[1]) / 6).toFixed(2)} ${q[0].toFixed(2)},${q[1].toFixed(2)}`
  }
  return d + 'Z'
})

// ---- grain du papier (une seule texture pour toute la page) ----
let grainCache = ''
function grainURL() {
  if (grainCache) return grainCache
  const cv = document.createElement('canvas')
  cv.width = cv.height = 220
  const x = cv.getContext('2d')
  if (!x) return ''
  const img = x.createImageData(220, 220)
  seed = 3
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + rnd() * 70
    img.data[i] = v
    img.data[i + 1] = v * 0.96
    img.data[i + 2] = v * 0.88
    img.data[i + 3] = rnd() < 0.5 ? 10 : 18
  }
  x.putImageData(img, 0, 0)
  x.globalAlpha = 0.07
  x.strokeStyle = '#7a6640'
  x.lineWidth = 0.6
  for (let i = 0; i < 60; i++) {
    const px = rnd() * 220
    const py = rnd() * 220
    const a = rnd() * Math.PI
    const l = 4 + rnd() * 14
    x.beginPath()
    x.moveTo(px, py)
    x.quadraticCurveTo(px + (Math.cos(a) * l) / 2 + rnd() * 3, py + (Math.sin(a) * l) / 2, px + Math.cos(a) * l, py + Math.sin(a) * l)
    x.stroke()
  }
  grainCache = cv.toDataURL('image/png')
  return grainCache
}
const grain = ref('')

// ---- lumiere : suit le doigt, sinon derive doucement ----
const root = ref<HTMLElement | null>(null)
const lightThread = ref<SVGElement | null>(null)
const lightWax = ref<SVGElement | null>(null)
const lightMark = ref<SVGElement | null>(null)
const sheen = ref<SVGElement | null>(null)
const light = { x: 0.35, y: 0.25 }
let lastKey = ''
let follow = false
let followTimer: ReturnType<typeof setTimeout> | undefined
let raf = 0
let t0 = 0
let frame = 0
let reduced = false

function applyLight() {
  const key = light.x.toFixed(3) + light.y.toFixed(3)
  if (key === lastKey || !root.value) return
  lastKey = key
  root.value.style.setProperty('--lx', `${(light.x * 100).toFixed(1)}%`)
  root.value.style.setProperty('--ly', `${(light.y * 100).toFixed(1)}%`)
  lightThread.value?.setAttribute('x', (light.x * 300).toFixed(0))
  lightThread.value?.setAttribute('y', ((light.y - 0.7) * 260).toFixed(0))
  for (const l of [lightWax.value, lightMark.value]) {
    l?.setAttribute('x', ((light.x - 0.5) * 240).toFixed(0))
    l?.setAttribute('y', ((light.y - 0.5) * 240).toFixed(0))
  }
  sheen.value?.setAttribute('cx', light.x.toFixed(3))
  sheen.value?.setAttribute('cy', light.y.toFixed(3))
}

function onPointer(e: PointerEvent | TouchEvent) {
  if (!root.value) return
  const p = 'touches' in e ? e.touches[0] : e
  if (!p) return
  const r = root.value.getBoundingClientRect()
  light.x = Math.min(1, Math.max(0, (p.clientX - r.left) / (r.width || 1)))
  light.y = Math.min(1, Math.max(0, (p.clientY - r.top) / (r.height || 1)))
  follow = true
  clearTimeout(followTimer)
  followTimer = setTimeout(() => {
    follow = false
    t0 = performance.now()
  }, 2500)
  applyLight()
}

function loop(now: number) {
  if (!follow) {
    const t = (now - t0) / 1000
    light.x = 0.5 + Math.sin(t * 0.6) * 0.38
    light.y = 0.3 + Math.sin(t * 0.45) * 0.22
  }
  if (++frame % 2 === 0) applyLight()
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  grain.value = grainURL()
  applyLight()
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('touchmove', onPointer, { passive: true })
  // derive automatique seulement en plein ecran : les apercus restent immobiles
  if (!props.compact && !reduced) {
    t0 = performance.now()
    raf = requestAnimationFrame(loop)
  }
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(followTimer)
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('touchmove', onPointer)
})

// ---- ouverture ----
// 1 sceau brise, 2 rabat leve, 3 rabat derriere la carte, 4 la carte sort, 5 la carte remplit, 6 l'enveloppe s'efface
const stage = ref(0)
const busy = ref(false)
const stageClass = computed(() => ({
  cracked: stage.value >= 1,
  flapopen: stage.value >= 2,
  flapback: stage.value >= 3,
  rising: stage.value >= 4,
  full: stage.value >= 5,
  gone: stage.value >= 6,
}))

async function play(instant = false) {
  if (busy.value) return
  busy.value = true
  const fast = instant || reduced
  const wait = (ms: number) => new Promise((r) => setTimeout(r, fast ? 0 : ms))
  stage.value = 1
  await wait(600)
  stage.value = 2
  await wait(500)
  stage.value = 3
  await wait(500)
  stage.value = 4
  await wait(1000)
  stage.value = 5
  await wait(900)
  emit('filled')
  await wait(250)
  stage.value = 6
  await wait(500)
  emit('done')
}

function onSeal() {
  if (busy.value) return
  emit('seal')
}

defineExpose({ play })
</script>

<template>
  <div
    ref="root"
    class="envelope absolute inset-0 z-20"
    :class="[stageClass, compact ? 'is-compact' : '']"
    :style="{
      '--paper': c.paper,
      '--liner': c.liner,
      '--liner-pattern': linerPattern,
      '--grain': grain ? `url(${grain})` : 'none',
      '--card-bg': theme.bg,
      color: c.ink,
    }"
  >
    <div class="env-back" />

    <div class="card" aria-hidden="true">
      <div class="card-inner">
        <slot />
      </div>
    </div>

    <div class="pocket">
      <svg class="pocket-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient :id="id('gl')" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#000" stop-opacity="0" />
            <stop offset=".8" :stop-opacity="c.shade * 0.5" stop-color="#000" />
            <stop offset="1" :stop-opacity="c.shade" stop-color="#000" />
          </linearGradient>
          <linearGradient :id="id('gr')" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stop-color="#000" :stop-opacity="c.shade * 0.15" />
            <stop offset=".8" :stop-opacity="c.shade * 0.6" stop-color="#000" />
            <stop offset="1" :stop-opacity="c.shade * 1.1" stop-color="#000" />
          </linearGradient>
          <linearGradient :id="id('gb')" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stop-color="#fff" stop-opacity=".12" />
            <stop offset=".85" stop-color="#000" stop-opacity="0" />
            <stop offset="1" stop-color="#000" :stop-opacity="c.shade * 0.8" />
          </linearGradient>
          <filter :id="id('fold')" x="-5%" y="-10%" width="110%" height="120%">
            <feDropShadow dx="0" dy="-.4" stdDeviation=".7" :flood-color="c.shadow" flood-opacity=".3" />
          </filter>
          <pattern :id="id('grain')" width="18" height="18" patternUnits="userSpaceOnUse">
            <image v-if="grain" :href="grain" width="18" height="18" preserveAspectRatio="none" />
          </pattern>
          <radialGradient :id="id('sheen')" ref="sheen" cx=".35" cy=".25" r=".6">
            <stop offset="0" stop-color="#fff" :stop-opacity="theme.dark ? 0.16 : 0.45" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
          </radialGradient>
        </defs>
        <polygon points="0,0 51,55 0,100" :fill="c.paper" />
        <polygon points="100,0 49,55 100,100" :fill="c.paper" />
        <polygon points="0,0 51,55 0,100" :fill="url('gl')" />
        <polygon points="100,0 49,55 100,100" :fill="url('gr')" />
        <polygon points="0,0 51,55 0,100" :fill="url('grain')" opacity=".55" />
        <polygon points="100,0 49,55 100,100" :fill="url('grain')" opacity=".55" />
        <g :filter="url('fold')">
          <path d="M0,100 L47,49 Q50,46.6 53,49 L100,100 Z" :fill="c.paper" />
          <path d="M0,100 L47,49 Q50,46.6 53,49 L100,100 Z" :fill="url('gb')" />
          <path d="M0,100 L47,49 Q50,46.6 53,49 L100,100 Z" :fill="url('grain')" opacity=".55" />
        </g>
        <rect x="0" y="0" width="100" height="100" :fill="url('sheen')" />
        <path d="M0,100 L47,49 Q50,46.6 53,49 L100,100" fill="none" :stroke="c.edge" stroke-opacity=".7" stroke-width=".4" vector-effect="non-scaling-stroke" />
      </svg>

      <!-- broderie : fil en relief, eclaire par le meme point lumineux que la cire -->
      <svg class="stitch" viewBox="0 0 300 56" aria-hidden="true">
        <defs>
          <filter :id="id('thread')" x="-5%" y="-15%" width="110%" height="130%" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation=".55" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="2.4" specularConstant=".95" specularExponent="20" lighting-color="#FFF6E2" result="spec">
              <fePointLight ref="lightThread" x="120" y="-60" z="140" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="shine" />
            <feComposite in="SourceGraphic" in2="shine" operator="arithmetic" k1="0" k2="1" k3=".6" k4="0" result="lit" />
            <feDropShadow in="lit" dx=".5" dy=".9" stdDeviation=".55" :flood-color="c.shadow" flood-opacity=".5" />
          </filter>
        </defs>
        <g :filter="url('thread')" v-html="embroidery" />
      </svg>
    </div>

    <div class="hinge">
      <div class="flap-side flap-out"><div class="flap-shape" /></div>
      <div class="flap-side flap-in"><div class="flap-shape" /></div>
    </div>

    <button type="button" class="seal focus-ring" :class="{ pulse: stage === 0 }" aria-label="Briser le sceau et ouvrir la carte" @click="onSeal">
      <svg viewBox="-60 -60 120 120" aria-hidden="true">
        <defs>
          <radialGradient :id="id('waxG')" cx="-.3" cy="-.35" r="1.25" fx=".32" fy=".28">
            <stop offset="0" :stop-color="c.waxHi" />
            <stop offset=".55" :stop-color="c.wax" />
            <stop offset="1" :stop-color="c.waxLo" />
          </radialGradient>
          <radialGradient :id="id('pressG')" cx=".62" cy=".66" r=".75">
            <stop offset="0" :stop-color="c.wax" />
            <stop offset=".8" :stop-color="c.waxLo" stop-opacity=".9" />
            <stop offset="1" :stop-color="c.waxLo" />
          </radialGradient>
          <filter :id="id('waxLight')" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="b" />
            <feSpecularLighting in="b" surfaceScale="5" specularConstant="1.05" specularExponent="26" lighting-color="#FFFFFF" result="s">
              <fePointLight ref="lightWax" x="-40" y="-70" z="120" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" result="s2" />
            <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0" />
          </filter>
          <filter :id="id('emboss')" x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation=".9" result="b" />
            <feSpecularLighting in="b" surfaceScale="2.6" specularConstant="1" specularExponent="18" :lighting-color="c.waxHi" result="s">
              <fePointLight ref="lightMark" x="-40" y="-70" z="90" />
            </feSpecularLighting>
            <feComposite in="s" in2="SourceAlpha" operator="in" result="s2" />
            <feOffset in="SourceAlpha" dx="1" dy="1.4" result="o" />
            <feFlood :flood-color="c.waxLo" flood-opacity=".9" />
            <feComposite in2="o" operator="in" result="sh" />
            <feMerge>
              <feMergeNode in="sh" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="s2" />
            </feMerge>
          </filter>
          <clipPath :id="id('cl')"><path d="M-70,-70 L5,-70 L-2,-30 L7,-8 L-3,14 L6,36 L-1,70 L-70,70Z" /></clipPath>
          <clipPath :id="id('cr')"><path d="M70,-70 L4,-70 L-3,-30 L6,-8 L-4,14 L5,36 L-2,70 L70,70Z" /></clipPath>
          <g :id="id('wax')">
            <path :d="waxOutline" :fill="url('waxG')" />
            <circle r="38" :fill="url('pressG')" />
            <circle r="38" fill="none" :stroke="c.waxLo" stroke-opacity=".55" stroke-width="2" />
            <circle r="33.5" fill="none" :stroke="c.waxHi" stroke-opacity=".55" stroke-width="1.1" stroke-dasharray="1.6 2.4" />
            <g :filter="url('emboss')" :fill="c.wax">
              <text y="10" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="600" :font-size="monogram.length > 1 ? 28 : 36" letter-spacing="1">{{ monogram }}</text>
              <path d="M-22,-21 q22,-9 44,0" fill="none" :stroke="c.wax" stroke-width="1.4" />
              <path d="M-22,22 q22,9 44,0" fill="none" :stroke="c.wax" stroke-width="1.4" />
            </g>
          </g>
        </defs>
        <g class="half left" :clip-path="url('cl')"><g :filter="url('waxLight')"><use :href="`#${id('wax')}`" /></g></g>
        <g class="half right" :clip-path="url('cr')"><g :filter="url('waxLight')"><use :href="`#${id('wax')}`" /></g></g>
      </svg>
    </button>

    <p class="hint font-serif-display">Touchez le sceau pour ouvrir</p>
  </div>
</template>

<style scoped>
.envelope {
  perspective: 1400px;
  perspective-origin: 50% 0%;
  overflow: hidden;
  background: var(--liner);
}
.envelope.gone {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.envelope > * {
  position: absolute;
  inset: 0;
}
.env-back {
  z-index: 1;
  background-color: var(--liner);
  background-image: var(--liner-pattern);
  background-size: 40px 40px;
  box-shadow: inset 0 30px 60px rgba(0, 0, 0, 0.45);
}

/* la carte rangee dans l'enveloppe : meme papier que la carte ouverte */
.card {
  z-index: 2;
  transform-origin: 50% 0;
  transform: translateY(var(--cy, 7%)) scale(var(--cs, 0.88));
  transition: transform 1.1s cubic-bezier(0.45, 0.05, 0.2, 1), border-radius 0.6s ease;
  background: var(--card-bg);
  box-shadow: 0 -2px 0 rgba(255, 255, 255, 0.5) inset, 0 10px 40px rgba(0, 0, 0, 0.35);
  border-radius: 6px;
  overflow: hidden;
}
.card-inner {
  height: 100%;
  transition: opacity 0.6s ease;
}

.pocket {
  z-index: 3;
  transition: transform 1s cubic-bezier(0.6, 0, 0.4, 1);
}
.pocket-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.stitch {
  position: absolute;
  left: 50%;
  top: calc(58% + min(34cqw, 170px) * 0.5);
  width: min(78%, 440px);
  transform: translateX(-50%);
  overflow: visible;
}

.hinge {
  z-index: 4;
  bottom: auto;
  height: 58%;
  transform-origin: 50% 0;
  transform: rotateX(var(--flap, 0deg));
  transition: transform 1s cubic-bezier(0.55, 0, 0.25, 1);
  transform-style: preserve-3d;
}
.flap-side {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.flap-out {
  filter: drop-shadow(0 6px 6px rgba(40, 30, 15, 0.3));
}
.flap-in {
  transform: rotateX(180deg);
}
.flap-shape {
  position: absolute;
  inset: 0;
  clip-path: polygon(0 0, 100% 0, 54% 95%, 50% 100%, 46% 95%);
}
.flap-out .flap-shape {
  background-color: var(--paper);
  background-image: radial-gradient(55% 60% at var(--lx, 35%) var(--ly, 25%), rgba(255, 255, 255, 0.4), transparent 70%),
    linear-gradient(to bottom, transparent 40%, rgba(60, 45, 20, 0.12)), var(--grain);
  background-size: 100% 100%, 100% 100%, 220px 220px;
}
.flap-in .flap-shape {
  background-color: var(--liner);
  background-image: var(--liner-pattern);
  background-size: 40px 40px;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.4);
}

.seal {
  z-index: 6;
  inset: auto;
  left: 50%;
  top: 58%;
  width: min(34cqw, 170px);
  aspect-ratio: 1;
  transform: translate(-50%, -58%);
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  filter: drop-shadow(0 4px 3px rgba(50, 25, 10, 0.35)) drop-shadow(0 12px 16px rgba(50, 25, 10, 0.2));
  -webkit-tap-highlight-color: transparent;
}
.seal svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.seal .half {
  transform-box: fill-box;
  transition: transform 0.9s cubic-bezier(0.3, 0.6, 0.4, 1), opacity 0.8s ease 0.25s;
}
.seal.pulse {
  animation: invite 2.6s ease-in-out infinite;
}
@keyframes invite {
  50% {
    scale: 1.04;
  }
}
.hint {
  z-index: 6;
  /* au dessus des boutons fixes de la page (telecharger, creer la mienne) */
  inset: auto 0 calc(88px + env(safe-area-inset-bottom, 0px)) 0;
  text-align: center;
  font-style: italic;
  font-size: 17px;
  opacity: 0.75;
  pointer-events: none;
  transition: opacity 0.4s;
}
.is-compact .hint {
  bottom: 20px;
  font-size: 15px;
}

/* etapes */
.cracked .seal {
  pointer-events: none;
  animation: none;
}
.cracked .seal .left {
  transform: translate(-35%, 60%) rotate(-30deg);
  opacity: 0;
}
.cracked .seal .right {
  transform: translate(38%, 75%) rotate(26deg);
  opacity: 0;
}
.cracked .hint {
  opacity: 0;
}
.flapopen {
  --flap: 180deg;
}
.flapback .hinge {
  z-index: 1;
}
.rising {
  --cy: -2%;
  --cs: 0.9;
}
.full {
  --cy: 0px;
  --cs: 1;
}
.full .card {
  border-radius: 0;
  box-shadow: none;
}
.full .card-inner {
  opacity: 0;
}
.full .pocket {
  transform: translateY(105%);
}
.full .env-back,
.full .hinge {
  opacity: 0;
  transition: opacity 0.6s ease 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .pocket,
  .hinge,
  .seal .half {
    transition-duration: 0.01s !important;
  }
  .seal.pulse {
    animation: none;
  }
}
</style>
