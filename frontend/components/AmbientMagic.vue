<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    density?: number
    burst?: boolean
    color?: string
  }>(),
  {
    density: 22,
    burst: false,
    color: '#FFC857',
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ro: ResizeObserver | null = null

interface Mote {
  x: number
  y: number
  r: number
  speed: number
  phase: number
  twinkleSpeed: number
}

let motes: Mote[] = []

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}

function spawn(canvas: HTMLCanvasElement) {
  motes = Array.from({ length: props.density }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.6,
    speed: Math.random() * 0.35 + 0.1,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.03 + 0.015,
  }))
}

function tick() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const m of motes) {
    m.y -= m.speed
    m.phase += m.twinkleSpeed
    if (m.y < -10) {
      m.y = canvas.height + 10
      m.x = Math.random() * canvas.width
    }
    const twinkle = (Math.sin(m.phase) + 1) / 2
    const alpha = 0.15 + twinkle * 0.55

    const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4)
    gradient.addColorStop(0, `${props.color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`)
    gradient.addColorStop(1, `${props.color}00`)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = `${props.color}`
    ctx.globalAlpha = Math.min(1, alpha + 0.2)
    ctx.beginPath()
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  resize()
  spawn(canvas)
  tick()
  ro = new ResizeObserver(() => {
    resize()
    spawn(canvas)
  })
  ro.observe(canvas)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>

<template>
  <canvas ref="canvasRef" class="pointer-events-none absolute inset-0 h-full w-full" />
</template>
