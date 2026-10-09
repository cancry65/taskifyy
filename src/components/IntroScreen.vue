<template>
  <div class="crt-intro-overlay">
    <div class="crt-scanlines"></div>
    <div class="crt-vignette"></div>

    <!-- Floating sea bubbles -->
    <canvas ref="bubbleCanvas" class="bubble-canvas"></canvas>

    <!-- TV screen + TV Frame Control Panel -->
    <div class="tv-outer-cabinet">
      <!-- Muka Layar TV -->
      <div class="tv-container">
        <div class="tv-screen">
          <div class="tv-badge">CHANNEL 00 // {{ currentTheme.toUpperCase() }} OS</div>
          <h1 class="tv-title">SIGNAL DETECTED</h1>
          <p class="tv-subtitle">
            SYSTEM BOOTING... HIGH CONTRAST VIBES // RETRO CRT MODE
          </p>

          <div class="boot-bar-wrapper">
            <div class="boot-bar-fill" :style="{ width: bootProgress + '%' }"></div>
          </div>

          <div class="boot-status">
            <span>STATUS: {{ bootProgress < 100 ? 'LOADING BUBBLE PHYSICS...' : 'SYSTEM READY' }}</span>
            <span>{{ bootProgress }}%</span>
          </div>

          <button
            class="tv-power-btn"
            :disabled="bootProgress < 100"
            @click="handlePowerOn"
          >
            {{ bootProgress < 100 ? 'TUNING SIGNAL...' : 'POWER ON / ENTER SYSTEM 📺' }}
          </button>
        </div>
      </div>

      <!-- Panel Samping TV Retro: Kenop Putaran Channel (Theme Tuner) -->
      <div class="tv-side-panel">
        <div class="panel-label">COLOR TUNER</div>
        
        <!-- Kenop Analog Berputar -->
        <div 
          class="channel-knob-wrapper" 
          @click="handleKnobClick"
          title="Klik untuk putar channel / ganti tema!"
        >
          <div class="knob-outer">
            <div 
              class="knob-inner" 
              :style="{ transform: `rotate(${knobRotation}deg)` }"
            >
              <div class="knob-indicator"></div>
            </div>
          </div>
          <div class="knob-label">{{ currentTheme.toUpperCase() }}</div>
        </div>

        <div class="speaker-grill">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useSFX } from '../composables/useSFX'


const emit = defineEmits(['power-on'])
const { currentTheme, cycleTheme } = useTheme()
const { playTVStatic, playSodaFuzz, playClick } = useSFX()

const bootProgress = ref(0)
const bubbleCanvas = ref(null)
const knobRotation = ref(0)

let bubbleCtx = null
let bubbleAnimId = null
let bootTimer = null
let seaBubbles = []

// Handler saat kenop TV diklik -> Memutar kenop & memicu ganti tema
const handleKnobClick = () => {
  knobRotation.value += 120 // Putar kenop 120 derajat setiap klik
  if (playClick) playClick()
  cycleTheme()
}

const handlePowerOn = () => {
  playSodaFuzz(1.2) // Bunyi gelembung soda saat masuk ke sistem
  emit('power-on')
}

const createSeaBubble = () => {
  const w = window.innerWidth || 800
  const h = window.innerHeight || 600
  return {
    x: Math.random() * w,
    y: h + Math.random() * 200,
    radius: Math.random() * 12 + 4,
    speed: Math.random() * 2 + 1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.05 + 0.02,
    strokeWidth: Math.random() > 0.5 ? 2 : 3,
    isColored: Math.random() > 0.6
  }
}

const resizeBubbleCanvas = () => {
  if (!bubbleCanvas.value) return
  bubbleCanvas.value.width = window.innerWidth
  bubbleCanvas.value.height = window.innerHeight
}

const bubbleLoop = () => {
  if (!bubbleCtx || !bubbleCanvas.value) return
  const w = bubbleCanvas.value.width
  const h = bubbleCanvas.value.height

  bubbleCtx.clearRect(0, 0, w, h)

  seaBubbles.forEach((b) => {
    b.y -= b.speed
    b.wobble += b.wobbleSpeed
    b.x += Math.sin(b.wobble) * 0.8

    if (b.y < -20) {
      b.y = h + 20
      b.x = Math.random() * w
    }

    bubbleCtx.save()
    bubbleCtx.beginPath()
    bubbleCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)

    if (currentTheme.value === 'cyber') {
      bubbleCtx.fillStyle = b.isColored ? 'rgba(0, 243, 255, 0.7)' : 'rgba(255, 0, 85, 0.7)'
      bubbleCtx.strokeStyle = '#ffe600'
    } else if (currentTheme.value === 'dark') {
      bubbleCtx.fillStyle = b.isColored ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 100, 100, 0.5)'
      bubbleCtx.strokeStyle = '#ffffff'
    } else {
      bubbleCtx.fillStyle = b.isColored ? '#000000' : 'rgba(255, 255, 255, 0.85)'
      bubbleCtx.strokeStyle = '#000000'
    }

    bubbleCtx.fill()
    bubbleCtx.lineWidth = b.strokeWidth
    bubbleCtx.stroke()
    bubbleCtx.restore()
  })

  bubbleAnimId = requestAnimationFrame(bubbleLoop)
}

onMounted(() => {
  setTimeout(() => {
    playTVStatic(1.5)
  }, 100)

  if (!bubbleCanvas.value) return
  bubbleCtx = bubbleCanvas.value.getContext('2d')
  resizeBubbleCanvas()
  window.addEventListener('resize', resizeBubbleCanvas)

  seaBubbles = Array.from({ length: 45 }, createSeaBubble)

  bootTimer = setInterval(() => {
    if (bootProgress.value < 100) {
      bootProgress.value += 4
    } else {
      clearInterval(bootTimer)
    }
  }, 60)

  bubbleLoop()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeBubbleCanvas)
  if (bubbleAnimId) cancelAnimationFrame(bubbleAnimId)
  if (bootTimer) clearInterval(bootTimer)
})
</script>

<style scoped>
.crt-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: hidden;
}

.bubble-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 105;
  pointer-events: none;
}

.crt-scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%);
  background-size: 100% 4px;
  z-index: 110;
  pointer-events: none;
}

.crt-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.95) 100%);
  z-index: 111;
  pointer-events: none;
}

/* Pembungkus Luar TV Retro (Layar + Side Panel Control) */
.tv-outer-cabinet {
  position: relative;
  z-index: 120;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 780px;
  border: 8px solid var(--border-color);
  box-shadow: 12px 12px 0px var(--shadow-color);
  background: var(--bg-card);
}

.tv-container {
  flex: 1;
  padding: 2.5rem 2rem;
  text-align: center;
  border-right: 6px solid var(--border-color);
}

.tv-screen { position: relative; color: var(--text-main); }

.tv-badge {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--accent-text);
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  margin-bottom: 1.5rem;
}

.tv-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.tv-subtitle {
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.boot-bar-wrapper {
  width: 100%;
  height: 16px;
  border: 3px solid var(--border-color);
  padding: 2px;
  margin-bottom: 0.5rem;
}

.boot-bar-fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.1s linear;
}

.boot-status {
  display: flex;
  justify-content: space-between;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  margin-bottom: 2rem;
}

.tv-power-btn {
  width: 100%;
  background: var(--accent-primary);
  color: var(--accent-text);
  border: 4px solid var(--border-color);
  padding: 0.9rem 1.8rem;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--shadow-color);
  transition: all 0.1s ease;
}

.tv-power-btn:hover:not(:disabled) {
  background: var(--bg-main);
  color: var(--text-main);
}

.tv-power-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Side Panel Kontrol Kenop TV Vintage */
.tv-side-panel {
  width: 130px;
  background: var(--bg-main);
  padding: 1.5rem 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.panel-label {
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: var(--text-main);
  text-align: center;
}

/* Desain & Animasi Putaran Kenop Microwave/TV */
.channel-knob-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.knob-outer {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 4px solid var(--border-color);
  background: var(--bg-card);
  box-shadow: 4px 4px 0px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;
}

.knob-outer:hover {
  transform: scale(1.08);
}

.knob-outer:active {
  transform: scale(0.95);
}

.knob-inner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent-primary);
  border: 3px solid var(--border-color);
  position: relative;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.knob-indicator {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 14px;
  background: var(--accent-text, #ffffff);
  border: 1px solid var(--border-color);
  border-radius: 2px;
}

.knob-label {
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  font-size: 0.75rem;
  background: var(--accent-primary);
  color: var(--accent-text);
  padding: 0.2rem 0.4rem;
  border: 2px solid var(--border-color);
  box-shadow: 2px 2px 0px var(--shadow-color);
}

/* Ornamen Speaker Grill TV */
.speaker-grill {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 80%;
}

.speaker-grill span {
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
}

/* Penyesuaian Layar Kecil / Mobile */
@media (max-width: 650px) {
  .tv-outer-cabinet {
    flex-direction: column;
  }
  .tv-container {
    border-right: none;
    border-bottom: 6px solid var(--border-color);
  }
  .tv-side-panel {
    width: 100%;
    flex-direction: row;
    padding: 1rem;
  }
  .speaker-grill {
    display: none;
  }
}
</style>