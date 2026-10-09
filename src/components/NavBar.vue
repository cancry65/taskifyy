<template>
  <header class="navbar">
    <div class="brand">
      <span class="logo-box">CY</span>
      <span class="brand-name">CAN/CRY-65</span>
    </div>

    <nav class="nav-links">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['nav-btn', { arcade: tab.arcade, active: activeTab === tab.id }]"
        @click="emit('update:activeTab', tab.id)"
      >
        {{ tab.label }}
      </button>

      <button
        :class="['nav-btn gravity-btn', { active: gravityEnabled }]"
        @click="emit('toggle-gravity')"
      >
        GRAVITY: {{ gravityEnabled ? 'ON 🌌' : 'OFF ⏸️' }}
      </button>

      <!-- Theme switcher -->
      <div class="theme-switcher">
        <button
          v-for="t in themes"
          :key="t.id"
          :class="['theme-btn', t.id, { active: currentTheme === t.id }]"
          :title="t.title"
          @click="setTheme(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <button class="nav-btn tv-reboot-btn" @click="emit('reboot')">
        TV INTRO 📺
      </button>
    </nav>
  </header>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'

defineProps({
  activeTab: { type: String, required: true },
  gravityEnabled: { type: Boolean, default: true }
})
const emit = defineEmits(['update:activeTab', 'toggle-gravity', 'reboot'])

const { currentTheme, setTheme } = useTheme()

const tabs = [
  { id: 'landing', label: 'LANDING' },
  { id: 'profile', label: 'PROFILE 👤' },
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'calendar', label: 'CALENDAR 📅' },
  { id: 'music', label: 'MUSIC 🎵' },
  { id: 'ai', label: 'AI CHAT 🤖' },
  { id: 'game', label: 'FLAPPY 🎮', arcade: true },
  { id: 'tetris', label: 'TETRIS 🧩', arcade: true }
]

const themes = [
  { id: 'mono', label: 'MONO', title: 'Monochrome Theme' },
  { id: 'dark', label: 'DARK', title: 'Dark Mode Theme' },
  { id: 'cyber', label: 'CYBER ⚡', title: 'Neon Cyberpunk Theme' }
]
</script>

<style scoped>
.navbar {
  position: relative;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 4px solid var(--border-color);
  background: var(--bg-main);
  flex-wrap: wrap;
  gap: 1rem;
}

.brand { display: flex; align-items: center; gap: 0.75rem; }

.logo-box {
  background: var(--accent-primary);
  color: var(--accent-text);
  font-weight: 800;
  padding: 0.3rem 0.6rem;
  font-size: 1.2rem;
  box-shadow: 3px 3px 0px var(--shadow-color);
}

.brand-name { font-size: 1.5rem; font-weight: 800; }

.nav-links { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }

.nav-btn {
  background: var(--bg-card);
  color: var(--text-main);
  border: 3px solid var(--border-color);
  padding: 0.5rem 1rem;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--shadow-color);
}

.nav-btn.active, .nav-btn:hover { background: var(--accent-primary); color: var(--accent-text); }
.nav-btn.arcade { border-style: dashed; }
.nav-btn.gravity-btn { background: var(--accent-primary); color: var(--accent-text); }
.nav-btn.tv-reboot-btn { background: var(--bg-card-alt); }

.theme-switcher {
  display: flex;
  border: 3px solid var(--border-color);
  box-shadow: 3px 3px 0px var(--shadow-color);
}

.theme-btn {
  border: none;
  border-right: 2px solid var(--border-color);
  padding: 0.5rem 0.7rem;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  background: var(--bg-card);
  color: var(--text-main);
}

.theme-btn:last-child { border-right: none; }
.theme-btn.active { background: var(--accent-primary); color: var(--accent-text); }
</style>