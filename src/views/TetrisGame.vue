<template>
  <section class="game-view">
    <div class="dash-card game-card">
      <div class="card-header">
        <h2>GZ TETRIS // {{ currentTheme.toUpperCase() }}</h2>
        <div class="game-scores">
          <span class="tag">SCORE: {{ tetrisScore }}</span>
          <span class="tag highlight">HIGH: {{ tetrisHighScore }}</span>
        </div>
      </div>

      <div class="canvas-wrapper">
        <canvas ref="tetrisCanvas" width="200" height="400"></canvas>

        <div v-if="tetrisState !== 'PLAYING'" class="game-overlay">
          <h2 v-if="tetrisState === 'START'">READY TO STACK?</h2>
          <div v-else class="game-over-box">
            <h2>GAME OVER 💀</h2>
            <p>SCORE: {{ tetrisScore }}</p>
          </div>
          <button class="btn-brutal primary" @click.stop="startTetris">
            {{ tetrisState === 'START' ? 'START TETRIS ▶' : 'TRY AGAIN 🔄' }}
          </button>
        </div>
      </div>

      <div class="tetris-controls">
        <div class="control-row">
          <button class="btn-brutal secondary btn-ctrl" @click="rotatePiece">↻ ROTATE [↑]</button>
        </div>
        <div class="control-row">
          <button class="btn-brutal secondary btn-ctrl" @click="moveLeft">◄ LEFT [←]</button>
          <button class="btn-brutal primary btn-ctrl" @click="dropPiece">DOWN [↓]</button>
          <button class="btn-brutal secondary btn-ctrl" @click="moveRight">RIGHT [→] ►</button>
        </div>
        <p class="controls-hint">Gunakan tombol di atas atau Arrow Keys keyboard!</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useScores } from '../composables/useScores'

const { currentTheme } = useTheme()
const { tetrisHighScore } = useScores()

const tetrisCanvas = ref(null)
const tetrisState = ref('START') // 'START' | 'PLAYING' | 'GAMEOVER'
const tetrisScore = ref(0)

let tCtx = null
let tetrisInterval = null
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 20
let board = []
let currentPiece = null

const getTetrominoes = () => {
  if (currentTheme.value === 'cyber') {
    return [
      { shape: [[1, 1, 1, 1]], color: '#00f3ff' },
      { shape: [[1, 1], [1, 1]], color: '#ffe600' },
      { shape: [[0, 1, 0], [1, 1, 1]], color: '#ff0055' },
      { shape: [[1, 0, 0], [1, 1, 1]], color: '#00ff66' },
      { shape: [[0, 0, 1], [1, 1, 1]], color: '#b000ff' },
      { shape: [[0, 1, 1], [1, 1, 0]], color: '#ff7700' },
      { shape: [[1, 1, 0], [0, 1, 1]], color: '#00e5ff' }
    ]
  } else if (currentTheme.value === 'dark') {
    return [
      { shape: [[1, 1, 1, 1]], color: '#ffffff' },
      { shape: [[1, 1], [1, 1]], color: '#dddddd' },
      { shape: [[0, 1, 0], [1, 1, 1]], color: '#bbbbbb' },
      { shape: [[1, 0, 0], [1, 1, 1]], color: '#999999' },
      { shape: [[0, 0, 1], [1, 1, 1]], color: '#777777' },
      { shape: [[0, 1, 1], [1, 1, 0]], color: '#555555' },
      { shape: [[1, 1, 0], [0, 1, 1]], color: '#aaaaaa' }
    ]
  }
  return [
    { shape: [[1, 1, 1, 1]], color: '#000000' },
    { shape: [[1, 1], [1, 1]], color: '#222222' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#444444' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#666666' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#111111' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#333333' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#555555' }
  ]
}

const resetBoard = () => {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  tetrisScore.value = 0
}

const collide = (b, piece, offsetX = 0, offsetY = 0) => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const newX = piece.x + c + offsetX
        const newY = piece.y + r + offsetY
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true
        if (newY >= 0 && b[newY][newX]) return true
      }
    }
  }
  return false
}

const renderTetris = () => {
  if (!tCtx || !tetrisCanvas.value) return

  let canvasBg = '#ffffff'
  let gridColor = '#f0f0f0'
  let blockBorder = '#000000'

  if (currentTheme.value === 'cyber') {
    canvasBg = '#0d0221'
    gridColor = '#1f0840'
    blockBorder = '#ffe600'
  } else if (currentTheme.value === 'dark') {
    canvasBg = '#121212'
    gridColor = '#252525'
    blockBorder = '#ffffff'
  }

  tCtx.fillStyle = canvasBg
  tCtx.fillRect(0, 0, tetrisCanvas.value.width, tetrisCanvas.value.height)

  tCtx.strokeStyle = gridColor
  tCtx.lineWidth = 1
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      tCtx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        tCtx.fillStyle = board[r][c]
        tCtx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        tCtx.strokeStyle = blockBorder
        tCtx.lineWidth = 2
        tCtx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
      }
    }
  }

  if (currentPiece && tetrisState.value === 'PLAYING') {
    tCtx.fillStyle = currentPiece.color
    currentPiece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const px = (currentPiece.x + c) * BLOCK_SIZE
          const py = (currentPiece.y + r) * BLOCK_SIZE
          tCtx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE)
          tCtx.strokeStyle = blockBorder
          tCtx.lineWidth = 2
          tCtx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE)
        }
      })
    })
  }
}

const spawnPiece = () => {
  const list = getTetrominoes()
  const t = list[Math.floor(Math.random() * list.length)]
  currentPiece = {
    shape: t.shape,
    color: t.color,
    x: Math.floor((COLS - t.shape[0].length) / 2),
    y: 0
  }

  if (collide(board, currentPiece, 0, 0)) {
    tetrisState.value = 'GAMEOVER'
    clearInterval(tetrisInterval)
  }
}

const mergePiece = () => {
  currentPiece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        const boardY = currentPiece.y + r
        const boardX = currentPiece.x + c
        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
          board[boardY][boardX] = currentPiece.color
        }
      }
    })
  })
}

const clearFullLines = () => {
  let linesCleared = 0
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) {
      board.splice(r, 1)
      board.unshift(Array(COLS).fill(0))
      linesCleared++
      r++
    }
  }
  if (linesCleared > 0) {
    const pointsMap = [0, 100, 300, 500, 800]
    tetrisScore.value += pointsMap[linesCleared] || linesCleared * 200
    if (tetrisScore.value > tetrisHighScore.value) {
      tetrisHighScore.value = tetrisScore.value
    }
  }
}

const dropPiece = () => {
  if (tetrisState.value !== 'PLAYING' || !currentPiece) return
  if (!collide(board, currentPiece, 0, 1)) {
    currentPiece.y++
  } else {
    mergePiece()
    clearFullLines()
    spawnPiece()
  }
  renderTetris()
}

const moveLeft = () => {
  if (tetrisState.value !== 'PLAYING' || !currentPiece) return
  if (!collide(board, currentPiece, -1, 0)) {
    currentPiece.x--
    renderTetris()
  }
}

const moveRight = () => {
  if (tetrisState.value !== 'PLAYING' || !currentPiece) return
  if (!collide(board, currentPiece, 1, 0)) {
    currentPiece.x++
    renderTetris()
  }
}

const rotatePiece = () => {
  if (tetrisState.value !== 'PLAYING' || !currentPiece) return
  const rotated = currentPiece.shape[0].map((_, i) =>
    currentPiece.shape.map(row => row[i]).reverse()
  )

  const originalShape = currentPiece.shape
  currentPiece.shape = rotated

  if (collide(board, currentPiece, 0, 0)) {
    if (!collide(board, currentPiece, -1, 0)) {
      currentPiece.x--
    } else if (!collide(board, currentPiece, 1, 0)) {
      currentPiece.x++
    } else {
      currentPiece.shape = originalShape
    }
  }
  renderTetris()
}

const startTetris = () => {
  resetBoard()
  tetrisState.value = 'PLAYING'
  spawnPiece()
  if (tetrisInterval) clearInterval(tetrisInterval)
  tetrisInterval = setInterval(dropPiece, 500)
  renderTetris()
}

const handleKeyDown = (e) => {
  if (tetrisState.value !== 'PLAYING') return
  if (e.code === 'ArrowLeft') { e.preventDefault(); moveLeft() }
  if (e.code === 'ArrowRight') { e.preventDefault(); moveRight() }
  if (e.code === 'ArrowDown') { e.preventDefault(); dropPiece() }
  if (e.code === 'ArrowUp') { e.preventDefault(); rotatePiece() }
}

// Repaint when the theme changes
watch(currentTheme, () => renderTetris())

onMounted(() => {
  tCtx = tetrisCanvas.value.getContext('2d')
  resetBoard()
  renderTetris()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (tetrisInterval) clearInterval(tetrisInterval)
})
</script>

<style scoped>
.tetris-controls { display: flex; flex-direction: column; gap: 0.6rem; align-items: center; }
.control-row { display: flex; gap: 0.5rem; justify-content: center; width: 100%; }
.btn-ctrl { padding: 0.6rem 0.8rem; font-size: 0.85rem; flex: 1; }
</style>
