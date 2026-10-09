<template>
  <div class="music-view">
    <div class="view-header">
      <h1 class="view-title"><i class="fa-solid fa-radio"></i> RETRO SOUNDSYSTEM</h1>
      <p class="view-subtitle">PUTAR LAGU FAVORITMU / INTEGRASI YOUTUBE MUSIC</p>
    </div>

    <div class="music-player-wrapper">
      <!-- MODEL 1: CASSETTE TAPE PLAYER (MONO) -->
      <div v-if="currentTheme === 'mono' || !['dark', 'cyber'].includes(currentTheme)" class="player-card model-cassette">
        <div class="player-header">
          <span class="badge">CASSETTE TAPE // STEREO</span>
          <span class="status-led" :class="{ active: isPlaying }"></span>
        </div>

        <div class="cassette-deck">
          <div class="spool" :class="{ spinning: isPlaying }"><i class="fa-solid fa-gear"></i></div>
          <div class="tape-window">
            <div class="track-title">{{ currentTrack.title }}</div>
            <div class="track-artist">{{ currentTrack.artist }}</div>
          </div>
          <div class="spool" :class="{ spinning: isPlaying }"><i class="fa-solid fa-gear"></i></div>
        </div>

        <div class="controls-row">
          <button class="btn-neo" @click="prevTrack" aria-label="Previous track"><i class="fa-solid fa-backward"></i></button>
          <button class="btn-neo btn-play" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
            <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" aria-hidden="true"></i>
          </button>
          <button class="btn-neo" @click="nextTrack" aria-label="Next track"><i class="fa-solid fa-forward"></i></button>
        </div>
      </div>

      <!-- MODEL 2: GRAMOPHONE (DARK) -->
      <div v-else-if="currentTheme === 'dark'" class="player-card model-gramophone">
        <div class="player-header">
          <span class="badge-dark">VINTAGE GRAMOPHONE 33 RPM</span>
        </div>

        <div class="gramophone-body">
          <div class="vinyl-disc" :class="{ spinning: isPlaying }">
            <div class="vinyl-grooves"></div>
            <div class="vinyl-label"><i class="fa-solid fa-music"></i></div>
          </div>
          <div class="tonearm" :class="{ playing: isPlaying }"></div>
        </div>

        <div class="track-info-dark">
          <div class="track-title">{{ currentTrack.title }}</div>
          <div class="track-artist">{{ currentTrack.artist }}</div>
        </div>

        <div class="controls-row">
          <button class="btn-dark" @click="prevTrack" aria-label="Previous track"><i class="fa-solid fa-backward"></i></button>
          <button class="btn-dark btn-play-dark" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
            <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" aria-hidden="true"></i>
          </button>
          <button class="btn-dark" @click="nextTrack" aria-label="Next track"><i class="fa-solid fa-forward"></i></button>
        </div>
      </div>

      <!-- MODEL 3: BOOMBOX (CYBER) -->
      <div v-else-if="currentTheme === 'cyber'" class="player-card model-boombox">
        <div class="graffiti-tag">CANCRY SOUNDSYSTEM</div>

        <div class="boombox-grid">
          <div class="speaker-cone" :class="{ pulsing: isPlaying }"></div>

          <div class="cyber-display">
            <div class="track-title-cyber">{{ currentTrack.title }}</div>
            <div class="track-artist-cyber">{{ currentTrack.artist }}</div>
            <div class="eq-bars">
              <span class="bar" :class="{ anim: isPlaying }"></span>
              <span class="bar" :class="{ anim: isPlaying }"></span>
              <span class="bar" :class="{ anim: isPlaying }"></span>
              <span class="bar" :class="{ anim: isPlaying }"></span>
              <span class="bar" :class="{ anim: isPlaying }"></span>
            </div>
          </div>

          <div class="speaker-cone" :class="{ pulsing: isPlaying }"></div>
        </div>

        <div class="controls-row">
          <button class="btn-cyber" @click="prevTrack" aria-label="Previous track"><i class="fa-solid fa-backward"></i></button>
          <button class="btn-cyber btn-play-cyber" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
            <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" aria-hidden="true"></i>
          </button>
          <button class="btn-cyber" @click="nextTrack" aria-label="Next track"><i class="fa-solid fa-forward"></i></button>
        </div>
      </div>

      <!-- Form Tambah Link + Slot Nama Lagu & Artis -->
      <div class="custom-track-form">
        <div class="form-title"><i class="fa-solid fa-plus"></i> TAMBAH LAGU CUSTOM</div>

        <div class="input-field">
          <label>URL YOUTUBE / YT MUSIC:</label>
          <input v-model="customUrl" type="text" placeholder="https://youtu.be/..." />
        </div>

        <div class="input-row">
          <div class="input-field">
            <label>JUDUL LAGU:</label>
            <input v-model="customTitle" type="text" placeholder="Contoh: Take A Chance" />
          </div>
          <div class="input-field">
            <label>NAMA ARTIS:</label>
            <input v-model="customArtist" type="text" placeholder="Contoh: NIKI" />
          </div>
        </div>

        <button class="btn-add-track" @click="handleLoadCustom"><i class="fa-solid fa-music"></i> LOAD LAGU</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const { currentTheme } = useTheme()
const {
  isPlaying,
  currentTrack,
  togglePlay,
  nextTrack,
  prevTrack,
  addCustomTrack
} = useAudioPlayer()

const customUrl = ref('')
const customTitle = ref('')
const customArtist = ref('')

const handleLoadCustom = () => {
  if (!customUrl.value) {
    alert('Masukkan URL YouTube terlebih dahulu!')
    return
  }

  const success = addCustomTrack(customUrl.value, customTitle.value, customArtist.value)
  if (success) {
    alert('Lagu berhasil ditambahkan! Tekan PLAY untuk memutar.')
    customUrl.value = ''
    customTitle.value = ''
    customArtist.value = ''
  } else {
    alert('Link YouTube tidak valid!')
  }
}
</script>

<style scoped>
.music-view {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Space Mono', monospace;
}

.view-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.view-title {
  font-weight: 900;
  font-size: 1.8rem;
  margin: 0;
}

.view-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.2rem;
}

.music-player-wrapper {
  max-width: 440px;
  margin: 0 auto;
}

/* MODEL 1: CASSETTE TAPE (MONO) */
.model-cassette {
  background: #ffffff;
  border: 4px solid #000000;
  box-shadow: 6px 6px 0px #000000;
  padding: 1.2rem;
  color: #000000;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.badge {
  font-weight: 800;
  font-size: 0.75rem;
  background: #000;
  color: #fff;
  padding: 0.2rem 0.5rem;
}

.status-led {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid #000;
}

.status-led.active {
  background: #ff0055;
}

.cassette-deck {
  background: #1a1a1a;
  border: 3px solid #000;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.spool {
  font-size: 1.6rem;
}

.spool.spinning {
  animation: spin 2s linear infinite;
}

.tape-window {
  text-align: center;
  color: #00ff66;
}

.track-title {
  font-weight: 700;
  font-size: 0.9rem;
}

.track-artist {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* MODEL 2: GRAMOPHONE (DARK) */
.model-gramophone {
  background: #121212;
  border: 4px solid #ffffff;
  box-shadow: 6px 6px 0px #ffffff;
  padding: 1.2rem;
  color: #ffffff;
}

.badge-dark {
  font-weight: 800;
  font-size: 0.75rem;
  border: 1px solid #fff;
  padding: 0.2rem 0.5rem;
}

.gramophone-body {
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
}

.vinyl-disc {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, #333 15%, #111 16%, #111 80%, #222 81%);
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vinyl-disc.spinning {
  animation: spin 3s linear infinite;
}

.vinyl-label {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #ff0055;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tonearm {
  position: absolute;
  top: 10px;
  right: 60px;
  width: 60px;
  height: 4px;
  background: #fff;
  transform-origin: right center;
  transform: rotate(-30deg);
  transition: transform 0.5s ease;
}

.tonearm.playing {
  transform: rotate(10deg);
}

.track-info-dark {
  text-align: center;
  margin-bottom: 1rem;
}

/* MODEL 3: BOOMBOX (CYBER) */
.model-boombox {
  background: #0d0221;
  border: 4px solid #00f3ff;
  box-shadow: 6px 6px 0px #ff0055;
  padding: 1.2rem;
  color: #00f3ff;
}

.graffiti-tag {
  font-family: 'Impact', sans-serif;
  font-size: 1.2rem;
  color: #ffe600;
  text-shadow: 2px 2px #ff0055;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 0.8rem;
  transform: rotate(-2deg);
}

.boombox-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.speaker-cone {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff0055 30%, #00f3ff 31%, #0d0221 70%);
  border: 3px solid #ffe600;
}

.speaker-cone.pulsing {
  animation: pulse 0.4s ease-in-out infinite alternate;
}

.cyber-display {
  flex: 1;
  text-align: center;
  background: #000;
  border: 2px solid #00f3ff;
  padding: 0.4rem;
}

.track-title-cyber {
  color: #ffe600;
  font-size: 0.8rem;
  font-weight: bold;
}

.track-artist-cyber {
  color: #ff0055;
  font-size: 0.7rem;
}

.eq-bars {
  display: flex;
  justify-content: center;
  gap: 3px;
  height: 15px;
  margin-top: 0.3rem;
}

.bar {
  width: 4px;
  background: #00f3ff;
  height: 20%;
}

.bar.anim {
  animation: eq 0.5s ease-in-out infinite alternate;
}

.bar:nth-child(2).anim { animation-delay: 0.1s; }
.bar:nth-child(3).anim { animation-delay: 0.2s; }
.bar:nth-child(4).anim { animation-delay: 0.3s; }

/* CONTROLS */
.controls-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn-neo, .btn-dark, .btn-cyber {
  flex: 1;
  padding: 0.6rem;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  border: 3px solid #000;
  box-shadow: 3px 3px 0px #000;
}

.btn-neo { background: #fff; color: #000; }
.btn-play { background: #ff0055; color: #fff; flex: 2; }

.btn-dark { background: #121212; color: #fff; border-color: #fff; box-shadow: 3px 3px 0px #fff; }
.btn-play-dark { background: #fff; color: #000; flex: 2; }

.btn-cyber { background: #00f3ff; color: #000; border-color: #ffe600; box-shadow: 3px 3px 0px #ff0055; }
.btn-play-cyber { background: #ff0055; color: #fff; flex: 2; }

/* FORM CUSTOM TRACK */
.custom-track-form {
  margin-top: 1.5rem;
  background: var(--bg-card, #ffffff);
  border: 3px solid var(--border-color, #000000);
  box-shadow: 4px 4px 0px var(--shadow-color, #000000);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-title {
  font-weight: 800;
  font-size: 0.8rem;
  border-bottom: 2px dashed var(--border-color, #000);
  padding-bottom: 0.4rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.input-field label {
  font-size: 0.65rem;
  font-weight: 800;
}

.input-field input {
  padding: 0.5rem;
  border: 2px solid var(--border-color, #000);
  font-family: inherit;
  font-size: 0.75rem;
  background: #fff;
  color: #000;
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.btn-add-track {
  background: var(--accent-primary, #ff0055);
  color: var(--accent-text, #ffffff);
  border: 3px solid var(--border-color, #000000);
  box-shadow: 3px 3px 0px var(--shadow-color, #000000);
  font-weight: 800;
  font-size: 0.8rem;
  padding: 0.6rem;
  cursor: pointer;
  margin-top: 0.2rem;
  font-family: inherit;
}

.btn-add-track:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px var(--shadow-color, #000000);
}

@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes pulse { 100% { transform: scale(1.08); } }
@keyframes eq { 0% { height: 20%; } 100% { height: 100%; } }
</style>