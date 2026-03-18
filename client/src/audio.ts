// Audio manager for event-triggered chord sounds

const CHORD_THEMES = [
  'Auto', 'Butterflies', 'Chardonnay', 'Cloudy', 'Cozy', 'Dreamy',
  'Enchanted', 'Epic', 'Fantasy', 'Glowing', 'Golden', 'Heavenly',
  'Intense', 'Magical', 'Mystical', 'Old Tape', 'Perfume', 'Pixie',
  'Sparkle', 'Tropical', 'Vintage', 'Wishing Well'
]

interface AudioManagerState {
  enabled: boolean
  audioContexts: Map<string, { audio: HTMLAudioElement; lastPlay: number }>
}

const state: AudioManagerState = {
  enabled: false, // muted by default
  audioContexts: new Map(),
}

function getRandomChord(): string {
  const theme = CHORD_THEMES[Math.floor(Math.random() * CHORD_THEMES.length)]
  const variant = Math.floor(Math.random() * 8) + 1
  // Format: "Auto 001.wav" not "Auto_001.wav"
  return `/chords/${theme} ${String(variant).padStart(3, '0')}.wav`
}

export function initAudio() {
  // Pre-load a few audio elements for polyphony
  for (let i = 0; i < 6; i++) {
    const audio = new Audio()
    audio.preload = 'auto'
    state.audioContexts.set(`pool-${i}`, { audio, lastPlay: 0 })
  }
}

export function playChord() {
  if (!state.enabled) return

  const now = Date.now()
  // Find least recently played audio element
  let selected: { key: string; context: any } | null = null
  let oldest = Infinity

  for (const [key, context] of state.audioContexts) {
    if (now - context.lastPlay > 200 && context.lastPlay < oldest) {
      oldest = context.lastPlay
      selected = { key, context }
    }
  }

  if (!selected) return

  const chord = getRandomChord()
  selected.context.audio.src = chord
  selected.context.audio.currentTime = 0
  selected.context.audio.volume = 0.3
  selected.context.audio.play().catch(() => {}) // ignore autoplay errors
  selected.context.lastPlay = now
}

export function setAudioEnabled(enabled: boolean) {
  state.enabled = enabled
}

export function isAudioEnabled(): boolean {
  return state.enabled
}
