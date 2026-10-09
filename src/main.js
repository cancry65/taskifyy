// src/main.js
import { createApp } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.vue'
import './styles/theme.css'
import './styles/brutal.css'
import { vSound } from './directives/sound'

const app = createApp(App)

// Register directive v-sound secara global
app.directive('sound', vSound)

app.mount('#app')