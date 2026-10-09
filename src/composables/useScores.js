import { ref } from 'vue'

const highScore = ref(0) // Flappy
const tetrisHighScore = ref(0)

export function useScores() {
  return { highScore, tetrisHighScore }
}
