import { ref } from 'vue'

const themes = ['mono', 'dark', 'cyber']

// Module-level state => shared by every component that calls useTheme()
const currentTheme = ref('mono') // 'mono' | 'dark' | 'cyber'

export function useTheme() {
  const setTheme = (theme) => {
    currentTheme.value = theme
  }

  // Fungsi pergantian tema berurutan (dipakai oleh kenop TV)
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    currentTheme.value = themes[nextIndex]
  }

  return { 
    currentTheme, 
    setTheme, 
    cycleTheme 
  }
}