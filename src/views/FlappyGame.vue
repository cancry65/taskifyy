<template>
  <section class="game-view">
    <div class="dash-card game-card">
      <div class="card-header">
        <h2>GZ FLAPPY BIRD // {{ currentTheme.toUpperCase() }}</h2>
        <div class="game-scores">
          <span class="tag">SCORE: {{ currentScore }}</span>
          <span class="tag highlight">HIGH: {{ highScore }}</span>
        </div>
      </div>

      <div class="canvas-wrapper">
        <canvas ref="gameCanvas" width="400" height="480" @click="jumpBird"></canvas>

        <div v-if="gameState !== 'PLAYING'" class="game-overlay">
          <h2 v-if="gameState === 'START'">PRESS JUMP TO PLAY</h2>
          <div v-else class="game-over-box">
            <h2>GAME OVER 💀</h2>
            <p>SCORE: {{ currentScore }}</p>
          </div>
          <button class="btn-brutal primary" @click.stop="startGame">
            {{ gameState === 'START' ? 'START GAME [SPACE]' : 'TRY AGAIN 🔄' }}
          </button>
        </div>
      </div>

      <div class="game-controls">
        <button class="btn-brutal primary btn-jump" @click="jumpBird">
          JUMP! [SPACE BAR] 🪽
        </button>
        <p class="controls-hint">Klik layar kanvas / Tekan [SPACE] untuk terbang.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useScores } from '../composables/useScores'

const { currentTheme } = useTheme()
const { highScore } = useScores()

const gameCanvas = ref(null)
const gameState = ref('START') // 'START' | 'PLAYING' | 'GAMEOVER'
const currentScore = ref(0)

let ctx = null
let animationFrameId = null
const bird = { x: 50, y: 200, size: 18, velocity: 0, gravity: 0.45, jump: -7.5 }
let pipes = []
let frameCount = 0
const pipeGap = 120
const pipeWidth = 50

const resetGameVars = () => {
  bird.y = 200
  bird.velocity = 0
  pipes = []
  frameCount = 0
  currentScore.value = 0
}

const renderCanvas = () => {
  if (!ctx || !gameCanvas.value) return

  let bg = '#ffffff'
  let pipeColor = '#000000'
  let birdBg = '#000000'
  let birdEye = '#ffffff'

  if (currentTheme.value === 'cyber') {
    bg = '#0d0221'
    pipeColor = '#00f3ff'
    birdBg = '#ff0055'
    birdEye = '#ffe600'
  } else if (currentTheme.value === 'dark') {
    bg = '#121212'
    pipeColor = '#ffffff'
    birdBg = '#e0e0e0'
    birdEye = '#121212'
  }

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)

  pipes.forEach(p => {
    ctx.fillStyle = pipeColor
    ctx.fillRect(p.x, 0, pipeWidth, p.top)
    ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, gameCanvas.value.height - (p.top + pipeGap))
  })

  ctx.fillStyle = birdBg
  ctx.fillRect(bird.x - bird.size, bird.y - bird.size, bird.size * 2, bird.size * 2)
  ctx.fillStyle = birdEye
  ctx.fillRect(bird.x + 2, bird.y - 10, 6, 6)
}

const endGame = () => {
  gameState.value = 'GAMEOVER'
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  renderCanvas()
}

const gameLoop = () => {
  if (gameState.value !== 'PLAYING') return
  bird.velocity += bird.gravity
  bird.y += bird.velocity
  frameCount++

  if (frameCount % 90 === 0) {
    const minH = 40
    const maxH = gameCanvas.value.height - pipeGap - minH
    const topH = Math.floor(Math.random() * (maxH - minH + 1)) + minH
    pipes.push({ x: gameCanvas.value.width, top: topH, passed: false })
  }

  pipes.forEach(p => {
    p.x -= 2.5
    if (!p.passed && p.x < bird.x) {
      p.passed = true
      currentScore.value++
      if (currentScore.value > highScore.value) highScore.value = currentScore.value
    }
  })

  pipes = pipes.filter(p => p.x + pipeWidth > 0)

  if (bird.y + bird.size > gameCanvas.value.height || bird.y - bird.size < 0) return endGame()

  for (const p of pipes) {
    if (
      bird.x + bird.size > p.x && bird.x - bird.size < p.x + pipeWidth &&
      (bird.y - bird.size < p.top || bird.y + bird.size > p.top + pipeGap)
    ) return endGame()
  }

  renderCanvas()
  animationFrameId = requestAnimationFrame(gameLoop)
}

const startGame = () => {
  resetGameVars()
  gameState.value = 'PLAYING'
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  gameLoop()
}

const jumpBird = () => {
  if (gameState.value === 'PLAYING') bird.velocity = bird.jump
  else startGame() // START or GAMEOVER
}

const handleKeyDown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault()
    jumpBird()
  }
}

// Repaint when the theme changes (matters when idle / game over)
watch(currentTheme, () => renderCanvas())

onMounted(() => {
  ctx = gameCanvas.value.getContext('2d')
  resetGameVars()
  renderCanvas()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.game-controls { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }
.btn-jump { width: 100%; }
</style>
