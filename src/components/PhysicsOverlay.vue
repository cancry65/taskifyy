<template>
  <canvas
    ref="physicsCanvas"
    class="physics-overlay"
    @mousedown="handlePointerDown"
    @mousemove="handlePointerMove"
    @mouseup="handlePointerUp"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handlePointerUp"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  gravityEnabled: { type: Boolean, default: true }
})

const { currentTheme } = useTheme()

const physicsCanvas = ref(null)
let pCtx = null
let pAnimId = null
let stickers = []
let draggedSticker = null
const dragOffset = { x: 0, y: 0 }

const STICKER_TYPES = [
  { icon: '🎮', label: 'STICK', radius: 28 },
  { icon: '💽', label: 'DISC', radius: 26 },
  { icon: '💿', label: 'VINYL', radius: 26 },
  { icon: '⚡', label: 'AURA', radius: 24 },
  { icon: '🕹️', label: 'ARCADE', radius: 28 },
  { icon: '📅', label: 'CAL', radius: 24 },
  { icon: '✦', label: 'STAR', radius: 22 }
]

const resizePhysicsCanvas = () => {
  if (!physicsCanvas.value) return
  physicsCanvas.value.width = window.innerWidth
  physicsCanvas.value.height = window.innerHeight
}

const createRandomSticker = (customX, customY) => {
  const t = STICKER_TYPES[Math.floor(Math.random() * STICKER_TYPES.length)]
  const w = window.innerWidth || 800
  stickers.push({
    icon: t.icon,
    label: t.label,
    radius: t.radius,
    x: customX !== undefined ? customX : Math.random() * (w - 100) + 50,
    y: customY !== undefined ? customY : -Math.random() * 300 - 50,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 2 + 1,
    angle: (Math.random() - 0.5) * 0.5,
    vAngle: (Math.random() - 0.5) * 0.05,
    bounceFactor: 0.65 + Math.random() * 0.15
  })
}

// Exposed so parent can trigger it (LandingView -> App -> here)
const spawnStickerBurst = () => {
  for (let i = 0; i < 8; i++) {
    createRandomSticker(window.innerWidth / 2 + (Math.random() - 0.5) * 200, 100)
  }
}
defineExpose({ spawnStickerBurst })

const physicsLoop = () => {
  if (!pCtx || !physicsCanvas.value) return
  const w = physicsCanvas.value.width
  const h = physicsCanvas.value.height

  pCtx.clearRect(0, 0, w, h)
  const g = props.gravityEnabled ? 0.35 : 0.05

  stickers.forEach((s) => {
    if (s !== draggedSticker) {
      s.vy += g
      s.x += s.vx
      s.y += s.vy
      s.angle += s.vAngle

      s.vx *= 0.99
      s.vy *= 0.99

      if (s.x - s.radius < 0) {
        s.x = s.radius
        s.vx *= -s.bounceFactor
      } else if (s.x + s.radius > w) {
        s.x = w - s.radius
        s.vx *= -s.bounceFactor
      }

      if (s.y + s.radius > h) {
        s.y = h - s.radius
        s.vy *= -s.bounceFactor
        s.vx *= 0.85
        s.vAngle *= 0.8
        if (Math.abs(s.vy) < 0.5) s.vy = 0
      }

      if (s.y - s.radius < 0) {
        s.y = s.radius
        s.vy *= -s.bounceFactor
      }
    }

    pCtx.save()
    pCtx.translate(s.x, s.y)
    pCtx.rotate(s.angle)

    let stickerBg = '#ffffff'
    let stickerBorder = '#000000'
    let shadowColor = '#000000'

    if (currentTheme.value === 'cyber') {
      stickerBg = '#ff0055'
      stickerBorder = '#00f3ff'
      shadowColor = '#ffe600'
    } else if (currentTheme.value === 'dark') {
      stickerBg = '#222222'
      stickerBorder = '#ffffff'
      shadowColor = '#000000'
    }

    pCtx.fillStyle = shadowColor
    pCtx.beginPath()
    pCtx.arc(4, 4, s.radius, 0, Math.PI * 2)
    pCtx.fill()

    pCtx.fillStyle = stickerBg
    pCtx.strokeStyle = stickerBorder
    pCtx.lineWidth = 3
    pCtx.beginPath()
    pCtx.arc(0, 0, s.radius, 0, Math.PI * 2)
    pCtx.fill()
    pCtx.stroke()

    pCtx.fillStyle = stickerBorder
    pCtx.font = `${s.radius * 1.1}px sans-serif`
    pCtx.textAlign = 'center'
    pCtx.textBaseline = 'middle'
    pCtx.fillText(s.icon, 0, 1)

    pCtx.restore()
  })

  pAnimId = requestAnimationFrame(physicsLoop)
}

const handlePointerDown = (e) => {
  const rect = physicsCanvas.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i]
    if (Math.hypot(s.x - mx, s.y - my) <= s.radius + 10) {
      draggedSticker = s
      dragOffset.x = mx - s.x
      dragOffset.y = my - s.y
      s.vx = 0
      s.vy = 0
      break
    }
  }
}

const handlePointerMove = (e) => {
  if (!draggedSticker) return
  const rect = physicsCanvas.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  draggedSticker.vx = (mx - dragOffset.x - draggedSticker.x) * 0.3
  draggedSticker.vy = (my - dragOffset.y - draggedSticker.y) * 0.3
  draggedSticker.x = mx - dragOffset.x
  draggedSticker.y = my - dragOffset.y
}

const handlePointerUp = () => {
  draggedSticker = null
}

const handleTouchStart = (e) => {
  if (e.touches.length > 0) handlePointerDown(e.touches[0])
}

const handleTouchMove = (e) => {
  if (e.touches.length > 0) handlePointerMove(e.touches[0])
}

onMounted(() => {
  if (!physicsCanvas.value) return
  pCtx = physicsCanvas.value.getContext('2d')
  resizePhysicsCanvas()
  window.addEventListener('resize', resizePhysicsCanvas)

  stickers = []
  for (let i = 0; i < 12; i++) createRandomSticker()

  physicsLoop()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizePhysicsCanvas)
  if (pAnimId) cancelAnimationFrame(pAnimId)
})
</script>

<style scoped>
.physics-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  pointer-events: auto;
}
</style>
