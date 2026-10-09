// src/directives/sound.js
import { useSFX } from '../composables/useSFX'

const { playClick, playHover } = useSFX()

export const vSound = {
  mounted(el) {
    el.addEventListener('click', () => playClick())
    el.addEventListener('mouseenter', () => playHover())
  }
}