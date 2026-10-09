<template>
  <div :class="['ai-chat-view', `model-${currentTheme}`]">
    <!-- HEADER VIEW -->
    <div class="view-header">
      <h1 class="view-title">
        <span v-if="currentTheme === 'mono'">📜 AI PAPER NOTEBOOK</span>
        <span v-else-if="currentTheme === 'dark'">🖥️ MS-DOS TERMINAL AI</span>
        <span v-else-if="currentTheme === 'cyber'">📱 CYBER-PHONE ASSISTANT</span>
      </h1>
      <p class="view-subtitle">
        INTEGRASI INTELEJEN BUATAN // TEMA: {{ currentTheme.toUpperCase() }}
      </p>
    </div>

    <!-- CHAT CONTAINER -->
    <div class="chat-wrapper">
      <!-- MODEL 1: KERTAS NOTA / MESIN TIK (MONO) -->
      <div v-if="currentTheme === 'mono'" class="paper-container">
        <div class="paper-header">
          <span>MEMO ID: #AI-9021</span>
          <span>DATE: {{ currentDate }}</span>
        </div>
        
        <div ref="chatBox" class="paper-messages">
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['paper-msg', msg.sender]"
          >
            <strong>{{ msg.sender === 'user' ? 'YOU >' : 'NOTE >' }}</strong>
            <p>{{ msg.text }}</p>
          </div>
          <div v-if="isLoading" class="paper-msg ai typing">Sedang mengetik memo...</div>
        </div>

        <form @submit.prevent="sendMessage" class="paper-input-row">
          <input 
            v-model="inputMessage" 
            type="text" 
            placeholder="Tulis pesan untuk mesin tik..." 
            :disabled="isLoading"
          />
          <button type="submit" :disabled="isLoading">KETIK ⌨️</button>
        </form>
      </div>

      <!-- MODEL 2: KOMPUTER JADUL CRT (DARK) -->
      <div v-else-if="currentTheme === 'dark'" class="terminal-container">
        <div class="terminal-bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="term-title">C:\SYSTEM32\AI_CORE.EXE</span>
        </div>

        <div ref="chatBox" class="terminal-screen">
          <div class="term-banner">
            [GROQ / LLAMA 3.3 AI INITIALIZED]<br />
            TYPE YOUR COMMAND OR QUERY BELOW...
          </div>
          
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['term-msg', msg.sender]"
          >
            <span class="prompt">{{ msg.sender === 'user' ? 'C:\USER>' : 'C:\AI>' }}</span>
            <span class="text">{{ msg.text }}</span>
          </div>
          <div v-if="isLoading" class="term-msg ai prompt-typing">
            <span class="prompt">C:\AI></span> PROCESSING DATA...
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="terminal-input-row">
          <span class="prompt-symbol">></span>
          <input 
            v-model="inputMessage" 
            type="text" 
            placeholder="Ketik perintah DOS..." 
            :disabled="isLoading"
          />
          <button type="submit" :disabled="isLoading">RUN ↵</button>
        </form>
      </div>

      <!-- MODEL 3: SMARTPHONE CYBERPUNK (CYBER) -->
      <div v-else-if="currentTheme === 'cyber'" class="cyber-phone">
        <div class="phone-notch">
          <span class="camera"></span>
          <span class="speaker"></span>
        </div>

        <div class="phone-screen">
          <div class="phone-status-bar">
            <span>5G CYBER</span>
            <span>100% ⚡</span>
          </div>

          <div ref="chatBox" class="cyber-chat-body">
            <div 
              v-for="(msg, index) in messages" 
              :key="index" 
              :class="['cyber-bubble', msg.sender]"
            >
              <div class="sender-tag">{{ msg.sender === 'user' ? 'YOU' : 'NEO-AI' }}</div>
              <p>{{ msg.text }}</p>
            </div>
            <div v-if="isLoading" class="cyber-bubble ai loading">
              <span>⚡ CONNECTING NEURAL NETWORK...</span>
            </div>
          </div>

          <form @submit.prevent="sendMessage" class="cyber-input-area">
            <input 
              v-model="inputMessage" 
              type="text" 
              placeholder="Send message to Cyber AI..." 
              :disabled="isLoading"
            />
            <button type="submit" :disabled="isLoading">SEND 🚀</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { currentTheme } = useTheme()

const inputMessage = ref('')
const isLoading = ref(false)
const chatBox = ref(null)

const messages = ref([
  {
    sender: 'ai',
    text: 'Halo! Aku AI berbasis Groq Llama 3.3. Ada yang bisa dibantu hari ini?'
  }
])

const currentDate = computed(() => new Date().toLocaleDateString('id-ID'))

const scrollToBottom = async () => {
  await nextTick()
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userText = inputMessage.value
  messages.value.push({ sender: 'user', text: userText })
  inputMessage.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    let replyText = ''

    if (isLocalhost) {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY

      if (!apiKey) {
        throw new Error('API Key belum diisi!')
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b', // <--- DIBERSIHKAN: 3_3 menggantikan 3.3
          messages: [
            { role: 'system', content: 'Kamu adalah asisten AI retro-futuristik yang ramah di portal CANCRY.' },
            { role: 'user', content: userText }
          ]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Gagal memproses respon dari Groq API.')
      }

      replyText = data.choices?.[0]?.message?.content || 'Tidak ada balasan.'
    } else {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses ke server backend.')
      }

      replyText = data.reply
    }

    messages.value.push({ sender: 'ai', text: replyText })
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({ 
      sender: 'ai', 
      text: `[ERROR]: ${error.message || 'Gagal terhubung ke AI.'}` 
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
.ai-chat-view {
  max-width: 650px;
  margin: 0 auto;
  font-family: 'Space Mono', monospace;
}

.view-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
}

.view-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.2rem;
}

/* ===================================================
   MODEL 1: KERTAS NOTA (MONO)
   =================================================== */
.paper-container {
  background: #fff8e7;
  border: 4px solid #000;
  box-shadow: 8px 8px 0px #000;
  padding: 1.5rem;
  color: #000;
}

.paper-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px dashed #000;
  padding-bottom: 0.5rem;
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.paper-messages {
  height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 0.5rem;
}

.paper-msg {
  background: #ffffff;
  border: 2px solid #000;
  padding: 0.8rem;
  box-shadow: 3px 3px 0px #000;
}

.paper-msg.user {
  align-self: flex-end;
  background: #e6f0ff;
}

.paper-msg p {
  margin: 0.3rem 0 0 0;
  font-size: 0.85rem;
  white-space: pre-wrap;
}

.paper-input-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.paper-input-row input {
  flex: 1;
  padding: 0.7rem;
  border: 3px solid #000;
  background: #fff;
  font-family: inherit;
  font-weight: bold;
}

.paper-input-row button {
  background: #ff0055;
  color: #fff;
  border: 3px solid #000;
  box-shadow: 3px 3px 0px #000;
  font-weight: 800;
  padding: 0 1.2rem;
  cursor: pointer;
}

/* ===================================================
   MODEL 2: KOMPUTER JADUL DOS (DARK)
   =================================================== */
.terminal-container {
  background: #000;
  border: 4px solid #fff;
  box-shadow: 8px 8px 0px #fff;
  color: #00ff66;
}

.terminal-bar {
  background: #222;
  border-bottom: 2px solid #fff;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.term-title {
  color: #fff;
  font-size: 0.7rem;
  margin-left: auto;
  font-weight: bold;
}

.terminal-screen {
  height: 320px;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 0.85rem;
}

.term-banner {
  color: #00f3ff;
  border-bottom: 1px dashed #00ff66;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.term-msg {
  white-space: pre-wrap;
}

.term-msg.user .text { color: #fff; }

.terminal-input-row {
  display: flex;
  align-items: center;
  background: #111;
  border-top: 2px solid #fff;
  padding: 0.5rem;
  gap: 0.5rem;
}

.prompt-symbol { color: #00ff66; font-weight: bold; }

.terminal-input-row input {
  flex: 1;
  background: transparent;
  border: none;
  color: #00ff66;
  font-family: inherit;
  outline: none;
}

.terminal-input-row button {
  background: #00ff66;
  color: #000;
  border: 2px solid #fff;
  font-weight: bold;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
}

/* ===================================================
   MODEL 3: SMARTPHONE CYBERPUNK (CYBER)
   =================================================== */
.cyber-phone {
  background: #0d0221;
  border: 5px solid #00f3ff;
  border-radius: 24px;
  box-shadow: 8px 8px 0px #ff0055;
  padding: 1rem 0.8rem;
  max-width: 420px;
  margin: 0 auto;
}

.phone-notch {
  width: 100px;
  height: 12px;
  background: #00f3ff;
  margin: 0 auto 0.5rem auto;
  border-radius: 10px;
}

.phone-screen {
  background: #150538;
  border: 2px solid #ff0055;
  border-radius: 12px;
  padding: 0.8rem;
}

.phone-status-bar {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #ffe600;
  margin-bottom: 0.8rem;
}

.cyber-chat-body {
  height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.cyber-bubble {
  max-width: 80%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
}

.cyber-bubble.user {
  align-self: flex-end;
  background: #ff0055;
  color: #fff;
  border: 2px solid #ffe600;
}

.cyber-bubble.ai {
  align-self: flex-start;
  background: #00f3ff;
  color: #000;
  border: 2px solid #ff0055;
  font-weight: bold;
}

.sender-tag {
  font-size: 0.6rem;
  opacity: 0.8;
  margin-bottom: 0.2rem;
}

.cyber-bubble p { 
  margin: 0; 
  white-space: pre-wrap;
}

.cyber-input-area {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.8rem;
}

.cyber-input-area input {
  flex: 1;
  padding: 0.6rem;
  border: 2px solid #00f3ff;
  background: #000;
  color: #ffe600;
  font-family: inherit;
  font-size: 0.75rem;
}

.cyber-input-area button {
  background: #ffe600;
  color: #000;
  border: 2px solid #ff0055;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 0 0.8rem;
  cursor: pointer;
}
</style>