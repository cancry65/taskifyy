<template>
  <div class="auth-wrapper">
    <div class="auth-card brutal-card">
      <div class="auth-header">
        <h2 class="title">{{ isLogin ? '👾 LOGIN' : '🚀 SIGN UP' }}</h2>
        <p class="subtitle">
          {{ isLogin ? 'Selamat datang kembali, Gen-Z!' : 'Buat akun barumu sekarang!' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Input Username/Email -->
        <div class="form-group">
          <label>EMAIL / USERNAME</label>
          <input 
            v-model="email" 
            type="text" 
            placeholder="user@genz.com" 
            class="brutal-input" 
            required 
          />
        </div>

        <!-- Input Password -->
        <div class="form-group">
          <label>PASSWORD</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            class="brutal-input" 
            required 
          />
        </div>

        <!-- Confirm Password (Hanya muncul saat Sign Up) -->
        <div v-if="!isLogin" class="form-group">
          <label>CONFIRM PASSWORD</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            class="brutal-input" 
            required 
          />
        </div>

        <!-- Tombol Submit Utama -->
        <button type="submit" class="btn-brutal btn-primary">
          {{ isLogin ? 'MASUK AKUN' : 'DAFTAR AKUN' }}
        </button>
      </form>

      <!-- Toggle Login / Sign Up -->
      <div class="auth-footer">
        <p>
          {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }}
          <button class="btn-link" @click="toggleMode">
            {{ isLogin ? 'Daftar di sini' : 'Login di sini' }}
          </button>
        </p>
        
        <div class="divider"><span>ATAU</span></div>

        <!-- Mode Guest / Lewati -->
        <button class="btn-brutal btn-guest" @click="handleGuest">
          👤 Masuk Sebagai Guest
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['authenticated'])

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleSubmit = () => {
  if (!isLogin.value && password.value !== confirmPassword.value) {
    alert('Password dan Confirm Password tidak cocok!')
    return
  }

  // MOCKUP: Sementara langsung loloskan tanpa validasi database dulu
  const mockUser = {
    email: email.value,
    username: email.value.split('@')[0],
    isGuest: false
  }

  // Kirim event sukses ke App.vue
  emit('authenticated', mockUser)
}

const handleGuest = () => {
  const guestUser = {
    email: 'guest@app.com',
    username: 'Guest_User',
    isGuest: true
  }
  emit('authenticated', guestUser)
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.brutal-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card, #ffffff);
  border: 4px solid var(--border-color, #000);
  box-shadow: 8px 8px 0px var(--shadow-color, #000);
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.title {
  font-family: 'Space Mono', monospace;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
}

.subtitle {
  font-size: 0.85rem;
  margin-top: 0.25rem;
  opacity: 0.8;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.form-group label {
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  font-size: 0.75rem;
}

.brutal-input {
  width: 100%;
  padding: 0.75rem;
  border: 3px solid var(--border-color, #000);
  background: var(--bg-input, #fff);
  font-family: inherit;
  font-size: 0.9rem;
  box-shadow: 3px 3px 0px var(--shadow-color, #000);
  outline: none;
}

.brutal-input:focus {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0px var(--shadow-color, #000);
}

.btn-brutal {
  width: 100%;
  padding: 0.85rem;
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  border: 3px solid var(--border-color, #000);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn-primary {
  background: var(--accent-primary, #ff0055);
  color: #fff;
  box-shadow: 5px 5px 0px var(--shadow-color, #000);
}

.btn-guest {
  background: #e0e0e0;
  color: #000;
  box-shadow: 4px 4px 0px var(--shadow-color, #000);
}

.btn-brutal:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0px var(--shadow-color, #000);
}

.btn-brutal:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--shadow-color, #000);
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent-primary, #ff0055);
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.25rem 0;
  color: #888;
  font-size: 0.75rem;
  font-weight: bold;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 2px dashed #888;
}

.divider span {
  padding: 0 0.5rem;
}
</style>