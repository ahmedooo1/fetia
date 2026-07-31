<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  shape: 'square' | 'circle'
}

const colors = ['#FF6B8B', '#FFC857', '#8B5CF6', '#FFF8F0', '#8FCBEB']

function burst() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  const particles: Particle[] = Array.from({ length: 90 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.5 ? 'square' : 'circle',
  }))

  const gravity = 0.45
  let frame = 0
  const maxFrames = 110

  cancelAnimationFrame(raf)
  function tick() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    frame++
    for (const p of particles) {
      p.vy += gravity
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotationSpeed
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames)
      if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }
    if (frame < maxFrames) {
      raf = requestAnimationFrame(tick)
    }
  }
  tick()
}

onBeforeUnmount(() => cancelAnimationFrame(raf))

defineExpose({ burst })
</script>

<template>
  <canvas ref="canvasRef" class="pointer-events-none absolute inset-0 h-full w-full" />
</template>
