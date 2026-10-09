export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Ambil message dari req.body (Gunakan req.body secara langsung)
    const { message } = req.body || {}

    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' })
    }

    // Mengambil API Key dari file .env (GROQ_API_KEY)
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY belum dikonfigurasi di server.' })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'whisper-large-v3',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten AI retro-futuristik yang ramah dan siap membantu pengguna di portal web CANCRY.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq API Error:', data)
      return res.status(500).json({ error: data.error?.message || 'Gagal memproses ke Groq API.' })
    }

    const reply = data.choices?.[0]?.message?.content || 'Maaf, Groq tidak memberikan respon.'

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Error serverless chat:', error)
    return res.status(500).json({ error: 'Gagal menghubungkan ke server AI.' })
  }
}