<template>
  <section class="landing-view">
    <div class="hero-card">
      <div class="badge">EST. 2026 // THEME: {{ currentTheme.toUpperCase() }}</div>
      <h1 class="hero-title">MAIN CHARACTER<br />ENERGY ONLY.</h1>
      <p class="hero-subtitle">
        Estetika Neo-Brutalism dengan 3 pilihan tema dinamis, fitur Kalender Interaktif & Agenda, efek gravitasi stiker, serta arcade retro Flappy Bird & Tetris.
      </p>
      <div class="hero-actions">
        <button class="btn-brutal primary" @click="emit('navigate', 'profile')">
          VIEW PORTFOLIO 👤
        </button>
        <button class="btn-brutal secondary" @click="emit('navigate', 'dashboard')">
          ENTER DASHBOARD ➔
        </button>
        <button class="btn-brutal secondary" @click="emit('navigate', 'calendar')">
          VIEW CALENDAR 📅
        </button>
        <button class="btn-brutal secondary" @click="emit('burst')">
          BOUNCE STICKERS 🎲
        </button>
        <button class="btn-brutal secondary" @click="emit('navigate', 'game')">
          PLAY FLAPPY 🎮
        </button>
      </div>
    </div>

    <!-- Google Search Engine Box -->
    <div class="search-box">
      <div class="search-header">
        <span>BRUTAL GOOGLE SEARCH ENGINE 🔍</span>
        <span class="dot">●</span>
      </div>
      <form class="search-form" @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Cari sesuatu di Google..."
        />
        <button type="submit" class="btn-brutal primary search-btn">
          SEARCH 🌐
        </button>
      </form>
    </div>

    <!-- Slang / Vibe generator -->
    <div class="vibe-box">
      <div class="vibe-header">
        <span>TODAY'S SLANG & VIBE CHECK</span>
        <span class="dot">●</span>
      </div>
      <div class="vibe-content">
        <h3 class="vibe-text">"{{ currentVibe }}"</h3>
        <button class="btn-copy" @click="copyVibe">
          {{ copied ? 'COPIED! ⚡' : 'COPY VIBE 📋' }}
        </button>
      </div>
    </div>

    <!-- Feature grid -->
    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-num">01</div>
        <h3>DYNAMIC THEMES</h3>
        <p>Dukung tema Mono, Dark Mode, dan Neon Cyberpunk. Seluruh elemen UI dan warna game akan menyesuaikan otomatis.</p>
      </div>
      <div class="feature-card highlighted">
        <div class="feature-num">02</div>
        <h3>BRUTAL CALENDAR</h3>
        <p>Kelola jadwal, event penting, dan catatan harian secara interaktif pada tampilan kalender retro.</p>
      </div>
      <div class="feature-card">
        <div class="feature-num">03</div>
        <h3>GRAVITY STICKERS</h3>
        <p>Stiker konsol, vinyl, dan petir dapat membal, ditarik kursor, serta terpengaruh gravitasi.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

// navigate -> tab id ('profile' | 'dashboard' | 'calendar' | 'game' | ...), burst -> spawn stickers
const emit = defineEmits(['navigate', 'burst'])
const { currentTheme } = useTheme()

// Search Query State & Function
const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`
  window.open(googleUrl, '_blank')
}

const vibes = [
  'It\'s giving main character behavior, no cap.',
  'Aura +10,000 pts today. Keep cooking.',
  'Let him cook! Cyberpunk neon mindset.',
  'Low key grinding, high key glowing up.',
  'Valid vibe detected. Proceeding with maximum focus.'
]
const currentVibe = ref(vibes[0])
const copied = ref(false)

const copyVibe = () => {
  navigator.clipboard.writeText(currentVibe.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.hero-card {
  border: 4px solid var(--border-color);
  padding: 3rem 2rem;
  box-shadow: 8px 8px 0px var(--shadow-color);
  margin-bottom: 2rem;
  background: var(--bg-card);
}

.badge {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--accent-text);
  padding: 0.25rem 0.75rem;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.hero-title { font-size: 3.5rem; line-height: 1; font-weight: 800; margin-bottom: 1rem; }
.hero-subtitle { font-size: 1.2rem; max-width: 600px; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

/* Styling Search Engine Box */
.search-box {
  border: 4px solid var(--border-color);
  box-shadow: 6px 6px 0px var(--shadow-color);
  margin-bottom: 2rem;
  background: var(--bg-card);
}

.search-header {
  background: var(--accent-primary);
  color: var(--accent-text);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
}

.search-form {
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  background: var(--bg-main);
  color: var(--text-main);
  border: 3px solid var(--border-color);
  padding: 0.75rem 1rem;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 1rem;
  outline: none;
  box-shadow: 3px 3px 0px var(--shadow-color);
}

.search-input::placeholder {
  color: var(--text-main);
  opacity: 0.6;
}

.search-btn {
  white-space: nowrap;
}

/* Styling Tombol Brutal */
.btn-brutal {
  border: 3px solid var(--border-color);
  padding: 0.75rem 1.25rem;
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--shadow-color);
  font-size: 0.95rem;
  transition: transform 0.1s;
}

.btn-brutal:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--shadow-color);
}

.btn-brutal.primary {
  background: var(--accent-primary);
  color: var(--accent-text);
}

.btn-brutal.secondary {
  background: var(--bg-card);
  color: var(--text-main);
}

.vibe-box { border: 4px solid var(--border-color); box-shadow: 6px 6px 0px var(--shadow-color); margin-bottom: 2rem; background: var(--bg-card); }
.vibe-header { background: var(--accent-primary); color: var(--accent-text); padding: 0.5rem 1rem; display: flex; justify-content: space-between; font-family: 'Space Mono', monospace; font-size: 0.85rem; }
.vibe-content { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.vibe-text { font-size: 1.4rem; font-weight: 800; }

.btn-copy { background: var(--bg-card); color: var(--text-main); border: 3px solid var(--border-color); padding: 0.5rem 1rem; font-weight: 700; cursor: pointer; box-shadow: 3px 3px 0px var(--shadow-color); }

.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.feature-card { border: 4px solid var(--border-color); padding: 1.5rem; box-shadow: 6px 6px 0px var(--shadow-color); background: var(--bg-card); }
.feature-card.highlighted { background: var(--accent-primary); color: var(--accent-text); }
.feature-num { font-family: 'Space Mono', monospace; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
</style>