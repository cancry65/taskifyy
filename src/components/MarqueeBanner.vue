<template>
  <div class="marquee-wrapper">
    <div class="marquee-track">
      <span>⚡ BRUTAL.SYS // THEME: {{ currentTheme.toUpperCase() }} // CALENDAR MODULE ADDED // FLAPPY BIRD & TETRIS ARCADE // </span>
      <span>⚡ BRUTAL.SYS // THEME: {{ currentTheme.toUpperCase() }} // CALENDAR MODULE ADDED // FLAPPY BIRD & TETRIS ARCADE // </span>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
const { currentTheme } = useTheme()
</script>

<style scoped>
.marquee-wrapper {
  position: relative;
  z-index: 20;
  background: var(--accent-primary);
  color: var(--accent-text);
  overflow: hidden;
  white-space: nowrap;
  padding: 0.5rem 0;
  border-bottom: 3px solid var(--border-color);
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 0.85rem;
}

.marquee-track {
  display: inline-block;
  animation: marquee 20s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
</style>
