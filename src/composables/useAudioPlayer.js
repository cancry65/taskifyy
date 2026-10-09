import { ref, computed } from 'vue'

const playlist = ref([
  {
    title: 'No other heart',
    artist: 'MacDeMarco',
    youtubeId: 'lPeJMoms_Ag'
  }
])

const selectedTrackIndex = ref(0)
const isPlaying = ref(false)

const currentTrack = computed(() => {
  return playlist.value[selectedTrackIndex.value] || { title: 'Unknown Track', artist: 'YouTube' }
})

const activeYoutubeId = computed(() => {
  return playlist.value[selectedTrackIndex.value]?.youtubeId || ''
})

const embedUrl = computed(() => {
  const autoplayParam = isPlaying.value ? 1 : 0
  return `https://www.youtube.com/embed/${activeYoutubeId.value}?enablejsapi=1&autoplay=${autoplayParam}&loop=1`
})

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const changeTrack = () => {
  isPlaying.value = false // Berhenti saat ganti lagu, harus dipencet Play manual
}

const nextTrack = () => {
  selectedTrackIndex.value = (selectedTrackIndex.value + 1) % playlist.value.length
  changeTrack()
}

const prevTrack = () => {
  selectedTrackIndex.value =
    (selectedTrackIndex.value - 1 + playlist.value.length) % playlist.value.length
  changeTrack()
}

const addCustomTrack = (url, title, artist) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    const extractedId = match[2]
    const trackTitle = title.trim() || 'Custom Track ' + (playlist.value.length + 1)
    const trackArtist = artist.trim() || 'YouTube Music'

    playlist.value.push({
      title: trackTitle,
      artist: trackArtist,
      youtubeId: extractedId
    })

    selectedTrackIndex.value = playlist.value.length - 1
    changeTrack()
    return true
  }
  return false
}

export function useAudioPlayer() {
  return {
    playlist,
    selectedTrackIndex,
    isPlaying,
    currentTrack,
    embedUrl,
    togglePlay,
    nextTrack,
    prevTrack,
    addCustomTrack
  }
}