// Audio manager for event-triggered piano key sounds
// Uses individual notes from the Dusty Keys Sample Pack (middle to upper register)

const PIANO_NOTES = [
  'c4', 'c5', 'c6',
  'd4', 'd5', 'd6',
  'e4', 'e5', 'e6',
  'f4', 'f5', 'f6',
  'g4', 'g5', 'g6',
  'a4', 'a5', 'a6',
  'b4', 'b5', 'b6'
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

function getRandomNote(): string {
  const note = PIANO_NOTES[Math.floor(Math.random() * PIANO_NOTES.length)]
  return `/chords/${note}.wav`
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

    // Track when audio finishes playing
    audio.addEventListener('ended', () => {
      const ctx = state.audioContexts.find(c => c.audio === audio)
      if (ctx) ctx.isPlaying = false
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

  if (!selected) {
    // All channels busy - find one that will finish soonest and reuse it
    // For now, just pick the first one (will interrupt)
    selected = state.audioContexts[0]
  }

  const note = getRandomNote()
  selected.audio.src = note
  selected.audio.currentTime = 0
  selected.isPlaying = true

  selected.audio.play().catch((err) => {
    selected!.isPlaying = false
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
