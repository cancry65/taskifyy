import { ref } from 'vue'

const isMuted = ref(false)

// Kunci utama: gunakan 1 AudioContext tunggal untuk seluruh aplikasi
let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) {
      audioCtx = new AudioCtx()
    }
  }
  // Paksa browser membangunkan AudioContext jika statusnya suspended
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function useSFX() {
  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }

  // 1. KLIK RETRO
  const playClick = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05)

    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  // 2. HOVER BLIP
  const playHover = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)

    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.001,now + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.03)
  }

  // 3. POP / BOUNCE
  const playPop = () => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.08)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.08)
  }

  // 4. TV SEMUT / CRT STATIC
  const playTVStatic = (duration = 1.2) => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Pop/Puck CRT
    const popOsc = ctx.createOscillator()
    const popGain = ctx.createGain()
    popOsc.type = 'sawtooth'
    popOsc.frequency.setValueAtTime(120, now)
    popOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1)
    popGain.gain.setValueAtTime(0.2, now)
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    popOsc.connect(popGain)
    popGain.connect(ctx.destination)
    popOsc.start(now)
    popOsc.stop(now + 0.1)

    // White Noise
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2500, now)
    filter.Q.setValueAtTime(1.5, now)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.1, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  }

  // 5. FUZZY SODA
  const playSodaFuzz = (duration = 1.5) => {
    if (isMuted.value) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(4000, now)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.05, now)
    gain.gain.linearRampToValueAtTime(0.1, now + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    whiteNoise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    whiteNoise.start(now)
    whiteNoise.stop(now + duration)

    // Micro bubbles
    for (let i = 0; i < 15; i++) {
      const bubbleTime = now + (Math.random() * (duration * 0.8))
      const popOsc = ctx.createOscillator()
      const popGain = ctx.createGain()

      popOsc.type = 'sine'
      const freq = 1200 + Math.random() * 1500
      popOsc.frequency.setValueAtTime(freq, bubbleTime)
      popOsc.frequency.exponentialRampToValueAtTime(freq + 400, bubbleTime + 0.02)

      popGain.gain.setValueAtTime(0.03, bubbleTime)
      popGain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.02)

      popOsc.connect(popGain)
      popGain.connect(ctx.destination)

      popOsc.start(bubbleTime)
      popOsc.stop(bubbleTime + 0.02)
    }
  }

  return {
    isMuted,
    toggleMute,
    playClick,
    playHover,
    playPop,
    playTVStatic,
    playSodaFuzz
  }
}