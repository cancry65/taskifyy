<template>
  <div 
    :class="['app-root', `theme-${currentTheme}`]"
    @click="handleGlobalClick"
    @mouseover="handleGlobalHover"
  >
    <!-- Mute / Unmute Floating Toggle Button -->
    <button 
      class="btn-sfx-toggle" 
      @click.stop="toggleMute"
      :title="isMuted ? 'Unmute SFX' : 'Mute SFX'"
    >
      {{ isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON' }}
    </button>

    <!-- 1. INTRO CRT SCREEN -->
    <transition name="fade">
      <IntroScreen v-if="showIntro" @power-on="handlePowerOn" />
    </transition>

    <!-- 2. LOGIN / SIGN IN SCREEN -->
    <transition name="fade">
      <AuthScreen 
        v-if="!showIntro && !isAuthenticated" 
        @authenticated="handleAuthenticated" 
      />
    </transition>

    <!-- 3. MAIN APPLICATION (Setalah Login/Pass Intro) -->
    <div v-if="!showIntro && isAuthenticated" class="genz-app">
      <PhysicsOverlay ref="overlay" :gravity-enabled="gravityEnabled" />
      <MarqueeBanner />

      <NavBar
        v-model:active-tab="activeTab"
        :gravity-enabled="gravityEnabled"
        :user="currentUser"
        @toggle-gravity="gravityEnabled = !gravityEnabled"
        @reboot="handleReboot"
        @logout="handleLogout"
      />

      <main class="main-content">
        <LandingView
          v-if="activeTab === 'landing'"
          @navigate="activeTab = $event"
          @burst="handleBurst"
        />
        <ProfileView v-else-if="activeTab === 'profile'" :user="currentUser" />
        <DashboardView v-else-if="activeTab === 'dashboard'" />
        <CalendarView v-else-if="activeTab === 'calendar'" />
        <MusicView v-else-if="activeTab === 'music'" />
        <AIChatView v-else-if="activeTab === 'ai'" />
        <FlappyGame v-else-if="activeTab === 'game'" />
        <TetrisGame v-else-if="activeTab === 'tetris'" />
      </main>

      <!-- HIDDEN GLOBAL YOUTUBE PLAYER -->
      <iframe
        class="global-hidden-iframe"
        :src="embedUrl"
        title="Global YouTube Music Player"
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from './composables/useTheme'
import { useSFX } from './composables/useSFX'
import { useAudioPlayer } from './composables/useAudioPlayer'

import IntroScreen from './components/IntroScreen.vue'
import AuthScreen from './components/AuthScreen.vue'
import PhysicsOverlay from './components/PhysicsOverlay.vue'
import MarqueeBanner from './components/MarqueeBanner.vue'
import NavBar from './components/NavBar.vue'

import LandingView from './views/LandingView.vue'
import ProfileView from './views/ProfileView.vue'
import DashboardView from './views/DashboardView.vue'
import CalendarView from './views/CalendarView.vue'
import MusicView from './views/MusicView.vue'
import AIChatView from './views/AIChatView.vue'
import FlappyGame from './views/FlappyGame.vue'
import TetrisGame from './views/TetrisGame.vue'

const { currentTheme } = useTheme()
const { isMuted, toggleMute, playClick, playHover, playPop } = useSFX()
const { embedUrl } = useAudioPlayer()

// State Navigasi Utama
const showIntro = ref(true)
const isAuthenticated = ref(false)
const currentUser = ref(null)

const activeTab = ref('profile')
const gravityEnabled = ref(true)
const overlay = ref(null)

// Handlers Alur
const handlePowerOn = () => {
  showIntro.value = false
}

const handleAuthenticated = (user) => {
  currentUser.value = user
  isAuthenticated.value = true
}

const handleLogout = () => {
  currentUser.value = null
  isAuthenticated.value = false
}

const handleReboot = () => {
  showIntro.value = true
  isAuthenticated.value = false
}

// SFX Click & Hover
const handleGlobalClick = (event) => {
  const target = event.target.closest('button, a, .btn-brutal, .btn-copy, .theme-btn, .nav-btn, .tv-power-btn')
  if (target) {
    playClick()
  }
}

const handleGlobalHover = (event) => {
  const target = event.target.closest('button, a, .btn-brutal, .btn-copy, .theme-btn, .nav-btn')
  if (target && !target.dataset.hovered) {
    target.dataset.hovered = 'true'
    playHover()
    
    target.addEventListener('mouseleave', () => {
      delete target.dataset.hovered
    }, { once: true })
  }
}

const handleBurst = () => {
  playPop()
  overlay.value?.spawnStickerBurst()
}
</script>

<style scoped>
.genz-app {
  position: relative;
  z-index: 10;
  padding-bottom: 3rem;
}

.main-content {
  position: relative;
  z-index: 20;
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.global-hidden-iframe {
  position: absolute;
  width: 0;
  height: 0;
  border: 0;
  visibility: hidden;
  pointer-events: none;
}

.btn-sfx-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  background: var(--accent-primary, #ff0055);
  color: var(--accent-text, #ffffff);
  border: 3px solid var(--border-color, #000000);
  box-shadow: 4px 4px 0px var(--shadow-color, #000000);
  padding: 0.4rem 0.8rem;
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn-sfx-toggle:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--shadow-color, #000000);
}

.btn-sfx-toggle:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--shadow-color, #000000);
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>