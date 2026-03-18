// Audio manager for event-triggered guitar chord sounds
// Uses epic guitar chords from Andrew Chellman's sample pack

const GUITAR_CHORDS = [
  '01', '02', '03', '04', '05', '06', '07', '08',
  '09', '10', '11', '12', '13', '14', '15', '16'
]

interface AudioContext {
  audio: HTMLAudioElement
  isPlaying: boolean
}

interface AudioManagerState {
  enabled: boolean
  audioContexts: AudioContext[]
}

const state: AudioManagerState = {
  enabled: false, // muted by default
  audioContexts: [],
}

function getRandomChord(): string {
  const chord = GUITAR_CHORDS[Math.floor(Math.random() * GUITAR_CHORDS.length)]
  return `/chords/chord_${chord}.wav`
}

function fadeOutAndStop(audio: HTMLAudioElement, ctx: AudioContext, durationMs: number = 300) {
  const startVolume = audio.volume
  const startTime = Date.now()

  const fadeInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    audio.volume = startVolume * (1 - progress)

    if (progress >= 1) {
      clearInterval(fadeInterval)
      audio.pause()
      audio.volume = startVolume
      ctx.isPlaying = false
    }
  }, 16) // ~60fps
}

export function initAudio() {
  // Load saved preference from localStorage
  const saved = localStorage.getItem('claude-live-audio-enabled')
  if (saved !== null) {
    state.enabled = saved === 'true'
  }

  // Pre-load multiple audio elements for true polyphony (16 concurrent sounds)
  for (let i = 0; i < 16; i++) {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audio.volume = 0.4

    // Track when audio finishes playing and fade out
    audio.addEventListener('ended', () => {
      const ctx = state.audioContexts.find(c => c.audio === audio)
      if (ctx) fadeOutAndStop(audio, ctx)
    })

    state.audioContexts.push({ audio, isPlaying: false })
  }
}

export function playChord() {
  if (!state.enabled) return

  // Find first available audio element (not currently playing)
  let selected: AudioContext | null = null
  for (const context of state.audioContexts) {
    if (!context.isPlaying) {
      selected = context
      break
    }
  }

  // If no idle channels, skip (don't play multiple per event)
  if (!selected) {
    return
  }

  const chord = getRandomChord()
  selected.audio.src = chord
  selected.audio.currentTime = 0
  selected.isPlaying = true

  // Auto-fade out and mark as idle after audio duration + buffer (ensures 'ended' event isn't needed)
  setTimeout(() => {
    fadeOutAndStop(selected!.audio, selected!, 300)
  }, 2700)

  selected.audio.play().catch((err) => {
    fadeOutAndStop(selected!.audio, selected!, 0)
    console.debug('[audio] playback failed:', err.message)
  })
}

export function setAudioEnabled(enabled: boolean) {
  state.enabled = enabled
  // Persist to localStorage
  localStorage.setItem('claude-live-audio-enabled', enabled ? 'true' : 'false')
}

export function isAudioEnabled(): boolean {
  return state.enabled
}
